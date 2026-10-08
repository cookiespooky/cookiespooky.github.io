#!/usr/bin/env python3
"""Собирает content/timeline.md — страницу /timeline/ — из data/timeline.json.

    python3 scripts/timeline.py            # переписать content/timeline.md
    python3 scripts/timeline.py --check    # сказать, расходится ли страница с данными, ничего не писать

data/timeline.json — выгрузка ленты изменений из хранилища (`lifeos timeline export ../site/data`, запускается в
life/): список публичных проектов, события по одной строке и текущее предложение. Это единственное, что страница
берёт из хранилища; каждая строка проверена при записи там. Страница и данные лежат в git оба: CI собирает сайт без
хранилища. Одни и те же данные — одни и те же байты. Только stdlib.
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA, OUT = os.path.join(ROOT, 'data', 'timeline.json'), os.path.join(ROOT, 'content', 'timeline.md')
MONTHS = 'января февраля марта апреля мая июня июля августа сентября октября ноября декабря'.split()

HEAD = '''---
type: page
slug: timeline
title: "Лента изменений"
description: "Что нового в открытых проектах Антона Ложкина: по одной строке на каждое заметное изменение, от нового к старому."
draft: false

hero_kicker: "Лента"
hero_title: "Что нового"
hero_lead: "Изменения в открытых проектах — по одной строке на каждое, от нового к старому. Строка появляется, когда меняется то, что заметно со стороны: новое, улучшенное, исправленное, не получившееся и отложенное."
---
'''


def date_ru(d):
    y, m, day = d.split('-')
    return f'{int(day)} {MONTHS[int(m) - 1]} {y}'


def build():
    data = json.load(open(DATA, encoding='utf-8'))
    projects = {p['id']: p for p in data['projects']}
    out = [HEAD]
    offer = data.get('offer')
    if offer:
        out += ['## Сейчас', '', f'**{offer["title"]}.** {offer["text"]}', '', f'[{offer["action"][0].upper() + offer["action"][1:]} →]({offer["link"]})', '']
    day = None
    for e in data['events']:
        if e['date'] != day:
            day = e['date']
            out += ['', f'## {date_ru(day)}', '']
        p = projects[e['project']]
        name = f'[{p["title"]}]({p["url"]})' if p['url'] else p['title']
        kind = f' · *{e["kind"]}*' if e['kind'] not in ('', 'новое') else ''
        part = f' · {e["part"]}' if e['part'] else ''
        more = f' [Открыть →]({e["link"]})' if e['link'] and e['link'] != p['url'] else ''
        out.append(f'- **{name}**{part}{kind} — {e["text"]}{more}')
    out += ['', '## Проекты', '']
    out += [f'- [{p["title"]}]({p["url"]}) — {p["summary"]}' if p['url'] else f'- {p["title"]} — {p["summary"]}' for p in data['projects']]
    return '\n'.join(out) + '\n'


text = build()
if '--check' in sys.argv:
    same = os.path.exists(OUT) and open(OUT, encoding='utf-8').read() == text
    print('страница совпадает с данными' if same else 'content/timeline.md расходится с data/timeline.json — python3 scripts/timeline.py')
    sys.exit(0 if same else 1)
open(OUT, 'w', encoding='utf-8').write(text)
print(f'content/timeline.md: событий {text.count(chr(10) + "- **")}')
