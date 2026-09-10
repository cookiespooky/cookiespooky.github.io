#!/usr/bin/env python3
"""Поисковый индекс для ассистента — dist/assistant-index.json.

Разрезает собранный сайт на секции по заголовкам второго уровня. Секция —
это одна законченная мысль с собственным адресом, то есть ровно та единица,
которую ассистент может и процитировать, и дать на неё ссылку.

Строится из dist/, а не из content/, по одной причине: якоря заголовков
движок транслитерирует сам («Три вида памяти» -> tri-vida-pamiati), и
повторять этот алгоритм здесь означало бы однажды с ним разойтись и начать
выдавать ссылки на несуществующие якоря. В собранном HTML id уже проставлен.

Стандартная библиотека и никаких зависимостей — по той же причине, что и
llms.py: сборке в CI не нужен лишний пакет.
"""
import html
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
OUT = DIST / "assistant-index.json"

# Куски страницы, которые в текст секции не входят: подписи под скриншотами,
# служебные метки и разметка для машин.
DROP_TAGS = re.compile(r"<(script|style|figcaption)\b.*?</\1>", re.S | re.I)
TAG = re.compile(r"<[^>]+>")
SPACE = re.compile(r"[ \t ]+")
BLANK = re.compile(r"\n{3,}")


def text_of(fragment):
    """HTML -> плоский текст с сохранением границ абзацев."""
    fragment = DROP_TAGS.sub(" ", fragment)
    fragment = re.sub(r"</(p|li|h[1-6]|blockquote|tr)>", "\n\n", fragment, flags=re.I)
    fragment = re.sub(r"<br\s*/?>", "\n", fragment, flags=re.I)
    fragment = re.sub(r"<li\b[^>]*>", "— ", fragment, flags=re.I)
    fragment = TAG.sub("", fragment)
    fragment = html.unescape(fragment)
    fragment = SPACE.sub(" ", fragment)
    fragment = "\n".join(line.strip() for line in fragment.splitlines())
    return BLANK.sub("\n\n", fragment).strip()


def block(page, start_pattern, tag="div"):
    """Содержимое контейнера с учётом вложенности одноимённых тегов."""
    m = re.search(start_pattern, page)
    if not m:
        return None
    open_tag = re.compile(rf"<{tag}\b", re.I)
    close_tag = re.compile(rf"</{tag}>", re.I)
    depth, pos = 1, m.end()
    while depth and pos < len(page):
        nxt_open = open_tag.search(page, pos)
        nxt_close = close_tag.search(page, pos)
        if not nxt_close:
            return None
        if nxt_open and nxt_open.start() < nxt_close.start():
            depth += 1
            pos = nxt_open.end()
        else:
            depth -= 1
            pos = nxt_close.end()
    return page[m.end():pos - len(f"</{tag}>")]


def page_type(url):
    for prefix, kind in (
        ("/cases/", "case"), ("/blog/", "article"), ("/services/", "service"),
        ("/notes/", "note"), ("/tools/", "tool"),
    ):
        if prefix in url:
            return kind
    return "page"


def sections_of(page, url, title, kind):
    """Лид до первого H2 плюс по секции на каждый H2 с якорем."""
    out = []
    prose = block(page, r'<div class="prose"[^>]*>')
    if prose:
        parts = re.split(r'<h2 id="([^"]+)"[^>]*>(.*?)</h2>', prose, flags=re.S)
        lead = text_of(parts[0])
        if len(lead) > 120:
            out.append({"url": url, "heading": None, "text": lead})
        for i in range(1, len(parts), 3):
            anchor, head, body = parts[i], text_of(parts[i + 1]), text_of(parts[i + 2])
            if len(body) < 60:
                continue
            out.append({"url": f"{url}#{anchor}", "heading": head, "text": body})

    # Вопросы на странице услуги живут вне prose, а это лучший материал для
    # ассистента: там разобраны ровно те возражения, с которыми к нему придут.
    faq = block(page, r'<section class="service-faq"[^>]*>', tag="section")
    if faq:
        pairs = re.findall(r'<div class="stack__title">(.*?)</div>(.*?)(?=<div class="stack__title">|$)', faq, re.S)
        for q, a in pairs:
            answer = text_of(a)
            if len(answer) > 40:
                out.append({"url": url, "heading": text_of(q), "text": answer, "faq": True})

    for s in out:
        s["page_title"] = title
        s["type"] = kind
    return out


def main():
    if not DIST.is_dir():
        print("assistant-index: dist/ не собран", file=sys.stderr)
        return 1

    sections = []
    for path in sorted(DIST.rglob("index.html")):
        page = path.read_text(encoding="utf-8", errors="replace")

        # Страницы-редиректы, noindex и синтетические страницы пагинации
        # знанием не являются: они либо дублируют другой адрес, либо пусты.
        if 'http-equiv="refresh"' in page or 'content="noindex' in page:
            continue
        rel = path.relative_to(DIST).as_posix()
        if re.search(r"(^|/)page/\d+/index\.html$", rel):
            continue

        canonical = re.search(r'<link rel="canonical" href="([^"]+)"', page)
        if not canonical:
            continue
        url = canonical.group(1)
        title = re.search(r"<title>(.*?)</title>", page, re.S)
        title = html.unescape(title.group(1)).strip() if title else url
        sections.extend(sections_of(page, url, title, page_type(url)))

    payload = {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "count": len(sections),
        "sections": sections,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    chars = sum(len(s["text"]) for s in sections)
    print(f"assistant-index.json: секций {len(sections)}, знаков {chars}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
