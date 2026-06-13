from __future__ import annotations

from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "public" / "assets" / "companions"
DOC_ASSET_DIR = ROOT / "docs" / "assets"
CELL = 384

IDS = [
    "raptorling",
    "spino_pup",
    "medic_saur",
    "ptera_chick",
    "tricera_calf",
    "para_juvenile",
    "stego_calf",
    "rex_hatchling",
    "compy_pack",
    "exp_chaser",
]

MOTION_PROFILES = {
    "raptorling": [(-10, 4, -7, 1.05, 0.96), (0, -8, -2, 0.96, 1.06), (11, 3, 7, 1.05, 0.96), (0, -4, 2, 0.98, 1.03)],
    "spino_pup": [(-7, 3, -4, 1.03, 0.98), (0, -5, -1, 0.98, 1.04), (8, 3, 4, 1.03, 0.98), (0, -3, 1, 0.99, 1.02)],
    "medic_saur": [(-5, 2, -2, 1.02, 0.99), (0, -3, 0, 0.99, 1.02), (5, 2, 2, 1.02, 0.99), (0, -2, 0, 1.0, 1.01)],
    "tricera_calf": [(-7, 3, -2, 1.03, 0.98), (0, -4, 0, 0.98, 1.03), (8, 3, 2, 1.03, 0.98), (0, -2, 0, 0.99, 1.02)],
    "para_juvenile": [(-8, 4, -5, 1.04, 0.97), (0, -6, -1, 0.97, 1.05), (9, 3, 5, 1.04, 0.97), (0, -3, 1, 0.99, 1.03)],
    "stego_calf": [(-6, 3, -3, 1.03, 0.98), (0, -4, 0, 0.98, 1.03), (7, 3, 3, 1.03, 0.98), (0, -2, 0, 0.99, 1.02)],
    "rex_hatchling": [(-10, 4, -5, 1.05, 0.97), (0, -7, -1, 0.97, 1.05), (11, 3, 5, 1.05, 0.97), (0, -3, 1, 0.99, 1.03)],
    "ptera_chick": [(-4, -10, -8, 1.08, 0.92), (0, -2, 0, 0.94, 1.1), (5, 8, 8, 1.08, 0.92), (0, -4, 0, 0.96, 1.06)],
    "compy_pack": [(-10, 4, -6, 1.04, 0.96), (2, -7, 2, 0.97, 1.06), (11, 3, 6, 1.04, 0.96), (-1, -4, -1, 0.99, 1.03)],
    "exp_chaser": [(-5, -8, -6, 0.96, 1.06), (2, -1, 4, 1.05, 0.97), (6, 8, 7, 0.97, 1.05), (0, -3, -2, 1.03, 0.99)],
}


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    bbox = image.getchannel("A").getbbox()
    if bbox:
        return bbox
    return (96, 96, 288, 288)


