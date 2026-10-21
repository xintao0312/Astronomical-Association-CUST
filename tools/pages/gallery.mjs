// Gallery page content.
//
// 照片数据不在这里 —— 全部来自 ../photos.mjs（全站唯一数据源）。
// 改标题、地点、时间、alt 请改那个文件，画廊与首页会同步更新。
//
// 网格是两列等大的 4:3 方格（见 assets/css/main.css 的 .shot），13 张照片
// 全部为横向构图（1.30—1.51），裁切极小。数组顺序即展示顺序。

import { SHOTS, photoFiles, photoSrcset, photoMeta } from "../photos.mjs";

function figure(shot, index) {
  const files = photoFiles(shot);
  const id = `shot-${index + 1}`;
  // 图说 = 拍摄地（带定位图标）+ 时间/类别，二者都可缺省。
  // 定位图标只在有拍摄地时出现 —— 月食、深空这类作品没有地点，不应带定位标。
  const meta = photoMeta(shot);
  const pin = shot.place
    ? `<svg aria-hidden="true"><use href="#i-pin"></use></svg>`
    : "";
  const label = meta ? `${shot.title}（${meta}）` : shot.title;
  const metaRow = meta
    ? `<span class="shot__meta">${pin}${meta}</span>`
    : "";
  return `        <figure class="shot reveal" data-full="${files.full}"
                  data-full-srcset="${files.fullSrcset}"
                  data-title="${shot.title}" data-desc="${meta}"
                  tabindex="0" role="button" aria-labelledby="${id}-cap"
                  aria-label="放大查看：${label}">
          <img src="${files.thumb}"
               srcset="${photoSrcset(shot)}"
               sizes="(max-width: 860px) 92vw, 47vw"
               style="object-position: ${shot.focus || "center"}"
               loading="lazy" decoding="async"
               alt="${shot.alt}">
          <figcaption class="shot__caption" id="${id}-cap">
            <span class="shot__text">
              <span class="shot__title">${shot.title}</span>
              ${metaRow}
            </span>
            <span class="shot__zoom" aria-hidden="true"><svg><use href="#i-zoom"></use></svg></span>
          </figcaption>
        </figure>`;
}

const grid = SHOTS.map(figure).join("\n");


export default {
  nav: "gallery",
  title: "星空画廊 · CUST 理工天文",
  description:
    "CUST 理工天文成员拍摄的星空作品：向海自然保护区的银河与极光、星星哨水库的野外观测、官马莲花山的银河，以及月食与深空天体摄影。",
  content: `
  <!-- ============================== page head ============================== -->
  <section class="page-head page-head--photo" aria-labelledby="page-title">
    <div class="starfield" data-starfield aria-hidden="true"></div>
    <div class="shell">
      <nav aria-label="面包屑">
        <ol class="breadcrumb">
          <li><a href="index.html">首页</a></li>
          <li aria-current="page">星空画廊</li>
        </ol>
      </nav>
      <p class="eyebrow">Gallery</p>
      <h1 id="page-title">星空画廊</h1>
      <p class="lede">
        这里的每一张都出自社团成员之手，拍摄地从校园周边一直延伸到吉林各地的暗夜站点。
        点击任意一张可以放大，查看拍摄地与时间。
      </p>
    </div>
  </section>

  <!-- ============================== grid ============================== -->
  <section class="section" aria-labelledby="grid-title">
    <div class="shell">
      <div class="section-head reveal">
        <p class="eyebrow">作品选</p>
        <h2 id="grid-title">我们拍过的星空</h2>
        <p>每一张都是一次抬头 —— 在不一样的地方，遇见同一片星空。</p>
      </div>

      <div class="gallery-grid" data-gallery data-stagger="80">
${grid}
      </div>

      <div class="note mt-3 reveal">
        <svg aria-hidden="true"><use href="#i-info"></use></svg>
        <p>
          <strong>使用说明：</strong>
          站内照片版权归 CUST 理工天文及拍摄者所有。个人学习与非商业转载请注明来源；
          商业用途请先通过邮件与我们联系。
        </p>
      </div>
    </div>
  </section>

  <!-- ============================== how we shoot ============================== -->
  <section class="section section--tinted" aria-labelledby="method-title">
    <div class="shell">
      <div class="section-head reveal">
        <p class="eyebrow">拍摄方法</p>
        <h2 id="method-title">这些照片是怎么拍出来的</h2>
        <p class="ph-block">［拍摄方法说明］</p>
      </div>

      <div class="grid grid--3" data-stagger="90">
        <article class="card reveal">
          <span class="card__icon" aria-hidden="true"><svg><use href="#i-compass"></use></svg></span>
          <h3>一 · 选址与踩点</h3>
          <p class="ph-block">［说明文字］</p>
        </article>

        <article class="card reveal">
          <span class="card__icon" aria-hidden="true"><svg><use href="#i-aperture"></use></svg></span>
          <h3>二 · 对极轴与构图</h3>
          <p class="ph-block">［说明文字］</p>
        </article>

        <article class="card reveal">
          <span class="card__icon" aria-hidden="true"><svg><use href="#i-sparkle"></use></svg></span>
          <h3>三 · 堆栈与调色</h3>
          <p class="ph-block">［说明文字］</p>
        </article>
      </div>

      <div class="stat-band mt-3 reveal" data-stagger="80">
        <div class="stat">
          <span class="stat__num gradient-text ph">［时长］</span>
          <span class="stat__label">单幅作品累计曝光上限</span>
        </div>
        <div class="stat">
          <span class="stat__num gradient-text ph">［光圈］</span>
          <span class="stat__label">广域拍摄常用光圈</span>
        </div>
        <div class="stat">
          <span class="stat__num gradient-text ph">［感光度］</span>
          <span class="stat__label">深空单张推荐感光度</span>
        </div>
        <div class="stat">
          <span class="stat__num gradient-text ph">［误差］</span>
          <span class="stat__label">极轴误差控制目标</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================== lightbox ============================== -->
  <div class="lightbox" data-lightbox role="dialog" aria-modal="true" aria-label="照片查看器" aria-hidden="true">
    <div class="lightbox__bar">
      <span class="lightbox__counter" data-lb-counter>01 / 04</span>
      <button class="lightbox__close" type="button" data-lb-close aria-label="关闭">
        <svg aria-hidden="true"><use href="#i-close"></use></svg>
      </button>
    </div>

    <div class="lightbox__stage">
      <button class="lightbox__nav lightbox__nav--prev" type="button" data-lb-prev aria-label="上一张">
        <svg aria-hidden="true"><use href="#i-chevron-left"></use></svg>
      </button>
      <img data-lb-img src="assets/img/milkyway-camp-900.jpg" alt="">
      <button class="lightbox__nav lightbox__nav--next" type="button" data-lb-next aria-label="下一张">
        <svg aria-hidden="true"><use href="#i-chevron-right"></use></svg>
      </button>
    </div>

    <div class="lightbox__foot">
      <p class="lightbox__title" data-lb-title>［图片标题］</p>
      <p class="lightbox__desc" data-lb-desc></p>
    </div>
  </div>
`,
};
