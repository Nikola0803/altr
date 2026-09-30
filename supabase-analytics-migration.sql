-- ALTR Analytics — run this once in the Supabase SQL Editor
-- Project Settings → SQL Editor → New query → paste → Run

CREATE TABLE IF NOT EXISTS analytics_events (
  id               BIGSERIAL PRIMARY KEY,
  event_type       TEXT          NOT NULL,
  session_id       TEXT          NOT NULL DEFAULT '',
  page_path        TEXT          NOT NULL DEFAULT '/',
  page_title       TEXT,
  referrer         TEXT,
  referrer_domain  TEXT,
  utm_source       TEXT,
  utm_medium       TEXT,
  utm_campaign     TEXT,
  utm_content      TEXT,
  utm_term         TEXT,
  traffic_source   TEXT,
  device_type      TEXT,
  os               TEXT,
  browser          TEXT,
  screen_width     INTEGER,
  is_new_session   BOOLEAN       DEFAULT FALSE,
  -- click-specific
  element_tag      TEXT,
  element_text     TEXT,
  element_href     TEXT,
  -- purchase-specific
  order_id         TEXT,
  order_value      NUMERIC(10,2),
  order_currency   TEXT,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Indexes for fast dashboard queries
CREATE INDEX IF NOT EXISTS idx_ae_created_at      ON analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ae_event_type      ON analytics_events (event_type);
CREATE INDEX IF NOT EXISTS idx_ae_session_id      ON analytics_events (session_id);
CREATE INDEX IF NOT EXISTS idx_ae_page_path       ON analytics_events (page_path);
CREATE INDEX IF NOT EXISTS idx_ae_traffic_source  ON analytics_events (traffic_source);

-- Disable Row Level Security so the service_role key can write freely
ALTER TABLE analytics_events DISABLE ROW LEVEL SECURITY;
