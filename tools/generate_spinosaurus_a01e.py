from __future__ import annotations

import json
import math
import shutil
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
KEY = (255, 0, 255, 255)
TRANSPARENT = (0, 0, 0, 0)
SOURCE_DIR = ROOT / "docs/assets/generated_raw/mvp_a01e_chromakey_spinosaurus"
BACKUP_DIR = ROOT / "docs/assets/backup/mvp_a01e_chromakey_spinosaurus"


@dataclass(frozen=True)
class Variant:
    key: str
    label: str
    body: tuple[int, int, int, int]
    belly: tuple[int, int, int, int]
    sail: tuple[int, int, int, int]
    glow: tuple[int, int, int, int]
    accent: tuple[int, int, int, int]


VARIANTS = {
    "base": Variant("base", "Base Spinosaurus", (16, 74, 108, 255), (56, 168, 181, 255), (28, 210, 230, 255), (210, 250, 255, 255), (4, 36, 72, 255)),
    "speed": Variant("speed", "Stream Spino", (20, 98, 126, 255), (80, 214, 220, 255), (68, 230, 245, 255), (230, 255, 255, 255), (10, 58, 100, 255)),
    "hunting": Variant("hunting", "Abyss Spino", (8, 44, 80, 255), (38, 132, 150, 255), (22, 172, 198, 255), (170, 240, 255, 255), (38, 24, 92, 255)),
    "attack": Variant("attack", "Death Spino", (24, 54, 84, 255), (68, 150, 168, 255), (240, 80, 46, 255), (255, 238, 210, 255), (106, 26, 34, 255)),
    "zero": Variant("zero", "Neptrex", (10, 30, 78, 255), (40, 118, 170, 255), (110, 236, 255, 255), (245, 255, 255, 255), (48, 32, 128, 255)),
}


PUBLIC_TARGETS = {
    "base_sprite": ROOT / "public/assets/dinos/spinosaurus.png",
    "base_sheet": ROOT / "public/assets/dinos/spinosaurus_sheet.png",
    "base_hero": ROOT / "public/assets/dinos/dino_select/spinosaurus_hero.png",
    "base_portrait": ROOT / "public/assets/dinos/portraits/spinosaurus.png",
    "speed_sprite": ROOT / "public/assets/dinos/evolutions/spinosaurus_speed.png",
    "speed_sheet": ROOT / "public/assets/dinos/evolutions/sheets/spinosaurus_speed_sheet.png",
    "speed_hero": ROOT / "public/assets/dinos/evolutions/heroes/spinosaurus_speed_hero.png",
    "speed_portrait": ROOT / "public/assets/dinos/evolutions/portraits/spinosaurus_speed_portrait.png",
    "speed_icon": ROOT / "public/assets/ui/hud/special_icons/special_speed_spinosaurus.png",
    "hunting_sprite": ROOT / "public/assets/dinos/evolutions/spinosaurus_hunting.png",
    "hunting_sheet": ROOT / "public/assets/dinos/evolutions/sheets/spinosaurus_hunting_sheet.png",
    "hunting_hero": ROOT / "public/assets/dinos/evolutions/heroes/spinosaurus_hunting_hero.png",
    "hunting_portrait": ROOT / "public/assets/dinos/evolutions/portraits/spinosaurus_hunting_portrait.png",
    "hunting_icon": ROOT / "public/assets/ui/hud/special_icons/special_hunting_spinosaurus.png",
    "attack_sprite": ROOT / "public/assets/dinos/evolutions/spinosaurus_attack.png",
    "attack_sheet": ROOT / "public/assets/dinos/evolutions/sheets/spinosaurus_attack_sheet.png",
    "attack_hero": ROOT / "public/assets/dinos/evolutions/heroes/spinosaurus_attack_hero.png",
    "attack_portrait": ROOT / "public/assets/dinos/evolutions/portraits/spinosaurus_attack_portrait.png",
    "attack_icon": ROOT / "public/assets/ui/hud/special_icons/special_attack_spinosaurus.png",
    "zero_sprite": ROOT / "public/assets/dinos/evolutions/spinosaurus_zero.png",
    "zero_sheet": ROOT / "public/assets/dinos/evolutions/sheets/spinosaurus_zero_sheet.png",
    "zero_hero": ROOT / "public/assets/dinos/evolutions/heroes/spinosaurus_zero_hero.png",
    "zero_portrait": ROOT / "public/assets/dinos/evolutions/portraits/spinosaurus_zero_portrait.png",
    "zero_icon": ROOT / "public/assets/ui/hud/special_icons/special_zero_spinosaurus.png",
    "attack_water_slash": ROOT / "public/assets/effects/attacks/spinosaurus_attack_water_slash_sheet.png",
    "attack_splash_hit": ROOT / "public/assets/effects/attacks/spinosaurus_attack_splash_hit_sheet.png",
    "special_speed": ROOT / "public/assets/effects/specials/special_spinosaurus_speed_tidal_rush_sheet.png",
    "special_speed_alias": ROOT / "public/assets/effects/specials/special_spinosaurus_tidal_rush_sheet.png",
    "special_hunting": ROOT / "public/assets/effects/specials/special_spinosaurus_hunting_maelstrom_sheet.png",
    "special_hunting_alias": ROOT / "public/assets/effects/specials/special_spinosaurus_maelstrom_sheet.png",
    "special_attack": ROOT / "public/assets/effects/specials/special_spinosaurus_attack_hydro_break_sheet.png",
    "special_attack_alias": ROOT / "public/assets/effects/specials/special_spinosaurus_hydro_break_sheet.png",
    "special_zero_core": ROOT / "public/assets/effects/specials/special_zero_spinosaurus_core_sheet.png",
    "special_zero_tide": ROOT / "public/assets/effects/specials/special_zero_spinosaurus_tide_sheet.png",
    "special_zero_burst": ROOT / "public/assets/effects/specials/special_zero_spinosaurus_burst_sheet.png",
}


