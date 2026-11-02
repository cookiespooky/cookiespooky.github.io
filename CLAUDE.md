# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The personal site of Anton Lozhkin, `https://antonlozhkin.ru` (GitHub Pages) — a static site built with the
[`notepub`](https://github.com/cookiespooky/notepub) engine (checked out at `../projects/notepub`). It presents
Anton's own work: the home page is a graph of his products, projects and ideas; everything made for clients lives
on one page, `/cases/`, with the services landings and the commercial blog reachable from there. Everything is in
Russian.

This file holds what must not break and how to build. **The details live in `docs/agent/` and are read only when
the work reaches them:**

| before you… | read |
|---|---|
| edit `content/`, `rules.yaml`, `theme/templates/`; add a case, a lab idea, a note, a screenshot; touch SEO metadata, JSON-LD, `llms.txt`, `/timeline/`, `/cases/` | `docs/agent/content.md` |
| add an article, touch `seo/`, run Wordstat, look at Webmaster, Search Console, IndexNow | `docs/agent/seo.md` |
| touch `lab/`, the site assistant or its index | `docs/agent/assistant-and-lab.md` |
| edit `theme/assets/app.js` or a tool page | `docs/agent/theme-js.md` |
| need the full build notes (why the scripts are written as they are, `static/`, 404, `.gitignore` history) or the site's background | `docs/agent/build.md` |
| touch the domain, certificate, Pages settings or workflows; "fix" something that looks unfinished; need context outside this repo or the branches | `docs/agent/deploy-and-gaps.md`, then `docs/deploy-history.md`, `docs/site-history.md` |

## Before you touch anything

The mistakes here that cannot be taken back by the next commit:

- **A push to `main` publishes the live site.** There is no staging branch. Uncommitted work and local commits are
  safe; only the push publishes.
- **`CNAME` must reach `dist/`.** Without it GitHub Pages drops the custom domain.
- **Never press Remove on the yellow "DNS Check in Progress"** in Settings → Pages — it revokes a working
  certificate.
- **Private material lives next door, never here.** `../life/` is Anton's private vault; its `archive/diary/` holds
  live credentials, contracts and therapy material. Nothing from there is published or copied here without his
  explicit permission.
- **An untracked directory at this repo's root is a warning.** Stage paths, never `-A`, and read
  `git status --porcelain` before committing. Renaming can lift a file out of `.gitignore` — it matches by name.
- **Check `pwd` before git** — `np-personal` is not a repo; `git` answers here (public) and in `../life/` (private).
- **The new home page is an experiment** (`scripts/home_new.py`, `content/home-new.md`, Anton 28.10): never swap it
  in; a push carries only the files it is about.
- **Never rename an existing slug** — slugs are in the sitemap and Pages cannot 301.

## Build & run

```bash
./scripts/build.sh                        # -> dist/; the only correctness check there is
./.bin/notepub serve --config ./config.dev.yaml --rules ./rules.yaml   # preview on 127.0.0.1:8080
```

| command | when |
|---|---|
| `python3 scripts/clusters_check.py` | after adding an article or touching `seo/clusters.yaml`; exits 1 on a broken join |
| `python3 scripts/lab_check.py` | after adding or editing an idea in `content/lab/` |
| `python3 scripts/home_new.py --check` | after `data/components.json` or the draft home page changed |
| `python3 scripts/shots.py` | after dropping a webp into `theme/assets/shots/` — needs Pillow |
| `python3 scripts/wordstat_queue.py` / `wordstat_import.py --dry-run` | before / after a Wordstat session (`docs/agent/seo.md`) |
| `python3 scripts/indexnow.py --dry-run --sitemap=dist/sitemap-0001.xml` | testing the IndexNow selection offline; CI pings for real |

- **A clean build prints its census** — `llms.txt: услуг N, кейсов N, статей N, заметок N, идей N`, then
  `assistant-index.json: секций N`; compare with the previous build to see a new file landed in the right type.
  **A build with no census still exits 0** — without `python3` on PATH it skips both files, so no census means a
  broken build.
- `serve` reads templates once: restart it after editing `theme/templates/`; Markdown reloads by itself.
- Unknown frontmatter keys are build errors. The engine does not check JSON-LD — after touching a template, parse
  every block in `dist/` (`json.loads` over each `<script type="application/ld+json">`).
- `build.sh` resolves the engine as `$NOTEPUB_BIN`, `./.bin/notepub`, `notepub` on PATH, else `go install …@$NOTEPUB_REF`
  into `./.bin`. **A stale `./.bin/notepub` silently outranks a bumped `NOTEPUB_REF`** — delete it to build the way
  CI will. The pin lives in `scripts/build.sh` and `.github/workflows/pages.yml` (and in six places outside this
  repo — the `notepub-pin` rule in `../.claude/rules/`).
- `static/` is copied to the root of `dist/` after the build — only the three verification files and
  `static/lab/<name>/`; a copy of `robots.txt` or a sitemap there would overwrite the generated one.
- `build.sh` moves `dist/404/index.html` to `dist/404.html` and deletes `dist/404/` (else `/404/` is a soft 404).
- `.github/workflows/backend-runtime-deploy.yml` is broken — do not run it (`docs/agent/deploy-and-gaps.md`).

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
