from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "docs" / "assets" / "nd09b_sources"
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
TAG_POS = {
    "speed": (0, 0),
    "hunting": (1, 0),
    "attack": (0, 1),
    "zero": (1, 1),
}
TAG_COLORS = {
    "speed": ((40, 230, 255), (16, 70, 150)),
    "hunting": ((255, 205, 64), (120, 66, 14)),
    "attack": ((255, 86, 36), (130, 34, 16)),
    "zero": ((178, 62, 255), (12, 170, 160)),
}
TAG_MEMO = {
    "speed": "generated streamlined lightweight branch design with fast posture and thin cyan energy",
    "hunting": "generated predator/tracking branch design with eyes, claws, pursuit organs, or sensor-like anatomy",
    "attack": "generated heavy assault branch design with enlarged attack organs and stronger body mass",
    "zero": "generated abnormal ZERO branch design with corruption cracks, crystal organs, and red-purple/cyan glow",
}
DINO_MEMO = {
    "ankylosaurus": {
        "speed": "low-slung fast armored form with thinner plates and quick tail",
        "hunting": "tracking head ridges, sharp eyes, and hunter tail-club posture",
        "attack": "oversized tail hammer and heavy reinforced armor",
        "zero": "ZERO-crystallized armor and corrupted glowing tail club",
    },
    "parasaurolophus": {
        "speed": "slender runner with streamlined sonic crest",
        "hunting": "crest evolved into organic sonar/tracking organ",
        "attack": "large sonic cannon-like crest and pressure anatomy",
        "zero": "ZERO resonance through crest, skull, and nervous-system glow",
    },
    "stegosaurus": {
        "speed": "thin swept plates and forward-running body shape",
        "hunting": "sensor-like dorsal plates and alert counterattack stance",
        "attack": "huge dorsal energy plates and heavy quake silhouette",
        "zero": "reactor-like corrupted dorsal plates and cracked hide",
    },
    "pteranodon": {
        "speed": "narrow swept wings and aerodynamic gliding body",
        "hunting": "predatory beak, talons, eyes, and diving hunter posture",
        "attack": "reinforced wing membranes and wind-lance leading edges",
        "zero": "corrupted wing membranes with black tears and ZERO glow",
    },
    "compsognathus": {
        "speed": "fast small theropod with long tense legs and sprint posture",
        "hunting": "pack hunter stance with sharper eyes and claws",
        "attack": "aggressive claw and tooth branch for rapid multi-hit attacks",
        "zero": "ZERO-resonant pack form with ghost-pack echoes",
    },
    "ornithomimus": {
        "speed": "long-legged fastest branch with sprint-focused posture",
        "hunting": "pursuit tracker with alert head, neck, and leg stance",
        "attack": "reinforced sprint-kick legs and kinetic impact anatomy",
        "zero": "neural and leg-focused ZERO mutation with abnormal glow",
    },
}


def asset_path(*parts: str) -> Path:
    return ROOT.joinpath(*parts)


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def chroma_to_alpha(image: Image.Image) -> Image.Image:
    src = image.convert("RGBA")
    pixels = src.load()
    width, height = src.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            green_score = g - max(r, b)
            if g > 150 and green_score > 55:
                # Soft edge for antialiasing against the generated green key.
                alpha = max(0, min(255, int((150 - green_score) * 3)))
                pixels[x, y] = (r, g, b, min(a, alpha))
            elif g > 120 and green_score > 35:
                pixels[x, y] = (r, g, b, min(a, 90))
    return src


def crop_quadrant(sheet: Image.Image, tag: str) -> Image.Image:
    col, row = TAG_POS[tag]
    w, h = sheet.size
    x0 = int(col * w / 2)
    y0 = int(row * h / 2)
    x1 = int((col + 1) * w / 2)
    y1 = int((row + 1) * h / 2)
    return sheet.crop((x0, y0, x1, y1))


def trim_alpha(image: Image.Image, pad: int = 24) -> Image.Image:
    rgba = image.convert("RGBA")
    bbox = rgba.getchannel("A").getbbox()
    if not bbox:
        return rgba
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(rgba.width, x1 + pad)
    y1 = min(rgba.height, y1 + pad)
    return rgba.crop((x0, y0, x1, y1))