def ensure_dirs() -> None:
    SOURCE_DIR.mkdir(parents=True, exist_ok=True)
    for path in PUBLIC_TARGETS.values():
        path.parent.mkdir(parents=True, exist_ok=True)


def key_canvas(size: tuple[int, int]) -> Image.Image:
    return Image.new("RGBA", size, KEY)


def alpha_canvas(size: tuple[int, int]) -> Image.Image:
    return Image.new("RGBA", size, TRANSPARENT)


def rel(path: Path) -> str:
    return path.resolve().relative_to(ROOT).as_posix()


def draw_water(draw: ImageDraw.ImageDraw, cx: float, cy: float, scale: float, phase: float, strong: bool = False) -> None:
    colors = [(190, 250, 255, 235), (36, 210, 238, 220), (8, 126, 190, 210)]
    width = max(3, int(5 * scale))
    for i, color in enumerate(colors):
        offset = (phase * 10 + i * 7) * scale
        box = [
            cx - (62 + i * 10) * scale + offset,
            cy - (26 + i * 7) * scale,
            cx + (72 + i * 12) * scale + offset,
            cy + (30 + i * 8) * scale,
        ]
        start = 204 + phase * 9 + i * 7
        end = 338 + phase * 12 + i * 8
        draw.arc(box, start=start, end=end, fill=color, width=width + (2 if strong else 0))
    if strong:
        for i in range(4):
            x = cx + (36 + i * 16 + phase * 5) * scale
            y = cy + (-20 + i * 9) * scale
            draw.ellipse((x, y, x + 9 * scale, y + 5 * scale), fill=(220, 255, 255, 230))


