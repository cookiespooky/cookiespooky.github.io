# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The personal site of Anton Lozhkin at `cookiespooky.github.io` — a static site built with the
[`notepub`](https://github.com/cookiespooky/notepub) engine (a separate Go repo, usually checked out at
`~/Documents/np-personal/projects/notepub`). Its purpose is lead generation for development work: sites, Telegram bots, parsers, automation
and MVPs. Three content areas: **cases** (portfolio, the proof), **services** (commercial landings, the
conversion) and **blog** (SEO traffic, written against keyword clusters).

Everything is in Russian.

The site previously hosted an experiment where the homepage was generated on the fly by an LLM from a knowledge
graph of "atoms". That produced ~200 thin pages and almost no search traffic, and has been removed — see
`archive/llm-graph` if you need it back. Its backends survive under `lab/` as a non-core demo.

## Before you touch anything

The six mistakes here that cannot be taken back by the next commit, each explained further down:

- **A push to `main` publishes the live site.** There is no staging branch.
- **`CNAME` must reach `dist/`.** Without it GitHub Pages drops the custom domain.
- **Never press Remove on the yellow "DNS Check in Progress"** in Settings → Pages — it revokes a working
  certificate.
- **Private material lives next door, never here.** Since 2026-09-25 `np-personal` is a plain folder with
  two sibling repos: this one (`site/`) and `../life/` — Anton's private vault, with the old Diary under
  `../life/archive/diary/` outside any git (live credentials, contracts, therapy). Nothing from there is
  published without permission, and nothing from there is copied into this repo.
- **An untracked directory at this repo's root is a warning.** Nothing private should ever sit inside
  `site/` now — the last stray, `situation/` (a copy of a private letter), was moved into `../life/` on
  2026-09-25. Stage paths, never `-A`, and read `git status --porcelain` before committing.
- **Check `pwd` before git.** `np-personal` itself is not a repo: `git` answers in `site/` (public — a push
  deploys) and in `../life/` (private).

## Build & run

**A push to `main` deploys the live site** — there is no staging branch, so a commit to `main` is publishing
and a push is the moment it goes out. Uncommitted work in `content/` is safe, and so is a local commit; only
the push publishes.

```bash
./scripts/build.sh                        # -> dist/
./.bin/notepub serve --config ./config.dev.yaml --rules ./rules.yaml   # local preview on 127.0.0.1:8080
python3 scripts/clusters_check.py         # registry ↔ content join; run after adding an article
```

The rest of the commands live next to the section that explains them; this is the whole set in one place:

| command | when |
|---|---|
| `./scripts/build.sh` | after any content or template change — the only correctness check there is |
| `./.bin/notepub serve --config ./config.dev.yaml --rules ./rules.yaml` | preview on 127.0.0.1:8080; restart it after editing a template |
| `python3 scripts/clusters_check.py` | after adding an article or touching `seo/clusters.yaml`; exits 1 on a broken join |
| `python3 scripts/lab_check.py` | after adding or editing an idea in `content/lab/`; exits 1 on a broken law of the showcase |
| `python3 scripts/shots.py` | after dropping a webp into `theme/assets/shots/` — **needs Pillow**, see *Screenshots and their derivatives* |
| `python3 scripts/wordstat_queue.py` | before a measuring session — writes `seo/wordstat-queue.tsv` |
| `python3 scripts/wordstat_import.py --dry-run` | after one — reads `seo/keys/*.csv` and the worksheet |
| `python3 scripts/indexnow.py --dry-run --sitemap=dist/sitemap-0001.xml` | testing the selection offline; CI pings for real after a deploy |
| `python3 ../life/observatory/observe.py context` | to get the research layer into context |

Nothing installs `notepub` on PATH — `build.sh` puts it in `./.bin/`, so that is where `serve` is called from.

A clean build prints its own census — `llms.txt: услуг N, кейсов N, статей N, заметок N, идей N`, then
`assistant-index.json: секций N`. It is the cheapest check that a new file landed in the type you meant:
compare against the previous build, and the numbers move or they do not. This file deliberately does not
repeat those numbers; they go stale with every article. **A build with no census still exits 0**: without
`python3` on PATH, `build.sh` prints one line to stderr and skips both `llms.txt` and
`assistant-index.json` (and leaves the canonical in `404.html`), so a missing census means a broken build.

`serve` reads the templates once at startup, so editing anything under `theme/templates/` needs a restart —
Markdown is picked up on reload. A preview that looks stale after a template change is almost always this and
not the browser cache.

Python helpers hang off the build. `scripts/llms.py` runs at the end of `build.sh` and writes
`dist/llms.txt` from the frontmatter in `content/`, so the machine-readable index cannot drift from the site;
it parses frontmatter by hand rather than importing PyYAML, because the CI runner should not need a package
for the site to build. `scripts/shots.py` is run by hand after adding a screenshot — see *Screenshots and
their derivatives*. `scripts/clusters_check.py` is run by hand too — see *The SEO factory*; it parses YAML
the same dependency-free way.

The 404 needs one more step than it looks: `build.sh` copies `dist/404/index.html` to `dist/404.html`
(the only path GitHub Pages serves as a custom error document) and then **deletes `dist/404/`**. Left in
place, `/404/` answers 200 with "страница не найдена" — a soft 404 that Yandex and Google both flag — while
a genuinely missing address correctly answers 404. Removing the directory routes `/404/` through the same
handler as everything else. The canonical is stripped from `dist/404.html` in the same step: it pointed at
`/404/`, and the file is served under every missing address, so it could only ever be wrong.

**A stale `./.bin/notepub` silently outranks a bumped `NOTEPUB_REF`.** The resolution order below prefers
the local binary over the ref, so after changing the ref a local build keeps using the old engine and looks
fine while CI builds something else. Delete `.bin/notepub` and rebuild to test a ref the way CI will.

`scripts/build.sh` resolves the engine in this order: `$NOTEPUB_BIN`, `./.bin/notepub`, `notepub` on PATH,
otherwise `go install github.com/cookiespooky/notepub/cmd/notepub@$NOTEPUB_REF` into `./.bin` (the ref is pinned
to a commit SHA at the top of the script, and CI pins the same one). It runs `validate` → `index` →
`validate --links --markdown` → `build`, then copies `media/` and `static/`, touches `.nojekyll` and duplicates
`404/index.html` to `404.html` for GitHub Pages.

