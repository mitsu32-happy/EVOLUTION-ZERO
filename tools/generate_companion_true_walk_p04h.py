from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFilter


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

WALKING_IDS = {
    "raptorling",
    "spino_pup",
    "medic_saur",
    "tricera_calf",
    "para_juvenile",
    "stego_calf",
    "rex_hatchling",
}


@dataclass(frozen=True)
class Palette:
    body: tuple[int, int, int, int]
    shadow: tuple[int, int, int, int]
    glow: tuple[int, int, int, int]


PALETTES = {
    "raptorling": Palette((34, 58, 64, 255), (13, 25, 30, 230), (65, 245, 255, 210)),
    "spino_pup": Palette((34, 70, 76, 255), (10, 28, 35, 230), (42, 205, 255, 210)),
    "medic_saur": Palette((55, 115, 48, 255), (22, 56, 30, 230), (130, 255, 112, 210)),
    "tricera_calf": Palette((70, 78, 76, 255), (30, 35, 38, 235), (160, 205, 255, 205)),
    "para_juvenile": Palette((42, 80, 72, 255), (18, 42, 38, 230), (60, 235, 255, 210)),
    "stego_calf": Palette((58, 58, 72, 255), (24, 24, 34, 235), (185, 105, 255, 210)),
    "rex_hatchling": Palette((92, 48, 32, 255), (42, 22, 18, 235), (255, 205, 90, 210)),
    "compy_pack": Palette((55, 76, 48, 255), (22, 34, 20, 230), (255, 165, 72, 210)),
    "ptera_chick": Palette((60, 70, 72, 255), (24, 30, 34, 225), (125, 230, 255, 205)),
    "exp_chaser": Palette((70, 46, 105, 255), (28, 18, 52, 230), (205, 150, 255, 220)),
}

WALK_TRANSFORMS = {
    "raptorling": [(-8, -1, -4, 1.03, 0.99), (0, 5, 0, 1.0, 0.98), (9, -1, 4, 1.03, 0.99), (0, -7, 2, 0.99, 1.03)],
    "spino_pup": [(-7, 1, -3, 1.02, 1.0), (0, 6, 0, 1.0, 0.98), (8, 1, 3, 1.02, 1.0), (0, -5, 1, 0.99, 1.02)],
    "medic_saur": [(-5, 0, -2, 1.01, 1.0), (0, 4, 0, 1.0, 0.99), (5, 0, 2, 1.01, 1.0), (0, -4, 1, 1.0, 1.02)],
    "tricera_calf": [(-6, 2, -2, 1.02, 0.99), (0, 7, 0, 1.01, 0.97), (7, 2, 2, 1.02, 0.99), (0, -4, 1, 0.99, 1.02)],
    "para_juvenile": [(-7, -1, -4, 1.03, 0.99), (0, 5, 0, 1.0, 0.98), (8, -1, 4, 1.03, 0.99), (0, -6, 1, 0.99, 1.03)],
    "stego_calf": [(-6, 2, -2, 1.02, 0.99), (0, 6, 0, 1.01, 0.98), (7, 2, 2, 1.02, 0.99), (0, -4, 1, 0.99, 1.02)],
    "rex_hatchling": [(-8, -1, -4, 1.03, 0.99), (0, 6, 0, 1.01, 0.98), (9, -1, 4, 1.03, 0.99), (0, -7, 2, 0.99, 1.03)],
}


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    bbox = image.getchannel("A").getbbox()
    return bbox if bbox else (96, 96, 288, 288)


def connected_components(image: Image.Image) -> list[list[tuple[int, int]]]:
    alpha = image.getchannel("A")
    pixels = alpha.load()
    width, height = image.size
    visited = set()
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
    components.sort(key=len, reverse=True)
    return components


