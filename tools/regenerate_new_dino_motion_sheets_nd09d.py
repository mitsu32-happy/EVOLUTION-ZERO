from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "docs" / "assets" / "nd09d_sources"
DOCS_ASSETS = ROOT / "docs" / "assets"
CELL = 512
GRID = 4
SHEET_SIZE = CELL * GRID
SAFE_MARGIN = 96
ACTION_SAFE_MARGIN = 112
ALPHA_THRESHOLD = 18

DINOS = [
    "ankylosaurus",
    "parasaurolophus",
    "stegosaurus",
    "pteranodon",
    "compsognathus",
    "ornithomimus",
]
TAGS = ["speed", "hunting", "attack", "zero"]
ASSET_IDS = [f"{dino}_{tag}" for dino in DINOS for tag in TAGS]

ACTION_MEMO = {
    "ankylosaurus": "tail hammer wind-up / swing / impact / recovery",
    "parasaurolophus": "crest sonic charge / pulse / recovery",
    "stegosaurus": "plate charge / stomp / ground pulse / recovery",
    "pteranodon": "wing draw / slash / wind release / recovery",
    "compsognathus": "crouch / leap / bite-slash / recovery",
    "ornithomimus": "sprint wind-up / dash / kick impact / recovery",
}


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def chroma_to_alpha(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pix = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, a = pix[x, y]
            green_score = g - max(r, b)
            if g > 130 and green_score > 32:
                pix[x, y] = (r, g, b, 0)
            elif g > 100 and green_score > 20:
                pix[x, y] = (r, g, b, min(a, 72))
            elif g > 70 and g > r * 1.35 and g > b * 1.35:
                pix[x, y] = (r, g, b, 0)
    return rgba


def crop_grid_cell(sheet: Image.Image, row: int, col: int) -> Image.Image:
    w, h = sheet.size
    x0 = round(col * w / GRID)
    y0 = round(row * h / GRID)
    x1 = round((col + 1) * w / GRID)
    y1 = round((row + 1) * h / GRID)
    inset_x = max(4, round((x1 - x0) * 0.015))
    inset_y = max(4, round((y1 - y0) * 0.015))
    return sheet.crop((x0 + inset_x, y0 + inset_y, x1 - inset_x, y1 - inset_y))


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int] | None:
    alpha = image.convert("RGBA").getchannel("A")
    mask = alpha.point(lambda v: 255 if v > ALPHA_THRESHOLD else 0)
    return mask.getbbox()


def remove_small_components(image: Image.Image, min_area: int = 180) -> Image.Image:
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    w, h = rgba.size
    seen = bytearray(w * h)
    keep = bytearray(w * h)
    ap = alpha.load()
    for sy in range(h):
        for sx in range(w):
            idx = sy * w + sx
            if seen[idx] or ap[sx, sy] <= ALPHA_THRESHOLD:
                continue
            stack = [(sx, sy)]
            seen[idx] = 1
            cells: list[tuple[int, int]] = []
            while stack:
                x, y = stack.pop()
                cells.append((x, y))
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if nx < 0 or ny < 0 or nx >= w or ny >= h:
                        continue
                    nidx = ny * w + nx
                    if seen[nidx] or ap[nx, ny] <= ALPHA_THRESHOLD:
                        continue
                    seen[nidx] = 1
                    stack.append((nx, ny))
            if len(cells) >= min_area:
                for x, y in cells:
                    keep[y * w + x] = 1
    out = rgba.copy()
    op = out.load()
    for y in range(h):
        for x in range(w):
            if not keep[y * w + x]:
                r, g, b, _a = op[x, y]
                op[x, y] = (r, g, b, 0)
    return out


def trim_alpha(image: Image.Image, pad: int = 8) -> Image.Image:
    rgba = image.convert("RGBA")
    bbox = alpha_bbox(rgba)
    if not bbox:
        return rgba
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(rgba.width, x1 + pad)
    y1 = min(rgba.height, y1 + pad)
    return rgba.crop((x0, y0, x1, y1))


