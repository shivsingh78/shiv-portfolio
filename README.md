# Shiv Singh Baghel — Portfolio

A static portfolio built with plain HTML, CSS and JavaScript. No build step, no dependencies.
All content lives in `js/data/`; the page is rendered from those files.

## Structure

```
index.html              page shell, SEO / Open Graph tags, favicon
css/styles.css          design tokens (colours, fonts) + all styles, light & dark
js/main.js              renders sections from the data files; theme, menu, dialog
js/data/
  profile.js            name, headline, intro, about text, photos, email, social links, resume path, siteUrl
  projects.js           project entries (cards + "View details" dialog)
  skills.js             skill categories and tags
  experience.js         education / journey timeline
  navigation.js         header links
assets/
  img/                  profile + about photos (WebP) and og.jpg (social preview)
  projects/             project screenshots: <slug>.webp
  resume/               put the resume PDF here
```

## Run locally

Open `index.html` directly, or serve the folder (recommended, so the resume check works):

```bash
python3 -m http.server 8000   # then open http://localhost:8000
# or: npx serve .
```

## Add a project

Edit **`js/data/projects.js`** and copy an entry. Only `id`, `slug`, `name` and `shortDescription` are required;
every other field is optional and is simply skipped when missing. Set `featured: true` for the large grid.
Remove `placeholder: true` once the details are filled in. Field list is documented at the top of the file.

Screenshots: save a 16:9 image (about 1280×720, WebP or PNG) as `assets/projects/<slug>.webp` and add
`image: { src: "assets/projects/<slug>.webp", alt: "…" }`. To replace one, overwrite the file.

## Add a skill

Edit **`js/data/skills.js`**: add `{ name: "…" }` to a category's `items`, or add a new category object.
Use `status: "learning"` for things you are still exploring (shown with a dashed tag).

## Profile, photo, resume

- Text, email, LinkedIn: **`js/data/profile.js`** (leave `email` / `linkedin` empty to hide them).
- Photos: overwrite `assets/img/profile-480.webp`, `profile-800.webp` (square) and `about-480.webp`, `about-720.webp`
  (3:4), keeping the names, or change the paths and `width`/`height` in `profile.js`. Update `alt` text too.
- Resume: copy your PDF to `assets/resume/Shiv-Singh-Baghel-Resume.pdf`. The Resume buttons appear automatically
  once the file exists; change `resume.path` in `profile.js` to use another name.
- After you have a domain: set `siteUrl` in `profile.js` and make the `og:image` URL in `index.html` absolute.

## Deploy

It is a static site, so upload the folder as is to GitHub Pages, Netlify, Vercel or Cloudflare Pages
(publish directory: the repository root, no build command).

## Notes

- All data is inserted with `textContent` and links are restricted to http(s)/mailto, so data entries cannot inject HTML or `javascript:` URLs.
- Animations are short CSS transitions and are disabled under `prefers-reduced-motion`.
