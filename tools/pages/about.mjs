// About page content.
//
// 全面版「关于我们」。主页只留一段简介 + 一个入口按钮，具体介绍放在这里。
//
// 内容原则与全站一致：确定的信息直接写死（成立日期、人数、地点、联系方式、
// 三个小组的职责），未知的具体数字用 ［…］ 占位符，不编造。
//
// 照片信息来自 ../photos.mjs，与星空画廊共用同一份数据。

import { getShot } from "../photos.mjs";
import { frameFigure } from "../partials.mjs";

const groupFrame = frameFigure(getShot("group-outdoor"));

export default {
  nav: "about",
  title: "关于我们 · CUST 理工天文",
  description:
    "CUST 理工天文成立于 2004 年 3 月 15 日，是长春理工大学由学生自主运营的天文社团。这里有我们的来历、观测组/摄影组/科普组三个小组的分工，以及加入方式。",
  content: `
  <!-- ============================== page head ============================== -->
  <section class="page-head page-head--photo" aria-labelledby="page-title">
    <div class="starfield" data-starfield aria-hidden="true"></div>
    <div class="shell">
      <nav aria-label="面包屑">
        <ol class="breadcrumb">
          <li><a href="index.html">首页</a></li>
          <li aria-current="page">关于我们</li>
        </ol>
      </nav>
      <p class="eyebrow">About us</p>
      <h1 id="page-title">关于我们</h1>
      <p class="lede">
        一个由学生自主运营的天文社团。二十二年过去，我们还在做同一件事：
        把望远镜架起来，让人看一眼真正的星空。
      </p>
    </div>
  </section>

  <!-- ============================== who we are ============================== -->
  <section class="section" aria-labelledby="who-title">
    <div class="shell">
      <div class="section-head reveal">
        <p class="eyebrow">关于我们</p>
        <h2 id="who-title">让星空离我们更近一点</h2>
        <p>
          长春理工大学天文协会成立于 2004 年 3 月 15 日，由几位在操场上辨认星座的同学发起，如今已经走过了二十二年。
        </p>
      </div>

      <div class="split">
        <div class="prose reveal">
          <p>
            我们的活动从最简单的事情开始：把望远镜搬到人多的地方，让路过的人看一眼土星环。
            很多成员的第一张月面照片，就诞生在这样一个普通的夜晚。
          </p>
          <p>
            二十二年里，器材在换、人在换、观测的地点也在换，但方式没变过 ——
            找一个能把灯关掉的地方，等天暗下来，然后一个个把看到的东西指给旁边的人看。
          </p>
          <p>
            我们不是天文专业的学生，也不要求新成员有任何基础。你只需要对头顶那片东西好奇，
            剩下的，器材、方法、连同看星星的习惯，都可以在这里慢慢学。
          </p>

          <div class="btn-row mt-2">
            <a class="btn btn--ghost" href="activities.html">
              看看我们办的活动
              <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"></use></svg>
            </a>
          </div>
        </div>

        ${groupFrame}
      </div>
    </div>
  </section>

  <!-- ============================== the three groups ============================== -->
  <section class="section section--tinted" aria-labelledby="groups-title">
    <div class="shell">
      <div class="section-head section-head--center reveal">
        <p class="eyebrow">兴趣方向</p>
        <h2 id="groups-title">三个方向，各凭兴趣</h2>
        <p>
          协会设有观测组、摄影组与科普组 —— 但这不是严格的分工，也从来没有「只能选一个」的说法。
          三个小组更像三个方向：谁对什么感兴趣，就去做那件事，很多人三边都参与。
          没有人被分配任务，但每件事都有人愿意做。
        </p>
      </div>

      <div class="grid grid--3" data-stagger="90">
        <article class="card reveal">
          <span class="card__icon" aria-hidden="true"><svg><use href="#i-telescope"></use></svg></span>
          <h3>观测组</h3>
          <p>
            器材维护、活动选址与天象预报，通常从这里发起。
            哪一晚适合出门，先看星历和天气，再在群里喊一声。
          </p>
          <div class="card__meta">
            <span><svg aria-hidden="true"><use href="#i-pin"></use></svg>器材维护 · 选址 · 天象预报</span>
          </div>
        </article>

        <article class="card reveal">
          <span class="card__icon" aria-hidden="true"><svg><use href="#i-camera"></use></svg></span>
          <h3>摄影组</h3>
          <p>
            深空与广域拍摄、后期处理，是这里的日常话题。
            成员拍到的作品会在摄影工坊里一起看，交流怎么拍、怎么修。
          </p>
          <div class="card__meta">
            <span><svg aria-hidden="true"><use href="#i-aperture"></use></svg>拍摄 · 后期 · 作品交流</span>
          </div>
        </article>

        <article class="card reveal">
          <span class="card__icon" aria-hidden="true"><svg><use href="#i-globe"></use></svg></span>
          <h3>科普组</h3>
          <p>
            对接中小学与社区，把星空带出校园。
            讲座、路边天文、对外讲解，多数从这里组织起来。
          </p>
          <div class="card__meta">
            <span><svg aria-hidden="true"><use href="#i-users"></use></svg>对外讲解 · 社区科普</span>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- ============================== faq ============================== -->
  <section class="section section--tinted" aria-labelledby="faq-title">
    <div class="shell">
      <div class="section-head reveal">
        <p class="eyebrow">常见问题</p>
        <h2 id="faq-title">第一次来之前，你可能想知道</h2>
      </div>

      <div class="grid grid--2" data-stagger="80">
        <article class="card reveal">
          <h3>需要自己买望远镜吗？</h3>
          <p>
            不需要。协会配备在役望远镜与赤道仪，成员无需自备设备即可参加全部观测活动。
          </p>
        </article>

        <article class="card reveal">
          <h3>完全不懂天文也能来吗？</h3>
          <p>
            可以。我们每学期开设入门课程，从认星、对极轴到堆栈后期。
            我们欢迎你来，希望你玩得开心，至于天文学知识，忘掉它吧。
          </p>
        </article>

        <article class="card reveal">
          <h3>活动什么时候、在哪里？</h3>
          <p>
            地点固定在朝阳校区东区物理学院，时间不固定 —— 观测要看天气，
            具体安排以群消息为准。
          </p>
        </article>

        <article class="card reveal">
          <h3>怎么加入、怎么联系？</h3>
          <p>
            加 QQ 群 884842421，或关注公众号「东北亚皇家理工天文」。
          </p>
        </article>
      </div>
    </div>
  </section>

  <!-- ============================== cta ============================== -->
  <section class="section" aria-labelledby="about-cta-title">
    <div class="shell">
      <div class="cta reveal">
        <p class="eyebrow eyebrow--center">加入我们</p>
        <h2 id="about-cta-title">下一次观测，一起来看</h2>
        <p>
          招新全年开放，不需要任何基础。带上你自己来一次活动就够了，
          其余的事情，我们会在现场慢慢教你。
        </p>
        <div class="btn-row">
          <a class="btn btn--primary" href="index.html#contact">
            查看联系方式
            <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"></use></svg>
          </a>
          <a class="btn btn--ghost" href="gallery.html">先看看照片</a>
        </div>
      </div>
    </div>
  </section>
`,
};
