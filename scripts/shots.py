#!/usr/bin/env python3
"""Производные картинки кейсов: миниатюры каталога и карточки для соцсетей.

Источник — theme/assets/shots/*.webp, то, что показывается на самой
странице кейса. Отсюда делаются:

  thumbs/<имя>.webp  360x250  — строка каталога (показывается как 180x125)
  og/<имя>.jpg      1200x630  — og:image; jpeg, потому что его читают все
                                скребки без исключений, в отличие от webp

Скрипт идемпотентен: перегенерирует только то, что устарело или пропало.
Запускать после добавления нового скриншота, затем ./scripts/build.sh.
"""
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SHOTS = ROOT / "theme" / "assets" / "shots"
THUMBS = SHOTS / "thumbs"
OG = SHOTS / "og"

THUMB_SIZE = (360, 250)
OG_SIZE = (1200, 630)
OG_BG = (251, 251, 250)  # --paper из tokens.css


def cover(img, size):
    """Вписать с обрезкой — так же, как это делает object-fit: cover."""
    target = size[0] / size[1]
    w, h = img.size
    if w / h > target:
        new_w = int(h * target)
        box = ((w - new_w) // 2, 0, (w - new_w) // 2 + new_w, h)
    else:
        new_h = int(w / target)
        box = (0, 0, w, new_h)  # верх кадра: у скриншота там шапка
    return img.crop(box).resize(size, Image.LANCZOS)


def letterbox(img, size, bg):
    """Вписать целиком на холст — карточку соцсети нельзя обрезать вслепую."""
    canvas = Image.new("RGB", size, bg)
    fitted = img.copy()
    fitted.thumbnail((size[0] - 80, size[1] - 80), Image.LANCZOS)
    canvas.paste(fitted, ((size[0] - fitted.width) // 2, (size[1] - fitted.height) // 2))
    return canvas


def stale(src, dst):
    return not dst.exists() or dst.stat().st_mtime < src.stat().st_mtime


def main():
    THUMBS.mkdir(exist_ok=True)
    OG.mkdir(exist_ok=True)
    sources = sorted(SHOTS.glob("*.webp"))
    if not sources:
        print("нет исходников в", SHOTS, file=sys.stderr)
        return 1

    made = 0
    for src in sources:
        img = Image.open(src).convert("RGB")

        thumb = THUMBS / src.name
        if stale(src, thumb):
            cover(img, THUMB_SIZE).save(thumb, "WEBP", quality=78, method=6)
            made += 1

        card = OG / (src.stem + ".jpg")
        if stale(src, card):
            letterbox(img, OG_SIZE, OG_BG).save(card, "JPEG", quality=85, optimize=True, progressive=True)
            made += 1

    total = sum(f.stat().st_size for f in list(THUMBS.iterdir()) + list(OG.iterdir()))
    print(f"исходников {len(sources)}, обновлено файлов {made}, "
          f"производные весят {total // 1024} КБ")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
