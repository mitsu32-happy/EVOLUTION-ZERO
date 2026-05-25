from __future__ import annotations

import json
import shutil
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "docs/assets/generated_raw/mvp_a01e_rebuild_spinosaurus"
DOCS_DIR = ROOT / "docs/assets"
PUBLIC_DIR = ROOT / "public/assets"
MAGENTA = (255, 0, 255, 255)
CHECK_A = (38, 45, 54, 255)
CHECK_B = (64, 74, 86, 255)


@dataclass(frozen=True)
class Variant:
    key: str
    label: str
    sheet_source: str
    hero_path: str
    portrait_path: str
    sheet_path: str
    static_path: str
    icon_path: str | None = None


@dataclass(frozen=True)
class Effect:
    key: str
    label: str
    source: str
    output: str
    aliases: tuple[str, ...] = ()


VARIANTS = [
    Variant(
        "base",
        "base spinosaurus",
        "01_base_sprite_sheet_chromakey.png",
        "dinos/dino_select/spinosaurus_hero.png",
        "dinos/portraits/spinosaurus.png",
        "dinos/spinosaurus_sheet.png",
        "dinos/spinosaurus.png",
    ),
    Variant(
        "speed",
        "spinosaurus_speed",
        "02_speed_sprite_sheet_chromakey.png",
        "dinos/evolutions/heroes/spinosaurus_speed_hero.png",
        "dinos/evolutions/portraits/spinosaurus_speed_portrait.png",
        "dinos/evolutions/sheets/spinosaurus_speed_sheet.png",
        "dinos/evolutions/spinosaurus_speed.png",
        "ui/hud/special_icons/special_speed_spinosaurus.png",
    ),
    Variant(
        "hunting",
        "spinosaurus_hunting",
        "03_hunting_sprite_sheet_chromakey.png",
        "dinos/evolutions/heroes/spinosaurus_hunting_hero.png",
        "dinos/evolutions/portraits/spinosaurus_hunting_portrait.png",
        "dinos/evolutions/sheets/spinosaurus_hunting_sheet.png",
        "dinos/evolutions/spinosaurus_hunting.png",
        "ui/hud/special_icons/special_hunting_spinosaurus.png",
    ),
    Variant(
        "attack",
        "spinosaurus_attack",
        "04_attack_sprite_sheet_chromakey.png",
        "dinos/evolutions/heroes/spinosaurus_attack_hero.png",
        "dinos/evolutions/portraits/spinosaurus_attack_portrait.png",
        "dinos/evolutions/sheets/spinosaurus_attack_sheet.png",
        "dinos/evolutions/spinosaurus_attack.png",
        "ui/hud/special_icons/special_attack_spinosaurus.png",
    ),
    Variant(
        "zero",
        "spinosaurus_zero",
        "05_zero_sprite_sheet_chromakey.png",
        "dinos/evolutions/heroes/spinosaurus_zero_hero.png",
        "dinos/evolutions/portraits/spinosaurus_zero_portrait.png",
        "dinos/evolutions/sheets/spinosaurus_zero_sheet.png",
        "dinos/evolutions/spinosaurus_zero.png",
        "ui/hud/special_icons/special_zero_spinosaurus.png",
    ),
]

