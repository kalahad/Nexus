/**
 * routes/comment.js
 * Comment API — รองรับ name, gender, rating, text, sentiment
 *
 * POST /api/comment         — submit comment
 * GET  /api/comment         — list all + analytics summary
 * DELETE /api/comment/:id   — delete (admin)
 */
const express = require('express');
const router  = express.Router();
const { v4: uuidv4 } = require('uuid');
const aiService    = require('../services/ai');
const sheetsService = require('../services/sheets');

const comments = [];

// ── POST /api/comment ──────────────────────────────────────────
router.post('/', async (req, res) => {
  const { text, author, gender, rating, sessionId } = req.body;
  if (!text || !sessionId)
    return res.status(400).json({ error: 'text and sessionId required' });

  // Sentiment (non-blocking, fallback neutral)
  let sentiment = 'neutral';
  try {
    const r = await aiService.analyzeSentiment(text);
    sentiment = r.sentiment;
  } catch (err) {
    console.warn('[Sentiment fallback]', err.message);
  }

  const comment = {
    id:        uuidv4(),
    text,
    author:    author  || 'Anonymous',
    gender:    gender  || 'unspecified',   // 'male' | 'female' | 'nonbinary' | 'unspecified'
    rating:    rating  ? Number(rating) : null,   // 1–5
    sessionId,
    sentiment,
    timestamp: new Date().toISOString(),
  };
  comments.push(comment);

  // Sheets (non-blocking)
  sheetsService
    .appendRow('Comments', [
      comment.id, comment.author, comment.gender,
      comment.rating ?? '', comment.text,
      comment.sentiment, comment.timestamp,
    ])
    .catch(e => console.error('[Sheets comment]', e.message));

  const summary = buildSummary();
  req.io.emit('comment_update', {
    comment,
    total: comments.length,
    sentimentSummary: summary.sentimentSummary,
    genderSummary:    summary.genderSummary,
    ratingSummary:    summary.ratingSummary,
  });

  res.status(201).json(comment);
});

// ── GET /api/comment ───────────────────────────────────────────
router.get('/', (_req, res) => {
  const summary = buildSummary();
  res.json({
    total: comments.length,
    comments,
    ...summary,
  });
});

// ── DELETE /api/comment/:id ────────────────────────────────────
router.delete('/:id', (req, res) => {
  const idx = comments.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Comment not found' });
  comments.splice(idx, 1);
  req.io.emit('comment_update', {
    deleted: req.params.id,
    total: comments.length,
    ...buildSummary(),
  });
  res.json({ status: 'deleted' });
});

// ── Helpers ────────────────────────────────────────────────────
function buildSummary() {
  const sentimentSummary = { positive: 0, neutral: 0, negative: 0 };
  const genderSummary    = { male: 0, female: 0, nonbinary: 0, unspecified: 0 };
  const ratingCounts     = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
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

  return {
    sentimentSummary,
    genderSummary,
    ratingSummary: {
      counts:  ratingCounts,
      average: ratingCount ? Math.round((ratingSum / ratingCount) * 10) / 10 : null,
      total:   ratingCount,
    },
  };
}

module.exports = router;
module.exports.getStats = () => ({
  total:    comments.length,
  positive: comments.filter(c => c.sentiment === 'positive').length,
});
