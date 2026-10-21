// Gallery page content.
//
// 照片数据不在这里 —— 全部来自 ../photos.mjs（全站唯一数据源）。
// 改标题、地点、时间、alt、年份请改那个文件，画廊与首页会同步更新。
//
// 版式：按拍摄年份折叠分组（<details>，默认全部展开），
// 组内把同一拍摄地的照片排在一起；两列等大的 4:3 方格（见 .shot）。

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
  return `          <figure class="shot reveal" data-full="${files.full}"
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

/** 把 note 里的中文日期转成可排序的键；没有日期的排到最后。 */
function dateKey(shot) {
  const full = /(\d{4}) 年 (\d{1,2}) 月 (\d{1,2}) 日/.exec(shot.note ?? "");
  if (full) {
    return `${full[1]}-${full[2].padStart(2, "0")}-${full[3].padStart(2, "0")}`;
  }
  const yearOnly = /(\d{4}) 年/.exec(shot.note ?? "");
  if (yearOnly) return `${yearOnly[1]}-00-00`;
  return "9999-99-99";
}

/**
 * 组内排序：先按拍摄地聚合（同地点的照片相邻）。
 *   byDate = true  → 地点之间、地点内部都按时间先后（年份组用）
 *   byDate = false → 保持数据里的书写顺序（专属分组用，可人工编排，
 *                    比如深空天体按 M31 → M42 → M57 → NGC 6888 排）
 */
function sortWithin(group, byDate = true) {
  const places = new Map();
  for (const shot of group) {
    const key = shot.place ?? "\u0000";
    if (!places.has(key)) places.set(key, []);
    places.get(key).push(shot);
  }
  const lists = [...places.values()].map((list) =>
    byDate
      ? list.slice().sort((a, b) => dateKey(a).localeCompare(dateKey(b)))
      : list.slice()
  );
  return (byDate
    ? lists.sort((a, b) => dateKey(a[0]).localeCompare(dateKey(b[0])))
    : lists
  ).flat();
}

/**
 * 分组规则：
 *   1. 带 `group` 字段的照片进**专属分组**（如「星空毕业典礼」），不并入年份，
 *      按在数据里的出现顺序排在所有年份分组之前
 *   2. 其余按 `year` 分组，年份从新到旧，没有年份的排最后
 *   3. 每组内部按 sortWithin() 排序
 */
function groupShots(shots) {
  const specials = [];
  const specialIndex = new Map();
  const years = new Map();

  for (const shot of shots) {
    if (shot.group) {
      if (!specialIndex.has(shot.group)) {
        specialIndex.set(shot.group, {
          label: shot.group,
          note: shot.groupNote ?? "",
          shots: [],
        });
        specials.push(shot.group);
      }
      specialIndex.get(shot.group).shots.push(shot);
      continue;
    }
    const key = shot.year ?? null;
    if (!years.has(key)) years.set(key, []);
    years.get(key).push(shot);
  }

  const yearKeys = [...years.keys()].sort((a, b) => {
    if (a === null) return 1;
    if (b === null) return -1;
    return b - a;
  });

  const specialGroups = specials.map((name) => {
    const g = specialIndex.get(name);
    const sorted = sortWithin(g.shots, false);
    return { label: g.label, note: g.note, shots: sorted, size: sorted.length };
  });

  const yearGroups = yearKeys.map((year) => {
    const sorted = sortWithin(years.get(year));
    return {
      label: year === null ? "年份待补" : `${year} 年`,
      note: year === null ? "待补充拍摄年份" : "",
      shots: sorted,
      size: sorted.length,
    };
  });

  return [...specialGroups, ...yearGroups];
}

let counter = 0;

function photoGroup({ label, note, shots, size }) {
  const inner = shots.map((s) => figure(s, counter++)).join("\n\n");
  const summaryNote = note ? `${size} 张 · ${note}` : `${size} 张`;
  return `        <details class="photo-group reveal" open>
          <summary class="photo-group__head">
            <span class="photo-group__label">${label}</span>
            <span class="photo-group__count">${summaryNote}</span>
            <span class="photo-group__chevron" aria-hidden="true">
              <svg><use href="#i-chevron-right"></use></svg>
            </span>
          </summary>

          <div class="gallery-grid" data-stagger="70">
${inner}
          </div>
        </details>`;
}
const groups = groupShots(SHOTS);



export default {
  nav: "gallery",
  title: "星空画廊 · CUST 理工天文",
  description:
    "CUST 理工天文成员拍摄的星空作品：从 2023 年到 2026 年，黑龙江、吉林与内蒙古各地的银河、极光、月食与深空天体摄影，按年份分组。",
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
        这里的每一张都出自社团成员之手，跨度从 2023 年到 2026 年，
        拍摄地从松花江畔一直延伸到兴安岭的夜里。
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

      <div class="note note--usage mb-2 reveal" id="usage">
        <svg aria-hidden="true"><use href="#i-info"></use></svg>
        <p>
          <strong>使用说明：</strong>
          站内照片版权归长春理工大学天文协会及拍摄者所有。个人学习与非商业转载请注明来源；
          商业用途请先通过邮件与我们联系。
          照片以 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans" rel="noopener">CC BY-NC-SA 4.0</a>
          授权，代码以 MIT 授权。
        </p>
      </div>

      <div class="gallery-years" data-gallery>
${groups.map(photoGroup).join("\n\n")}
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