def remove_strays(image: Image.Image, companion_id: str) -> Image.Image:
    components = connected_components(image)
    if not components:
        return image
    keep = Image.new("L", image.size, 0)
    keep_pixels = keep.load()
    largest = len(components[0])
    for index, component in enumerate(components):
        area = len(component)
        should_keep = index == 0
        if companion_id == "compy_pack" and area >= max(1800, int(largest * 0.12)):
            should_keep = True
        if should_keep:
            for x, y in component:
                keep_pixels[x, y] = 255
    cleaned = image.copy()
    cleaned.putalpha(Image.composite(image.getchannel("A"), Image.new("L", image.size, 0), keep))
    return cleaned


def source_sprite(companion_id: str) -> Image.Image:
    image = Image.open(ASSET_DIR / f"{companion_id}_sprite_p04.png").convert("RGBA")
    image = remove_strays(image, companion_id)
    bbox = alpha_bbox(image)
    pad = 20
    return image.crop((
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(image.width, bbox[2] + pad),
        min(image.height, bbox[3] + pad),
    ))


def transform_subject(subject: Image.Image, dx: int, dy: int, rotate: float, sx: float, sy: float) -> Image.Image:
    transformed = subject.resize((max(1, int(subject.width * sx)), max(1, int(subject.height * sy))), Image.Resampling.BICUBIC)
    transformed = transformed.rotate(rotate, expand=True, resample=Image.Resampling.BICUBIC)
    frame = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
    frame.alpha_composite(transformed, (int((CELL - transformed.width) / 2 + dx), int((CELL - transformed.height) / 2 + dy)))
    return frame


def fade_original_legs(frame: Image.Image, companion_id: str) -> Image.Image:
    if companion_id not in WALKING_IDS:
        return frame
    bbox = alpha_bbox(frame)
    left, top, right, bottom = bbox
    width = right - left
    height = bottom - top
    mask = Image.new("L", frame.size, 0)
    draw = ImageDraw.Draw(mask)
    leg_top = top + int(height * (0.58 if companion_id in {"raptorling", "rex_hatchling", "para_juvenile", "medic_saur"} else 0.62))
    draw.rectangle((left + int(width * 0.24), leg_top, right - int(width * 0.10), bottom + 4), fill=230)
    if companion_id in {"tricera_calf", "stego_calf", "spino_pup"}:
        draw.rectangle((left + int(width * 0.08), leg_top + 4, right - int(width * 0.04), bottom + 4), fill=210)
    mask = mask.filter(ImageFilter.GaussianBlur(4))
    alpha = frame.getchannel("A")
    reduced = Image.eval(alpha, lambda value: int(value * 0.23))
    frame.putalpha(Image.composite(reduced, alpha, mask))
    return frame


