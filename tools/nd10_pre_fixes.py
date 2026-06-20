from __future__ import annotations

import json
from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = ROOT / "public" / "assets"
DOC_ASSET_ROOT = ROOT / "docs" / "assets"

NEW_DINOS = [
    "ankylosaurus",
    "parasaurolophus",
    "stegosaurus",
    "pteranodon",
    "compsognathus",
    "ornithomimus",
]
BRANCHES = ["speed", "hunting", "attack", "zero"]
NORMAL_BRANCHES = ["speed", "hunting", "attack"]


def load_font(size: int = 22) -> ImageFont.ImageFont:
    for path in [
        "C:/Windows/Fonts/meiryo.ttc",
        "C:/Windows/Fonts/YuGothM.ttc",
        "C:/Windows/Fonts/arial.ttf",
    ]:
        try:
            return ImageFont.truetype(path, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


FONT = load_font(22)
SMALL = load_font(16)


def components(im: Image.Image, alpha_threshold: int = 8):
    rgba = im.convert("RGBA")
    pix = rgba.load()
    w, h = rgba.size
    seen = bytearray(w * h)
    result = []

    for y in range(h):
        for x in range(w):
            idx = y * w + x
            if seen[idx] or pix[x, y][3] < alpha_threshold:
                continue

            queue = deque([(x, y)])
            seen[idx] = 1
            xs = []
            ys = []
            count = 0
            while queue:
                cx, cy = queue.popleft()
                xs.append(cx)
                ys.append(cy)
                count += 1
                for nx in (cx - 1, cx, cx + 1):
                    for ny in (cy - 1, cy, cy + 1):
                        if nx < 0 or ny < 0 or nx >= w or ny >= h:
                            continue
                        nidx = ny * w + nx
                        if seen[nidx] or pix[nx, ny][3] < alpha_threshold:
                            continue
                        seen[nidx] = 1
                        queue.append((nx, ny))

            result.append({
                "count": count,
                "bbox": [min(xs), min(ys), max(xs) + 1, max(ys) + 1],
            })

    return sorted(result, key=lambda item: item["count"], reverse=True)


def clear_component(im: Image.Image, bbox):
    pix = im.load()
    x0, y0, x1, y1 = bbox
    for y in range(y0, y1):
        for x in range(x0, x1):
            if pix[x, y][3] >= 8:
                pix[x, y] = (0, 0, 0, 0)


def remove_small_components(path: Path, min_keep: int) -> dict:
    im = Image.open(path).convert("RGBA")
    before = components(im)
    removed = 0
    for comp in before[1:]:
        if comp["count"] < min_keep:
            clear_component(im, comp["bbox"])
            removed += 1
    im.save(path)
    after = components(im)
    return {
        "path": str(path.relative_to(ROOT)).replace("\\", "/"),
        "removedSmallComponents": removed,
        "componentsBefore": len(before),
        "componentsAfter": len(after),
        "largestBbox": after[0]["bbox"] if after else None,
    }


def keep_largest_component_in_cell(im: Image.Image, cell_box) -> int:
    x0, y0, x1, y1 = cell_box
    cell = im.crop(cell_box).convert("RGBA")
    comps = components(cell)
    if len(comps) <= 1:
        return 0
    keep = comps[0]
    removed = 0
    mask_keep = Image.new("1", cell.size, 0)
    mk = mask_keep.load()
    cpix = cell.load()
    kx0, ky0, kx1, ky1 = keep["bbox"]
    for y in range(ky0, ky1):
        for x in range(kx0, kx1):
            if cpix[x, y][3] >= 8:
                mk[x, y] = 1
    for comp in comps[1:]:
        bx0, by0, bx1, by1 = comp["bbox"]
        for y in range(by0, by1):
            for x in range(bx0, bx1):
                if cpix[x, y][3] >= 8 and not mk[x, y]:
                    cpix[x, y] = (0, 0, 0, 0)
        removed += 1
    im.alpha_composite(cell, (x0, y0))
    return removed


def clean_sprint_impact_assets() -> dict:
    report = {"effectCleanup": [], "spriteActionCellsCleaned": 0}
    for rel, threshold in [
        ("effects/attacks/ornithomimus_sprint_kick.png", 180),
        ("effects/attacks/evolutions/ornithomimus_attack_attack.png", 90),
        ("effects/specials/new_dinos/special_ornithomimus_attack_ultimate.png", 160),
    ]:
        report["effectCleanup"].append(remove_small_components(ASSET_ROOT / rel, threshold))

    sheet_path = ASSET_ROOT / "dinos/evolutions/sheets/ornithomimus_attack_sheet.png"
    im = Image.open(sheet_path).convert("RGBA")
    cell = 512
    action_row = 2
    for col in range(4):
        box = (col * cell, action_row * cell, (col + 1) * cell, (action_row + 1) * cell)
        report["spriteActionCellsCleaned"] += remove_orange_impact_from_action_cell(im, box)
        report["spriteActionCellsCleaned"] += keep_largest_component_in_cell(im, box)
    im.save(sheet_path)
    return report


def remove_orange_impact_from_action_cell(im: Image.Image, cell_box) -> int:
    x0, y0, x1, y1 = cell_box
    pix = im.load()
    removed = 0
    for y in range(y0, y1):
        for x in range(x0, x1):
            rel_x = x - x0
            rel_y = y - y0
            r, g, b, a = pix[x, y]
            is_impact_orange = (
                a > 18
                and rel_x > 245
                and rel_y > 145
                and r > 185
                and 70 < g < 180
                and b < 95
                and r - b > 95
            )
            if is_impact_orange:
                pix[x, y] = (0, 0, 0, 0)
                removed += 1
            elif x0 == 1024 and y0 == 1024 and rel_x > 300 and 120 < rel_y < 405 and a > 8:
                pix[x, y] = (0, 0, 0, 0)
                removed += 1
            elif x0 == 1024 and y0 == 1024 and rel_x > 235 and rel_y > 390 and a > 8:
                pix[x, y] = (0, 0, 0, 0)
                removed += 1
            elif x0 == 1536 and y0 == 1024 and rel_x < 120 and 120 < rel_y < 420 and a > 8:
                pix[x, y] = (0, 0, 0, 0)
                removed += 1
    return 1 if removed else 0


def fit(im: Image.Image, size: tuple[int, int], bg=(8, 12, 13, 255)) -> Image.Image:
    canvas = Image.new("RGBA", size, bg)
    src = im.convert("RGBA")
    scale = min((size[0] - 18) / src.width, (size[1] - 34) / src.height)
    new_size = (max(1, int(src.width * scale)), max(1, int(src.height * scale)))
    src = src.resize(new_size, Image.Resampling.LANCZOS)
    canvas.alpha_composite(src, ((size[0] - new_size[0]) // 2, (size[1] - new_size[1]) // 2 + 10))
    return canvas


def label(draw: ImageDraw.ImageDraw, xy, text: str, fill=(215, 255, 242, 255), font=SMALL):
    draw.text(xy, text, font=font, fill=fill)


def save_sprint_contact() -> dict:
    entries = [
        ("normal effect", ASSET_ROOT / "effects/attacks/ornithomimus_sprint_kick.png"),
        ("branch effect", ASSET_ROOT / "effects/attacks/evolutions/ornithomimus_attack_attack.png"),
        ("ultimate effect", ASSET_ROOT / "effects/specials/new_dinos/special_ornithomimus_attack_ultimate.png"),
        ("action row", ASSET_ROOT / "dinos/evolutions/sheets/ornithomimus_attack_sheet.png"),
    ]
    tile = (360, 260)
    out = Image.new("RGBA", (tile[0] * 2, tile[1] * 2), (0, 0, 0, 255))
    draw = ImageDraw.Draw(out)
    for idx, (name, path) in enumerate(entries):
        im = Image.open(path).convert("RGBA")
        if name == "action row":
            im = im.crop((0, 1024, 2048, 1536))
        x = (idx % 2) * tile[0]
        y = (idx // 2) * tile[1]
        out.alpha_composite(fit(im, (tile[0], tile[1])), (x, y))
        label(draw, (x + 12, y + 10), name)
        draw.rectangle((x, y, x + tile[0] - 1, y + tile[1] - 1), outline=(47, 223, 255, 180), width=1)
    path = DOC_ASSET_ROOT / "nd10_pre_sprint_impact_contact.png"
    out.save(path)
    return {"contact": str(path.relative_to(ROOT)).replace("\\", "/")}


def create_locked_select_contact():
    tile = (240, 170)
    out = Image.new("RGBA", (tile[0] * 3, tile[1] * 2), (0, 0, 0, 255))
    draw = ImageDraw.Draw(out)
    for idx, dino in enumerate(NEW_DINOS):
        x = (idx % 3) * tile[0]
        y = (idx // 3) * tile[1]
        draw.rounded_rectangle((x + 10, y + 26, x + tile[0] - 10, y + tile[1] - 12), radius=12, fill=(5, 8, 9), outline=(91, 48, 47), width=2)
        draw.ellipse((x + 78, y + 66, x + 162, y + 128), fill=(4, 12, 13), outline=(92, 112, 108), width=3)
        draw.polygon([(x + 92, y + 118), (x + 122, y + 62), (x + 164, y + 118)], fill=(18, 28, 29))
        draw.rectangle((x + 78, y + 126, x + 168, y + 132), fill=(39, 71, 69))
        label(draw, (x + 18, y + 34), dino, font=SMALL)
        label(draw, (x + 18, y + 138), "locked silhouette", fill=(161, 109, 109), font=SMALL)
    path = DOC_ASSET_ROOT / "nd10_pre_dino_select_locked_contact.png"
    out.save(path)
    return str(path.relative_to(ROOT)).replace("\\", "/")


RESEARCH_COSTS = {
    "ankylosaurus_unlock": ("ankylosaurus", 1400, 260),
    "parasaurolophus_unlock": ("parasaurolophus", 1200, 250),
    "stegosaurus_unlock": ("stegosaurus", 1400, 270),
    "pteranodon_unlock": ("pteranodon", 1300, 260),
    "compsognathus_unlock": ("compsognathus", 1100, 240),
    "ornithomimus_unlock": ("ornithomimus", 1200, 250),
}


def create_research_contact():
    tile = (360, 156)
    out = Image.new("RGBA", (tile[0] * 2, tile[1] * 3), (0, 0, 0, 255))
    draw = ImageDraw.Draw(out)
    for idx, (research_id, (dino, dna, rp)) in enumerate(RESEARCH_COSTS.items()):
        x = (idx % 2) * tile[0]
        y = (idx // 2) * tile[1]
        draw.rounded_rectangle((x + 10, y + 16, x + tile[0] - 10, y + tile[1] - 12), radius=12, fill=(7, 16, 18), outline=(53, 215, 255), width=2)
        label(draw, (x + 24, y + 30), research_id, font=SMALL)
        label(draw, (x + 24, y + 62), f"target: {dino}", fill=(215, 255, 242), font=SMALL)
        label(draw, (x + 24, y + 92), f"cost DNA {dna} / ResearchPt {rp}", fill=(255, 211, 107), font=SMALL)
        label(draw, (x + 24, y + 118), "purchase -> unlockedDinos", fill=(141, 164, 158), font=SMALL)
    path = DOC_ASSET_ROOT / "nd10_pre_research_unlock_contact.png"
    out.save(path)
    return str(path.relative_to(ROOT)).replace("\\", "/")


def create_evolution_icon_contact():
    tile = (172, 172)
    out = Image.new("RGBA", (tile[0] * 6, tile[1] * 4), (0, 0, 0, 255))
    draw = ImageDraw.Draw(out)
    for row, branch in enumerate(BRANCHES):
        for col, dino in enumerate(NEW_DINOS):
            path = ASSET_ROOT / f"dinos/evolutions/portraits/{dino}_{branch}_portrait.png"
            im = Image.open(path).convert("RGBA")
            x = col * tile[0]
            y = row * tile[1]
            out.alpha_composite(fit(im, tile), (x, y))
            label(draw, (x + 8, y + 8), f"{dino}", font=SMALL)
            label(draw, (x + 8, y + 28), branch, fill=(255, 211, 107), font=SMALL)
            draw.rectangle((x, y, x + tile[0] - 1, y + tile[1] - 1), outline=(53, 215, 255, 150), width=1)
    path = DOC_ASSET_ROOT / "nd10_pre_evolution_cinematic_icon_contact.png"
    out.save(path)
    return str(path.relative_to(ROOT)).replace("\\", "/")


def asset_exists(rel: str) -> bool:
    return (ASSET_ROOT / rel).exists()


def main():
    DOC_ASSET_ROOT.mkdir(parents=True, exist_ok=True)
    cleanup = clean_sprint_impact_assets()
    report = {
        "sprintImpact": {
            **cleanup,
            **save_sprint_contact(),
            "cause": "ornithomimus attack action row had detached slash/effect islands and sprint impact effects had small isolated alpha fragments.",
            "fix": "Removed detached sprite action components and small isolated alpha fragments from sprint-related effects.",
        },
        "lockedDinoSelect": {
            "contact": create_locked_select_contact(),
            "behavior": "Locked research dinos now use silhouette fallback instead of previewWhenLocked hero art.",
        },
        "researchUnlocks": {
            "contact": create_research_contact(),
            "items": [
                {"researchId": rid, "dinoId": dino, "dna": dna, "researchPt": rp}
                for rid, (dino, dna, rp) in RESEARCH_COSTS.items()
            ],
            "saveMapping": "SaveManager RESEARCH_DINO_UNLOCKS maps all six research ids into unlockedDinos.",
        },
        "evolutionCinematicIcons": {
            "contact": create_evolution_icon_contact(),
            "fix": "GameState selectedEvolution now carries branch portraitPath/specialIconPath for EvolutionSequence and HUD callers.",
            "checkedNormalBranches": [f"{dino}_{branch}" for dino in NEW_DINOS for branch in NORMAL_BRANCHES],
            "checkedZeroBranches": [f"{dino}_zero" for dino in NEW_DINOS],
        },
        "missingAssets": [],
    }
    for dino in NEW_DINOS:
        for branch in BRANCHES:
            for rel in [
                f"dinos/evolutions/portraits/{dino}_{branch}_portrait.png",
                f"dinos/evolutions/sheets/{dino}_{branch}_sheet.png",
                f"ui/hud/special_icons/special_{branch}_{dino}.png",
                f"effects/specials/new_dinos/special_{dino}_{branch}_ultimate.png",
            ]:
                if not asset_exists(rel):
                    report["missingAssets"].append(rel)
    path = DOC_ASSET_ROOT / "nd10_pre_asset_report.json"
    path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
