from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "public" / "assets" / "companions"
DOC_ASSET_DIR = ROOT / "docs" / "assets"
CELL = 384
COLUMNS = 4
ROWS = 3
SAFE_INSET = 30


@dataclass(frozen=True)
class CompanionSource:
    companion_id: str
    source: Path
    move_note: str
    action_note: str


SOURCES = [
    CompanionSource(
        "raptorling",
        Path(r"C:\Users\oushi\.codex\generated_images\019e5eb7-bc4f-76e3-b6c7-23276e187e20\ig_09bf6931d79ad6d0016a2df6548b2c8191ab7dd49f72bae32a.png"),
        "right-facing fast run with alternating contact and kick-off poses",
        "right-facing leap, claw, bite, recovery poses",
    ),
    CompanionSource(
        "spino_pup",
        Path(r"C:\Users\oushi\.codex\generated_images\019e5eb7-bc4f-76e3-b6c7-23276e187e20\ig_09bf6931d79ad6d0016a2df6a5971c81919b588e10b57a3d41.png"),
        "right-facing heavy walk with sail, tail, and weight-shift poses",
        "right-facing water shot and splash recoil poses",
    ),
    CompanionSource(
        "medic_saur",
        Path(r"C:\Users\oushi\.codex\generated_images\019e5eb7-bc4f-76e3-b6c7-23276e187e20\ig_09bf6931d79ad6d0016a2df6eb66188191bf6fb94d755f7c7c.png"),
        "right-facing gentle walk with smaller contact changes",
        "self-contained healing aura poses with no patient or extra dinosaur",
    ),
    CompanionSource(
        "ptera_chick",
        Path(r"C:\Users\oushi\.codex\generated_images\019e5eb7-bc4f-76e3-b6c7-23276e187e20\ig_09bf6931d79ad6d0016a2df72d10d88191aa512694acd47308.png"),
        "right-facing flap cycle with wing-up, wing-down, glide, and rise/sink poses",
        "right-facing aerial aim, projectile, recoil, recovery poses",
    ),
    CompanionSource(
        "tricera_calf",
        Path(r"C:\Users\oushi\.codex\generated_images\019e5eb7-bc4f-76e3-b6c7-23276e187e20\ig_09bf6931d79ad6d0016a2df77940708191b3e6c3b98af90294.png"),
        "right-facing heavy quadruped walk with stomp and horn motion",
        "self-contained guard and shield aura poses",
    ),
    CompanionSource(
        "para_juvenile",
        Path(r"C:\Users\oushi\.codex\generated_images\019e5eb7-bc4f-76e3-b6c7-23276e187e20\ig_09bf6931d79ad6d0016a2df7c280308191a5d1f72f259144ed.png"),
        "right-facing light walk with crest, head, and tail motion",
        "self-contained sonar and pickup-guidance poses",
    ),
    CompanionSource(
        "stego_calf",
        Path(r"C:\Users\oushi\.codex\generated_images\019e5eb7-bc4f-76e3-b6c7-23276e187e20\ig_09bf6931d79ad6d0016a2df80591dc8191bf9344847a3d536f.png"),
        "right-facing heavy walk with plate and tail motion",
        "self-contained plate charge and stomp shockwave poses",
    ),
    CompanionSource(
        "rex_hatchling",
        Path(r"C:\Users\oushi\.codex\generated_images\019e5eb7-bc4f-76e3-b6c7-23276e187e20\ig_09bf6931d79ad6d0016a2df84ba9108191a7ffd9522fcf21db.png"),
        "right-facing forceful small-run with head and tail counterbalance",
        "right-facing charge, bite, impact, recovery poses",
    ),
    CompanionSource(
        "compy_pack",
        Path(r"C:\Users\oushi\.codex\generated_images\019e5eb7-bc4f-76e3-b6c7-23276e187e20\ig_09bf6931d79ad6d0016a2df891072c819189b9fb61e0264734.png"),
        "right-facing three-compy pack run with offset foot timing",
        "right-facing group lunge and bite flurry poses",
    ),
    CompanionSource(
        "exp_chaser",
        Path(r"C:\Users\oushi\.codex\generated_images\019e5eb7-bc4f-76e3-b6c7-23276e187e20\ig_09bf6931d79ad6d0016a2df91a2b74819198f03142f5a91130.png"),
        "right-facing hover pursuit with rotation, chase tilt, and scan particles",
        "self-contained EXP scan, particle attraction, and tracking beam poses",
    ),
]


