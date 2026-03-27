# 埋点指标口径说明（跨端统一）

本文档用于统一 `apps/mobile`、`apps/admin` 与 `services/api` 的指标定义，防止跨端口径漂移。

## 统一事件与公共字段

- 统一事件名来源：`packages/shared-types/src/analytics.ts`。
- 所有端上报的每条事件必须包含：
  - `user_role`
  - `taxon_id`
  - `session_id`
  - `model_version`
  - `event_ts`

## 指标口径

### 1) 学习完成率（learning_completion_rate）

- **定义**：完成学习会话的唯一 `session_id` 数 / 开始学习会话的唯一 `session_id` 数。
- **分子事件**：`learning_session_complete`
- **分母事件**：`topic_enter`
- **公式**：`COUNT(DISTINCT session_id WHERE learning_session_complete) / COUNT(DISTINCT session_id WHERE topic_enter)`

### 2) Top-1 命中率（top1_hit_rate）

- **定义**：识别结果中 Top-1 正确次数 / 识别总次数。
- **事件**：`recognition_result`
- **条件**：`payload.is_top1_hit = true`
- **公式**：`COUNT(recognition_result AND is_top1_hit=true) / COUNT(recognition_result)`

### 3) Top-3 命中率（top3_hit_rate）

- **定义**：识别结果中 Top-3 命中次数 / 识别总次数。
- **事件**：`recognition_result`
- **条件**：`payload.is_top3_hit = true`
- **公式**：`COUNT(recognition_result AND is_top3_hit=true) / COUNT(recognition_result)`

### 4) 纠错率（correction_rate）

- **定义**：用户主动纠错次数 / 识别错误次数。
- **分子事件**：`correction_submit`
- **分母事件**：`recognition_result`
- **分母条件**：`payload.is_correct = false`
- **公式**：`COUNT(correction_submit) / COUNT(recognition_result AND is_correct=false)`

### 5) 专题使用次数（topic_usage_count）

- **定义**：进入专题页事件总次数。
- **事件**：`topic_enter`
- **公式**：`COUNT(topic_enter)`

## 治理要求

- 各端新增埋点事件前，必须先在 `packages/shared-types` 增加事件名。
- 禁止客户端自定义事件字符串直传 API。
- 公共字段缺失的事件在 API 层返回 400 并拒绝入库。
- 指标涉及新增维度时，先更新本口径文档再发布。
