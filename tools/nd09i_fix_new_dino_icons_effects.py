from __future__ import annotations

import json
import math
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
DOC_ASSETS = ROOT / "docs" / "assets"
BACKUP_DIR = DOC_ASSETS / "nd09i_before"
GENERATED_ICON_SOURCE_DIR = DOC_ASSETS / "nd09i_generated_icon_sources"

DINO_IDS = (
    "ankylosaurus",
    "parasaurolophus",
    "stegosaurus",
    "pteranodon",
    "compsognathus",
    "ornithomimus",
)
TAGS = ("speed", "hunting", "attack", "zero")

TAG_COLORS = {
    "speed": (36, 226, 255),
    "hunting": (255, 201, 77),
    "attack": (255, 77, 56),
    "zero": (170, 94, 255),
}

DINO_MEMO = {
    "ankylosaurus": "armor and tail-club silhouette",
    "parasaurolophus": "crest sonic silhouette",
    "stegosaurus": "plate-backed silhouette",
    "pteranodon": "winged pterosaur silhouette",
    "compsognathus": "small pack theropod silhouette",
    "ornithomimus": "long-legged sprint silhouette",
}


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int] | None:
    return image.getchannel("A").getbbox()


def paste_contained(canvas: Image.Image, subject: Image.Image, box: tuple[int, int, int, int]) -> tuple[int, int, int, int] | None:
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


def draw_icon_frame(draw: ImageDraw.ImageDraw, tag: str) -> None:
    color = TAG_COLORS[tag]
    draw.rounded_rectangle((5, 5, 123, 123), radius=24, fill=(4, 9, 13, 235), outline=(*color, 230), width=3)
    draw.rounded_rectangle((12, 12, 116, 116), radius=18, outline=(210, 255, 245, 65), width=1)
    if tag == "speed":
        for offset in (0, 15, 30):
            draw.line((18 + offset, 96 - offset * 0.5, 58 + offset, 74 - offset * 0.35), fill=(*color, 180), width=3)
    elif tag == "hunting":
        draw.ellipse((78, 16, 112, 50), outline=(*color, 170), width=2)
        draw.line((95, 12, 95, 54), fill=(*color, 120), width=1)
        draw.line((74, 33, 116, 33), fill=(*color, 120), width=1)
    elif tag == "attack":
        for radius in (18, 28, 38):
            draw.arc((64 - radius, 84 - radius, 64 + radius, 84 + radius), 205, 330, fill=(*color, 155), width=3)
    elif tag == "zero":
        points = [(96, 16), (113, 45), (99, 78), (78, 49)]
        draw.polygon(points, outline=(*color, 190), fill=(50, 12, 70, 130))


