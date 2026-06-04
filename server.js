require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const checkinRoutes = require('./routes/checkin');
const pollRoutes    = require('./routes/poll');
const commentRoutes = require('./routes/comment');
const aiService     = require('./services/ai');
const supabase      = require('./services/supabase');
const { getCurrentEventId, getCurrentEvent } = require('./services/event');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/checkin', checkinRoutes);
app.use('/api/poll',    pollRoutes);
app.use('/api/comment', commentRoutes);

// ── Event Management ─────────────────────────────────────────

// GET /api/event/current — event ที่ active อยู่ตอนนี้
app.get('/api/event/current', async (_req, res) => {
  try {
    const event = await getCurrentEvent();
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/event/new — สร้าง event ใหม่ + เซต current_event_id
app.post('/api/event/new', async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim())
    return res.status(400).json({ error: 'name required' });

  // สร้าง ID จาก timestamp
  const id = 'evt_' + Date.now();

  const { error: insertErr } = await supabase
    .from('events')
    .insert({ id, name: name.trim() });
  if (insertErr) return res.status(500).json({ error: insertErr.message });

  // อัปเดต current_event_id
  await supabase
    .from('settings')
    .upsert({ key: 'current_event_id', value: id }, { onConflict: 'key' });

  res.json({ id, name: name.trim() });
});

// ── Config (public keys for frontend) ───────────────────────
app.get('/api/config', (_req, res) => {
  res.json({
    supabaseUrl:     process.env.SUPABASE_URL     || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  });
});

// ── AI Summary ───────────────────────────────────────────────
app.post('/api/ai/summary', async (req, res) => {
  try {
    const { comments } = req.body;
    if (!Array.isArray(comments) || !comments.length)
      return res.status(400).json({ error: 'comments array required' });

    const result   = await aiService.generateSummary(comments);
    const eventId  = await getCurrentEventId();

    // Map camelCase → snake_case for Supabase columns
    const dbRecord = {
      event_id:            eventId,
      summary:             result.summary             || '',
      summary_th:          result.summaryTh           || '',
      summary_en:          result.summaryEn           || '',
      key_themes:          result.keyThemes           || [],
      key_themes_th:       result.keyThemesTh         || [],
      key_themes_en:       result.keyThemesEn         || [],
      recommendations:     result.recommendations     || [],
      sentiment_breakdown: result.sentimentBreakdown  || {},
    };

    // upsert per event — 1 summary ต่อ 1 event
    const { data: existing } = await supabase
      .from('ai_summaries').select('id').eq('event_id', eventId).maybeSingle();
    if (existing) {
      await supabase.from('ai_summaries').update(dbRecord).eq('id', existing.id);
    } else {
      await supabase.from('ai_summaries').insert(dbRecord);
    }

    res.json(result); // return camelCase to admin client
  } catch (err) {
    console.error('[AI summary]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET latest AI summary for dashboard polling (map snake_case → camelCase)
app.get('/api/ai/latest', async (_req, res) => {
  const eventId = await getCurrentEventId();
  const { data } = await supabase
    .from('ai_summaries').select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (!data) return res.json({});
  res.json({
    summary:            data.summary            || '',
    summaryTh:          data.summary_th         || '',
    summaryEn:          data.summary_en         || '',
    keyThemes:          data.key_themes         || [],
    keyThemesTh:        data.key_themes_th      || [],
    keyThemesEn:        data.key_themes_en      || [],
    recommendations:    data.recommendations    || [],
    sentimentBreakdown: data.sentiment_breakdown|| {},
  });
});

// ── AI Settings ──────────────────────────────────────────────
app.get('/api/settings', async (_req, res) => {
  // Load from Supabase settings table (persists across cold starts)
  const { data: rows } = await supabase.from('settings').select('key, value');
  const map = {};
  (rows || []).forEach(r => { map[r.key] = r.value; });

  const provider = map['provider'] || process.env.AI_PROVIDER || 'openai';
  const model    = map['model']    || process.env.AI_MODEL    || '';
  const apiKey   = map['api_key']  || process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || '';

  // Sync into ai service for this request lifecycle
  if (apiKey) aiService.updateSettings({ provider, model, apiKey });

  res.json({
    provider, model,
    apiKeySet:    !!apiKey,
    apiKeyMasked: apiKey ? apiKey.slice(0,8)+'...'+apiKey.slice(-4) : '',
    models: aiService.getModelsForProvider(provider),
  });
});

app.post('/api/settings', async (req, res) => {
  const { provider, model, apiKey } = req.body;

  // Upsert into Supabase
  const upserts = [];
  if (provider) upserts.push({ key: 'provider', value: provider });
  if (model)    upserts.push({ key: 'model',    value: model    });
  if (apiKey)   upserts.push({ key: 'api_key',  value: apiKey   });

  for (const u of upserts) {
    await supabase.from('settings').upsert(u, { onConflict: 'key' });
  }

  if (apiKey) aiService.updateSettings({ provider, model, apiKey });
  res.json({ status: 'ok', provider, model });
});

app.get('/api/settings/models', (req, res) => {
  res.json(aiService.getModelsForProvider(req.query.provider || 'openai'));
});

// ── Admin auth ────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  if (req.body.password === (process.env.ADMIN_PASSWORD || 'admin1234')) {
    res.json({ token: Buffer.from(`admin:${Date.now()}`).toString('base64') });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ── Engagement Score ──────────────────────────────────────────
app.get('/api/engagement', async (_req, res) => {
  try {
    const eventId = await getCurrentEventId();

    // ดึง poll_ids ของ event นี้ก่อน เพื่อ filter poll_responses
    const { data: eventPolls } = await supabase
      .from('polls').select('id').eq('event_id', eventId);
    const pollIds = (eventPolls || []).map(p => p.id);

    const [
      { count: ci },
      { count: cm },
      { count: pos },
      responsesResult,
    ] = await Promise.all([
      supabase.from('checkins').select('*', { count: 'exact', head: true }).eq('event_id', eventId),
      supabase.from('comments').select('*', { count: 'exact', head: true }).eq('event_id', eventId),
      supabase.from('comments').select('*', { count: 'exact', head: true }).eq('event_id', eventId).eq('sentiment','positive'),
      pollIds.length
        ? supabase.from('poll_responses').select('session_id').in('poll_id', pollIds)
        : Promise.resolve({ data: [] }),
    ]);

    const checkins  = ci  || 0;
    const comments  = cm  || 0;
    const positive  = pos || 0;
    const tv = new Set((responsesResult.data||[]).map(r=>r.session_id)).size;

    const safeCI       = checkins || 1;
    const voteRatio    = Math.min(tv       / safeCI, 1);
    const commentRatio = Math.min(comments / safeCI, 1);
    const posRatio     = positive / (comments || 1);
    const score = Math.min(100, Math.round(voteRatio*35 + commentRatio*35 + posRatio*30));

    res.json({ score, checkins, votes: tv, comments });
  } catch (e) {
    console.error('[Engagement]', e.message);
    res.json({ score: 0 });
  }
});

// ── CSV Export ────────────────────────────────────────────────
app.get('/api/export/csv', async (req, res) => {
  try {
    const type    = req.query.type || 'comments';
    const eventId = await getCurrentEventId();
    const escape  = v => `"${String(v ?? '').replace(/"/g,'""')}"`;
    let headers, rows = [], filename;

    if (type === 'comments') {
      const { data } = await supabase.from('comments').select('*')
        .eq('event_id', eventId).order('created_at');
      headers  = 'id,author,gender,rating,text,sentiment,timestamp';
      filename = 'nexus_comments.csv';
      rows = (data||[]).map(c =>
        [c.id, c.author, c.gender, c.rating||'', c.text, c.sentiment, c.created_at].map(escape).join(','));

    } else if (type === 'checkins') {
      const { data } = await supabase.from('checkins').select('*')
        .eq('event_id', eventId).order('created_at');
      headers  = 'sessionId,name,timestamp';
      filename = 'nexus_checkins.csv';
      rows = (data||[]).map(c => [c.session_id, c.name, c.created_at].map(escape).join(','));

    } else if (type === 'votes') {
      // ดึง poll_ids ของ event นี้ก่อน
      const { data: eventPolls } = await supabase
        .from('polls').select('id').eq('event_id', eventId);
      const pollIds = (eventPolls || []).map(p => p.id);

      const { data } = pollIds.length
        ? await supabase.from('poll_responses')
            .select('*, polls(question)')
            .in('poll_id', pollIds)
            .order('created_at')
        : { data: [] };

      headers  = 'pollId,question,response,sessionId,timestamp';
      filename = 'nexus_votes.csv';
      rows = (data||[]).map(r => [
        r.poll_id, r.polls?.question||'',
        r.answer || (r.option_index !== null ? `option_${r.option_index}` : '') || (r.rating ? `rating_${r.rating}` : ''),
        r.session_id, r.created_at,
      ].map(escape).join(','));
    }

    const csv = [headers, ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('﻿' + csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Local dev: start server directly
// Vercel serverless: uses module.exports = app (no listen needed)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`NEXUS running at http://localhost:${PORT}`));
}

module.exports = app;