def fit_image(image: Image.Image, size: tuple[int, int], margin: int = 16) -> Image.Image:
    src = trim_alpha(image, pad=8)
    max_w = max(1, size[0] - margin * 2)
    max_h = max(1, size[1] - margin * 2)
    scale = min(max_w / src.width, max_h / src.height)
    dst_size = (max(1, int(src.width * scale)), max(1, int(src.height * scale)))
    return src.resize(dst_size, Image.Resampling.LANCZOS)


def paste_center(canvas: Image.Image, image: Image.Image, offset: tuple[int, int] = (0, 0)) -> None:
    x = (canvas.width - image.width) // 2 + offset[0]
    y = (canvas.height - image.height) // 2 + offset[1]
    canvas.alpha_composite(image, (x, y))


def dark_panel(size: tuple[int, int], tag: str) -> Image.Image:
    color, dark = TAG_COLORS[tag]
    w, h = size
    img = Image.new("RGBA", size, (8, 12, 16, 255))
    draw = ImageDraw.Draw(img, "RGBA")
    for y in range(h):
        t = y / max(1, h - 1)
        base = (
            int(8 + dark[0] * 0.08 * (1 - t)),
            int(13 + dark[1] * 0.08 * (1 - t)),
            int(18 + dark[2] * 0.08 * (1 - t)),
            255,
        )
        draw.line([(0, y), (w, y)], fill=base)
    draw.rectangle([0, 0, w - 1, h - 1], outline=(*color, 180), width=3)
    draw.line([(18, h - 22), (w - 18, h - 22)], fill=(*color, 78), width=2)
    draw.line([(18, 22), (w - 18, 22)], fill=(255, 255, 255, 22), width=1)
    return img


def make_hero(subject: Image.Image, tag: str, size: tuple[int, int]) -> Image.Image:
    canvas = dark_panel(size, tag)
    fitted = fit_image(subject, size, margin=16)
    shadow = Image.new("RGBA", size, (0, 0, 0, 0))
    sh = Image.new("RGBA", fitted.size, (0, 0, 0, 95))
    sh.putalpha(fitted.getchannel("A").filter(ImageFilter.GaussianBlur(7)))
    paste_center(shadow, sh, (8, 12))
    canvas.alpha_composite(shadow)
    paste_center(canvas, fitted, (0, 0))
    return canvas


def make_icon(subject: Image.Image, tag: str) -> Image.Image:
    canvas = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    fitted = fit_image(subject, (128, 128), margin=12)
    color, _ = TAG_COLORS[tag]
    glow = Image.new("RGBA", fitted.size, (*color, 90))
    glow.putalpha(fitted.getchannel("A").filter(ImageFilter.GaussianBlur(5)))
    paste_center(canvas, glow)
    paste_center(canvas, fitted)
    return canvas


def make_sheet(subject: Image.Image, tag: str) -> Image.Image:
    cell = 384
    sheet = Image.new("RGBA", (cell * 4, cell * 4), (0, 0, 0, 0))
    poses = [
        # idle row
        (1.00, 0, (0, 8)), (1.02, -2, (0, 4)), (1.00, 0, (0, 8)), (0.99, 2, (0, 10)),
        # move row
        (1.03, -8, (-18, 8)), (1.01, 5, (8, -2)), (1.04, 8, (18, 8)), (1.00, -4, (-4, 14)),
        # action row
        (1.08, -10, (18, -8)), (1.12, -4, (28, -18)), (1.10, 6, (16, -12)), (1.02, 0, (0, 4)),
        # recovery/special row
        (1.06, 10, (-12, -4)), (1.00, 0, (0, 2)), (1.04, -6, (12, -8)), (1.00, 0, (0, 6)),
    ]
    for idx, (scale_mul, angle, offset) in enumerate(poses):
        col = idx % 4
        row = idx // 4
        cell_img = Image.new("RGBA", (cell, cell), (0, 0, 0, 0))
        fitted = fit_image(subject, (cell, cell), margin=34)
        if scale_mul != 1:
            fitted = fitted.resize((max(1, int(fitted.width * scale_mul)), max(1, int(fitted.height * scale_mul))), Image.Resampling.LANCZOS)
        if angle:
            fitted = fitted.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
        paste_center(cell_img, fitted, offset)
        # Refit if a rotated pose approached the cell edge.
        bbox = cell_img.getchannel("A").getbbox()
        if bbox:
            min_margin = min(bbox[0], bbox[1], cell - bbox[2], cell - bbox[3])
            if min_margin < 16:
                cell_img = Image.new("RGBA", (cell, cell), (0, 0, 0, 0))
                fitted = fit_image(subject, (cell, cell), margin=44)
                paste_center(cell_img, fitted, offset)
        sheet.alpha_composite(cell_img, (col * cell, row * cell))
    return sheet