def is_chroma(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, alpha = pixel
    return alpha > 0 and green > 210 and red < 70 and blue < 70


def crop_generated_icon_cell(sheet: Image.Image, index: int) -> Image.Image:
    half_w = sheet.width // 2
    half_h = sheet.height // 2
    col = index % 2
    row = index // 2
    quadrant = sheet.crop((col * half_w, row * half_h, (col + 1) * half_w, (row + 1) * half_h)).convert("RGBA")
    pixels = quadrant.load()
    xs = []
    ys = []
    for y in range(quadrant.height):
        for x in range(quadrant.width):
            pixel = pixels[x, y]
            if pixel[3] > 0 and not is_chroma(pixel):
                xs.append(x)
                ys.append(y)
    if not xs:
        return quadrant.resize((128, 128), Image.Resampling.LANCZOS)
    pad = 8
    left = max(0, min(xs) - pad)
    top = max(0, min(ys) - pad)
    right = min(quadrant.width, max(xs) + 1 + pad)
    bottom = min(quadrant.height, max(ys) + 1 + pad)
    icon = quadrant.crop((left, top, right, bottom))
    return icon.resize((128, 128), Image.Resampling.LANCZOS)


def make_special_icon(dino_id: str, tag: str) -> dict:
    portrait_path = ROOT / "public" / "assets" / "dinos" / "evolutions" / "portraits" / f"{dino_id}_{tag}_portrait.png"
    effect_path = ROOT / "public" / "assets" / "effects" / "specials" / "new_dinos" / f"special_{dino_id}_{tag}_ultimate.png"
    output_path = ROOT / "public" / "assets" / "ui" / "hud" / "special_icons" / f"special_{tag}_{dino_id}.png"
    backup_path = BACKUP_DIR / output_path.name
    backup_path.parent.mkdir(parents=True, exist_ok=True)
    if output_path.exists() and not backup_path.exists():
        shutil.copy2(output_path, backup_path)

    generated_sheet = GENERATED_ICON_SOURCE_DIR / f"{dino_id}_ultimate_icon_sheet.png"
    if generated_sheet.exists():
        sheet = Image.open(generated_sheet).convert("RGBA")
        tag_index = TAGS.index(tag)
        canvas = crop_generated_icon_cell(sheet, tag_index)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        canvas.save(output_path)
        bbox = alpha_bbox(canvas)
        margins = None
        if bbox:
            left, top, right, bottom = bbox
            margins = {"left": left, "top": top, "right": 128 - right, "bottom": 128 - bottom}
        return {
            "id": f"{dino_id}_{tag}",
            "path": str(output_path.relative_to(ROOT)).replace("\\", "/"),
            "source": str(generated_sheet.relative_to(ROOT)).replace("\\", "/"),
            "sourceType": "built-in image generation sheet",
            "memo": f"dedicated generated ultimate icon, {DINO_MEMO[dino_id]}, {tag} branch",
            "bbox": bbox,
            "margins": margins,
        }

    canvas = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    color = TAG_COLORS[tag]
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((5, 5, 123, 123), radius=24, fill=(4, 9, 13, 235))
    glow = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((12, 12, 116, 116), fill=(*color, 75))
    canvas.alpha_composite(glow.filter(ImageFilter.GaussianBlur(14)))

    if effect_path.exists():
        effect = Image.open(effect_path).convert("RGBA")
        effect_layer = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
        paste_contained(effect_layer, effect, (8, 32, 120, 120))
        effect_layer.putalpha(effect_layer.getchannel("A").point(lambda value: round(value * 0.55)))
        canvas.alpha_composite(effect_layer)

    if portrait_path.exists():
        portrait = Image.open(portrait_path).convert("RGBA")
        subject_layer = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
        paste_contained(subject_layer, portrait, (13, 10, 115, 108))
        subject_glow = subject_layer.filter(ImageFilter.GaussianBlur(2))
        subject_glow.putalpha(subject_glow.getchannel("A").point(lambda value: round(value * 0.8)))
        tint = Image.new("RGBA", (128, 128), (*color, 0))
        tint.putalpha(subject_glow.getchannel("A").point(lambda value: round(value * 0.55)))
        canvas.alpha_composite(tint)
        canvas.alpha_composite(subject_layer)

    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((5, 5, 123, 123), radius=24, outline=(*color, 230), width=3)
    draw.rounded_rectangle((12, 12, 116, 116), radius=18, outline=(210, 255, 245, 65), width=1)
    if tag == "speed":
        for offset in (0, 15, 30):
            draw.line((18 + offset, 96 - offset * 0.5, 58 + offset, 74 - offset * 0.35), fill=(*color, 145), width=2)
    elif tag == "hunting":
        draw.ellipse((78, 16, 112, 50), outline=(*color, 145), width=2)
        draw.line((95, 12, 95, 54), fill=(*color, 105), width=1)
        draw.line((74, 33, 116, 33), fill=(*color, 105), width=1)
    elif tag == "attack":
        for radius in (18, 28, 38):
            draw.arc((64 - radius, 84 - radius, 64 + radius, 84 + radius), 205, 330, fill=(*color, 135), width=2)
    elif tag == "zero":
        points = [(96, 16), (113, 45), (99, 78), (78, 49)]
        draw.polygon(points, outline=(*color, 160), fill=(50, 12, 70, 60))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output_path)
    bbox = alpha_bbox(canvas)
    margins = None
    if bbox:
        left, top, right, bottom = bbox
        margins = {"left": left, "top": top, "right": 128 - right, "bottom": 128 - bottom}

    return {
        "id": f"{dino_id}_{tag}",
        "path": str(output_path.relative_to(ROOT)).replace("\\", "/"),
        "portraitSource": str(portrait_path.relative_to(ROOT)).replace("\\", "/"),
        "effectSource": str(effect_path.relative_to(ROOT)).replace("\\", "/"),
        "memo": f"{DINO_MEMO[dino_id]}, {tag} branch visual language",
        "bbox": bbox,
        "margins": margins,
    }


