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

-- ══════════════════════════════════════════════════════════
--  MIGRATION: Multi-Event Support (แนวทาง B)
--  รัน section นี้ครั้งเดียวบน database ที่มีอยู่แล้ว
--  ถ้า setup ใหม่ทั้งหมด: section นี้ทำงานได้เลย (IF NOT EXISTS / ON CONFLICT)
-- ══════════════════════════════════════════════════════════

-- ── M1. Events table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id          TEXT PRIMARY KEY,           -- e.g. 'evt_2026_ai_summit'
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_all" ON events;
CREATE POLICY "public_all" ON events FOR ALL USING (true) WITH CHECK (true);

-- ── M2. เพิ่ม event_id ในทุกตาราง ───────────────────────────
ALTER TABLE comments     ADD COLUMN IF NOT EXISTS event_id TEXT DEFAULT 'default';
ALTER TABLE checkins     ADD COLUMN IF NOT EXISTS event_id TEXT DEFAULT 'default';
ALTER TABLE polls        ADD COLUMN IF NOT EXISTS event_id TEXT DEFAULT 'default';
ALTER TABLE ai_summaries ADD COLUMN IF NOT EXISTS event_id TEXT DEFAULT 'default';

-- ── M3. แก้ unique constraint ของ checkins ──────────────────
--  เดิม: session_id UNIQUE (1 คนเช็คอินได้ครั้งเดียวตลอดกาล)
--  ใหม่: UNIQUE(session_id, event_id) (1 คนเช็คอินได้ครั้งเดียวต่อ event)
ALTER TABLE checkins DROP CONSTRAINT IF EXISTS checkins_session_id_key;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'checkins_session_event_unique'
  ) THEN
    ALTER TABLE checkins ADD CONSTRAINT checkins_session_event_unique
      UNIQUE (session_id, event_id);
  END IF;
END $$;

-- ── M4. Default event ────────────────────────────────────────
INSERT INTO events (id, name)
  VALUES ('default', 'Default Event')
  ON CONFLICT (id) DO NOTHING;

-- ── M5. ตั้งค่า current_event_id ใน settings ────────────────
INSERT INTO settings (key, value)
  VALUES ('current_event_id', 'default')
  ON CONFLICT (key) DO NOTHING;
