Status: ready-for-agent

# PWA 脚手架与深色神秘外壳

## Parent

`.scratch/tarot-app/PRD.md`

## What to build

按 **ADR-0001** 从零搭建塔罗 PWA：

- **Next.js 15**（App Router）+ **TypeScript** + **pnpm**
- **Tailwind CSS** — 移动端优先深色神秘主题（深紫/黑金/星空氛围）
- **Serwist**（或等价）— PWA `manifest`（`standalone`、主题色、图标占位）、Service Worker **仅缓存静态资源**
- **Vitest** + Testing Library — 至少 1 个 smoke 测试
- 全局 **简体中文**；首页：问题输入（引导文案）+ 单牌/三牌阵选择；提交可先占位

**MVP 不含** API Route、LLM、数据库。

## Acceptance criteria

- [x] `pnpm dev` / `pnpm build` 成功；含 `pnpm test`（Vitest）
- [x] 手机竖屏布局正常；界面简体中文
- [x] Manifest + SW：离线可打开壳页面；静态资源可缓存
- [x] Tailwind 深色主题 token 已用（非纯白默认壳）
- [x] 首页：问题输入 + 引导文案 + 牌阵选择控件
- [x] Vitest smoke 测试通过（如根布局渲染）

## Blocked by

None - can start immediately

## Comments

**完成于 2026-05-19**

- 入口：`pnpm dev` → `/`
- 提交后显示占位提示（Issue 03 接洗牌/翻牌）
- SW：`public/sw.js`（生产构建生成）；开发模式 Serwist 默认禁用
- 测试：`src/components/HomePage.test.tsx`

技术栈见 `docs/01-tech-stack.md`。
