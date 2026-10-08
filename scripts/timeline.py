#!/usr/bin/env python3
"""Собирает content/timeline.md — страницу /timeline/ — из data/timeline.json.

    python3 scripts/timeline.py            # переписать content/timeline.md
    python3 scripts/timeline.py --check    # сказать, расходится ли страница с данными, ничего не писать

data/timeline.json — выгрузка ленты изменений из хранилища (`lifeos timeline export ../site/data`, запускается в
life/): список публичных проектов, события по одной строке и текущее предложение. Это единственное, что страница
берёт из хранилища; каждая строка проверена при записи там. Страница и данные лежат в git оба: CI собирает сайт без
хранилища. Одни и те же данные — одни и те же байты. Только stdlib.
"""
import html, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.environ.get('TIMELINE_DATA') or os.path.join(ROOT, 'data', 'timeline.json')      # другие пути — только для пробы
OUT = os.environ.get('TIMELINE_OUT') or os.path.join(ROOT, 'content', 'timeline.md')
MONTHS = 'января февраля марта апреля мая июня июля августа сентября октября ноября декабря'.split()

# Шапка страницы — всегда экран текущего предложения (Антон, 8.10); пока предложения нет — о самой ленте.
PLAIN = {'hero_kicker': 'Лента', 'hero_title': 'Что нового',
         'hero_lead': 'Изменения в открытых проектах — по одной строке на каждое заметное со стороны: новое, улучшенное, исправленное, не получившееся и отложенное.'}
LEAD = 'Изменения в открытых проектах — по одной строке на каждое заметное со стороны, от нового к старому.'


def head(offer):
    q = lambda v: json.dumps(v, ensure_ascii=False)
    fm = dict(PLAIN)
    if offer:
        button = offer['action'][0].upper() + offer['action'][1:]
        fm = {'hero_kicker': 'Сейчас', 'hero_title': offer['title'], 'hero_lead': offer['text'], 'hero_cta_label': button, 'hero_cta_url': offer['link'],
              'cta_title': offer['title'], 'cta_note': offer['text'], 'cta_button': button, 'cta_url': offer['link']}
    rows = ['---', 'type: page', 'slug: timeline', 'title: "Лента изменений"',
            'description: "Что нового в открытых проектах Антона Ложкина: по одной строке на каждое заметное изменение, от нового к старому."', 'draft: false', '']
    return '\n'.join(rows + [f'{k}: {q(v)}' for k, v in fm.items()] + ['---', ''])


def plural(n, one, few, many):
    n10, n100 = n % 10, n % 100
    return f'{n} ' + (one if n10 == 1 and n100 != 11 else few if 2 <= n10 <= 4 and not 12 <= n100 <= 14 else many)


def date_ru(d):
    y, m, day = d.split('-')
    return f'{int(day)} {MONTHS[int(m) - 1]} {y}'


def build():
    """Под датой — карточка на проект, в ней события этого дня точками на одной линии. Каждая карточка — подряд
    идущие строки разметки без пустых: так движок принимает её одним куском; вид — классы tl-* в base.css."""
    data = json.load(open(DATA, encoding='utf-8'))
    projects = {p['id']: p for p in data['projects']}
    esc = lambda s: html.escape(str(s), quote=True)
    offer, events = data.get('offer'), data['events']
    out = [head(offer)]
    if offer:
        out += ['## Что нового', '', LEAD, '']
    if events:
        n = len({e['project'] for e in events})
        out += [f'*{plural(len(events), "изменение", "изменения", "изменений")} в {plural(n, "проекте", "проектах", "проектах")}: '
                f'с {date_ru(events[-1]["date"])} по {date_ru(events[0]["date"])}.*', '']
    days, short = {}, data.get('summaries') or {}
    for e in data['events']:                     # порядок выгрузки: дата, затем проект — он и сохраняется
        days.setdefault(e['date'], {}).setdefault(e['project'], []).append(e)
    for day, by_project in days.items():
        out += ['', f'## {date_ru(day)}', '']
        if day in short:                         # «коротко»: что изменилось за этот день, одной-двумя фразами
            out += [f'<p class="tl-short"><span class="tl-short__label">Коротко</span>{esc(short[day])}</p>', '']
        for pid, events in by_project.items():
            p = projects[pid]
            name = f'<a href="{esc(p["url"])}">{esc(p["title"])}</a>' if p['url'] else esc(p['title'])
            card = ['<div class="tl-card">', f'<div class="tl-card__head">{name}</div>', '<ul class="tl-list">']
            for e in events:
                part = f'<span class="tl-part">{esc(e["part"])}</span>' if e['part'] else ''
                kind = f'<span class="tl-kind">{esc(e["kind"])}</span>' if e['kind'] not in ('', 'новое') else ''
                more = f' <a class="tl-more" href="{esc(e["link"])}">Открыть →</a>' if e['link'] and e['link'] != p['url'] else ''
                card.append(f'<li>{part}{kind}<span class="tl-text">{esc(e["text"])}{more}</span></li>')
            out += ['\n'.join(card + ['</ul>', '</div>']), '']
    out += ['', '## Проекты', '']
    out += [f'- [{p["title"]}]({p["url"]}) — {p["summary"]}' if p['url'] else f'- {p["title"]} — {p["summary"]}' for p in data['projects']]
    return '\n'.join(out) + '\n'


text = build()
if '--check' in sys.argv:
    same = os.path.exists(OUT) and open(OUT, encoding='utf-8').read() == text
    print('страница совпадает с данными' if same else 'content/timeline.md расходится с data/timeline.json — python3 scripts/timeline.py')
    sys.exit(0 if same else 1)
open(OUT, 'w', encoding='utf-8').write(text)
print(f'content/timeline.md: событий {text.count("<li>")}, карточек {text.count(chr(34) + "tl-card" + chr(34))}')
