/**
 * routes/comment.js  (Supabase version)
 * POST   /api/comment
 * GET    /api/comment
 * DELETE /api/comment/:id
 */
const express    = require('express');
const router     = express.Router();
const aiService  = require('../services/ai');
const supabase   = require('../services/supabase');

// ── POST /api/comment ─────────────────────────────────────────
router.post('/', async (req, res) => {
  const { text, author, gender, rating, sessionId } = req.body;
  if (!text || !sessionId)
    return res.status(400).json({ error: 'text and sessionId required' });

  // Sentiment analysis (fallback neutral)
  let sentiment = 'neutral';
  try {
    const r = await aiService.analyzeSentiment(text);
    sentiment = r.sentiment;
  } catch {}

  const { data, error } = await supabase
    .from('comments')
    .insert({
      text,
      author:    author || 'Anonymous',
      gender:    gender || 'unspecified',
      rating:    rating ? Number(rating) : null,
      session_id: sessionId,
      sentiment,
    })
    .select().single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({
    id:        data.id,
    text:      data.text,
    author:    data.author,
    gender:    data.gender,
    rating:    data.rating,
    sessionId: data.session_id,
    sentiment: data.sentiment,
    timestamp: data.created_at,
  });
});

// ── GET /api/comment ──────────────────────────────────────────
router.get('/', async (_req, res) => {
  const { data, count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const comments = (data || []).map(c => ({
    id:        c.id,
    text:      c.text,
    author:    c.author,
    gender:    c.gender,
    rating:    c.rating,
    sessionId: c.session_id,
    sentiment: c.sentiment,
    timestamp: c.created_at,
  }));

  // Build summaries
  const sentimentSummary = { positive: 0, neutral: 0, negative: 0 };
  const genderSummary    = { male: 0, female: 0, nonbinary: 0, unspecified: 0 };
  const ratingCounts     = { 1:0, 2:0, 3:0, 4:0, 5:0 };
  let ratingSum = 0, ratingCount = 0;

  comments.forEach(c => {
    sentimentSummary[c.sentiment] = (sentimentSummary[c.sentiment] || 0) + 1;
    genderSummary[c.gender]       = (genderSummary[c.gender]       || 0) + 1;
    if (c.rating) {
      ratingCounts[c.rating] = (ratingCounts[c.rating] || 0) + 1;
      ratingSum   += c.rating;
      ratingCount += 1;
    }
  });

  res.json({
    total: count || 0,
    comments,
    sentimentSummary,
    genderSummary,
    ratingSummary: {
      counts:  ratingCounts,
      average: ratingCount ? Math.round(ratingSum / ratingCount * 10) / 10 : null,
      total:   ratingCount,
    },
  });
});

// ── DELETE /api/comment/:id ───────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('comments').delete().eq('id', req.params.id);
  if (error) return res.status(404).json({ error: error.message });
  res.json({ status: 'deleted' });
});

module.exports = router;
