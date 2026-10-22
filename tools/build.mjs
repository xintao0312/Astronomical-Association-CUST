// Static site generator for the CUST 理工天文 site.
//
//   node tools/build.mjs
//
// Emits index.html, activities.html, gallery.html and 404.html from the shell
// below plus the per-page content modules in tools/pages/.  The generated HTML
// is plain static markup — the site runs with no build step at all; this script
// only exists so the header, footer and icon sprite stay in sync.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

import { loadSprite } from "./sprite.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const SPRITE = await loadSprite();

const NAV = [
  { href: "index.html", label: "首页", key: "home" },
  { href: "activities.html", label: "社团活动", key: "activities" },
  { href: "gallery.html", label: "星空画廊", key: "gallery" },
  { href: "about.html", label: "关于我们", key: "about" },
  { href: "index.html#join", label: "加入我们", key: "join" },
];

const FAVICON = "assets/img/favicon.png";

/**
 * Inline boot script: settle the theme before first paint so there is no flash.
 * Dark is the site default — a visitor who has never used the toggle gets dark
 * regardless of their OS setting. An explicit choice made with the header
 * toggle is stored and always wins, so light mode stays one click away.
 */
const THEME_BOOT = `(function () {
  var t = null;
  try { t = localStorage.getItem("cust-astro-theme"); } catch (e) {}
  if (t !== "light" && t !== "dark") t = "dark";
  document.documentElement.setAttribute("data-theme", t);
  var m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute("content", t === "dark" ? "#06070f" : "#eef4ff");
})();`;

/** The club badge (image/aaclogo1.png). One image; dark mode inverts it in CSS. */
function badgeMark() {
  return `<span class="brand__mark" aria-hidden="true">
          <picture>
            <source type="image/webp" srcset="assets/img/aac-badge-96.webp 1x, assets/img/aac-badge-192.webp 2x">
            <img src="assets/img/aac-badge-96.png"
                 srcset="assets/img/aac-badge-96.png 1x, assets/img/aac-badge-192.png 2x"
                 width="34" height="34" alt="" decoding="async">
          </picture>
        </span>`;
}

function brandMark() {
  return `<a class="brand" href="index.html" aria-label="CUST 理工天文 · 返回首页">
        ${badgeMark()}
        <span class="brand__text">
          <span class="brand__name">CUST 理工天文</span>
          <span class="brand__sub">Astronomical Association of CUST</span>
        </span>
      </a>`;
}

function nav(activeKey) {
  const items = NAV.map((item) => {
    const current = item.key === activeKey ? ' aria-current="page"' : "";
    return `          <li><a class="nav-link" href="${item.href}"${current}>${item.label}</a></li>`;
  }).join("\n");

  return `    <nav aria-label="主导航">
      <ul class="nav-menu" id="primary-menu">
${items}
      </ul>
    </nav>`;
}

function header(activeKey) {
  return `<header class="site-nav">
  <div class="shell nav-inner">
    ${brandMark()}

${nav(activeKey)}

    <div class="nav-actions">
      <button class="theme-toggle" type="button" data-theme-toggle data-active="dark"
              aria-label="切换到亮色模式" aria-pressed="true">
        <span class="theme-toggle__thumb" aria-hidden="true"></span>
        <span class="theme-toggle__opt" aria-hidden="true"><svg><use href="#i-sun"></use></svg></span>
        <span class="theme-toggle__opt" aria-hidden="true"><svg><use href="#i-moon"></use></svg></span>
      </button>

      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-menu" aria-label="打开导航菜单">
        <span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>
      </button>
    </div>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="shell">
    <div class="footer-grid">
      <div class="footer-brand">
        ${brandMark()}
        <p>成立于 2004 年 3 月 15 日，一个由学生自主运营的天文社团。抬头看星星这件事，我们希望有更多人一起做。</p>
      </div>

      <div class="footer-col">
        <h2>浏览</h2>
        <ul>
          <li><a href="index.html">首页</a></li>
          <li><a href="activities.html">社团活动</a></li>
          <li><a href="gallery.html">星空画廊</a></li>
          <li><a href="about.html">关于我们</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h2>参与</h2>
        <ul>
          <li><a href="index.html#join">加入我们</a></li>
          <li><a href="activities.html#act-cta-title">怎么参加</a></li>
          <li><a href="index.html#contact">联系方式</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h2>联络</h2>
        <ul>
          <li>QQ 群 884842421</li>
          <li><a href="mailto:xintao@mails.cust.edu.cn">xintao@mails.cust.edu.cn</a></li>
          <li>公众号：东北亚皇家理工天文</li>
        </ul>
      </div>
    </div>

    <p class="footer-legal">
      站内照片版权归长春理工大学天文协会及拍摄者所有：个人学习与非商业转载请注明来源，
      商业用途请先与我们联系（<a href="gallery.html#usage">使用说明</a>）。
      代码以 <a href="https://opensource.org/license/mit" rel="noopener">MIT</a> 许可发布，
      照片以
      <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans" rel="noopener">CC BY-NC-SA 4.0</a>
      许可发布；徽标与名称保留所有权利。
    </p>

    <div class="footer-bottom">
      <p>©<span data-year hidden></span> CUST 理工天文 · 本站照片均由社团成员拍摄</p>
      <p>网站设计&amp;运营：王鑫涛</p>
      <p>Built with plain HTML &amp; CSS</p>
    </div>
  </div>
</footer>`;
}

