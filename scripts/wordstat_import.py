#!/usr/bin/env python3
"""Переносит снятые частоты в seo/clusters.yaml.

Два источника, оба необязательные:

  seo/keys/*.csv          выгрузки «Топ частотных запросов» из веб-Вордстата:
                          разделитель «;», BOM, перевод строки «\\r», целевая
                          фраза в заголовке в «кавычках-ёлочках»
  seo/wordstat-queue.tsv  рабочий лист: числа для фраз, по которым выгружать
                          было нечего. Число берётся из любого столбца после
                          «фраза» — на практике оно попадает то в «точную», то
                          в «заметку», и разделять эти случаи смысла нет

В реестр пишутся три поля:

  count       точная частота с операторами. Веб-выгрузка её не содержит,
              поэтому остаётся null, пока её не снимут отдельно
  count_wide  широкая частота, измеренная
  count_est   оценка точной: широкая минус сумма перечисленных в хвосте
              запросов, которые содержат все слова фразы. Оценка сверху и
              только там, где хвост меньше широкой: у общих фраз вложенные
              запросы сами агрегированы, и вычитание даёт бессмыслицу

  python3 scripts/wordstat_import.py                       # записать
  python3 scripts/wordstat_import.py --dry-run             # только отчёт
  python3 scripts/wordstat_import.py --harvest 40          # плюс находки
"""
import glob
import re
import sys
from pathlib import Path

def fold(text):
    """Вордстат не различает ё и е, поэтому сравниваем свёрнутым видом."""
    return text.lower().replace("ё", "е").strip()


ROOT = Path(__file__).resolve().parent.parent
REGISTRY = ROOT / "seo" / "clusters.yaml"
KEYS = ROOT / "seo" / "keys"
QUEUE = ROOT / "seo" / "wordstat-queue.tsv"


def read_exports():
    """{фраза: (широкая, оценка_точной)} и общий список всех встреченных запросов."""
    measured, seen = {}, {}
    for path in sorted(KEYS.glob("*.csv")):
        text = path.read_bytes().decode("utf-8-sig")
        lines = [l for l in re.split(r"\r\n|\r|\n", text) if l.strip()]
        if not lines:
            continue
        head = re.search(r"«([^»]+)»", lines[0])
        target = fold(head.group(1)) if head else None
        rows = []
        for line in lines[1:]:
            cells = line.split(";")
            if len(cells) >= 2 and cells[1].strip().isdigit():
                rows.append((fold(cells[0]), int(cells[1])))
        for query, count in rows:
            seen[query] = max(seen.get(query, 0), count)
        if not target:
            continue
        broad = next((c for q, c in rows if q == target), None)
        if broad is None:
            continue
        words = set(target.split())
        tail = sum(c for q, c in rows if q != target and words <= set(q.split()))
        est = broad - tail if 0 < tail < broad else (broad if tail == 0 else None)
        measured[target] = (broad, est)
    return measured, seen


def read_queue():
    """Числа, проставленные руками: любой числовой столбец после фразы."""
    if not QUEUE.exists():
        return {}
    out = {}
    for line in QUEUE.read_text(encoding="utf-8").splitlines()[1:]:
        cells = line.split("\t")
        if len(cells) < 4:
            continue
        phrase = fold(cells[2])
        number = next((c for c in cells[3:] if c.strip().isdigit()), None)
        if phrase and number is not None:
            out[phrase] = int(number)
    return out


def main():
    dry = "--dry-run" in sys.argv
    harvest = 0
    if "--harvest" in sys.argv:
        i = sys.argv.index("--harvest")
        harvest = int(sys.argv[i + 1]) if len(sys.argv) > i + 1 else 30

    measured, seen = read_exports()
    marks = read_queue()
    text = REGISTRY.read_text(encoding="utf-8")
    registry = {fold(p): p for p in re.findall(r'\{ phrase: "([^"]+)"', text)}

    written, no_data = 0, []

    def replace(match):
        nonlocal written
        phrase = match.group(1)
        key = fold(phrase)
        broad = est = None
        if key in measured:
            broad, est = measured[key]
        elif key in seen:
            # фраза встретилась строкой в чьей-то выгрузке: число строки —
            # это и есть её широкая частота
            broad = seen[key]
        elif key in marks:
            broad = marks[key]
        if broad is None:
            no_data.append(phrase)
            return match.group(0)
        written += 1
        parts = [f'{{ phrase: "{phrase}"', "count: null", f"count_wide: {broad}"]
        if est is not None and est != broad:
            parts.append(f"count_est: {est}")
        return ", ".join(parts) + " }"

    text = re.sub(r'\{ phrase: "([^"]+)"[^}]*\}', replace, text)

    def totals(block):
        wide = [int(c) for c in re.findall(r"count_wide: (\d+)", block)]
        if not wide:
            return block
        return re.sub(r"^(\s+)total_count: [^\n]*$", rf"\g<1>total_count: {sum(wide)}",
                      block, flags=re.M)

    parts = text.split("\n  - id: ")
    text = parts[0] + "".join("\n  - id: " + totals(p) for p in parts[1:])

    print(f"выгрузок: {len(list(KEYS.glob('*.csv')))} | уникальных запросов в них: {len(seen)}")
    print(f"фраз реестра: {len(registry)} | с числами: {written} | без данных: {len(no_data)}")
    if no_data:
        print("\nбез данных — в выгрузке нет такой фразы. Рядом стоят реальные запросы:")
        for p in no_data:
            words = set(fold(p).split())
            near = sorted(((c, q) for q, c in seen.items() if len(words & set(q.split())) >= max(2, len(words) - 1)),
                          reverse=True)[:2]
            hint = "; ".join(f"«{q}» {c}" for c, q in near) or "ничего похожего"
            print(f"  {p}\n      -> {hint}")

    if harvest:
        known = set(registry)
        finds = sorted(((c, q) for q, c in seen.items() if q not in known), reverse=True)
        print(f"\nнайдено в хвостах, нет в реестре — верх списка ({harvest}):")
        for count, query in finds[:harvest]:
            print(f"  {count:>7}  {query}")

    if dry:
        print("\n--dry-run: реестр не тронут")
        return 0
    REGISTRY.write_text(text, encoding="utf-8")
    print(f"\n{REGISTRY.name} обновлён")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
