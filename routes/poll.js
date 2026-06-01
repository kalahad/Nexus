/**
 * routes/poll.js
 * Poll CRUD — 3 types:
 *   'choice'  — multiple choice buttons
 *   'text'    — free-text answer → word cloud
 *   'rating'  — 1–5 star rating poll
 *
 * POST   /api/poll                  create
 * GET    /api/poll                  list all
 * GET    /api/poll/:id              single poll
 * POST   /api/poll/:id/vote         choice vote
 * POST   /api/poll/:id/answer       text answer
 * POST   /api/poll/:id/rate         star rating
 * GET    /api/poll/:id/wordcloud    word freq (text polls)
 * PATCH  /api/poll/:id/visibility   { showResults: bool }
 * PATCH  /api/poll/:id/active       { active: bool }
 * DELETE /api/poll/:id              delete
 */
const express = require('express');
const router  = express.Router();
const { v4: uuidv4 } = require('uuid');
const sheets  = require('../services/sheets');

const polls = new Map();

// ─── helpers ──────────────────────────────────────────────────
function sanitize(p) {
  const base = {
    id:           p.id,
    question:     p.question,
    type:         p.type,
    active:       p.active,
    showResults:  p.showResults,
    createdAt:    p.createdAt,
    voterCount:   p.voters.size,
    totalVotes:   0,
  };
  if (p.type === 'choice') {
    base.options   = p.options;
    base.totalVotes = p.options.reduce((s, o) => s + o.votes, 0);
  } else if (p.type === 'text') {
    base.answers   = p.answers;
    base.totalVotes = p.answers.length;
  } else if (p.type === 'rating') {
    base.ratingCounts = p.ratingCounts;
    base.totalVotes   = Object.values(p.ratingCounts).reduce((s, v) => s + v, 0);
    const sum = Object.entries(p.ratingCounts).reduce((s, [k, v]) => s + Number(k) * v, 0);
    base.average = base.totalVotes ? Math.round(sum / base.totalVotes * 10) / 10 : null;
  }
  return base;
}

function wordFreq(answers) {
  const stop = new Set(['และ','ที่','ใน','ของ','การ','มี','ได้','จาก','ให้','เป็น','กับ','แต่','ไม่','นี้','จะ','คือ','ว่า','โดย','หรือ','ซึ่ง','แล้ว','ก็','ด้วย','the','a','an','and','or','of','in','on','at','to','for','is','are','was','with','that','this','it','be','as','by','from','but','not']);
  const freq = {};
  answers.forEach(a => {
    a.toLowerCase().split(/[\s,.\-()[\]/\\|!?;:""'']+/).filter(w => w.length > 1 && !stop.has(w))
      .forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  });
  return Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,60).map(([word,count]) => ({word,count}));
}

// ─── POST /api/poll ────────────────────────────────────────────
router.post('/', (req, res) => {
  const { question, type = 'choice', options = [] } = req.body;
  if (!question) return res.status(400).json({ error: 'question required' });
  if (type === 'choice' && options.length < 2) return res.status(400).json({ error: 'need ≥2 options' });

  const poll = {
    id: uuidv4(), question, type,
    options:      type === 'choice' ? options.map(t => ({ text: t, votes: 0 })) : [],
    answers:      [],
    ratingCounts: { 1:0, 2:0, 3:0, 4:0, 5:0 },
    voters:       new Set(),
    active:       true,
    showResults:  false,
    createdAt:    new Date().toISOString(),
  };
  polls.set(poll.id, poll);
  req.io.emit('poll_update', sanitize(poll));
  res.status(201).json(sanitize(poll));
});

// ─── GET /api/poll ─────────────────────────────────────────────
router.get('/', (_req, res) => res.json([...polls.values()].map(sanitize)));

// ─── GET /api/poll/:id ─────────────────────────────────────────
router.get('/:id', (req, res) => {
  const p = polls.get(req.params.id);
  if (!p) return res.status(404).json({ error: 'not found' });
  res.json(sanitize(p));
});

