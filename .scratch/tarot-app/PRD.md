Status: ready-for-agent

# 塔罗 PWA — 产品需求文档

## Problem Statement

许多对塔罗感兴趣的人想随时做一次占卜：先明确心中的问题，经历有仪式感的抽牌过程，读懂牌面含义，并在需要时获得连贯的叙事式解读。现有方案往往要么缺少沉浸的抽牌体验，要么一上来就依赖 AI、无法离线自助阅读牌义，要么需要注册账号才能保存记录。

用户希望有一款**简体中文、深色神秘风格**的手机网页应用：无需登录，能在本机回顾历史占卜；先通过内置牌义自助理解牌面，再**自愿**请求免费、神秘语气风格的 AI 深读。

## Solution

交付一款可安装到主屏幕的 **PWA（渐进式网页应用）**，支持韦特系 **78 张牌**（正位与逆位），提供 **单牌**与 **三牌阵（过去 / 现在 / 未来）** 两种牌阵。

每次占卜的流程为：**写下必填问题 → 选择牌阵 → 洗牌动画 → 逐张翻牌 → 展示内置标准牌义**。

**MVP（Phase 1）不含 AI 深读**，先交付完整自助占卜 + 本机历史。  
**Phase 2** 再增加可选「AI 深读」：服务端代理大模型（Key 不暴露）、免费不限次、神秘语气中文长文（见 ADR-0001 与 Issue 06）。

历史记录保存在**本机**（约最近 30 条），包含问题、牌面、内置牌义及 AI 全文（若生成）。牌面图案使用**免费/开源替代牌组**（非商业 Rider-Waite-Smith 原图）。产品**不展示免责声明**，以保持沉浸感。

## User Stories

### 进入与整体

1. As a 访客, I want to在手机浏览器打开应用并添加到主屏幕, so that 它用起来像原生 App。
2. As a 访客, I want to看到深色神秘风格的界面（深紫/黑金/星空氛围）, so that 氛围与占卜仪式一致。
3. As a 访客, I want to全程使用简体中文, so that 我不需要切换语言。

### 提问与牌阵选择

4. As a 求问者, I want to在抽牌之前必须写下我的问题, so that 整场占卜围绕明确的意图进行。
5. As a 求问者, I want to在提交问题前看到简短引导文案（例如默念问题再写下）, so that 我知道如何认真提问。
6. As a 求问者, I want to选择「单牌」或「三牌阵」, so that 我能根据问题复杂度选合适的占卜方式。
7. As a 求问者, I want to在三牌阵中看到明确的三个牌位标签（过去 / 现在 / 未来）, so that 我理解每张牌的角色。

### 抽牌仪式

8. As a 求问者, I want to在抽牌前看到洗牌动画, so that 体验有仪式感。
9. As a 求问者, I want to逐张点击翻开牌面（单牌 1 次，三牌阵 3 次）, so that 我能控制揭晓节奏。
10. As a 求问者, I want to系统从 78 张牌中真随机抽取且不重复（同一牌阵内）, so that 结果公平不可预测。
11. As a 求问者, I want to每张牌随机决定正位或逆位, so that 解读符合韦特传统。
12. As a 求问者, I want to翻牌时看到牌面图案（开源牌组图）及牌名, so that 我能识别是哪张牌。

### 内置牌义（自助层）

13. As a 求问者, I want to在翻开后立即看到该张牌的标准中文牌义（区分正逆）, so that 我不依赖 AI 也能完成自助占卜。
14. As a 求问者, I want to在三牌阵中按牌位顺序依次查看各牌牌义, so that 我能对照过去/现在/未来理解。
15. As a 求问者, I want to在未请求 AI 的情况下完成整场占卜并结束, so that 我可以只用免费内置内容。

### AI 深读

16. As a 求问者, I want to在看完内置牌义后主动点击「AI 深读」, so that 我决定何时消耗 AI 资源。
17. As a 求问者, I want to AI 解读使用神秘仪式感的中文语气, so that 体验与视觉风格一致。
18. As a 求问者, I want to AI 解读结合我的问题、牌阵类型、各牌位、牌名与正逆生成连贯长文, so that 解读感觉个性化而非机械罗列牌义。
19. As a 求问者, I want to在 AI 生成期间看到加载状态, so that 我知道需要等待。
20. As a 求问者, I want to在 AI 失败时看到友好错误并可重试, so that 网络或服务故障不会让我丢失已抽的牌。
21. As a 求问者, I want to AI 解读完全免费且无次数限制, so that 我可以随时尝试深读。

### 历史记录

22. As a 求问者, I want to我的占卜自动保存到本机, so that 我可以日后回顾。
23. As a 求问者, I want to历史列表展示时间、牌阵类型与问题摘要, so that 我能快速找到某次占卜。
24. As a 求问者, I want to点开历史条目查看完整详情（问题、各牌、内置牌义、AI 全文若有）, so that 我能重温一次完整仪式。
25. As a 求问者, I want to本机最多保留约 30 条记录且超出时丢弃最旧的, so that 存储不会无限增长。
26. As a 求问者, I want to无需注册或登录即可使用历史功能, so that 门槛最低。