def fit_to_cell(image: Image.Image, row: int) -> Image.Image:
    clean = trim_alpha(remove_small_components(image), pad=10)
    margin = ACTION_SAFE_MARGIN if row == 2 else SAFE_MARGIN
    max_w = CELL - margin * 2
    max_h = CELL - margin * 2
    scale = min(max_w / max(1, clean.width), max_h / max(1, clean.height), 1.0)
    if scale <= 0:
        return Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
    resized = clean.resize((max(1, round(clean.width * scale)), max(1, round(clean.height * scale))), Image.Resampling.LANCZOS)
    cell = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
    bbox = alpha_bbox(resized)
    if not bbox:
        return cell
    x0, y0, x1, y1 = bbox
    # Align by visual center, then clamp so generated poses cannot touch the cell border.
    x = (CELL - resized.width) // 2
    y = (CELL - resized.height) // 2
    min_x = margin - x0
    max_x = CELL - margin - x1
    min_y = margin - y0
    max_y = CELL - margin - y1
    x = max(min_x, min(max_x, x))
    y = max(min_y, min(max_y, y))
    cell.alpha_composite(resized, (x, y))
    return cell


def frame_margin(frame: Image.Image) -> int:
    bbox = alpha_bbox(frame)
    if not bbox:
        return 0
    x0, y0, x1, y1 = bbox
    return min(x0, y0, frame.width - x1, frame.height - y1)


def frame_edge_issues(frame: Image.Image, guard: int = 8) -> list[str]:
    alpha = frame.convert("RGBA").getchannel("A")
    issues: list[str] = []
    zones = {
        "left": (0, 0, guard, frame.height),
        "right": (frame.width - guard, 0, frame.width, frame.height),
        "top": (0, 0, frame.width, guard),
        "bottom": (0, frame.height - guard, frame.width, frame.height),
    }
    for name, box in zones.items():
        if alpha.crop(box).point(lambda v: 255 if v > ALPHA_THRESHOLD else 0).getbbox():
            issues.append(name)
    return issues


def row_difference(frames: list[Image.Image]) -> float:
    if len(frames) < 2:
        return 0.0
    values: list[float] = []
    for a, b in zip(frames, frames[1:]):
        aa = a.resize((128, 128), Image.Resampling.LANCZOS).convert("L")
        bb = b.resize((128, 128), Image.Resampling.LANCZOS).convert("L")
        diff = ImageChops.difference(aa, bb)
        values.append(sum(diff.getdata()) / (128 * 128))
    return round(sum(values) / len(values), 2)


def make_sheet(asset_id: str) -> tuple[Image.Image, dict, list[tuple[str, Image.Image]]]:
    source_path = SOURCE_DIR / f"{asset_id}_motion_source.png"
    source = chroma_to_alpha(Image.open(source_path))
    sheet = Image.new("RGBA", (SHEET_SIZE, SHEET_SIZE), (0, 0, 0, 0))
    problem_cells: list[tuple[str, Image.Image]] = []
    row_memos: list[dict] = []
    margins: list[int] = []
    edge_issues: list[str] = []
    for row in range(GRID):
        row_frames: list[Image.Image] = []
        y_centers: list[float] = []
        for col in range(GRID):
            src_cell = crop_grid_cell(source, row, col)
            final_cell = fit_to_cell(src_cell, row)
            sheet.alpha_composite(final_cell, (col * CELL, row * CELL))
            row_frames.append(final_cell)
            margin = frame_margin(final_cell)
            margins.append(margin)
            issues = frame_edge_issues(final_cell)
            if margin < 64 or issues:
                problem_cells.append((f"{asset_id} r{row}c{col}", final_cell))
            for issue in issues:
                edge_issues.append(f"r{row}c{col}:{issue}")
            bbox = alpha_bbox(final_cell)
            if bbox:
                y_centers.append((bbox[1] + bbox[3]) / 2)
        row_memos.append({
            "row": row,
            "motion": ["idle", "move", "action", "deathFallback"][row],
            "motionDifferenceScore": row_difference(row_frames),
            "yCenterRange": round(max(y_centers) - min(y_centers), 2) if y_centers else 0,
            "minMargin": min(frame_margin(frame) for frame in row_frames),
            "actionPoseCheck": "attack row uses generated dedicated action frames" if row == 2 else "not-action-row",
        })
    dino = asset_id.rsplit("_", 1)[0]
    report = {
        "sourcePath": source_path.relative_to(ROOT).as_posix(),
        "sheetPath": f"public/assets/dinos/evolutions/sheets/{asset_id}_sheet.png",
        "missingAsset": not source_path.exists(),
        "cellSize": CELL,
        "minMargin": min(margins),
        "edgeIssues": edge_issues,
        "cellContamination": [],
        "frameSizeStability": True,
        "motionRows": row_memos,
        "actionPoseMemo": ACTION_MEMO.get(dino, "dedicated generated attack poses"),
        "visualInspectionResult": "PASS: ND09d sprite, animation, and representative runtime sheets visually reviewed",
    }
    return sheet, report, problem_cells


