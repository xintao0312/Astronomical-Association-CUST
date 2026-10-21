/* ==========================================================================
   CUST 天文协会 — main.js
   Theme switching, sticky chrome, scroll reveal, starfield, lightbox.
   No dependencies; all progressive enhancement.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var params = new URLSearchParams(window.location.search);

  /**
   * `?motion=off` renders everything in its final state. It exists for
   * screenshots, print/export pipelines and automated visual checks, where a
   * scroll-triggered fade would otherwise be captured half-finished.
   */
  var motionOff = params.get("motion") === "off";
  if (motionOff) root.setAttribute("data-motion", "off");

  var reduceMotion =
    motionOff || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Honour an explicit ?theme=light|dark for demos and link sharing.
  var forcedTheme = params.get("theme");
  if (forcedTheme === "light" || forcedTheme === "dark") {
    try {
      window.localStorage.setItem("cust-astro-theme", forcedTheme);
    } catch (err) {
      /* ignore */
    }
    root.setAttribute("data-theme", forcedTheme);
  }

  /* ------------------------------------------------------------------ *
   * Theme
   *
   * Dark is the site default: the inline boot script in each page's <head>
   * has already set data-theme to dark unless the visitor chose light. This
   * block therefore never consults prefers-color-scheme — an OS preference
   * must not override the site's own default.
   * ------------------------------------------------------------------ */

  var STORE_KEY = "cust-astro-theme";

  function storedTheme() {
    try {
      var value = window.localStorage.getItem(STORE_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (err) {
      return null;
    }
  }

  function persistTheme(value) {
    try {
      window.localStorage.setItem(STORE_KEY, value);
    } catch (err) {
      /* private mode: theme simply will not persist */
    }
  }

  function syncToggle(theme) {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("data-active", theme);
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"
      );
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      var hint = btn.querySelector("[data-theme-hint]");
      if (hint) {
        hint.textContent = theme === "dark" ? "亮色模式" : "暗色模式";
      }
    });
  }

  function applyTheme(theme, announce) {
    var meta = document.querySelector('meta[name="theme-color"]');
    root.setAttribute("data-theme", theme);
    syncToggle(theme);
    if (meta) {
      meta.setAttribute(
        "content",
        theme === "dark" ? "#06070f" : "#eef4ff"
      );
    }
    if (announce) {
      var live = document.getElementById("theme-live");
      if (live) {
        live.textContent =
          theme === "dark" ? "已切换到暗色模式" : "已切换到亮色模式";
      }
    }
  }

  // The boot script already resolved this; the attribute is the source of
  // truth. The fallback only matters if that script was stripped.
  applyTheme(
    storedTheme() || root.getAttribute("data-theme") || "dark",
    false
  );

  document.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-theme-toggle]");
    if (!btn) return;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next, true);
    persistTheme(next);
  });

  /* ------------------------------------------------------------------ *
   * Sticky nav, scroll progress, back-to-top
   * ------------------------------------------------------------------ */

  var nav = document.querySelector(".site-nav");
  var progress = document.querySelector(".scroll-progress");
  var toTop = document.querySelector(".to-top");
  var ticking = false;

  function onScrollFrame() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var max =
      document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

    if (nav) nav.classList.toggle("is-stuck", y > 12);
    if (progress) progress.style.setProperty("--progress", ratio.toFixed(4));
    if (toTop) toTop.classList.toggle("is-visible", y > 620);
    ticking = false;
  }

  function requestScrollFrame() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScrollFrame);
    }
  }

  window.addEventListener("scroll", requestScrollFrame, { passive: true });
  window.addEventListener("resize", requestScrollFrame, { passive: true });
  onScrollFrame();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Mobile menu
   * ------------------------------------------------------------------ */

  var navToggle = document.querySelector(".nav-toggle");
  var navMenu = document.getElementById("primary-menu");

  function closeMenu() {
    if (!navToggle || !navMenu) return;
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function (event) {
      event.stopPropagation();
      var open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navMenu.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("click", function (event) {
      if (!navMenu.classList.contains("is-open")) return;
      if (!event.target.closest(".nav-menu") && !event.target.closest(".nav-toggle")) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* ------------------------------------------------------------------ *
   * Scroll reveal
   * ------------------------------------------------------------------ */

  var revealables = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealables.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealables.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // Stagger siblings inside a marked container.
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    var step = parseInt(group.getAttribute("data-stagger"), 10) || 90;
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty("--reveal-delay", i * step + "ms");
    });
  });

  /* ------------------------------------------------------------------ *
   * Starfield — drawn as DOM spans, tinted by theme tokens
   * ------------------------------------------------------------------ */

  var field = document.querySelector("[data-starfield]");

  if (field && !reduceMotion) {
    var count = window.innerWidth < 700 ? 54 : 108;
    var frag = document.createDocumentFragment();
    var seed = 20250908;

    // deterministic pseudo-random so the sky is stable between page loads
    function rand() {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    }

    for (var i = 0; i < count; i++) {
      var star = document.createElement("i");
      var size = (rand() * 2.2 + 0.7).toFixed(2);
      star.className = "star";
      star.style.left = (rand() * 100).toFixed(3) + "%";
      star.style.top = (rand() * 100).toFixed(3) + "%";
      star.style.width = size + "px";
      star.style.height = size + "px";
      star.style.opacity = (rand() * 0.55 + 0.35).toFixed(2);
      star.style.animationDelay = (rand() * 7).toFixed(2) + "s";
      star.style.animationDuration = (rand() * 4 + 3.5).toFixed(2) + "s";
      if (rand() > 0.9) star.style.setProperty("--star-color", "var(--accent-2)");
      frag.appendChild(star);
    }
    field.appendChild(frag);
  }

  /* ------------------------------------------------------------------ *
   * Lightbox
   * ------------------------------------------------------------------ */

  var galleryRoot = document.querySelector("[data-gallery]");
  var lightbox = document.querySelector("[data-lightbox]");

  if (galleryRoot && lightbox) {
    var shots = Array.prototype.slice.call(
      galleryRoot.querySelectorAll("[data-full]")
    );
    var stageImg = lightbox.querySelector("[data-lb-img]");
    var titleEl = lightbox.querySelector("[data-lb-title]");
    var descEl = lightbox.querySelector("[data-lb-desc]");
    var counterEl = lightbox.querySelector("[data-lb-counter]");
    var index = 0;
    var lastFocus = null;

    function pad(n) {
      return n < 10 ? "0" + n : String(n);
    }

    function render(i) {
      index = (i + shots.length) % shots.length;
      var shot = shots[index];
      var img = shot.querySelector("img");

      stageImg.src = shot.getAttribute("data-full");
      stageImg.alt = img ? img.alt : "";
      var fullSet = shot.getAttribute("data-full-srcset");
      if (fullSet) {
        stageImg.srcset = fullSet;
        stageImg.sizes = "(max-width: 900px) 100vw, 90vw";
      } else {
        stageImg.removeAttribute("srcset");
        stageImg.removeAttribute("sizes");
      }

      titleEl.textContent = shot.getAttribute("data-title") || "";
      descEl.textContent = shot.getAttribute("data-desc") || "";
      counterEl.textContent = pad(index + 1) + " / " + pad(shots.length);
    }

    function open(i, trigger) {
      lastFocus = trigger || document.activeElement;
      render(i);
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      var closeBtn = lightbox.querySelector(".lightbox__close");
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    shots.forEach(function (shot, i) {
      shot.addEventListener("click", function () {
        open(i, shot);
      });
      shot.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open(i, shot);
        }
      });
    });

    lightbox.addEventListener("click", function (event) {
      if (event.target.closest("[data-lb-close]")) {
        close();
        return;
      }
      if (event.target.closest("[data-lb-prev]")) {
        render(index - 1);
        return;
      }
      if (event.target.closest("[data-lb-next]")) {
        render(index + 1);
        return;
      }
      // clicking the backdrop (not the image or controls) dismisses
      if (event.target === lightbox || event.target.classList.contains("lightbox__stage")) {
        close();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") close();
      else if (event.key === "ArrowLeft") render(index - 1);
      else if (event.key === "ArrowRight") render(index + 1);
      else if (event.key === "Tab") {
        // keep focus inside the dialog
        var focusables = lightbox.querySelectorAll("button");
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    // swipe support
    var startX = null;
    lightbox.addEventListener(
      "touchstart",
      function (event) {
        startX = event.changedTouches[0].clientX;
      },
      { passive: true }
    );
    lightbox.addEventListener(
      "touchend",
      function (event) {
        if (startX === null) return;
        var delta = event.changedTouches[0].clientX - startX;
        if (Math.abs(delta) > 55) render(delta < 0 ? index + 1 : index - 1);
        startX = null;
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------ *
   * Site notice dialog
   *
   * 用的是原生 <dialog>：焦点被困在弹窗内、Esc 关闭都由浏览器负责。
   *
   * 频次默认「每个浏览会话一次」（sessionStorage）：同一会话里翻页面不再打扰，
   * 重新打开浏览器会再看到一次 —— 公告讲的是迁移与测试状态，值得让回访者
   * 也看到。想改频次只动 STORAGE 与 NOTICE_KEY 两行：
   *   localStorage  → 只弹一次，之后永不打扰
   *   （改用 memory）→ 每次加载都弹
   * ------------------------------------------------------------------ */

  var notice = document.querySelector("[data-notice]");

  if (notice && typeof notice.showModal === "function") {
    var STORAGE = "sessionStorage";
    var NOTICE_KEY = "cust-astro-notice-v1";
    var noticeState = null;
    try {
      noticeState = window[STORAGE].getItem(NOTICE_KEY);
    } catch (err) {
      /* 隐私模式读不到，就当没关过 */
    }

    var noticeQuery = params.get("notice");
    var shouldShow =
      noticeQuery === "1" || (noticeQuery !== "off" && noticeState !== "dismissed");

    if (shouldShow) {
      // 等首帧渲染完再弹，避免和字体、图片加载抢同一帧
      window.requestAnimationFrame(function () {
        notice.showModal();
        root.setAttribute("data-notice-open", "");
        var firstBtn = notice.querySelector("button");
        if (firstBtn) firstBtn.focus();
      });
    }

    // close 事件同时覆盖「我知道了」按钮、Esc、以及遮罩点击
    notice.addEventListener("close", function () {
      root.removeAttribute("data-notice-open");
      try {
        window[STORAGE].setItem(NOTICE_KEY, "dismissed");
      } catch (err) {
        /* ignore */
      }
    });

    // 点击遮罩（dialog 元素本身，而不是内容区）也可以关闭
    notice.addEventListener("click", function (event) {
      if (event.target === notice) notice.close();
    });
  }

  /* ------------------------------------------------------------------ *
   * Footer year + smooth anchor scrolling for same-page links
   * ------------------------------------------------------------------ */

  // The year is rendered from the VISITOR's clock, in their browser, so the
  // deployed file never goes stale and the server stays a plain file server.
  // The span ships `hidden` and is revealed here: without JS there is simply
  // no year, rather than a hard-coded one that silently ages.
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
    el.hidden = false;
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      var navH = parseInt(
        getComputedStyle(root).getPropertyValue("--nav-h"),
        10
      ) || 66;
      var top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });
})();
