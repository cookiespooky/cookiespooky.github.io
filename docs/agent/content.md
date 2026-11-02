# Content model, page contracts, `/lab/`, `/notes/`, cases, timeline

> Moved out of `CLAUDE.md` on 2026-11-02 so that it loads only when the work needs it (read before editing `content/`, `rules.yaml` or `theme/templates/`).
> The rules that must never break stay in `CLAUDE.md`.

## Content model (`rules.yaml`)

Page types, each a template plus a permalink:

| type | permalink | template |
|---|---|---|
| `home` | `/` | `home.html` |
| `catalog` | `/cases/` | `catalog.html` |
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
| `homenew` | `/novaya-glavnaya/` | `home-new.html` — a draft of the next home page, `noindex`, in no sitemap and no menu |
| `projects` | `/projects/` | `projects.html` — «Всё, что сделано»: the four area sections of today's home page, `noindex` until the swap |

**Anton, 2026-10-28: this draft is an experiment and stays one — it does not become the home page.** The published
home page stays as it is, and the rework of the site in the working tree after the published version is
experimental too: none of it is rolled out. Publishing anything else here, commit only that and check that the home
page built from the commit matches the published one.

**A draft of the next home page lives beside the real one since 2026-10-11** (Anton: the home page should hold only
what is ready to hand over now, in one line through Life OS; the full list moves to its own page — arguments in
`../life/knowledge/ideas/site-home-one-line.md`). **Since 2026-10-12 the draft is a ladder of four sections** — язык,
ИИ, инструменты, лаборатория (`steps` in its frontmatter: a description, **one** key action — `links` holds exactly one
line, a blue link with an arrow — and `cards`, a horizontal row under the scheme with only what belongs to the section's thought;
other products stay on `/projects/`; the cards of the Life OS section are its features, «в разработке» in a kicker
following the component registry by hand; the generated `lifeos_groups` and `works_with` are no longer drawn by the template) — Anton's note of that day, arguments in
`../life/knowledge/ideas/site-own-projects-graph.md`. Every graph node leads to a section of the page, not to another
page. A YAML comment above `steps` lists the texts that do not exist yet and where each will stand.
**The first three sections carry a live scheme** (2026-10-12; the lab has none for now — Anton, the same day): `partials/line-live.html` is one script that draws them into the
`<div class="lm" data-lm="map|ask|flow">` that `home-new.html` puts under the section head (one explicit branch
per section `id`) — the same graph of a made-up workshop in three states (a heap laid out into a map; a question
answered along a path; incoming messages changing the map and a «Сегодня» list in a loop), drawn straight on the
page with no card or frame around it. The company, the sums and the answers are written out in that file: it calls no model. Styles are
the `.lm*` rules in `home.css`; without the script the boxes stay empty and are hidden.
`content/home-new.md` is frontmatter like `home.md`; its
`lifeos_groups` block is **generated**: `python3 scripts/home_new.py` rewrites the lines between the two marker
comments from `data/components.json` — the Life OS component registry (`lifeos component export ../site/data`, run in
`life/`; the same file `lifeos-site/` is built from), parts with status «работает» only. `--check` says whether page
and data differ and compares the graph (`partials/home-graph-new.html`, hand-typed like the old one) with the
sections: every node must lead to an `id` in `steps`, and every section must have a node. The graph script is a copy in `partials/hg-script.html` —
`home.html` was not touched. `projects.html` is a copy of the four area sections of `home.html`, fed by the same
collections; `content/projects.md` repeats the `areas` and `lifeos` texts of `home.md`. **Swapping the pages is not
done**: it means moving `type: home` and the JSON-LD block (`WebSite` + `Person`) to the new template, dropping
`noindex` from both pages, and deleting the duplicates.

**A template that calls a function the engine does not have empties every page, and the build still exits 0** —
seen 2026-10-11 with `hasPrefix`: all pages came out 3 KB with an empty `<main>`. The census is the alarm:
`assistant-index.json: секций 0` means the templates did not render. This is why a link to another site carries
`ext: true` in frontmatter instead of the template looking at the address.

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

`blog`, `home`, `catalog`, `notes` and `lab` are singletons (`validation.single_page_of_type`). `/services/` itself is a `page`
(`content/services.md`), not a `service` — the `service` type is only for individual landings.

**The home page is frontmatter, not template — except the graph.** `content/home.md` has an empty body: the hero
text (`hero_kicker`, `hero_title`, `hero_lead`), the Life OS block (`lifeos`), the four areas (`areas.dev|lang|ai|ideas`,
each a `title` and a `text`) and `about` are frontmatter keys that `home.html` only arranges. `lifeos.show: false`
hides the four-cell Life OS section without deleting it; while it is hidden Life OS is the first row of the tools
area, linking to its idea in the lab. The blocks about work to order — `razbor`, `process`, `skills`, `cta_*` —
moved to `content/cases.md` and are arranged by `catalog.html`. Copy for `/services/` is the same pattern: the
seven-item `services:` list in `content/services.md`.

