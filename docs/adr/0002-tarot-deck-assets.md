# ADR-0002: 塔罗牌面资源选型

## Status

Accepted (2026-05-19)

## Context

MVP 需要 78 张韦特系（RWS）牌面图，许可清晰、可随仓库分发，并能映射到稳定的 `cardId`（供 `Deck` / UI 使用）。禁止未授权的商业 Rider-Waite-Smith 图源。

## Decision

采用 **[metabismuth/tarot-json](https://github.com/metabismuth/tarot-json)** 仓库中的 RWS 扫描图（350×600 JPEG）。

| 项 | 说明 |
|----|------|
| 资源路径 | `public/tarot-cards/*.jpg`（78 张） |
| 清单 | `src/data/tarot/deck-manifest.json`（`id` = 文件名无扩展名，如 `m00`、`c01`） |
| 数据集许可 | **MIT**（见 `public/tarot-cards/LICENSE-tarot-json.txt`） |
| 插画版权 | RWS 插画在美国属**公有领域**；**欧盟等地区可能仍受保护** — 见 [Wikipedia RWS copyright](https://en.wikipedia.org/wiki/Rider-Waite_tarot_deck#Copyright_status) |

### cardId 约定

- 大阿尔卡纳：`m00`–`m21`（0 = 愚者）
- 圣杯：`c01`–`c14`
- 宝剑：`s01`–`s14`
- 权杖：`w01`–`w14`
- 星币：`p01`–`p14`（p = pentacles）

### 中文牌名

`deck-manifest.json` 内 `nameZh` 为应用展示用译名（女皇/皇后等按常见韦特中文版区分）。

## Alternatives considered

| 方案 | 未选原因 |
|------|----------|
| [luciellaes RWS CC0 on itch.io](https://luciellaes.itch.io/rider-waite-smith-tarot-cards-cc0) | 许可友好，但需手动下载 zip、无现成 JSON 映射；可作备用 |
| 商业 RWS 图 | 侵权风险 |

## Consequences

- Issue 03+ 可通过 `deck-manifest.json` 解析 `image` 路径（`/tarot-cards/{id}.jpg`）。
- 逆位展示：MVP 用 CSS `rotate(180deg)` 旋转牌图，不另备逆位图。
- 若目标用户主要在欧盟且需更保守合规，可再评估替换为明确 CC0 打包图（如 itch.io 版）。

## Attribution

- **数据集**：保留 MIT 许可证文件；关于页或 `public/tarot-cards/ATTRIBUTION.md` 中致谢 [tarot-json](https://github.com/metabismuth/tarot-json)。
- **插画**：Rider-Waite-Smith，Pamela Colman Smith（美区公有领域说明见上）。
- MVP 无强制「关于」页；上线前可在设置/页脚加链接。

## Comments

<!--  -->
