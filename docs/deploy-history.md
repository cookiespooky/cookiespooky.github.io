# Deploy history: the move to antonlozhkin.ru

Moved out of `CLAUDE.md` once the migration was finished. The rules that still apply day to day stayed there;
this is the record of how they were found, kept for the next time a domain, a certificate or a webmaster
console behaves strangely.

## The migration, as verified on 2026-09-05

`http://` 301s to `https://`, the certificate is Let's Encrypt `CN=antonlozhkin.ru` valid to 2026-12-03,
`www` 301s to the apex so the certificate covers both names, all 47 sitemap URLs of the day answered 200, and
Metrika 108674124 reported `counter is initialized` in the browser.

`scripts/build.sh` did not originally copy `CNAME` into `dist/`. The deploy goes through
`upload-pages-artifact`, so without the file in the artifact GitHub Pages dropped the custom domain on every
run.

## Four things that cost a day

**The certificate was released by removing the custom domain in Settings → Pages and adding it back.**
This contradicts the advice that used to stand in `CLAUDE.md`. Waiting did not work: the DNS check sat in
progress across four deployments after the `CNAME` file finally reached the artifact, and the certificate
appeared within minutes of the re-add. The reading that fits is that the check had latched the failure from
when `http://antonlozhkin.ru/CNAME` still 404'd and would not re-run on its own.

Sequencing still matters: re-add only once the `CNAME` file is genuinely in the published artifact and
nothing else claims the domain, or the fresh check latches the same failure again. Note also that the
`CNAME` file *drives* the setting — GitHub re-reads it on every deployment — so removing the domain in the
UI alone is reverted by the next build unless the file goes too.

**"DNS Check in Progress" stays yellow even when everything works.** Enforce HTTPS is enabled and enforcing,
which GitHub does not allow without a valid certificate, so the label is stale UI and not a blocker.

**A project repo owns its path on the custom domain, and disabling Pages does not release it.** The `cases`
repo held the whole `/cases/` prefix: every `/cases/{slug}/` returned that repo's 404 while all 34 case
pages sat in this site's sitemap. Switching its Pages source to None left the path answering GitHub's own
"Site not found", because the binding follows the repo *name*. Deleting the repo released it.

**DNS was never the problem** (verified against Cloudflare and Google, which agree). Apex `A` holds all four
GitHub addresses and only those, apex `AAAA` all four, no apex `CNAME`, no `CAA` blocking Let's Encrypt,
`www` a `CNAME` to `cookiespooky.github.io.`.

## Analytics and Webmaster, the first week

The Metrika loader used to request bare `tag.js`; it now asks for `tag.js?id=<counter>`, matching the snippet
Yandex hands out — that was the one structural difference from the official snippet. Counter `103178789`
belonged to a long-dead Next.js site at this address and has been deleted.

The Yandex Webmaster host record predates this site — its crawl history stops at 2026-01-05 and consists of
`/_next/image?url=…`, so Webmaster had never seen the current site. Its diagnostics warned that `robots.txt`
was missing and 404s were misconfigured; both were artefacts of the day HTTPS was broken, because the robot
could not complete a TLS handshake at all. Neither file was ever wrong.

Metrika's install checker follows the address stored in the counter's own settings, not the one typed into
the dialog, and that field lagged on `cookiespooky.github.io` — which 301s here anyway, so the check passes
regardless. Two console errors show up during that check and neither is this site's: an unrecognised
`prefetch-src` CSP directive from Metrika's own overlay script on `yastatic.net`, and
`ERR_CERT_AUTHORITY_INVALID` on `hdrc.yandex.net`, whose issuing CA is absent from ordinary trust stores —
reproducible with `curl` from an unrelated machine. This site sets no CSP at all and references neither
domain.
