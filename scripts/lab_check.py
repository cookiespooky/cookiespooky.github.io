#!/usr/bin/env python3
"""Закон витрины для /lab/ — то, чего не может проверить сборка.

Обязательность полей в движке глобальная: required на четыре строки сломал
бы все кейсы и статьи. Поэтому проверка здесь, по образцу clusters_check.py:
без зависимостей, запускается руками, выходит с кодом 1.

Что ловит:
- у идеи пуста одна из четырёх строк или «чего это не доказывает»;
- у идеи стоит cluster или cta_service: идеи вне реестра и без оффера, как заметки;
- related называет слаг, которого нет в content/ (движок это молча пропускает);
- room назван, а партиала room-<имя>.html или ветки для него в idea.html нет.

YAML разбирается вручную, как в llms.py.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
TEMPLATES = ROOT / "theme" / "templates"

SCALAR = re.compile(r'^([a-z_]+):\s*(.*)$')
LAW = ("elements", "rule", "form", "control", "not_proven")
FORBIDDEN = ("cluster", "cta_service")


def scalar(raw):
    raw = raw.strip()
    if raw.startswith('"') and raw.endswith('"') or raw.startswith("'") and raw.endswith("'"):
        raw = raw[1:-1]
    else:
        raw = re.sub(r'\s+#.*$', "", raw)
    return None if raw in ("", "null", "~") else raw


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
        if m:
            out[m.group(1)] = scalar(m.group(2))
    return out


def slug_list(raw):
    if not raw or not raw.startswith("["):
        return []
    return [s.strip().strip('"').strip("'") for s in raw.strip("[]").split(",") if s.strip()]


def main():
    pages = {p: frontmatter(p) for p in CONTENT.rglob("*.md")}
    slugs = {fm.get("slug") for fm in pages.values() if fm.get("slug")}
    ideas = {p: fm for p, fm in pages.items() if fm.get("type") == "idea"}
    labs = [p for p, fm in pages.items() if fm.get("type") == "lab"]
    idea_tpl = (TEMPLATES / "idea.html").read_text(encoding="utf-8")

    errors = []
    if len(labs) != 1:
        errors.append(f"страниц типа lab {len(labs)}, а должна быть одна")

    for path, fm in sorted(ideas.items()):
        name = path.relative_to(ROOT)
        for key in LAW:
            if not fm.get(key):
                errors.append(f"{name}: пусто {key}")
        for key in FORBIDDEN:
            if fm.get(key):
                errors.append(f"{name}: у идеи не бывает {key} — она вне реестра и без оффера")
        for target in slug_list(fm.get("related")):
            if target not in slugs:
                errors.append(f"{name}: related «{target}» — такого слага в content/ нет")
        room = fm.get("room")
        if room:
            if not (TEMPLATES / "partials" / f"room-{room}.html").exists():
                errors.append(f"{name}: room «{room}», а partials/room-{room}.html нет")
            if f'"room-{room}.html"' not in idea_tpl:
                errors.append(f"{name}: room «{room}» без ветки в idea.html — комната не нарисуется")

    for e in errors:
        print(e)

    live = sum(1 for fm in ideas.values() if fm.get("draft") != "true")
    rooms = sum(1 for fm in ideas.values() if fm.get("room"))
    print(f"идей {len(ideas)}, опубликовано {live}, с комнатой {rooms}")
    if ideas and not rooms:
        print("ни одной комнаты: лабораторию, где нечего потрогать, не открывать (plan.md, шаг 2)")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
