Status: ready-for-agent

# 本机占卜历史（约 30 条）

## Parent

`.scratch/tarot-app/PRD.md`

## What to build

实现 `HistoryStore` 与历史 UI 垂直切片：

- 每次占卜完成（单牌或三牌阵，无论是否稍后会有 AI）自动保存：时间、牌阵、问题、各牌位+牌+正逆、各牌内置牌义全文
- 列表页：展示时间、牌阵类型、问题摘要；最多保留 **30** 条，超出 FIFO 丢弃最旧
- 详情页：完整回放问题、牌面、牌义；返回列表
- 无需登录；数据仅存本机（localStorage 或 IndexedDB）

记录类型 **预留** 可选字段 `aiText?: string`（Phase 2 写入）；MVP 不展示、不实现 AI 相关 UI。

## Acceptance criteria

- [x] 完成一次单牌或三牌阵后，历史列表出现新条目
- [x] 详情页内容与当次占卜一致
- [x] 第 31 次保存后最旧一条被移除；`list()` 长度 ≤ 30
- [x] `HistoryStore` 单元测试覆盖 save / list / get / prune
- [x] 首页或导航可进入历史；历史页可发起新占卜
- [x] 刷新页面后历史仍存在（本机持久化）

## Blocked by

- `03-single-card-reading-e2e.md`

## Comments

**完成于 2026-05-19**（与 Issue 04 同批交付）

- `src/lib/history/history-store.ts` · `localStorage`
- `/history` · `/history/[id]`
