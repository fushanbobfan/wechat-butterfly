-- 新增描述查询日志表，记录 parser 关键字段
CREATE TABLE IF NOT EXISTS describe_query_log (
  id BIGSERIAL PRIMARY KEY,
  raw_text TEXT NOT NULL,
  parser_version VARCHAR(64) NOT NULL,
  parse_result JSONB NOT NULL,
  rule_hits JSONB NOT NULL DEFAULT '[]'::jsonb,
  returned_candidates JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_describe_query_log_created_at
  ON describe_query_log (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_describe_query_log_parser_version
  ON describe_query_log (parser_version);

-- 若已有 recognition_record，可通过扩展表关联存储 describe 解析上下文
CREATE TABLE IF NOT EXISTS recognition_record_describe_ext (
  recognition_record_id BIGINT PRIMARY KEY,
  raw_text TEXT NOT NULL,
  parser_version VARCHAR(64) NOT NULL,
  parse_result JSONB NOT NULL,
  rule_hits JSONB NOT NULL DEFAULT '[]'::jsonb,
  returned_candidates JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
