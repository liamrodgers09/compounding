/* =========================================================================
   posts.js: the list of every journal post.

   TO ADD A NEW POST:
     1. Copy posts/_template.html to posts/your-slug.html and write it.
     2. Add one object to the TOP of the POSTS array below.
     3. Keep "date" in YYYY-MM-DD format. The site sorts newest first
        automatically, so the order you type them in does not matter.
     4. Set "draft: true" while a post is still an outline. Delete that
        line (or set it to false) once the post is finished.

   That is the whole process. You only ever edit this one file plus the
   new post page. Home and Journal both read from this list.

   HIDDEN POSTS: anything not listed in POSTS does not appear on the site.
   The two unfinished drafts are commented out at the bottom of the array.
   When you finish one, fill in its page in posts/, then move its entry up
   out of the comment block.
   ========================================================================= */

var POSTS = [
  {
    title: "What I actually learned building my first mock financial plan",
    date: "2026-06-19",
    url: "posts/first-mock-financial-plan.html",
    excerpt:
      "My first real assignment interning at Integritas Wealth Management: a full mock plan for a couple in debt with very high goals. What was harder than I expected, and the lesson that stuck."
  }

  // ----- HIDDEN DRAFTS -------------------------------------------------
  // These two posts exist as outline pages in posts/ but are not finished,
  // so they are commented out and do not show anywhere on the site. To
  // publish one: finish writing its page in posts/, then move its entry up
  // above this comment (add a comma after the entry before it), and remove
  // its "draft: true" line.
  /*
  ,
  {
    title: "What a bad trade taught me",
    date: "2026-06-14",
    url: "posts/what-a-bad-trade-taught-me.html",
    excerpt:
      "One real trade I got wrong, what actually happened, and the specific thing I would do differently next time.",
    draft: true
  },
  {
    title: "A conversation that changed how I think about private equity",
    date: "2026-06-05",
    url: "posts/private-equity-conversation.html",
    excerpt:
      "A reflection after a coffee chat with someone who works in private equity. My own takeaway, in my own words.",
    draft: true
  }
  */
];