// ─── POST /api/poll/:id/vote (choice) ─────────────────────────
router.post('/:id/vote', async (req, res) => {
  const { sessionId, optionIndex } = req.body;
  const p = polls.get(req.params.id);
  if (!p)                    return res.status(404).json({ error: 'not found' });
  if (!p.active)             return res.status(400).json({ error: 'poll closed' });
  if (p.type !== 'choice')   return res.status(400).json({ error: 'use /answer or /rate' });
  if (p.voters.has(sessionId)) return res.status(409).json({ error: 'already voted' });
  if (optionIndex < 0 || optionIndex >= p.options.length) return res.status(400).json({ error: 'invalid option' });

  p.options[optionIndex].votes++;
  p.voters.add(sessionId);
  sheets.appendRow('Votes', [p.id, p.question, p.options[optionIndex].text, sessionId, new Date().toISOString()]).catch(()=>{});
  const s = sanitize(p);
  req.io.emit('poll_update', s);
  res.json(s);
});

// ─── POST /api/poll/:id/answer (text) ─────────────────────────
router.post('/:id/answer', async (req, res) => {
  const { sessionId, answer } = req.body;
  const p = polls.get(req.params.id);
  if (!p)                  return res.status(404).json({ error: 'not found' });
  if (!p.active)           return res.status(400).json({ error: 'poll closed' });
  if (p.type !== 'text')   return res.status(400).json({ error: 'use /vote or /rate' });
  if (p.voters.has(sessionId)) return res.status(409).json({ error: 'already answered' });

  p.answers.push(answer.trim());
  p.voters.add(sessionId);
  sheets.appendRow('Answers', [p.id, p.question, answer, sessionId, new Date().toISOString()]).catch(()=>{});
  const s = sanitize(p);
  req.io.emit('poll_update', { ...s, wordcloud: wordFreq(p.answers) });
  res.json(s);
});

// ─── POST /api/poll/:id/rate (rating) ─────────────────────────
router.post('/:id/rate', async (req, res) => {
  const { sessionId, rating } = req.body;
  const r = Number(rating);
  const p = polls.get(req.params.id);
  if (!p)                   return res.status(404).json({ error: 'not found' });
  if (!p.active)            return res.status(400).json({ error: 'poll closed' });
  if (p.type !== 'rating')  return res.status(400).json({ error: 'use /vote or /answer' });
  if (p.voters.has(sessionId)) return res.status(409).json({ error: 'already rated' });
  if (r < 1 || r > 5)      return res.status(400).json({ error: 'rating must be 1–5' });

  p.ratingCounts[r]++;
  p.voters.add(sessionId);
  sheets.appendRow('Votes', [p.id, p.question, `rating:${r}`, sessionId, new Date().toISOString()]).catch(()=>{});
  const s = sanitize(p);
  req.io.emit('poll_update', s);
  res.json(s);
});

// ─── GET /api/poll/:id/wordcloud ───────────────────────────────
router.get('/:id/wordcloud', (req, res) => {
  const p = polls.get(req.params.id);
  if (!p) return res.status(404).json({ error: 'not found' });
  res.json({ pollId: p.id, words: wordFreq(p.answers) });
});

// ─── PATCH /api/poll/:id/visibility ───────────────────────────
router.patch('/:id/visibility', (req, res) => {
  const p = polls.get(req.params.id);
  if (!p) return res.status(404).json({ error: 'not found' });
  p.showResults = !!req.body.showResults;
  const s = sanitize(p);
  req.io.emit('poll_update', s);
  // Separate event so participant page can react immediately
  req.io.emit('poll_visibility', { pollId: p.id, showResults: p.showResults });
  res.json(s);
});

// ─── PATCH /api/poll/:id/active ───────────────────────────────
router.patch('/:id/active', (req, res) => {
  const p = polls.get(req.params.id);
  if (!p) return res.status(404).json({ error: 'not found' });
  p.active = !!req.body.active;
  const s = sanitize(p);
  req.io.emit('poll_update', s);
  res.json(s);
});

// ─── DELETE /api/poll/:id ──────────────────────────────────────
router.delete('/:id', (req, res) => {
  if (!polls.has(req.params.id)) return res.status(404).json({ error: 'not found' });
  polls.delete(req.params.id);
  req.io.emit('poll_update', { deleted: req.params.id });
  res.json({ status: 'deleted' });
});

// Export polls map for CSV
module.exports = router;
module.exports.polls = polls;
module.exports.sanitize = sanitize;
