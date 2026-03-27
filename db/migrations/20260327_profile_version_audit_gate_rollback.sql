-- 1) profile_version: store full JSON snapshot per submit/publish/rollback
CREATE TABLE IF NOT EXISTS profile_version (
  id BIGSERIAL PRIMARY KEY,
  profile_id BIGINT NOT NULL,
  version_no INTEGER NOT NULL,
  snapshot_json JSONB NOT NULL,
  source_action VARCHAR(32) NOT NULL, -- submit / publish / rollback
  created_by BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  rollback_from_version_id BIGINT,
  CONSTRAINT uq_profile_version UNIQUE (profile_id, version_no)
);

CREATE INDEX IF NOT EXISTS idx_profile_version_profile_id ON profile_version(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_version_published_at ON profile_version(published_at);

-- 4) Extend audit_log to include reviewer/action/diff summary/publish time/rollback point
ALTER TABLE audit_log
  ADD COLUMN IF NOT EXISTS reviewer_id BIGINT,
  ADD COLUMN IF NOT EXISTS action VARCHAR(32),
  ADD COLUMN IF NOT EXISTS diff_summary JSONB,
  ADD COLUMN IF NOT EXISTS publish_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rollback_point_version_id BIGINT;

CREATE INDEX IF NOT EXISTS idx_audit_log_profile_id_action_created_at
  ON audit_log(profile_id, action, created_at DESC);

-- Optional strong FK constraints if corresponding tables exist
-- ALTER TABLE profile_version ADD CONSTRAINT fk_profile_version_profile
--   FOREIGN KEY (profile_id) REFERENCES profile(id);
-- ALTER TABLE profile_version ADD CONSTRAINT fk_profile_version_rollback
--   FOREIGN KEY (rollback_from_version_id) REFERENCES profile_version(id);
