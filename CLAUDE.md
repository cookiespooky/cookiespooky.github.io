# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The personal site of Anton Lozhkin at `cookiespooky.github.io` — a static site built with the
[`notepub`](https://github.com/cookiespooky/notepub) engine (a separate Go repo, usually checked out at
`../notepub`). Its purpose is lead generation for development work: sites, Telegram bots, parsers, automation
and MVPs. Three content areas: **cases** (portfolio, the proof), **services** (commercial landings, the
conversion) and **blog** (SEO traffic, written against keyword clusters).

Everything is in Russian.

The site previously hosted an experiment where the homepage was generated on the fly by an LLM from a knowledge
graph of "atoms". That produced ~200 thin pages and almost no search traffic, and has been removed — see
`archive/llm-graph` if you need it back. Its backends survive under `lab/` as a non-core demo.

## Build & run

```bash
./scripts/build.sh                        # -> dist/
notepub serve --config ./config.dev.yaml --rules ./rules.yaml   # local preview on 127.0.0.1:8080
```

`scripts/build.sh` resolves the engine in this order: `$NOTEPUB_BIN`, `./.bin/notepub`, `notepub` on PATH,
otherwise `go install github.com/cookiespooky/notepub/cmd/notepub@$NOTEPUB_REF` into `./.bin` (the ref is pinned
to a commit SHA at the top of the script, and CI pins the same one). It runs `validate` → `index` →
`validate --links --markdown` → `build`, then copies `media/`, touches `.nojekyll` and duplicates
`404/index.html` to `404.html` for GitHub Pages.

There is no test suite. Correctness means `./scripts/build.sh` exits clean — `validate` reports frontmatter,
route and link errors, and unknown frontmatter keys are build errors, so a typo in a field name fails the build
rather than silently disappearing.

`.bin/`, `dist/` and `.notepub/` are gitignored.

## Content model (`rules.yaml`)

Page types, each a template plus a permalink:

| type | permalink | template |
|---|---|---|
| `home` | `/` | `home.html` |
| `case` | `/cases/{slug}/` | `case.html` |
| `service` | `/services/{slug}/` | `service.html` |
| `blog` | `/blog/` | `blog.html` |
| `tool` | `/tools/{slug}/` | `tool.html` |
| `article` | `/blog/{slug}/` | `article.html` |
| `page` | `/{slug}/` | `page.html` |
| `notfound` | `/404/` | `notfound.html` |

`blog` and `home` are singletons (`validation.single_page_of_type`). `/services/` itself is a `page`
(`content/services.md`), not a `service` — the `service` type is only for individual landings.

Collections are declared, not hardcoded, and reach templates as `.Collections.<name>.Items`:

- `cases_all` plus one per group (`cases_products`, `cases_ai`, `cases_research`, `cases_lab`, `cases_sites`) and
  `cases_featured` — consumed by `home.html`;
- `posts_all` (blog feed, sorted by `fm.published_at` desc), `posts_recent` (4, for a home teaser);
- `services_all`;
- `related_cases` — a `forward` collection over the `related` link, so any page listing case slugs in its
  `related` frontmatter gets those cases rendered as proof rows.

Links are declared too: `related` (frontmatter field) and `wiki` (`[[wikilinks]]` in body text), both resolving
across `home`/`case`/`page`/`article`/`service`.

### Article frontmatter contract

This is what the blog pipeline must emit. `type`, `slug`, `title` are required everywhere; unknown keys fail the
build, so add new ones to `fields.optional` in `rules.yaml` first.

```yaml
type: article
slug: kak-zakazat-telegram-bota
title: "..."              # H1 and <title>
description: "..."        # meta description and the feed excerpt
draft: false
published_at: "2026-09-04"   # ISO; sorts the feed, feeds datePublished
updated_at: "2026-09-20"     # optional; feeds dateModified
kicker: "..."             # eyebrow above the H1
lead: "..."               # lead paragraph; falls back to description
keywords: ["...", "..."]  # target cluster keys — data only, not rendered
cluster: "bots-order"     # cluster id in the registry; guards against cannibalization
cta_service: "telegram-bot"  # slug of the service the article pushes
tags: ["телеграм-боты"]   # rendered in the sidebar; no tag pages yet, see gaps
related: ["ai-qualification-bot"]  # case slugs -> proof rows at the bottom
```

