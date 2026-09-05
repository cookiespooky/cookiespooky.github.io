#!/usr/bin/env python3
"""Рабочий лист для съёма частот: seo/wordstat-queue.tsv из seo/clusters.yaml.

Все фразы реестра с двумя пустыми столбцами под числа. Порядок съёма и смысл
столбцов — в seo/wordstat.md.

Скрипт перезаписывает файл целиком, поэтому запускать его поверх заполненного
листа нельзя — числа пропадут. Сначала перенесите их в clusters.yaml, потом
пересобирайте. При добавлении кластеров без пересборки новые фразы в лист не
попадут и тихо останутся неизмеренными.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "seo" / "clusters.yaml"
DST = ROOT / "seo" / "wordstat-queue.tsv"


def main():
    if DST.exists():
        filled = [
            line for line in DST.read_text(encoding="utf-8").splitlines()[1:]
            if len(line.split("\t")) > 4 and line.split("\t")[4].strip()
        ]
        if filled:
            print(f"в {DST.name} уже заполнено строк: {len(filled)} — перезапись отменена.\n"
                  f"перенесите числа в clusters.yaml или удалите файл вручную", file=sys.stderr)
            return 1

    text = SRC.read_text(encoding="utf-8")
    blocks = re.split(r"\n  - id: ", text)
    rows = []
    for block in blocks[1:]:
        cluster = block.split("\n")[0].strip()
        stage = re.search(r"^\s+stage: (\w+)", block, re.M)
        stage = stage.group(1) if stage else "?"
        for phrase in re.findall(r'\{ phrase: "([^"]+)"', block):
            rows.append((cluster, stage, phrase))

    lines = ["# кластер\tстадия\tфраза\tширокая\tточная\tзаметка"]
    lines += [f"{c}\t{s}\t{p}\t\t\t" for c, s, p in rows]
    DST.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"{DST.name}: {len(rows)} фраз из {len(blocks) - 1} кластеров")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
