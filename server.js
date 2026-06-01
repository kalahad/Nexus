require('dotenv').config();
const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const cors   = require('cors');
const path   = require('path');

const checkinRoutes = require('./routes/checkin');
const pollRoutes    = require('./routes/poll');
const commentRoutes = require('./routes/comment');
const aiService     = require('./services/ai');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*', methods: ['GET','POST','PUT','PATCH','DELETE'] } });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, _res, next) => { req.io = io; next(); });

// Routes
app.use('/api/checkin', checkinRoutes);
app.use('/api/poll',    pollRoutes);
app.use('/api/comment', commentRoutes);

// ── AI Summary ─────────────────────────────────────────────────
app.post('/api/ai/summary', async (req, res) => {
  try {
    const { comments } = req.body;
    if (!Array.isArray(comments) || !comments.length)
      return res.status(400).json({ error: 'comments array required' });
    const result = await aiService.generateSummary(comments);
    io.emit('ai_update', result);
    res.json(result);
  } catch (err) {
    console.error('[AI summary]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── AI Settings ────────────────────────────────────────────────
app.get('/api/settings', (_req, res) => {
  const s = aiService.getSettings();
  res.json({
    provider: s.provider, model: s.model,
    apiKeySet: !!s.apiKey,
    apiKeyMasked: s.apiKey ? s.apiKey.slice(0,8)+'...'+s.apiKey.slice(-4) : '',
    models: aiService.getModelsForProvider(s.provider),
  });
});
app.post('/api/settings', (req, res) => {
  const { provider, model, apiKey } = req.body;
  aiService.updateSettings({ provider, model, apiKey });
  res.json({ status: 'ok', provider, model });
});
app.get('/api/settings/models', (req, res) => {
  res.json(aiService.getModelsForProvider(req.query.provider || 'openai'));
});

// ── Admin auth ─────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  if (req.body.password === (process.env.ADMIN_PASSWORD || 'admin1234')) {
    res.json({ token: Buffer.from(`admin:${Date.now()}`).toString('base64') });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ── Engagement Score ───────────────────────────────────────────
app.get('/api/engagement', (req, res) => {
  try {
    const checkinMap = checkinRoutes.checkins;
    const polls      = [...pollRoutes.polls.values()];
    const ci  = checkinMap ? checkinMap.size : 0;
    const tv  = polls.reduce((s, p) => s + (p.voters ? p.voters.size : 0), 0);
    const cmData = commentRoutes.getStats();
    const cm  = cmData.total;
    const pos = cmData.positive;
    const tot = cm || 1;

    const voteRatio    = ci > 0 ? Math.min(tv / ci, 1) : 0;
    const commentRatio = ci > 0 ? Math.min(cm / ci, 1) : 0;
    const posRatio     = pos / tot;
    const score = Math.min(100, Math.round(voteRatio * 35 + commentRatio * 35 + posRatio * 30));
    res.json({ score, checkins: ci, votes: tv, comments: cm });
  } catch (e) {
    res.json({ score: 0 });
  }
});

// ── CSV Export ─────────────────────────────────────────────────
app.get('/api/export/csv', async (req, res) => {
  try {
    const type = req.query.type || 'comments';
    const sheets = require('./services/sheets');

    let rows, filename, headers;
    if (type === 'comments') {
      const data = await sheets.readRows('Comments').catch(() => []);
      headers  = 'id,author,gender,rating,text,sentiment,timestamp';
      rows     = data.slice(1); // skip header row
      filename = 'nexus_comments.csv';
    } else if (type === 'checkins') {
      const data = await sheets.readRows('Checkins').catch(() => []);
      headers  = 'sessionId,name,timestamp';
      rows     = data.slice(1);
      filename = 'nexus_checkins.csv';
    } else if (type === 'votes') {
      const data = await sheets.readRows('Votes').catch(() => []);
      headers  = 'pollId,question,option,sessionId,timestamp';
      rows     = data.slice(1);
      filename = 'nexus_votes.csv';
    }

    const escape = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [headers, ...(rows||[]).map(r => r.map(escape).join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('﻿' + csv); // BOM for Excel Thai
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Socket ─────────────────────────────────────────────────────
io.on('connection', socket => {
  console.log(`[Socket] connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`[Socket] disconnected: ${socket.id}`));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`NEXUS running at http://localhost:${PORT}`));