`keywords` and `cluster` are deliberately not rendered anywhere: they exist so the registry can tell which URL
owns which cluster. One cluster must map to exactly one URL.

Service pages add `includes`, `price_from`, `price_note`, `stack`, `faq` (list of `{q, a}`) and `service_cases`.

### Where SEO metadata comes from

The engine builds canonical, robots, OpenGraph and sitemap entries itself; `og:type` per page type is mapped in
`config.yaml` under `og_type_by_type`. Site-wide copy and contact links live in `config.yaml` under `settings`
and reach templates as `.Settings.*`.

JSON-LD is **not** engine-generated: `internal/indexer` only reads a page's own `jsonld` frontmatter field, and
the engine exposes no custom template functions. So `article.html` and `service.html` hand-build their
structured data (`Article`/`Service` + `BreadcrumbList`, plus `FAQPage` when `faq` is set) inside
`<script type="application/ld+json">`. Note that inside a `<script>`, Go's `html/template` already emits values
as quoted JSON strings — write `{{ .Page.Title }}`, never `{{ printf "%q" .Page.Title }}`, or you get doubled
quotes. Validate by parsing the built HTML, not by eye.

## Backends in `lab/`

Two Yandex Cloud Functions, each deployed by its own `deploy.sh`. The code moved here from `ycf/`; nothing was
deleted except the `ysc/` Serverless Container, which was a third copy of the graph runtime's streaming logic.

- `lab/speech-analyzer/` — linguistic agency analysis over DeepSeek, deployed as `np-speech-agency-analyzer`.
  **This one has a page**: the `tool` type at `/tools/analiz-rechi/`. It takes `{"text": "..."}` and answers
  `{"results": {neutral|direct|radical|aggressive|toxic: {objective_text, agency_analysis, label,
  irritabilityLevel, key}}}`. The page is indexable on purpose — a free tool is a traffic and lead asset, not a
  lab curiosity.
- `lab/graph-runtime/` — the streaming LLM generator from the old homepage experiment, behind an API Gateway
  WebSocket (`ws-gateway.openapi.yaml`), sized for the free tier; `build.sh` bakes a graph JSON and a system
  prompt into the zip. Event contract: `start` → `delta`* → `phase`? → `meta` → `done`. **It has no page yet**
  and the graph it used to read was deleted with the atoms; the plan is to re-point it at the cases graph and
  give it a `/lab/` page with a pre-generated static fallback so it renders with the backend switched off.

### The tool page port

`tool.html`, `theme/assets/tool.css` and `theme/assets/tool.js` were lifted off `archive/llm-graph`, where they
lived inside the old theme's `styles.css` and `main.js`. Three things to know if you touch them:

- `tool.js` queries 21 `data-aa-*` hooks; the markup in `tool.html` must keep every one of them. Verify by
  diffing the hook lists, not by reading.
- the CSS came from a dark-panel palette whose `--surface-raised*` variables do not exist in the new theme, so
  `tool.css` re-declares them scoped to `.agency-tool` in terms of the new `--panel*` tokens.
- `tool.css`/`tool.js` load only when `.Page.Type` is `tool`, unlike the rest of the theme's assets which
  `layout.html` loads everywhere.

The endpoint is frontmatter (`endpoint`), not hardcoded as it was before. The five `?` links next to the tone
filter were dropped: they pointed at an atom page that no longer exists.

## Deployment state (nothing pushed yet)

The site is being moved to **antonlozhkin.ru**, a domain the owner already held. `config.yaml` and
`config.dev.yaml` point at it, `CNAME` at the repo root holds it, and `scripts/build.sh` copies that file into
`dist/` — it did not before, and the deploy goes through `upload-pages-artifact`, so without the file in the
artifact GitHub Pages drops the custom domain on every run.

Verified against live DNS (from inside the sandbox `dig` is blocked; use DNS-over-HTTPS instead, e.g.
`curl -H 'accept: application/dns-json' 'https://cloudflare-dns.com/dns-query?name=antonlozhkin.ru&type=A'`):

- apex `A` records resolve to all four GitHub Pages addresses; the previous dead-server records are gone
- `AAAA` — none yet
- `www` — was `NXDOMAIN`; the owner has since added records, unverified here
- `http://antonlozhkin.ru/` already answers `200`, so the custom domain is set in repo settings
- `https://antonlozhkin.ru/` fails on certificate subject mismatch — Let's Encrypt has not issued yet
- `cookiespooky.github.io/` → **301** → `antonlozhkin.ru/` — GitHub issues a real 301, so a Yandex mirror move
  will work without hand-written redirects