`static/` is the passthrough: its contents are copied to the **root** of `dist/`, unchanged and unindexed, for
files the engine does not generate and that must answer at an exact address. At the root that is three files,
all described under *Analytics and Webmaster*: Google Search Console's `googlef059833b49e2a968.html`, Bing's
`BingSiteAuth.xml` and the IndexNow key `ed8e07f3d48a4975c208f518b6d94488.txt`. The engine never sees these
files, so they get no canonical, no sitemap entry and no template — which is what the verifiers want. The one
other occupant is `static/lab/<name>/`, heavy things a lab room points to (see *`/lab/`* below).

Nothing else belongs at the root. `robots.txt`, `sitemap.xml`, `sitemap-index.xml` and `sitemap-0001.xml` are engine
output written straight into `dist/`, and the passthrough runs *after* the build — so a copy of any of them in
`static/` would not sit alongside the generated file, it would overwrite it.

There is no test suite. Correctness means `./scripts/build.sh` exits clean — `validate` reports frontmatter,
route and link errors, and unknown frontmatter keys are build errors, so a typo in a field name fails the build
rather than silently disappearing. The engine does not check JSON-LD, so after touching a template parse every
structured-data block in the build:

```bash
python3 - <<'EOF'
import re, io, json, glob
for f in glob.glob('dist/**/index.html', recursive=True):
    for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', io.open(f).read(), re.S):
        json.loads(b)   # бросит, если сломано
EOF
```

`.bin/`, `dist/`, `dist-dev/`, `artifacts/` and `.notepub/` are gitignored. `.gitignore` still lists `life/`,
`research/`, `daily/` and `Diary` — names private material had when it lived inside this repo — so that
nothing under those names can ever surface here again.

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
| `lab` | `/lab/` | `lab.html` |
| `idea` | `/lab/{slug}/` | `idea.html` |
| `page` | `/{slug}/` | `page.html` |
| `notfound` | `/404/` | `notfound.html` |

`blog` paginates: `paginate: { collection: "posts_all", per_page: 10, path: "/blog/page/{{ n }}/" }` on the
type, added to the engine in `v0.1.8`. Page 1 stays at `/blog/` and only pages 2..N are synthesised, so the
address of the feed never moved. The rule to know before paginating anything else: **a synthesised route
carries no identity.** It shares one Markdown file with page 1, so its `Slug` is cleared and `PageNum` marks
it, and six builders skip it — the slug index, the resolver index, the wiki map, both search indexes and
collection membership. Miss one and you get a wikimap collision, or worse, a slug that resolves to page 2 on
some builds and page 1 on others. Templates read the slice through `.Collections.<name>.Page`
(`Current`, `Total`, `Count`, `PrevURL`, `NextURL`), which is nil when the collection is not paginated.

The same engine release made the build deterministic (the history is in `docs/site-history.md`): two builds
over identical content differ only in `search.json`'s `generated_at`, so a build diff is worth reading.

`blog`, `home`, `notes` and `lab` are singletons (`validation.single_page_of_type`). `/services/` itself is a `page`
(`content/services.md`), not a `service` — the `service` type is only for individual landings.

**The home page is frontmatter, not template.** `content/home.md` has an empty body: every word on `/` —
`hero_kicker`, `hero_title`, `hero_lead`, `hero_note`, `hero_stats`, the whole four-step `razbor` block,
`process`, `skills`, `cta_title`, `cta_note` — is a frontmatter key that `home.html` only arranges. Copy for
`/services/` is the same: the seven-item `services:` list in `content/services.md`. Look for site text in
`content/`, and change `home.html` only to change the arrangement. Two of those keys count things the build
also counts and nothing reconciles them: `hero_stats[0].value` and the «N проектов» in `description` and
`hero_note` are typed by hand, so they drift from the case census on every added case. A fourth copy sits in
`config.dev.yaml`'s `site.description` and drifts the same way, harmlessly — the dev config never ships, and
the production `config.yaml` deliberately carries no number at all.

A `service` may also carry `demos: ["calc", "plan", "book"]`, which renders the live partials on the landing
itself. Only `komponenty-dlya-sayta` uses it, and it should: the page that sells a calculator showed none
for months because all three demos lived on their case pages. Three on one page do not collide — the
partials were written self-contained with distinct class prefixes for exactly this.

`/services/` lists seven formats — `razbor` came last and sits first on the page — and each item carries a
`service` slug so the card links to its landing.
That link is load-bearing: before it existed the landings were near-orphans, reachable only from the one
article whose `cta_service` pointed at them. A new landing needs the item on `/services/` as much as it needs
the file.

**Site navigation is three hand-written lists, and nothing joins them to the content.** The header nav and the
drawer are both in `partials/header.html`; the third is the column in `partials/footer.html`, which also
hardcodes the two addresses that appear nowhere else in the chrome — `/tools/analiz-rechi/` and
`/kak-ustroen-etot-sayt/`. No collection and no setting feeds any of them, so a new top-level section is three
template edits that the build cannot check: `/notes/` needed all three. It is the `/services/` orphan one level
up, and it fails the same silent way — the page exists, builds clean, and is reachable only by typing its
address.

Collections are declared, not hardcoded, and reach templates as `.Collections.<name>.Items`:

- `cases_all` plus one per group (`cases_products`, `cases_ai`, `cases_components`, `cases_research`,
  `cases_lab`, `cases_sites`) and `cases_featured` — consumed by `home.html`;
- `posts_all` (blog feed, sorted by `fm.published_at` desc), `posts_recent` (4, declared for a home teaser that
  no template renders — nothing reads it today);
- `notes_all` (the `/notes/` index, sorted by `fm.published_at` desc) and `notes_recent` (3, home teaser —
  note it sorts by `fm.nav_order` asc, not by date like every other notes/posts collection);
- `services_all`;
- `related_cases` — a `forward` collection over the `related` link, so any page listing case slugs in its
  `related` frontmatter gets those cases rendered as proof rows.

Links are declared too: `related` (frontmatter field) and `wiki` (`[[wikilinks]]` in body text). Both can be
written *from* every type (`wiki` also from `notfound`), but resolve *to* a narrower set —
`home`/`case`/`page`/`article`/`service`/`note`. A `related` entry pointing at a `tool`, `blog` or `notes`
page resolves to nothing and is skipped with a warning, not an error.

### Article frontmatter contract