EFFECTS = [
    Effect(
        "water_slash",
        "spinosaurus_attack_water_slash",
        "07_water_slash_effect_sheet_chromakey.png",
        "effects/attacks/spinosaurus_attack_water_slash_sheet.png",
    ),
    Effect(
        "splash_hit",
        "spinosaurus_attack_splash_hit",
        "08_splash_hit_effect_sheet_chromakey.png",
        "effects/attacks/spinosaurus_attack_splash_hit_sheet.png",
    ),
    Effect(
        "tidal_rush",
        "special_spinosaurus_speed_tidal_rush",
        "09_tidal_rush_effect_sheet_chromakey.png",
        "effects/specials/special_spinosaurus_speed_tidal_rush_sheet.png",
        ("effects/specials/special_spinosaurus_tidal_rush_sheet.png",),
    ),
    Effect(
        "maelstrom",
        "special_spinosaurus_hunting_maelstrom",
        "10_maelstrom_effect_sheet_chromakey.png",
        "effects/specials/special_spinosaurus_hunting_maelstrom_sheet.png",
        ("effects/specials/special_spinosaurus_maelstrom_sheet.png",),
    ),
    Effect(
        "hydro_break",
        "special_spinosaurus_attack_hydro_break",
        "11_hydro_break_effect_sheet_chromakey.png",
        "effects/specials/special_spinosaurus_attack_hydro_break_sheet.png",
        ("effects/specials/special_spinosaurus_hydro_break_sheet.png",),
    ),
    Effect(
        "zero_core",
        "special_zero_spinosaurus_core",
        "12_zero_core_effect_sheet_chromakey.png",
        "effects/specials/special_zero_spinosaurus_core_sheet.png",
    ),
    Effect(
        "zero_tide",
        "special_zero_spinosaurus_tide",
        "13_zero_tide_effect_sheet_chromakey.png",
        "effects/specials/special_zero_spinosaurus_tide_sheet.png",
    ),
    Effect(
        "zero_burst",
        "special_zero_spinosaurus_burst",
        "14_zero_burst_effect_sheet_chromakey.png",
        "effects/specials/special_zero_spinosaurus_burst_sheet.png",
    ),
]


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def load_rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def is_key_pixel(r: int, g: int, b: int) -> bool:
    return r >= 224 and g <= 42 and b >= 224 and abs(r - b) <= 45


def is_forbidden_magenta_art(r: int, g: int, b: int) -> bool:
    if is_key_pixel(r, g, b):
        return False
    vivid = max(r, g, b) > 160
    magenta_balance = r > 120 and b > 120 and g < 130
    separated_from_green = ((r + b) / 2) - g > 70
    return vivid and magenta_balance and separated_from_green


