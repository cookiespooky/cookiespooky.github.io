#!/usr/bin/env python3
"""Метка версии у стилей и скриптов: assets/app.js → assets/app.js?v=<8 знаков md5 файла>.

Сервер отдаёт assets/ с max-age неделю (nginx на 194.58.100.5), а адрес файла при правке не меняется —
браузер посетителя неделю держит старый скрипт или стили. С меткой новый файл — новый адрес.
Проходит по всем .html в dist/ после сборки; файлы, которых нет в dist/assets/, не трогает.
"""
import hashlib
import re
from pathlib import Path

DIST = Path(__file__).resolve().parent.parent / "dist"
ASSETS = DIST / "assets"
REF = re.compile(r'(/assets/([\w.-]+\.(?:css|js)))(?=["\'])')
cache = {}


def version(name):
    if name not in cache:
        f = ASSETS / name
        cache[name] = hashlib.md5(f.read_bytes()).hexdigest()[:8] if f.is_file() else None
    return cache[name]


def stamp(m):
    v = version(m.group(2))
    return f"{m.group(1)}?v={v}" if v else m.group(1)


n = 0
for page in DIST.rglob("*.html"):
    text = page.read_text(encoding="utf-8")
    new = REF.sub(stamp, text)
    if new != text:
        page.write_text(new, encoding="utf-8")
        n += 1
print(f"метки версий: страниц {n}, файлов {sum(1 for v in cache.values() if v)}")
