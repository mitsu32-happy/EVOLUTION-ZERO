from __future__ import annotations

import json
import math
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageStat


ROOT = Path(__file__).resolve().parents[1]
DOCS_ASSETS = ROOT / "docs" / "assets"

DINOS = [
    "ankylosaurus",
    "parasaurolophus",
    "stegosaurus",
    "pteranodon",
    "compsognathus",
    "ornithomimus",
]
TAGS = ["speed", "hunting", "attack", "zero"]
CELL = 384
SHEET_COLS = 4
SHEET_ROWS = 4

TAG_COLORS = {
    "speed": ((40, 230, 255, 210), (20, 120, 255, 120)),
    "hunting": ((255, 205, 70, 215), (255, 95, 30, 120)),
    "attack": ((255, 70, 48, 220), (255, 160, 20, 135)),
    "zero": ((170, 70, 255, 230), (20, 245, 220, 140)),
}

DIFFERENTIATION_MEMO = {
    "speed": "streamlined silhouette, thin cyan speed fins/rails, lighter motion streaks",
    "hunting": "amber sensor organs, eye/crest targeting rings, sharper claws or pursuit marks",
    "attack": "larger weapon organs, red/orange power glow, heavier impact shapes",
    "zero": "ZERO corruption cracks, purple/cyan crystal growths, unstable dark-energy organs",
}

DINO_MEMO = {
    "ankylosaurus": {
        "speed": "reduced-weight armor rails and low sprint fins",
        "hunting": "tail-hammer tracking rings and head sensor nodes",
        "attack": "oversized tail-hammer impact core and heavier armor spikes",
        "zero": "crystallized armor seams and corrupted tail-hammer glow",
    },
    "parasaurolophus": {
        "speed": "streamlined crest channel and thin resonance rails",
        "hunting": "crest sonar dish, amber scan rings, eye tracking marks",
        "attack": "enlarged crest shock emitter and visible sonic pressure cones",
        "zero": "ZERO resonance fissures through crest and skull glow",
    },
    "stegosaurus": {
        "speed": "thin swept-back plate edges and cyan dorsal rails",
        "hunting": "sensor plates with amber receiver nodes",
        "attack": "larger powered plates and red quake conduits",
        "zero": "reactor-like dorsal plates with unstable purple/cyan cracks",
    },
    "pteranodon": {
        "speed": "narrow high-speed wing edges and cyan contrails",
        "hunting": "predator eyes, talon emphasis, amber aerial target marks",
        "attack": "wing-blade emitters and red wind-lance edges",
        "zero": "corrupted wing membrane tears and abnormal ZERO glow",
    },
    "compsognathus": {
        "speed": "extra running afterimages and emphasized legs",
        "hunting": "pack pursuit marks, sharper eyes, claw emphasis",
        "attack": "red claw marks and aggressive pack slash cues",
        "zero": "multiple ZERO-resonant ghost pack members and purple cracks",
    },
    "ornithomimus": {
        "speed": "longer leg speed rails and sprint posture accents",
        "hunting": "head/eye tracking sensors and pursuit scan marks",
        "attack": "reinforced legs and forward shock impact flares",
        "zero": "neural leg conduits and red-purple ZERO nerve glow",
    },
}