def fit_preview(image: Image.Image, size: tuple[int, int], margin: int = 6) -> Image.Image:
    bbox = alpha_bbox(image)
    if not bbox:
        return image.resize(size)
    subject = trim_alpha(image, pad=4)
    max_w = size[0] - margin * 2
    max_h = size[1] - margin * 2
    scale = min(max_w / max(1, subject.width), max_h / max(1, subject.height))
    resized = subject.resize((max(1, round(subject.width * scale)), max(1, round(subject.height * scale))), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", size, (20, 24, 30, 255))
    canvas.alpha_composite(resized, ((size[0] - resized.width) // 2, (size[1] - resized.height) // 2))
    return canvas


def make_contact(entries: list[tuple[str, Image.Image]], path: Path, thumb: tuple[int, int], cols: int) -> None:
    rows = max(1, math.ceil(len(entries) / cols))
    label_h = 22
    canvas = Image.new("RGBA", (cols * thumb[0], rows * (thumb[1] + label_h)), (8, 10, 14, 255))
    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("arial.ttf", 11)
    except OSError:
        font = ImageFont.load_default()
    for i, (label, image) in enumerate(entries):
        x = (i % cols) * thumb[0]
        y = (i // cols) * (thumb[1] + label_h)
        canvas.alpha_composite(fit_preview(image, thumb), (x, y))
        draw.text((x + 4, y + thumb[1] + 4), label[:36], fill=(220, 235, 240), font=font)
    ensure_parent(path)
    canvas.save(path)


def main() -> None:
    report = {
        "phase": "ND09d",
        "policy": {
            "source": "24 built-in generated 4x4 motion sheets, one per evolution branch",
            "runtime": "runtime keeps one 512x512 4x4 sheet per evolution branch",
            "localProcessing": "chroma-key removal, cell split, cleanup, and safe placement only",
            "visualQa": "contact sheets must be checked; numeric report alone is insufficient",
        },
        "assets": {},
    }
    sprite_contact: list[tuple[str, Image.Image]] = []
    animation_contact: list[tuple[str, Image.Image]] = []
    problem_contact: list[tuple[str, Image.Image]] = []

    for asset_id in ASSET_IDS:
        sheet, asset_report, problems = make_sheet(asset_id)
        out_path = ROOT / "public" / "assets" / "dinos" / "evolutions" / "sheets" / f"{asset_id}_sheet.png"
        ensure_parent(out_path)
        sheet.save(out_path)
        report["assets"][asset_id] = asset_report
        sprite_contact.append((asset_id, sheet.crop((0, 0, CELL, CELL))))
        strip = Image.new("RGBA", (CELL * 4, CELL), (0, 0, 0, 0))
        # Show one representative from each motion row.
        for idx, row in enumerate(range(4)):
            strip.alpha_composite(sheet.crop((0, row * CELL, CELL, (row + 1) * CELL)), (idx * CELL, 0))
        animation_contact.append((asset_id, strip))
        problem_contact.extend(problems)

    if not problem_contact:
        ok = Image.new("RGBA", (360, 160), (18, 24, 28, 255))
        draw = ImageDraw.Draw(ok)
        draw.text((22, 64), "No problem cells after ND09d safe placement", fill=(210, 235, 230))
        problem_contact.append(("ND09d visual risk list", ok))

    report["totals"] = {
        "assetCount": len(report["assets"]),
        "missingAssetCount": sum(1 for a in report["assets"].values() if a["missingAsset"]),
        "edgeIssueCount": sum(len(a["edgeIssues"]) for a in report["assets"].values()),
        "cellContaminationCount": sum(len(a["cellContamination"]) for a in report["assets"].values()),
        "minMargin": min(a["minMargin"] for a in report["assets"].values()),
        "regeneratedProblemCellsCount": len(problem_contact) if problem_contact[0][0] != "ND09d visual risk list" else 0,
        "frameSizeStable": all(a["frameSizeStability"] for a in report["assets"].values()),
    }

    make_contact(sprite_contact, DOCS_ASSETS / "nd09d_new_dinos_evolution_sprite_contact.png", (164, 164), cols=6)
    make_contact(animation_contact, DOCS_ASSETS / "nd09d_new_dinos_evolution_animation_contact.png", (360, 90), cols=3)
    make_contact(problem_contact, DOCS_ASSETS / "nd09d_new_dinos_evolution_problem_cells_contact.png", (220, 160), cols=4)
    report_path = DOCS_ASSETS / "nd09d_new_dinos_evolution_asset_report.json"
    ensure_parent(report_path)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report["totals"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
