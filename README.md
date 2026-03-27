# wechat-butterfly

## E2E 发布前门禁脚本

已提供 3 个端到端关键场景脚本（移动端 / 教师 / 后台），并接入 CI：

- `scripts/e2e/mobile_keyflow.sh`：5 分钟学习 + 小游戏 + 识别 + 百科检索。
- `scripts/e2e/teacher_flow.sh`：筛选 -> 候选缩小 -> 打开详情 -> 保存专题。
- `scripts/e2e/admin_publish_flow.sh`：新增物种 -> 提交审核 -> 审核发布 -> 前台可见。
- `scripts/e2e/run_release_gates.sh`：统一串联以上场景，作为发布前必过门禁。
- `.github/workflows/release-gates.yml`：CI 自动执行门禁并上传日志。

## 日志定位信息

失败时会输出并落盘结构化日志（JSONL），包含：

- `request_id`
- `taxon_id`
- `job_id`

默认路径：`artifacts/e2e-logs/*.jsonl`

## 运行方式

### 本地（默认 mock）

```bash
MOCK_MODE=1 bash scripts/e2e/run_release_gates.sh
```

### 对接真实环境

```bash
MOCK_MODE=0 API_BASE_URL=https://your-api.example.com API_TOKEN=xxx bash scripts/e2e/run_release_gates.sh
```

> 提示：
> - `MOCK_MODE=1` 用于快速验证脚本编排与日志。
> - `MOCK_MODE=0` 用于真实后端联调/发布前验收。
