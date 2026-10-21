// 页面之间共用的 HTML 片段。
//
// 这些片段只依赖 photos.mjs 的数据，所以画廊里改了标题／地点／时间，
// 用到它们的地方会自动同步。

import { photoFiles, photoSrcset, photoMeta } from "./photos.mjs";

/**
 * 带说明条的相框（首页「关于我们」与关于页各用一处）。
 * 说明条左侧是拍摄地（定位图标），右侧是时间/类别。
 */
export function frameFigure(
  shot,
  { sizes = "(max-width: 860px) 92vw, 44vw", className = "frame reveal" } = {}
) {
  const files = photoFiles(shot);
  const meta = photoMeta(shot);
  const pin = shot.place
    ? `<svg aria-hidden="true"><use href="#i-pin"></use></svg>`
    : "";
  const dims = shot.size
    ? `width="${shot.size[0]}" height="${shot.size[1]}" `
    : "";
  const place = shot.place
    ? `<span class="frame__place">
              ${pin}
              ${shot.place}
            </span>`
    : "";
  const note = shot.note
    ? `<span class="frame__note">${shot.note}</span>`
    : "";

  return `<figure class="${className}">
          <img src="${files.full}"
               srcset="${photoSrcset(shot)}"
               sizes="${sizes}"
               ${dims}loading="lazy" decoding="async"
               alt="${shot.alt}">
          <figcaption>
            ${place}
            ${note}
          </figcaption>
        </figure>`;
}

/**
 * 首页「最近的活动」里的媒体卡片。
 * `chip` 是卡片上的分类小标签，`copy` 是本页专属的配文 ——
 * 这两项属于首页文案，不放进照片数据里。
 */
export function mediaCard(shot, { chip = "", copy = "" } = {}) {
  const files = photoFiles(shot);
  const meta = photoMeta(shot);
  const pin = shot.place
    ? `<svg aria-hidden="true"><use href="#i-pin"></use></svg>`
    : "";
  const chipRow = chip ? `<p class="chip chip--brand">${chip}</p>` : "";

  return `<article class="card card--media reveal">
          <div class="card__thumb">
            <img src="${files.thumb}"
                 srcset="${photoSrcset(shot)}"
                 sizes="(max-width: 860px) 92vw, 30vw"
                 style="object-position: ${shot.focus || "center"}"
                 loading="lazy" decoding="async"
                 alt="${shot.alt}">
            <figcaption>
              <span class="card__thumb-meta">${pin}${meta}</span>
            </figcaption>
          </div>
          <div class="card__body">
            ${chipRow}
            <h3>${shot.title}</h3>
            <p>${copy}</p>
          </div>
        </article>`;
}
