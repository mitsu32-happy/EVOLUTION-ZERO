from __future__ import annotations

import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
DOC_ASSETS = ROOT / "docs" / "assets"
BACKUP_DIR = DOC_ASSETS / "nd09g_before"

EVOLUTION_TAGS = ("speed", "hunting", "attack", "zero")

BASE_TARGETS = {
    "parasaurolophus": {"target_width": 292, "target_height": 158, "foot_line": 330},
    "stegosaurus": {"target_width": 316, "target_height": 170, "foot_line": 330},
    "pteranodon": {"target_width": 270, "target_height": 166, "center_line": 192, "align": "center"},
    "compsognathus": {"target_width": 262, "target_height": 118, "foot_line": 312},
    "ornithomimus": {"target_width": 268, "target_height": 168, "foot_line": 336},
}

EVOLUTION_TARGETS = {
    "parasaurolophus": {
        "speed": {"target_width": 384, "target_height": 260, "foot_line": 440},
        "hunting": {"target_width": 390, "target_height": 266, "foot_line": 440},
        "attack": {"target_width": 402, "target_height": 272, "foot_line": 440},
        "zero": {"target_width": 406, "target_height": 278, "foot_line": 440},
    },
    "stegosaurus": {
        "speed": {"target_width": 402, "target_height": 270, "foot_line": 440},
        "hunting": {"target_width": 408, "target_height": 276, "foot_line": 440},
        "attack": {"target_width": 424, "target_height": 292, "foot_line": 440},
        "zero": {"target_width": 428, "target_height": 304, "foot_line": 440},
    },
    "pteranodon": {
        "speed": {"target_width": 398, "target_height": 282, "center_line": 256, "align": "center"},
        "hunting": {"target_width": 404, "target_height": 286, "center_line": 256, "align": "center"},
        "attack": {"target_width": 412, "target_height": 290, "center_line": 256, "align": "center"},
        "zero": {"target_width": 416, "target_height": 294, "center_line": 256, "align": "center"},
    },
    "compsognathus": {
        "speed": {"target_width": 352, "target_height": 218, "foot_line": 430},
        "hunting": {"target_width": 362, "target_height": 224, "foot_line": 430},
        "attack": {"target_width": 372, "target_height": 232, "foot_line": 430},
        "zero": {"target_width": 382, "target_height": 238, "foot_line": 430},
    },
    "ornithomimus": {
        "speed": {"target_width": 370, "target_height": 292, "foot_line": 440},
        "hunting": {"target_width": 376, "target_height": 298, "foot_line": 440},
        "attack": {"target_width": 388, "target_height": 310, "foot_line": 440},
        "zero": {"target_width": 394, "target_height": 316, "foot_line": 440},
    },
}


def build_targets() -> list[dict]:
    targets: list[dict] = []
    for dino_id, config in BASE_TARGETS.items():
        targets.append({
            "id": f"{dino_id}_base",
            "dinoId": dino_id,
            "tag": "base",
            "path": ROOT / "public" / "assets" / "dinos" / f"{dino_id}_sheet.png",
            "cell": 384,
            **config,
        })
        for tag in EVOLUTION_TAGS:
            targets.append({
                "id": f"{dino_id}_{tag}",
                "dinoId": dino_id,
                "tag": tag,
                "path": ROOT / "public" / "assets" / "dinos" / "evolutions" / "sheets" / f"{dino_id}_{tag}_sheet.png",
                "cell": 512,
                **EVOLUTION_TARGETS[dino_id][tag],
            })
    return targets


def bbox_for(cell: Image.Image) -> tuple[int, int, int, int] | None:
    return cell.getchannel("A").getbbox()


def remove_small_islands(cell: Image.Image, keep_only_largest: bool, min_area: int = 128) -> Image.Image:
    alpha = cell.getchannel("A")
    width, height = alpha.size
    pixels = alpha.load()
    visited: set[tuple[int, int]] = set()
    components: list[list[tuple[int, int]]] = []

    for y in range(height):
        for x in range(width):
            if (x, y) in visited or pixels[x, y] == 0:
                continue
            stack = [(x, y)]
            visited.add((x, y))
            points: list[tuple[int, int]] = []
            while stack:
                px, py = stack.pop()
                points.append((px, py))
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    if (nx, ny) in visited or pixels[nx, ny] == 0:
                        continue
                    visited.add((nx, ny))
                    stack.append((nx, ny))
            components.append(points)

    if len(components) <= 1:
        return cell

    largest = max(len(points) for points in components)
    if keep_only_largest:
        keep = [max(components, key=len)]
    else:
        keep = [points for points in components if len(points) == largest or len(points) >= min_area]

    mask = Image.new("L", alpha.size, 0)
    mask_pixels = mask.load()
    for points in keep:
        for x, y in points:
            mask_pixels[x, y] = pixels[x, y]

    cleaned = cell.copy()
    cleaned.putalpha(mask)
    return cleaned


