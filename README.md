# wechat-butterfly

本仓库当前已集成：

- 统一题库协议与 `/api/v1/games/configs`。
- 识别结果三段解释契约与 `/api/v1/recognition/jobs/:id`。
- 分析事件统一上报接口 `/api/analytics/events`。
- 描述解析日志文件持久化（`artifacts/describe_query_log.jsonl`）。
- E2E 门禁脚本（mock 流程）+ 可选真实 API smoke 检查。
- `apps/web` 公开 Demo 骨架（首页、百科检索、识别演示）。

## 本地运行

### API（按现有服务工程运行方式）

确保 `services/api/src/index.ts` 对外提供服务。

### Web Demo

```bash
cd apps/web
npm start
```

默认监听 `http://localhost:3000`。

## E2E 门禁

```bash
bash scripts/e2e/run_release_gates.sh
```

### 真实环境 smoke（需要 API_BASE_URL）

```bash
API_BASE_URL=https://your-api.example.com bash scripts/e2e/run_real_smoke.sh
```