def remove_stray_alpha_components(image: Image.Image, companion_id: str) -> Image.Image:
    width, height = image.size
    alpha = image.getchannel("A")
    pixels = alpha.load()
    visited = set()
    keep = Image.new("L", image.size, 0)
    keep_pixels = keep.load()

    components = []
    for y in range(height):
        for x in range(width):
            if (x, y) in visited or pixels[x, y] <= 18:
                continue

            stack = [(x, y)]
            visited.add((x, y))
            component = []
            while stack:
                px, py = stack.pop()
                component.append((px, py))
                for nx, ny in ((px + 1, py), (px - 1, py), (px, py + 1), (px, py - 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    if (nx, ny) in visited or pixels[nx, ny] <= 18:
                        continue
                    visited.add((nx, ny))
                    stack.append((nx, ny))

            components.append(component)

    if not components:
        return image

    components.sort(key=len, reverse=True)
    largest_area = len(components[0])
    for index, component in enumerate(components):
        area = len(component)
        should_keep = index == 0
        if companion_id == "compy_pack" and area >= max(1800, int(largest_area * 0.12)):
            should_keep = True
        if should_keep:
            for px, py in component:
                keep_pixels[px, py] = 255

    cleaned = image.copy()
    cleaned.putalpha(Image.composite(alpha, Image.new("L", image.size, 0), keep))
    return cleaned


def clean_subject(companion_id: str) -> Image.Image:
    source = Image.open(ASSET_DIR / f"{companion_id}_sprite_p04.png").convert("RGBA")
    source = remove_stray_alpha_components(source, companion_id)
    bbox = alpha_bbox(source)
    pad = 18
    crop = source.crop((
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(source.width, bbox[2] + pad),
        min(source.height, bbox[3] + pad),
    ))
    return crop


def place_subject(subject: Image.Image, dx: int, dy: int, rotate: float, scale_x: float, scale_y: float) -> Image.Image:
    width = max(1, int(subject.width * scale_x))
    height = max(1, int(subject.height * scale_y))
    frame_subject = subject.resize((width, height), Image.Resampling.BICUBIC)
    frame_subject = frame_subject.rotate(rotate, expand=True, resample=Image.Resampling.BICUBIC)

    frame = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
    x = int((CELL - frame_subject.width) / 2 + dx)
    y = int((CELL - frame_subject.height) / 2 + dy)
    frame.alpha_composite(frame_subject, (x, y))
    return frame


def make_motion_frames(companion_id: str) -> list[Image.Image]:
    subject = clean_subject(companion_id)
    frames = []
    for dx, dy, rotate, scale_x, scale_y in MOTION_PROFILES[companion_id]:
        frames.append(place_subject(subject, dx, dy, rotate, scale_x, scale_y))
    return frames


def write_sheet(companion_id: str) -> None:
    source_sheet = Image.open(ASSET_DIR / f"{companion_id}_sprite_sheet_p04e.png").convert("RGBA")
    output = source_sheet.copy()
    frames = make_motion_frames(companion_id)
    for index, frame in enumerate(frames):
        output.paste(Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0)), (index * CELL, CELL))
        output.paste(frame, (index * CELL, CELL), frame)
    output.save(ASSET_DIR / f"{companion_id}_sprite_sheet_p04g.png")


def make_contact(ids: Iterable[str]) -> None:
    ids = list(ids)
    thumb = 160
    row_h = thumb + 24
    contact = Image.new("RGBA", (thumb * 4, row_h * len(ids)), (0, 0, 0, 255))
    for row_index, companion_id in enumerate(ids):
        sheet = Image.open(ASSET_DIR / f"{companion_id}_sprite_sheet_p04g.png").convert("RGBA")
        row = Image.new("RGBA", (thumb * 4, row_h), (10, 12, 16, 255))
        draw = ImageDraw.Draw(row)
        draw.text((4, 4), companion_id, fill=(220, 250, 255, 255))
        for col in range(4):
            frame = sheet.crop((col * CELL, CELL, (col + 1) * CELL, CELL * 2))
            frame.thumbnail((thumb, thumb), Image.Resampling.LANCZOS)
            tile = Image.new("RGBA", (thumb, thumb), (18, 18, 22, 255))
            tile.alpha_composite(frame, ((thumb - frame.width) // 2, (thumb - frame.height) // 2))
            row.alpha_composite(tile, (col * thumb, 24))
        contact.alpha_composite(row, (0, row_index * row_h))

    DOC_ASSET_DIR.mkdir(parents=True, exist_ok=True)
    contact.save(DOC_ASSET_DIR / "p04g_companion_walk_contact.png")


def main() -> None:
    for companion_id in IDS:
        write_sheet(companion_id)
    make_contact(IDS)
    print("generated", len(IDS), "P04g companion sheets")
    print((DOC_ASSET_DIR / "p04g_companion_walk_contact.png").resolve())


if __name__ == "__main__":
    main()