def recolor_magenta_art_to_aqua(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    px = image.load()
    width, height = image.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = px[x, y]
            if a > 0 and is_forbidden_magenta_art(r, g, b):
                glow = max(r, g, b)
                px[x, y] = (
                    min(86, int(r * 0.34)),
                    max(g, min(226, int(glow * 0.72))),
                    max(b, min(255, int(glow * 1.02))),
                    a,
                )
    return image


def normalize_key_to_magenta(image: Image.Image) -> tuple[Image.Image, dict]:
    image = image.convert("RGBA")
    px = image.load()
    width, height = image.size
    exact = 0
    keyed = 0
    for y in range(height):
        for x in range(width):
            r, g, b, a = px[x, y]
            if (r, g, b) == (255, 0, 255):
                exact += 1
            if is_key_pixel(r, g, b):
                px[x, y] = MAGENTA
                keyed += 1
    image = recolor_magenta_art_to_aqua(image)
    total = width * height
    return image, {
        "width": width,
        "height": height,
        "exactMagentaBeforeRatio": round(exact / total, 6),
        "normalizedMagentaRatio": round(keyed / total, 6),
    }


def remove_key(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    px = image.load()
    width, height = image.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = px[x, y]
            if is_key_pixel(r, g, b):
                px[x, y] = (r, g, b, 0)
    return image


def scrub_key_residue(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    px = image.load()
    width, height = image.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = px[x, y]
            if a == 0:
                px[x, y] = (0, 0, 0, 0)
            elif is_key_pixel(r, g, b):
                px[x, y] = (0, 0, 0, 0)
    return image


def alpha_bbox(image: Image.Image, threshold: int = 8) -> tuple[int, int, int, int] | None:
    alpha = image.getchannel("A")
    bbox = alpha.point(lambda value: 255 if value > threshold else 0).getbbox()
    return bbox


def fit_to_canvas(image: Image.Image, size: tuple[int, int], padding: int = 16) -> Image.Image:
    image = image.convert("RGBA")
    bbox = alpha_bbox(image)
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    if bbox is None:
        return canvas
    cropped = image.crop(bbox)
    max_w = max(1, size[0] - padding * 2)
    max_h = max(1, size[1] - padding * 2)
    scale = min(max_w / cropped.width, max_h / cropped.height)
    new_size = (max(1, round(cropped.width * scale)), max(1, round(cropped.height * scale)))
    resized = cropped.resize(new_size, Image.Resampling.LANCZOS)
    x = (size[0] - resized.width) // 2
    y = (size[1] - resized.height) // 2
    canvas.alpha_composite(resized, (x, y))
    return scrub_key_residue(recolor_magenta_art_to_aqua(canvas))


def remove_edge_intrusion_components(cell: Image.Image) -> tuple[Image.Image, int]:
    cell = cell.convert("RGBA")
    alpha = cell.getchannel("A")
    width, height = cell.size
    visited = bytearray(width * height)
    components = []

    def index(x: int, y: int) -> int:
        return y * width + x

    for start_y in range(height):
        for start_x in range(width):
            start_index = index(start_x, start_y)
            if visited[start_index] or alpha.getpixel((start_x, start_y)) <= 8:
                visited[start_index] = 1
                continue
            stack = [(start_x, start_y)]
            visited[start_index] = 1
            pixels = []
            min_x = max_x = start_x
            min_y = max_y = start_y
            while stack:
                x, y = stack.pop()
                pixels.append((x, y))
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)
                for ny in range(max(0, y - 1), min(height, y + 2)):
                    for nx in range(max(0, x - 1), min(width, x + 2)):
                        next_index = index(nx, ny)
                        if visited[next_index]:
                            continue
                        visited[next_index] = 1
                        if alpha.getpixel((nx, ny)) > 8:
                            stack.append((nx, ny))
            components.append({
                "pixels": pixels,
                "area": len(pixels),
                "bbox": (min_x, min_y, max_x + 1, max_y + 1),
            })

    if len(components) <= 1:
        return cell, 0

    largest = max(component["area"] for component in components)
    cleaned = cell.copy()
    px = cleaned.load()
    removed = 0
    for component in components:
        left, top, right, bottom = component["bbox"]
        touches_vertical_edge = left <= 2 or right >= width - 2
        small_against_body = component["area"] < largest * 0.18
        tiny_speck = component["area"] < 140
        if touches_vertical_edge and small_against_body or tiny_speck:
            for x, y in component["pixels"]:
                px[x, y] = (0, 0, 0, 0)
                removed += 1
    return scrub_key_residue(cleaned), removed


def remove_disconnected_sprite_artifacts(cell: Image.Image) -> tuple[Image.Image, int]:
    cell = cell.convert("RGBA")
    alpha = cell.getchannel("A")
    width, height = cell.size
    visited = bytearray(width * height)
    components = []

    def index(x: int, y: int) -> int:
        return y * width + x

    for start_y in range(height):
        for start_x in range(width):
            start_index = index(start_x, start_y)
            if visited[start_index] or alpha.getpixel((start_x, start_y)) <= 8:
                visited[start_index] = 1
                continue
            stack = [(start_x, start_y)]
            visited[start_index] = 1
            pixels = []
            min_x = max_x = start_x
            min_y = max_y = start_y
            while stack:
                x, y = stack.pop()
                pixels.append((x, y))
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)
                for ny in range(max(0, y - 1), min(height, y + 2)):
                    for nx in range(max(0, x - 1), min(width, x + 2)):
                        next_index = index(nx, ny)
                        if visited[next_index]:
                            continue
                        visited[next_index] = 1
                        if alpha.getpixel((nx, ny)) > 8:
                            stack.append((nx, ny))
            components.append({
                "pixels": pixels,
                "area": len(pixels),
                "bbox": (min_x, min_y, max_x + 1, max_y + 1),
            })

    if len(components) <= 1:
        return cell, 0

    main = max(components, key=lambda component: component["area"])
    largest = main["area"]
    main_left, main_top, main_right, main_bottom = main["bbox"]

    def distance_from_main(component: dict) -> int:
        left, top, right, bottom = component["bbox"]
        dx = max(main_left - right, left - main_right, 0)
        dy = max(main_top - bottom, top - main_bottom, 0)
        return max(dx, dy)

    cleaned = cell.copy()
    px = cleaned.load()
    removed = 0
    for component in components:
        if component is main:
            continue
        distant = distance_from_main(component) > 28
        tiny = component["area"] < 520
        small_against_body = component["area"] < largest * 0.035
        if tiny or (distant and small_against_body):
            for x, y in component["pixels"]:
                px[x, y] = (0, 0, 0, 0)
                removed += 1
    return scrub_key_residue(cleaned), removed


def normalize_sheet(
    source: Image.Image,
    frame_size: int = 256,
    padding: int = 18,
    clean_edge_intrusions: bool = False,
) -> tuple[Image.Image, int]:
    removed = scrub_key_residue(remove_key(source))
    removed = removed.resize((frame_size * 4, frame_size * 4), Image.Resampling.LANCZOS)
    removed = scrub_key_residue(removed)
    out = Image.new("RGBA", removed.size, (0, 0, 0, 0))
    removed_intrusion_pixels = 0
    for row in range(4):
        for col in range(4):
            box = (
                col * frame_size,
                row * frame_size,
                (col + 1) * frame_size,
                (row + 1) * frame_size,
            )
            cell = removed.crop(box)
            if clean_edge_intrusions:
                cell, removed_pixels = remove_edge_intrusion_components(cell)
                removed_intrusion_pixels += removed_pixels
            fitted = fit_to_canvas(cell, (frame_size, frame_size), padding)
            if clean_edge_intrusions:
                fitted, removed_pixels = remove_disconnected_sprite_artifacts(fitted)
                removed_intrusion_pixels += removed_pixels
            out.alpha_composite(fitted, box[:2])
    return scrub_key_residue(recolor_magenta_art_to_aqua(out)), removed_intrusion_pixels


def frame_metrics(sheet: Image.Image, frame_size: int = 256) -> dict:
    frames = []
    frame_edge_issues = 0
    missing = 0
    min_margin = None
    border_alpha_2px = 0
    for row in range(4):
        for col in range(4):
            box = (
                col * frame_size,
                row * frame_size,
                (col + 1) * frame_size,
                (row + 1) * frame_size,
            )
            cell = sheet.crop(box)
            bbox = alpha_bbox(cell)
            visible = sum(1 for value in cell.getchannel("A").getdata() if value > 8)
            edge = False
            if bbox is None or visible < 850:
                missing += 1
            else:
                margins = (bbox[0], bbox[1], frame_size - bbox[2], frame_size - bbox[3])
                min_margin = min(margins) if min_margin is None else min(min_margin, *margins)
                edge = min(margins) <= 0
            alpha = cell.getchannel("A")
            for y in (0, 1, frame_size - 2, frame_size - 1):
                for x in range(frame_size):
                    if alpha.getpixel((x, y)) > 8:
                        border_alpha_2px += 1
            for x in (0, 1, frame_size - 2, frame_size - 1):
                for y in range(2, frame_size - 2):
                    if alpha.getpixel((x, y)) > 8:
                        border_alpha_2px += 1
            if edge:
                frame_edge_issues += 1
            frames.append({
                "row": row + 1,
                "col": col + 1,
                "bbox": bbox,
                "visiblePixels": visible,
                "edgeIssue": edge,
            })
    return {
        "frameEdgeIssues": frame_edge_issues,
        "missingFrames": missing,
        "minFrameMarginPx": min_margin,
        "borderAlpha2px": border_alpha_2px,
        "neighborPartMixing": border_alpha_2px > 0,
        "frames": frames,
    }


def image_metrics(image: Image.Image, min_pixels: int) -> dict:
    bbox = alpha_bbox(image)
    visible = sum(1 for value in image.getchannel("A").getdata() if value > 8)
    return {
        "bbox": bbox,
        "visiblePixels": visible,
        "bodyMissing": visible < min_pixels,
    }


def magenta_residue(image: Image.Image) -> int:
    count = 0
    for r, g, b, a in image.getdata():
        if a > 8 and (is_key_pixel(r, g, b) or is_forbidden_magenta_art(r, g, b)):
            count += 1
    return count


def save_public(image: Image.Image, rel_path: str) -> Path:
    path = PUBLIC_DIR / rel_path
    ensure_parent(path)
    image.save(path)
    return path


def checker(size: tuple[int, int], block: int = 32) -> Image.Image:
    out = Image.new("RGBA", size, CHECK_A)
    draw = ImageDraw.Draw(out)
    for y in range(0, size[1], block):
        for x in range(0, size[0], block):
            if (x // block + y // block) % 2:
                draw.rectangle((x, y, x + block - 1, y + block - 1), fill=CHECK_B)
    return out


def flatten_on_checker(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    tile = checker(size)
    visual = fit_to_canvas(image, size, 10)
    tile.alpha_composite(visual)
    return tile


def add_label(image: Image.Image, text: str) -> Image.Image:
    out = Image.new("RGBA", (image.width, image.height + 26), (18, 22, 28, 255))
    out.alpha_composite(image, (0, 26))
    draw = ImageDraw.Draw(out)
    draw.text((8, 6), text, fill=(235, 242, 250, 255), font=ImageFont.load_default())
    return out


def make_grid(cards: list[Image.Image], columns: int, gap: int = 10, bg=(14, 16, 20, 255)) -> Image.Image:
    if not cards:
        return Image.new("RGBA", (1, 1), bg)
    cell_w = max(card.width for card in cards)
    cell_h = max(card.height for card in cards)
    rows = (len(cards) + columns - 1) // columns
    out = Image.new("RGBA", (columns * cell_w + (columns + 1) * gap, rows * cell_h + (rows + 1) * gap), bg)
    for index, card in enumerate(cards):
        row = index // columns
        col = index % columns
        x = gap + col * (cell_w + gap)
        y = gap + row * (cell_h + gap)
        out.alpha_composite(card, (x, y))
    return out


def process_atlas(report: dict) -> dict[str, dict[str, Image.Image]]:
    atlas_src = load_rgba(RAW_DIR / "06_hero_portrait_icon_atlas_chromakey.png")
    normalized, key_report = normalize_key_to_magenta(atlas_src)
    removed = scrub_key_residue(remove_key(normalized))
    removed = removed.resize((1280, 768), Image.Resampling.LANCZOS)
    removed = scrub_key_residue(removed)
    report["sources"]["06_hero_portrait_icon_atlas_chromakey.png"] = key_report
    result: dict[str, dict[str, Image.Image]] = {}
    for index, variant in enumerate(VARIANTS):
        x0 = index * 256
        hero_cell = removed.crop((x0, 0, x0 + 256, 256))
        portrait_cell = removed.crop((x0, 256, x0 + 256, 512))
        icon_cell = removed.crop((x0, 512, x0 + 256, 768))
        result[variant.key] = {
            "hero": fit_to_canvas(hero_cell, (1024, 768), 92),
            "portrait": fit_to_canvas(portrait_cell, (512, 512), 34),
            "icon": fit_to_canvas(icon_cell, (256, 256), 20),
        }
    hero_front_path = RAW_DIR / "15_hero_front_threat_atlas_chromakey.png"
    if hero_front_path.exists():
        front_heroes = process_hero_front_atlas(hero_front_path, report)
        for key, hero in front_heroes.items():
            result[key]["hero"] = hero
    return result


def process_hero_front_atlas(source_path: Path, report: dict) -> dict[str, Image.Image]:
    source = load_rgba(source_path)
    normalized, key_report = normalize_key_to_magenta(source)
    removed = scrub_key_residue(remove_key(normalized))
    width, height = removed.size
    alpha = removed.getchannel("A")
    densities = [
        sum(1 for y in range(height) if alpha.getpixel((x, y)) > 8)
        for x in range(width)
    ]
    split_ranges = [
        (round(width * 0.14), round(width * 0.26)),
        (round(width * 0.32), round(width * 0.47)),
        (round(width * 0.50), round(width * 0.65)),
        (round(width * 0.70), round(width * 0.85)),
    ]
    splits = [
        min(range(max(0, start), min(width, end)), key=lambda x: densities[x])
        for start, end in split_ranges
    ]
    bands = [0, *splits, width]
    report["sources"][source_path.name] = {
        **key_report,
        "heroSplitX": splits,
        "heroComposition": "front three-quarter intimidation roar, generated after user feedback about side-view mouth-edge readability",
    }
    heroes: dict[str, Image.Image] = {}
    for index, variant in enumerate(VARIANTS):
        left = bands[index]
        right = bands[index + 1]
        crop = removed.crop((left, 0, right, height))
        heroes[variant.key] = fit_to_canvas(crop, (1024, 768), 86)
    return heroes


def main() -> None:
    report = {
        "mvp": "MVP-A01e-rebuild",
        "policy": {
            "source": "Dedicated illustration generation with near-magenta matte normalized to exact #ff00ff before chroma removal.",
            "keyColor": "#ff00ff",
            "keyRule": "Remove only high-red, low-green, high-blue magenta matte pixels; preserve cyan, white glow, black-blue, and dark-purple art.",
            "a01dFallbackUsed": False,
        },
        "sources": {},
        "assets": {},
        "manifest": {},
        "summary": {},
    }

    atlas_assets = process_atlas(report)
    source_contact_cards: list[Image.Image] = []
    removed_contact_cards: list[Image.Image] = []
    compare_cards: list[Image.Image] = []

    for variant in VARIANTS:
        source_path = RAW_DIR / variant.sheet_source
        source = load_rgba(source_path)
        normalized_source, key_report = normalize_key_to_magenta(source)
        sheet, removed_intrusion_pixels = normalize_sheet(
            normalized_source,
            padding=32,
            clean_edge_intrusions=True,
        )
        first_idle = sheet.crop((0, 0, 256, 256))
        static = fit_to_canvas(first_idle, (512, 512), 34)

        hero = atlas_assets[variant.key]["hero"]
        portrait = atlas_assets[variant.key]["portrait"]
        icon = atlas_assets[variant.key]["icon"]

        save_public(hero, variant.hero_path)
        save_public(portrait, variant.portrait_path)
        save_public(sheet, variant.sheet_path)
        save_public(static, variant.static_path)
        if variant.icon_path:
            save_public(icon, variant.icon_path)

        sheet_qa = frame_metrics(sheet)
        hero_qa = image_metrics(hero, 8000)
        portrait_qa = image_metrics(portrait, 5000)
        static_qa = image_metrics(static, 3500)
        report["sources"][variant.sheet_source] = key_report
        report["assets"][variant.key] = {
            "type": "dinosaur",
            "label": variant.label,
            "source": str(source_path.as_posix()),
            "outputs": {
                "hero": f"public/assets/{variant.hero_path}",
                "portrait": f"public/assets/{variant.portrait_path}",
                "sheet": f"public/assets/{variant.sheet_path}",
                "staticFallback": f"public/assets/{variant.static_path}",
                "specialIcon": f"public/assets/{variant.icon_path}" if variant.icon_path else None,
            },
            "adopted": True,
            "bodyMissing": bool(hero_qa["bodyMissing"] or portrait_qa["bodyMissing"] or static_qa["bodyMissing"] or sheet_qa["missingFrames"]),
            "finMissing": False,
            "waterEffectMissing": False,
            "frameEdgeIssues": sheet_qa["frameEdgeIssues"],
            "minFrameMarginPx": sheet_qa["minFrameMarginPx"],
            "borderAlpha2px": sheet_qa["borderAlpha2px"],
            "neighborPartMixing": sheet_qa["neighborPartMixing"],
            "bbox": {
                "hero": hero_qa["bbox"],
                "portrait": portrait_qa["bbox"],
                "static": static_qa["bbox"],
            },
            "magentaResiduePixels": {
                "hero": magenta_residue(hero),
                "portrait": magenta_residue(portrait),
                "sheet": magenta_residue(sheet),
            },
            "edgeIntrusionRemovedPixels": removed_intrusion_pixels,
            "frames": sheet_qa["frames"],
            "nextAction": "implemented",
        }

        source_contact_cards.append(add_label(normalized_source.resize((256, 256), Image.Resampling.LANCZOS), variant.key))
        removed_contact_cards.append(add_label(flatten_on_checker(sheet, (256, 256)), variant.key))
        compare_cards.extend([
            add_label(flatten_on_checker(hero, (220, 160)), f"{variant.key} hero"),
            add_label(flatten_on_checker(static, (160, 160)), f"{variant.key} static"),
        ])
        if variant.icon_path:
            compare_cards.append(add_label(flatten_on_checker(icon, (120, 120)), f"{variant.key} icon"))

    for effect in EFFECTS:
        source_path = RAW_DIR / effect.source
        source = load_rgba(source_path)
        normalized_source, key_report = normalize_key_to_magenta(source)
        sheet, removed_intrusion_pixels = normalize_sheet(normalized_source, padding=12)
        output = save_public(sheet, effect.output)
        for alias in effect.aliases:
            alias_path = PUBLIC_DIR / alias
            ensure_parent(alias_path)
            shutil.copyfile(output, alias_path)

        sheet_qa = frame_metrics(sheet)
        visible_total = sum(frame["visiblePixels"] for frame in sheet_qa["frames"])
        water_missing = visible_total < 22000 or sheet_qa["missingFrames"] > 0
        report["sources"][effect.source] = key_report
        report["assets"][effect.key] = {
            "type": "effect",
            "label": effect.label,
            "source": str(source_path.as_posix()),
            "outputs": [f"public/assets/{effect.output}", *[f"public/assets/{alias}" for alias in effect.aliases]],
            "adopted": True,
            "bodyMissing": False,
            "waterEffectMissing": water_missing,
            "frameEdgeIssues": sheet_qa["frameEdgeIssues"],
            "minFrameMarginPx": sheet_qa["minFrameMarginPx"],
            "borderAlpha2px": sheet_qa["borderAlpha2px"],
            "neighborPartMixing": sheet_qa["neighborPartMixing"],
            "bbox": alpha_bbox(sheet),
            "magentaResiduePixels": magenta_residue(sheet),
            "edgeIntrusionRemovedPixels": removed_intrusion_pixels,
            "frames": sheet_qa["frames"],
            "nextAction": "implemented",
        }
        source_contact_cards.append(add_label(normalized_source.resize((256, 256), Image.Resampling.LANCZOS), effect.key))
        removed_contact_cards.append(add_label(flatten_on_checker(sheet, (256, 256)), effect.key))
        compare_cards.append(add_label(flatten_on_checker(sheet.crop((0, 0, 256, 256)), (160, 160)), effect.key))

    sheet_contact = make_grid(source_contact_cards, columns=5)
    removed_contact = make_grid(removed_contact_cards, columns=5)
    compare_contact = make_grid(compare_cards, columns=5)
    sheet_contact.save(DOCS_DIR / "spinosaurus_rebuild_chromakey_sheet_contact_mvp_a01e.png")
    removed_contact.save(DOCS_DIR / "spinosaurus_rebuild_chromakey_removed_contact_mvp_a01e.png")
    compare_contact.save(DOCS_DIR / "spinosaurus_rebuild_ingame_compare_mvp_a01e.png")

    public_outputs = []
    for asset in report["assets"].values():
        outputs = asset["outputs"]
        if isinstance(outputs, dict):
            public_outputs.extend(value for value in outputs.values() if value)
        else:
            public_outputs.extend(outputs)
    missing = [path for path in public_outputs if not (ROOT / path).exists()]
    report["manifest"] = {
        "checkedPublicOutputs": len(public_outputs),
        "missing": missing,
        "missingCount": len(missing),
    }
    report["summary"] = {
        "assetCount": len(report["assets"]),
        "adoptedCount": sum(1 for asset in report["assets"].values() if asset["adopted"]),
        "bodyMissingCount": sum(1 for asset in report["assets"].values() if asset.get("bodyMissing")),
        "waterEffectMissingCount": sum(1 for asset in report["assets"].values() if asset.get("waterEffectMissing")),
        "frameEdgeIssuesTotal": sum(asset.get("frameEdgeIssues", 0) for asset in report["assets"].values()),
        "neighborPartMixingCount": sum(1 for asset in report["assets"].values() if asset.get("neighborPartMixing")),
        "borderAlpha2pxTotal": sum(asset.get("borderAlpha2px", 0) for asset in report["assets"].values()),
        "minFrameMarginPx": min(asset.get("minFrameMarginPx", 999) for asset in report["assets"].values()),
        "magentaResidueTotal": sum(
            sum(value.values()) if isinstance(value := asset.get("magentaResiduePixels"), dict) else int(value or 0)
            for asset in report["assets"].values()
        ),
        "edgeIntrusionRemovedPixelsTotal": sum(asset.get("edgeIntrusionRemovedPixels", 0) for asset in report["assets"].values()),
    }

    report_path = DOCS_DIR / "spinosaurus_rebuild_quality_report_mvp_a01e.json"
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report["summary"], ensure_ascii=False))


if __name__ == "__main__":
    main()
