# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "logo.png"
OUT = ROOT / "resources" / "android"

SIZES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}
FG = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432,
}
BG = (201, 44, 60, 255)


def rounded(img, radius_ratio=0.22):
    img = img.convert("RGBA")
    w, h = img.size
    r = int(min(w, h) * radius_ratio)
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=r, fill=255)
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out.paste(img, (0, 0))
    out.putalpha(mask)
    return out


def square_on_red(src, size, pad=0.12):
    canvas = Image.new("RGBA", (size, size), BG)
    inner = int(size * (1 - pad * 2))
    logo = src.convert("RGBA").resize((inner, inner), Image.Resampling.LANCZOS)
    x = (size - inner) // 2
    canvas.paste(logo, (x, x), logo)
    return canvas


def main():
    src = Image.open(SRC).convert("RGBA")
    OUT.mkdir(parents=True, exist_ok=True)
    play = square_on_red(src, 512, pad=0)
    play.save(OUT / "icon-512.png")
    for folder, size in SIZES.items():
        d = OUT / folder
        d.mkdir(parents=True, exist_ok=True)
        icon = square_on_red(src, size, pad=0)
        icon.save(d / "ic_launcher.png")
        rounded(icon).save(d / "ic_launcher_round.png")
        fg = square_on_red(src, FG[folder], pad=0.18)
        fg.save(d / "ic_launcher_foreground.png")
    print("icons ok", OUT)


if __name__ == "__main__":
    main()