/**
 * 站点公告弹窗。内容改这里；是否再次弹出由 assets/js/main.js 里的
 * NOTICE_KEY 控制（改版本号即可让所有访客重新看到一次）。
 */
function noticeDialog() {
  return `<dialog class="notice" data-notice aria-labelledby="notice-title" aria-describedby="notice-body">
  <div class="notice__inner">
    <p class="chip chip--brand">测试阶段</p>
    <h2 class="notice__title" id="notice-title">本站仍在完善中</h2>

    <div class="notice__body" id="notice-body">
      <p>
        当前网站属于测试阶段：图片尚未完成筛选与上传，页面内容也仍在设计调整中。
        因此你看到的内容可能随时变化，有缺失或不当之处还请见谅。
      </p>
      <ul class="notice__links">
        <li>
          <span class="notice__links-label">临时测试站点</span>
          <a href="https://astra.xintao.fun" rel="noopener">astra.xintao.fun</a>
        </li>
        <li>
          <span class="notice__links-label">正式站点（迁移后）</span>
          <a href="https://www.astracust.cn" rel="noopener">www.astracust.cn</a>
        </li>
      </ul>
    </div>

    <form method="dialog" class="notice__actions">
      <button class="btn btn--primary" value="dismiss">我知道了</button>
    </form>
  </div>
</dialog>`;
}

function shell(page) {
  const bodyClass = page.bodyClass ? ` class="${page.bodyClass}"` : "";
  const photoHead = page.content.includes("page-head--photo");
  const preloadSrc = page.preload || (photoHead ? "assets/img/milkyway-horizon.jpg" : null);
  const preload = preloadSrc
    ? `\n<link rel="preload" as="image" href="${preloadSrc}" media="(min-width: 861px)">`
    : "";

  return `<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
<meta name="theme-color" content="#06070f">
<meta name="color-scheme" content="light dark">

<meta property="og:type" content="website">
<meta property="og:site_name" content="CUST 理工天文">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:image" content="assets/img/milkyway-horizon-1400.jpg">

<link rel="icon" type="image/png" href="${FAVICON}">
<link rel="apple-touch-icon" href="${FAVICON}">

<!-- theme applied before first paint: no flash of the wrong scheme -->
<script>
${THEME_BOOT}
</script>
<style>
  :root{background:#eef4ff}
  :root[data-theme="dark"]{background:#06070f}
</style>${preload}

<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/main.css">
</head>
<body${bodyClass}>
<a class="skip-link" href="#main">跳到主要内容</a>

<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true" focusable="false">
  <defs>
${SPRITE}
  </defs>
</svg>

<div class="scroll-progress" aria-hidden="true"></div>

${header(page.nav)}

<main id="main">
${page.content}
</main>

${footer()}

<button class="to-top" type="button" aria-label="回到顶部">
  <svg aria-hidden="true"><use href="#i-arrow-up"></use></svg>
</button>

<p class="visually-hidden" id="theme-live" role="status" aria-live="polite"></p>

${noticeDialog()}

<script src="assets/js/main.js" defer></script>
</body>
</html>
`;
}

const PAGES = [
  { name: "index", module: "./pages/home.mjs" },
  { name: "activities", module: "./pages/activities.mjs" },
  { name: "gallery", module: "./pages/gallery.mjs" },
  { name: "about", module: "./pages/about.mjs" },
  { name: "404", module: "./pages/notfound.mjs" },
];

for (const entry of PAGES) {
  const mod = await import(pathToFileURL(join(here, entry.module)).href);
  const page = mod.default;
  const html = shell(page);
  const out = join(root, `${entry.name}.html`);
  await writeFile(out, html, "utf8");
  console.log(`wrote ${entry.name}.html  (${html.length} bytes)`);
}

// Keep the sprite file honest: if it drifts, fail loudly rather than silently.
const iconsCount = (SPRITE.match(/<symbol /g) || []).length;
console.log(`sprite symbols: ${iconsCount}`);
const rawIcons = await readFile(join(root, "assets", "icons.svg"), "utf8");
console.log(`icons.svg bytes: ${rawIcons.length}`);
