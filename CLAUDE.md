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

`serve` reads the templates once at startup, so editing anything under `theme/templates/` needs a restart —
Markdown is picked up on reload. A preview that looks stale after a template change is almost always this and
not the browser cache.

Two Python helpers hang off the build. `scripts/llms.py` runs at the end of `build.sh` and writes
`dist/llms.txt` from the frontmatter in `content/`, so the machine-readable index cannot drift from the site;
it parses frontmatter by hand rather than importing PyYAML, because the CI runner should not need a package
for the site to build. `scripts/shots.py` is run by hand after adding a screenshot — see *Screenshots and
their derivatives*.

The 404 needs one more step than it looks: `build.sh` copies `dist/404/index.html` to `dist/404.html`
(the only path GitHub Pages serves as a custom error document) and then **deletes `dist/404/`**. Left in
place, `/404/` answers 200 with "страница не найдена" — a soft 404 that Yandex and Google both flag — while
a genuinely missing address correctly answers 404. Removing the directory routes `/404/` through the same
handler as everything else. The canonical is stripped from `dist/404.html` in the same step: it pointed at
`/404/`, and the file is served under every missing address, so it could only ever be wrong.

`scripts/build.sh` resolves the engine in this order: `$NOTEPUB_BIN`, `./.bin/notepub`, `notepub` on PATH,
otherwise `go install github.com/cookiespooky/notepub/cmd/notepub@$NOTEPUB_REF` into `./.bin` (the ref is pinned
to a commit SHA at the top of the script, and CI pins the same one). It runs `validate` → `index` →
`validate --links --markdown` → `build`, then copies `media/` and `static/`, touches `.nojekyll` and duplicates
`404/index.html` to `404.html` for GitHub Pages.

`static/` is the passthrough: its contents are copied to the **root** of `dist/`, unchanged and unindexed, for
files the engine does not generate and that must answer at an exact address. Today that is Google Search
Console's `googlef059833b49e2a968.html`. The engine never sees these files, so they get no canonical, no
sitemap entry and no template — which is what the verifiers want.

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
| `notes` | `/notes/` | `notes.html` |
| `note` | `/notes/{slug}/` | `note.html` |
| `page` | `/{slug}/` | `page.html` |
| `notfound` | `/404/` | `notfound.html` |

`blog`, `home` and `notes` are singletons (`validation.single_page_of_type`). `/services/` itself is a `page`
(`content/services.md`), not a `service` — the `service` type is only for individual landings.

`/services/` lists five formats, and each item carries a `service` slug so the card links to its landing.
That link is load-bearing: before it existed the landings were near-orphans, reachable only from the one
article whose `cta_service` pointed at them. A new landing needs the item on `/services/` as much as it needs
the file.

Collections are declared, not hardcoded, and reach templates as `.Collections.<name>.Items`:

- `cases_all` plus one per group (`cases_products`, `cases_ai`, `cases_components`, `cases_research`, `cases_lab`, `cases_sites`) and
  `cases_components`, `cases_featured` — consumed by `home.html`;
- `posts_all` (blog feed, sorted by `fm.published_at` desc), `posts_recent` (4, for a home teaser);
- `notes_all` (the `/notes/` index, sorted by `fm.published_at` desc);
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

### `/notes/` — the non-commercial section

`note` pages are the personal-essay side of the site: linguistics, systems thinking, self-observation.
They deliberately carry **no `cluster` and no `cta_service`**, and they must stay out of `seo/clusters.yaml`.
The reason is the registry's own rule: this material is `money_distance` 4–5, which the registry calls a hard
reject. That verdict is correct *for the blog* — it is the wrong frame for this section, which exists to
differentiate and build trust rather than to convert. Routing it through the cluster registry would corrupt
both. A `note` uses `topic` (a display label only — no per-topic collection, no tabs, no filter machinery),
plus the usual `published_at` / `date_label`, `lead`, `kicker`, `tags` and `related`.

The section is reachable from the header and the drawer, so it is not an orphan the way the service landings
once were.

**`draft: true` means unlisted, not unpublished.** This bit the notes section and is worth knowing before you
rely on it anywhere: the engine still *builds* a draft page, still writes it to `dist/`, and still emits
`<meta name="robots" content="index, follow">` and a canonical for it. Drafts are only dropped from
collections, the sitemap and `llms.txt`. So a draft that reaches `dist/` is a live, crawlable URL that merely
isn't linked. To keep an unfinished page genuinely out of the index, pair it with `noindex: true`, which flips
the meta to `noindex, follow` — the four notes drafts carry both.

