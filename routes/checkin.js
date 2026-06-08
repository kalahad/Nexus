/**
 * routes/checkin.js  (Supabase version)
 * POST /api/checkin       — check in
 * GET  /api/checkin       — list all
 * GET  /api/checkin/qr    — QR code
 */
const express  = require('express');
const router   = express.Router();
const QRCode   = require('qrcode');
const supabase = require('../services/supabase');
const { getCurrentEventId } = require('../services/event');

// GET /api/checkin/qr
router.get('/qr', async (req, res) => {
  try {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const url     = `${baseUrl}/`;
    const dataUrl = await QRCode.toDataURL(url, { width: 300 });
    res.json({ qr: dataUrl, url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/checkin
router.post('/', async (req, res) => {
  const { name, sessionId } = req.body;
  if (!name || !sessionId)
    return res.status(400).json({ error: 'name and sessionId required' });

  const eventId = await getCurrentEventId();

  // Already checked in for this event?
  const { data: existing } = await supabase
    .from('checkins').select('id')
    .eq('session_id', sessionId).eq('event_id', eventId).maybeSingle();
  if (existing)
    return res.json({ status: 'already_checked_in', sessionId });

  const { error } = await supabase
    .from('checkins').insert({ session_id: sessionId, name, event_id: eventId });
  if (error)
    return res.status(500).json({ error: error.message });

  const { count } = await supabase
    .from('checkins').select('*', { count: 'exact', head: true }).eq('event_id', eventId);

  res.json({ status: 'ok', sessionId, total: count || 0 });
});

// GET /api/checkin
router.get('/', async (req, res) => {
  const eventId = req.query.event_id || await getCurrentEventId();
  const { data, count, error } = await supabase
    .from('checkins')
    .select('*', { count: 'exact' })
    .eq('event_id', eventId)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  res.json({
    total: count || 0,
    checkins: (data || []).map(c => ({
      sessionId:  c.session_id,
      name:       c.name,
      timestamp:  c.created_at,
    })),
  });
});

module.exports = router;
