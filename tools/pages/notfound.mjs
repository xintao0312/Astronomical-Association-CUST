// 404 page content.

export default {
  nav: "",
  title: "页面走丢了 · CUST 理工天文",
  description: "这个地址没有对应的页面 —— 也许是链接写错了，或者它已经随着星移斗转被移到别处。",
  content: `
  <section class="hero" aria-labelledby="nf-title" style="min-height:min(80vh,720px)">
    <div class="starfield" data-starfield aria-hidden="true"></div>
    <div class="hero__aura" aria-hidden="true"></div>

    <div class="shell" style="max-width:66ch">
      <p class="eyebrow">Error 404</p>
      <h1 class="hero__title" id="nf-title">
        这颗星<br><span class="gradient-text">不在星图上</span>
      </h1>
      <p class="hero__lede">
        你要找的页面不存在，或者已经被移到了别处。
        不妨回到首页，或者直接去看看我们最近拍的照片。
      </p>

      <div class="btn-row">
        <a class="btn btn--primary" href="index.html">
          回到首页
          <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"></use></svg>
        </a>
        <a class="btn btn--ghost" href="gallery.html">星空画廊</a>
      </div>
    </div>
  </section>
`,
};
