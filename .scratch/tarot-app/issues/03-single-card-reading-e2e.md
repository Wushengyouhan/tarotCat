Status: ready-for-agent

# 单牌占卜端到端（无 AI、无历史）

## Parent

`.scratch/tarot-app/PRD.md`

## What to build

实现完整 **单牌** 占卜垂直切片，贯穿领域层与 UI：

- Deep modules：`Deck`、`SpreadRegistry`（含 `single`）、`DrawEngine`、`CardMeanings`、`ReadingSession` 状态机
- 流程：必填问题（最小长度校验）→ 选单牌 → 洗牌动画 → 点击翻开 1 张（开源牌图 + 中文牌名 + 正/逆）→ 展示该牌内置中文牌义 → 可「开始新占卜」

**本切片不含**：AI 深读、本机历史、三牌阵。

## Acceptance criteria

- [x] 未填问题或问题过短无法进入抽牌
- [x] `DrawEngine` 单牌 draw：1 张、无重复、orientation 为 upright 或 reversed
- [x] 洗牌与逐张翻牌交互可完成；翻开后显示牌图、牌名、正逆标识
- [x] 展示与该牌 orientation 匹配的中文内置牌义
- [x] 弱网/离线下（无 AI 请求）可完成抽牌与阅读牌义
- [x] `DrawEngine`、`CardMeanings`、`ReadingSession` 有关键单元测试且通过
- [x] 结果页可发起新占卜回到首页

## Blocked by

- `01-select-open-source-deck.md`（牌图资源）
- `02-pwa-scaffold-dark-shell.md`（工程与 PWA 壳）

## Comments

**完成于 2026-05-19**

- 领域层：`src/lib/tarot/*`
- 牌义数据：`src/data/tarot/meanings.json`
- 流程页：`/reading`（`ReadingFlow`）
- 首页选三牌阵会提示等待 Issue 04
