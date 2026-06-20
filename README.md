# Compounding

A personal finance learning journal. A running record of what I am learning by
shadowing a financial advisor, building real plans, and trading my own
positions. Plain HTML, CSS, and a little vanilla JavaScript. No frameworks, no
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
index.html            Home: intro plus the three most recent posts
about.html            Short bio
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
     title: "My first options trade",
     date: "2026-07-02",            // YYYY-MM-DD, sorts newest first on its own
     url: "posts/my-first-options-trade.html",
     excerpt: "One sentence that makes someone want to read it.",
     draft: true                    // remove this line once it is finished
   },
   ```

That is the whole process. Home and Journal both read from `posts.js`, so you
never edit those pages by hand.

## Editing the things marked as placeholders

- **Draft posts.** The three starter posts are outlines only. Each one has
  notes in brackets like `[Liam to fill in ...]`. Replace those with the real
  story before you publish, and remove the draft callout and the
  `draft: true` line in `posts.js`.
- **LinkedIn URL.** Two files point at
  `https://www.linkedin.com/in/your-profile/`: `about.html` and `contact.html`.
  Swap in your real profile URL.
- **Contact email.** Currently `rodgersliam66@gmail.com` in `contact.html`.
  Change it if you set up a different address.

## Changing the look

Open `assets/css/style.css`. Every color, font, and the main spacing live in the
`:root` block at the very top. Change `--accent` once and the whole site picks
up the new accent color.

## Deploy to GitHub Pages

1. Create a new repository on GitHub and push these files to it:

   ```bash
   git init
   git add .
   git commit -m "Compounding: initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

2. On GitHub, go to the repository, then **Settings**, then **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**,
   choose the `main` branch and the `/ (root)` folder, and save.
4. Wait a minute, then your site is live at
   `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

To publish a new post later, commit and push the new files and it updates
automatically.

## House rules for the writing

- First person, my own voice.
- No em dashes anywhere in any copy. Use commas, colons, or "to" instead.
- Specific over generic. No budgeting-tips filler.
- Never invent quotes, numbers, or stories. If something is not written yet,
  leave a clear `[Liam to fill in ...]` placeholder.
- Do not use anyone's name without confirming it is okay with them first.