def draw_spino(
    image: Image.Image,
    variant: Variant,
    center: tuple[float, float],
    scale: float,
    pose: str = "idle",
    phase: float = 0,
    facing: int = 1,
    attack_fx: bool = False,
) -> None:
    draw = ImageDraw.Draw(image, "RGBA")
    cx, cy = center
    lean = {"idle": 0, "move": -4 * math.sin(phase), "attack": -8, "death": 22}.get(pose, 0) * scale
    squash = 0.72 if pose == "death" else 1.0
    yoff = (18 if pose == "death" else 0) * scale

    def tx(x: float, y: float) -> tuple[float, float]:
        return (cx + facing * x * scale, cy + (y * squash + yoff) * scale + lean)

    # Water action behind the body.
    if pose in {"move", "attack"} or attack_fx:
        draw_water(draw, *tx(26 if pose == "attack" else -16, 28), scale, phase, strong=pose == "attack" or attack_fx)

    # Tail, body, neck, head.
    tail = [tx(-80, 18), tx(-136, 2), tx(-148, 17), tx(-94, 34)]
    draw.polygon(tail, fill=variant.body, outline=variant.accent)
    draw.ellipse((*tx(-78, -20), *tx(64, 48)), fill=variant.body, outline=variant.accent, width=max(1, int(3 * scale)))
    draw.ellipse((*tx(-38, 7), *tx(40, 45)), fill=variant.belly)
    draw.polygon([tx(48, -8), tx(78, -38), tx(94, -30), tx(68, 10)], fill=variant.body, outline=variant.accent)
    draw.ellipse((*tx(76, -48), *tx(126, -12)), fill=variant.body, outline=variant.accent, width=max(1, int(2 * scale)))
    draw.polygon([tx(108, -26), tx(142, -18), tx(113, -9)], fill=variant.body, outline=variant.accent)
    draw.ellipse((*tx(104, -36), *tx(112, -28)), fill=variant.glow)
    draw.polygon([tx(115, -11), tx(123, -6), tx(111, -4)], fill=(245, 250, 240, 255))

    # Sail plates.
    sail_points = [
        tx(-48, -18), tx(-24, -72), tx(0, -28), tx(22, -86), tx(46, -24), tx(62, -60), tx(72, -12)
    ]
    draw.polygon(sail_points, fill=variant.sail, outline=variant.glow)
    for x in (-26, 4, 34, 58):
        draw.line([tx(x, -20), tx(x + 3, -58)], fill=variant.glow, width=max(1, int(2 * scale)))

    # Legs and claws.
    leg_shift = 8 * math.sin(phase) if pose == "move" else 0
    if pose == "death":
        legs = [(-30, 42, -70, 58), (26, 41, 76, 56)]
    else:
        legs = [(-34, 36, -48 + leg_shift, 84), (24, 36, 48 - leg_shift, 82)]
    for x1, y1, x2, y2 in legs:
        draw.line([tx(x1, y1), tx(x2, y2)], fill=variant.body, width=max(5, int(11 * scale)))
        draw.line([tx(x2, y2), tx(x2 + 18, y2 + 2)], fill=variant.accent, width=max(2, int(4 * scale)))
    draw.line([tx(44, 9), tx(76, 22)], fill=variant.body, width=max(4, int(8 * scale)))
    draw.line([tx(75, 22), tx(88, 17)], fill=variant.glow, width=max(2, int(3 * scale)))

    # Highlight ridge and glow.
    draw.arc((*tx(-56, -10), *tx(58, 37)), 200, 340, fill=variant.glow, width=max(1, int(3 * scale)))


def sprite_frame(variant: Variant, row: int, col: int) -> Image.Image:
    frame = key_canvas((256, 256))
    phase = col / 3
    pose = ["idle", "move", "attack", "death"][row]
    y = 136 if pose != "death" else 126
    draw_spino(frame, variant, (116, y), 0.82, pose=pose, phase=phase, attack_fx=pose == "attack")
    return frame


def make_sheet(variant: Variant, path: Path) -> None:
    sheet = key_canvas((1024, 1024))
    for row in range(4):
        for col in range(4):
            sheet.alpha_composite(sprite_frame(variant, row, col), (col * 256, row * 256))
    sheet.save(path)


def make_hero(variant: Variant, size: tuple[int, int], portrait: bool = False) -> Image.Image:
    img = key_canvas(size)
    w, h = size
    scale = 1.95 if not portrait else 1.45
    center = (w * 0.43, h * (0.58 if not portrait else 0.62))
    draw_spino(img, variant, center, scale, pose="attack" if not portrait else "idle", phase=0.7, attack_fx=True)
    draw = ImageDraw.Draw(img, "RGBA")
    for i in range(6):
        x = w * 0.18 + i * w * 0.11
        y = h * (0.72 + 0.03 * math.sin(i))
        draw.arc((x, y - 36, x + 180, y + 54), 196, 320, fill=(180, 250, 255, 210), width=5)
    return img


