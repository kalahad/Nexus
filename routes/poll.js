/**
 * routes/poll.js  (Supabase version)
 * POST   /api/poll
 * GET    /api/poll
 * GET    /api/poll/:id
 * POST   /api/poll/:id/vote
 * POST   /api/poll/:id/answer
 * POST   /api/poll/:id/rate
 * GET    /api/poll/:id/wordcloud
 * PATCH  /api/poll/:id/visibility
 * PATCH  /api/poll/:id/active
 * DELETE /api/poll/:id
 */
const express  = require('express');
const router   = express.Router();
const supabase = require('../services/supabase');
const { getCurrentEventId } = require('../services/event');

// ── Helpers ──────────────────────────────────────────────────

function buildPollData(poll, responses = []) {
  const voters    = new Set(responses.map(r => r.session_id));
  const base = {
    id:          poll.id,
    question:    poll.question,
    type:        poll.type,
    active:      poll.active,
    showResults: poll.show_results,
    createdAt:   poll.created_at,
    voterCount:  voters.size,
    totalVotes:  responses.length,
  };

  if (poll.type === 'choice') {
    const opts = poll.options || [];
    const voteCounts = {};
    responses.forEach(r => {
      if (r.option_index !== null && r.option_index !== undefined)
        voteCounts[r.option_index] = (voteCounts[r.option_index] || 0) + 1;
    });
    base.options    = opts.map((o, i) => ({ text: o.text || o, votes: voteCounts[i] || 0 }));
    base.totalVotes = responses.length;

  } else if (poll.type === 'text') {
    base.answers    = responses.filter(r => r.answer).map(r => r.answer);
    base.totalVotes = base.answers.length;

  } else if (poll.type === 'rating') {
    const rc = { 1:0, 2:0, 3:0, 4:0, 5:0 };
    let sum = 0;
    responses.forEach(r => {
      if (r.rating) { rc[r.rating] = (rc[r.rating]||0)+1; sum += r.rating; }
    });
    base.ratingCounts = rc;
    base.totalVotes   = responses.length;
    base.average      = responses.length ? Math.round(sum/responses.length*10)/10 : null;
  }
  return base;
}

function wordFreq(answers) {
  const stop = new Set(['และ','ที่','ใน','ของ','การ','มี','ได้','จาก','ให้','เป็น','กับ','แต่','ไม่','นี้','จะ','คือ','ว่า','โดย','หรือ','ซึ่ง','แล้ว','ก็','ด้วย','the','a','an','and','or','of','in','on','at','to','for','is','are','was','with','that','this','it','be','as','by','from','but','not']);
  const freq = {};
  answers.forEach(a => {
    a.toLowerCase().split(/[\s,.\-()[\]/\\|!?;:""'']+/)
      .filter(w => w.length > 1 && !stop.has(w))
      .forEach(w => { freq[w] = (freq[w]||0)+1; });
  });
  return Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,60).map(([word,count])=>({word,count}));
}

async function getFullPoll(id) {
  const [{ data: poll }, { data: responses }] = await Promise.all([
    supabase.from('polls').select('*').eq('id', id).maybeSingle(),
    supabase.from('poll_responses').select('*').eq('poll_id', id),
  ]);
  if (!poll) return null;
  return buildPollData(poll, responses || []);
}

// ── POST /api/poll ────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { question, type = 'choice', options = [] } = req.body;
  if (!question) return res.status(400).json({ error: 'question required' });
  if (type === 'choice' && options.length < 2)
    return res.status(400).json({ error: 'need ≥2 options' });

  const eventId = await getCurrentEventId();
  const opts = type === 'choice' ? options.map(t => ({ text: t })) : [];
  const { data, error } = await supabase
    .from('polls')
    .insert({ question, type, options: opts, event_id: eventId })
    .select().single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(buildPollData(data, []));
});

// ── GET /api/poll ─────────────────────────────────────────────
router.get('/', async (_req, res) => {
  const eventId = await getCurrentEventId();
  const [{ data: polls }, { data: allResponses }] = await Promise.all([
    supabase.from('polls').select('*').eq('event_id', eventId).order('created_at'),
    supabase.from('poll_responses').select('*'),
  ]);
  if (!polls) return res.json([]);

  const byPoll = {};
  (allResponses || []).forEach(r => {
    (byPoll[r.poll_id] = byPoll[r.poll_id] || []).push(r);
  });

  res.json(polls.map(p => buildPollData(p, byPoll[p.id] || [])));
});

