# wechat-butterfly

本仓库当前关键实现：

- Canonical 推理路径：`services/ml_inference`（已移除 `services/ml-inference` 重复路径）。
- 统一题库协议与 `/api/v1/games/configs`。
- 识别结果三段解释契约与 `/api/v1/recognition/jobs/:id`。
- 分析事件统一上报接口 `/api/analytics/events`。
- 描述解析日志文件持久化：`artifacts/describe_query_log.jsonl`。
- 同仓 Web Demo：`apps/web`（首页、浏览检索、识别演示，使用 shared runtime contracts 校验）。

## 运行

### 根目录

```bash
npm test
npm run web:start
```

### Web Demo（可配置 API）

```bash
cd apps/web
API_BASE_URL=http://localhost:3001 npm start
```

## E2E 门禁

```bash
bash scripts/e2e/run_release_gates.sh
```

### 真实环境 smoke（需要 API_BASE_URL）

```bash
API_BASE_URL=https://your-api.example.com bash scripts/e2e/run_real_smoke.sh
```
