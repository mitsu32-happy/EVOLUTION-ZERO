from __future__ import annotations

import argparse
import json
from pathlib import Path
from collections import deque
from typing import Iterable

from PIL import Image


def is_edge_residue(r: int, g: int, b: int) -> bool:
    magenta_residue = r > 72 and b > 86 and r > g + 18 and b > g + 22
    cyan_residue = b > 120 and g > 105 and r < 88 and b > r + 42 and g > r + 34

    return magenta_residue or cyan_residue


def average_neighbor_color(image: Image.Image, x: int, y: int, radius: int = 2) -> tuple[int, int, int] | None:
    pixels = image.load()
    colors: list[tuple[int, int, int]] = []

    for ny in range(max(0, y - radius), min(image.height, y + radius + 1)):
        for nx in range(max(0, x - radius), min(image.width, x + radius + 1)):
            if nx == x and ny == y:
                continue

            r, g, b, a = pixels[nx, ny]
            if a < 120 or is_edge_residue(r, g, b):
                continue

            colors.append((r, g, b))

    if not colors:
        return None

    return (
        round(sum(color[0] for color in colors) / len(colors)),
        round(sum(color[1] for color in colors) / len(colors)),
        round(sum(color[2] for color in colors) / len(colors)),
    )


def remove_chroma_key(image: Image.Image) -> Image.Image:
    """Remove #ff00ff-style sheet backgrounds without relying on exact pixels."""
    converted = image.convert("RGBA")
    pixels = converted.load()

    for y in range(converted.height):
        for x in range(converted.width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue

            distance = abs(r - 255) + abs(g - 0) + abs(b - 255)
            magenta_like = r > 170 and b > 170 and g < 96

            if distance < 90 or magenta_like:
                pixels[x, y] = (r, g, b, 0)
                continue

            # Despill soft halos from generated chroma-key edges.
            if r > g + 24 and b > g + 30 and b > 80 and r > 70:
                if a < 84:
                    pixels[x, y] = (r, g, b, 0)
                else:
                    pixels[x, y] = (
                        min(r, 95),
                        min(150, max(62, g + 34)),
                        min(170, max(100, b)),
                        min(a, 210),
                    )

    return converted


def repair_edge_residue(image: Image.Image) -> tuple[Image.Image, dict]:
    """Lightly replace magenta/cyan chroma residue using nearby subject colors."""
    converted = image.convert("RGBA")
    original = converted.copy()
    pixels = converted.load()
    replaced = 0
    softened_alpha = 0

    for y in range(converted.height):
        for x in range(converted.width):
            r, g, b, a = pixels[x, y]
            if a == 0 or not is_edge_residue(r, g, b):
                continue

            neighbor = average_neighbor_color(original, x, y, radius=2)
            if neighbor is None:
                continue

            # Blend instead of replacing hard, preserving silhouette and texture.
            blend = 0.74 if a >= 180 else 0.88
            nr = round(r * (1 - blend) + neighbor[0] * blend)
            ng = round(g * (1 - blend) + neighbor[1] * blend)
            nb = round(b * (1 - blend) + neighbor[2] * blend)
            na = a

            if a < 72:
                na = max(0, round(a * 0.72))
                softened_alpha += 1

            pixels[x, y] = (nr, ng, nb, na)
            replaced += 1

    return converted, {
        "edgeResidueReplaced": replaced,
        "edgeAlphaSoftened": softened_alpha,
    }


def alpha_bbox(image: Image.Image, threshold: int = 10) -> tuple[int, int, int, int] | None:
    mask = image.getchannel("A").point(lambda value: 255 if value > threshold else 0)
    return mask.getbbox()


def frame_records(sheet: Image.Image, columns: int, rows: int, cell_size: int) -> Iterable[dict]:
    for row in range(rows):
        for column in range(columns):
            frame = sheet.crop((
                column * cell_size,
                row * cell_size,
                (column + 1) * cell_size,
                (row + 1) * cell_size,
            ))
            bbox = alpha_bbox(frame)
            yield {
                "row": row,
                "column": column,
                "frame": frame,
                "bbox": bbox,
                "width": 0 if bbox is None else bbox[2] - bbox[0],
                "height": 0 if bbox is None else bbox[3] - bbox[1],
            }


def component_bboxes(image: Image.Image, threshold: int = 10) -> list[dict]:
    width, height = image.size
    alpha = image.getchannel("A")
    data = alpha.load()
    seen: set[tuple[int, int]] = set()
    components: list[dict] = []

    for start_y in range(height):
        for start_x in range(width):
            if (start_x, start_y) in seen or data[start_x, start_y] <= threshold:
                continue

            queue: deque[tuple[int, int]] = deque([(start_x, start_y)])
            seen.add((start_x, start_y))
            min_x = max_x = start_x
            min_y = max_y = start_y
            area = 0
            sum_x = 0
            sum_y = 0

            while queue:
                x, y = queue.popleft()
                area += 1
                sum_x += x
                sum_y += y
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)

                for next_y in (y - 1, y, y + 1):
                    for next_x in (x - 1, x, x + 1):
                        if next_x == x and next_y == y:
                            continue
                        if next_x < 0 or next_y < 0 or next_x >= width or next_y >= height:
                            continue
                        if (next_x, next_y) in seen or data[next_x, next_y] <= threshold:
                            continue
                        seen.add((next_x, next_y))
                        queue.append((next_x, next_y))

            if area >= 10:
                components.append({
                    "bbox": (min_x, min_y, max_x + 1, max_y + 1),
                    "area": area,
                    "center": (sum_x / area, sum_y / area),
                })

    return components


