from __future__ import annotations

import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
DOC_ASSETS = ROOT / "docs" / "assets"
BACKUP_DIR = DOC_ASSETS / "nd09f_before"

TARGETS = [
    {
        "id": "ankylosaurus_base",
        "path": ROOT / "public" / "assets" / "dinos" / "ankylosaurus_sheet.png",
        "cell": 384,
        "target_width": 306,
        "target_height": 218,
        "foot_line": 330,
    },
    {
        "id": "ankylosaurus_speed",
        "path": ROOT / "public" / "assets" / "dinos" / "evolutions" / "sheets" / "ankylosaurus_speed_sheet.png",
        "cell": 512,
        "target_width": 392,
        "target_height": 330,
        "foot_line": 440,
    },
    {
        "id": "ankylosaurus_hunting",
        "path": ROOT / "public" / "assets" / "dinos" / "evolutions" / "sheets" / "ankylosaurus_hunting_sheet.png",
        "cell": 512,
        "target_width": 402,
        "target_height": 336,
        "foot_line": 440,
    },
    {
        "id": "ankylosaurus_attack",
        "path": ROOT / "public" / "assets" / "dinos" / "evolutions" / "sheets" / "ankylosaurus_attack_sheet.png",
        "cell": 512,
        "target_width": 414,
        "target_height": 344,
        "foot_line": 440,
    },
    {
        "id": "ankylosaurus_zero",
        "path": ROOT / "public" / "assets" / "dinos" / "evolutions" / "sheets" / "ankylosaurus_zero_sheet.png",
        "cell": 512,
        "target_width": 418,
        "target_height": 352,
        "foot_line": 440,
    },
]


def bbox_for(cell: Image.Image) -> tuple[int, int, int, int] | None:
    return cell.getchannel("A").getbbox()


def remove_small_islands(cell: Image.Image, keep_only_largest: bool = False, min_area: int = 96) -> Image.Image:
    alpha = cell.getchannel("A")
    width, height = alpha.size
    pixels = alpha.load()
    visited = set()
    components = []

    for y in range(height):
        for x in range(width):
            if (x, y) in visited or pixels[x, y] == 0:
                continue
            stack = [(x, y)]
            visited.add((x, y))
            points = []
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
    cell = remove_small_islands(cell, keep_only_largest=row != 2)
    bbox = bbox_for(cell)
    if not bbox:
        return cell, None
    return cell.crop(bbox), bbox


def relayout_sheet(target: dict) -> dict:
    path = target["path"]
    cell_size = target["cell"]
    foot_line = target["foot_line"]
    target_width = target["target_width"]
    target_height = target["target_height"]
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

            # Player anchor is y=0.62, so keep the visual foot baseline low in
            # the fixed cell instead of centered. This prevents floating.
            x = round((cell_size - new_width) / 2)
            y = round(foot_line - new_height)
            x = max(24, min(cell_size - new_width - 24, x))
            y = max(24, min(cell_size - new_height - 24, y))
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
                "bottomDeltaFromFootLine": final_bbox[3] - foot_line,
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
        "footLine": foot_line,
        "frames": frames,
    }


def frame_bbox(sheet: Image.Image, cell: int, row: int, col: int) -> tuple[int, int, int, int] | None:
    crop = sheet.crop((col * cell, row * cell, (col + 1) * cell, (row + 1) * cell))
    return bbox_for(crop)


def inspect_sheet(target: dict) -> dict:
    path = target["path"]
    cell = target["cell"]
    foot_line = target["foot_line"]
    image = Image.open(path).convert("RGBA")
    rows = []
    edge_issues = []
    for row in range(4):
        row_frames = []
        bottoms = []
        for col in range(4):
            bbox = frame_bbox(image, cell, row, col)
            if not bbox:
                row_frames.append({"col": col, "missing": True})
                edge_issues.append({"row": row, "col": col, "issue": "missing"})
                continue
            left, top, right, bottom = bbox
            margins = {
                "left": left,
                "top": top,
                "right": cell - right,
                "bottom": cell - bottom,
            }
            min_margin = min(margins.values())
            bottoms.append(bottom)
            if min_margin < 24:
                edge_issues.append({"row": row, "col": col, "issue": "low_margin", "minMargin": min_margin})
            row_frames.append({
                "col": col,
                "bbox": bbox,
                "width": right - left,
                "height": bottom - top,
                "bottom": bottom,
                "footLineDelta": bottom - foot_line,
                "margins": margins,
                "minMargin": min_margin,
            })
        rows.append({
            "row": row,
            "bottomRange": max(bottoms) - min(bottoms) if bottoms else None,
            "frames": row_frames,
        })
    return {"id": target["id"], "rows": rows, "edgeIssues": edge_issues}


