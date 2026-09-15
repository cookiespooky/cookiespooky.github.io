# Site history: how the rules in CLAUDE.md were found

Moved out of `CLAUDE.md` for the same reason as `deploy-history.md`: the rules stayed there, and this is the
record of what broke before them — worth reading when a rule looks arbitrary or a symptom comes back.

## Engine fixes

**Deterministic builds (engine `v0.1.8`).** Two runs over identical content used to differ in 59 files — og
tags, sitemap order, and any two articles sharing a `published_at` — because all three were ordered by Go map
iteration. That had to be fixed before blog pagination could ship: with an unstable sort an article moves
between pages from one deploy to the next. Two builds now differ only in `search.json`'s `generated_at`.

**Heading anchors (engine `8885413`).** goldmark's own generator drops multi-byte runes, so every Cyrillic
heading on the site rendered as `id="-"`, `id="--1"` or the literal `id="heading"` — no section could be
linked to, and `[[page#Heading]]` wikilinks pointed at ids that did not exist, because that side was already
transliterating. Both sides now go through one `headingAnchor`.

**Trailing slashes in canonical and sitemap (engine `6e57516`).** `buildPath` trimmed the trailing slash from
every route key — correct for request matching, wrong for public URLs, because the builder writes each route
as `<path>/index.html`. Every canonical, `og:url` and `<loc>` therefore pointed at an address the host only
redirects from. `urlutil.PublicPath` now restores the slash at the three emission points.

## Screenshots

The catalogue used to point at the full-size images, so the home page pulled 5.5 MB of screenshots to draw
thumbnails 180 px wide — one file was 1.29 MB. After `scripts/shots.py` and `shots/thumbs/` it is 104 KB.

## The cluster ↔ article join, at eight articles

What `scripts/clusters_check.py` was written to close:

- `kak-rabotaet-analiz-rechi.md` had no `cluster` field at all while `speech-agency-explainer` named it as its
  `target_url` — the site's one half-open join.
- Six of the eight articles had no `cta_service`, so a reader arriving from search hit a dead end. The
  registry declared `cta_service: null` for the same six.
- `ai-seo-po-nisham`, then `planned`, pointed `target_url` at `/blog/ai-seo-dlya-sayta-uslug/` before that
  page existed. The page has since been written and claims the cluster.