def is_magenta_key(r: int, g: int, b: int) -> bool:
    return r > 170 and b > 150 and g < 115 and r - g > 75 and b - g > 58


def remove_magenta_key(image: Image.Image) -> tuple[Image.Image, int]:
    image = image.convert("RGBA")
    pixels = image.load()
    removed = 0
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            if is_magenta_key(r, g, b):
                pixels[x, y] = (r, g, b, 0)
                removed += 1
    return image, removed


def alpha_bbox(image: Image.Image, threshold: int = 10) -> tuple[int, int, int, int] | None:
    mask = image.getchannel("A").point(lambda value: 255 if value > threshold else 0)
    return mask.getbbox()


def isolate_subject(frame: Image.Image, companion_id: str) -> tuple[Image.Image, dict]:
    # P04j prompts generate a single right-facing subject per frame (except the
    # intended compy pack). Keep all non-keyed alpha so aura/scan particles remain
    # with the pose, and rely on per-frame bbox normalization plus contact QA.
    return frame, {"mode": "prompt-isolated-single-subject", "companionId": companion_id}


def normalize_frame(frame: Image.Image, companion_id: str, row: int) -> tuple[Image.Image, dict]:
    isolated, component_report = isolate_subject(frame, companion_id)
    bbox = alpha_bbox(isolated)
    if bbox is None:
        return Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0)), {
            "missing": True,
            "sourceBbox": None,
            "finalBbox": None,
            "components": component_report,
        }

    crop = isolated.crop(bbox)
    max_width = 274 if companion_id != "compy_pack" else 292
    max_height = 244 if row != 2 else 258
    scale = min(max_width / crop.width, max_height / crop.height, 1.0)
    resized = crop.resize(
        (max(1, round(crop.width * scale)), max(1, round(crop.height * scale))),
        Image.Resampling.LANCZOS,
    )

    canvas = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
    paste_x = (CELL - resized.width) // 2
    baseline = 312 if companion_id not in {"ptera_chick", "exp_chaser"} else 238
    if row == 2:
        baseline = baseline - 4
    paste_y = max(18, min(CELL - resized.height - 18, baseline - resized.height))
    canvas.alpha_composite(resized, (paste_x, paste_y))
    final_bbox = alpha_bbox(canvas)
    margins = None
    if final_bbox:
        margins = {
            "left": final_bbox[0],
            "top": final_bbox[1],
            "right": CELL - final_bbox[2],
            "bottom": CELL - final_bbox[3],
        }
    return canvas, {
        "missing": False,
        "sourceBbox": bbox,
        "scale": round(scale, 4),
        "finalBbox": final_bbox,
        "margins": margins,
        "components": component_report,
    }


def process_source(item: CompanionSource) -> dict:
    image = Image.open(item.source).convert("RGBA")
    keyed, removed_pixels = remove_magenta_key(image)
    output = Image.new("RGBA", (CELL * COLUMNS, CELL * ROWS), (0, 0, 0, 0))
    frames = []

    for row in range(ROWS):
        for col in range(COLUMNS):
            left = round(col * keyed.width / COLUMNS)
            right = round((col + 1) * keyed.width / COLUMNS)
            top = round(row * keyed.height / ROWS)
            bottom = round((row + 1) * keyed.height / ROWS)
            crop_left = min(max(left + SAFE_INSET, left), right - 1)
            crop_top = min(max(top + SAFE_INSET, top), bottom - 1)
            crop_right = max(min(right - SAFE_INSET, right), crop_left + 1)
            crop_bottom = max(min(bottom - SAFE_INSET, bottom), crop_top + 1)
            frame = keyed.crop((crop_left, crop_top, crop_right, crop_bottom))
            normalized, report = normalize_frame(frame, item.companion_id, row)
            output.alpha_composite(normalized, (col * CELL, row * CELL))
            frames.append({
                "row": row,
                "column": col,
                "sourceCrop": [left, top, right, bottom],
                "safeCrop": [crop_left, crop_top, crop_right, crop_bottom],
                **report,
            })

    target = PUBLIC_DIR / f"{item.companion_id}_sprite_sheet_p04j.png"
    target.parent.mkdir(parents=True, exist_ok=True)
    output, final_removed_pixels = remove_magenta_key(output)
    output.save(target)

    return {
        "id": item.companion_id,
        "source": str(item.source),
        "output": str(target.relative_to(ROOT)),
        "sourceSize": [image.width, image.height],
        "removedMagentaPixels": removed_pixels,
        "finalRemovedMagentaPixels": final_removed_pixels,
        "columns": COLUMNS,
        "rows": ROWS,
        "cellSize": CELL,
        "moveNote": item.move_note,
        "actionNote": item.action_note,
        "frames": frames,
        "qa": frame_qa(output),
    }


