#!/usr/bin/env python3
"""Сверка реестра кластеров с content/ — то, чего не проверяет сборка.

Движок не читает seo/, поэтому статья с несуществующим cluster, два адреса
под одним кластером, target_url в пустоту или разные cta_service на двух
сторонах собираются чисто. Скрипт ловит всё это и выходит с кодом 1.

В конце печатает перепись: сколько кластеров на какой стадии и сколько
кейсов в какой группе — цифры, которые иначе приходится держать в CLAUDE.md.

YAML разбирается вручную, как в llms.py: нужны несколько скалярных полей.
"""
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
REGISTRY = ROOT / "seo" / "clusters.yaml"

SCALAR = re.compile(r'^([a-z_]+):\s*(.*)$')
CLUSTER_START = re.compile(r'^  - id:\s*(\S+)')
CLUSTER_FIELD = re.compile(r'^    ([a-z_]+):\s*(.*)$')

PERMALINK = {
    "home": "/", "blog": "/blog/", "notes": "/notes/", "notfound": "/404/",
    "case": "/cases/{}/", "service": "/services/{}/", "article": "/blog/{}/",
    "tool": "/tools/{}/", "note": "/notes/{}/", "page": "/{}/",
}


def scalar(raw):
    raw = re.sub(r'\s+#.*$', "", raw.strip())
    raw = raw.strip('"').strip("'")
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
        if m and not m.group(2).strip().startswith(("[", "{", "|", ">")):
            out[m.group(1)] = scalar(m.group(2))
    return out


def registry():
    clusters, current = {}, None
    for line in REGISTRY.read_text(encoding="utf-8").splitlines():
        m = CLUSTER_START.match(line)
        if m:
            current = clusters.setdefault(scalar(m.group(1)), {})
            continue
        m = CLUSTER_FIELD.match(line)
        if current is not None and m:
            current[m.group(1)] = scalar(m.group(2))
    return clusters


def main():
    pages = [(p, frontmatter(p)) for p in sorted(CONTENT.rglob("*.md"))]
    routes, services, groups = set(), set(), Counter()
    articles = []
    for path, fm in pages:
        kind, slug = fm.get("type"), fm.get("slug")
        if kind not in PERMALINK or fm.get("redirect_to"):
            continue
        routes.add(PERMALINK[kind].format(slug))
        if kind == "service":
            services.add(slug)
        if kind == "case" and fm.get("draft") != "true":
            groups[fm.get("group")] += 1
        if kind == "article":
            articles.append((path.relative_to(ROOT), fm))

    clusters = registry()
    errors = []
    claims = defaultdict(list)

    for path, fm in articles:
        url = PERMALINK["article"].format(fm.get("slug"))
        cid, cta = fm.get("cluster"), fm.get("cta_service")
        if not cid:
            errors.append(f"{path}: нет cluster")
            continue
        claims[cid].append(url)
        if cid not in clusters:
            errors.append(f"{path}: cluster {cid} нет в реестре")
            continue
        c = clusters[cid]
        if c.get("target_url") != url:
            errors.append(f"{path}: у {cid} target_url {c.get('target_url')}, а статья живёт на {url}")
        if not cta:
            errors.append(f"{path}: нет cta_service")
        elif cta not in services:
            errors.append(f"{path}: cta_service {cta} — такой услуги нет")
        if cta != c.get("cta_service"):
            errors.append(f"{path}: cta_service {cta}, а в реестре у {cid} — {c.get('cta_service')}")

    for cid, urls in claims.items():
        if len(urls) > 1:
            errors.append(f"кластер {cid} занят несколькими адресами: {', '.join(urls)}")

    for cid, c in clusters.items():
        target = c.get("target_url")
        if target and target not in routes:
            errors.append(f"реестр: {cid} указывает target_url {target}, такой страницы нет")
        cta = c.get("cta_service")
        if cta and cta not in services:
            errors.append(f"реестр: {cid} указывает cta_service {cta}, такой услуги нет")

    for e in errors:
        print(e, file=sys.stderr)

    stages = Counter(c.get("stage") for c in clusters.values())
    print(f"кластеров {len(clusters)}, статей {len(articles)}: "
          + ", ".join(f"{k} {v}" for k, v in stages.most_common()))
    print("кейсы по группам: " + ", ".join(f"{k} {v}" for k, v in groups.most_common()))
    if errors:
        print(f"ошибок: {len(errors)}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