def relayout_effect(path: Path, target_width: int, target_height: int, min_margin: int = 32) -> dict:
    original = Image.open(path).convert("RGBA")
    backup_path = BACKUP_DIR / path.name
    backup_path.parent.mkdir(parents=True, exist_ok=True)
    if not backup_path.exists():
        shutil.copy2(path, backup_path)

    bbox = alpha_bbox(original)
    if not bbox:
        return {"path": str(path.relative_to(ROOT)).replace("\\", "/"), "missing": True}

    visible = original.crop(bbox)
    scale = min(target_width / visible.width, target_height / visible.height)
    size = (max(1, round(visible.width * scale)), max(1, round(visible.height * scale)))
    visible = visible.resize(size, Image.Resampling.LANCZOS)
    output = Image.new("RGBA", original.size, (0, 0, 0, 0))
    x = round((original.width - size[0]) / 2)
    y = round((original.height - size[1]) / 2)
    x = max(min_margin, min(original.width - size[0] - min_margin, x))
    y = max(min_margin, min(original.height - size[1] - min_margin, y))
    output.alpha_composite(visible, (x, y))
    output.save(path)

    final_bbox = alpha_bbox(output)
    left, top, right, bottom = final_bbox
    margins = {"left": left, "top": top, "right": output.width - right, "bottom": output.height - bottom}
    return {
        "path": str(path.relative_to(ROOT)).replace("\\", "/"),
        "sourceBbox": bbox,
        "finalBbox": final_bbox,
        "margins": margins,
        "minMargin": min(margins.values()),
        "scale": round(scale, 3),
    }


def make_contact(paths: list[Path], output_path: Path, title: str, cell: int = 128) -> None:
    columns = 8
    label_h = 22
    gap = 8
    rows = math.ceil(len(paths) / columns)
    canvas = Image.new("RGBA", (columns * cell + (columns - 1) * gap, rows * (cell + label_h + gap) + 28), (7, 9, 12, 255))
    draw = ImageDraw.Draw(canvas)
    draw.text((8, 7), title, fill=(220, 255, 245, 255))
    for index, path in enumerate(paths):
        row = index // columns
        col = index % columns
        x = col * (cell + gap)
        y = 28 + row * (cell + label_h + gap)
        image = Image.open(path).convert("RGBA").resize((cell, cell), Image.Resampling.LANCZOS)
        canvas.alpha_composite(image, (x, y + label_h))
        draw.text((x + 2, y + 2), path.stem.replace("special_", "").replace("_portrait", "")[:20], fill=(210, 235, 230, 255))
        draw.rectangle((x, y + label_h, x + cell - 1, y + label_h + cell - 1), outline=(255, 255, 255, 90), width=1)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(output_path)