def frame_qa(sheet: Image.Image) -> dict:
    frames = []
    missing = 0
    edge_issues = 0
    min_margin = CELL
    for row in range(ROWS):
        for col in range(COLUMNS):
            frame = sheet.crop((col * CELL, row * CELL, (col + 1) * CELL, (row + 1) * CELL))
            bbox = alpha_bbox(frame)
            if bbox is None:
                missing += 1
                frames.append({"row": row, "column": col, "missing": True})
                continue
            margins = [bbox[0], bbox[1], CELL - bbox[2], CELL - bbox[3]]
            min_margin = min(min_margin, *margins)
            issue = any(margin < 8 for margin in margins)
            if issue:
                edge_issues += 1
            frames.append({
                "row": row,
                "column": col,
                "bbox": bbox,
                "margins": margins,
                "edgeIssue": issue,
            })
    return {
        "missingFrames": missing,
        "frameEdgeIssues": edge_issues,
        "minFrameMarginPx": min_margin,
        "frames": frames,
    }


def checker(size: tuple[int, int], cell: int = 16) -> Image.Image:
    image = Image.new("RGBA", size, (34, 40, 48, 255))
    draw = ImageDraw.Draw(image)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            if ((x // cell) + (y // cell)) % 2 == 0:
                draw.rectangle((x, y, x + cell - 1, y + cell - 1), fill=(64, 72, 84, 255))
    return image


def label_font() -> ImageFont.ImageFont:
    try:
        return ImageFont.truetype("arial.ttf", 16)
    except OSError:
        return ImageFont.load_default()


def make_contact(report: list[dict]) -> None:
    font = label_font()
    thumb = 132
    label_h = 24
    cols = 4
    row_h = label_h + thumb * 3 + 20
    width = cols * (thumb * 4 + 18) + 18
    rows_needed = (len(report) + cols - 1) // cols
    height = rows_needed * row_h + 20
    contact = Image.new("RGBA", (width, height), (12, 16, 22, 255))
    draw = ImageDraw.Draw(contact)

    for index, item in enumerate(report):
        x0 = 18 + (index % cols) * (thumb * 4 + 18)
        y0 = 14 + (index // cols) * row_h
        draw.text((x0, y0), item["id"], fill=(220, 244, 255, 255), font=font)
        sheet = Image.open(ROOT / item["output"]).convert("RGBA")
        for row in range(ROWS):
            for col in range(COLUMNS):
                frame = sheet.crop((col * CELL, row * CELL, (col + 1) * CELL, (row + 1) * CELL))
                back = checker((thumb, thumb), 11)
                back.alpha_composite(frame.resize((thumb, thumb), Image.Resampling.LANCZOS))
                contact.alpha_composite(back, (x0 + col * thumb, y0 + label_h + row * thumb))

    DOC_ASSET_DIR.mkdir(parents=True, exist_ok=True)
    contact.save(DOC_ASSET_DIR / "p04j_companion_sprite_contact.png")


def main() -> None:
    report = [process_source(source) for source in SOURCES]
    make_contact(report)
    out = {
        "title": "MVP-P04j Companion Dino polished sprite sheets",
        "layout": {"columns": COLUMNS, "rows": ROWS, "cellSize": CELL, "safeInset": SAFE_INSET},
        "rules": [
            "right-facing side-view source prompts",
            "single subject per frame except compy_pack's intended three-compy group",
            "no other dinosaurs or animals in support/action frames",
            "source cells are inward-cropped before normalization to avoid neighbor-cell contamination",
            "flat #ff00ff source background removed locally",
            "runtime sheets normalized to fixed 384x384 cells",
            "P04f fixed-size rendering remains unchanged",
        ],
        "companions": report,
    }
    report_path = DOC_ASSET_DIR / "p04j_companion_sprite_report.json"
    report_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({
        "processed": len(report),
        "contact": str((DOC_ASSET_DIR / "p04j_companion_sprite_contact.png").relative_to(ROOT)),
        "report": str(report_path.relative_to(ROOT)),
        "edgeIssues": sum(item["qa"]["frameEdgeIssues"] for item in report),
        "missingFrames": sum(item["qa"]["missingFrames"] for item in report),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
