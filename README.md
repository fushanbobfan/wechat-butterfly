# wechat-butterfly

本次实现包含以下能力：

1. **profile_version 快照表**：新增 SQL 迁移，按提交/发布/回滚保存完整 `snapshot_json`。
2. **审核差异视图**：`apps/admin` 新增 `ProfileDiffView`，支持文本、标签、图片、外链对比。
3. **发布门禁**：发布前校验主图、权威外链、基础标签、来源、授权字段。
4. **审计日志增强**：`audit_log` 记录审核人、动作、差异摘要、发布时间、回滚点。
5. **一键回滚**：支持回滚到上一个已发布版本并写入审计。

> 详细逻辑位于 `backend/src/services/profileVersionService.ts`。