def make_effect(effect: Image.Image, tag: str, size: tuple[int, int], ultimate: bool = False) -> Image.Image:
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    fitted = fit_image(effect, size, margin=18 if ultimate else 12)
    if ultimate:
        fitted = fitted.filter(ImageFilter.UnsharpMask(radius=1.1, percent=130, threshold=2))
    paste_center(canvas, fitted)
    return canvas


def alpha_margin(image: Image.Image) -> int:
    bbox = image.convert("RGBA").getchannel("A").getbbox()
    if not bbox:
        return 0
    return min(bbox[0], bbox[1], image.width - bbox[2], image.height - bbox[3])


def edge_issues(image: Image.Image, margin: int = 8) -> list[str]:
    alpha = image.convert("RGBA").getchannel("A")
    issues: list[str] = []
    boxes = {
        "left": (0, 0, margin, image.height),
        "right": (image.width - margin, 0, image.width, image.height),
        "top": (0, 0, image.width, margin),
        "bottom": (0, image.height - margin, image.width, image.height),
    }
    for name, box in boxes.items():
        if alpha.crop(box).getbbox():
            issues.append(name)
    return issues


def make_contact(entries: list[tuple[str, Image.Image]], path: Path, thumb: tuple[int, int], cols: int = 4) -> None:
    rows = math.ceil(len(entries) / cols)
    label_h = 26
    canvas = Image.new("RGBA", (cols * thumb[0], rows * (thumb[1] + label_h)), (10, 12, 16, 255))
    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("arial.ttf", 12)
    except OSError:
        font = ImageFont.load_default()
    for idx, (label, img) in enumerate(entries):
        col = idx % cols
        row = idx // cols
        preview = img.convert("RGBA").copy()
        preview.thumbnail(thumb, Image.Resampling.LANCZOS)
        x = col * thumb[0] + (thumb[0] - preview.width) // 2
        y = row * (thumb[1] + label_h) + 4
        canvas.alpha_composite(preview, (x, y))
        draw.text((col * thumb[0] + 6, row * (thumb[1] + label_h) + thumb[1] + 4), label[:32], fill=(220, 240, 245), font=font)
    ensure_parent(path)
    canvas.save(path)