### 导航与重复占卜

27. As a 求问者, I want to从结果页或历史页发起一次新占卜, so that 我可以连续问不同问题。
28. As a 求问者, I want to从历史详情返回列表, so that 浏览体验清晰。

### 非功能（用户可感知）

29. As a 求问者, I want to应用在常见手机浏览器上布局正常（竖屏优先）, so that 可日常使用。
30. As a 求问者, I want to在内置牌义可用时弱网或离线仍能完成抽牌与阅读牌义, so that 核心自助路径不依赖网络。
31. As a 求问者, I want to AI 请求仅在我主动触发时发生, so that 隐私与流量可控。

## Implementation Decisions

### 仓库现状

Greenfield 项目：尚无应用代码，仅有 Agent skills 与 `docs/agents/` 配置。PRD 描述从零构建的首个垂直切片（MVP）。

### 已确定技术栈（ADR-0001）

| 层级 | 选型 |
|------|------|
| 框架 | **Next.js 15**（App Router）+ **TypeScript** |
| 样式 | **Tailwind CSS** |
| 包管理 | **pnpm** |
| PWA | **Serwist**（或等价）— `manifest` + SW 缓存静态资源 |
| 领域逻辑 | 纯 TS 模块，与 UI 解耦 |
| 本机存储 | **localStorage**（MVP） |
| 测试 | **Vitest** + Testing Library |
| 部署 | **Vercel**（默认） |

**Phase 2 再加**：`POST /api/interpret` + LLM（DeepSeek/OpenAI 届时选定）。  
**MVP 无**服务端业务 API、数据库、用户认证。

- **牌图**：构建时打包选定的开源/CC0 牌组资源；内置 JSON 存放 78 张中文牌名与正逆牌义。

### 核心领域模块（deep modules）

实现时应优先抽出以下模块，接口稳定、便于单测：

#### 1. `Deck`

- **职责**：78 张韦特系牌定义；按 id 提供牌名；不持有随机逻辑。
- **接口要点**：`getCardById(id)`, `allCards()`, 牌分为 Major/Minor（若影响展示可用，非必须暴露给 UI）。

#### 2. `SpreadRegistry`

- **职责**：注册牌阵元数据：单牌、三牌阵；每个牌阵包含牌位列表（id、中文标签、顺序）。
- **接口要点**：`getSpread(spreadId)` → `{ id, name, positions: [{ id, label }] }`。

#### 3. `DrawEngine`

- **职责**：给定牌阵所需张数，从完整牌堆无放回随机抽样，并为每张分配 `upright | reversed`。
- **接口要点**：`draw(spreadId): DrawResult`，其中 `DrawResult = { cards: [{ cardId, orientation, positionId }] }`。
- **约束**：使用可注入 RNG（`Math.random` 或 seedable）便于测试。

#### 4. `CardMeanings`

- **职责**：根据 `cardId + orientation` 返回简体中文标准牌义正文。
- **接口要点**：`getMeaning(cardId, orientation): string`。
- **约束**：与 UI 解耦；内容可来自静态数据文件。

#### 5. `ReadingSession`（应用层编排）

- **职责**：状态机驱动单次占卜：收集问题 → 选牌阵 → 洗牌/翻牌阶段 → 展示牌义 → 可选 AI → 持久化。
- **状态示意**：

```
QuestionEntered → SpreadSelected → Shuffling → Revealing(index) → MeaningsShown → [AiLoading → AiShown] → Completed
```

- **约束**：翻牌逐张推进；三牌阵在 `Revealing` 与牌位一一对应。

#### 6. `AiInterpreter`（服务端）

- **职责**：接收 `{ question, spread, cards: [{ positionLabel, cardName, orientation }] }`，调用 LLM，返回神秘语气中文长文。
- **接口要点**：`POST /api/interpret` → `{ text }` 或结构化段落。
- **Prompt 约束**：强调象征与命运感；结合位义；禁止替代医疗/法律/投资专业建议的强硬断言（产品虽无免责声明 UI，prompt 仍宜温和边界）。
- **约束**：不在客户端存放 API Key；对超时与 5xx 返回可重试错误码。

#### 7. `HistoryStore`

- **职责**：序列化/反序列化占卜记录；FIFO 保留最近 30 条。
- **记录形状**：

```
{
  id, createdAt,
  question, spreadId,
  cards: [{ positionId, cardId, orientation }],
  meanings: [{ positionId, text }],
  aiText?: string
}
```

- **接口要点**：`save(record)`, `list()`, `get(id)`, `prune(max=30)`。

#### 8. `Presentation`（UI 层，浅）

