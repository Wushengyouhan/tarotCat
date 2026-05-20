Status: needs-triage

# [Phase 2] AI 深读（服务端代理 + 结果页集成）

> **暂缓**：用户决定 MVP 先不接 AI，待 Issue 01–05 完成后再做。非放弃。

## Parent

`.scratch/tarot-app/PRD.md`

## What to build

实现 **AI 深读** 端到端切片：

- 服务端 `POST /api/interpret`：读取环境变量中的模型 API Key；接收 `question`、`spreadId`、`cards[]`（含牌位中文标签、牌名、正逆）；返回神秘仪式感 **简体中文** 长文
- Prompt：结合问题与位义叙事；避免医疗/法律/投资等强硬专业断言
- 客户端：结果页在展示内置牌义后显示「AI 深读」按钮；**仅用户点击时**请求；加载态、失败友好提示、可重试
- 成功后展示解读全文；将 `aiText` 写入当次 `HistoryStore` 记录（若该次已保存则更新）
- **不限次数**；Key 不出现在浏览器

## Acceptance criteria

- [ ] 未点击「AI 深读」时零 AI 网络请求
- [ ] 点击后发送正确契约的请求；成功展示中文长文
- [ ] 加载中与错误态可见；失败可重试且不丢失已抽牌结果
- [ ] 历史详情可查看该次的 `aiText`（若生成过）
- [ ] `AiInterpreter` 有 mock LLM 测试：请求体字段完整；错误响应形状约定
- [ ] API Key 仅存在于服务端环境变量

## Blocked by

- MVP 完成：`01`–`05` 均已验收
- `03-single-card-reading-e2e.md`（结果页与 ReadingSession）
- `05-local-reading-history.md`（持久化 aiText）

## Comments

2026-05-19：推迟至 Phase 2。技术栈见 ADR-0001。