### Case frontmatter contract

38 case files, one per `content/cases/*.md`, and the home catalogue is built entirely out of their frontmatter
— the Markdown body is the long read below the card.

```yaml
type: case
slug: notepub
title: "..."
description: "..."        # meta description
draft: false
nav_order: 21             # sorts every cases_* collection, asc, nulls last
featured: true            # puts it in cases_featured
group: products           # products | ai | components | research | lab | sites — picks the section
kicker: "..."             # eyebrow above the title
summary: "..."            # one sentence, the catalogue row
status: "Работает, развивается"
status_kind: live         # live | wip | idea — colours the status dot
client: "..."; role: "..."; period: "..."
mark: "NP"                # 2-3 letters, drawn when there is no screenshot
demo: "calc"              # optional; plan | calc | book — a live component instead of the screenshot
shot: "notepub-home.webp" # file in theme/assets/shots/ (webp; thumbs and og cards are derived)
og_image: "/assets/shots/og/notepub-home.jpg"   # social card; else default_og_image
shot_url: "..."           # address printed in the screenshot frame
shot_caption: "..."
stack: ["Go", "..."]
highlights: ["...", "..."]        # bullets
facts: [{value: "...", label: "..."}]   # the number tiles
links: [{title: "...", url: "..."}]
```

`group` decides which section a case lands in; the counts on the home page's tabs come from
`len .Collections.cases_<group>.Items`, so a typo in `group` silently empties a tab rather than failing the
build. Current split: products 10, ai 8, sites 7, research 7, components 3, lab 3. Adding a group means four
edits that nothing validates together: the `group` value in frontmatter, a `cases_<group>` collection in
`rules.yaml`, a `<button data-filter>` tab and a `<section data-group>` block in `home.html`. Miss the section
and the tab scrolls nowhere; miss the tab and the section is unreachable from the filter bar.

A case has either a `shot` or a `cover` (`grid | rings | waves | dots | beam`, drawn by `partials/cover.html`)
— 16 have screenshots, 22 have drawn covers.

### Screenshots and their derivatives

`theme/assets/shots/*.webp` is the source: what the case page itself shows. `scripts/shots.py` derives two
things from it and is idempotent, so run it after adding a screenshot and commit what it produces:

- `shots/thumbs/<name>.webp` — 360×250, the catalogue row (displayed at 180×125);
- `shots/og/<name>.jpg` — 1200×630, letterboxed onto the paper colour rather than cropped, because a social
  card must not silently lose the half of the screenshot that mattered. JPEG on purpose: every scraper reads
  it, which is not true of WebP.

The catalogue used to point at the full-size images, so the home page pulled **5.5 MB** of screenshots to draw
thumbnails 180 px wide — one file was 1.29 MB. It is 104 KB now. If you add a thumbnail somewhere new, point it
at `shots/thumbs/`, never at `shots/`.

### Live components on case pages

The `components` group proves itself by running rather than by a screenshot: `demo: plan`, `demo: calc` and
`demo: book` make `case.html` render `partials/demo-plan.html`, `demo-calc.html` or `demo-book.html` in place of
the screenshot figure. Points worth knowing before touching them:

- `demo` only replaces the figure *on the case page*. The catalogue row on the home page still uses `shot`, so
  a demo case needs both fields — drop `shot` and the row falls back to a drawn cover.
- **Each partial carries its own `<style>` and `<script>` inline.** `layout.html` can branch on
  `.Page.Type` but sees no other frontmatter, so there is no way to key an asset off `demo` the way
  `tool.css`/`tool.js` are keyed off the `tool` type; shipping the CSS site-wide would put it on all 38 cases
  for the sake of three. Keep new demos self-contained the same way, and keep their class prefixes (`dcalc__*`, `dplan__*`, `dbook__*`) and `data-*`
  hooks distinct so two demos on one page could not collide.
- They are plain DOM, no libraries, and the numbers are placeholders meant to be edited by the visitor — the
  point of the case is that the component is configurable, not that these rates are real.
- Demo data involving dates must be generated **relative to today**, never hardcoded. `demo-book.html` seeds
  its occupancy from the current month with a small LCG, so it is stable within a session and never decays
  into a calendar full of past bookings — nobody is going to refresh these fixtures by hand.
- `case.html` marks the figure `shot shot--live`; `shot--live` has no CSS of its own, it just documents intent
  and leaves a hook for later.

### Where SEO metadata comes from

