# wechat-butterfly

同仓公开演示站：`apps/web`

## 快速验证（推荐）

```bash
npm test
pytest -q
npm run demo:verify
```

## 启动公开演示站

```bash
cd apps/web
cp .env.example .env   # 可选
API_BASE_URL=http://localhost:3001 npm start
```

- `API_BASE_URL` 为空时，演示站自动进入 `fixture-fallback` 模式（不会空白页）。
- 健康检查：`/healthz`
- 运行时配置注入：`/config.js`

## 演示页面

- `/index.html`：产品介绍与演示模式
- `/browse.html`：题库浏览与关键词搜索
- `/recognition.html`：识别候选与解释字段展示

## CI

`.github/workflows/release-gates.yml` 包含：
- mock e2e gate
- web demo launch 验证
- 可选 real API smoke（依赖 `E2E_API_BASE_URL`）
