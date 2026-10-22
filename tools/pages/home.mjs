// Home page content.
//
// 图片信息（标题、拍摄地、时间、alt、取景位置）全部来自 ../photos.mjs，
// 与星空画廊共用同一份数据 —— 画廊里改了，这里自动跟着变。
// 本页独有、不放进照片数据的只有两样：
//   · 卡片上的分类小标签（chip）
//   · 卡片配文（copy）
// 二者写在下面的 HIGHLIGHTS 里。

import { getShot } from "../photos.mjs";
import { frameFigure, mediaCard } from "../partials.mjs";

/** 「最近的活动」展示的三张作品（key 必须存在于 photos.mjs）。 */
const HIGHLIGHTS = [
  {
    key: "eclipse",
    chip: "月食",
    copy: "月亮整个落进地球的影子，却没有消失，而是被穿过大气的红光染成暗铜色，边缘还留着一圈亮。",
  },
  {
    key: "ngc6888",
    chip: "深空摄影",
    copy: "一片被中心恒星风吹开的发光气壳，形状像一弯新月。要累积几个小时的曝光，才能从星场里把它显出来。",
  },
  {
    key: "aurora-1",
    chip: "极光",
    copy: "极光把地平线染成粉紫，银河正压在它上方。这样的夜晚要等 —— 天时、天气、和一点运气。",
  },
];

const highlightCards = HIGHLIGHTS.map((item) =>
  mediaCard(getShot(item.key), { chip: item.chip, copy: item.copy })
).join("\n\n");

/** 与关于页共用的那张合影。 */
const groupFrame = frameFigure(getShot("group-outdoor"));