def guided_frame_record(
    sheet: Image.Image,
    row: int,
    column: int,
    columns: int,
    rows: int,
    cell_size: int,
    overlap: int,
) -> dict:
    sheet_width, sheet_height = sheet.size
    cell_left = column * cell_size
    cell_top = row * cell_size
    expected_center = (cell_left + cell_size / 2, cell_top + cell_size / 2)
    window_left = max(0, cell_left - overlap)
    window_top = max(0, cell_top - overlap)
    window_right = min(sheet_width, (column + 1) * cell_size + overlap)
    window_bottom = min(sheet_height, (row + 1) * cell_size + overlap)
    window = sheet.crop((window_left, window_top, window_right, window_bottom))

    components = component_bboxes(window)
    if not components:
        frame = sheet.crop((cell_left, cell_top, cell_left + cell_size, cell_top + cell_size))
        bbox = alpha_bbox(frame)
        return {"row": row, "column": column, "frame": frame, "bbox": bbox, "width": 0 if bbox is None else bbox[2] - bbox[0], "height": 0 if bbox is None else bbox[3] - bbox[1]}

    def score(component: dict) -> float:
        center_x = component["center"][0] + window_left
        center_y = component["center"][1] + window_top
        distance = abs(center_x - expected_center[0]) + abs(center_y - expected_center[1])
        return component["area"] - distance * 6

    primary = max(components, key=score)
    primary_center = primary["center"]
    merged = [primary]
    for component in components:
        if component is primary:
            continue
        dx = abs(component["center"][0] - primary_center[0])
        dy = abs(component["center"][1] - primary_center[1])
        if component["area"] > 18 and dx < 110 and dy < 96:
            merged.append(component)

    min_x = min(component["bbox"][0] for component in merged)
    min_y = min(component["bbox"][1] for component in merged)
    max_x = max(component["bbox"][2] for component in merged)
    max_y = max(component["bbox"][3] for component in merged)
    margin = 3
    min_x = max(0, min_x - margin)
    min_y = max(0, min_y - margin)
    max_x = min(window.width, max_x + margin)
    max_y = min(window.height, max_y + margin)
    bbox = (min_x, min_y, max_x, max_y)
    frame = window

    return {
        "row": row,
        "column": column,
        "frame": frame,
        "bbox": bbox,
        "width": bbox[2] - bbox[0],
        "height": bbox[3] - bbox[1],
    }


