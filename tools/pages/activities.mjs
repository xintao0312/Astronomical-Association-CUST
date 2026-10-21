// Activities page content.
//
// 页面分两部分：
//   1. 「常规项目」— 四条常年运行的线，内容完整，是这一页的正文。
//   2. 其余小节 — 仅保留版式骨架（表格列头、时间线节点、卡片结构），
//      文字内容用 ［…］ 占位符代替，由社团按实际内容填写。

const SCHEDULE_COLUMNS = ["日期", "活动", "负责小组", "地点", "观测 / 内容重点", "参与方式"];
const SCHEDULE_ROWS = 8;

const LOG_COLUMNS = ["日期", "站点", "目标", "器材", "累计曝光", "天空条件", "记录人"];
const LOG_ROWS = 4;

/** 每张表都保留列头，用 ［列名］ 占位，社团照着填即可。 */
function placeholderRows(columns, count) {
  const cells = columns
    .map((c) => `<td><span class="ph">［${c}］</span></td>`)
    .join("");
  return Array.from({ length: count }, () => `          <tr>${cells}</tr>`).join("\n");
}

const scheduleCols = SCHEDULE_COLUMNS.map(
  (c) => `              <th scope="col">${c}</th>`
).join("\n");

const logCols = LOG_COLUMNS.map(
  (c) => `              <th scope="col">${c}</th>`
).join("\n");

/** 时间线条目：结构保留，日期与文字为占位符。 */
const TIMELINE = [
  { datetime: "YYYY-MM", range: "［起止月份］", title: "［主题标题］" },
  { datetime: "YYYY-MM", range: "［起止月份］", title: "［主题标题］" },
  { datetime: "YYYY-MM", range: "［起止月份］", title: "［主题标题］" },
];

const timelineItems = TIMELINE.map(
  (t) => `            <li>
              <time datetime="${t.datetime}">${t.range}</time>
              <h3><span class="ph">${t.title}</span></h3>
              <p class="ph-block">［说明文字］</p>
            </li>`
).join("\n");

