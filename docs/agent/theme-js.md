# Theme JS and the tool page port

> Moved out of `CLAUDE.md` on 2026-11-02 so that it loads only when the work needs it (read before editing `theme/assets/app.js` or a tool page).
> The rules that must never break stay in `CLAUDE.md`.

## Theme JS (`theme/assets/app.js`)

Loaded on every page; the site is fully usable without it. Two things there are load-bearing and easy to
break:

- **Sticky offsets are measured at runtime.** `--header-h` in `tokens.css` is a 74px constant, but the real
  header is taller on narrow screens (~85px), so `app.js` measures the header and writes the CSS variables
  itself, re-running on resize, orientation change and `document.fonts.ready`. CSS and JS must agree on one
  number — don't reintroduce a hardcoded offset in a stylesheet.
- **The catalogue tabs are gone from every page** (2026-10-11), but their code in `app.js` and the `.filters*`
  rules in `home.css` are still there, inert: the script returns at once when no `[data-filter]` exists.
- **`scroll-padding-top` follows the measured header** (`calc(var(--header-h) + 20px)` in `base.css`), so an
  anchor lands under the header on any page; do not put a fixed number back.
- **On phones the rows of an area are cards in one horizontally scrolling line** (`@media (max-width: 640px)` at
  the end of `home.css`): equal height, one card and the edge of the next in view.

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