This is what the blog pipeline must emit. `type`, `slug`, `title` are required everywhere; unknown keys fail the
build, so add new ones to `fields.optional` in `rules.yaml` first — **that list, not this file, is the full set
of allowed keys.** The contracts here cover the fields something hangs off; eleven more are already declared
and documented nowhere (`group_title`, `gallery`, `placeholder_note`, `stats`, `quick`, `more_items`,
`more_services`, `cta_url`, `cta_button`, `tool_prompt`, `how_it_works`). Read `rules.yaml` before adding a
field — half the time it is there under a name someone already chose.

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

### `/lab/` — ideas and the things that test them

The second non-commercial section, next to `/notes/` and deliberately different from it: an `idea` is an
instrument, not an essay. Every decision behind it (host, unit, first screen, register, design) is in
`../life/knowledge/positioning/08-laboratoriya.md` and `09-lending-laboratorii.md`, the work order in
`../life/projects/lab/plan.md`; drafts live in `../life/projects/lab/` and move to `content/lab/` when finished, because
`../life/` is invisible to the engine and `draft: true` is not (see below).

- **The four lines are a partial, not copy.** `partials/lab-law.html` prints `elements`, `rule`, `form`,
  `control` and then `not_proven`, identically on every idea. An empty field prints as a dash rather than
  vanishing, so a missing control shows as a hole. **`/lab/` itself does not carry it** (since 2026-09-29): the
  index is the title, one line and straight into the ideas — no full-screen first screen, no explanation of
  the four lines. Don't bring the explanation back to the landing.
- **The engine cannot require them.** `fields.required` is global, so requiring the four lines would fail
  every case and article. `scripts/lab_check.py` does it instead, `clusters_check.py`-style: the five fields
  filled, no `cluster` or `cta_service` on an idea, every `related` slug real, every `room` backed by a partial
  *and* a branch in `idea.html`.
- **No offer on these pages, and nothing says so.** Neither template includes `cta.html` or the Telegram
  aside, and no copy explains the absence — that is a decision in `08`, not an omission to fix.
- **No preview grid.** `lab.css` has nothing resembling `case-row`: the index is one column of text, numbered
  by a CSS counter (the engine has no arithmetic), and related cases on an idea render as text rows too.
- **`room`** is the `demo` mechanism for ideas: a self-contained `partials/room-<name>.html` with its own
  `<style>`/`<script>`. A template cannot pick a partial by a field's value, so each room is one explicit
  branch in `idea.html`. A heavy thing goes to `static/lab/<name>/` and the room partial is its entrance — check
  that no engine route answers at that address first, since `static/` is copied *after* the build and
  overwrites silently. Five ideas carry a room: `1bitmusic`, `phrase`, `selfloop`, `tree` and `order`. `order` is a
  series, not a room: `partials/room-order.html` includes six rooms in turn (Lissajous, sunflower, crystal, flock,
  particle life, letters) and defines the shared `rord-*` classes and the `rordRun` helper, which runs a room's
  animation only while it is on screen. Each room carries «↺ сначала» in the row of its knob's label, next to the slider — it is a control too, not a header
  ornament (`data-rord-reset`, one delegated handler in `room-order.html`); under each room's title a `rord__idea`
  paragraph says what the thought is and why the mechanism works: every range input goes back to its `defaultValue` with an `input` event, then the room gets a
  `rord-reset` event — crystal, flock and particles re-seed their elements, Lissajous clears its trace; a room with
  state of its own must listen for it (`(root.closest('.rord__room') || root).addEventListener('rord-reset', …)`). Where the eye could be fooled — crystal, flock, particles, letters — the
  room measures its own order and prints the number; the thresholds behind the words it prints were checked by
  runs in node, and each partial's header comment carries them. Two rooms embed data that is regenerated, never
  edited: `room-tree.html` holds the output of `~/Documents/np-personal/projects/thechoice/tree-export.js lyudi 5`, and
  `room-selfloop.html` holds counts from the `consciousness-revelation` CSVs. The letters room fetches
  `static/lab/letters/crime-and-punishment.txt` (the first 120 000 characters of the novel, lowercased).
  `1bitmusic` is a copy of `~/Documents/np-personal/projects/1-bit-music` (the three
  pages and `src/`, no README) in `static/lab/1bitmusic/`. On the harmony idea the partial shows the case's own screenshot
  (`shots/one-bit-music.webp`) linking to the full instrument, not an iframe: a framed preview was tried on
  2026-09-25 and dropped as redundant — the instrument wants the whole screen.
  It is a copy, not a link, so a change in that repo reaches the site only by copying again.
- **`notepub serve` does not serve `static/`**, so the lab address a room links to is a 404 in the usual preview. To see it, build
  with the dev config into `dist-dev/` (`notepub build --config ./config.dev.yaml --rules ./rules.yaml
  --dist ./dist-dev --artifacts ./.notepub/artifacts-dev`), copy `static/.` and `media/` into it and serve
  it with `python3 -m http.server 8080` from inside `dist-dev/`. **Delete `.notepub/artifacts-dev` before every
  such build**: `build` indexes only when that directory has no index, so a second build silently renders the
  frontmatter as it was at the first one.
- **`links` on an idea render twice**: as a text list right under the thing and as buttons at the end of the page
  (`lab-actions`, the first one filled) — a reader who got to the end should not scroll back up to open the thing. So
  the first link is the thing itself (the instrument, the game, the tool), not its code.
- `related` from an idea resolves to cases, ideas and notes, and each lands in its own forward collection
  (`related_cases`, `related_ideas`, `related_notes`) because a forward collection filters by type.
- The header, the drawer and the footer all carry `/lab/`, highlighted on both `lab` and `idea` pages
  (`aria-current="true"` on an idea, `"page"` on the index).

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
the meta to `noindex, follow` — pair them on anything unfinished.

### Case frontmatter contract

One file per case in `content/cases/*.md`, and the home catalogue is built entirely out of their frontmatter
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
build — `scripts/clusters_check.py` prints the current split, so an empty group shows up there. Adding a group means four
edits that nothing validates together: the `group` value in frontmatter, a `cases_<group>` collection in
`rules.yaml`, a `<button data-filter>` tab and a `<section data-group>` block in `home.html`. Miss the section
and the tab scrolls nowhere; miss the tab and the section is unreachable from the filter bar.

A case has either a `shot` or a `cover` (`grid | rings | waves | dots | beam`, drawn by `partials/cover.html`).