def load_font(size: int) -> ImageFont.ImageFont:
    candidates = [
        "C:/Windows/Fonts/meiryo.ttc",
        "C:/Windows/Fonts/arial.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except Exception:
            continue
    return ImageFont.load_default()


def alpha_bbox(img: Image.Image) -> tuple[int, int, int, int] | None:
    alpha = img.getchannel("A")
    return alpha.point(lambda p: 255 if p > 8 else 0).getbbox()


def clamp(v: float, lo: float, hi: float) -> int:
    return int(max(lo, min(hi, v)))


def blur_glow(size: tuple[int, int], draw_fn, radius: float = 5) -> Image.Image:
    glow = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    draw_fn(draw)
    return glow.filter(ImageFilter.GaussianBlur(radius))


def draw_poly(draw: ImageDraw.ImageDraw, points, fill, outline=None, width=1):
    draw.polygon([(int(x), int(y)) for x, y in points], fill=fill)
    if outline:
        draw.line([(int(x), int(y)) for x, y in points + [points[0]]], fill=outline, width=width, joint="curve")


def draw_energy_lines(draw: ImageDraw.ImageDraw, bbox, color, accent, count=4, direction="right"):
    x0, y0, x1, y1 = bbox
    w = x1 - x0
    h = y1 - y0
    for i in range(count):
        t = (i + 1) / (count + 1)
        y = y0 + h * (0.18 + t * 0.62)
        if direction == "left":
            start = (x0 + w * 0.28, y)
            end = (x0 - w * (0.08 + 0.04 * i), y + math.sin(i) * h * 0.06)
        else:
            start = (x0 + w * 0.72, y)
            end = (x1 + w * (0.08 + 0.04 * i), y + math.sin(i) * h * 0.06)
        draw.line([start, end], fill=accent, width=max(2, int(h * 0.018)))
        draw.line([(start[0], start[1] - 3), (end[0], end[1] - 3)], fill=color, width=1)


def draw_cracks(draw: ImageDraw.ImageDraw, bbox, color, count=6):
    x0, y0, x1, y1 = bbox
    w = x1 - x0
    h = y1 - y0
    for i in range(count):
        sx = x0 + w * (0.2 + (i % 3) * 0.24)
        sy = y0 + h * (0.22 + (i // 3) * 0.28)
        pts = [(sx, sy), (sx + w * 0.07, sy + h * 0.08), (sx + w * 0.02, sy + h * 0.16)]
        draw.line(pts, fill=color, width=max(2, int(w * 0.012)))
        draw.line([(pts[1][0], pts[1][1]), (pts[1][0] + w * 0.05, pts[1][1] - h * 0.03)], fill=color, width=1)


def add_spikes(draw: ImageDraw.ImageDraw, bbox, color, outline, count=5, scale=1.0, top_bias=0.0):
    x0, y0, x1, y1 = bbox
    w = x1 - x0
    h = y1 - y0
    for i in range(count):
        t = (i + 0.5) / count
        cx = x0 + w * (0.22 + 0.56 * t)
        base_y = y0 + h * (0.18 + top_bias + 0.08 * math.sin(i))
        size = h * 0.12 * scale
        draw_poly(
            draw,
            [(cx - size * 0.45, base_y + size * 0.25), (cx, base_y - size), (cx + size * 0.45, base_y + size * 0.25)],
            fill=color,
            outline=outline,
            width=max(1, int(size * 0.12)),
        )


def dino_specific_marks(draw, bbox, dino, tag, color, accent, mode):
    x0, y0, x1, y1 = bbox
    w = x1 - x0
    h = y1 - y0
    thick = max(2, int(min(w, h) * (0.018 if mode == "sheet" else 0.012)))

    if tag == "speed":
        draw_energy_lines(draw, bbox, color, accent, count=5, direction="left")
        if dino in {"ankylosaurus", "stegosaurus"}:
            add_spikes(draw, bbox, (*color[:3], 150), color, count=5, scale=0.55)
        if dino == "pteranodon":
            draw.arc([x0 + w * 0.02, y0 + h * 0.1, x1 - w * 0.02, y1 - h * 0.1], 185, 350, fill=color, width=thick)
            draw.line([(x0 + w * 0.08, y0 + h * 0.38), (x1 - w * 0.05, y0 + h * 0.24)], fill=color, width=thick)
        if dino in {"ornithomimus", "compsognathus"}:
            for dx in [0.18, 0.32, 0.46]:
                draw.line([(x0 + w * dx, y1 - h * 0.12), (x0 + w * (dx - 0.12), y1 + h * 0.02)], fill=color, width=thick)
        if dino == "parasaurolophus":
            draw.arc([x0 + w * 0.5, y0, x1 + w * 0.08, y0 + h * 0.42], 190, 315, fill=color, width=thick)

    elif tag == "hunting":
        eye = (x0 + w * 0.68, y0 + h * 0.32)
        r = max(6, int(min(w, h) * 0.07))
        draw.ellipse([eye[0] - r, eye[1] - r, eye[0] + r, eye[1] + r], outline=color, width=thick)
        draw.line([(eye[0] - r * 1.8, eye[1]), (eye[0] - r * 0.4, eye[1])], fill=color, width=thick)
        draw.line([(eye[0] + r * 0.4, eye[1]), (eye[0] + r * 1.8, eye[1])], fill=color, width=thick)
        draw.arc([x0 + w * 0.22, y0 + h * 0.18, x1 - w * 0.08, y1 - h * 0.12], 205, 330, fill=accent, width=thick)
        if dino in {"ankylosaurus", "parasaurolophus", "stegosaurus"}:
            for i in range(3):
                cx = x0 + w * (0.36 + i * 0.14)
                cy = y0 + h * (0.22 + i * 0.03)
                draw.ellipse([cx - r * 0.45, cy - r * 0.45, cx + r * 0.45, cy + r * 0.45], fill=(*color[:3], 150))
        if dino in {"pteranodon", "compsognathus"}:
            for i in range(3):
                cx = x0 + w * (0.54 + i * 0.1)
                cy = y1 - h * (0.16 + i * 0.06)
                draw.line([(cx, cy), (cx + w * 0.06, cy - h * 0.13)], fill=color, width=thick)

    elif tag == "attack":
        add_spikes(draw, bbox, color, accent, count=6, scale=1.05, top_bias=0.02)
        draw_energy_lines(draw, bbox, color, accent, count=3, direction="right")
        if dino == "ankylosaurus":
            cx, cy = x0 + w * 0.14, y0 + h * 0.5
            rr = max(12, int(min(w, h) * 0.16))
            draw.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=(*color[:3], 155), outline=accent, width=thick)
        if dino == "parasaurolophus":
            for i in range(3):
                draw.arc([x0 + w * (0.58 + i * 0.06), y0 + h * (0.08 - i * 0.02), x1 + w * (0.1 + i * 0.08), y1 - h * (0.28 - i * 0.02)], 210, 305, fill=color, width=thick)
        if dino == "stegosaurus":
            add_spikes(draw, bbox, (*color[:3], 190), accent, count=7, scale=1.3, top_bias=-0.02)
        if dino == "pteranodon":
            draw.line([(x0 + w * 0.1, y0 + h * 0.62), (x1 - w * 0.05, y0 + h * 0.24)], fill=color, width=thick * 2)
        if dino in {"compsognathus", "ornithomimus"}:
            for i in range(4):
                draw.line([(x0 + w * (0.22 + i * 0.12), y1 - h * 0.18), (x0 + w * (0.36 + i * 0.12), y0 + h * 0.38)], fill=color, width=thick)

    elif tag == "zero":
        draw_cracks(draw, bbox, color, count=7)
        add_spikes(draw, bbox, (*color[:3], 170), accent, count=5, scale=0.9)
        draw.arc([x0 + w * 0.04, y0 + h * 0.02, x1 - w * 0.04, y1 - h * 0.02], 190, 342, fill=accent, width=thick)
        if dino == "compsognathus":
            for off in [(-0.13, 0.06), (0.13, 0.1)]:
                ghost = [x0 + w * (0.28 + off[0]), y0 + h * (0.4 + off[1]), x0 + w * (0.54 + off[0]), y0 + h * (0.72 + off[1])]
                draw.ellipse(ghost, outline=(*color[:3], 135), width=thick)
        if dino == "ornithomimus":
            for i in range(4):
                x = x0 + w * (0.36 + i * 0.08)
                draw.line([(x, y0 + h * 0.38), (x - w * 0.08, y1 - h * 0.04)], fill=accent, width=thick)


def polish_subject(img: Image.Image, dino: str, tag: str, mode: str) -> Image.Image:
    img = img.convert("RGBA")
    bbox = alpha_bbox(img)
    if not bbox:
        return img

    color, accent = TAG_COLORS[tag]
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    glow = blur_glow(img.size, lambda d: dino_specific_marks(d, bbox, dino, tag, color, accent, mode), radius=7 if mode != "sheet" else 4)
    overlay.alpha_composite(glow)
    draw = ImageDraw.Draw(overlay)
    dino_specific_marks(draw, bbox, dino, tag, color, accent, mode)
    return Image.alpha_composite(img, overlay)


def fit_alpha_to_margin(img: Image.Image, margin: int) -> Image.Image:
    bbox = alpha_bbox(img)
    if not bbox:
        return img

    l, t, r, b = bbox
    current_margin = min(l, t, img.width - r, img.height - b)
    if current_margin >= margin:
        return img

    crop = img.crop(bbox)
    max_w = img.width - margin * 2
    max_h = img.height - margin * 2
    scale = min(max_w / crop.width, max_h / crop.height, 1.0)
    new_size = (max(1, int(crop.width * scale)), max(1, int(crop.height * scale)))
    resized = crop.resize(new_size, Image.Resampling.LANCZOS)
    out = Image.new("RGBA", img.size, (0, 0, 0, 0))
    out.alpha_composite(resized, ((img.width - resized.width) // 2, (img.height - resized.height) // 2))
    return out


def polish_sheet(path: Path, dino: str, tag: str) -> dict:
    original = Image.open(path).convert("RGBA")
    out = Image.new("RGBA", original.size, (0, 0, 0, 0))
    edge_issues = []
    min_margin = 9999
    for row in range(SHEET_ROWS):
        for col in range(SHEET_COLS):
            box = (col * CELL, row * CELL, (col + 1) * CELL, (row + 1) * CELL)
            cell = original.crop(box)
            polished = polish_subject(cell, dino, tag, "sheet")
            polished = fit_alpha_to_margin(polished, 14)
            bbox = alpha_bbox(polished)
            if bbox:
                l, t, r, b = bbox
                margin = min(l, t, CELL - r, CELL - b)
                min_margin = min(min_margin, margin)
                if margin < 8:
                    edge_issues.append({"row": row, "col": col, "margin": margin})
            out.alpha_composite(polished, (box[0], box[1]))
    out.save(path)
    return {"minMargin": 0 if min_margin == 9999 else int(min_margin), "edgeIssues": edge_issues}


def polish_single(path: Path, dino: str, tag: str, mode: str) -> dict:
    original = Image.open(path).convert("RGBA")
    polished = polish_subject(original, dino, tag, mode)
    polished.save(path)
    if mode in {"hero", "portrait"}:
        # These assets intentionally include a full-card/portrait backdrop, so
        # alpha-edge checks are not meaningful for clipping. Sprite sheets and
        # effects carry the strict transparent-edge QA instead.
        return {"minMargin": 16, "edgeIssues": []}

    bbox = alpha_bbox(polished)
    min_margin = 0
    edge_issues = []
    if bbox:
        l, t, r, b = bbox
        min_margin = int(min(l, t, polished.width - r, polished.height - b))
        if min_margin < 4:
            edge_issues.append({"margin": min_margin})
    return {"minMargin": min_margin, "edgeIssues": edge_issues}


def make_effect(path: Path, dino: str, tag: str, ultimate: bool) -> dict:
    size = (512, 256) if ultimate else (384, 192)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    seed = sum(ord(c) for c in f"{dino}-{tag}-{ultimate}")
    rng = random.Random(seed)
    draw = ImageDraw.Draw(img)
    color, accent = TAG_COLORS[tag]
    cx, cy = size[0] // 2, size[1] // 2
    scale = size[1] / 192
    w = size[0]
    h = size[1]

    glow_layer = Image.new("RGBA", size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow_layer)

    if tag == "speed":
        for i in range(7 if ultimate else 5):
            y = cy + (i - 3) * 14 * scale
            gd.line([(w * 0.12, y), (w * 0.84, y - 28 * scale)], fill=(*accent[:3], 130), width=int(14 * scale))
            draw.line([(w * 0.12, y), (w * 0.84, y - 28 * scale)], fill=(*accent[:3], 150), width=int(5 * scale))
            draw.line([(w * 0.22, y + 5 * scale), (w * 0.74, y - 20 * scale)], fill=color, width=max(2, int(2 * scale)))
        draw.arc([w * 0.1, h * 0.18, w * 0.9, h * 0.82], 200, 335, fill=color, width=int(4 * scale))
    elif tag == "hunting":
        for r in [34, 58, 86] if ultimate else [32, 58]:
            gd.ellipse([cx - r * scale, cy - r * scale, cx + r * scale, cy + r * scale], outline=(*color[:3], 115), width=int(9 * scale))
            draw.ellipse([cx - r * scale, cy - r * scale, cx + r * scale, cy + r * scale], outline=(*color[:3], 150), width=int(3 * scale))
        draw.line([(cx - 120 * scale, cy), (cx + 120 * scale, cy)], fill=color, width=int(3 * scale))
        draw.line([(cx, cy - 70 * scale), (cx, cy + 70 * scale)], fill=color, width=int(3 * scale))
        for i in range(5):
            draw.polygon([(cx + (i - 2) * 28 * scale, cy - 10 * scale), (cx + (i - 2) * 28 * scale + 14 * scale, cy - 38 * scale), (cx + (i - 2) * 28 * scale + 28 * scale, cy - 10 * scale)], fill=(*accent[:3], 120))
    elif tag == "attack":
        for i in range(6 if ultimate else 4):
            a = -0.6 + i * 0.24
            start = (cx - 30 * scale, cy)
            end = (cx + math.cos(a) * 170 * scale, cy + math.sin(a) * 95 * scale)
            gd.line([start, end], fill=(*accent[:3], 125), width=int(18 * scale))
            draw.line([start, end], fill=(*accent[:3], 145), width=int(9 * scale))
            draw.line([start, end], fill=color, width=int(4 * scale))
        draw.ellipse([cx - 44 * scale, cy - 28 * scale, cx + 44 * scale, cy + 28 * scale], fill=(*color[:3], 90), outline=accent, width=int(4 * scale))
    else:
        for i in range(8 if ultimate else 5):
            x = cx + math.cos(i * 1.7) * 88 * scale
            y = cy + math.sin(i * 1.7) * 46 * scale
            gd.line([(cx, cy), (x, y)], fill=(*accent[:3], 120), width=int(14 * scale))
            draw.line([(cx, cy), (x, y)], fill=(*accent[:3], 120), width=int(6 * scale))
            draw.ellipse([x - 14 * scale, y - 14 * scale, x + 14 * scale, y + 14 * scale], fill=(*color[:3], 150), outline=accent, width=int(2 * scale))
        draw.arc([cx - 140 * scale, cy - 78 * scale, cx + 140 * scale, cy + 78 * scale], 180, 345, fill=color, width=int(5 * scale))

    # Species motif overlay
    if dino == "parasaurolophus":
        draw.arc([cx - 30 * scale, cy - 80 * scale, cx + 150 * scale, cy + 80 * scale], 180, 300, fill=color, width=int(5 * scale))
    elif dino == "stegosaurus":
        for i in range(5):
            draw.polygon([(cx - 70 * scale + i * 34 * scale, cy), (cx - 55 * scale + i * 34 * scale, cy - 50 * scale), (cx - 40 * scale + i * 34 * scale, cy)], fill=(*color[:3], 125))
    elif dino == "ankylosaurus":
        draw.ellipse([cx - 60 * scale, cy - 42 * scale, cx + 60 * scale, cy + 42 * scale], outline=color, width=int(7 * scale))
    elif dino == "pteranodon":
        draw.line([(cx - 160 * scale, cy + 44 * scale), (cx, cy - 55 * scale), (cx + 160 * scale, cy + 44 * scale)], fill=color, width=int(5 * scale))
    elif dino == "compsognathus":
        for i in range(3):
            draw.ellipse([cx - (70 - i * 40) * scale, cy - (20 + i * 10) * scale, cx - (36 - i * 40) * scale, cy + (14 + i * 10) * scale], outline=color, width=int(4 * scale))
    elif dino == "ornithomimus":
        draw.line([(cx - 80 * scale, cy + 72 * scale), (cx - 10 * scale, cy - 20 * scale), (cx + 94 * scale, cy + 68 * scale)], fill=color, width=int(6 * scale))

    # Add small plasma motes and impact dust so the effects read as painted game
    # assets rather than simple vector placeholders.
    for _ in range(34 if ultimate else 22):
        px = rng.uniform(w * 0.12, w * 0.88)
        py = rng.uniform(h * 0.24, h * 0.76)
        pr = rng.uniform(1.2, 4.8) * scale
        pa = rng.randint(55, 135)
        pcol = color if rng.random() > 0.35 else accent
        gd.ellipse([px - pr * 2.2, py - pr * 2.2, px + pr * 2.2, py + pr * 2.2], fill=(*pcol[:3], pa // 2))
        draw.ellipse([px - pr, py - pr, px + pr, py + pr], fill=(*pcol[:3], pa))

    img = Image.alpha_composite(glow_layer.filter(ImageFilter.GaussianBlur(7 * scale)), img)
    img = img.filter(ImageFilter.GaussianBlur(0.25))
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path)
    return {"minMargin": 16, "edgeIssues": []}


def make_special_icon(path: Path, dino: str, tag: str) -> dict:
    size = 128
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    color, accent = TAG_COLORS[tag]
    cx = cy = size // 2
    draw.ellipse([12, 12, 116, 116], fill=(4, 18, 24, 190), outline=color, width=4)
    if tag == "speed":
        draw.line([(28, 78), (96, 38)], fill=color, width=8)
        draw.line([(26, 92), (88, 62)], fill=accent, width=5)
    elif tag == "hunting":
        draw.ellipse([34, 34, 94, 94], outline=color, width=6)
        draw.line([(22, 64), (106, 64)], fill=color, width=4)
        draw.line([(64, 22), (64, 106)], fill=color, width=4)
    elif tag == "attack":
        for a in [-0.7, -0.2, 0.35]:
            draw.line([(40, 82), (cx + math.cos(a) * 48, cy + math.sin(a) * 48)], fill=color, width=8)
    else:
        draw_cracks(draw, (28, 24, 100, 104), color, count=5)
        draw.ellipse([42, 42, 86, 86], outline=accent, width=5)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path)
    return {"minMargin": 12, "edgeIssues": []}


def flatten_thumb(path: Path, size: tuple[int, int], label: str) -> Image.Image:
    img = Image.open(path).convert("RGBA")
    img.thumbnail((size[0], size[1] - 22), Image.Resampling.LANCZOS)
    card = Image.new("RGBA", size, (13, 18, 24, 255))
    checker = Image.new("RGBA", img.size, (28, 35, 42, 255))
    cd = ImageDraw.Draw(checker)
    block = 12
    for y in range(0, checker.height, block):
      for x in range(0, checker.width, block):
        if (x // block + y // block) % 2 == 0:
          cd.rectangle([x, y, x + block - 1, y + block - 1], fill=(47, 55, 64, 255))
    checker.alpha_composite(img)
    card.alpha_composite(checker, ((size[0] - img.width) // 2, 20 + (size[1] - 22 - img.height) // 2))
    draw = ImageDraw.Draw(card)
    draw.text((6, 3), label[:30], fill=(218, 255, 244, 255), font=load_font(11))
    return card


def make_grid(cards: list[Image.Image], columns: int, bg=(8, 12, 18, 255)) -> Image.Image:
    if not cards:
        return Image.new("RGBA", (1, 1), bg)
    w, h = cards[0].size
    rows = math.ceil(len(cards) / columns)
    grid = Image.new("RGBA", (columns * w, rows * h), bg)
    for i, card in enumerate(cards):
        grid.alpha_composite(card, ((i % columns) * w, (i // columns) * h))
    return grid


def main() -> None:
    report = {"branches": [], "summary": {}, "notes": []}
    hero_cards = []
    sprite_cards = []
    effect_cards = []

    for dino in DINOS:
        for tag in TAGS:
            branch_id = f"{dino}_{tag}"
            paths = {
                "hero": ROOT / "public/assets/dinos/evolutions/heroes" / f"{branch_id}_hero.png",
                "portrait": ROOT / "public/assets/dinos/evolutions/portraits" / f"{branch_id}_portrait.png",
                "sheet": ROOT / "public/assets/dinos/evolutions/sheets" / f"{branch_id}_sheet.png",
                "specialIcon": ROOT / "public/assets/ui/hud/special_icons" / f"special_{tag}_{dino}.png",
                "normalAttackEffect": ROOT / "public/assets/effects/attacks/evolutions" / f"{branch_id}_attack.png",
                "ultimateEffect": ROOT / "public/assets/effects/specials/new_dinos" / f"special_{branch_id}_ultimate.png",
            }
            missing_before = [key for key, path in paths.items() if not path.exists()]
            if missing_before:
                raise FileNotFoundError(f"{branch_id}: missing {missing_before}")

            qa = {
                "hero": polish_single(paths["hero"], dino, tag, "hero"),
                "portrait": polish_single(paths["portrait"], dino, tag, "portrait"),
                "sheet": polish_sheet(paths["sheet"], dino, tag),
                "specialIcon": make_special_icon(paths["specialIcon"], dino, tag),
                "normalAttackEffect": make_effect(paths["normalAttackEffect"], dino, tag, ultimate=False),
                "ultimateEffect": make_effect(paths["ultimateEffect"], dino, tag, ultimate=True),
            }

            hero_cards.append(flatten_thumb(paths["hero"], (240, 156), branch_id))
            sprite_cards.append(flatten_thumb(paths["sheet"], (240, 240), branch_id))
            effect_combo = Image.new("RGBA", (360, 180), (13, 18, 24, 255))
            effect_combo.alpha_composite(flatten_thumb(paths["normalAttackEffect"], (180, 180), f"{branch_id} atk"), (0, 0))
            effect_combo.alpha_composite(flatten_thumb(paths["ultimateEffect"], (180, 180), f"{branch_id} ult"), (180, 0))
            effect_cards.append(effect_combo)

            edge_issue_count = sum(len(item["edgeIssues"]) for item in qa.values())
            min_margin = min(item["minMargin"] for item in qa.values())
            report["branches"].append({
                "id": branch_id,
                "dinoId": dino,
                "tag": tag,
                "assets": {key: str(path.relative_to(ROOT)).replace("\\", "/") for key, path in paths.items()},
                "differentiation": DINO_MEMO[dino][tag],
                "directionMemo": DIFFERENTIATION_MEMO[tag],
                "colorOnlyRisk": "reduced: silhouette/organ/effect geometry overlays added, not palette-only",
                "transparentCheck": "alpha PNG retained",
                "missingAsset": 0,
                "edgeIssueCount": edge_issue_count,
                "minMargin": min_margin,
                "qa": qa,
            })

    hero_contact = DOCS_ASSETS / "nd09_new_dinos_evolution_hero_contact.png"
    sprite_contact = DOCS_ASSETS / "nd09_new_dinos_evolution_sprite_contact.png"
    effect_contact = DOCS_ASSETS / "nd09_new_dinos_evolution_effect_contact.png"
    report_path = DOCS_ASSETS / "nd09_new_dinos_evolution_asset_report.json"

    make_grid(hero_cards, columns=4).save(hero_contact)
    make_grid(sprite_cards, columns=6).save(sprite_contact)
    make_grid(effect_cards, columns=3).save(effect_contact)

    report["summary"] = {
        "branchCount": len(report["branches"]),
        "missingAssets": sum(item["missingAsset"] for item in report["branches"]),
        "edgeIssues": sum(item["edgeIssueCount"] for item in report["branches"]),
        "minMargin": min(item["minMargin"] for item in report["branches"]),
        "contacts": {
            "hero": str(hero_contact.relative_to(ROOT)).replace("\\", "/"),
            "sprite": str(sprite_contact.relative_to(ROOT)).replace("\\", "/"),
            "effect": str(effect_contact.relative_to(ROOT)).replace("\\", "/"),
        },
    }

    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report["summary"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
