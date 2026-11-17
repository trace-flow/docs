# trace-flow/docs

The public documentation site for TraceFlow, published with GitHub Pages. All of its content is written here,
in `content/`, and nowhere else: the build reads nothing from the other TraceFlow repositories.

The site describes what TraceFlow does and what each component is. It deliberately holds no internal working: no
setup commands, keys, schema, routes, deployment or security detail. Keep it that way, because everything in this
repo is public.

## Pages

One Markdown file per page in `content/`; the navigation and the landing page are made from the file headers.

| File | Page |
|---|---|
| `product.md` | What TraceFlow does: modules, roles, plans |
| `database.md`, `api.md`, `web.md`, `android.md`, `website.md` | One page per component |

A page starts with a header:

```
---
title: Database
label: Component
order: 2
tone: amber
tagline: Where the work lives.
summary: One sentence.
chips: Postgres, Supabase
---
```

| Field | Used for |
|---|---|
| `title` | The navigation and the browser tab |
| `label` | The small line above the headline: `Product` or `Component` |
| `order` | Position in the navigation |
| `tone` | The header colour: `ink`, `coral`, `amber`, `teal`, `paper` or `quiet` |
| `tagline` | The big headline |
| `summary` | The line under the headline, and the text on the landing tile |
| `chips` | Optional "built with" labels, separated by commas |

Each `##` section becomes a stop on the thread down the page. Lists inside `<div class="module-list">` become
cards, and `<em class="pro">Pro</em>` marks a Pro feature.

## Build it locally

```bash
npm install
npm run build          # writes dist/
npm run serve          # builds, then serves http://localhost:4300
```

## Publishing

`.github/workflows/pages.yml` builds and deploys on every push to `main`, and on demand (Actions → Pages → Run
workflow). One-time setup: create the repo **public** (the Free plan cannot publish Pages from a private repo),
then *Settings → Pages → Source: GitHub Actions*. The site is at `https://trace-flow.github.io/docs/`.