The engine builds canonical, robots, OpenGraph and sitemap entries itself; `og:type` per page type is mapped in
`config.yaml` under `og_type_by_type`. Site-wide copy and contact links live in `config.yaml` under `settings`
and reach templates as `.Settings.*`.

`og_image` in frontmatter overrides the site-wide `default_og_image`; the engine also picks up the first image
in the body when neither is set. Every case with a screenshot points it at its generated card under
`/assets/shots/og/`.

JSON-LD is **not** engine-generated: `internal/indexer` only reads a page's own `jsonld` frontmatter field, and
the engine exposes no custom template functions. Every template therefore hand-builds its structured data
inside `<script type="application/ld+json">`:

| template | emits |
|---|---|
| `home.html` | `WebSite` + `Person` |
| `case.html` | `CreativeWork` + `BreadcrumbList` |
| `article.html` | `Article` + `BreadcrumbList` |
| `service.html` | `Service` + `BreadcrumbList` + `FAQPage` when `faq` is set |
| `page.html` | `WebPage` (or `ProfilePage` when `person_page: true`) + `BreadcrumbList` |
| `blog.html` | `Blog` with `blogPost` + `BreadcrumbList` |
| `tool.html` | `WebApplication` |

**The graph hangs off two `@id`s minted on the home page** — `{base}/#person` and `{base}/#website`. Everything
else references them instead of repeating the author, so a parser sees one person with 38 works rather than 38
unrelated pages that happen to share a name. Keep it that way: a new template should reference the `@id`, never
restate `Person`.

**Do not put an `ItemList` of the cases on the home page.** It was there and it had to come out: Google reads a
top-level `ItemList` as a bid for a carousel, carousels are supported for a short list of types that does not
include `CreativeWork`, and the Rich Results Test reports the page as carrying an invalid item — which is worse
than carrying nothing. The enumerable portfolio lives in `llms.txt`, which has no such rules.

Inside a `<script>`, Go's `html/template` already emits values as quoted JSON strings — write
`{{ .Page.Title }}`, never `{{ printf "%q" .Page.Title }}`, or you get doubled quotes. Note also that the
engine exposes no arithmetic: a template cannot number a list, which is one more reason the `ItemList` was
never going to satisfy a carousel's required `position`. Validate by parsing the built HTML, never by eye:

```bash
python3 - <<'EOF'
import re, io, json, glob
for f in glob.glob('dist/**/index.html', recursive=True):
    for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', io.open(f).read(), re.S):
        json.loads(b)   # бросит, если сломано
EOF
```

### Machine-readable extras

- **Wordstat.** `seo/wordstat.md` is the procedure for taking frequencies by hand; the loop around it is
  three scripts and two return paths. `scripts/wordstat_queue.py` generates `seo/wordstat-queue.tsv` — every
  phrase in the registry with two empty columns. Rerun it after adding clusters or their phrases go
  unmeasured; it refuses to overwrite a worksheet that already has numbers in it, so transfer those into
  `clusters.yaml` first. Numbers come back either as CSV exports dropped into `seo/keys/` (preferred — the
  export carries the query tail as well as the number) or typed into the worksheet for phrases with nothing
  to export. `scripts/wordstat_import.py` reads both and writes them into `clusters.yaml`; `--dry-run`
  reports without writing, `--harvest N` also lists tail phrases above N that the registry does not have yet.
- **`llms.txt`** at the site root, generated by `scripts/llms.py`: the whole site as one Markdown list with a
  sentence per page. It is regenerated on every build, so it never lies about what exists — but it enumerates
  types by hand, one `collect(...)` call per section, so **a new page type is invisible to it until you add
  one**. `notes` needed exactly that edit.
- **IndexNow.** `static/<key>.txt` holds the key; `scripts/indexnow.py` reads the *live* sitemap after a deploy
  and submits only the URLs whose `lastmod` is today. Bing and Yandex share the protocol, so one call reaches
  both, and the workflow step is `continue-on-error` — a rejected ping is a configuration problem, not a
  reason to fail a deploy. `--all` submits everything, `--dry-run --sitemap=dist/sitemap-0001.xml` tests the
  selection offline.
- **Search-engine verification files** live in `static/` and are described under *Analytics and Webmaster*.

## The SEO factory (`seo/`)

`seo/clusters.yaml` is the registry the blog is written against, and `seo/README.md` is its long-form
reasoning. The hard boundary: the factory **only writes Markdown into `content/`** and knows nothing about
notepub internals, because it is meant to become a separate product later.

