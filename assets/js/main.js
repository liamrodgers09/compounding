/* =========================================================================
   main.js: the only script that runs the site.
   Jobs: the light/dark theme toggle, the mobile menu toggle, the "Current"
   menu and status block, and rendering the post lists. Plain vanilla JS.
   ========================================================================= */

(function () {
  "use strict";

  /* =====================================================================
     EDIT YOUR "CURRENT" STATUS HERE
     Put a short line next to any of these. Leave a value as "" to hide it
     from both the Current menu and the Reading List page. Fill one in later
     and it appears in both places automatically, nothing else to change.
     ===================================================================== */
  var CURRENT = {
    researching:
      "How a managing partner at a financial planning firm builds and curates his clients' plans",
    reading:
      "The Stranger in the Woods: The Extraordinary Story of the Last True Hermit, by Michael Finkel",
    question:
      "Are the 100-hour weeks investment banking is known for actually worth it for the pay?"
  };

  /* ---------- Theme toggle (light / dark) ----------------------------- */
  // The theme itself is applied before paint by a small inline script in each
  // page's <head>. Here we add the toggle button and remember the choice.
  var root = document.documentElement;
  var themeButton = null;

  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Briefly enable a global color transition so the light/dark switch
  // cross-fades instead of snapping. Skipped when reduced motion is on.
  var themeAnimTimer = null;
  function smoothThemeChange() {
    if (prefersReducedMotion) return;
    root.classList.add("theme-anim");
    if (themeAnimTimer) clearTimeout(themeAnimTimer);
    themeAnimTimer = setTimeout(function () {
      root.classList.remove("theme-anim");
    }, 360);
  }

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function applyTheme(theme, persist) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    if (persist) {
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {}
    }
    if (themeButton) {
      var dark = theme === "dark";
      themeButton.setAttribute("aria-pressed", dark ? "true" : "false");
      themeButton.setAttribute(
        "aria-label",
        dark ? "Switch to light theme" : "Switch to dark theme"
      );
    }
  }

  var MOON =
    '<svg class="theme-toggle__icon theme-toggle__icon--moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var SUN =
    '<svg class="theme-toggle__icon theme-toggle__icon--sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><g stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="12" y1="2.6" x2="12" y2="5.1"/><line x1="12" y1="18.9" x2="12" y2="21.4"/><line x1="2.6" y1="12" x2="5.1" y2="12"/><line x1="18.9" y1="12" x2="21.4" y2="12"/><line x1="5.1" y1="5.1" x2="6.9" y2="6.9"/><line x1="17.1" y1="17.1" x2="18.9" y2="18.9"/><line x1="5.1" y1="18.9" x2="6.9" y2="17.1"/><line x1="17.1" y1="6.9" x2="18.9" y2="5.1"/></g></svg>';

  var headerInner = document.querySelector(".site-header__inner");
  if (headerInner) {
    themeButton = document.createElement("button");
    themeButton.className = "theme-toggle";
    themeButton.type = "button";
    themeButton.title = "Toggle light and dark theme";
    themeButton.innerHTML = MOON + SUN;

    var navToggleEl = headerInner.querySelector(".nav-toggle");
    if (navToggleEl) {
      headerInner.insertBefore(themeButton, navToggleEl);
    } else {
      headerInner.appendChild(themeButton);
    }

    applyTheme(currentTheme(), false); // sync the button to the active theme
    themeButton.addEventListener("click", function () {
      smoothThemeChange();
      applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
    });
  }

  // Follow the system setting live, unless the visitor has chosen a theme
  try {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function (event) {
        if (!localStorage.getItem("theme")) {
          smoothThemeChange();
          applyTheme(event.matches ? "dark" : "light", false);
        }
      });
  } catch (e) {}

  /* ---------- Mobile navigation toggle -------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close the menu after tapping a link
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- "Current" page: nav link + the list of what I'm doing ---- */
  // Built from the CURRENT object at the top. The nav link goes to its own
  // page (current.html), which lists every facet that has text.
  var CURRENT_FACETS = [
    { key: "researching", line: "Currently researching" },
    { key: "reading", line: "Currently reading" },
    { key: "question", line: "Current question" }
  ];

  var currentFilled = CURRENT_FACETS.filter(function (facet) {
    return CURRENT[facet.key] && String(CURRENT[facet.key]).trim() !== "";
  });

  if (currentFilled.length) {
    // 1) add a "Current" link to the nav on every page, after Reading List
    var rlLink = document.querySelector(
      '.site-nav__list a[href$="reading-list.html"]'
    );
    if (rlLink) {
      var prefix = rlLink.getAttribute("href").replace("reading-list.html", "");
      var onCurrentPage = /current\.html$/.test(location.pathname);
      var li = document.createElement("li");
      li.innerHTML =
        '<a href="' + prefix + 'current.html"' +
        (onCurrentPage ? ' class="is-active" aria-current="page"' : "") +
        ">Current</a>";
      rlLink.closest("li").insertAdjacentElement("afterend", li);
    }

    // 2) on the Current page, list everything I am currently doing
    var currentList = document.getElementById("current-list");
    if (currentList) {
      currentList.innerHTML = currentFilled
        .map(function (facet) {
          return (
            '<div class="current-item">' +
            '<p class="current-item__label">' + facet.line + "</p>" +
            '<p class="current-item__text">' + escapeHtml(CURRENT[facet.key]) + "</p>" +
            "</div>"
          );
        })
        .join("");
    }
  }

  /* ---------- Post list rendering ------------------------------------- */
  var MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[c];
    });
  }

  // Turn "2026-06-14" into "June 14, 2026" without timezone surprises
  function formatDate(iso) {
    var parts = String(iso).split("-");
    var month = MONTHS[Number(parts[1]) - 1] || "";
    return month + " " + Number(parts[2]) + ", " + parts[0];
  }

  function sortedPosts() {
    return POSTS.slice().sort(function (a, b) {
      return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
    });
  }

  function cardHtml(post) {
    var tag = post.draft ? '<span class="tag">Draft</span>' : "";
    return (
      '<article class="card">' +
      '<a class="card__link" href="' + escapeHtml(post.url) + '">' +
      '<p class="card__meta">' +
      '<time datetime="' + escapeHtml(post.date) + '">' +
      escapeHtml(formatDate(post.date)) +
      "</time>" + tag +
      "</p>" +
      '<h3 class="card__title">' + escapeHtml(post.title) + "</h3>" +
      '<p class="card__excerpt">' + escapeHtml(post.excerpt) + "</p>" +
      '<span class="card__cta">Read the post' +
      '<span class="card__arrow" aria-hidden="true">&#8594;</span></span>' +
      "</a></article>"
    );
  }

  function render(targetId, limit) {
    var el = document.getElementById(targetId);
    if (!el || typeof POSTS === "undefined") {
      return;
    }
    var list = sortedPosts();
    if (limit) {
      list = list.slice(0, limit);
    }
    el.innerHTML = list.map(cardHtml).join("");
  }

  render("recent-posts", 3); // home page, three most recent
  render("all-posts", 0);    // journal page, everything

  /* ---------- Motion: scroll-reveal with a subtle stagger ------------- */
  // Sections, cards, and images fade and rise as they enter the viewport.
  // Progressive enhancement: without JS (or with reduced motion) nothing is
  // hidden, so all content shows normally. We only toggle opacity/transform,
  // and each element is unobserved once revealed.
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    var revealEls = Array.prototype.slice
      .call(
        document.querySelectorAll(
          ".section__head, .card, .post__figure, .post__image, .book, .contact-item, #current-list .current-item, .prose"
        )
      )
      .filter(function (el) {
        // an image already inside a revealing figure shouldn't double up
        return !(
          el.classList.contains("post__image") && el.closest(".post__figure")
        );
      });

    revealEls.forEach(function (el) {
      el.classList.add("reveal");
      // stagger items that share a parent (e.g. cards within a list)
      var prev = el.previousElementSibling;
      var i = 0;
      while (prev) {
        if (prev.classList && prev.classList.contains("reveal")) i++;
        prev = prev.previousElementSibling;
      }
      var delay = Math.min(i, 6) * 65;
      if (delay) el.style.animationDelay = delay + "ms";
    });

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- Homepage hero: cinematic opener ------------------------- */
  // Runs only on the homepage (the .hero exists nowhere else) and only with
  // motion enabled. The arc draws itself in like a pen stroke, then the hero
  // content builds in a short stagger, overlapping the tail of the draw.
  // Progressive enhancement: no JS or reduced motion shows the final state.
  var hero = document.querySelector(".hero");
  if (hero && !prefersReducedMotion) {
    var curvePath = hero.querySelector(".hero__curve path");
    var curveDot = hero.querySelector(".hero__curve circle");

    // Deliberate build order, independent of DOM order: label, byline,
    // headline, paragraph, second paragraph, buttons.
    var heroSeq = [
      hero.querySelector(".eyebrow"),
      hero.querySelector(".card__meta"),
      hero.querySelector(".hero__title"),
      hero.querySelector(".hero__lead"),
      hero.querySelector(".hero__sub"),
      hero.querySelector(".hero__actions")
    ].filter(Boolean);

    // Prime the arc to its hidden state BEFORE the cinematic transition is
    // active, so it does not animate while being hidden. A single dash the
    // length of the path, offset by that length, hides the whole stroke.
    var pathLen = 0;
    if (curvePath && typeof curvePath.getTotalLength === "function") {
      pathLen = curvePath.getTotalLength();
      curvePath.style.strokeDasharray = pathLen;
      curvePath.style.strokeDashoffset = pathLen;
    }

    // Arm the cinematic styles: arc transition on, hero content hidden.
    heroSeq.forEach(function (el) {
      el.classList.add("hero__seq");
    });
    hero.classList.add("cinematic");

    // Flush styles so the primed/hidden state is the transition's start point.
    void hero.getBoundingClientRect();

    // Draw the line in, and fade the end dot in (its CSS delay lands it as the
    // stroke arrives). Then build the content in a short, deliberate stagger
    // that overlaps the tail of the draw.
    if (curvePath && pathLen) curvePath.style.strokeDashoffset = "0";
    if (curveDot) curveDot.style.opacity = "1";

    var startAt = 1000; // begin partway through the ~1.7s line draw
    var step = 140; // stagger between elements
    heroSeq.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add("is-in");
      }, startAt + i * step);
    });
  }
})();
