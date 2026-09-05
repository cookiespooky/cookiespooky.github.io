#!/usr/bin/env python3
"""Карта сайта для языковых моделей — dist/llms.txt.

Формат llmstxt.org: markdown, который модель читает целиком вместо того,
чтобы обходить пятьдесят страниц и вытаскивать смысл из вёрстки.

Собирается из frontmatter в content/, поэтому не расходится с сайтом.
Frontmatter разбирается вручную, без PyYAML: нужны пять скалярных полей,
а лишняя зависимость в сборке CI того не стоит.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
BASE = "https://antonlozhkin.ru"

SCALAR = re.compile(r'^([a-z_]+):\s*(.*)$')


def frontmatter(path):
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    out = {}
    for line in text[3:end].splitlines():
        m = SCALAR.match(line)
        if not m:
            continue
        key, raw = m.group(1), m.group(2).strip()
        if raw and not raw.startswith(("[", "{", "|", ">")):
            out[key] = raw.strip('"').strip("'")
    return out


def collect(pattern, kind):
    items = []
    for path in sorted((CONTENT).glob(pattern)):
        fm = frontmatter(path)
        if fm.get("draft") == "true" or fm.get("type") != kind:
            continue
        if fm.get("noindex") == "true":
            continue
        if fm.get("slug") and fm.get("title"):
            items.append(fm)
    return items


def line(fm, url):
    desc = fm.get("summary") or fm.get("description") or ""
    return f"- [{fm['title']}]({url}): {desc}"


def main():
    dist = ROOT / "dist"
    if not dist.is_dir():
        print("нет dist/ — сначала сборка", file=sys.stderr)
        return 1

    home = frontmatter(CONTENT / "home.md")
    out = [
        "# Антон Ложкин — лингвист и разработчик",
        "",
        "> Сайты, телеграм-боты, парсеры, автоматизация и MVP. Портфолио с разбором задач "
        "и результатов, блог о разработке и коммерческие страницы услуг.",
        "",
        "Сайт статический, весь текст доступен в HTML без выполнения JavaScript. "
        "Язык — русский. Автор и исполнитель всех работ — Антон Ложкин, "
        "связь через Telegram @cookiespooky.",
        "",
        "## Услуги",
        "",
    ]
    for fm in sorted(collect("services/*.md", "service"), key=lambda f: f.get("nav_order", "99")):
        out.append(line(fm, f"{BASE}/services/{fm['slug']}/"))

    out += ["", "## Кейсы", ""]
    cases = collect("cases/*.md", "case")
    for fm in sorted(cases, key=lambda f: int(f.get("nav_order") or 999)):
        out.append(line(fm, f"{BASE}/cases/{fm['slug']}/"))

    out += ["", "## Статьи", ""]
    posts = collect("blog/*.md", "article")
    for fm in sorted(posts, key=lambda f: f.get("published_at", ""), reverse=True):
        out.append(line(fm, f"{BASE}/blog/{fm['slug']}/"))

    out += ["", "## Инструменты", ""]
    for fm in collect("tools/*.md", "tool"):
        out.append(line(fm, f"{BASE}/tools/{fm['slug']}/"))

    out += [
        "",
        "## Прочее",
        "",
        f"- [Обо мне]({BASE}/about/): образование, подход к работе и способ связи",
        f"- [Что делаю]({BASE}/services/): форматы работы списком",
        f"- [Блог]({BASE}/blog/): все статьи",
        f"- [Карта сайта]({BASE}/sitemap-index.xml): полный перечень адресов",
        "",
    ]

    (dist / "llms.txt").write_text("\n".join(out), encoding="utf-8")
    print(f"llms.txt: услуг {len(collect('services/*.md', 'service'))}, "
          f"кейсов {len(cases)}, статей {len(posts)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
