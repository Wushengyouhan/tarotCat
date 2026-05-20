Status: ready-for-agent

# 选定开源牌组并记录许可证

## Parent

`.scratch/tarot-app/PRD.md`

## What to build

为 MVP 选定一套 **78 张、许可明确** 的韦特系替代牌组（禁止未授权 RWS 商业图），将图片资源纳入仓库（或构建可解析的静态资源路径），并写清许可证出处（`docs/adr/` 短 ADR 或 PRD Further Notes 更新均可）。

完成后，应用内任意牌面展示均可合法使用这套图。

## Acceptance criteria

- [x] 已选定具体牌组名称、来源 URL、许可证类型（如 CC0 / CC-BY）
- [x] 仓库内包含 78 张可映射到 `Deck` cardId 的图片（或等价资源包）
- [x] 文档中说明 attribution 要求（若许可证需要署名则写明展示位置）
- [x] 实现者可在本地构建中引用这些资源且无警告

## Blocked by

None - can start immediately

## Comments

**完成于 2026-05-19**

- 选型：[metabismuth/tarot-json](https://github.com/metabismuth/tarot-json)（MIT 数据集 + RWS 美区 PD 说明）
- ADR：`docs/adr/0002-tarot-deck-assets.md`
- 图片：`public/tarot-cards/`（78× `.jpg`）
- 清单：`src/data/tarot/deck-manifest.json`（`id` + `nameZh` + `image` 路径）
- 致谢：`public/tarot-cards/ATTRIBUTION.md`
