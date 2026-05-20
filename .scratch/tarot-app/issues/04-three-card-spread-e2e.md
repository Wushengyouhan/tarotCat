Status: ready-for-agent

# 三牌阵占卜端到端（过去 / 现在 / 未来）

## Parent

`.scratch/tarot-app/PRD.md`

## What to build

在单牌切片基础上扩展 **三牌阵** 垂直切片：

- `SpreadRegistry` 注册 `three-card`，牌位：`past` 过去、`present` 现在、`future` 未来
- `DrawEngine` / `ReadingSession` 支持一次抽 3 张、逐张翻开，每张绑定牌位标签
- UI：三牌阵选择后，依次翻 3 张；每张展示对应牌位名、牌图、牌义；全部翻完后可查看完整结果

仍 **不含** AI 与本机历史。

## Acceptance criteria

- [x] 首页可选择三牌阵并完成整场流程
- [x] 一次 draw 返回 3 张不重复牌，各有 orientation 与 positionId
- [x] 翻牌顺序与牌位标签一一对应且 UI 可见
- [x] 每张翻开后展示正确位义 + 中文牌义；三张均可阅后结束
- [x] `SpreadRegistry` 三牌位顺序稳定且有测试
- [x] 单牌流程仍正常工作（无回归）

## Blocked by

- `03-single-card-reading-e2e.md`

## Comments

**完成于 2026-05-19**（与 Issue 05 同批交付）