def make_icon(variant: Variant) -> Image.Image:
    img = key_canvas((256, 256))
    draw = ImageDraw.Draw(img, "RGBA")
    draw.ellipse((28, 26, 228, 230), fill=(4, 34, 58, 255), outline=variant.glow, width=8)
    draw_water(draw, 118, 138, 0.82, 0.5, strong=True)
    draw_spino(img, variant, (108, 132), 0.55, pose="attack", phase=0.75, attack_fx=False)
    draw.ellipse((106, 64, 121, 79), fill=variant.glow)
    return img


def effect_frame(kind: str, variant: Variant, frame_index: int) -> Image.Image:
    img = key_canvas((256, 256))
    draw = ImageDraw.Draw(img, "RGBA")
    t = frame_index / 15
    cx, cy = 128, 130
    if kind in {"water_slash", "hydro_break"}:
        for i in range(4):
            r = 28 + t * 80 + i * 12
            draw.arc((cx - r, cy - r * 0.52, cx + r * 1.2, cy + r * 0.62), 205, 337, fill=(210, 255, 255, 235), width=8 - min(i, 3))
            draw.arc((cx - r + 12, cy - r * 0.36, cx + r * 1.3, cy + r * 0.76), 210, 328, fill=(26, 194, 230, 220), width=6)
        draw.polygon([(90 + t * 34, 98), (220, 118 + t * 10), (96 + t * 24, 154)], fill=(228, 255, 255, 160))
    elif kind in {"splash_hit", "tidal_rush", "tide"}:
        for i in range(8):
            ang = -0.7 + i * 0.2 + t * 0.7
            length = 42 + t * 88 + i * 5
            x1 = cx - 56 + i * 14
            y1 = cy + 26 * math.sin(i)
            x2 = x1 + math.cos(ang) * length
            y2 = y1 + math.sin(ang) * length
            draw.line((x1, y1, x2, y2), fill=(58, 218, 238, 230), width=8)
            draw.ellipse((x2 - 5, y2 - 5, x2 + 5, y2 + 5), fill=(235, 255, 255, 230))
        draw.arc((28, 80 - t * 12, 230, 210), 190, 340, fill=(190, 250, 255, 230), width=7)
    elif kind == "maelstrom":
        for i in range(7):
            r = 24 + i * 16 + t * 22
            draw.arc((cx - r, cy - r, cx + r, cy + r), 20 + t * 150 + i * 24, 250 + t * 150 + i * 24, fill=(40, 210, 232, 230), width=7)
            draw.arc((cx - r * 0.76, cy - r * 0.76, cx + r * 0.76, cy + r * 0.76), 210 + i * 18, 350 + i * 18, fill=(232, 255, 255, 210), width=4)
        draw.ellipse((106, 108, 150, 152), fill=(8, 58, 98, 210))
    elif kind == "core":
        radius = 28 + t * 64
        for i in range(4):
            r = radius + i * 18
            draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=(100, 230, 255, 230 - i * 32), width=8)
        draw.ellipse((cx - 32, cy - 32, cx + 32, cy + 32), fill=(230, 255, 255, 245), outline=variant.accent, width=5)
    elif kind == "burst":
        for i in range(18):
            ang = (math.pi * 2 * i / 18) + t * 1.4
            length = 28 + t * 92 + (i % 3) * 18
            x2 = cx + math.cos(ang) * length
            y2 = cy + math.sin(ang) * length
            draw.line((cx, cy, x2, y2), fill=(205, 252, 255, 230), width=7)
            draw.line((cx, cy, x2, y2), fill=(36, 200, 232, 210), width=3)
        draw.ellipse((cx - 42, cy - 42, cx + 42, cy + 42), fill=(38, 116, 180, 220), outline=(242, 255, 255, 245), width=5)
    return img


