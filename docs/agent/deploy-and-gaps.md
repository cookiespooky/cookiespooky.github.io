# Deployment state, open questions, known gaps, branches, context outside the repo

> Moved out of `CLAUDE.md` on 2026-11-02 so that it loads only when the work needs it (read before touching the domain, the certificate, Pages settings, the workflows, or before "fixing" something that looks unfinished).
> The rules that must never break stay in `CLAUDE.md`.

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
  out of the sitemap. **Removed cases get no such treatment** — `astro-engine`, `llm-site`,
  `ai-marketing-assistant` and `bizos` (2026-10-12: Life OS does this now) were deleted, not moved, and redirecting deleted content at a surviving page is a
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

## Branches

- `main` — the live site. `restructure/cases-to-root` was fast-forwarded into it on 2026-09-04 and
  everything since has landed here directly (see *Build & run*: a push here deploys).
- `archive/llm-graph` — full snapshot of the atoms experiment plus 102 hand-written articles from the site
  that preceded it (`blog-source/`), kept because they existed nowhere else.
- `restructure/cases-to-root` — merged, kept only as a marker of where the restructure ended.
