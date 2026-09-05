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

`README.md` predates the restructure and is stale on addresses: it calls the site "Кейсы", gives the public
URL as `cookiespooky.github.io/cases/` and describes a move *to* `cookiespooky.github.io`. Its "how to add a
case" recipe is still accurate; ignore everything it says about where the site lives.

Bumping the engine means editing `NOTEPUB_REF` in **two** places — `scripts/build.sh` and the `env:` block of
`.github/workflows/pages.yml` — or CI builds against a different commit than you do.

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
date_label: "4 сентября 2026"  # the same date in Russian, for display
updated_at: "2026-09-20"     # optional; feeds dateModified
kicker: "..."             # eyebrow above the H1
lead: "..."               # lead paragraph; falls back to description
keywords: ["...", "..."]  # target cluster keys — data only, not rendered
cluster: "bots-order"     # cluster id in the registry; guards against cannibalization
cta_service: "telegram-bot"  # slug of the service the article pushes
tags: ["телеграм-боты"]   # rendered in the sidebar; no tag pages yet, see gaps
related: ["ai-qualification-bot"]  # case slugs -> proof rows at the bottom
```

The engine has no date formatter and exposes no custom template functions, so `article.html` and `blog.html`
print `date_label` and fall back to the raw ISO string when it is missing — always write both fields.

`keywords` and `cluster` are deliberately not rendered anywhere: they exist so the registry can tell which URL
owns which cluster. One cluster must map to exactly one URL.

Service pages add `includes`, `price_from`, `price_note`, `stack`, `faq` (list of `{q, a}`) and `service_cases`.

### Case frontmatter contract

34 case files, one per `content/cases/*.md`, and the home catalogue is built entirely out of their frontmatter
— the Markdown body is the long read below the card.

```yaml
type: case
slug: notepub
title: "..."
description: "..."        # meta description
draft: false
nav_order: 21             # sorts every cases_* collection, asc, nulls last
featured: true            # puts it in cases_featured
group: products           # products | ai | research | lab | sites — picks the catalogue section
kicker: "..."             # eyebrow above the title
summary: "..."            # one sentence, the catalogue row
status: "Работает, развивается"
status_kind: live         # live | wip | idea — colours the status dot
client: "..."; role: "..."; period: "..."
mark: "NP"                # 2-3 letters, drawn when there is no screenshot
shot: "notepub-home.png"  # file in theme/assets/shots/
shot_url: "..."           # address printed in the screenshot frame
shot_caption: "..."
stack: ["Go", "..."]
highlights: ["...", "..."]        # bullets
facts: [{value: "...", label: "..."}]   # the number tiles
links: [{title: "...", url: "..."}]
```

`group` decides which section a case lands in; the counts on the home page's tabs come from
`len .Collections.cases_<group>.Items`, so a typo in `group` silently empties a tab rather than failing the
build. Current split: products 10, ai 8, sites 7, research 6, lab 3.

A case has either a `shot` or a `cover` (`grid | rings | waves | dots | beam`, drawn by `partials/cover.html`)
— 13 have screenshots, 21 have drawn covers.

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

## The SEO factory (`seo/`)

`seo/clusters.yaml` is the registry the blog is written against, and `seo/README.md` is its long-form
reasoning. The hard boundary: the factory **only writes Markdown into `content/`** and knows nothing about
notepub internals, because it is meant to become a separate product later.

The rule that governs everything: **one cluster = one URL.** The registry, not the text generator, is the
asset — it is what stops a second article being written for an intent that already has a page. An article's
`cluster` frontmatter is the join key back to this file, and `target_url` is the cluster's side of it.

Each cluster carries a `stage` (`seed → measured → planned → written → published → tracked`), a `direction`,
an `intent`, the `cases` that prove it, and `money_distance` 1–5 — how many steps from the query to paid work.
4–5 is a hard reject, not a maybe.

Frequencies come from the Yandex Cloud **Search API** (`POST /v2/wordstat/topRequests` with an IAM token from
a service account holding `search-api.webSearch.user`), *not* from the Direct API, which is the outdated path
most guides describe. The binding constraint is the quota, not the money: `GetTop` allows 10 rps but only
**100 requests per hour**, so any collector must be rate-limited and resumable — dying at request 80 and
restarting costs an hour. Prices, method signatures and the first-wave budget are worked out in
`seo/README.md`; the free Cloud Functions tier that `lab/` runs on does not apply to Search API, which needs a
billing account in good standing.

Strategy in one line: informational tail into the blog builds host trust, which is what eventually makes the
commercial pages on `/services/` rankable at all. Commercial-intent long tail goes to a service landing, never
to an article — «сколько стоит сделать телеграм бота» is a post, «заказать телеграм бота для записи клиентов»
is a landing.

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

## Theme JS (`theme/assets/app.js`)

Loaded on every page; the site is fully usable without it. Two things there are load-bearing and easy to
break:

- **Sticky offsets are measured at runtime.** `--header-h` in `tokens.css` is a 74px constant, but the real
  header is taller on narrow screens (~85px), so `app.js` measures the header and writes the CSS variables
  itself, re-running on resize, orientation change and `document.fonts.ready`. CSS and JS must agree on one
  number — don't reintroduce a hardcoded offset in a stylesheet.
- **The catalogue tabs are navigation, not a filter.** They scroll to a `data-group` section; nothing is ever
  hidden, so there is no empty state to design for. A scroll-spy updates the pressed tab and stays silent
  during programmatic scrolling, otherwise the pressed tab walks through every section the page flies past.
  The no-JS build simply shows all groups in order.

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

## Deployment state

**The migration to `antonlozhkin.ru` is complete as of 2026-09-05.** Verified live: `http://` 301s to
`https://`, the certificate is Let's Encrypt `CN=antonlozhkin.ru` valid to 2026-12-03, `www` 301s to the
apex so the certificate covers both names, all 47 sitemap URLs answer 200, and Metrika 108674124 reports
`counter is initialized` in the browser.

`config.yaml` and `config.dev.yaml` point at the domain, `CNAME` at the repo root holds it, and
`scripts/build.sh` copies that file into `dist/` — it did not before, and the deploy goes through
`upload-pages-artifact`, so without the file in the artifact GitHub Pages drops the custom domain on every
run.

### Four things that cost a day, so they are written down

**The certificate was released by removing the custom domain in Settings → Pages and adding it back.**
This contradicts the advice that used to stand here. Waiting did not work: the DNS check sat in progress
across four deployments after the `CNAME` file finally reached the artifact, and the certificate appeared
within minutes of the re-add. The reading that fits is that the check had latched the failure from when
`http://antonlozhkin.ru/CNAME` still 404'd and would not re-run on its own.

Sequencing still matters: re-add only once the `CNAME` file is genuinely in the published artifact and
nothing else claims the domain, or the fresh check latches the same failure again. Note also that the
`CNAME` file *drives* the setting — GitHub re-reads it on every deployment — so removing the domain in the
UI alone is reverted by the next build unless the file goes too.

**"DNS Check in Progress" stays yellow even when everything works.** It is still yellow now. Enforce HTTPS
is enabled and enforcing, which GitHub does not allow without a valid certificate, so the label is stale UI
and not a blocker. Do not press Remove to clear it — that would revoke a working certificate.

**A project repo owns its path on the custom domain, and disabling Pages does not release it.** The `cases`
repo held the whole `/cases/` prefix: every `/cases/{slug}/` returned that repo's 404 while all 34 case
pages sat in this site's sitemap. Switching its Pages source to None left the path answering GitHub's own
"Site not found", because the binding follows the repo *name*. Deleting the repo released it.

**DNS was never the problem** (verified against Cloudflare and Google, which agree). Apex `A` holds all four
GitHub addresses and only those, apex `AAAA` all four, no apex `CNAME`, no `CAA` blocking Let's Encrypt,
`www` a `CNAME` to `cookiespooky.github.io.`. From inside the sandbox `dig` is blocked; use DNS-over-HTTPS,
e.g. `curl -H 'accept: application/dns-json' 'https://cloudflare-dns.com/dns-query?name=antonlozhkin.ru&type=A'`.

### Analytics and Webmaster

Metrika **108674124** is the counter, installed via `settings.metrika_id`. The loader asks for
`tag.js?id=<counter>`, matching the snippet Yandex hands out — the bare `tag.js` form it used before was the
one structural difference from the official snippet. Counter `103178789` belonged to a long-dead Next.js
site at this address and has been deleted.

Yandex Webmaster holds one host, **`https://antonlozhkin.ru`**. Two cautions learned the hard way:

- The host record predates this site — its crawl history stops at 2026-01-05 and consists of
  `/_next/image?url=…`, so Webmaster had never seen the current site. Its diagnostics warned that
  `robots.txt` was missing and 404s were misconfigured; both were artefacts of the day HTTPS was broken,
  because the robot could not complete a TLS handshake at all. Neither file was ever wrong.
- Tools that take a URL default to `http://` when you type a bare domain, and `http://` now 301s to a
  different host in Yandex's model. Always type the protocol.

Metrika's install checker follows the address stored in the counter's own settings, not the one typed into
the dialog, and that field lagged on `cookiespooky.github.io` — which 301s here anyway, so the check passes
regardless. Two console errors show up during that check and neither is this site's: an unrecognised
`prefetch-src` CSP directive from Metrika's own overlay script on `yastatic.net`, and
`ERR_CERT_AUTHORITY_INVALID` on `hdrc.yandex.net`, whose issuing CA is absent from ordinary trust stores —
reproducible with `curl` from an unrelated machine. This site sets no CSP at all and references neither
domain.

### Still open

- No `_github-pages-challenge-cookiespooky` TXT record, so account-level domain verification was never
  performed. It does not affect the certificate; it stops another account from claiming the domain.
- Apex `A` TTL at reg.ru is 86400. Worth lowering before any future move — a stale day-long cache is the
  most likely reason a DNS check ever looks stuck.
- Whether the Webmaster host is verified by the `yandex_verification` meta tag in `config.yaml`
  (`74ea07470235e3be`) or by another method. If it is the tag, it is load-bearing; if not, it is dead weight
  that should be removed.
- The sitemap has not been submitted in Webmaster: `https://antonlozhkin.ru/sitemap-index.xml`.

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

`config.yaml` already carries an `og_type_by_type: catalog: website` entry for a type that does not exist in
`rules.yaml` — a leftover, harmless, and the name to reuse if this decision ever produces a real type.
`noindex` is already an allowed frontmatter field, so the `noindex` list needs no `rules.yaml` change.

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
- **Canonical and sitemap trailing slashes are fixed as of engine `6e57516`.** Before it, `buildPath`
  trimmed the trailing slash from every route key — correct for request matching, wrong for public URLs,
  because the builder writes each route as `<path>/index.html`. Every canonical, `og:url` and `<loc>`
  therefore pointed at an address the host only redirects from. `urlutil.PublicPath` now restores the slash
  at the three emission points. If you see a slash-less canonical again, check whether `NOTEPUB_REF` was
  rolled back.
- **GitHub Pages cannot do 301 or 410**, only 404 and a JS/meta redirect. Deliberately unused: the site had ~60
  views a month at the cutover, so no redirects were written for the removed atom URLs or the old
  `/cases/cases/{slug}` paths.

## Branches

- `main` — the live site. `restructure/cases-to-root` was fast-forwarded into it on 2026-09-04 and
  everything since has landed here directly. A push to `main` deploys, so treat it as publishing.
- `archive/llm-graph` — full snapshot of the atoms experiment plus 102 hand-written articles from the site
  that preceded it (`blog-source/`), kept because they existed nowhere else.
- `restructure/cases-to-root` — merged, kept only as a marker of where the restructure ended.