Adding a case, in order: copy an existing `content/cases/*.md`; set `group` to an existing value (or make the
four edits above); drop the webp into `theme/assets/shots/`, run `python3 scripts/shots.py` and point `og_image`
at the generated `/assets/shots/og/` card; run `./scripts/build.sh` and check that the census shows one more
кейс; then run `python3 scripts/clusters_check.py` and check that the case landed in the group split you meant.
Last, bump the three hand-typed counts in `content/home.md` (`hero_stats`, `description`, `hero_note`) to the
number the census just printed — see *Content model* above; they are the one thing adding a case silently
leaves wrong.

### Screenshots and their derivatives

`theme/assets/shots/*.webp` is the source: what the case page itself shows. `scripts/shots.py` derives two
things from it and is idempotent, so run it after adding a screenshot and commit what it produces:

- `shots/thumbs/<name>.webp` — 360×250, the catalogue row (displayed at 180×125);
- `shots/og/<name>.jpg` — 1200×630, letterboxed onto the paper colour rather than cropped, because a social
  card must not silently lose the half of the screenshot that mattered. JPEG on purpose: every scraper reads
  it, which is not true of WebP.

**This is the one script here with a third-party dependency**: `shots.py` imports Pillow, unlike `llms.py`,
`clusters_check.py` and the wordstat pair, which parse by hand precisely so the build needs no packages.
`build.sh` never calls it, so CI never notices — the requirement falls on whoever adds a screenshot, at the
exact step the *Adding a case* checklist reaches for it.

`shots/` holds one file more than there are cases with a `shot`: `obsidian-guide-inner.webp` is a spare with
derivatives already generated. Count `shot:` in frontmatter (`grep -l '^shot:' content/cases/*.md`), not
files on disk.

If you add a thumbnail somewhere new, point it at `shots/thumbs/`, never at `shots/` — the full-size files
once made the home page pull 5.5 MB to draw 180 px rows.

Thumbnails carry `alt="Экран проекта «{{ .Title }}»"` — the same wording as the full screenshot in
`case.html`, in all eleven places that render a case thumbnail (six group sections in `home.html`, plus
`case.html`, `service.html`, `note.html`, `tool.html`, `article.html`). **Bing counts an empty `alt` as a
missing one**, so "the adjacent title makes it decorative" does not hold here — copy the alt when you add a
new `case-row`. Two `alt=""` are deliberate: the brand photo in `partials/header.html` and the Metrika pixel
in `layout.html`; Bing flags neither. The scan that found this is in `docs/site-history.md`.

### Live components on case pages

The `components` group proves itself by running rather than by a screenshot: `demo: plan`, `demo: calc` and
`demo: book` make `case.html` render `partials/demo-plan.html`, `demo-calc.html` or `demo-book.html` in place of
the screenshot figure. Points worth knowing before touching them:

- `demo` only replaces the figure *on the case page*. The catalogue row on the home page still uses `shot`, so
  a demo case needs both fields — drop `shot` and the row falls back to a drawn cover.
- **Each partial carries its own `<style>` and `<script>` inline.** `layout.html` can branch on
  `.Page.Type` but sees no other frontmatter, so there is no way to key an asset off `demo` the way
  `tool.css`/`tool.js` are keyed off the `tool` type; shipping the CSS site-wide would put it on every case
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
and reach templates as `.Settings.*`. That map has no `note` or `notes` entry, so a note falls back to
`og:type: website` while `note.html` calls the same page an `Article` in its JSON-LD — add the entry rather
than the other way round if it ever matters. The reverse mismatch exists for ideas: `idea: "article"` in both
configs, while `idea.html` emits `CreativeWork`. `config.dev.yaml` also lacks the `tool` line the production
config has, which changes nothing today because the fallback is the same `website`.

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
| `notes.html` | `CollectionPage` (`@id` `{base}/notes/#collection`) + `BreadcrumbList` |
| `note.html` | `Article` + `BreadcrumbList`, `isPartOf` the notes `CollectionPage` |
| `lab.html` | `CollectionPage` (`@id` `{base}/lab/#collection`) + `BreadcrumbList` |
| `idea.html` | `CreativeWork` + `BreadcrumbList`, `isPartOf` the lab `CollectionPage` |
| `tool.html` | `WebApplication` |

`layout.html` additionally emits `{{ .Meta.JSONLD }}` — the engine's pass-through of a page's own `jsonld`
frontmatter field. Nothing in `content/` sets it today; every graph above is hand-built in its template.

**The graph hangs off two `@id`s minted on the home page** — `{base}/#person` and `{base}/#website`. Everything
else references them instead of repeating the author, so a parser sees one person with many works rather than
many unrelated pages that happen to share a name. Keep it that way: a new template should reference the `@id`, never
restate `Person`.

**Do not put an `ItemList` of the cases on the home page.** It was there and it had to come out: Google reads a
top-level `ItemList` as a bid for a carousel, carousels are supported for a short list of types that does not
include `CreativeWork`, and the Rich Results Test reports the page as carrying an invalid item — which is worse
than carrying nothing. The enumerable portfolio lives in `llms.txt`, which has no such rules.

The engine does not support the `{#anchor}` heading syntax: braces render literally into the heading text
and into its generated id. Link to the transliterated id the engine produces instead.

Inside a `<script>`, Go's `html/template` already emits values as quoted JSON strings — write
`{{ .Page.Title }}`, never `{{ printf "%q" .Page.Title }}`, or you get doubled quotes. Note also that the
engine exposes no arithmetic: a template cannot number a list, which is one more reason the `ItemList` was
never going to satisfy a carousel's required `position`. Validate by parsing the built HTML, never by eye —
the script is under *Build & run*.

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
  one**. `notes` needed exactly that edit. Top-level `page` files are collected rather than listed as of
  2026-09-10, after «Как устроен этот сайт» went missing from the map for the same reason one level down.
- **IndexNow.** `static/<key>.txt` holds the key; `scripts/indexnow.py` reads the *live* sitemap after a deploy
  and submits only the URLs whose `lastmod` is today. Bing and Yandex share the protocol, so one call reaches
  both, and the workflow step is `continue-on-error` — a rejected ping is a configuration problem, not a
  reason to fail a deploy. `--all` submits everything, `--dry-run --sitemap=dist/sitemap-0001.xml` tests the
  selection offline.
- **Search-engine verification files** live in `static/` and are described under *Analytics and Webmaster*.

### `/timeline/` — the feed of changes

