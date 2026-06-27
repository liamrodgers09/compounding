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
   Unfinished drafts are commented out at the bottom of the array. When you
   finish one, move its entry up out of the comment block.
   ========================================================================= */

var POSTS = [
  {
    title: "How I'd Run My Own Firm",
    date: "2026-06-26",
    url: "posts/how-id-run-my-own-firm.html",
    excerpt:
      "The investment methodology I'd actually run, built from three distinctions about how the industry works and two tools I coded myself. Honest about what I can and can't yet claim."
  },
  {
    title: "The Rule Doesn't Care What You Want: Backtesting Crude Oil",
    date: "2026-06-23",
    url: "posts/the-rule-doesnt-care-what-you-want.html",
    excerpt:
      "I backtested the golden cross moving-average rule on eighteen years of real crude oil futures in Python. It lost to simply buying and holding. An honest look at why removing judgment did not produce a better outcome."
  },
  {
    title: "An Autopsy of a Losing Book: What My Gold Trades Taught Me",
    date: "2026-06-22",
    url: "posts/an-autopsy-of-a-losing-book.html",
    excerpt:
      "A quantitative post-mortem of my gold paper-trading account, built in Python: thirteen trades, a negative expectancy, and a directional blind spot I could only see once I looked at the data."
  },
  {
    title: "Turning \"don't put all your eggs in one basket\" into actual math",
    date: "2026-06-22",
    url: "posts/turning-eggs-in-one-basket-into-math.html",
    excerpt:
      "I wanted the real math behind not putting all your eggs in one basket, so I built Markowitz's portfolio model myself with five years of market data. What the chart proved, and the bugs that taught me more than the math."
  },
  {
    title: "What trading and investing have each taught me",
    date: "2026-06-22",
    url: "posts/what-trading-and-investing-have-taught-me.html",
    excerpt:
      "I trade NQ futures and hold index funds at the same time. How the two pull on the same instinct, where they actually differ, and which type of money belongs in each."
  },
  {
    title: "The career I almost wrote off",
    date: "2026-06-22",
    url: "posts/the-career-i-almost-wrote-off.html",
    excerpt:
      "A bored eighth grader's Google search turned into a real interest in investment banking and M&A. How that happened, and where I honestly stand on it now."
  },
  {
    title: "What cold outreach actually taught me",
    date: "2026-06-21",
    url: "posts/what-cold-outreach-taught-me.html",
    excerpt:
      "I spent part of June cold emailing finance professionals around Charleston. What the silence taught me, what made the few replies land, and why one yes was enough."
  },
  {
    title: "The trade I managed well and still lost",
    date: "2026-06-20",
    url: "posts/what-a-bad-trade-taught-me.html",
    excerpt:
      "On April 8 I went long into a brutal sell-off, managed the trade by the book, and still lost. Why the entry was the real mistake, not the management."
  },
  {
    title: "What I actually learned building my first mock financial plan",
    date: "2026-06-19",
    url: "posts/first-mock-financial-plan.html",
    excerpt:
      "My first real assignment interning at Integritas Wealth Strategies: a full mock plan for a couple in debt with very high goals. What was harder than I expected, and the lesson that stuck."
  }

  // ----- HIDDEN DRAFT --------------------------------------------------
  // This post exists as an outline page in posts/ but is not finished, so
  // it is commented out and does not show anywhere on the site. To publish
  // it: finish writing its page in posts/, then move its entry up above
  // this comment (add a comma after the entry before it), and remove the
  // "draft: true" line.
  /*
  ,
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
