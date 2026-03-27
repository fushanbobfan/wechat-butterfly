CREATE TABLE IF NOT EXISTS external_link_cache (
  id BIGSERIAL PRIMARY KEY,
  provider VARCHAR(32) NOT NULL,
  url TEXT NOT NULL,
  last_checked_at TIMESTAMPTZ,
  status_code INTEGER,
  ttl INTEGER NOT NULL DEFAULT 3600,
  payload_hash VARCHAR(64) NOT NULL,
  summary_cache TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(provider, url)
);

CREATE INDEX IF NOT EXISTS idx_external_link_cache_provider_last_checked
  ON external_link_cache(provider, last_checked_at);

CREATE INDEX IF NOT EXISTS idx_external_link_cache_status_code
  ON external_link_cache(status_code);