`content/timeline.md` is **generated** — never edit it by hand. `python3 scripts/timeline.py` writes it from
`data/timeline.json`, and that file is an export from Anton's vault: `lifeos timeline export ../site/data`, run in
`../life/`. It is the one thing this repo takes from the vault, with his permission of 2026-10-08, and every line
in it was checked when it was written there (a list of public projects, stop words for clients' names, no vault
links, e-mails or phones). Both files are committed, because CI builds without the vault;
`python3 scripts/timeline.py --check` says whether the page still matches the data. The page is a plain `page`
(under each date a card per project with that day's events as dots on one vertical line, an offer card on top when the export carries one; the generator writes the cards as markup with `tl-*` classes, which the `safe` HTML policy lets through, and their look is at the end of `theme/assets/base.css`) and is in no menu: the
entry to it is the link in the Threads profile. An event is written at a commit that changes something a stranger
can see, in any public project — `lifeos timeline log <project> "…"`; the rule and the list of projects are in the
root `CLAUDE.md` and `../life/lifeos.yaml`.

## The SEO factory (`seo/`)

`seo/clusters.yaml` is the registry the blog is written against, and `seo/README.md` is its long-form
reasoning. The hard boundary: the factory **only writes Markdown into `content/`** and knows nothing about
notepub internals, because it is meant to become a separate product later.

The rule that governs everything: **one cluster = one URL.** The registry, not the text generator, is the
asset — it is what stops a second article being written for an intent that already has a page. An article's
`cluster` frontmatter is the join key back to this file, and `target_url` is the cluster's side of it.

Nothing validates that join: the engine never reads `seo/`, so a `cluster` naming a missing id, a `target_url`
pointing at a dead route, two articles claiming one cluster, or the two sides naming different `cta_service`
values all build clean. `scripts/clusters_check.py` checks exactly those four things and exits 1 on any of
them: every article has a `cluster` that exists, no cluster is claimed twice, each cluster's `target_url` is
the address of the article claiming it (or of a real page), and `cta_service` names an existing landing and
matches on both sides. Run it after adding an article or touching the registry. It is deliberately not part
of `build.sh` — the factory is meant to live apart from the site, and a registry typo should not block a
deploy. It also prints the stage spread and the case group split, which is where to look for those numbers.
What it was written to close is in `docs/site-history.md`; the two rules that came out of it are that every
article names a `cta_service` (no search visitor lands on a dead end) and that a cluster with no page keeps
`target_url: null` until the page is written.

`stage` is hand-maintained and lags, and the check does not look at it — most `written` clusters have
articles already live and in the sitemap, so read `stage` as intent, not as truth about what is published.
The queue of what to write and measure next is in `../life/knowledge/backlog.md`. A `planned` cluster carries its chosen slug
and head phrase in `note`, not in `target_url`, which stays `null` until the page exists.

**A cluster's `cases` list is a claim, not a fact — check it against the case files before writing.** Lists
were written when clusters were seeded and have been wrong (examples in `docs/site-history.md`). The quality
gate says a cluster without a case is not written, so a wrong list is how an article gets written with
nothing behind it.

**Pick the narrow formulation where top 3 is reachable over the big one where the ceiling is eighth.**
Every Webmaster slice so far (2026-09-09, 09-11, 09-12) shows the same split: positions 1–3 bring all the
clicks the site gets, 4–10 and 11–50 bring impressions and zero clicks. At this volume a larger cluster
ranked eighth is worth less than a 14/mo phrase ranked third — which is exactly how the Obsidian article
became the only page that clicks.

**An article's CTA goes to `razbor` only when the reader arrives carrying a solution before a problem**
(three do: tables, AI implementation, Obsidian). Everywhere else it goes to the service that does the
thing the article describes. Checked across the fifteen articles that existed on 2026-09-13 and nothing else
fit; articles written since were not part of that pass, so re-read the rule rather than assuming it holds.
Don't stretch it — razbor sells to people who do not yet know what to build, not to everyone.

**Don't edit an article's text, title or description on data below 100 impressions for its cluster.**
The thresholds above that (rewrite the snippet below position 10, add internal links at 4–10, leave
top-3 alone) are in `../life/knowledge/backlog.md`, declared before the numbers could argue.

Each cluster carries a `stage` (`seed → measured → planned → written → published → tracked`), a `direction`,
an `intent`, the `cases` that prove it, and `money_distance` 1–5 — how many steps from the query to paid work.
4–5 is a hard reject, not a maybe.

`rejected` is off that line and was added 2026-09-10: a territory measured and closed, with the reason in its
`note`. The registry exists as much to stop a territory being reopened as to stop a second article being
written for one intent, and a verdict that lives only in a research file is a verdict that gets re-litigated.
Three sit there now — `tables-templates-traffic` (8 124/mo of «скачать бесплатно», `money_distance` 4),
`site-generator` (a 988/mo root that is mostly password and QR generators; the real intent is 29) and
`docs-autogeneration` (57/mo on one formulation). Read that last `note` before acting on it: it closes the
*formulation*, not the territory, and names the synonyms to re-ask first.

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

Four traps the first wave walked into; examples and numbers are in `seo/wordstat.md`:

- **Set the region to Russia before taking numbers.** The first wave, and the four `../life/` exports
  added 2026-09-09, were taken on «все регионы» — comparable with each other, not with anything taken later.
- **Rename every export after its target phrase.** Wordstat names them all `wordstat_top_queries (N).csv`
  with numbering restarting per session, so a second batch silently overwrites the first.
- **Cyrillic and Latin are different queries** (ё/е are merged, and the importer folds them). Anything written
  both ways — seo, ai, crm, api — needs both forms in the registry.
- **Take phrases from Wordstat's own output, not from your head.** Word count, order and form all matter:
  «разработка сайта под ключ» is 0, «разработка сайтов под ключ» is 872.

Strategy in one line: informational tail into the blog builds host trust, which is what eventually makes the
commercial pages on `/services/` rankable at all. Commercial-intent long tail goes to a service landing, never
to an article — «сколько стоит сделать телеграм бота» is a post, «заказать телеграм бота для записи клиентов»
is a landing.

### Adding an article

The order matters: the registry decides whether the article gets written at all, and it is the half that
nothing in the build enforces.

1. **Take the cluster from `seo/clusters.yaml`.** It has to be there already, with `target_url: null`.
   A phrase with no cluster is not an article yet — it is a measurement, and it goes through
   `wordstat_queue.py` → the worksheet → `wordstat_import.py` first.
2. **Check the cluster's `cases` against `content/cases/*.md`.** The list is a claim someone made when the
   cluster was seeded, and two of them were wrong. A cluster with no real case behind it does not get written.
3. **Pick `cta_service` from the slugs in `content/services/`** — the service that does the thing the article
   describes, `razbor` only when the reader arrives carrying a solution before a problem.
4. **Write `content/blog/<slug>.md`** against the frontmatter contract above. Both dates, always:
   `published_at` sorts the feed, `date_label` is the only thing the templates can print.
5. **Close the join in the registry**: `target_url: "/blog/<slug>/"`, `stage: written`, and the same
   `cta_service` as the file. One cluster, one URL, and the two sides must name the same service.
6. **`python3 scripts/clusters_check.py`** — it exits 1 on exactly the four ways this goes wrong, and prints
   the stage spread so the new article shows up in the counts.
7. **`./scripts/build.sh`** — the census line must read one more статья than last time. That is the check
   that the file landed as an `article` and not as something else.

Nothing else has to be registered: `posts_all` picks the file up, the feed paginates itself and `llms.txt`
is rebuilt from frontmatter. A *service landing* is the opposite case — it needs its item on `/services/`
or it is an orphan.

## The site assistant

A chat widget in the corner of every page, answering from the site's own text. Three parts, and only two of
them live here.

**The index.** `scripts/assistant_index.py` runs at the end of `build.sh`, next to `llms.py`, and writes
`dist/assistant-index.json`: the built site cut into sections at every `##`, each with the exact URL of its
own anchor, ~500 characters each. It reads `dist/`, **not `content/`**, and that is the whole
point: the engine transliterates heading anchors itself (`Три вида памяти` → `tri-vida-pamiati`), so
reimplementing that here would drift and start emitting links to anchors that do not exist. Verify after
changing it by checking every anchor against the built HTML, not by eye.

**The backend** is not in this repo. It lives at `~/Documents/np-personal/projects/website-ai-assistant`, deployed to
`assistant.antonlozhkin.ru` — the same server as hookapp (`45.90.33.166`, systemd unit `assistant`, nginx
site `assistant`, TLS by certbot). It streams over SSE, so it could not be a Cloud Function like the two in
`lab/`; `proxy_buffering off` in nginx and `X-Accel-Buffering: no` on the response are both load-bearing, or
the stream arrives as one lump. It pulls `llms.txt` and `assistant-index.json` over HTTP every ten minutes,
which is why **a site deploy updates the assistant's knowledge with no second deploy**. Its `/api/chat`
route is a separate generic proxy used by other projects — do not change it.

**The widget** is `theme/assets/chat.js`, wired in `layout.html` behind `settings.assistant_endpoint`. Two
rules it exists to satisfy: nothing reaches the HTML (the site built with and without it differs by one
`<script defer>` line, so a crawler sees an unchanged document), and if the backend does not answer
`/health` there is no button, no error and no trace. It carries its own CSS and injects it only when it
mounts, the same pattern as the demo partials.

**The widget is live for visitors as of 2026-09-10**: `settings.assistant_endpoint` is set in both
`config.yaml` and `config.dev.yaml`. Turning it off is the reverse one-line change — remove the key from
`config.yaml` and the template emits nothing.

A stream can stall mid-answer (DeepSeek did, minutes after launch). The backend ends a stream after 25
seconds of silence rather than waiting out a whole-request timeout, and `chat.js` keeps whatever text has
already arrived and appends a note that it was cut off — it must never replace a partial answer with a
generic error.

On phones (≤520px) the open widget is full-screen minus 12px on every side, and locks the page by fixing
`body` at `top:-scrollY` and restoring the scroll on close — `overflow:hidden`, which the drawer's
`.is-locked` uses, is ignored by iOS. The panel is sized from `visualViewport` rather than CSS, because
`position:fixed` hangs off the layout viewport and the iOS keyboard does not shrink it: without that the
input sits under the keyboard. Size follows the viewport only, **never** the input's focus — tapping «→»
blurs the input, and a panel that resized on blur would pull the button out from under the finger. The
input is 16px on narrow and touch screens; anything smaller makes iOS zoom the page on focus.

Guardrails on a public endpoint holding a paid key: CORS is an allowlist rather than `*` (unlike the speech
analyzer), 20 requests per IP per hour and 300 a day overall. Those numbers are placeholders chosen to be
raised, not defended. Dialogues are logged to journald only — putting them in a database is the precondition
for using visitor questions as a source of article topics.

## Backends in `lab/`

**Not the `/lab/` section.** This root `lab/` predates it and shares only the name: nothing here is built,
copied or served by `build.sh`, while the section lives in `content/lab/`, `static/lab/` and `lab.css`. A
backend reaches the section only through a room partial that calls its endpoint.

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
  give it an `idea` in the `/lab/` section, its room carrying a pre-generated static fallback so it renders
  with the backend switched off.

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
lived inside the old theme's `styles.css` and `main.js`, and re-laid in the site's own language on 2026-09-25:
the frame of the live demos, mono labels, the result in rows like the lab instrument, the tone as a row of
radio buttons instead of a dropdown. Three things to know if you touch them:

- `tool.js` queries 19 `data-aa-*` hooks under a `data-agency-analyzer` root; the markup in `tool.html` must
  keep every one of them. Verify by diffing the hook lists, not by reading:
  `diff <(grep -oE 'data-aa-[a-z-]+' theme/assets/tool.js | sort -u) <(grep -oE 'data-aa-[a-z-]+' theme/templates/tool.html | sort -u)`
- the widget has three modes — input, loading, result — and `setMode()` in `tool.js` is the only place that
  shows or hides its parts. Input and result are never on screen together: the result repeats the phrase as its
  first row. The dark panel of the old theme, and the `--surface-raised*` variables it needed, are gone.
- `tool.css`/`tool.js` load only when `.Page.Type` is `tool`. Three of the eight stylesheets are conditional
  this way and the rest load everywhere: `blog.css` on `blog`/`article`/`service`/`tool`/`notes`/`note`,
  `tool.css` on `tool` alone, `lab.css` on `lab`/`idea`. `home.css` and `case.css` are still site-wide. Adding a stylesheet means
  deciding which list it joins in `layout.html`.

The endpoint is frontmatter (`endpoint`), not hardcoded as it was before. The five `?` links next to the tone
filter were dropped: they pointed at an atom page that no longer exists.

## Deployment state

The site is live at `https://antonlozhkin.ru` on GitHub Pages; the migration finished on 2026-09-05. How it
went, and the four things that cost a day each, are in `docs/deploy-history.md` — read it before touching
the domain, the certificate or the Pages settings. What still applies:

- The workflow deploys and then pings IndexNow (`continue-on-error`, so a rejected ping never fails a deploy).
- `CNAME` at the repo root holds the domain and `build.sh` copies it into `dist/`. The deploy goes through
  `upload-pages-artifact`, so a build without that file makes GitHub Pages drop the custom domain. The file
  also *drives* the setting: removing the domain in the UI alone is reverted by the next build.
- **"DNS Check in Progress" in Settings → Pages stays yellow and is stale.** Enforce HTTPS is on, which GitHub
  does not allow without a valid certificate. Do not press Remove to clear it — that revokes a working
  certificate.
- If a certificate ever sticks: remove the custom domain and add it back, but only once `CNAME` is in the
  published artifact and nothing else claims the domain. A project repo named after a path (the old `cases`
  repo held `/cases/`) keeps that path until the repo is deleted — disabling its Pages is not enough.
- From inside the sandbox `dig` is blocked; use DNS-over-HTTPS, e.g.
  `curl -H 'accept: application/dns-json' 'https://cloudflare-dns.com/dns-query?name=antonlozhkin.ru&type=A'`.

### Analytics and Webmaster

Metrika **108674124** is the counter, installed via `settings.metrika_id`, loaded as `tag.js?id=<counter>`.

**The same counter also runs on `choice.antonlozhkin.ru`** — the choice game (`~/Documents/np-personal/projects/thechoice`, in
`play.html`), where the number is hardcoded because that project has no build step, and the host is
registered in the counter's «Дополнительные адреса сайта». One counter on purpose: a separate one would
read a visit that walks from the site into the game as a visit that left the site. Two consequences worth
knowing before reading any number. The counter id now lives in two repositories, so changing it is two
edits. And **game traffic lands in this site's reports** — segment by host before comparing anything with
the thresholds in `../life/knowledge/backlog.md`, or a wave in the game reads as growth of the site. The three goals
(`partiya_nachata`, `shag_6`, `god_doigran`) are the game's funnel and are defined in the counter for it;
the site itself declares no goals.

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

Yandex Webmaster holds one host, **`https://antonlozhkin.ru`**. Its tools default to `http://` when you type
a bare domain, and `http://` 301s to a different host in Yandex's model — always type the protocol. Console
errors from `yastatic.net` and `hdrc.yandex.net` during Metrika's install check are Yandex's own, not this
site's; `docs/deploy-history.md` has the details.

### Still open

- No `_github-pages-challenge-cookiespooky` TXT record, so account-level domain verification was never
  performed. It does not affect the certificate; it stops another account from claiming the domain.
- Apex `A` TTL at reg.ru is 86400. Worth lowering before any future move — a stale day-long cache is the
  most likely reason a DNS check ever looks stuck.
- Whether the Webmaster host is verified by the `yandex_verification` meta tag in `config.yaml`
  (`74ea07470235e3be`) or by another method. If it is the tag, it is load-bearing; if not, it is dead weight
  that should be removed.
- **Sitemaps are submitted** (`https://antonlozhkin.ru/sitemap-index.xml`, to Yandex Webmaster, Search
  Console and Bing Webmaster). Yandex indexes new articles within days, so coverage is not the open question.
  Before calling any page weak, take current numbers from Webmaster and compare them with the thresholds in
  `../life/knowledge/backlog.md` — do not reason from a figure written down here.
- **IndexNow effectively submits the whole site on every deploy**, which is the opposite of what the script
  was written for. `lastmod` equals the build date on every sitemap URL because `updated_at` is set in only a
  handful of files, so the "changed today" filter matches everything. Left alone on purpose (see
  `../life/knowledge/backlog.md`): two articles reached the index within two days of publication and blanket submission
  probably helped, and at well under a hundred pages the noise is harmless. Revisit when the page count grows. Note that `--all` cannot be run from this
  sandbox anyway — the local Python has no CA bundle (`CERTIFICATE_VERIFY_FAILED` on every https, while
  `curl` to the same host works).

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
- **No taxonomy routes and no RSS in the engine.** Collections only come in `filter` and `forward` kinds;
  `group_by` groups items inside a collection but generates no route, so `tags` still produce no pages. That
  is why articles carry tags from the start.
- **`search.json` is built and nothing reads it.** `rules.yaml` carries a whole `search:` block —
  `include_types`, `fields_boost`, `preview` — and the engine writes ~40 KB of `dist/search.json` on every
  build, but no template and no script fetches it: there is no search on the site yet. So adding a type to
  `search.include_types` changes that one file and nothing a visitor sees, and a page missing from search is
  not a bug to chase. It is also the only source of build nondeterminism (`generated_at`). Leave it until the
  search itself is written.
- **Articles have no image of their own.** Their `Article` schema and `og:image` both fall back to the
  site-wide `media/og.png`, because nothing generates a per-article card. Cases have one; articles do not.
- **Two slugs are provisional.** `/tools/analiz-rechi/` and `/blog/kak-rabotaet-analiz-rechi/` were named by
  hand before any keyword research, and their clusters (`speech-agency-tool`, `speech-agency-explainer`)
  were written around the existing names afterwards. Renaming costs nothing while the site has no traffic;
  every later article was named from its cluster instead.
- **Two engine regressions to recognise.** Cyrillic headings rendering as `id="-"` or `id="heading"` (fixed in
  `8885413`), or canonicals and sitemap `<loc>` without a trailing slash (fixed in `6e57516`), mean
  `NOTEPUB_REF` was rolled back. Both bugs are described in `docs/site-history.md`.
- **GitHub Pages cannot do 301 or 410**, only 404 and a JS/meta redirect. Mostly unused: the site had ~60
  views a month at the cutover, so nothing was written for the old `/cases/cases/{slug}` paths. Four atom URLs
  are the exception, added 2026-09-07 after a Yandex crawl report showed the robot still hitting them:
  `/personal-notes-analysis/` and `/self-tracker/` → `/cases/obsidian-analysis/`,
  `/marketing-os-content-pipeline/` → `/cases/marketing-os/`, `/agency-and-action-mode/` →
  `/blog/kak-rabotaet-analiz-rechi/`. Each is a `page` with `redirect_to` plus `noindex: true`, so it stays
  out of the sitemap. **Removed cases get no such treatment** — `astro-engine`, `llm-site` and
  `ai-marketing-assistant` were deleted, not moved, and redirecting deleted content at a surviving page is a
  soft 404: the engine keeps the dead URL in the index as a duplicate instead of dropping it. A plain 404 is
  the signal that removes them.

## Context that is not in this repository

**Two layers, and since 2026-09-25 they are two places.** This repo is the **public layer**: the site, its
SEO registry and scripts. **`../life/`** is everything else — Anton's single Obsidian vault and a separate
private git repository: dashboard, phone chat with Claude, tasks, journal with personal metrics, knowledge,
projects, and the old Diary under `../life/archive/diary/` (outside every git repo: live credentials, contracts,
therapy). It was `research/` plus `daily/` nested inside this repo until 2026-09-25; now it is a sibling. Its own `../life/CLAUDE.md` describes it; its paths are in
`../life/lifeos.yaml`, where `site:` points back here.

**The vault config is tracked, its workspace file is not.** `.obsidian/` sits in the public repo — the
appearance, the plugin list and the `obsidian-git` plugin itself. `.obsidian/workspace.json` is gitignored
and must stay so: it records `lastOpenFiles`, and from the months when this vault also held the Diary and
`research/` it still names private files.

The public layer is not the most important part of the system, only the one with the most attention right
now. What the current vector is, and how it should be corrected against the rest, lives in
`../life/knowledge/vector.md` — read it before deciding what is urgent.

| where | what |
|---|---|
| `../life/observatory/` | the observable system: daily grouped into Obsidian canvases, hypotheses with kill criteria, an agent run on new data. **To get the system into context, run `python3 ../life/observatory/observe.py context`** (under a second, ~3k tokens; opens with today, data freshness and what is new), then descend with `show <id>`, `tree`, `find <words>`, `near <note>`, `hyp <name>` instead of reading `../life/archive/diary/` file by file; details in its `README.md` |
| `../life/knowledge/vector.md` | the current vector of attention: what it is, why, until when, and what would correct it |
| `../life/knowledge/backlog.md` | deliberately deferred tasks, each with a reason and a threshold for return — read it before "fixing" something that looks unfinished |
| `../life/knowledge/context/` | map of the `../life/archive/diary/` archive, the author's portrait, Threads mechanics, the 2031 horizon |
| `../life/projects/niche/` | the search for a product niche: method, signal registry, Wordstat exports, the RFM and outstaff demos. Writes upstream into `seo/` — the tables clusters and the three rejections came from there. Has its own `CLAUDE.md` |
| `../life/knowledge/positioning/` | positioning: diagnosis, Trout-style positions, self-presentations, verification protocol |
| `../life/projects/threads-plan/` | Threads content plan, hook rules, profile packaging |
| `../life/references/Пюре райтинг/` | notes from someone else's Threads channel on copywriting — a style sample to read, **not the author's own text**: nothing from it goes into `content/` |
| `~/Documents/np-personal/projects/thechoice` | the choice game (idea 9 from `../life/knowledge/positioning/`), its own **private** repo `cookiespooky/thechoice` since 2026-09-24 — so nothing on the site links to it — and live at `choice.antonlozhkin.ru`, with a password-protected staging copy at `staging.choice.antonlozhkin.ru` (`deploy.sh --staging`, same server, own unit and parties — test there before prod): `rules.js` holds the whole world, `engine.js` knows no plot, `node check.js` verifies the rules. It moved out of `research/vybor/` so that a third git repo would not answer from inside the vault. Party transcripts, the key and the author's research notes stay on disk and out of that repo |
| `../life/knowledge/changelog.md` | why the research layer changed, newest first — priorities moved, territories closed, layers rebuilt. The private repo's git history says *what* |
| `../life/archive/diary/` | Obsidian archive since February 2025 and the vault Obsidian opens on the Mac (its own `.obsidian`, synced to the phone by remotely-save through MinIO); outside both repos. Named `Diary/` until 2026-09-25 — `.gitignore` keeps both names, so an empty `Diary/` recreated by an old Obsidian entry cannot surface. The copy in `~/Yandex.Disk.localized/Diary/Diary` is retired: two vaults syncing one bucket is how notes get lost |
| `~/Documents/np-personal/projects/consciousness-revelation` | separate public repo: a preregistered experiment with a negative result |
| `~/Documents/np-personal/projects/notepub` | the engine itself: the Go repo `build.sh` installs the binary from at `NOTEPUB_REF` |

`../life/` carries its own `CLAUDE.md` (and `../life/projects/niche/` a second one) — read the one for the layer you
are working in; this file describes the public layer only.

A commit or push in `../life/` goes to the private repo, not to the site — check `pwd` before running git,
since both repos answer from inside the vault.

`../life/archive/diary/` holds client contracts, therapy material and live credentials — nothing from it is published without
explicit permission. Live keys in it are due for rotation.

Durable facts about the author and the strategy are also in the session memory directory, which
loads automatically; `../life/knowledge/context/` holds what is too long for that.

## Naming

Russian for what a person reads — page copy, script output. English for what a machine addresses — files,
directories, functions, flags, frontmatter keys, cluster ids. Transliteration **only in slugs**, because
those are public and indexed.

So a new content file is named in English while its `slug` stays transliterated: `content/lab/rules-before-objects.md`
with `slug: pravilo-pervichnee-obekta`. The engine resolves by path, filename and slug, so the two are
allowed to differ — but never rename an existing file's slug: they are in the sitemap and Pages cannot 301.

`seo/clusters.yaml` ids already follow this. Transliterated filenames elsewhere are drift, not a decision;
renaming them is tracked in `../life/knowledge/backlog.md`.

**Renaming can lift a file out of `.gitignore`** — it matches by name, so a renamed private file becomes
unignored and one `git add -A` publishes it. This happened on 2026-09-24 in a sibling repo and was caught
before a push. It is the same reason this file says to stage paths and never `-A`.

## Commits

The site is in Russian and the history is in English: an imperative subject saying what the commit does to
the site rather than to the files («Show the components on the page that sells them», not «update
service.html»), and a body that explains *why* — the constraint found, the thing that broke, the reason the
obvious alternative was not taken. Several entries in this file started life as such a body. Keep both
halves; a subject with no body is fine only when there is genuinely no reasoning to lose.

## Branches

- `main` — the live site. `restructure/cases-to-root` was fast-forwarded into it on 2026-09-04 and
  everything since has landed here directly (see *Build & run*: a push here deploys).
- `archive/llm-graph` — full snapshot of the atoms experiment plus 102 hand-written articles from the site
  that preceded it (`blog-source/`), kept because they existed nowhere else.
- `restructure/cases-to-root` — merged, kept only as a marker of where the restructure ended.
