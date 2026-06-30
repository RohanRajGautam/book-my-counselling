# BYC Blog

Posts live as `.md` files in this folder. Each commit (via PR or direct edit on github.com) deploys and the post goes live at `/blog/<slug>`.

## How to add a post

1. Create a new file in this folder named after the URL slug you want. Example: `my-new-post.md` → `/blog/my-new-post`.
2. Add frontmatter (required fields below) at the top.
3. Write the body in Markdown below the frontmatter.
4. Commit. The site redeploys and the post appears on `/blog`.

## Frontmatter

Three fields are required. One is optional.

```yaml
---
title: "Your post title"
date: 2026-06-12
excerpt: "A short description (1–2 sentences) shown on the list page."
coverImage: "/blog/my-new-post/cover.jpg"   # optional — see below
author: "Jane Doe"                          # optional — defaults to "byc"
authorAvatar: "/authors/jane.jpg"           # optional — defaults to the byc logo
---
```

- `title` — shown on the card and as the page heading.
- `date` — ISO date (`YYYY-MM-DD`). Posts are sorted newest-first.
- `excerpt` — 1–2 sentences, displayed under the title on the card.
- `coverImage` (optional) — path under `/public`. If omitted, a gradient cover with the title is used.
- `author` (optional) — name shown on the card and post header. Defaults to `byc`.
- `authorAvatar` (optional) — path under `/public` to a square avatar image. Defaults to the byc logo (`/home/byc-logo.svg`).

## Cover images (optional)

If you want a custom cover image:

1. Drop the image at `public/blog/<slug>/cover.jpg` (or `.png`).
2. Reference it in frontmatter as `/blog/<slug>/cover.jpg`.

## Notes

- The slug comes from the filename. Don't use spaces or special characters — use hyphens.
- Every `.md` file in this folder is live. If you don't want a post visible, don't commit it yet.
- The default author is **byc** (this project). Override the name with `author`, and the avatar with `authorAvatar` (any path under `/public`). If `authorAvatar` is omitted, the byc logo is used.