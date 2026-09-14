"""
Renders public/meta.png, the 1200x630 Open Graph card.

    python3 scripts/generate-og-image.py

Needs Pillow. Downloads Press Start 2P into a temp dir on first run so the
title matches the site's font. Uses the playground's winter scene as the
backdrop and the first idle frame of a handful of pets standing on the snow.
"""

from __future__ import annotations

import tempfile
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT / "public" / "media"
OUT = ROOT / "public" / "meta.png"

WIDTH, HEIGHT = 1200, 630
FONT_URL = "https://github.com/google/fonts/raw/main/ofl/pressstart2p/PressStart2P-Regular.ttf"

# (animal, color, flip) — flipped pets face left so the group looks inward.
LINEUP = [
    ("deno", "green", False),
    ("dog", "red", False),
    ("chicken", "brown", False),
    ("fox", "red", False),
    ("totoro", "gray", True),
    ("horse", "magical", True),
    ("rubber-duck", "yellow", True),
]
PET_BOX_W, PET_BOX_H = 144, 130  # each sprite is fit inside this box, bottom-aligned
FEET_Y = 556  # baseline the pets stand on
MARGIN_X = 70


def font_path() -> Path:
    cached = Path(tempfile.gettempdir()) / "PressStart2P-Regular.ttf"
    if not cached.exists():
        urllib.request.urlretrieve(FONT_URL, cached)
    return cached


def backdrop() -> Image.Image:
    scene = Image.open(MEDIA / "background" / "house.png").convert("RGBA")
    scale = WIDTH / scene.width
    scene = scene.resize((WIDTH, round(scene.height * scale)), Image.NEAREST)
    top = 170  # keeps the horizon low so the pets stand on snow
    scene = scene.crop((0, top, WIDTH, top + HEIGHT))

    # Darken the upper half so the title reads on the starry sky.
    shade = Image.new("RGBA", scene.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(shade)
    for y in range(0, 360):
        alpha = round(215 * (1 - y / 360))
        draw.line([(0, y), (WIDTH, y)], fill=(6, 8, 20, alpha))
    return Image.alpha_composite(scene, shade)


def idle_frame(animal: str, color: str) -> Image.Image:
    gif = Image.open(MEDIA / animal / f"{color}_idle_8fps.gif")
    gif.seek(0)
    frame = gif.convert("RGBA")
    return frame.crop(frame.getbbox())


def fit(sprite: Image.Image, box_w: int, box_h: int) -> Image.Image:
    scale = min(box_w / sprite.width, box_h / sprite.height)
    size = (max(1, round(sprite.width * scale)), max(1, round(sprite.height * scale)))
    return sprite.resize(size, Image.NEAREST)


def draw_pets(card: Image.Image) -> None:
    slots = len(LINEUP)
    span = WIDTH - 2 * MARGIN_X - PET_BOX_W
    for i, (animal, color, flip) in enumerate(LINEUP):
        sprite = fit(idle_frame(animal, color), PET_BOX_W, PET_BOX_H)
        if flip:
            sprite = sprite.transpose(Image.FLIP_LEFT_RIGHT)
        slot_x = MARGIN_X + round(i * span / (slots - 1))
        x = slot_x + (PET_BOX_W - sprite.width) // 2
        y = FEET_Y - sprite.height
        card.alpha_composite(sprite, (x, y))


def draw_text(card: Image.Image) -> None:
    draw = ImageDraw.Draw(card)
    title = ImageFont.truetype(str(font_path()), 64)
    body = ImageFont.truetype(str(font_path()), 20)
    small = ImageFont.truetype(str(font_path()), 15)

    x = MARGIN_X
    # Pixel fonts look right with a hard offset shadow, not a blur.
    draw.text((x + 4, 92 + 4), "WebPets", font=title, fill=(8, 10, 24, 255))
    draw.text((x, 92), "WebPets", font=title, fill=(255, 255, 255, 255))

    lines = [
        (190, "Tiny pixel pets that wander your site.", body, (214, 220, 236, 255)),
        (226, "One React component. Drop it in.", body, (150, 160, 188, 255)),
        (292, "22 animals  ·  hover reactions  ·  speech bubbles", small, (160, 170, 200, 255)),
    ]
    for y, text, font, fill in lines:
        draw.text((x + 2, y + 2), text, font=font, fill=(8, 10, 24, 255))
        draw.text((x, y), text, font=font, fill=fill)


def main() -> None:
    card = backdrop()
    draw_pets(card)
    draw_text(card)
    card.convert("RGB").save(OUT, optimize=True)
    print(f"wrote {OUT.relative_to(ROOT)} ({card.width}x{card.height})")


if __name__ == "__main__":
    main()