- 页面：首页（问题+牌阵）、仪式页（洗牌/翻牌）、结果页（牌义+AI 按钮）、历史列表/详情。
- 动画：CSS/轻量动画实现洗牌与翻牌；不嵌入业务规则。

### 三牌阵默认定义

| 牌位 id | 标签 |
|---------|------|
| `past` | 过去 |
| `present` | 现在 |
| `future` | 未来 |

### AI 请求契约

**Request body（概念）**：

- `question: string`（必填，由前端在抽牌前已校验）
- `spreadId: 'single' | 'three-card'`
- `cards: Array<{ positionLabel: string, cardNameZh: string, orientation: 'upright' | 'reversed' }>`

**Response**：

- `interpretation: string`（Markdown 或纯文本，前端原样渲染）

### 问题输入校验

- 必填；建议最小长度 4 个字符（实现时可配置），过滤纯空白。
- 不过度审查话题（用户选择无免责声明策略）；服务端 prompt 可对极端敏感类别做软性回避（实现细节，不阻塞 MVP）。

### PWA

- Web App Manifest：`name`, `icons`, `display: standalone`, `theme_color` 贴合深色神秘主题。
- Service Worker：缓存静态资源与牌图；**不缓存** AI API 响应。

### 开源牌组选型（实现时完成）

- 实现启动时必须选定一套明确许可的 78 张牌图并记录在 `Further Notes` 或 ADR。
- 禁止在未授权情况下使用 RWS 商业图源。

## Testing Decisions

### 原则

- 只测**可观察行为**，不测 CSS 类名或内部状态字段名。
- 优先测 deep modules；UI 用少量集成/smoke 测试即可。
- 无现有测试先例；建立 Vitest（或项目等价物）作为默认。

### 建议覆盖的模块

| 模块 | 测什么 |
|------|--------|
| `DrawEngine` | 单次 draw 返回正确数量；同次无重复 cardId；orientation 仅为 upright/reversed；固定 seed 可复现 |
| `SpreadRegistry` | 三牌阵 3 个牌位且顺序稳定 |
| `CardMeanings` | 已知 cardId+orientation 返回非空中文；逆位与正位文案不同 |
| `HistoryStore` | save 后 list 含条目；超过 30 条时最旧被 prune；get 还原 aiText |
| `ReadingSession` | 状态机：未完成翻牌不能进入 AiLoading；三牌阵需翻 3 次才到 MeaningsShown |
| `AiInterpreter` | 用 mock LLM：请求体含 question 与 cards；错误时返回约定错误形状 |

### 可不测或后测

- 洗牌/翻牌动画像素级表现。
- 具体 LLM 文案质量（人工验收清单即可）。
- PWA 安装提示在各浏览器的差异。

## Out of Scope

### MVP（Phase 1）不做

- **AI 深读**（整个 Phase 2，见 `issues/06-ai-deep-read.md`）
- 用户注册、登录、云端同步
- 付费、订阅、AI 限次/额度
- 凯尔特十字及其他多牌阵（>3 张）
- 自定义牌阵编辑器
- 中英文切换
- 免责声明或勾选合规 UI
- 社交分享、社区、评论
- 塔罗师工作台（客户管理、预约、收费）
- 用户自备 API Key
- 扇形手选牌堆、切牌等复杂仪式（MVP 仅洗牌+逐张翻）
- 原生 iOS/Android 应用商店包
- 微信小程序

## Further Notes

### 来自 grill 的产品决策摘要

| 维度 | 决定 |
|------|------|
| 产品形态 | 自助占卜 + 可选 AI 深读 |
| MVP 牌阵 | 单牌 + 三牌阵 |
| 牌系 | 韦特 78 张，正/逆 |
| 平台 | 手机 PWA |
| 流程 | 先写问题 → 洗牌 → 逐张翻 → 内置牌义 → 可选 AI |
| AI | 免费不限次；神秘语气；用户主动触发 |
| 历史 | 本机 ~30 条完整记录 |
| 视觉 | 深色神秘 + 开源牌图 |
| 语言 | 仅简体中文 |
| 免责声明 | 无 |

### 实现前待决事项

1. ~~**具体开源牌组文件名与许可证**~~ — 已完成，见 ADR-0002、`public/tarot-cards/`、`src/data/tarot/deck-manifest.json`。
2. **问题最小字数**（建议 4，可配置）。
3. **是否初始化 git 与远程仓库**（与本地 Issue 跟踪无关）。

### Phase 2 再定

1. **LLM 提供商与模型**（OpenAI、DeepSeek 等）。
2. AI 深读 UI 与 `AiInterpreter` 实现（Issue 06）。

### 后续可选增强（非本 PRD）

- `grill-with-docs` 建立 `CONTEXT.md` 统一术语（牌阵、AI 深读、求问者等）。
- `to-issues` 将本 PRD 拆为垂直切片实现 Issue。
- AI 限次、免责声明、更多牌阵、登录同步。

## Comments

<!-- 对话与修订记录追加于此 -->
