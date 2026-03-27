CREATE TABLE IF NOT EXISTS analytics_event_store (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  payload JSONB NOT NULL,
  user_role TEXT NOT NULL,
  taxon_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  model_version TEXT NOT NULL,
  event_ts TIMESTAMPTZ NOT NULL,
  ingest_ts TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_event_name_ts
  ON analytics_event_store (event_name, event_ts DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_session
  ON analytics_event_store (session_id, event_ts DESC);

-- Note: keep this table as raw event store for now; we can later ETL to data warehouse.