def add_label(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str) -> None:
    draw.rectangle((xy[0] - 4, xy[1] - 3, xy[0] + len(text) * 7 + 6, xy[1] + 14), fill=(0, 0, 0, 180))
    draw.text(xy, text, fill=(220, 255, 245, 255))


def make_contact(targets: list[dict], output_path: Path, title: str, use_backup: bool = False) -> None:
    scale = 0.25
    cell_preview = 128
    label_height = 26
    gap = 10
    sheet_width = cell_preview * 4
    sheet_height = label_height + cell_preview * 4
    canvas = Image.new("RGBA", (sheet_width * len(targets) + gap * (len(targets) - 1), sheet_height + 28), (10, 12, 14, 255))
    draw = ImageDraw.Draw(canvas)
    add_label(draw, (8, 6), title)

    for index, target in enumerate(targets):
        path = BACKUP_DIR / target["path"].name if use_backup else target["path"]
        image = Image.open(path).convert("RGBA")
        preview = image.resize((cell_preview * 4, cell_preview * 4), Image.Resampling.LANCZOS)
        x = index * (sheet_width + gap)
        y = 28 + label_height
        canvas.alpha_composite(preview, (x, y))
        add_label(draw, (x + 4, 30), target["id"])
        # Draw frame grid so baseline / cell overflow is easy to inspect.
        for line in range(5):
            gx = x + line * cell_preview
            gy = y + line * cell_preview
            draw.line((gx, y, gx, y + cell_preview * 4), fill=(255, 255, 255, 80))
            draw.line((x, gy, x + cell_preview * 4, gy), fill=(255, 255, 255, 80))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(output_path)


def make_before_after(targets: list[dict], output_path: Path) -> None:
    scale = 0.22
    cell_preview = 112
    sheet_width = cell_preview * 4
    sheet_height = cell_preview * 4
    label_height = 24
    gap = 8
    canvas = Image.new("RGBA", (
        sheet_width * 2 + gap,
        (sheet_height + label_height + gap) * len(targets),
    ), (8, 10, 12, 255))
    draw = ImageDraw.Draw(canvas)
    for idx, target in enumerate(targets):
        y = idx * (sheet_height + label_height + gap)
        before = Image.open(BACKUP_DIR / target["path"].name).convert("RGBA").resize((sheet_width, sheet_height), Image.Resampling.LANCZOS)
        after = Image.open(target["path"]).convert("RGBA").resize((sheet_width, sheet_height), Image.Resampling.LANCZOS)
        add_label(draw, (4, y + 4), f"{target['id']} before")
        add_label(draw, (sheet_width + gap + 4, y + 4), f"{target['id']} after")
        canvas.alpha_composite(before, (0, y + label_height))
        canvas.alpha_composite(after, (sheet_width + gap, y + label_height))
        for side_x in (0, sheet_width + gap):
            for line in range(5):
                gx = side_x + line * cell_preview
                gy = y + label_height + line * cell_preview
                draw.line((gx, y + label_height, gx, y + label_height + sheet_height), fill=(255, 255, 255, 65))
                draw.line((side_x, gy, side_x + sheet_width, gy), fill=(255, 255, 255, 65))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(output_path)


def main() -> None:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    before = [inspect_sheet(target) for target in TARGETS]
    relayout = [relayout_sheet(target) for target in TARGETS]
    after = [inspect_sheet(target) for target in TARGETS]
    report = {
        "phase": "ND09f",
        "policy": {
            "scope": "ankylosaurus base plus four evolution sheets",
            "baseline": "visual bottom aligned to a stable footLine per cell size",
            "runtimeAnchor": "Player anchor y=0.62; sheets place feet low in the cell to avoid floating",
            "note": "Uses existing generated motion frames, relaid out into fixed baseline-safe cells.",
        },
        "before": before,
        "relayout": relayout,
        "after": after,
    }
    (DOC_ASSETS / "nd09f_ankylosaurus_motion_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    make_contact(TARGETS, DOC_ASSETS / "nd09f_ankylosaurus_motion_contact.png", "ND09f ankylosaurus after motion baseline")
    make_before_after(TARGETS, DOC_ASSETS / "nd09f_ankylosaurus_before_after_contact.png")


if __name__ == "__main__":
    main()
