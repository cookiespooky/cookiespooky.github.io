# The site assistant and the backends in `lab/`

> Moved out of `CLAUDE.md` on 2026-11-02 so that it loads only when the work needs it (read before touching `lab/`, `scripts/assistant*` or the assistant endpoint).
> The rules that must never break stay in `CLAUDE.md`.

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
`/health` (4 s) the widget still mounts, in a maintenance state: grey dot, «· техработы» on the button, a
notice with a Telegram link in the panel, input disabled. Every opening re-checks `/health` and revives the
chat when the server is back. Until 2026-11-02 it vanished silently instead; Anton reversed that the day
Beget went down, because a vanished service looks broken rather than paused. It carries its own CSS and
injects it only when it mounts, the same pattern as the demo partials. The speech-analysis tool
(`tool.js`) shows the same maintenance message on a network error, a 502/503/504 or no answer in 90 s.

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

Two backends born as Yandex Cloud Functions, each with its own `deploy.sh`. The code moved here from `ycf/`; nothing was
deleted except the `ysc/` Serverless Container, which was a third copy of the graph runtime's streaming logic.

- `lab/speech-analyzer/` — linguistic agency analysis over DeepSeek. **Since 2026-10-12 it runs on the server, not in
  Yandex Cloud** (the cloud stopped answering that day): `server.js` wraps the same `handler` of `index.js` in a
  dependency-free http server, `./deploy-server.sh` ships it (unit `speech-analyzer`, `/opt/speech-analyzer`, user
  `speechan`, `127.0.0.1:8097`, key in `/etc/speech-analyzer/env`), and nginx serves it as one `location = /analiz-rechi`
  inside the `assistant` site — `https://assistant.antonlozhkin.ru/analiz-rechi`, no domain of its own. 20 requests per
  IP an hour, 300 a day; visitors' phrases are not logged and the YDB log is off there. The cloud function
  `np-speech-agency-analyzer` and its `deploy.sh` are left as they were.
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
