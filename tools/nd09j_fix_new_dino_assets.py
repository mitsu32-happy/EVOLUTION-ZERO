from __future__ import annotations

import json
import math
import colorsys
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance


ROOT = Path(__file__).resolve().parents[1]
DOC_ASSETS = ROOT / "docs" / "assets"

DINO_IDS = (
    "ankylosaurus",
    "parasaurolophus",
    "stegosaurus",
    "pteranodon",
    "compsognathus",
    "ornithomimus",
)
TAGS = ("speed", "hunting", "attack", "zero")
NON_ZERO_TAGS = ("speed", "hunting", "attack")

TAG_COLORS = {
    "speed": (45, 222, 255),
    "hunting": (232, 190, 76),
    "attack": (236, 92, 42),
    "zero": (176, 70, 242),
}
TAG_HUES = {
    "speed": 0.52,
    "hunting": 0.12,
    "attack": 0.055,
}


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int] | None:
    return image.convert("RGBA").getchannel("A").getbbox()


def is_chroma(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, alpha = pixel
    return alpha > 0 and green > 165 and green > red * 1.45 and green > blue * 1.45


def remove_green_to_alpha(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, a = pixels[x, y]
            if is_chroma((r, g, b, a)):
                pixels[x, y] = (r, g, b, 0)
    return image


def paste_contained(canvas: Image.Image, subject: Image.Image, box: tuple[int, int, int, int]) -> tuple[int, int, int, int] | None:
    subject = subject.convert("RGBA")
    bbox = alpha_bbox(subject)
    if not bbox:
        return None
    subject = subject.crop(bbox)
    box_w = box[2] - box[0]
    box_h = box[3] - box[1]
    scale = min(box_w / subject.width, box_h / subject.height)
    size = (max(1, round(subject.width * scale)), max(1, round(subject.height * scale)))
    subject = subject.resize(size, Image.Resampling.LANCZOS)
    x = box[0] + round((box_w - size[0]) / 2)
    y = box[1] + round((box_h - size[1]) / 2)
    canvas.alpha_composite(subject, (x, y))
    return (x, y, x + size[0], y + size[1])


def crop_sheet_cell(sheet: Image.Image, tag: str) -> Image.Image:
    index = TAGS.index(tag)
    half_w = sheet.width // 2
    half_h = sheet.height // 2
    col = index % 2
    row = index // 2
    return sheet.crop((col * half_w, row * half_h, (col + 1) * half_w, (row + 1) * half_h)).convert("RGBA")


def replace_special_icons() -> list[dict]:
    results = []
    for dino_id in DINO_IDS:
        sheet_path = DOC_ASSETS / "nd09i_generated_icon_sources" / f"{dino_id}_ultimate_icon_sheet.png"
        sheet = Image.open(sheet_path).convert("RGBA")
        for tag in TAGS:
            cell = remove_green_to_alpha(crop_sheet_cell(sheet, tag))
            bbox = alpha_bbox(cell)
            if bbox:
                cell = cell.crop(bbox)
            output = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
            paste_contained(output, cell, (4, 4, 124, 124))
            output = remove_green_to_alpha(output)
            out_path = ROOT / "public" / "assets" / "ui" / "hud" / "special_icons" / f"special_{tag}_{dino_id}.png"
            output.save(out_path)
            final_bbox = alpha_bbox(output)
            results.append({
                "id": f"{dino_id}_{tag}",
                "path": str(out_path.relative_to(ROOT)).replace("\\", "/"),
                "source": str(sheet_path.relative_to(ROOT)).replace("\\", "/"),
                "greenBorderRemoved": True,
                "bbox": final_bbox,
            })
    return results


def replace_ultimate_effects() -> list[dict]:
    results = []
    for dino_id in DINO_IDS:
        sheet_path = DOC_ASSETS / "nd09j_generated_ultimate_effect_sources" / f"{dino_id}_ultimate_effect_sheet.png"
        sheet = Image.open(sheet_path).convert("RGBA")
        for tag in TAGS:
            cell = remove_green_to_alpha(crop_sheet_cell(sheet, tag))
            output = Image.new("RGBA", (512, 256), (0, 0, 0, 0))
            paste_contained(output, cell, (24, 20, 488, 236))
            out_path = ROOT / "public" / "assets" / "effects" / "specials" / "new_dinos" / f"special_{dino_id}_{tag}_ultimate.png"
            output.save(out_path)
            bbox = alpha_bbox(output)
            margins = None
            if bbox:
                left, top, right, bottom = bbox
                margins = {"left": left, "top": top, "right": output.width - right, "bottom": output.height - bottom}
            results.append({
                "id": f"{dino_id}_{tag}",
                "path": str(out_path.relative_to(ROOT)).replace("\\", "/"),
                "source": str(sheet_path.relative_to(ROOT)).replace("\\", "/"),
                "dedicatedGeneratedEffect": True,
                "bbox": bbox,
                "margins": margins,
                "minMargin": min(margins.values()) if margins else None,
            })
    return results


def recolor_branch_sprite(path: Path, tag: str) -> dict:
    image = Image.open(path).convert("RGBA")
    hue_target = TAG_HUES[tag]
    pixels = image.load()
    changed = 0
    purple_changed = 0
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            rf, gf, bf = r / 255, g / 255, b / 255
            hue, sat, val = colorsys.rgb_to_hsv(rf, gf, bf)
            zero_like = (0.58 <= hue <= 0.86 and sat > 0.16 and val > 0.12) or (hue > 0.86 and sat > 0.18 and val > 0.12)
            too_cyan_for_non_speed = tag != "speed" and (0.46 <= hue <= 0.58 and sat > 0.18 and val > 0.12)
            attack_needs_heat = tag == "attack" and sat > 0.22 and val > 0.15
            hunting_needs_gold = tag == "hunting" and zero_like
            if not (zero_like or too_cyan_for_non_speed or attack_needs_heat or hunting_needs_gold):
                continue
            new_sat = min(1.0, max(sat * 0.9, 0.35 if tag != "speed" else 0.32))
            new_val = min(1.0, val * 1.08)
            nr, ng, nb = colorsys.hsv_to_rgb(hue_target, new_sat, new_val)
            pixels[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), a)
            changed += 1
            if zero_like:
                purple_changed += 1

    if changed:
        image = ImageEnhance.Contrast(image).enhance(1.03)
        image.save(path)
    return {
        "path": str(path.relative_to(ROOT)).replace("\\", "/"),
        "tag": tag,
        "changedPixels": changed,
        "purpleChangedPixels": purple_changed,
    }


def recolor_non_zero_sprites() -> list[dict]:
    results = []
    for dino_id in DINO_IDS:
        for tag in NON_ZERO_TAGS:
            path = ROOT / "public" / "assets" / "dinos" / "evolutions" / "sheets" / f"{dino_id}_{tag}_sheet.png"
            results.append(recolor_branch_sprite(path, tag))
    return results


def make_contact_grid(paths: list[tuple[str, Path]], out_path: Path, title: str, columns: int = 8, cell: tuple[int, int] = (128, 128)) -> None:
    cell_w, cell_h = cell
    label_h = 24
    rows = math.ceil(len(paths) / columns)
    canvas = Image.new("RGBA", (columns * cell_w, rows * (cell_h + label_h) + 30), (7, 9, 12, 255))
    draw = ImageDraw.Draw(canvas)
    draw.text((8, 8), title, fill=(225, 255, 245, 255))
    for i, (label, path) in enumerate(paths):
        row = i // columns
        col = i % columns
        x = col * cell_w
        y = 30 + row * (cell_h + label_h)
        image = Image.open(path).convert("RGBA")
        image.thumbnail((cell_w - 8, cell_h - 8), Image.Resampling.LANCZOS)
        canvas.alpha_composite(image, (x + (cell_w - image.width) // 2, y + label_h + (cell_h - image.height) // 2))
        draw.text((x + 3, y + 3), label[:22], fill=(220, 240, 235, 255))
        draw.rectangle((x + 1, y + label_h, x + cell_w - 2, y + label_h + cell_h - 2), outline=(255, 255, 255, 70))
    out_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(out_path)


def make_sprite_audit_contact(out_path: Path) -> None:
    cell_w, cell_h = 180, 160
    label_h = 30
    columns = len(DINO_IDS)
    rows = len(NON_ZERO_TAGS)
    canvas = Image.new("RGBA", (columns * cell_w, rows * (cell_h + label_h) + 34), (7, 9, 12, 255))
    draw = ImageDraw.Draw(canvas)
    draw.text((8, 8), "ND09j non-zero evolution sprite audit after: idle/move/action first frames", fill=(230, 255, 245, 255))
    for ri, tag in enumerate(NON_ZERO_TAGS):
        for ci, dino_id in enumerate(DINO_IDS):
            path = ROOT / "public" / "assets" / "dinos" / "evolutions" / "sheets" / f"{dino_id}_{tag}_sheet.png"
            image = Image.open(path).convert("RGBA")
            cw = image.width // 4
            ch = image.height // 4
            strip = Image.new("RGBA", (cw * 3, ch), (0, 0, 0, 0))
            for row in range(3):
                strip.alpha_composite(image.crop((0, row * ch, cw, (row + 1) * ch)), (row * cw, 0))
            x = ci * cell_w
            y = 34 + ri * (cell_h + label_h)
            draw.text((x + 3, y), f"{dino_id}_{tag}"[:24], fill=(220, 240, 235, 255))
            paste_contained(canvas, strip, (x + 3, y + label_h, x + cell_w - 4, y + label_h + cell_h - 4))
            draw.rectangle((x + 1, y + label_h, x + cell_w - 2, y + label_h + cell_h - 2), outline=(255, 255, 255, 70))
    canvas.convert("RGB").save(out_path)


def make_crater_compare(out_path: Path) -> None:
    paths = [
        ("hero", ROOT / "public/assets/dinos/evolutions/heroes/ankylosaurus_attack_hero.png"),
        ("portrait", ROOT / "public/assets/dinos/evolutions/portraits/ankylosaurus_attack_portrait.png"),
        ("sprite sheet", ROOT / "public/assets/dinos/evolutions/sheets/ankylosaurus_attack_sheet.png"),
        ("zero sprite ref", ROOT / "public/assets/dinos/evolutions/sheets/ankylosaurus_zero_sheet.png"),
    ]
    canvas = Image.new("RGBA", (1200, 420), (7, 9, 12, 255))
    draw = ImageDraw.Draw(canvas)
    draw.text((8, 8), "ND09j crater ankylosaurus hero / portrait / sprite comparison", fill=(230, 255, 245, 255))
    for index, (label, path) in enumerate(paths):
        x = 20 + index * 290
        y = 48
        draw.text((x, y - 20), label, fill=(220, 240, 235, 255))
        image = Image.open(path).convert("RGBA")
        if "sheet" in label:
            cw = image.width // 4
            ch = image.height // 4
            strip = Image.new("RGBA", (cw, ch * 3), (0, 0, 0, 0))
            for row in range(3):
                strip.alpha_composite(image.crop((0, row * ch, cw, (row + 1) * ch)), (0, row * ch))
            image = strip
        paste_contained(canvas, image, (x, y, x + 260, y + 340))
        draw.rectangle((x, y, x + 260, y + 340), outline=(255, 255, 255, 90))
    canvas.convert("RGB").save(out_path)


def make_zero_contact(out_path: Path) -> None:
    canvas = Image.new("RGBA", (1200, 820), (7, 9, 12, 255))
    draw = ImageDraw.Draw(canvas)
    draw.text((8, 8), "ND09j ZERO quality contact: hero / sprite / ultimate icon / ultimate effect", fill=(230, 255, 245, 255))
    for index, dino_id in enumerate(DINO_IDS):
        row = index // 2
        col = index % 2
        x = 20 + col * 590
        y = 44 + row * 250
        draw.text((x, y), f"{dino_id}_zero", fill=(220, 240, 235, 255))
        items = [
            ROOT / f"public/assets/dinos/evolutions/heroes/{dino_id}_zero_hero.png",
            ROOT / f"public/assets/dinos/evolutions/sheets/{dino_id}_zero_sheet.png",
            ROOT / f"public/assets/ui/hud/special_icons/special_zero_{dino_id}.png",
            ROOT / f"public/assets/effects/specials/new_dinos/special_{dino_id}_zero_ultimate.png",
        ]
        boxes = [(x, y + 24, x + 170, y + 220), (x + 178, y + 24, x + 348, y + 220), (x + 356, y + 24, x + 456, y + 124), (x + 464, y + 24, x + 570, y + 124)]
        for path, box in zip(items, boxes):
            image = Image.open(path).convert("RGBA")
            if "sheets" in str(path):
                cw = image.width // 4
                ch = image.height // 4
                image = image.crop((0, 0, cw, ch))
            paste_contained(canvas, image, box)
            draw.rectangle(box, outline=(255, 255, 255, 70))
    canvas.convert("RGB").save(out_path)


def main() -> None:
    icon_results = replace_special_icons()
    effect_results = replace_ultimate_effects()
    sprite_results = recolor_non_zero_sprites()

    make_crater_compare(DOC_ASSETS / "nd09j_crater_ankylo_compare.png")
    make_sprite_audit_contact(DOC_ASSETS / "nd09j_non_zero_sprite_audit_contact.png")
    make_zero_contact(DOC_ASSETS / "nd09j_zero_quality_contact.png")

    icon_paths = []
    effect_paths = []
    for dino_id in DINO_IDS:
        for tag in TAGS:
            icon_paths.append((f"{tag}_{dino_id}", ROOT / "public/assets/ui/hud/special_icons" / f"special_{tag}_{dino_id}.png"))
            effect_paths.append((f"{dino_id}_{tag}", ROOT / "public/assets/effects/specials/new_dinos" / f"special_{dino_id}_{tag}_ultimate.png"))
    make_contact_grid(icon_paths, DOC_ASSETS / "nd09j_ultimate_icon_contact.png", "ND09j ultimate icons after green-frame removal", columns=8, cell=(128, 128))
    make_contact_grid(effect_paths, DOC_ASSETS / "nd09j_ultimate_effect_contact.png", "ND09j dedicated generated ultimate effects", columns=4, cell=(220, 132))

    report = {
        "phase": "ND09j",
        "craterAnkylosaurus": {
            "id": "ankylosaurus_attack",
            "evolutionName": "クレーターアンキロ",
            "result": "sprite sheet branch glow remapped from ZERO-like purple to attack/crater orange to align with hero and portrait",
        },
        "nonZeroSpriteAudit": sprite_results,
        "ultimateIcons": icon_results,
        "ultimateEffects": effect_results,
        "zeroQuality": "ZERO branch hero/sprite/icon/effect included in nd09j_zero_quality_contact.png; ZERO remains gated and data rules unchanged.",
    }
    (DOC_ASSETS / "nd09j_asset_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
