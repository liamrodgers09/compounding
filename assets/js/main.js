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
      applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
    });
  }

  // Follow the system setting live, unless the visitor has chosen a theme
  try {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function (event) {
        if (!localStorage.getItem("theme")) {
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

  /* ---------- "Current" menu + Reading List status block -------------- */
  // Both are built from the CURRENT object at the top and show only the
  // facets that have text, so empty ones never appear anywhere.
  var CURRENT_FACETS = [
    { key: "researching", id: "current-researching", line: "Currently researching", nav: "Currently researching" },
    { key: "reading", id: "current-reading", line: "Currently reading", nav: "Currently reading" },
    { key: "question", id: "current-question", line: "Current question", nav: "Currently questioning" }
  ];

  var currentFilled = CURRENT_FACETS.filter(function (facet) {
    return CURRENT[facet.key] && String(CURRENT[facet.key]).trim() !== "";
  });

  if (currentFilled.length) {
    var rlLink = document.querySelector(
      '.site-nav__list a[href$="reading-list.html"]'
    );
    var rlBase = rlLink ? rlLink.getAttribute("href") : "reading-list.html";

    // 1) the "Current" dropdown, added to the nav on every page
    var navList = document.querySelector(".site-nav__list");
    if (navList && rlLink) {
      var currentLi = document.createElement("li");
      currentLi.className = "nav-current";
      // The menu always lists all three facets. A filled one links to its
      // line on the Reading List; an empty one links to the section itself.
      var menuHtml = CURRENT_FACETS
        .map(function (facet) {
          var hasText =
            CURRENT[facet.key] && String(CURRENT[facet.key]).trim() !== "";
          var target = rlBase + "#" + (hasText ? facet.id : "currently-learning");
          return '<li><a href="' + target + '">' + facet.nav + "</a></li>";
        })
        .join("");
      currentLi.innerHTML =
        '<button class="nav-current__toggle" type="button" aria-expanded="false" aria-haspopup="true">' +
        'Current<span class="nav-current__caret" aria-hidden="true"></span>' +
        "</button>" +
        '<ul class="nav-current__menu">' + menuHtml + "</ul>";
      rlLink.closest("li").insertAdjacentElement("afterend", currentLi);

      var currentToggle = currentLi.querySelector(".nav-current__toggle");
      var closeCurrent = function () {
        currentLi.classList.remove("is-open");
        currentToggle.setAttribute("aria-expanded", "false");
      };
      currentToggle.addEventListener("click", function (event) {
        event.stopPropagation();
        var open = currentLi.classList.toggle("is-open");
        currentToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      currentLi
        .querySelector(".nav-current__menu")
        .addEventListener("click", closeCurrent);
      document.addEventListener("click", function (event) {
        if (!currentLi.contains(event.target)) closeCurrent();
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeCurrent();
      });
    }

    // 2) the "Currently learning" block at the top of the Reading List page
    var currentBlock = document.getElementById("currently-learning");
    if (currentBlock) {
      var rowsHtml = currentFilled
        .map(function (facet) {
          return (
            '<div class="current-item" id="' + facet.id + '">' +
            '<p class="current-item__label">' + facet.line + "</p>" +
            '<p class="current-item__text">' + escapeHtml(CURRENT[facet.key]) + "</p>" +
            "</div>"
          );
        })
        .join("");
      currentBlock.innerHTML =
        '<p class="eyebrow">Currently learning</p>' +
        '<div class="current-grid">' + rowsHtml + "</div>";
      currentBlock.hidden = false;

      if (location.hash) {
        var hashTarget = document.getElementById(location.hash.slice(1));
        if (hashTarget) hashTarget.scrollIntoView();
      }
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
})();
