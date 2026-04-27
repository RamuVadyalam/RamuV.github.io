# Data Engineering Insights & Architecture Notes

Personal blog and technical notebook on data platforms, lakehouse architectures, streaming systems, observability, and the cloud data ecosystem. Built as a static site with [Astro](https://astro.build/), MDX for content, and Tailwind CSS v4.

> **Live site:** https://ramuvadyalam.github.io/RamuV.github.io/

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro 5 (static output) | Zero-JS by default, native MDX, content collections, RSS, sitemap |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) | First-class theming, utility-first, no config file needed |
| Content | MDX via `@astrojs/mdx` | Markdown + components, syntax-highlighted code blocks via Shiki |
| RSS | `@astrojs/rss` | Standard RSS 2.0 feed at `/rss.xml` |
| Sitemap | `@astrojs/sitemap` | Auto-generated at `/sitemap-index.xml` |
| Deploy | GitHub Actions → GitHub Pages | Build artifact uploaded by `actions/deploy-pages@v4` |

No JavaScript framework, no client-side router. Theme toggle and post search are tiny inline scripts.

## Project layout

```
.
├── .github/workflows/deploy.yml       # CI: build + publish to GitHub Pages
├── astro.config.mjs                   # Astro + Tailwind + MDX + sitemap config
├── package.json
├── tsconfig.json
├── public/                            # Static assets served as-is
│   ├── favicon.svg
│   ├── robots.txt
│   └── .nojekyll
└── src/
    ├── consts.ts                      # SITE config (title, nav, URLs)
    ├── content.config.ts              # Content collection schema (Astro 5 loader)
    ├── lib/posts.ts                   # Post helpers (sort, tags, formatting)
    ├── styles/global.css              # Tailwind v4 import + theme tokens
    ├── components/
    │   ├── Header.astro
    │   ├── Footer.astro
    │   ├── ThemeToggle.astro
    │   ├── PostCard.astro
    │   └── TagPill.astro
    ├── layouts/
    │   ├── BaseLayout.astro           # <head>, header, footer, theme script
    │   └── BlogPostLayout.astro       # Article shell + prose styling
    ├── content/blog/                  # 10 MDX posts (sources of truth)
    │   ├── lakehouse-architecture-evolution.mdx
    │   ├── streaming-kafka-vs-flink.mdx
    │   ├── open-table-formats-iceberg.mdx
    │   ├── data-observability-2025.mdx
    │   ├── modern-data-stack-cost-optimization.mdx
    │   ├── batch-etl-to-elt-dbt.mdx
    │   ├── data-mesh-reality-check.mdx
    │   ├── airflow-dagster-prefect.mdx
    │   ├── llm-data-engineering.mdx
    │   └── snowflake-bigquery-databricks.mdx
    └── pages/
        ├── index.astro                # Home
        ├── about.astro                # Career-level summary (no employers / projects)
        ├── interests.astro            # Areas of Interest (replaces "Projects")
        ├── blog/
        │   ├── index.astro            # Post list with client-side filter
        │   └── [slug].astro           # Per-post page from content collection
        ├── tags/
        │   ├── index.astro            # All tags
        │   └── [tag].astro            # Posts filtered by tag
        ├── rss.xml.ts                 # /rss.xml feed
        └── api/posts.json.ts          # /api/posts.json — machine-readable post index
```

## Local development

Requires **Node.js 18.20+** (Node 20 LTS recommended).

```bash
npm install
npm run dev          # http://localhost:4321
```

Build and preview the production output:

```bash
npm run build
npm run preview      # http://localhost:4321
```

The build emits a fully static site to `dist/`.

## Writing a post

Create a new `.mdx` file under `src/content/blog/`. The filename (without extension) becomes the URL slug — for example `src/content/blog/my-new-post.mdx` is published at `/blog/my-new-post`.

Frontmatter:

