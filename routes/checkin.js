/**
 * routes/checkin.js
 * QR Check-in API
 *
 * POST /api/checkin        — participant checks in with sessionId + name
 * GET  /api/checkin        — list all check-ins (admin)
 * GET  /api/checkin/qr     — generate QR code data URL for the check-in URL
 */
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const sheetsService = require('../services/sheets');

// In-memory store (mirrors Sheets as cache)
const checkins = new Map(); // sessionId -> { name, timestamp }

// GET /api/checkin/qr — generate QR
router.get('/qr', async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/index.html`;
    const dataUrl = await QRCode.toDataURL(url, { width: 300 });
    res.json({ qr: dataUrl, url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/checkin
router.post('/', async (req, res) => {
  const { name, sessionId } = req.body;
  if (!name || !sessionId) {
    return res.status(400).json({ error: 'name and sessionId are required' });
  }

  if (checkins.has(sessionId)) {
    return res.json({ status: 'already_checked_in', sessionId });
  }

  const entry = { sessionId, name, timestamp: new Date().toISOString() };
  checkins.set(sessionId, entry);

  // Persist to Google Sheets (non-blocking)
  sheetsService
    .appendRow('Checkins', [sessionId, name, entry.timestamp])
    .catch((err) => console.error('[Sheets checkin]', err.message));

  req.io.emit('checkin_update', {
    total: checkins.size,
    latest: entry,
  });

  res.json({ status: 'ok', sessionId, total: checkins.size });
});

// GET /api/checkin
router.get('/', (_req, res) => {
  res.json({
    total: checkins.size,
    checkins: Array.from(checkins.values()),
  });
});

module.exports = router;
module.exports.checkins = checkins;