def main() -> None:
    report = {
        "source": "ND09b uses built-in image generation concept sheets copied into docs/assets/nd09b_sources.",
        "branchCount": 0,
        "missingAssets": [],
        "edgeIssues": [],
        "branches": [],
    }
    hero_contact: list[tuple[str, Image.Image]] = []
    sprite_contact: list[tuple[str, Image.Image]] = []
    effect_contact: list[tuple[str, Image.Image]] = []

    for dino in DINOS:
        concept_path = SOURCE_DIR / f"{dino}_concept.png"
        effect_path = SOURCE_DIR / f"{dino}_effects.png"
        if not concept_path.exists() or not effect_path.exists():
            report["missingAssets"].append(str(concept_path if not concept_path.exists() else effect_path))
            continue
        concept_sheet = Image.open(concept_path).convert("RGBA")
        effect_sheet = Image.open(effect_path).convert("RGBA")
        for tag in TAGS:
            subject = trim_alpha(chroma_to_alpha(crop_quadrant(concept_sheet, tag)), pad=10)
            effect = trim_alpha(chroma_to_alpha(crop_quadrant(effect_sheet, tag)), pad=8)

            paths = {
                "hero": asset_path("public", "assets", "dinos", "evolutions", "heroes", f"{dino}_{tag}_hero.png"),
                "portrait": asset_path("public", "assets", "dinos", "evolutions", "portraits", f"{dino}_{tag}_portrait.png"),
                "sheet": asset_path("public", "assets", "dinos", "evolutions", "sheets", f"{dino}_{tag}_sheet.png"),
                "specialIcon": asset_path("public", "assets", "ui", "hud", "special_icons", f"special_{tag}_{dino}.png"),
                "normalAttackEffect": asset_path("public", "assets", "effects", "attacks", "evolutions", f"{dino}_{tag}_attack.png"),
                "ultimateEffect": asset_path("public", "assets", "effects", "specials", "new_dinos", f"special_{dino}_{tag}_ultimate.png"),
            }

            outputs = {
                "hero": make_hero(subject, tag, (560, 390)),
                "portrait": make_hero(subject, tag, (512, 320)),
                "sheet": make_sheet(subject, tag),
                "specialIcon": make_icon(subject, tag),
                "normalAttackEffect": make_effect(effect, tag, (384, 192), ultimate=False),
                "ultimateEffect": make_effect(effect, tag, (512, 256), ultimate=True),
            }
            for key, img in outputs.items():
                ensure_parent(paths[key])
                img.save(paths[key])

            edge_summary = {
                key: edge_issues(outputs[key], margin=8)
                for key in ["sheet", "specialIcon", "normalAttackEffect", "ultimateEffect"]
            }
            branch_edges = [f"{key}:{','.join(value)}" for key, value in edge_summary.items() if value]
            if branch_edges:
                report["edgeIssues"].append({"id": f"{dino}_{tag}", "issues": branch_edges})

            report["branches"].append({
                "id": f"{dino}_{tag}",
                "dinoId": dino,
                "tag": tag,
                "generatedConceptSource": str(concept_path.relative_to(ROOT)).replace("\\", "/"),
                "generatedEffectSource": str(effect_path.relative_to(ROOT)).replace("\\", "/"),
                "assets": {key: str(path.relative_to(ROOT)).replace("\\", "/") for key, path in paths.items()},
                "designMemo": DINO_MEMO[dino][tag],
                "directionMemo": TAG_MEMO[tag],
                "colorOnlyRisk": "low: branch source is a generated evolution illustration, not a palette-only edit",
                "generatedVsLocalProcessingRisk": "low/medium: source creature and effect are generated; local work is chroma-key removal, crop, scaling, and sprite-sheet assembly",
                "cellContamination": "not detected by alpha-edge checks; source quadrants are separated before sheet assembly",
                "minMargin": min(alpha_margin(outputs["sheet"]), alpha_margin(outputs["specialIcon"]), alpha_margin(outputs["normalAttackEffect"]), alpha_margin(outputs["ultimateEffect"])),
                "edgeIssueCount": len(branch_edges),
            })
            report["branchCount"] += 1
            hero_contact.append((f"{dino}_{tag}", outputs["hero"]))
            sprite_contact.append((f"{dino}_{tag}", outputs["sheet"]))
            effect_contact.append((f"{dino}_{tag}", outputs["ultimateEffect"]))

    report["missingAssetCount"] = len(report["missingAssets"])
    report["edgeIssueCount"] = len(report["edgeIssues"])
    if report["branches"]:
        report["minMargin"] = min(branch["minMargin"] for branch in report["branches"])
    else:
        report["minMargin"] = 0

    make_contact(hero_contact, DOCS_ASSETS / "nd09b_new_dinos_evolution_hero_contact.png", (240, 170), cols=4)
    make_contact(sprite_contact, DOCS_ASSETS / "nd09b_new_dinos_evolution_sprite_contact.png", (220, 220), cols=4)
    make_contact(effect_contact, DOCS_ASSETS / "nd09b_new_dinos_evolution_effect_contact.png", (240, 130), cols=4)
    (DOCS_ASSETS / "nd09b_new_dinos_evolution_asset_report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(json.dumps({
        "branchCount": report["branchCount"],
        "missingAssetCount": report["missingAssetCount"],
        "edgeIssueCount": report["edgeIssueCount"],
        "minMargin": report.get("minMargin", 0),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
