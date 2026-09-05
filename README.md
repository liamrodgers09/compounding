# Compounding

A personal finance learning journal. A running record of what I am learning by
shadowing a financial advisor, working on mock plans, and reviewing trading decisions. Plain HTML, CSS, and a little vanilla JavaScript. No frameworks, no
build step.

## Run it locally

It is a static site, so you can just open `index.html` in a browser. The post
lists render a bit more reliably over a local server, so this is the cleaner
way:

```bash
# from this folder
python3 -m http.server 8000
# then open http://localhost:8000
```

## File map

```
index.html            Home: intro, three featured projects, and recent posts
about.html            Bio and personal photos
journal.html          List of every post, newest first
contact.html          LinkedIn and email, nothing else
posts/
  _template.html      Copy this to start a new post
  *.html              One file per post
assets/
  css/style.css       All styling. Colors and fonts live in :root at the top
  js/posts.js         The list of posts (edit this to publish)
  js/main.js          Mobile menu plus the code that renders the post lists
  favicon.svg         Site icon
.nojekyll             Tells GitHub Pages to serve files as-is
```

## How to add a new post

1. Copy `posts/_template.html` to `posts/your-slug.html`. Use a short,
   lowercase, hyphenated file name, for example
   `posts/my-first-options-trade.html`.
2. In that new file, edit the `<title>`, the `<meta name="description">`, the
   post title, the date (update both the `datetime` attribute and the visible
   text), and the body.
3. Open `assets/js/posts.js` and add an entry to the **top** of the list:

   ```js
   {
     "title": "My first options trade",
     "date": "2026-07-02",
     "url": "posts/my-first-options-trade.html",
     "excerpt": "One sentence that makes someone want to read it.",
     "topic": "Trading Journal",
     "draft": true
   },
   ```

Keep the list as valid JSON after `var POSTS =`, using quoted keys and no inline comments. Remove `draft` when ready, then run `python3 scripts/refresh.py`. This synchronizes titles, reading times, related reading, revision notes, RSS, and the lists shown without JavaScript. Also update the new page's canonical URL and social descriptions, and add its URL to `sitemap.xml`. The three featured homepage projects are curated separately in `index.html`.

## Editing the things marked as placeholders

- **Draft posts.** Replace all template placeholders before publishing. Draft flags hide entries from lists and RSS, but uploaded HTML is still publicly accessible by its URL. Keep private drafts outside the published repository.
- **LinkedIn URL.** Set to your profile in both `about.html` and
  `contact.html`. Update both if it ever changes.
- **Contact email.** Currently `rodgersliam66@gmail.com` in `contact.html`.
  Change it if you set up a different address.

## Changing the look

Open `assets/css/style.css`. Every color, font, and the main spacing live in the
`:root` block at the very top. Change `--accent` once and the whole site picks
up the new accent color.

## Deploy to GitHub Pages

The existing repository is `liamrodgers09/compounding`. Publish approved changes to its `main` branch, then check the GitHub Pages deployment and `https://compoundingwithliam.com`. Keep `CNAME` and `.nojekyll` intact.

## House rules for the writing

- First person, my own voice.
- No em dashes anywhere in any copy. Use commas, colons, or "to" instead.
- Specific over generic. No budgeting-tips filler.
- Never invent quotes, numbers, or stories. If something is not written yet,
  leave a clear `[Liam to fill in ...]` placeholder.
- Do not use anyone's name without confirming it is okay with them first.


## September editorial update

Run `python3 scripts/refresh.py` after editing articles or `assets/js/posts.js`. It refreshes reading-time estimates, related reading, and `feed.xml`. The static site still needs no build server or framework. RSS works with feed readers; it is not an email subscription.

Set a post's `topic` to Research, Trading Journal, or Field Notes. Reading notes remain on the Reading List page. Homepage selected work is deliberately curated in `index.html`. The Journal filters use a shareable `?topic=` URL. Draft entries are excluded from rendered lists and RSS.

Research download files under `research/acquisitions/` reproduce statistics from saved returns only. They do not reconstruct the original collection or pricing pipeline. Keep original and derived data separate.

## Appearance
The site uses a single navy palette. The theme switcher and preference scripts were removed. Homepage selections retain the three featured project cards; no entrance animations are applied.

For substantive corrections, add `updated` (YYYY-MM-DD) and `revision` (a factual summary of what changed) to the post entry and run the refresh script. Keep the original publication date.