def make_effect_contact(paths: list[Path], output_path: Path) -> None:
    cell_w = 192
    cell_h = 128
    label_h = 24
    columns = 4
    rows = math.ceil(len(paths) / columns)
    canvas = Image.new("RGBA", (columns * cell_w, rows * (cell_h + label_h) + 28), (7, 9, 12, 255))
    draw = ImageDraw.Draw(canvas)
    draw.text((8, 7), "ND09i ornithomimus sprint impact after", fill=(220, 255, 245, 255))
    for index, path in enumerate(paths):
        row = index // columns
        col = index % columns
        x = col * cell_w
        y = 28 + row * (cell_h + label_h)
        image = Image.open(path).convert("RGBA")
        image.thumbnail((cell_w, cell_h), Image.Resampling.LANCZOS)
        canvas.alpha_composite(image, (x + (cell_w - image.width) // 2, y + label_h + (cell_h - image.height) // 2))
        draw.text((x + 2, y + 2), path.stem[:28], fill=(210, 235, 230, 255))
        draw.rectangle((x, y + label_h, x + cell_w - 1, y + label_h + cell_h - 1), outline=(255, 255, 255, 90), width=1)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(output_path)


def main() -> None:
    icon_results = []
    icon_paths = []
    portrait_paths = []
    for dino_id in DINO_IDS:
        for tag in TAGS:
            icon_results.append(make_special_icon(dino_id, tag))
            icon_paths.append(ROOT / "public" / "assets" / "ui" / "hud" / "special_icons" / f"special_{tag}_{dino_id}.png")
            portrait_paths.append(ROOT / "public" / "assets" / "dinos" / "evolutions" / "portraits" / f"{dino_id}_{tag}_portrait.png")

    effect_paths = [
        ROOT / "public" / "assets" / "effects" / "attacks" / "ornithomimus_sprint_kick.png",
        *sorted((ROOT / "public" / "assets" / "effects" / "attacks" / "evolutions").glob("ornithomimus_*_attack.png")),
        *sorted((ROOT / "public" / "assets" / "effects" / "specials" / "new_dinos").glob("special_ornithomimus_*_ultimate.png")),
    ]
    effect_results = []
    for path in effect_paths:
        if path.name == "ornithomimus_sprint_kick.png":
            effect_results.append(relayout_effect(path, 420, 160, 40))
        elif path.parent.name == "evolutions":
            effect_results.append(relayout_effect(path, 240, 124, 32))
        else:
            effect_results.append(relayout_effect(path, 330, 188, 32))

    make_contact(portrait_paths, DOC_ASSETS / "nd09i_evolution_icon_contact.png", "ND09i evolution portrait icons")
    make_contact(icon_paths, DOC_ASSETS / "nd09i_ultimate_icon_contact.png", "ND09i dedicated ultimate icons")
    make_effect_contact(effect_paths, DOC_ASSETS / "nd09i_sprint_impact_contact.png")

    ultimate_effects = []
    for dino_id in DINO_IDS:
        for tag in TAGS:
            path = ROOT / "public" / "assets" / "effects" / "specials" / "new_dinos" / f"special_{dino_id}_{tag}_ultimate.png"
            bbox = alpha_bbox(Image.open(path).convert("RGBA")) if path.exists() else None
            ultimate_effects.append({
                "id": f"{dino_id}_{tag}",
                "path": str(path.relative_to(ROOT)).replace("\\", "/"),
                "exists": path.exists(),
                "sourceType": "ND09b dedicated generated VFX asset",
                "bbox": bbox,
            })

    report = {
        "phase": "ND09i",
        "evolutionPresentationFix": {
            "cause": "EvolutionSequence had a static portrait preload map for old dinos only; tag fallback could show velociraptor portraits for new-dino branches.",
            "fix": "Runtime now loads selectedEvolution.portraitPath dynamically and prefers it before id/tag fallback.",
        },
        "icons": icon_results,
        "ultimateEffects": ultimate_effects,
        "sprintImpactEffects": effect_results,
    }
    (DOC_ASSETS / "nd09i_asset_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