The rule that governs everything: **one cluster = one URL.** The registry, not the text generator, is the
asset — it is what stops a second article being written for an intent that already has a page. An article's
`cluster` frontmatter is the join key back to this file, and `target_url` is the cluster's side of it.

Nothing validates that join: the engine never reads `seo/`, so a `cluster` naming a missing id, a `target_url`
pointing at a dead route, or two articles claiming one cluster all build clean. Check it by hand when adding an
article — a one-off check is worth running over the whole set, since as of 2026-09-06 the registry side is
clean (23 clusters, no duplicate claims, every `target_url` resolving) but one article side is not:
`content/blog/kak-rabotaet-analiz-rechi.md` carries **no `cluster` field at all**, while
`speech-agency-explainer` names it as its `target_url`. It is the only half-open join on the site.

`stage` is likewise hand-maintained and lags — seven clusters sit at `written` while their articles are live
and in the sitemap, so read `stage` as intent, not as truth about what is published. Current spread: 7
`published`, 7 `written`, 8 `seed`, 1 `planned`.

Each cluster carries a `stage` (`seed → measured → planned → written → published → tracked`), a `direction`,
an `intent`, the `cases` that prove it, and `money_distance` 1–5 — how many steps from the query to paid work.
4–5 is a hard reject, not a maybe.

**The first wave of frequencies was taken by hand from the free web Wordstat, not from the API** — the web
interface understands the operators (`"!phrase"`) that pin word forms and the API does not, so the numbers
that decide priority can only be had that way. The API path is designed but unused: Yandex Cloud **Search
API** (`POST /v2/wordstat/topRequests` with an IAM token from a service account holding
`search-api.webSearch.user`), *not* the Direct API that most guides describe. Its binding constraint is quota
rather than money — `GetTop` allows 10 rps but only **100 requests per hour**, so any collector must be
rate-limited and resumable, since dying at request 80 costs an hour. Prices, method signatures and the
first-wave budget are in `seo/README.md`; the free Cloud Functions tier that `lab/` runs on does not cover
Search API, which needs a billing account in good standing.

Each phrase therefore carries three numbers, and they are not interchangeable:

| field | meaning |
|---|---|
| `count` | true exact frequency, with operators. The web export cannot produce it, so it is still `null` everywhere |
| `count_wide` | broad frequency, actually measured |
| `count_est` | estimated exact: broad minus the tail queries containing all the phrase's words. An upper bound, and meaningless on general phrases, where nested queries are themselves aggregated and the subtraction goes negative |

Four traps that the first wave walked into, all recorded at greater length in `seo/wordstat.md`:

- **Set the region before taking numbers.** The first wave was taken on «все регионы» rather than Russia, so
  its numbers are inflated and cannot be compared against a later wave taken correctly.
- **Wordstat names every export the same.** They all arrive as `wordstat_top_queries (N).csv` with the
  numbering restarting each session, so a second batch silently overwrites the first. Files in `seo/keys/`
  are renamed after their target phrase; keep doing that.
- **Cyrillic and Latin are different queries.** «сео для сайта» is 706 and «seo для сайта» is 1161, and
  Wordstat does not merge them (it does merge ё and е, and the importer folds those). Anything people write
  both ways — seo, ai, crm, api — needs both forms in the registry or you are measuring half the demand.
- **Take phrases from Wordstat's own output, not from your head.** Nine of the first seventy-four were
  written the way a person would say them and returned zero while the demand was real: «разработка сайта под
  ключ» is 0, «разработка сайт**ов** под ключ» is 872. Word count and order matter; word form matters.

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
- `tool.css`/`tool.js` load only when `.Page.Type` is `tool`. Two of the seven stylesheets are conditional
  this way and the rest load everywhere: `blog.css` on `blog`/`article`/`service`/`tool`, `tool.css` on
  `tool` alone. `home.css` and `case.css` are still site-wide. Adding a stylesheet means deciding which list
  it joins in `layout.html`.

The endpoint is frontmatter (`endpoint`), not hardcoded as it was before. The five `?` links next to the tone
filter were dropped: they pointed at an atom page that no longer exists.

## Deployment state

**The migration to `antonlozhkin.ru` is complete as of 2026-09-05.** Verified live: `http://` 301s to
`https://`, the certificate is Let's Encrypt `CN=antonlozhkin.ru` valid to 2026-12-03, `www` 301s to the
apex so the certificate covers both names, all 47 sitemap URLs of the day answer 200 (50 now), and Metrika 108674124 reports
`counter is initialized` in the browser.

The workflow deploys and then pings IndexNow (`continue-on-error`, so a rejected ping never fails a deploy).

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