export default {
  nav: "home",
  title: "CUST 理工天文 · 把夜空读给你听",
  description:
    "CUST 理工天文 — 长春理工大学的星空爱好者社群。路边天文夜、摄影工坊、天文讲堂与星空观测营，从校园到野外观测站点。",
  preload: "assets/img/milkyway-horizon.jpg",
  content: `
  <!-- ============================== hero ============================== -->
  <section class="hero" aria-labelledby="hero-title">
    <div class="starfield" data-starfield aria-hidden="true"></div>
    <div class="hero__aura" aria-hidden="true"></div>

    <div class="shell">
      <div class="hero__copy">
        <p class="eyebrow">Astronomical Association of CUST</p>
        <h1 class="hero__title" id="hero-title">
          把夜空<br><span class="gradient-text">读给你听</span>
          <span class="hero__title-en">Look up · 抬头就是宇宙</span>
        </h1>
        <p class="hero__lede">
          从校园广场到野外宁静的夜空下，我们架起望远镜，也架起一群人对星空的好奇。
          不论你是刚学会辨认北极星，还是已经能独立完成一次深空后期，这里都留了一个位置。
        </p>

        <div class="btn-row">
          <a class="btn btn--primary" href="#join">
            加入我们
            <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"></use></svg>
          </a>
          <a class="btn btn--ghost" href="gallery.html">看看我们的照片</a>
        </div>

        <div class="hero__meta">
          <span class="hero__meta-item">
            <svg aria-hidden="true"><use href="#i-calendar"></use></svg>
            活动时间 · <strong>关注群消息</strong>
          </span>
          <span class="hero__meta-item">
            <svg aria-hidden="true"><use href="#i-pin"></use></svg>
            活动地点 · <strong>朝阳校区东区物理学院</strong>
          </span>
          <span class="hero__meta-item">
            <svg aria-hidden="true"><use href="#i-users"></use></svg>
            招新 · <strong>全年开放</strong>
          </span>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================== stats ============================== -->
  <section class="section section--flush-top" aria-label="社团概况">
    <div class="shell">
      <div class="stat-band reveal" data-stagger="80">
        <div class="stat">
          <span class="stat__num stat__num--date gradient-text">2004.03.15</span>
          <span class="stat__label">成立日期</span>
        </div>
        <div class="stat">
          <span class="stat__num gradient-text">22</span>
          <span class="stat__label">年连续开展活动</span>
        </div>
        <div class="stat">
          <span class="stat__num gradient-text">70+</span>
          <span class="stat__label">协会成员</span>
        </div>
        <div class="stat">
          <span class="stat__num gradient-text ph">［待填］</span>
          <span class="stat__label">台在役望远镜</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================== about ============================== -->
  <section class="section" id="about" aria-labelledby="about-title">
    <div class="shell">
      <div class="section-head reveal">
        <p class="eyebrow">关于我们</p>
        <h2 id="about-title">让星空离我们更近一点</h2>
        <p>
          长春理工大学天文协会成立于 2004 年 3 月 15 日，由几位在操场上辨认星座的同学发起，如今已经走过了二十二年。
        </p>
      </div>

      <div class="split">
        <div class="prose reveal">
          <p>
            我们的活动从最简单的事情开始：把望远镜搬到人多的地方，让路过的人看一眼土星环。
            很多成员的第一张月面照片，就诞生在这样一个普通的周五晚上。
          </p>

          <ul class="check-list">
            <li>
              <svg aria-hidden="true"><use href="#i-check"></use></svg>
              <span>
                <strong>器材不设门槛</strong>
                协会配备多台在役望远镜与赤道仪，成员无需自备设备即可参加全部观测活动。
              </span>
            </li>
            <li>
              <svg aria-hidden="true"><use href="#i-check"></use></svg>
              <span>
                <strong>从零开始的教学</strong>
                每学期开设入门课程，从认星、对极轴到堆栈后期，讲完就能自己拍一张银河。
              </span>
            </li>
            <li>
              <svg aria-hidden="true"><use href="#i-check"></use></svg>
              <span>
                <strong>安全的远途观测</strong>
                所有外出观测采用集体出行、分组带队、行程报备制度，夜间返回有专人清点人数。
              </span>
            </li>
          </ul>

          <div class="btn-row mt-2">
            <a class="btn btn--ghost" href="about.html">
              了解协会的更多
              <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"></use></svg>
            </a>
          </div>
        </div>

        ${groupFrame}
      </div>
    </div>
  </section>

  <!-- ============================== activities preview ============================== -->
  <section class="section section--tinted" aria-labelledby="act-title">
    <div class="shell">
      <div class="section-head section-head--center reveal">
        <p class="eyebrow">我们在做什么</p>
        <h2 id="act-title">三件我们一直在做的事</h2>
        <p>观测、拍摄、讲解 —— 主要就是这三件事。</p>
      </div>

      <div class="grid grid--3" data-stagger="90">
        <article class="card reveal">
          <span class="card__icon" aria-hidden="true"><svg><use href="#i-telescope"></use></svg></span>
          <h3>路边天文夜</h3>
          <p>在朝阳校区东区物理学院架设望远镜，面向全校师生开放，无需报名。</p>
          <div class="card__meta">
            <span><svg aria-hidden="true"><use href="#i-clock"></use></svg>关注群消息</span>
          </div>
        </article>

        <article class="card reveal">
          <span class="card__icon" aria-hidden="true"><svg><use href="#i-camera"></use></svg></span>
          <h3>摄影工坊</h3>
          <p>社团成员拍摄的精美作品，大家共同欣赏并交流拍摄心得。</p>
        </article>

        <article class="card reveal">
          <span class="card__icon" aria-hidden="true"><svg><use href="#i-book"></use></svg></span>
          <h3>天文讲堂</h3>
          <p>不定期开展，主题涵盖恒星演化、引力波、系外行星探测，或是天文观测与古天文。</p>
          <div class="card__meta">
            <span><svg aria-hidden="true"><use href="#i-clock"></use></svg>不定期开展</span>
          </div>
        </article>
      </div>

      <div class="btn-row mt-3 reveal">
        <a class="btn btn--ghost" href="activities.html">
          查看完整活动安排
          <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"></use></svg>
        </a>
      </div>
    </div>
  </section>

  <!-- ============================== highlights ============================== -->
  <section class="section" aria-labelledby="hl-title">
    <div class="shell">
      <div class="section-head reveal">
        <p class="eyebrow">最近的活动</p>
        <h2 id="hl-title">从校园广场到宁静的野外</h2>
        <p>从松花江畔到兴安岭的夜里，都是成员自己拍下来的。完整作品在星空画廊。</p>
      </div>

      <div class="grid grid--3" data-stagger="90">
${highlightCards}
      </div>

      <div class="btn-row mt-3 reveal">
        <a class="btn btn--ghost" href="gallery.html">
          进入星空画廊
          <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"></use></svg>
        </a>
      </div>
    </div>
  </section>

  <!-- ============================== join ============================== -->
  <section class="section" id="join" aria-labelledby="join-title">
    <div class="shell">
      <div class="cta reveal">
        <p class="eyebrow eyebrow--center">加入我们</p>
        <h2 id="join-title">不需要任何基础，只需要一点好奇</h2>
        <p>
          招新全年开放。带上你自己来一次观测活动就够了 —— 其余的事情，我们会在现场慢慢教你。
          如果你已经有拍摄经验，也欢迎直接联系摄影组交流。
        </p>

        <div class="btn-row">
          <a class="btn btn--primary" href="#contact">
            查看联系方式
            <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"></use></svg>
          </a>
          <a class="btn btn--ghost" href="activities.html">看看有哪些活动</a>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================== contact ============================== -->
  <section class="section section--flush-top" id="contact" aria-labelledby="contact-title">
    <div class="shell">
      <div class="section-head reveal">
        <p class="eyebrow">联系方式</p>
        <h2 id="contact-title">找到我们</h2>
      </div>

      <div class="grid grid--2" data-stagger="80">
        <div class="contact-card reveal">
          <span class="contact-card__icon" aria-hidden="true"><svg><use href="#i-pin"></use></svg></span>
          <span>
            <span class="contact-card__label">活动地点</span>
            <span class="contact-card__value">朝阳校区东区物理学院</span>
          </span>
        </div>

        <div class="contact-card reveal">
          <span class="contact-card__icon" aria-hidden="true"><svg><use href="#i-clock"></use></svg></span>
          <span>
            <span class="contact-card__label">活动时间</span>
            <span class="contact-card__value">关注群消息</span>
          </span>
        </div>

        <div class="contact-card reveal">
          <span class="contact-card__icon" aria-hidden="true"><svg><use href="#i-mail"></use></svg></span>
          <span>
            <span class="contact-card__label">邮箱</span>
            <a class="contact-card__value" href="mailto:xintao@mails.cust.edu.cn">xintao@mails.cust.edu.cn</a>
          </span>
        </div>

        <div class="contact-card reveal">
          <span class="contact-card__icon" aria-hidden="true"><svg><use href="#i-chat"></use></svg></span>
          <span>
            <span class="contact-card__label">社团交流群</span>
            <span class="contact-card__value">QQ 群 884842421</span>
          </span>
        </div>

        <div class="contact-card reveal">
          <span class="contact-card__icon" aria-hidden="true"><svg><use href="#i-sparkle"></use></svg></span>
          <span>
            <span class="contact-card__label">公众号</span>
            <span class="contact-card__value">东北亚皇家理工天文</span>
          </span>
        </div>
      </div>

      <div class="note mt-3 reveal">
        <svg aria-hidden="true"><use href="#i-info"></use></svg>
        <p>
          <strong>关于时间与天气：</strong>
          观测活动对云量敏感。活动当天 17:00 前，我们会在交流群发布「照常／顺延」的确认通知，
          出发前请务必查看一次。远途观测需提前报名并签署出行告知。
        </p>
      </div>
    </div>
  </section>
`,
};
