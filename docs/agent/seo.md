# The SEO factory, articles, analytics

> Moved out of `CLAUDE.md` on 2026-11-02 so that it loads only when the work needs it (read before adding an article, touching `seo/`, Wordstat, Webmaster or IndexNow).
> The rules that must never break stay in `CLAUDE.md`.

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