**The hero graph is `partials/home-graph.html`, and its coordinates are typed in.** The engine has no arithmetic,
so every node carries its own numbers: `data-x`/`data-y` for the wide layout (viewBox `0 0 1200 600`) and, on the
nodes a phone shows, `data-mx`/`data-my`/`data-mly` for the narrow one (four children per area, fanned). A node is
an `<a href="#…">` to a section or a row (`p-<case slug>`, `i-<idea slug>`, `p-lifeos`), so the graph works with
no script; the script at the end of `home.html` switches the layout at 760px, drifts the nodes and moves the
lines with them, and shows the header once the page is scrolled (on the home page the header and the assistant
button are hidden over the hero — `body:has(.home)` in `base.css`). **Adding, removing or renaming a node is a
hand edit of that partial**: the node, its line in `hg__edges`, and room among its neighbours' labels — the
area's nodes share a column and their labels collide if two sit on one height. A node whose target id does not
exist scrolls nowhere and nothing checks it; after touching the partial, compare the `href="#…"` of every
`hg__node` in `dist/index.html` with the ids on that page.

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

- `home_lang`, `home_dev`, `home_ai`, `home_ideas` (cases by `area`) and `ideas_lang|dev|ai|ideas` (lab ideas by
  `area`) — the four sections of `home.html`; `cases_client` (`area: client`) — the list on `/cases/`;
- `cases_all`, one per `group` (`cases_products`, `cases_ai`, …) and `cases_featured` — declared, and since
  2026-10-11 rendered by no template: `group` is the old split by kind of task, kept for `clusters_check.py`;
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
group: products           # products | ai | components | research | lab | sites — the old split, shown nowhere now
area: dev                 # dev | lang | ai | ideas — the home section; client — the /cases/ page; none — listed nowhere
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

`area` decides where a case is listed, and a typo in it silently drops the case from every list rather than
failing the build — a case with no `area` (four have none on purpose: `graphreach`, `recca`, `marketing-os`,
`gorod-katalog`, taken off the home page on 2026-10-11) keeps its page and its place in the sitemap and
is reached only through `related` links. Within an area rows sort by `nav_order`; the first six of the tools
area carry 1–6 for that reason. A row's id is `p-<slug>`, which the hero graph links to. The breadcrumb on a case
page reads «Кейсы» → `/cases/` for `area: client` and «Проекты» → `/#projects` for everything else, and the
`BreadcrumbList` says the same.

A case has either a `shot` or a `cover` (`grid | rings | waves | dots | beam`, drawn by `partials/cover.html`).

Adding a case, in order: copy an existing `content/cases/*.md`; set `area` (and `group`); drop the webp into
`theme/assets/shots/`, run `python3 scripts/shots.py` and point `og_image` at the generated `/assets/shots/og/`
card; run `./scripts/build.sh` and check that the census shows one more кейс and that the row appeared in the
section you meant. A node in the hero graph is a separate, optional hand edit (above).

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
`case.html`, in every place that renders a case thumbnail (the four area sections in `home.html`, `catalog.html`,
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
(under each date a card per project with that day's events as dots on one vertical line, a count on top and a «Коротко» line under each date (`lifeos timeline summary <date> "…"`, one per day); **the page's hero is the screen of the current offer** — title, text and a button from the export (`hero_cta_label`, `hero_cta_url` in `page.html`), repeated in the bottom call — and only while there is no offer does it speak about the feed itself; the generator writes the cards as markup with `tl-*` classes, which the `safe` HTML policy lets through, and their look is at the end of `theme/assets/base.css`) and is in no menu: the
entry to it is the link in the Threads profile. An event is written at a commit that changes something a stranger
can see, in any public project — `lifeos timeline log <project> "…"`; the rule and the list of projects are in the
root `CLAUDE.md` and `../life/lifeos.yaml`.

## `/cases/` is the page of work to order

Until 2026-10-11 `/cases/` redirected to the home page, whose catalogue held every case. Now `content/cases.md`
is the one page of type `catalog`: the cases with `area: client` (six jobs for companies and the three site
components), then the blocks that used to open the home page — «Сначала разбор», «Как идёт работа», the stack —
the link to `/services/` and the call to write about a task. It is the only place in the site's chrome where
work to order is offered; the header carries «Кейсы», the footer does not, and `/services/` is linked from here
and from the articles' `cta_service` only.

Anchors do not survive a `redirect_to`: the engine percent-encodes the `#`. Redirect to a path, not to a fragment.