**Why the Pages "DNS Check in Progress" is stuck:** `http://antonlozhkin.ru/CNAME` returns 404, so the
published artifact carries no CNAME file. The fix is to push, not to remove and re-add the domain — re-adding
restarts the timer and can delay the certificate.

The live deployment is **older than any branch**: it serves the LLM-graph site and carries Metrika counter
108674124, which exists in no file on `main` or `archive/llm-graph`. Pages is serving a build from a commit
whose theme still had the counter.

### Order of operations

1. `www` CNAME → `cookiespooky.github.io.`, plus the four `AAAA` records (optional)
2. **push** — puts `CNAME` in the artifact, which should close the DNS check and trigger the certificate
3. wait for the certificate, then enable **Enforce HTTPS**
4. **disable Pages on the `cases` repo.** A custom domain on a user site also covers that account's project
   sites, so while `cases` publishes, `antonlozhkin.ru/cases/` is served from that repo and shadows this
   site's whole cases section. Confirmed live: `cookiespooky.github.io/cases/` already 301s to
   `antonlozhkin.ru/cases/`. Do this *after* step 2, not before.
5. verify the domain in Yandex Webmaster — the tag is already in the build
6. add the new domain to the Metrika counter's settings

Publishing before the domain is live would mean the pages get indexed on `github.io` and then change address,
which is the one migration cost worth avoiding. Writing can start now; publishing waits for step 3.

## Open decision: is there a `/cases/` page?

There is not. `case` pages live at `/cases/{slug}/` but nothing is served at `/cases/` — the catalogue is a
section of the home page, reached as `/#cases`, and that is where `case.html` breadcrumbs point. So the trail
reads Главная → Кейсы → case with a middle step that is an anchor rather than a page.

After step 4 above, `antonlozhkin.ru/cases/` will 404, and so will the old standalone site's
`/cases/cases/{slug}` URLs. The deep links are not worth redirects, but `/cases/` is the most guessable path
on the site and is where the previous cases site lived.

The duplication worry resolves once you notice `/cases/` has close to zero ranking value — nobody searches for
a portfolio index. So the recommendation is a flat `noindex` list of all 34 cases, no filter tabs: it cannot
compete with the home page because it never enters the index, it gives a shareable portfolio link that does
not depend on an anchor, and it makes the breadcrumb trail real — which matters when `BreadcrumbList` is
finally added to `case.html`. Breadcrumbs would then point at `/cases/` instead of `/#cases`.

The alternative, moving the catalogue off the home page and making `/cases/` canonical, is cleaner
structurally but is a redesign: the home page is built around the catalogue with its sticky filter tabs.

## Known gaps

- **`.github/workflows/backend-runtime-deploy.yml` is broken**: it deploys from the old `ycf/` path and
  regenerates the deleted atoms graph. Do not run it; rewrite it when the graph demo gets its page.
- **No pagination, no taxonomy routes, no RSS in the engine.** Collections only come in `filter` and `forward`
  kinds; `group_by` groups items inside a collection but generates no route. So `/blog/` is a single unpaginated
  list and `tags` produce no pages. This is fine under roughly 12–15 articles; past that the engine needs the
  feature, which is why articles carry tags from the start.
- **No JSON-LD on `case.html`, `home.html`, `page.html`** — only `article.html`, `service.html` and
  `tool.html` have it.
- **Slugs on the two pages that exist are provisional.** `/tools/analiz-rechi/` and
  `/blog/kak-rabotaet-analiz-rechi/` were named by hand before any keyword research; renaming them costs
  nothing while the site has no traffic, and should happen once the clusters exist.
- **GitHub Pages cannot do 301 or 410**, only 404 and a JS/meta redirect. Deliberately unused: the site had ~60
  views a month at the cutover, so no redirects were written for the removed atom URLs or the old
  `/cases/cases/{slug}` paths.

## Branches

- `main` — the pre-restructure LLM-graph site, untouched.
- `archive/llm-graph` — full snapshot of that experiment plus 102 hand-written articles from the site that
  preceded it (`blog-source/`), kept because they existed nowhere else.
- `restructure/cases-to-root` — this work. **Nothing has been pushed.** The owner has asked for the work to
  stay local; do not push without being told to.