def draw_tapered_limb(draw: ImageDraw.ImageDraw, hip: tuple[int, int], knee: tuple[int, int], foot: tuple[int, int], palette: Palette, width: int, front: bool) -> None:
    color = palette.body if front else palette.shadow
    glow = palette.glow
    draw.line((hip, knee, foot), fill=color, width=width, joint="curve")
    draw.line((hip, knee, foot), fill=(glow[0], glow[1], glow[2], 80 if front else 48), width=max(1, width // 3), joint="curve")
    fx, fy = foot
    draw.ellipse((fx - width, fy - max(3, width // 3), fx + width + 5, fy + max(3, width // 3)), fill=(glow[0], glow[1], glow[2], 105 if front else 58))
    draw.ellipse((fx - max(2, width // 3), fy - 2, fx + max(3, width // 3), fy + 2), fill=glow)


def draw_walk_legs(frame: Image.Image, companion_id: str, phase: int) -> None:
    bbox = alpha_bbox(frame)
    left, top, right, bottom = bbox
    width = right - left
    height = bottom - top
    palette = PALETTES[companion_id]
    draw = ImageDraw.Draw(frame, "RGBA")
    is_heavy = companion_id in {"spino_pup", "tricera_calf", "stego_calf"}
    limb_width = max(5, int(width * (0.045 if is_heavy else 0.035)))
    hip_y = top + int(height * (0.64 if companion_id in {"raptorling", "rex_hatchling", "para_juvenile", "medic_saur"} else 0.68))
    foot_y = bottom - max(5, int(height * 0.025))
    rear_hip = (left + int(width * 0.38), hip_y)
    front_hip = (left + int(width * 0.66), hip_y + (2 if is_heavy else 0))

    cycles = [
        {
            "front": ((front_hip[0] - 2, front_hip[1]), (left + int(width * 0.73), hip_y + int(height * 0.18)), (left + int(width * 0.86), foot_y)),
            "rear": ((rear_hip[0], rear_hip[1]), (left + int(width * 0.30), hip_y + int(height * 0.17)), (left + int(width * 0.22), foot_y - 1)),
        },
        {
            "front": ((front_hip[0], front_hip[1] + 3), (left + int(width * 0.60), hip_y + int(height * 0.20)), (left + int(width * 0.55), foot_y + 1)),
            "rear": ((rear_hip[0], rear_hip[1] + 2), (left + int(width * 0.48), hip_y + int(height * 0.17)), (left + int(width * 0.58), foot_y)),
        },
        {
            "front": ((front_hip[0], front_hip[1]), (left + int(width * 0.62), hip_y + int(height * 0.16)), (left + int(width * 0.50), foot_y)),
            "rear": ((rear_hip[0] + 2, rear_hip[1]), (left + int(width * 0.48), hip_y + int(height * 0.18)), (left + int(width * 0.72), foot_y - 1)),
        },
        {
            "front": ((front_hip[0], front_hip[1] - 1), (left + int(width * 0.78), hip_y + int(height * 0.15)), (left + int(width * 0.72), foot_y - int(height * 0.08))),
            "rear": ((rear_hip[0], rear_hip[1] - 1), (left + int(width * 0.25), hip_y + int(height * 0.20)), (left + int(width * 0.10), foot_y)),
        },
    ]
    pose = cycles[phase]
    draw_tapered_limb(draw, *pose["rear"], palette, max(4, limb_width - 1), False)
    draw_tapered_limb(draw, *pose["front"], palette, limb_width, True)
    if is_heavy:
        offset = int(width * 0.12)
        for key, front in (("rear", False), ("front", True)):
            hip, knee, foot = pose[key]
            draw_tapered_limb(
                draw,
                (hip[0] - offset, hip[1] + 2),
                (knee[0] - offset // 2, knee[1] + 3),
                (foot[0] - offset // 2, foot[1] + 1),
                palette,
                max(4, limb_width - 2),
                front,
            )


def make_walk_frames(companion_id: str) -> list[Image.Image]:
    subject = source_sprite(companion_id)
    frames = []
    for phase, params in enumerate(WALK_TRANSFORMS[companion_id]):
        frame = transform_subject(subject, *params)
        frame = fade_original_legs(frame, companion_id)
        draw_walk_legs(frame, companion_id, phase)
        frames.append(frame)
    return frames


def make_ptera_frames() -> list[Image.Image]:
    subject = source_sprite("ptera_chick")
    frames = []
    transforms = [(-2, -14, -8, 1.16, 0.82), (0, -4, 0, 0.88, 1.16), (3, 9, 8, 1.16, 0.82), (0, -5, 0, 0.94, 1.08)]
    for phase, params in enumerate(transforms):
        frame = transform_subject(subject, *params)
        bbox = alpha_bbox(frame)
        draw = ImageDraw.Draw(frame, "RGBA")
        wing_y = bbox[1] + int((bbox[3] - bbox[1]) * (0.40 if phase in {0, 2} else 0.62))
        draw.arc((bbox[0] - 24, wing_y - 44, bbox[2] + 26, wing_y + 58), 190, 350, fill=PALETTES["ptera_chick"].glow, width=3)
        frames.append(frame)
    return frames


def make_compy_frames() -> list[Image.Image]:
    base = source_sprite("compy_pack")
    parts = []
    for sx, sy, scale in [(-22, 8, 0.86), (22, -4, 0.86), (0, 0, 0.94)]:
        part = base.resize((max(1, int(base.width * scale)), max(1, int(base.height * scale))), Image.Resampling.BICUBIC)
        parts.append((part, sx, sy))
    phase_offsets = [
        [(-16, 4, -7), (8, -8, 4), (20, 0, 7)],
        [(6, -8, 2), (-18, 3, -5), (18, -4, 3)],
        [(18, 4, 7), (-8, -8, -4), (-20, 1, -7)],
        [(-4, -7, -2), (18, 3, 5), (-18, -4, -3)],
    ]
    frames = []
    for phase in range(4):
        frame = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
        for (part, sx, sy), (dx, dy, rot) in zip(parts, phase_offsets[phase]):
            moved = part.rotate(rot, expand=True, resample=Image.Resampling.BICUBIC)
            x = int((CELL - moved.width) / 2 + sx + dx)
            y = int((CELL - moved.height) / 2 + sy + dy)
            frame.alpha_composite(moved, (x, y))
        frames.append(frame)
    return frames


def make_exp_frames() -> list[Image.Image]:
    subject = source_sprite("exp_chaser")
    frames = []
    transforms = [(-4, -14, -9, 0.94, 1.08), (3, -4, 4, 1.06, 0.96), (6, 10, 9, 0.96, 1.06), (0, -4, -3, 1.04, 0.98)]
    for phase, params in enumerate(transforms):
        frame = transform_subject(subject, *params)
        bbox = alpha_bbox(frame)
        draw = ImageDraw.Draw(frame, "RGBA")
        cx = (bbox[0] + bbox[2]) // 2
        cy = (bbox[1] + bbox[3]) // 2
        radius = 38 + phase * 5
        draw.arc((cx - radius, cy - radius // 2, cx + radius, cy + radius // 2), 25 + phase * 45, 220 + phase * 45, fill=PALETTES["exp_chaser"].glow, width=3)
        for dot in range(3):
            x = cx + (dot - 1) * 22 + phase * 3
            y = cy - 42 + ((dot + phase) % 3) * 14
            draw.ellipse((x - 3, y - 3, x + 3, y + 3), fill=(185, 230, 255, 170))
        frames.append(frame)
    return frames


def make_motion_frames(companion_id: str) -> list[Image.Image]:
    if companion_id == "ptera_chick":
        return make_ptera_frames()
    if companion_id == "compy_pack":
        return make_compy_frames()
    if companion_id == "exp_chaser":
        return make_exp_frames()
    return make_walk_frames(companion_id)


def write_sheet(companion_id: str) -> None:
    source_sheet = Image.open(ASSET_DIR / f"{companion_id}_sprite_sheet_p04g.png").convert("RGBA")
    output = source_sheet.copy()
    frames = make_motion_frames(companion_id)
    for index, frame in enumerate(frames):
        output.paste(Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0)), (index * CELL, CELL))
        output.paste(frame, (index * CELL, CELL), frame)
    output.save(ASSET_DIR / f"{companion_id}_sprite_sheet_p04h.png")


def make_contact(ids: Iterable[str]) -> None:
    ids = list(ids)
    thumb = 160
    row_h = thumb + 24
    contact = Image.new("RGBA", (thumb * 4, row_h * len(ids)), (0, 0, 0, 255))
    for row_index, companion_id in enumerate(ids):
        sheet = Image.open(ASSET_DIR / f"{companion_id}_sprite_sheet_p04h.png").convert("RGBA")
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
    contact.save(DOC_ASSET_DIR / "p04h_companion_true_walk_contact.png")


def main() -> None:
    for companion_id in IDS:
        write_sheet(companion_id)
    make_contact(IDS)
    print("generated", len(IDS), "P04h true-walk sheets")
    print((DOC_ASSET_DIR / "p04h_companion_true_walk_contact.png").resolve())


if __name__ == "__main__":
    main()
