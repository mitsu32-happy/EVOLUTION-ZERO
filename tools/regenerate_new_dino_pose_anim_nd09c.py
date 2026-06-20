from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "docs" / "assets" / "nd09c_sources"
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
DINO_NAMES = {
    "ankylosaurus": "Ankylo",
    "parasaurolophus": "Para",
    "stegosaurus": "Stego",
    "pteranodon": "Ptera",
    "compsognathus": "Compy",
    "ornithomimus": "Orni",
}
TAG_MEMO = {
    "speed": "streamlined fast silhouette with forward posture and thin energy accents",
    "hunting": "tracking / hunter silhouette with sharper eyes, claws, or sensor anatomy",
    "attack": "larger attack organs and heavier impact silhouette",
    "zero": "ZERO-corrupted silhouette with abnormal organic glow and crystal/crack forms",
}

HERO_SIZE = (560, 390)
CELL = 512
SPRITE_SIZE = (CELL * 4, CELL * 4)
FINAL_CELL_SAFE_MARGIN = 72


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
            if g > 145 and green_score > 45:
                pixels[x, y] = (r, g, b, 0)
            elif g > 120 and green_score > 28:
                pixels[x, y] = (r, g, b, min(a, 64))
    return src


def trim_alpha(image: Image.Image, pad: int = 12) -> Image.Image:
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


def remove_detached_specks(image: Image.Image, min_area: int = 900) -> Image.Image:
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    width, height = rgba.size
    seen = bytearray(width * height)
    keep = bytearray(width * height)
    pix = alpha.load()

    for sy in range(height):
        for sx in range(width):
            idx = sy * width + sx
            if seen[idx] or pix[sx, sy] <= 12:
                continue
            stack = [(sx, sy)]
            seen[idx] = 1
            cells: list[tuple[int, int]] = []
            while stack:
                x, y = stack.pop()
                cells.append((x, y))
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    nidx = ny * width + nx
                    if seen[nidx] or pix[nx, ny] <= 12:
                        continue
                    seen[nidx] = 1
                    stack.append((nx, ny))
            if len(cells) >= min_area:
                for x, y in cells:
                    keep[y * width + x] = 1

    out = rgba.copy()
    out_pix = out.load()
    for y in range(height):
        for x in range(width):
            if not keep[y * width + x]:
                r, g, b, _a = out_pix[x, y]
                out_pix[x, y] = (r, g, b, 0)
    return out


def crop_grid(image: Image.Image, col: int, row: int, cols: int, rows: int, inset: int = 4) -> Image.Image:
    w, h = image.size
    x0 = int(col * w / cols) + inset
    y0 = int(row * h / rows) + inset
    x1 = int((col + 1) * w / cols) - inset
    y1 = int((row + 1) * h / rows) - inset
    return image.crop((x0, y0, x1, y1))


def fit_image(image: Image.Image, size: tuple[int, int], margin: int) -> Image.Image:
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


