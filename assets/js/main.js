/* =========================================================================
   main.js: the only script that runs the site.
   Jobs: the mobile menu toggle, the "Current"
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
      "Acquirer returns around M&A announcements. The published studies are linked below.",
    reading: "When Genius Failed, by Roger Lowenstein",
    question:
      "Is the private equity seat at the end of the banking track actually the job I think it is?"
  };

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

  if (toggle && nav) {
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); toggle.focus(); }
    });
  }

  /* ---------- "Current" page: nav link + the list of what I'm doing ---- */
  // Built from the CURRENT object at the top. The nav link goes to its own
  // page (current.html), which lists every facet that has text.
  var CURRENT_FACETS = [
    { key: "researching", line: "Currently researching" },
    { key: "reading", line: "Last recorded reading" },
    { key: "question", line: "A question from my journal" }
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
    return POSTS.filter(function (post) { return !post.draft; }).sort(function (a, b) {
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
      (post.topic ? "<span>" + escapeHtml(post.topic) + "</span>" : "") +
      (post.readingMinutes ? "<span>" + post.readingMinutes + " min read</span>" : "") +
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

  var filters = document.getElementById("topic-filters");
  if (filters && typeof POSTS !== "undefined") {
    var topics = ["All", "Research", "Trading Journal", "Field Notes"];
    var initialTopic = new URLSearchParams(location.search).get("topic");
    function filterPosts(topic, updateUrl) {
      var list = sortedPosts().filter(function (post) { return topic === "All" || post.topic === topic; });
      document.getElementById("all-posts").innerHTML = list.map(cardHtml).join("");
      document.getElementById("post-count").textContent = list.length + (list.length === 1 ? " post" : " posts");
      filters.querySelectorAll("button").forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.textContent === topic));
      });
      if (updateUrl) {
        var url = new URL(location.href);
        if (topic === "All") url.searchParams.delete("topic");
        else url.searchParams.set("topic", topic);
        history.replaceState(null, "", url);
      }
    }
    topics.forEach(function (topic) {
      var button = document.createElement("button");
      button.type = "button"; button.className = "topic-filter"; button.textContent = topic;
      button.addEventListener("click", function () { filterPosts(topic, true); });
      filters.appendChild(button);
    });
    var readingLink = document.createElement("a");
    readingLink.href = "reading-list.html"; readingLink.className = "topic-filter"; readingLink.textContent = "Reading notes ↗";
    filters.appendChild(readingLink);
    filterPosts(topics.indexOf(initialTopic) >= 0 ? initialTopic : "All", false);
  }

})();