def normalize_sheet(
    source: Path,
    output: Path,
    columns: int = 4,
    rows: int = 4,
    cell_size: int = 256,
    target_width: int = 212,
    target_height: int = 166,
    foot_line: int = 202,
    overlap: int = 72,
) -> dict:
    image = Image.open(source).convert("RGBA")
    image = remove_chroma_key(image)
    sheet_size = cell_size * columns
    image = image.resize((sheet_size, cell_size * rows), Image.Resampling.LANCZOS)

    records = [
        guided_frame_record(image, row, column, columns, rows, cell_size, overlap)
        for row in range(rows)
        for column in range(columns)
    ]
    max_width = max((record["width"] for record in records), default=0)
    max_height = max((record["height"] for record in records), default=0)
    scale = min(
        target_width / max_width if max_width else 1,
        target_height / max_height if max_height else 1,
        1,
    )

    normalized = Image.new("RGBA", (sheet_size, cell_size * rows), (0, 0, 0, 0))
    report = {
        "source": str(source),
        "output": str(output),
        "columns": columns,
        "rows": rows,
        "cellSize": cell_size,
        "scale": round(scale, 4),
        "sourceMaxBounds": {"width": max_width, "height": max_height},
        "frames": [],
    }

    for record in records:
        row = record["row"]
        column = record["column"]
        bbox = record["bbox"]
        if bbox is None:
            continue

        crop = record["frame"].crop(bbox)
        resized_width = max(1, round(crop.width * scale))
        resized_height = max(1, round(crop.height * scale))
        crop = crop.resize((resized_width, resized_height), Image.Resampling.LANCZOS)

        # Upright rows share a fixed contact line. Death frames are centered vertically
        # because they are usually lying down and should not be forced to stand.
        paste_x = column * cell_size + (cell_size - resized_width) // 2
        if row in (0, 1, 2):
            paste_y = row * cell_size + max(8, min(cell_size - resized_height - 8, foot_line - resized_height))
        else:
            paste_y = row * cell_size + (cell_size - resized_height) // 2

        normalized.alpha_composite(crop, (paste_x, paste_y))

        final_frame = normalized.crop((
            column * cell_size,
            row * cell_size,
            (column + 1) * cell_size,
            (row + 1) * cell_size,
        ))
        final_bbox = alpha_bbox(final_frame)
        margins = None
        if final_bbox is not None:
            margins = {
                "left": final_bbox[0],
                "top": final_bbox[1],
                "right": cell_size - final_bbox[2],
                "bottom": cell_size - final_bbox[3],
            }

        report["frames"].append({
            "row": row,
            "column": column,
            "sourceBbox": bbox,
            "finalBbox": final_bbox,
            "margins": margins,
        })

    output.parent.mkdir(parents=True, exist_ok=True)
    normalized, edge_report = repair_edge_residue(normalized)
    normalized.save(output, "PNG")
    report["edgeCleanup"] = edge_report
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description="Normalize a 4x4 generated sprite sheet for EVOLUTION ZERO.")
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--report", type=Path)
    parser.add_argument("--columns", type=int, default=4)
    parser.add_argument("--rows", type=int, default=4)
    parser.add_argument("--cell-size", type=int, default=256)
    parser.add_argument("--target-width", type=int, default=212)
    parser.add_argument("--target-height", type=int, default=166)
    parser.add_argument("--foot-line", type=int, default=202)
    parser.add_argument("--overlap", type=int, default=72)
    args = parser.parse_args()

    report = normalize_sheet(
        source=args.input,
        output=args.output,
        columns=args.columns,
        rows=args.rows,
        cell_size=args.cell_size,
        target_width=args.target_width,
        target_height=args.target_height,
        foot_line=args.foot_line,
        overlap=args.overlap,
    )

    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print(json.dumps({
        "output": str(args.output),
        "scale": report["scale"],
        "sourceMaxBounds": report["sourceMaxBounds"],
        "frames": len(report["frames"]),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
