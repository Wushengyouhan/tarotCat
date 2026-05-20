# 塔罗 PWA

韦特系塔罗占卜渐进式网页应用（MVP 开发中）。

## 技术栈

见 `docs/adr/0001-tech-stack.md`。

- Next.js 15 · TypeScript · Tailwind CSS 4 · Serwist (PWA)
- pnpm · Vitest

## 开发

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm test
pnpm build
```

部署（Docker / 阿里云 ACR / GitHub Actions）见 **`部署.md`**。

- 首页：填写问题 → 选择**单牌**或**三牌阵** → 开始占卜
- `/reading`：洗牌 → 逐张翻牌 → 查看牌义 → 自动存入本机历史
- `/history`：最近 30 次占卜列表与详情回放
- AI 深读：结果页点击「开启 AI 深读」（硅基流动 API）

### 配置 AI（硅基流动 + DeepSeek-V4-Flash）

1. 复制环境变量模板：

```bash
cp .env.local.example .env.local
```

2. 编辑 `.env.local`，填入你在 [硅基流动控制台](https://cloud.siliconflow.cn/account/ak) 申请的 Key：

```env
SILICONFLOW_API_KEY=sk-你的密钥
SILICONFLOW_MODEL=deepseek-ai/DeepSeek-V4-Flash
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
```

3. 重启开发服务：`pnpm dev`

API 文档：[创建对话请求（OpenAI）](https://docs.siliconflow.cn/cn/api-reference/chat-completions/chat-completions) — 本项目调用 `POST /chat/completions`，与 OpenAI 格式兼容。

### 疑难：运行时报 `Cannot find module './255.js'`（或其它数字 chunk）

多为 **`.next` 构建缓存与产物不一致**（中断编译、热更新异常等）。先清缓存再启：

```bash
pnpm clean && pnpm dev
# 生产构建：pnpm clean && pnpm build && pnpm start
```

仍异常时可再删 `node_modules/.cache` 后重新 `pnpm dev`。

## 项目文档

- PRD：`.scratch/tarot-app/PRD.md`
- Issues：`.scratch/tarot-app/issues/`
- 牌面资源：`public/tarot-cards/` · `docs/adr/0002-tarot-deck-assets.md`