def crop_visible(cell: Image.Image, row: int) -> tuple[Image.Image, tuple[int, int, int, int] | None]:
    # Keep action-row secondary effects, but remove isolated islands elsewhere
    # so adjacent-cell leftovers cannot ride along with the sprite.
    cell = remove_small_islands(cell, keep_only_largest=row != 2)
    bbox = bbox_for(cell)
    if not bbox:
        return cell, None
    return cell.crop(bbox), bbox


def relayout_sheet(target: dict) -> dict:
    path = target["path"]
    cell_size = target["cell"]
    target_width = target["target_width"]
    target_height = target["target_height"]
    align = target.get("align", "bottom")
    foot_line = target.get("foot_line")
    center_line = target.get("center_line")

    original = Image.open(path).convert("RGBA")
    backup_path = BACKUP_DIR / path.name
    backup_path.parent.mkdir(parents=True, exist_ok=True)
    if not backup_path.exists():
        shutil.copy2(path, backup_path)

    output = Image.new("RGBA", original.size, (0, 0, 0, 0))
    frames = []

    for row in range(4):
        for col in range(4):
            box = (col * cell_size, row * cell_size, (col + 1) * cell_size, (row + 1) * cell_size)
            source_cell = original.crop(box)
            visible, source_bbox = crop_visible(source_cell, row)
            if not source_bbox:
                frames.append({"row": row, "col": col, "missing": True})
                continue

            width, height = visible.size
            scale = min(target_width / max(1, width), target_height / max(1, height))
            new_width = max(1, round(width * scale))
            new_height = max(1, round(height * scale))
            resized = visible.resize((new_width, new_height), Image.Resampling.LANCZOS)

            x = round((cell_size - new_width) / 2)
            if align == "center":
                y = round(center_line - new_height / 2)
            else:
                y = round(foot_line - new_height)
            x = max(32, min(cell_size - new_width - 32, x))
            y = max(32, min(cell_size - new_height - 32, y))
            output.alpha_composite(resized, (col * cell_size + x, row * cell_size + y))

            final_bbox = (x, y, x + new_width, y + new_height)
            frames.append({
                "row": row,
                "col": col,
                "sourceBbox": source_bbox,
                "finalBbox": final_bbox,
                "scale": round(scale, 3),
                "width": new_width,
                "height": new_height,
                "bottom": final_bbox[3],
                "centerY": round((final_bbox[1] + final_bbox[3]) / 2, 1),
                "baselineDelta": (final_bbox[3] - foot_line) if align != "center" else round(((final_bbox[1] + final_bbox[3]) / 2) - center_line, 1),
                "topMargin": final_bbox[1],
                "bottomMargin": cell_size - final_bbox[3],
                "leftMargin": final_bbox[0],
                "rightMargin": cell_size - final_bbox[2],
            })

    output.save(path)
    return {
        "id": target["id"],
        "path": str(path.relative_to(ROOT)).replace("\\", "/"),
        "cell": cell_size,
        "targetWidth": target_width,
        "targetHeight": target_height,
        "align": align,
        "footLine": foot_line,
        "centerLine": center_line,
        "frames": frames,
    }


def frame_bbox(sheet: Image.Image, cell: int, row: int, col: int) -> tuple[int, int, int, int] | None:
    crop = sheet.crop((col * cell, row * cell, (col + 1) * cell, (row + 1) * cell))
    return bbox_for(crop)


def inspect_sheet(target: dict) -> dict:
    cell = target["cell"]
    align = target.get("align", "bottom")
    foot_line = target.get("foot_line")
    center_line = target.get("center_line")
    image = Image.open(target["path"]).convert("RGBA")
    rows = []
    edge_issues = []
    for row in range(4):
        row_frames = []
        bottoms = []
        centers = []
        for col in range(4):
            bbox = frame_bbox(image, cell, row, col)
            if not bbox:
                row_frames.append({"col": col, "missing": True})
                edge_issues.append({"row": row, "col": col, "issue": "missing"})
                continue
            left, top, right, bottom = bbox
            center_y = (top + bottom) / 2
            margins = {"left": left, "top": top, "right": cell - right, "bottom": cell - bottom}
            min_margin = min(margins.values())
            bottoms.append(bottom)
            centers.append(center_y)
            if min_margin < 32:
                edge_issues.append({"row": row, "col": col, "issue": "low_margin", "minMargin": min_margin})
            row_frames.append({
                "col": col,
                "bbox": bbox,
                "width": right - left,
                "height": bottom - top,
                "bottom": bottom,
                "centerY": round(center_y, 1),
                "baselineDelta": (bottom - foot_line) if align != "center" else round(center_y - center_line, 1),
                "margins": margins,
                "minMargin": min_margin,
            })
        rows.append({
            "row": row,
            "bottomRange": max(bottoms) - min(bottoms) if bottoms else None,
            "centerRange": round(max(centers) - min(centers), 1) if centers else None,
            "frames": row_frames,
        })
    return {"id": target["id"], "align": align, "rows": rows, "edgeIssues": edge_issues}


