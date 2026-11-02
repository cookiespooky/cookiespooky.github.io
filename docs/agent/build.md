# Build details and the site's background

> Moved out of `CLAUDE.md` on 2026-11-02, verbatim: the full build notes and the background the short version leaves out.

## What this is

The personal site of Anton Lozhkin at `cookiespooky.github.io` — a static site built with the
[`notepub`](https://github.com/cookiespooky/notepub) engine (a separate Go repo, usually checked out at
`~/Documents/np-personal/projects/notepub`). **Since 2026-10-11 it presents Anton's own work, not development to
order** (his decision; arguments in `../life/knowledge/ideas/site-own-projects-graph.md`): the home page is a graph
of his products, projects and ideas, and everything made for clients lives on one page, `/cases/`. Nothing was
thrown away — the **services** landings and the **blog** written against commercial keyword clusters are still
there, reachable from `/cases/` and from each other, but the home page and the header no longer lead to them.

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