// ── GET /api/poll/:id ─────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const poll = await getFullPoll(req.params.id);
  if (!poll) return res.status(404).json({ error: 'not found' });
  res.json(poll);
});

// ── POST /api/poll/:id/vote ───────────────────────────────────
router.post('/:id/vote', async (req, res) => {
  const { sessionId, optionIndex } = req.body;
  const { data: p } = await supabase.from('polls').select('*').eq('id', req.params.id).maybeSingle();
  if (!p)                  return res.status(404).json({ error: 'not found' });
  if (!p.active)           return res.status(400).json({ error: 'poll closed' });
  if (p.type !== 'choice') return res.status(400).json({ error: 'use /answer or /rate' });

  const { data: dup } = await supabase.from('poll_responses')
    .select('id').eq('poll_id', req.params.id).eq('session_id', sessionId).maybeSingle();
  if (dup) return res.status(409).json({ error: 'already voted' });

  await supabase.from('poll_responses')
    .insert({ poll_id: req.params.id, session_id: sessionId, option_index: optionIndex });

  res.json(await getFullPoll(req.params.id));
});

// ── POST /api/poll/:id/answer ─────────────────────────────────
router.post('/:id/answer', async (req, res) => {
  const { sessionId, answer } = req.body;
  const { data: p } = await supabase.from('polls').select('*').eq('id', req.params.id).maybeSingle();
  if (!p)                return res.status(404).json({ error: 'not found' });
  if (!p.active)         return res.status(400).json({ error: 'poll closed' });
  if (p.type !== 'text') return res.status(400).json({ error: 'use /vote or /rate' });

  const { data: dup } = await supabase.from('poll_responses')
    .select('id').eq('poll_id', req.params.id).eq('session_id', sessionId).maybeSingle();
  if (dup) return res.status(409).json({ error: 'already answered' });

  await supabase.from('poll_responses')
    .insert({ poll_id: req.params.id, session_id: sessionId, answer: answer.trim() });

  res.json(await getFullPoll(req.params.id));
});

// ── POST /api/poll/:id/rate ───────────────────────────────────
router.post('/:id/rate', async (req, res) => {
  const { sessionId, rating } = req.body;
  const r = Number(rating);
  const { data: p } = await supabase.from('polls').select('*').eq('id', req.params.id).maybeSingle();
  if (!p)                  return res.status(404).json({ error: 'not found' });
  if (!p.active)           return res.status(400).json({ error: 'poll closed' });
  if (p.type !== 'rating') return res.status(400).json({ error: 'use /vote or /answer' });
  if (r < 1 || r > 5)     return res.status(400).json({ error: 'rating must be 1-5' });

  const { data: dup } = await supabase.from('poll_responses')
    .select('id').eq('poll_id', req.params.id).eq('session_id', sessionId).maybeSingle();
  if (dup) return res.status(409).json({ error: 'already rated' });

  await supabase.from('poll_responses')
    .insert({ poll_id: req.params.id, session_id: sessionId, rating: r });

  res.json(await getFullPoll(req.params.id));
});

// ── GET /api/poll/:id/wordcloud ───────────────────────────────
router.get('/:id/wordcloud', async (req, res) => {
  const { data: responses } = await supabase
    .from('poll_responses').select('answer')
    .eq('poll_id', req.params.id).not('answer', 'is', null);
  const answers = (responses || []).map(r => r.answer).filter(Boolean);
  res.json({ pollId: req.params.id, words: wordFreq(answers) });
});

// ── PATCH /api/poll/:id/visibility ───────────────────────────
router.patch('/:id/visibility', async (req, res) => {
  const { error } = await supabase.from('polls')
    .update({ show_results: !!req.body.showResults }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(await getFullPoll(req.params.id));
});

// ── PATCH /api/poll/:id/active ────────────────────────────────
router.patch('/:id/active', async (req, res) => {
  const { error } = await supabase.from('polls')
    .update({ active: !!req.body.active }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(await getFullPoll(req.params.id));
});

// ── DELETE /api/poll/:id ──────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('polls').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ status: 'deleted' });
});

module.exports = router;
