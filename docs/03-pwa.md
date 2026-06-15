# PWA 配置与图标

本项目是可安装到主屏幕的渐进式 Web 应用（PWA）。本文说明图标资源、manifest、Service Worker，以及各平台安装与排错。

技术选型见 `docs/01-tech-stack.md`（Serwist + Next.js manifest）。

## 能力概览

| 能力 | 实现 |
|------|------|
| 主屏幕安装 | `manifest.ts` + 多尺寸图标 |
| 独立窗口 | `display: standalone` |
| 主题色 / 启动背景 | `theme_color` `#1a0f2e`，`background_color` `#0a0612` |
| 离线壳页面 | Serwist Service Worker 缓存静态资源 |
| iOS 优化 | `apple-touch-icon`、`appleWebApp` 元数据 |

AI 接口响应**不**走 SW 缓存，仅静态资源与页面壳。

## 文件结构

```
public/
  favicon.svg                 # 浏览器标签页（矢量）
  icons/
    icon.svg                  # 主图标源文件（编辑这个）
    icon-maskable.svg         # Android 自适应图标源文件
    favicon-32.png
    icon-192.png
    apple-touch-icon.png      # iOS 主屏幕 180×180
    icon-512.png
    icon-maskable-512.png     # purpose: maskable
src/
  app/manifest.ts             # Web App Manifest（/manifest.webmanifest）
  app/layout.tsx              # icons、appleWebApp、themeColor 元数据
  sw.ts                       # Service Worker 入口
scripts/
  generate-pwa-icons.mjs      # SVG → PNG 导出脚本
next.config.ts                # @serwist/next 集成
```

## 修改图标

1. 编辑 `public/icons/icon.svg`（标准图标）或 `public/icons/icon-maskable.svg`（带安全边距，供 Android 裁切为圆形/圆角矩形）。
2. 重新生成 PNG：

```bash
pnpm icons
```

3. 构建并部署后，在手机上验证主屏幕图标。

设计要点：

- 主图标使用圆角矩形画布（`rx="112"`），贴近 iOS 视觉。
- maskable 版本图形更靠中心，避免被系统裁切掉边缘。
- SVG 内避免中文注释与特殊 Unicode 字符（如行星符号），否则 `sharp` 导出可能失败。

## 开发 vs 生产

| 环境 | Service Worker |
|------|----------------|
| `pnpm dev` | **禁用**（`next.config.ts` 中 `disable: NODE_ENV === "development"`） |
| `pnpm build && pnpm start` | 启用，产物在 `public/sw.js` |

完整 PWA 体验（离线、安装）请在生产构建或已部署环境测试。

```bash
pnpm build && pnpm start
# 默认 http://localhost:3000
```

## 安装到主屏幕

### iOS（Safari）

1. 用 **Safari** 打开站点（Chrome 等第三方浏览器无法完整支持「添加到主屏幕」）。
2. 分享 → **添加到主屏幕**。
3. 可修改显示名（默认来自 `short_name`：「塔罗」）。

### Android（Chrome）

1. 打开站点，地址栏或菜单中会出现「安装应用」或「添加到主屏幕」。
2. 安装后使用 `maskable` 图标，系统会裁成圆形或 squircle。

## 主屏幕出现两个图标？

常见原因是**不同时间添加了两次**快捷方式，iOS 不会自动替换旧条目：

| 外观 | 说明 |
|------|------|
| 金圈 + 紫色三角、方角 | 旧版占位图标，可删除 |
| 金色六芒星、圆角、深紫渐变 | **当前正式图标**，保留这个 |

处理：长按删除旧图标，只保留六芒星版本。若重新添加仍显示旧图，可在 设置 → Safari → 清除历史记录与网站数据 后重新访问并添加。

## 主题色与启动体验

`src/app/globals.css` 中定义了应用视觉 token，与 manifest 对齐：

- `--color-void` `#0a0612` — 启动 / 背景
- `--color-mystic-deep` `#1a0f2e` — 主题色、状态栏

`layout.tsx` 中 `viewport.themeColor` 与 manifest 的 `theme_color` 一致，保证浏览器 UI 与 PWA 壳统一。

## 相关配置摘录

Manifest 由 `src/app/manifest.ts` 动态生成，路由为 `/manifest.webmanifest`。

Serwist 在 `next.config.ts` 中注册：`swSrc: src/sw.ts`，构建输出 `public/sw.js`（已 gitignore，由 `pnpm build` 生成）。

## 故障排查

**主屏幕图标没更新**

- 删除旧快捷方式，清除 Safari 网站数据后重新添加。
- 确认访问的是已部署的最新版本（非旧缓存页面）。

**离线打不开**

- 确认是生产构建（SW 在 dev 下关闭）。
- 至少成功访问过一次，SW 才会 precache 静态资源。

**`pnpm icons` 报错 XML parse error**

- 检查 SVG 是否含中文注释或特殊字符，改用纯 ASCII 注释与几何图形。