export default {
  nav: "activities",
  title: "社团活动 · CUST 理工天文",
  description:
    "路边天文夜、摄影工坊、天文讲堂、星空观测营 —— CUST 理工天文的常规活动介绍，以及本学期日程与观测记录。",
  content: `
  <!-- ============================== page head ============================== -->
  <section class="page-head page-head--photo" aria-labelledby="page-title">
    <div class="starfield" data-starfield aria-hidden="true"></div>
    <div class="shell">
      <nav aria-label="面包屑">
        <ol class="breadcrumb">
          <li><a href="index.html">首页</a></li>
          <li aria-current="page">社团活动</li>
        </ol>
      </nav>
      <p class="eyebrow">Activities</p>
      <h1 id="page-title">社团活动</h1>
      <p class="lede ph-block">［页面导语］</p>
    </div>
  </section>

  <!-- ============================== four programmes ============================== -->
  <section class="section" aria-labelledby="programmes-title">
    <div class="shell">
      <div class="section-head reveal">
        <p class="eyebrow">常规项目</p>
        <h2 id="programmes-title">四条常年运行的线</h2>
        <p>每个项目都有各自的节奏，你可以按自己的兴趣任选其一，也可以全都参加；具体安排以群消息为准。</p>
      </div>

      <div class="grid grid--2" data-stagger="90">
        <article class="card reveal">
          <span class="card__icon" aria-hidden="true"><svg><use href="#i-telescope"></use></svg></span>
          <h3>路边天文夜</h3>
          <p>
            协会最日常的活动。在朝阳校区东区物理学院架设 3—4 台望远镜，
            面向全校师生和附近居民开放。我们会安排一名讲解员轮流介绍当晚可见的目标，
            从月面环形山到土星环。
          </p>
          <div class="card__meta">
            <span><svg aria-hidden="true"><use href="#i-clock"></use></svg>关注群消息</span>
            <span><svg aria-hidden="true"><use href="#i-pin"></use></svg>朝阳校区东区物理学院</span>
            <span><svg aria-hidden="true"><use href="#i-users"></use></svg>开放参与</span>
          </div>
        </article>

        <article class="card reveal">
          <span class="card__icon" aria-hidden="true"><svg><use href="#i-camera"></use></svg></span>
          <h3>摄影工坊</h3>
          <p>
            社团成员拍摄的精美作品，大家共同欣赏并交流拍摄心得。
          </p>
          <div class="card__meta">
            <span><svg aria-hidden="true"><use href="#i-pin"></use></svg>物理学院 713</span>
          </div>
        </article>

        <article class="card reveal">
          <span class="card__icon" aria-hidden="true"><svg><use href="#i-book"></use></svg></span>
          <h3>天文讲堂</h3>
          <p>
            不定期开展，主题从恒星演化、星系动力学到引力波与系外行星探测，
            或是天文观测与古天文。
          </p>
          <div class="card__meta">
            <span><svg aria-hidden="true"><use href="#i-clock"></use></svg>不定期开展</span>
            <span><svg aria-hidden="true"><use href="#i-pin"></use></svg>物理学院 713</span>
            <span><svg aria-hidden="true"><use href="#i-users"></use></svg>不限人数</span>
          </div>
        </article>

        <article class="card reveal">
          <span class="card__icon" aria-hidden="true"><svg><use href="#i-globe"></use></svg></span>
          <h3>星空观测营</h3>
          <p>
            每年一次的远途观测，通宵拍摄与目视观测。
            出发前进行装备分配与安全说明，现场按小组划分观测区域，
            次日清晨统一返程并整理观测记录归档。
          </p>
          <div class="card__meta">
            <span><svg aria-hidden="true"><use href="#i-clock"></use></svg>每年一次</span>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- ============================== schedule ============================== -->
  <section class="section section--tinted" id="schedule" aria-labelledby="schedule-title">
    <div class="shell">
      <div class="section-head reveal">
        <p class="eyebrow">本学期日程</p>
        <h2 id="schedule-title">活动排期</h2>
        <p class="ph-block">［排期说明］</p>
      </div>

      <div class="log-wrap reveal">
        <table class="log-table">
          <caption>［学期排期表］</caption>
          <thead>
            <tr>
${scheduleCols}
            </tr>
          </thead>
          <tbody>
${placeholderRows(SCHEDULE_COLUMNS, SCHEDULE_ROWS)}
          </tbody>
        </table>
      </div>

      <div class="note mt-2 reveal">
        <svg aria-hidden="true"><use href="#i-info"></use></svg>
        <p class="ph-block">［天气与顺延预案说明］</p>
      </div>
    </div>
  </section>

  <!-- ============================== observation log ============================== -->
  <section class="section" aria-labelledby="log-title">
    <div class="shell">
      <div class="section-head reveal">
        <p class="eyebrow">观测记录</p>
        <h2 id="log-title">观测记录</h2>
        <p class="ph-block">［观测记录的用途说明］</p>
      </div>

      <div class="log-wrap reveal">
        <table class="log-table">
          <caption>［观测记录表］</caption>
          <thead>
            <tr>
${logCols}
            </tr>
          </thead>
          <tbody>
${placeholderRows(LOG_COLUMNS, LOG_ROWS)}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ============================== a year in the club ============================== -->
  <section class="section section--tinted" aria-labelledby="timeline-title">
    <div class="shell">
      <div class="split">
        <div class="reveal">
          <div class="section-head">
            <p class="eyebrow">一年四季</p>
            <h2 id="timeline-title">全年的观测节奏</h2>
            <p class="ph-block">［季节节奏说明］</p>
          </div>

          <ol class="timeline">
${timelineItems}
          </ol>
        </div>

        <figure class="frame reveal">
          <img src="assets/img/milkyway-horizon.jpg"
               srcset="assets/img/milkyway-horizon-900.jpg 900w, assets/img/milkyway-horizon-1400.jpg 1400w, assets/img/milkyway-horizon.jpg 2000w"
               sizes="(max-width: 860px) 92vw, 44vw"
               width="2000" height="1493" loading="lazy" decoding="async"
               alt="［图片说明］">
          <figcaption><span class="ph">［图片说明］</span></figcaption>
        </figure>
      </div>
    </div>
  </section>

  <!-- ============================== cta ============================== -->
  <section class="section" aria-labelledby="act-cta-title">
    <div class="shell">
      <div class="cta reveal">
        <p class="eyebrow eyebrow--center">怎么参加</p>
        <h2 id="act-cta-title"><span class="ph">［标题］</span></h2>
        <p class="ph-block">［参加方式说明］</p>
        <div class="btn-row">
          <a class="btn btn--primary" href="index.html#join">
            加入我们
            <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"></use></svg>
          </a>
          <a class="btn btn--ghost" href="gallery.html">先看看照片</a>
        </div>
      </div>
    </div>
  </section>
`,
};