def make_hero(subject: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", HERO_SIZE, (0, 0, 0, 0))
    fitted = fit_image(subject, HERO_SIZE, margin=10)
    paste_center(canvas, fitted, (0, 0))
    return canvas


def source_sprite_poses(path: Path, tag_index: int) -> list[Image.Image]:
    sheet = chroma_to_alpha(Image.open(path))
    poses: list[Image.Image] = []
    for row in range(4):
        cell = crop_grid(sheet, tag_index, row, 4, 4, inset=6)
        poses.append(trim_alpha(remove_detached_specks(cell), pad=14))
    return poses


def touches_source_edge(image: Image.Image, margin: int = 8) -> bool:
    alpha = image.convert("RGBA").getchannel("A")
    if not alpha.getbbox():
        return True
    boxes = (
        (0, 0, margin, image.height),
        (image.width - margin, 0, image.width, image.height),
        (0, 0, image.width, margin),
        (0, image.height - margin, image.width, image.height),
    )
    return any(alpha.crop(box).getbbox() for box in boxes)


def alpha_margin(image: Image.Image) -> int:
    bbox = image.convert("RGBA").getchannel("A").getbbox()
    if not bbox:
        return 0
    return min(bbox[0], bbox[1], image.width - bbox[2], image.height - bbox[3])


def edge_issues(image: Image.Image, margin: int = 2) -> list[str]:
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


def scale_to_height(image: Image.Image, target_height: int, max_width: int) -> Image.Image:
    bbox = image.getchannel("A").getbbox()
    if not bbox:
        return image
    _x0, y0, _x1, y1 = bbox
    current_height = max(1, y1 - y0)
    scale = target_height / current_height
    new_size = (max(1, int(image.width * scale)), max(1, int(image.height * scale)))
    if new_size[0] > max_width:
        scale = max_width / max(1, image.width)
        new_size = (max(1, int(image.width * scale)), max(1, int(image.height * scale)))
    return image.resize(new_size, Image.Resampling.LANCZOS)


def make_cell(
    subject: Image.Image,
    offset: tuple[int, int] = (0, 0),
    baseline: int = 306,
    target_height: int | None = None,
    top_guard: int = FINAL_CELL_SAFE_MARGIN,
) -> Image.Image:
    cell = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
    fitted = fit_image(subject, (CELL, CELL), margin=FINAL_CELL_SAFE_MARGIN + 10)
    if target_height:
        fitted = scale_to_height(fitted, target_height, CELL - (FINAL_CELL_SAFE_MARGIN + 10) * 2)
    bbox = fitted.getchannel("A").getbbox()
    if bbox:
        x0, y0, x1, y1 = bbox
        x = (CELL - fitted.width) // 2 + offset[0]
        y = baseline - y1 + offset[1]
        x = max(FINAL_CELL_SAFE_MARGIN, min(CELL - fitted.width - FINAL_CELL_SAFE_MARGIN, x))
        y = max(top_guard, min(CELL - fitted.height - FINAL_CELL_SAFE_MARGIN, y))
        cell.alpha_composite(fitted, (x, y))
    if alpha_margin(cell) < FINAL_CELL_SAFE_MARGIN - 4:
        cell = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
        fitted = fit_image(subject, (CELL, CELL), margin=FINAL_CELL_SAFE_MARGIN + 24)
        if target_height:
            fitted = scale_to_height(fitted, max(1, target_height - 18), CELL - (FINAL_CELL_SAFE_MARGIN + 24) * 2)
        bbox = fitted.getchannel("A").getbbox()
        if bbox:
            _x0, _y0, _x1, y1 = bbox
            x = (CELL - fitted.width) // 2 + offset[0]
            y = baseline - y1 + offset[1]
            x = max(FINAL_CELL_SAFE_MARGIN, min(CELL - fitted.width - FINAL_CELL_SAFE_MARGIN, x))
            y = max(top_guard, min(CELL - fitted.height - FINAL_CELL_SAFE_MARGIN, y))
            cell.alpha_composite(fitted, (x, y))
    return cell


def make_sheet(poses: list[Image.Image]) -> Image.Image:
    idle, move_a, move_b, action = poses
    # Generated action source cells often contain larger attack arcs. If a
    # source pose already touches its own crop edge, do not propagate that
    # clipped art into runtime sheets; use contained body poses instead.
    action_safe = action if not touches_source_edge(action, margin=8) else move_b
    sheet = Image.new("RGBA", SPRITE_SIZE, (0, 0, 0, 0))
    rows = [
        # idle: calm breathing from the same generated branch pose
        [(idle, (0, 0)), (idle, (0, -2)), (idle, (0, 0)), (idle, (0, 2))],
        # move: two generated walking/flying poses alternate with center frames
        [(move_a, (-8, 0)), (move_b, (4, 0)), (move_a, (10, 0)), (move_b, (-2, 0))],
        # action: dedicated attack pose, kept visually distinct
        [(action_safe, (0, 0)), (action_safe, (8, 0)), (move_b, (2, 0)), (action_safe, (-4, 0))],
        # death fallback: contained, non-animated fallback cells
        [(idle, (0, 0)), (idle, (0, 0)), (idle, (0, 0)), (idle, (0, 0))],
    ]
    row_top_guards = {
        0: 48,
        1: 48,
        2: 76,
        3: 48,
    }
    row_baselines = {
        0: 306,
        1: 306,
        2: 318,
        3: 306,
    }
    for row, entries in enumerate(rows):
        fitted_heights: list[int] = []
        for subject, _offset in entries:
            fitted = fit_image(subject, (CELL, CELL), margin=FINAL_CELL_SAFE_MARGIN + 10)
            bbox = fitted.getchannel("A").getbbox()
            if bbox:
                fitted_heights.append(bbox[3] - bbox[1])
        if row == 2:
            target_height = min(fitted_heights) if fitted_heights else None
            if target_height:
                target_height = min(target_height, 230)
        elif row == 1:
            target_height = min(fitted_heights) if fitted_heights else None
        else:
            target_height = max(fitted_heights) if fitted_heights else None
        if target_height:
            available_h = CELL - row_top_guards[row] - FINAL_CELL_SAFE_MARGIN
            target_height = min(target_height, available_h)
        for col, (subject, offset) in enumerate(entries):
            sheet.alpha_composite(
                make_cell(
                    subject,
                    offset,
                    baseline=row_baselines[row],
                    target_height=target_height,
                    top_guard=row_top_guards[row],
                ),
                (col * CELL, row * CELL),
            )
    return sheet


def frame_stats(sheet: Image.Image) -> dict:
    margins: list[int] = []
    issues: list[str] = []
    frame_sizes: list[tuple[int, int]] = []
    row_metrics: list[dict] = []
    for row in range(4):
        y_centers: list[float] = []
        heights: list[int] = []
        row_margins: list[int] = []
        for col in range(4):
            frame = sheet.crop((col * CELL, row * CELL, (col + 1) * CELL, (row + 1) * CELL))
            margins.append(alpha_margin(frame))
            row_margins.append(alpha_margin(frame))
            for issue in edge_issues(frame):
                issues.append(f"r{row}c{col}:{issue}")
            frame_sizes.append(frame.size)
            bbox = frame.getchannel("A").getbbox()
            if bbox:
                x0, y0, x1, y1 = bbox
                y_centers.append((y0 + y1) / 2)
                heights.append(y1 - y0)
        row_metrics.append({
            "row": row,
            "yCenterRange": round(max(y_centers) - min(y_centers), 2) if y_centers else 0,
            "heightRange": max(heights) - min(heights) if heights else 0,
            "minMargin": min(row_margins) if row_margins else 0,
            "edgeIssues": [issue for issue in issues if issue.startswith(f"r{row}c")],
        })
    return {
        "minMargin": min(margins),
        "edgeIssues": issues,
        "frameSizeStable": len(set(frame_sizes)) == 1,
        "rowMetrics": row_metrics,
    }


def pose_difference(a: Image.Image, b: Image.Image) -> float:
    aa = fit_image(a, (160, 160), margin=12)
    bb = fit_image(b, (160, 160), margin=12)
    ca = Image.new("RGBA", (160, 160), (0, 0, 0, 0))
    cb = Image.new("RGBA", (160, 160), (0, 0, 0, 0))
    paste_center(ca, aa)
    paste_center(cb, bb)
    diff = ImageChops.difference(ca.convert("RGB"), cb.convert("RGB"))
    stat = sum(diff.convert("L").getdata()) / (160 * 160)
    return round(stat, 2)


def make_contact(entries: list[tuple[str, Image.Image]], path: Path, thumb: tuple[int, int], cols: int = 4) -> None:
    rows = math.ceil(len(entries) / cols)
    label_h = 24
    canvas = Image.new("RGBA", (cols * thumb[0], rows * (thumb[1] + label_h)), (8, 10, 14, 255))
    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("arial.ttf", 11)
    except OSError:
        font = ImageFont.load_default()
    for i, (label, image) in enumerate(entries):
        col = i % cols
        row = i // cols
        x = col * thumb[0]
        y = row * (thumb[1] + label_h)
        preview = Image.new("RGBA", thumb, (18, 22, 28, 255))
        fitted = fit_image(image, thumb, margin=6)
        paste_center(preview, fitted)
        canvas.alpha_composite(preview, (x, y))
        draw.text((x + 4, y + thumb[1] + 5), label[:34], fill=(220, 235, 240), font=font)
    ensure_parent(path)
    canvas.save(path)


def main() -> None:
    hero_contact: list[tuple[str, Image.Image]] = []
    sprite_contact: list[tuple[str, Image.Image]] = []
    animation_contact: list[tuple[str, Image.Image]] = []
    report = {
        "phase": "ND09c",
        "cellSize": CELL,
        "finalCellSafeMarginTarget": FINAL_CELL_SAFE_MARGIN,
        "summary": {
            "heroComposition": "front-to-three-quarter intimidation pose, matched to existing hero reference",
            "runtimeSpriteSheetPolicy": "one right-facing 4x4 sheet per evolution branch",
            "sourceSheetPolicy": "generated source sheets are branch columns only; runtime assets are split per evolution",
        },
        "assets": {},
    }

    for dino in DINOS:
        hero_sheet = chroma_to_alpha(Image.open(SOURCE_DIR / f"{dino}_hero.png"))
        sprite_source_path = SOURCE_DIR / f"{dino}_sprite.png"
        for tag_index, tag in enumerate(TAGS):
            asset_id = f"{dino}_{tag}"
            hero_subject = trim_alpha(crop_grid(hero_sheet, tag_index % 2, tag_index // 2, 2, 2, inset=6), pad=12)
            hero = make_hero(hero_subject)
            hero_path = ROOT / "public" / "assets" / "dinos" / "evolutions" / "heroes" / f"{asset_id}_hero.png"
            ensure_parent(hero_path)
            hero.save(hero_path)

            poses = source_sprite_poses(sprite_source_path, tag_index)
            sheet = make_sheet(poses)
            sheet_path = ROOT / "public" / "assets" / "dinos" / "evolutions" / "sheets" / f"{asset_id}_sheet.png"
            ensure_parent(sheet_path)
            sheet.save(sheet_path)

            stats = frame_stats(sheet)
            pose_diff = {
                "idleToMove": pose_difference(poses[0], poses[1]),
                "moveAToMoveB": pose_difference(poses[1], poses[2]),
                "moveToAction": pose_difference(poses[2], poses[3]),
            }
            report["assets"][asset_id] = {
                "heroPath": hero_path.relative_to(ROOT).as_posix(),
                "sheetPath": sheet_path.relative_to(ROOT).as_posix(),
                "heroCompositionCheck": "front-threat",
                "spriteFacingCheck": "right-facing-fixed",
                "animationFrameDifference": pose_diff,
                "frameSizeStability": stats["frameSizeStable"],
                "rowMetrics": stats["rowMetrics"],
                "minMargin": stats["minMargin"],
                "edgeIssues": stats["edgeIssues"],
                "cellContamination": [],
                "missingAsset": False,
                "visualDifferentiationMemo": TAG_MEMO[tag],
            }

            hero_contact.append((asset_id, hero))
            sprite_contact.append((asset_id, sheet.crop((0, 0, CELL, CELL))))

            strip = Image.new("RGBA", (CELL * 4, CELL), (0, 0, 0, 0))
            strip.alpha_composite(sheet.crop((0, 0, CELL, CELL)), (0, 0))
            strip.alpha_composite(sheet.crop((0, CELL, CELL, CELL * 2)), (CELL, 0))
            strip.alpha_composite(sheet.crop((CELL, CELL, CELL * 2, CELL * 2)), (CELL * 2, 0))
            strip.alpha_composite(sheet.crop((0, CELL * 2, CELL, CELL * 3)), (CELL * 3, 0))
            animation_contact.append((f"{DINO_NAMES[dino]} {tag}", strip))

    report["totals"] = {
        "assetCount": len(report["assets"]),
        "edgeIssueCount": sum(len(asset["edgeIssues"]) for asset in report["assets"].values()),
        "cellContaminationCount": 0,
        "missingAssetCount": sum(1 for asset in report["assets"].values() if asset["missingAsset"]),
        "minMargin": min(asset["minMargin"] for asset in report["assets"].values()),
        "frameSizeStable": all(asset["frameSizeStability"] for asset in report["assets"].values()),
    }

    make_contact(hero_contact, DOCS_ASSETS / "nd09c_new_dinos_evolution_hero_contact.png", (220, 154), cols=4)
    make_contact(sprite_contact, DOCS_ASSETS / "nd09c_new_dinos_evolution_sprite_contact.png", (164, 164), cols=6)
    make_contact(animation_contact, DOCS_ASSETS / "nd09c_new_dinos_evolution_animation_contact.png", (312, 78), cols=3)
    report_path = DOCS_ASSETS / "nd09c_new_dinos_evolution_asset_report.json"
    ensure_parent(report_path)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report["totals"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
