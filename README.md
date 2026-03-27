# wechat-butterfly

## 本次实现概览

- `services/api/search_describe.py`
  - `/search/describe` 响应新增：`parser_version`、`rule_hits`、`uncertain_terms`。
  - 写入 `DescribeQueryLog`（示例内存实现，便于接 DB）。
- `services/ml-inference/parser` + `services/ml_inference/parser`
  - 将规则迁移为可加载配置（YAML/JSON），并携带 `version`。
- `database/migrations/20260327_add_describe_query_log.sql`
  - 新增 `describe_query_log`。
  - 提供 `recognition_record_describe_ext` 扩展表方案。
- `apps/admin/rule_publish.py`
  - 提供规则发布状态流转：`draft -> pending_review -> published`。
- `tests/regression/describe_samples.json`
  - 固定回归样例（如“绿色有长尾”“常见于菜地附近”）。
