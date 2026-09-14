"""
Renders the site icons from one pet sprite.

    python3 scripts/generate-icons.py

Writes app/favicon.ico (16, 32, 48), app/icon.png (192) and
app/apple-icon.png (180, on a dark rounded tile). Next.js picks these up
from the app directory automatically.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public" / "media" / "deno" / "icon.png"
APP = ROOT / "app"

TILE = (24, 24, 27, 255)


def sprite() -> Image.Image:
    """The pet cropped to its opaque pixels, so it fills the icon."""
    image = Image.open(SOURCE).convert("RGBA")
    return image.crop(image.getbbox())


def fit(image: Image.Image, size: int, padding: float = 0.08) -> Image.Image:
    """Nearest-neighbor scale into a transparent square, centered."""
    inner = round(size * (1 - 2 * padding))
    scale = min(inner / image.width, inner / image.height)
    scaled = image.resize(
        (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
        Image.NEAREST,
    )
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(
        scaled, ((size - scaled.width) // 2, (size - scaled.height) // 2)
    )
    return canvas


def tiled(image: Image.Image, size: int) -> Image.Image:
    """Same, on a rounded dark tile for home-screen icons."""
    tile = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(tile).rounded_rectangle(
        (0, 0, size - 1, size - 1), radius=round(size * 0.22), fill=TILE
    )
    tile.alpha_composite(fit(image, size, padding=0.16))
    return tile


def main() -> None:
    pet = sprite()

    sizes = [16, 32, 48]
    fit(pet, 48).save(
        APP / "favicon.ico",
        sizes=[(s, s) for s in sizes],
        append_images=[fit(pet, s) for s in sizes[:-1]],
    )
    fit(pet, 192).save(APP / "icon.png", optimize=True)
    tiled(pet, 180).convert("RGB").save(APP / "apple-icon.png", optimize=True)
    print("wrote app/favicon.ico, app/icon.png, app/apple-icon.png")


if __name__ == "__main__":
    main()