def add_label(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str) -> None:
    draw.rectangle((xy[0] - 4, xy[1] - 3, xy[0] + len(text) * 7 + 8, xy[1] + 15), fill=(0, 0, 0, 190))
    draw.text(xy, text, fill=(220, 255, 245, 255))


def make_contact(targets: list[dict], output_path: Path, title: str, use_backup: bool = False) -> None:
    preview_cell = 96
    label_height = 24
    gap = 8
    columns = 5
    sheet_w = preview_cell * 4
    sheet_h = preview_cell * 4
    rows = (len(targets) + columns - 1) // columns
    canvas = Image.new("RGBA", (
        columns * sheet_w + (columns - 1) * gap,
        32 + rows * (label_height + sheet_h + gap),
    ), (8, 10, 12, 255))
    draw = ImageDraw.Draw(canvas)
    add_label(draw, (8, 8), title)
    for index, target in enumerate(targets):
        row = index // columns
        col = index % columns
        x = col * (sheet_w + gap)
        y = 32 + row * (label_height + sheet_h + gap)
        path = BACKUP_DIR / target["path"].name if use_backup else target["path"]
        image = Image.open(path).convert("RGBA").resize((sheet_w, sheet_h), Image.Resampling.LANCZOS)
        add_label(draw, (x + 4, y + 4), target["id"])
        canvas.alpha_composite(image, (x, y + label_height))
        for line in range(5):
            gx = x + line * preview_cell
            gy = y + label_height + line * preview_cell
            draw.line((gx, y + label_height, gx, y + label_height + sheet_h), fill=(255, 255, 255, 70))
            draw.line((x, gy, x + sheet_w, gy), fill=(255, 255, 255, 70))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(output_path)


def make_before_after(targets: list[dict], output_path: Path) -> None:
    preview_cell = 64
    label_height = 20
    gap = 6
    columns = 5
    pair_w = preview_cell * 8 + gap
    pair_h = label_height + preview_cell * 4
    rows = (len(targets) + columns - 1) // columns
    canvas = Image.new("RGBA", (
        columns * pair_w + (columns - 1) * gap,
        rows * (pair_h + gap),
    ), (8, 10, 12, 255))
    draw = ImageDraw.Draw(canvas)
    for index, target in enumerate(targets):
        row = index // columns
        col = index % columns
        x = col * (pair_w + gap)
        y = row * (pair_h + gap)
        before = Image.open(BACKUP_DIR / target["path"].name).convert("RGBA").resize((preview_cell * 4, preview_cell * 4), Image.Resampling.LANCZOS)
        after = Image.open(target["path"]).convert("RGBA").resize((preview_cell * 4, preview_cell * 4), Image.Resampling.LANCZOS)
        add_label(draw, (x + 2, y + 3), target["id"])
        canvas.alpha_composite(before, (x, y + label_height))
        canvas.alpha_composite(after, (x + preview_cell * 4 + gap, y + label_height))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(output_path)


def main() -> None:
    targets = build_targets()
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    before = [inspect_sheet(target) for target in targets]
    relayout = [relayout_sheet(target) for target in targets]
    after = [inspect_sheet(target) for target in targets]
    report = {
        "phase": "ND09g",
        "policy": {
            "scope": "remaining five new dinos, base plus four evolution sheets each",
            "groundBaseline": "visual bottom aligned per dino to avoid whole-sprite jumping",
            "pteranodonBaseline": "visual centerY aligned as a flight centerline",
            "runtimeAnimationKeys": "ND09f manifest fix maps evolution rows to run/attack/death.",
            "visualInspection": "contact sheets were generated for manual QA; numeric report is not the sole acceptance gate.",
        },
        "before": before,
        "relayout": relayout,
        "after": after,
    }
    (DOC_ASSETS / "nd09g_remaining_dinos_motion_report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    make_contact(targets, DOC_ASSETS / "nd09g_remaining_dinos_motion_contact.png", "ND09g remaining dinos after motion baseline")
    make_before_after(targets, DOC_ASSETS / "nd09g_remaining_dinos_before_after_contact.png")


if __name__ == "__main__":
    main()
