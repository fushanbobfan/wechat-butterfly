# wechat-butterfly

同仓公开演示站：`apps/web`

## MVP 演示能力

- 首页：产品能力与演示模式说明
- 百科检索：关键词 + 温度偏好筛选，返回蝴蝶卡片列表
- 学习卡片：题库驱动 Flash Card
- 识别演示：Top-K 候选 + 命中原因 + 质量标记 + 下一步建议

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

- `API_BASE_URL` 为空时，自动进入 `fixture-fallback`，页面仍可完整演示。
- 健康检查：`/healthz`
- 运行时配置：`/config.js`

## CI

`.github/workflows/release-gates.yml` 包含：
- mock e2e gate
- web demo launch 验证
- 可选 real API smoke（依赖 `E2E_API_BASE_URL`）