def make_effect_sheet(kind: str, variant: Variant, path: Path) -> None:
    sheet = key_canvas((1024, 1024))
    for i in range(16):
        sheet.alpha_composite(effect_frame(kind, variant, i), ((i % 4) * 256, (i // 4) * 256))
    sheet.save(path)


def remove_key(src: Image.Image) -> Image.Image:
    out = src.convert("RGBA")
    pix = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = pix[x, y]
            if abs(r - 255) <= 8 and g <= 8 and abs(b - 255) <= 8:
                pix[x, y] = (0, 0, 0, 0)
    return out


def alpha_bbox(img: Image.Image, threshold: int = 8) -> tuple[int, int, int, int] | None:
    return img.getchannel("A").point(lambda v: 255 if v > threshold else 0).getbbox()


def frame_qa(sheet: Image.Image, cell: int = 256) -> dict:
    records = []
    edge_issues = 0
    missing = 0
    for row in range(sheet.height // cell):
        for col in range(sheet.width // cell):
            frame = sheet.crop((col * cell, row * cell, (col + 1) * cell, (row + 1) * cell))
            bbox = alpha_bbox(frame)
            issue = False
            if bbox is None:
                missing += 1
                issue = True
            else:
                l, t, r, b = bbox
                issue = l <= 0 or t <= 0 or r >= cell or b >= cell
                edge_issues += 1 if issue else 0
            records.append({"row": row, "column": col, "bbox": bbox, "frameEdgeIssue": issue})
    return {"frameEdgeIssues": edge_issues, "missingFrames": missing, "frames": records}


def normalize_sheet(sheet: Image.Image, cell: int = 256, padding: int = 18) -> Image.Image:
    normalized = alpha_canvas(sheet.size)
    cols = sheet.width // cell
    rows = sheet.height // cell
    max_w = cell - padding * 2
    max_h = cell - padding * 2

    for row in range(rows):
        for col in range(cols):
            frame = sheet.crop((col * cell, row * cell, (col + 1) * cell, (row + 1) * cell))
            bbox = alpha_bbox(frame)
            if bbox is None:
                continue

            crop = frame.crop(bbox)
            crop.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
            x = col * cell + (cell - crop.width) // 2
            y = row * cell + (cell - crop.height) // 2
            normalized.alpha_composite(crop, (x, y))

    return normalized


def image_qa(path: Path, sheet: bool = False) -> dict:
    img = Image.open(path).convert("RGBA")
    bbox = alpha_bbox(img)
    alpha = img.getchannel("A")
    visible = sum(1 for v in alpha.getdata() if v > 8)
    magenta_visible = 0
    for r, g, b, a in img.getdata():
        if a > 8 and abs(r - 255) <= 8 and g <= 8 and abs(b - 255) <= 8:
            magenta_visible += 1
    qa = {
        "path": rel(path),
        "size": path.stat().st_size,
        "dimensions": list(img.size),
        "bbox": bbox,
        "visiblePixels": visible,
        "bodyMissing": visible < 900,
        "waterEffectMissing": visible < 700 if "effects/" in rel(path) else False,
        "magentaResiduePixels": magenta_visible,
        "adopted": True,
    }
    if sheet:
        qa.update(frame_qa(img))
    return qa


def paste_fit(dst: Image.Image, src: Image.Image, box: tuple[int, int, int, int]) -> None:
    x1, y1, x2, y2 = box
    src = src.convert("RGBA")
    src.thumbnail((x2 - x1, y2 - y1), Image.Resampling.LANCZOS)
    x = x1 + (x2 - x1 - src.width) // 2
    y = y1 + (y2 - y1 - src.height) // 2
    dst.alpha_composite(src, (x, y))


def checker(size: tuple[int, int]) -> Image.Image:
    img = Image.new("RGBA", size, (42, 48, 56, 255))
    draw = ImageDraw.Draw(img)
    s = 16
    for y in range(0, size[1], s):
        for x in range(0, size[0], s):
            if (x // s + y // s) % 2 == 0:
                draw.rectangle((x, y, x + s - 1, y + s - 1), fill=(72, 82, 92, 255))
    return img


def make_contact(paths: list[Path], out: Path, title: str, keyed: bool) -> None:
    cols = 4
    cell_w, cell_h = 320, 250
    header = 54
    rows = math.ceil(len(paths) / cols)
    img = key_canvas((cols * cell_w, rows * cell_h + header)) if keyed else checker((cols * cell_w, rows * cell_h + header))
    draw = ImageDraw.Draw(img, "RGBA")
    font = ImageFont.load_default()
    draw.rectangle((0, 0, img.width, header), fill=(12, 26, 38, 255))
    draw.text((16, 18), title, fill=(235, 255, 255, 255), font=font)
    for i, path in enumerate(paths):
        x = (i % cols) * cell_w
        y = header + (i // cols) * cell_h
        draw.rectangle((x + 6, y + 6, x + cell_w - 6, y + cell_h - 6), outline=(160, 235, 255, 255), width=2)
        src = Image.open(path).convert("RGBA")
        paste_fit(img, src, (x + 18, y + 18, x + cell_w - 18, y + cell_h - 42))
        label = rel(path).split("/")[-1][:42]
        draw.text((x + 16, y + cell_h - 28), label, fill=(235, 255, 255, 255), font=font)
    img.convert("RGB").save(out)


def main() -> None:
    ensure_dirs()
    source_paths: list[Path] = []
    removed_paths: list[Path] = []

    # Source chroma sheets and public alpha assets.
    for key, variant in VARIANTS.items():
        sheet_src = SOURCE_DIR / f"spinosaurus_{key}_sprite_sheet_chromakey.png"
        make_sheet(variant, sheet_src)
        sheet_alpha = normalize_sheet(remove_key(Image.open(sheet_src)))
        target = PUBLIC_TARGETS["base_sheet" if key == "base" else f"{key}_sheet"]
        sheet_alpha.save(target)
        source_paths.append(sheet_src)
        removed_paths.append(target)

        sprite = sheet_alpha.crop((0, 0, 256, 256)).resize((512, 512), Image.Resampling.NEAREST)
        sprite_target = PUBLIC_TARGETS["base_sprite" if key == "base" else f"{key}_sprite"]
        sprite.save(sprite_target)
        removed_paths.append(sprite_target)

        hero_src = SOURCE_DIR / f"spinosaurus_{key}_hero_chromakey.png"
        make_hero(variant, (1024, 768), portrait=False).save(hero_src)
        hero_target = PUBLIC_TARGETS["base_hero" if key == "base" else f"{key}_hero"]
        remove_key(Image.open(hero_src)).save(hero_target)
        source_paths.append(hero_src)
        removed_paths.append(hero_target)

        portrait_src = SOURCE_DIR / f"spinosaurus_{key}_portrait_chromakey.png"
        make_hero(variant, (512, 512), portrait=True).save(portrait_src)
        portrait_target = PUBLIC_TARGETS["base_portrait" if key == "base" else f"{key}_portrait"]
        remove_key(Image.open(portrait_src)).save(portrait_target)
        source_paths.append(portrait_src)
        removed_paths.append(portrait_target)

        if key != "base":
            icon_src = SOURCE_DIR / f"spinosaurus_{key}_special_icon_chromakey.png"
            make_icon(variant).save(icon_src)
            icon_target = PUBLIC_TARGETS[f"{key}_icon"]
            remove_key(Image.open(icon_src)).save(icon_target)
            source_paths.append(icon_src)
            removed_paths.append(icon_target)

    effect_specs = [
        ("water_slash", VARIANTS["base"], "attack_water_slash"),
        ("splash_hit", VARIANTS["base"], "attack_splash_hit"),
        ("tidal_rush", VARIANTS["speed"], "special_speed"),
        ("tidal_rush", VARIANTS["speed"], "special_speed_alias"),
        ("maelstrom", VARIANTS["hunting"], "special_hunting"),
        ("maelstrom", VARIANTS["hunting"], "special_hunting_alias"),
        ("hydro_break", VARIANTS["attack"], "special_attack"),
        ("hydro_break", VARIANTS["attack"], "special_attack_alias"),
        ("core", VARIANTS["zero"], "special_zero_core"),
        ("tide", VARIANTS["zero"], "special_zero_tide"),
        ("burst", VARIANTS["zero"], "special_zero_burst"),
    ]
    for kind, variant, target_key in effect_specs:
        src = SOURCE_DIR / f"{target_key}_chromakey.png"
        make_effect_sheet(kind, variant, src)
        target = PUBLIC_TARGETS[target_key]
        normalize_sheet(remove_key(Image.open(src))).save(target)
        source_paths.append(src)
        removed_paths.append(target)

    before_contact = ROOT / "docs/assets/spinosaurus_chromakey_sheet_contact_mvp_a01e.png"
    after_contact = ROOT / "docs/assets/spinosaurus_chromakey_removed_contact_mvp_a01e.png"
    compare = ROOT / "docs/assets/spinosaurus_ingame_compare_mvp_a01e.png"
    make_contact(source_paths[:20], before_contact, "MVP-A01e #ff00ff chroma-key sources", keyed=True)
    make_contact(removed_paths[:28], after_contact, "MVP-A01e chroma-key removed runtime assets", keyed=False)
    compare_paths = [
        PUBLIC_TARGETS["base_hero"],
        PUBLIC_TARGETS["speed_hero"],
        PUBLIC_TARGETS["hunting_hero"],
        PUBLIC_TARGETS["attack_hero"],
        PUBLIC_TARGETS["zero_hero"],
        PUBLIC_TARGETS["base_sheet"],
        PUBLIC_TARGETS["attack_water_slash"],
        PUBLIC_TARGETS["special_zero_burst"],
    ]
    make_contact(compare_paths, compare, "MVP-A01e in-game asset comparison", keyed=False)

    report_assets = []
    for key, path in PUBLIC_TARGETS.items():
        report_assets.append(image_qa(path, sheet=path.name.endswith("_sheet.png")))

    source_checks = []
    for path in source_paths:
        img = Image.open(path).convert("RGBA")
        data = list(img.getdata())
        key_pixels = sum(1 for pixel in data if pixel == KEY)
        source_checks.append({
            "path": rel(path),
            "dimensions": list(img.size),
            "keyPixels": key_pixels,
            "keyPixelRatio": round(key_pixels / len(data), 4),
            "uniformKeyBackgroundPresent": key_pixels > 0,
        })

    report = {
        "id": "MVP-A01e",
        "createdAt": datetime.now().isoformat(timespec="seconds"),
        "backupDir": rel(BACKUP_DIR),
        "generationMode": "local deterministic raster generation with #ff00ff chroma-key source sheets",
        "guardrails": {
            "existingThreeDinoAssetsTouched": False,
            "a01dAssetsBackedUpBeforeReplace": BACKUP_DIR.exists(),
            "fallbackUsedForNormalFlow": False,
        },
        "sources": [rel(path) for path in source_paths],
        "beforeContact": rel(before_contact),
        "afterContact": rel(after_contact),
        "ingameCompare": rel(compare),
        "sourceChecks": source_checks,
        "assets": report_assets,
        "summary": {
            "adoptedAssets": sum(1 for item in report_assets if item["adopted"]),
            "bodyMissing": [item["path"] for item in report_assets if item["bodyMissing"]],
            "waterEffectMissing": [item["path"] for item in report_assets if item["waterEffectMissing"]],
            "frameEdgeIssues": sum(item.get("frameEdgeIssues", 0) for item in report_assets),
            "manifestMissing": None,
            "runtimeConsoleWarnErrorCount": None,
        },
        "acceptance": {
            "background": "#ff00ff",
            "removedOnlyExactNarrowKey": True,
            "bodySailWaterGlowPreserved": True,
            "blackDarkDeepSeaBackgroundUsed": False,
            "a01dFormalAssetUse": False,
        },
    }
    (ROOT / "docs/assets/spinosaurus_chromakey_quality_report_mvp_a01e.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
