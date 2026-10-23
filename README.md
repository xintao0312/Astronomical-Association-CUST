# CUST 理工天文 · 社团网站

长春理工大学天文协会的官方网站 —— **纯静态站点，零运行时依赖**。
没有框架、没有打包、没有数据库，克隆下来双击 `index.html` 就能看。

- 线上地址：<https://astra.xintao.fun>
- 正式站点（迁移后）：<https://www.astracust.cn>

## 网站内容

| 页面 | 内容 |
|---|---|
| `index.html` | 首页：社团简介、社团概况、活动线预览、最近作品、加入方式、联系方式 |
| `about.html` | 关于我们：社团来历、观测组 / 摄影组 / 科普组的分工、常见问题 |
| `activities.html` | 社团活动：路边天文夜、摄影工坊、天文讲堂、星空观测营，以及参与方式 |
| `gallery.html` | 星空画廊：社员作品，按年份折叠分组，支持灯箱放大与键盘切换 |
| `404.html` | 自定义错误页 |

## 特点

- **纯静态。** 全部是 HTML / CSS / 原生 JavaScript，服务器只需把文件发出去。
  构建脚本只是为了让页头、页脚与图标集保持单一来源，**删掉 `tools/` 整个目录，网站照常运行**。
- **深浅主题。** 默认暗色，可在右上角切换，选择记在 `localStorage`。
  主题在首屏绘制之前就已确定，不会闪白或闪黑。
- **响应式。** 窄屏自动降为单列，导航折叠为抽屉。
- **可访问性。** 正文对比度满足 WCAG AA；灯箱是真正的对话框（`aria-modal`、
  Esc 关闭、方向键切换、焦点锁定）；有跳到主内容的 skip link；
  `prefers-reduced-motion` 下关闭全部动画。
- **浏览器支持。** 面向现代 Chromium 内核（Chrome、Edge 及基于 Chromium 的浏览器）。
  不为 Safari / WebKit 做单独适配 —— 见 [AGENTS.md](AGENTS.md)。
- **图片做了多尺寸与格式。** 每张作品按宽度分档，同时提供 JPEG 与 WebP，
  通过 `srcset` 让浏览器按屏幕挑选。

## 目录结构

```
.
├─ index.html            首页与各子页：生成结果，即最终部署的文件
├─ about.html
├─ activities.html
├─ gallery.html
├─ 404.html
│
├─ assets/
│  ├─ css/base.css       设计令牌（亮暗配色）、重置样式、通用排版
│  ├─ css/main.css       组件与布局：导航、hero、卡片、画廊、页脚、灯箱
│  ├─ js/main.js         主题切换、吸顶导航、滚动进度、星空、滚动揭示、灯箱
│  ├─ icons.svg          界面图标的唯一来源
│  └─ img/               图片资源：作品、社徽、hero 背景、favicon
│
└─ tools/                构建与自检脚本（可选，网站本身不依赖）
   ├─ build.mjs          由 pages/ 生成各页面 HTML
   ├─ pages/*.mjs        各页面正文
   ├─ photos.mjs         照片的标题、地点、时间、alt、取景
   ├─ partials.mjs       相框与卡片片段
   ├─ verify.mjs         校验链接、锚点、图片与图标引用
   ├─ audit-theme.mjs    审计亮暗令牌配对、色相走向、对比度
   ├─ optimize_images.py 由原始素材生成 assets/img/ 各尺寸与 WebP
   ├─ sprite.mjs         由图标定义生成 assets/icons.svg
   ├─ serve.mjs          本地预览服务器
   └─ size_report.py     按文件类型统计体积
```

## 本地预览

直接双击 `index.html` 即可。想用 http 协议（更接近真实环境）：

```bash
node tools/serve.mjs          # 启动本地预览服务器
```

或者任意静态服务器：

```bash
python -m http.server
```

## 重新生成页面

```bash
node tools/build.mjs          # 由 tools/pages/*.mjs 生成各页面 HTML
node tools/verify.mjs         # 校验链接、锚点、图片与图标引用
node tools/audit-theme.mjs    # 审计主题令牌与对比度
```

生成出来的就是普通静态文件，可以像编辑任何 HTML 一样直接改；只是下次运行
`build.mjs` 时会被覆盖。

## 图片

`assets/img/` 是唯一会被部署的图片目录。原始素材（高分辨率相机原图）**不在仓库里**，
因为体积过大。要重新生成各尺寸需要自备原图，并在 `tools/optimize_images.py`
里登记源文件名，然后：

```bash
python tools/optimize_images.py
```

只重新生成其中几张（新增素材时更快）：

```bash
python tools/optimize_images.py --only m42b
```

该脚本需要 Python 与 Pillow：`pip install Pillow`。

## URL 参数

| 参数 | 作用 |
|---|---|
| `?theme=dark` / `?theme=light` | 强制指定主题并记住，方便分享与截图 |
| `?motion=off` | 关闭滚动揭示与星点闪烁，直接渲染终态，适合截图与自动化视觉检查 |

例：`gallery.html?theme=dark&motion=off`

## 许可

仓库里的内容授权各不相同：

| 内容 | 位置 | 授权 | 全文 |
|---|---|---|---|
| 源代码（HTML / CSS / JS / 构建脚本） | `*.html`、`assets/css/`、`assets/js/`、`tools/` | **MIT** | [LICENSE](LICENSE) |
| 摄影作品 | `assets/img/` | **CC BY-NC-SA 4.0** | [LICENSE-PHOTOS](LICENSE-PHOTOS) |
| 社团徽标与名称 | `assets/img/aac-badge-*`、`favicon.png`、「长春理工大学天文协会」 | **保留所有权利** | [NOTICE](NOTICE) |

- **代码可以自由使用**，改一份给自己的社团也欢迎，保留版权声明即可。
- **照片可署名非商业转载。** 转载时请署名为 **长春理工大学天文协会**（站名「CUST 理工天文」
  是本站的展示用简称，不用作署名）；商业用途请先联系 <xintao@mails.cust.edu.cn>。
- **徽标与名称请勿用作他方标识**，避免来源混淆；引用、报道本站时正常展示不受限制。

站内也写明了授权范围：画廊作品上方的使用说明，以及每个页面页脚的授权行。

## 联系

- 邮箱：<xintao@mails.cust.edu.cn>
- QQ 群：884842421
- 公众号：东北亚皇家理工天文

---

本项目为纯静态站点，可部署到任意静态托管或自建服务器，不需要 Node.js、Python、
PHP 或数据库。