Ownership is proved to three engines by three unrelated mechanisms, and none of them substitutes for another:

| engine | method | lives in |
|---|---|---|
| Google Search Console | HTML file at the root | `static/googlef059833b49e2a968.html` |
| Bing Webmaster Tools | XML file at the root | `static/BingSiteAuth.xml` |
| Yandex Webmaster | meta tag on every page | `settings.yandex_verification` in `config.yaml` |
| IndexNow (Bing + Yandex) | key file at the root | `static/<key>.txt`, used by `scripts/indexnow.py` |

Both files are re-checked periodically after the initial verification, so they stay — deleting one un-verifies
that property. `BingSiteAuth.xml` must keep the exact name and casing Bing generated and be served from the
apex root; its contents are the account token, not a per-site secret. Bing can also import verification from
Search Console instead, which is worth knowing but is not what is set up here.

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
- **Sitemaps are submitted and being processed.** `https://antonlozhkin.ru/sitemap-index.xml` went to
  Yandex Webmaster, Search Console and Bing Webmaster on 2026-09-05; none had processed it as of that day.
  Nothing published so far has been in an index long enough to be judged, so treat any conclusion about
  which pages work as unavailable rather than negative until the first reports arrive.
- **IndexNow has never been run over the whole site.** The workflow step submits only what changed that
  day, and the engines have not seen the other 50-odd URLs through that channel. `python3
  scripts/indexnow.py --all` does it once; it fails from this sandbox because the local Python has no CA
  bundle (`CERTIFICATE_VERIFY_FAILED` on every https, while `curl` to the same host works).

## `/cases/` redirects to the home page

Settled. `case` pages live at `/cases/{slug}/` and the catalogue is a section of the home page, so `/cases/`
itself has nothing to serve — but it is the most guessable path on the site and is where the previous cases
site lived. `content/cases.md` now redirects it to `/`.

The engine does redirects natively: `redirect_to` in frontmatter makes the route a 301 in `serve` and, in a
static build, a stub page carrying `meta http-equiv="refresh"` plus a canonical to the target. That is as close
to a 301 as GitHub Pages allows. `noindex: true` keeps the stub out of the sitemap.

Anchors do not survive the round trip: the engine percent-encodes the `#`, so `redirect_to: "/#cases"` sends
visitors to `/%23cases`. Redirect to a path, not to a fragment.

`case.html` breadcrumbs still read Главная → Кейсы → case with the middle step pointing at `/#cases`, and the
`BreadcrumbList` mirrors that exactly — structured breadcrumbs are supposed to match the visible ones. The
alternative, moving the catalogue off the home page and making `/cases/` a real canonical page, stays a
redesign: the home page is built around the catalogue with its sticky filter tabs.

`config.yaml` still carries an `og_type_by_type: catalog: website` entry for a type that does not exist in
`rules.yaml` — a leftover, harmless, and the name to reuse if that redesign ever happens.

## Known gaps

- **`.github/workflows/backend-runtime-deploy.yml` is broken**: it deploys from the old `ycf/` path and
  regenerates the deleted atoms graph. Do not run it; rewrite it when the graph demo gets its page.
- **No pagination, no taxonomy routes, no RSS in the engine.** Collections only come in `filter` and `forward`
  kinds; `group_by` groups items inside a collection but generates no route. So `/blog/` is a single unpaginated
  list and `tags` produce no pages. This is fine under roughly 12–15 articles; past that the engine needs the
  feature, which is why articles carry tags from the start.
- **Articles have no image of their own.** Their `Article` schema and `og:image` both fall back to the
  site-wide `media/og.png`, because nothing generates a per-article card. Cases have one; articles do not.
- **Two slugs are provisional.** `/tools/analiz-rechi/` and `/blog/kak-rabotaet-analiz-rechi/` were named by
  hand before any keyword research, and their clusters (`speech-agency-tool`, `speech-agency-explainer`)
  were written around the existing names afterwards. Renaming costs nothing while the site has no traffic;
  every later article was named from its cluster instead.
- **Heading anchors are fixed as of engine `8885413`.** goldmark's own generator drops multi-byte runes, so
  every Cyrillic heading on the site rendered as `id="-"`, `id="--1"` or the literal `id="heading"` — no
  section could be linked to, and `[[page#Heading]]` wikilinks pointed at ids that did not exist, because that
  side was already transliterating. Both sides now go through one `headingAnchor`. If degenerate ids come
  back, check whether `NOTEPUB_REF` was rolled back.
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
