# ADR-0001: MVP 技术栈

## Status

Accepted (2026-05-19)

## Context

塔罗 PWA 需要：移动端优先、PWA 安装、简体中文 UI、本机历史、领域逻辑可单测。用户确认采用推荐栈；**AI 深读推迟至 Phase 2**，MVP 不接入大模型 API。

## Decision

| 层级 | 选型 |
|------|------|
| 框架 | **Next.js 15**（App Router）+ **TypeScript** |
| 样式 | **Tailwind CSS** |
| 包管理 | **pnpm** |
| PWA | **Serwist** 或等价方案（`manifest` + Service Worker 缓存静态资源） |
| 领域逻辑 | 纯 TypeScript 模块（`Deck`、`DrawEngine`、`ReadingSession` 等），与 React 解耦 |
| 本机存储 | **localStorage**（MVP）；记录形状预留可选 `aiText` 字段 |
| 测试 | **Vitest** + **@testing-library/react** |
| 部署 | **Vercel**（默认目标；可自托管 Next.js） |

### Phase 2（不在 MVP 范围）

- `POST /api/interpret` + 环境变量中的 LLM API Key（DeepSeek 或 OpenAI，届时再定）
- 结果页「AI 深读」按钮与 `AiInterpreter` 模块

## Consequences

- Issue 02 脚手架按上述栈初始化；不使用 Pages Router。
- MVP 无服务端业务 API；无数据库、无用户认证。
- Issue 06 暂缓，待 Issue 01–05 完成后再启动。

## Comments

<!--  -->
