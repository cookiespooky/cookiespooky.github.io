#!/usr/bin/env python3
"""Пинг IndexNow: сообщает Bing и Яндексу об изменившихся страницах.

Обход по расписанию занимает недели; IndexNow сокращает это до часов.
Протокол общий: одна отправка доходит до обоих поисковиков.

Запускается после деплоя и читает карту сайта уже с живого адреса — так
отправляются только те адреса, которые действительно опубликованы.
Отбираются страницы с сегодняшним lastmod: слать все пятьдесят при каждой
сборке бессмысленно, протокол просит присылать изменившееся.

  python3 scripts/indexnow.py            # изменённое сегодня
  python3 scripts/indexnow.py --all      # всё, для первой отправки
  python3 scripts/indexnow.py --dry-run  # показать и не отправлять
"""
import datetime
import json
import re
import sys
import urllib.request

HOST = "antonlozhkin.ru"
KEY = "ed8e07f3d48a4975c208f518b6d94488"
SITEMAP = f"https://{HOST}/sitemap-0001.xml"
ENDPOINT = "https://api.indexnow.org/indexnow"


def fetch(src):
    """Карта сайта: по адресу или из локального файла — вторым удобно
    проверять отбор адресов, не выходя в сеть."""
    if not src.startswith("http"):
        with open(src, encoding="utf-8") as f:
            return f.read()
    with urllib.request.urlopen(src, timeout=30) as r:
        return r.read().decode("utf-8")


def main():
    everything = "--all" in sys.argv
    dry = "--dry-run" in sys.argv
    source = SITEMAP
    for arg in sys.argv[1:]:
        if arg.startswith("--sitemap="):
            source = arg.split("=", 1)[1]

    xml = fetch(source)
    entries = re.findall(r"<loc>([^<]+)</loc>\s*(?:<lastmod>([^<]*)</lastmod>)?", xml)
    today = datetime.date.today().isoformat()
    urls = [loc for loc, mod in entries if everything or mod == today]

    if not urls:
        print("менять нечего: сегодняшних изменений в карте сайта нет")
        return 0

    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": f"https://{HOST}/{KEY}.txt",
        "urlList": urls,
    }
    print(f"адресов к отправке: {len(urls)}")
    for u in urls[:10]:
        print(" ", u)
    if len(urls) > 10:
        print(f"  … и ещё {len(urls) - 10}")
    if dry:
        return 0

    req = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json; charset=utf-8"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print("IndexNow ответил", r.status)
    except urllib.error.HTTPError as e:
        # 422 — адрес не совпал с ключом, 403 — ключ не найден: это ошибки
        # настройки, а не сборки, поэтому деплой из-за них падать не должен
        print(f"IndexNow отказал: {e.code} {e.read().decode('utf-8', 'replace')[:200]}", file=sys.stderr)
        return 0
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
