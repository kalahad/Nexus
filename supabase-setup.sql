-- ══════════════════════════════════════════════════════════
--  NEXUS — Supabase PostgreSQL Setup
--  วิธีใช้: เปิด Supabase Dashboard → SQL Editor → วางและ Run
-- ══════════════════════════════════════════════════════════

-- ── 1. Tables ──────────────────────────────────────────────

-- Check-ins
CREATE TABLE IF NOT EXISTS checkins (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Polls
CREATE TABLE IF NOT EXISTS polls (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question     TEXT NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('choice','text','rating')),
  active       BOOLEAN DEFAULT true,
  show_results BOOLEAN DEFAULT false,
  options      JSONB DEFAULT '[]',
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Poll responses (votes / text answers / ratings)
CREATE TABLE IF NOT EXISTS poll_responses (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id      UUID REFERENCES polls(id) ON DELETE CASCADE,
  session_id   TEXT NOT NULL,
  option_index INTEGER,
  answer       TEXT,
  rating       INTEGER,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(poll_id, session_id)
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text        TEXT NOT NULL,
  author      TEXT DEFAULT 'Anonymous',
  gender      TEXT DEFAULT 'unspecified',
  rating      INTEGER,
  session_id  TEXT NOT NULL,
  sentiment   TEXT DEFAULT 'neutral',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- AI Summaries
CREATE TABLE IF NOT EXISTS ai_summaries (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  summary             TEXT,
  summary_th          TEXT,
  summary_en          TEXT,
  key_themes          JSONB,
  key_themes_th       JSONB,
  key_themes_en       JSONB,
  recommendations     JSONB,
  sentiment_breakdown JSONB,
  created_at          TIMESTAMPTZ DEFAULT now()
);

-- App Settings (AI key, provider, model)
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT
);

-- ── 2. Row Level Security (RLS) — allow all for demo ───────

ALTER TABLE checkins      ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls         ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summaries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings      ENABLE ROW LEVEL SECURITY;

-- Allow full access via anon key (สำหรับ event demo)
CREATE POLICY "public_all" ON checkins       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON polls          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON poll_responses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON comments       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON ai_summaries   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON settings       FOR ALL USING (true) WITH CHECK (true);

-- ── 3. Enable Realtime (optional — สำหรับอนาคต) ───────────
-- ไปที่ Supabase Dashboard → Database → Replication
-- เปิด Realtime สำหรับ tables: checkins, comments, polls, poll_responses
