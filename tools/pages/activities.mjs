// Activities page content.
//
// 页面分两部分：
//   1. 「常规项目」— 四条常年运行的线，是这一页的正文。
//   2. 「怎么参加」— 三步说明 + 加入入口。
//
// 原先的「活动排期」「观测记录」「全年的观测节奏」三个板块已移除：
// 日程取决于天气与天象，随时会变，统一以群消息为准；
// 写死在页面上只会过时，观测记录也已在「星空画廊」里按年份呈现。

export default {
  nav: "activities",
  title: "社团活动 · CUST 理工天文",
  description:
    "路边天文夜、摄影工坊、天文讲堂、星空观测营 —— CUST 理工天文的四条常规活动线，以及参与方式。",
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
      <p class="lede">
        四条常年运行的线，覆盖观测、拍摄与讲解；再加上每年一次的远途观测营。
        不需要天文基础，也不需要自备器材。
      </p>
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

  <!-- ============================== how to join ============================== -->
  <section class="section" aria-labelledby="act-cta-title">
    <div class="shell">
      <div class="cta reveal">
        <p class="eyebrow eyebrow--center">怎么参加</p>
        <h2 id="act-cta-title">不用报名，来一次就知道了</h2>
        <p>
          协会全年开放，也不收会费；不需要任何天文基础，器材都由协会提供。
        </p>
        <div class="btn-row">
          <a class="btn btn--primary" href="index.html#join">
            加入我们
            <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"></use></svg>
          </a>
          <a class="btn btn--ghost" href="gallery.html">先看看照片</a>
        </div>
      </div>

      <div class="grid grid--3 mt-3" data-stagger="80">
        <article class="card reveal">
          <span class="card__icon" aria-hidden="true"><svg><use href="#i-chat"></use></svg></span>
          <h3>一、加群</h3>
          <p>
            加入 QQ 群 <strong>884842421</strong>。活动时间不固定 —— 要看天气和天象，
            所以所有安排都只发在群里。
          </p>
        </article>

        <article class="card reveal">
          <span class="card__icon" aria-hidden="true"><svg><use href="#i-pin"></use></svg></span>
          <h3>二、来现场</h3>
          <p>
            路边天文夜多在朝阳校区东区物理学院；摄影工坊与天文讲堂在物理学院 713。
            可以只看不动手，待多久都行。
          </p>
        </article>

        <article class="card reveal">
          <span class="card__icon" aria-hidden="true"><svg><use href="#i-telescope"></use></svg></span>
          <h3>三、不用带东西</h3>
          <p>
            望远镜、赤道仪、相机都由协会准备，人来就行。
            如果去野外，记得穿厚一些 —— 夜里的温度比白天低得多。
          </p>
        </article>
      </div>
    </div>
  </section>
`,
};