```mdx
---
title: "Title of the post"
description: "One-paragraph summary used for meta description, OG, and listings."
pubDate: 2026-02-10
tags: ["lakehouse", "iceberg"]
draft: false                # set true to hide from build
readingMinutes: 7           # optional
---

Body in Markdown / MDX. Code blocks get Shiki syntax highlighting
with light/dark themes that follow the site theme toggle.
```

Schema is enforced in [`src/content.config.ts`](src/content.config.ts) via Zod. A bad frontmatter shape will fail the build.

## URLs and feeds

| URL | What it is |
|---|---|
| `/` | Home (latest posts, areas of interest, top tags) |
| `/blog` | All posts, with client-side filter |
| `/blog/<slug>` | Individual post |
| `/tags` | All tags |
| `/tags/<tag>` | Posts for a tag |
| `/about` | Career-level summary |
| `/interests` | Areas of Interest |
| `/rss.xml` | RSS 2.0 feed |
| `/sitemap-index.xml` | Sitemap (auto-generated) |
| `/api/posts.json` | Machine-readable post index |

## Deployment — GitHub Pages (default)

This repo is wired for **GitHub Pages via GitHub Actions**.

The repository is `github.com/ramuvadyalam/RamuV.github.io`, hosted under the user `ramuvadyalam`. Despite the `<name>.github.io` repo name, this is a **project page** (not a user page) because the repo name doesn't match the owner. It serves at:

```
https://ramuvadyalam.github.io/RamuV.github.io/
```

That's why [`astro.config.mjs`](astro.config.mjs) sets:

```js
site: 'https://ramuvadyalam.github.io',
base: '/RamuV.github.io',
```

All internal links go through a [`withBase()`](src/lib/url.ts) helper so they pick up the base path automatically. If you ever rename the repo or move to a custom domain, update **only**:

- `SITE_ORIGIN` and `BASE_PATH` in [`astro.config.mjs`](astro.config.mjs)
- `url`, `github`, `linkedin` in [`src/consts.ts`](src/consts.ts)
- the `Sitemap:` line in [`public/robots.txt`](public/robots.txt)

…and the rest of the site picks up the new URLs from `import.meta.env.BASE_URL`.

### One-time setup

1. In **Settings → Pages**, set **Source** to **GitHub Actions**.
2. Push to `main`. The [`deploy.yml`](.github/workflows/deploy.yml) workflow will:
   - install dependencies (`npm ci`)
   - build (`npm run build`) → `dist/`
   - upload the `dist/` folder as a Pages artifact
   - deploy via `actions/deploy-pages@v4`
3. The site appears at the URL above.

The [`public/.nojekyll`](public/.nojekyll) marker is included so GitHub Pages serves files starting with `_` (which Astro emits) without running them through Jekyll.

### Switching to a true user page

If you ever rename this repo to `ramuvadyalam.github.io` (the actual owner's user page), change [`astro.config.mjs`](astro.config.mjs) to:

```js
site: 'https://ramuvadyalam.github.io',
// remove `base` entirely
```

…and update `SITE.url` in [`src/consts.ts`](src/consts.ts). The site will then serve at the apex `https://ramuvadyalam.github.io/`.

## Deployment — Vercel (alternative)

Astro is a first-class Vercel framework.

1. Import the repo in the Vercel dashboard.
2. Vercel auto-detects Astro. Build command `npm run build`, output `dist/`.
3. Set the production branch to `main`.
4. Optionally add a custom domain.

No code changes required, but for nicer Vercel integration you can install `@astrojs/vercel` and switch the adapter — only needed if you want SSR or edge functions, which this site doesn't.

## Roadmap

Possible additions, intentionally not built yet:

- Full-text client-side search (e.g. Pagefind)
- Per-post OG images via `@astrojs/og` or `satori`
- Comments via Giscus (GitHub Discussions)
- Newsletter integration

## License

Source code is MIT-licensed (see `LICENSE` if added).
Blog post content is © the author — feel free to quote with attribution; please don't republish in full.
