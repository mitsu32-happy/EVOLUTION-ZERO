from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "assets" / "ui" / "stage_select"


def rounded_asset(size, radius, fill, stroke, stroke_width=2, glow=None):
    pad = 12
    image = Image.new("RGBA", (size[0] + pad * 2, size[1] + pad * 2), (0, 0, 0, 0))
    base = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(base)
    box = (pad, pad, pad + size[0] - 1, pad + size[1] - 1)

    if glow:
        glow_layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
        glow_draw = ImageDraw.Draw(glow_layer)
        glow_draw.rounded_rectangle(box, radius=radius, outline=glow, width=4)
        image.alpha_composite(glow_layer.filter(ImageFilter.GaussianBlur(7)))

    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=stroke, width=stroke_width)
    inner = (box[0] + 4, box[1] + 4, box[2] - 4, box[3] - 4)
    draw.rounded_rectangle(inner, radius=max(2, radius - 3), outline=(255, 255, 255, 22), width=1)
    image.alpha_composite(base)
    return image.crop((pad, pad, pad + size[0], pad + size[1]))


def save(name, image):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    image.save(OUT_DIR / name)


def main():
    save(
        "card_frame.png",
        rounded_asset((82, 144), 9, (5, 13, 14, 214), (66, 98, 103, 150), 2),
    )
    save(
        "card_frame_selected.png",
        rounded_asset((82, 144), 9, (8, 18, 19, 232), (255, 199, 57, 230), 3, (255, 199, 57, 90)),
    )
    save(
        "card_frame_locked.png",
        rounded_asset((82, 144), 9, (4, 7, 8, 196), (95, 65, 72, 120), 2),
    )
    save(
        "badge_danger.png",
        rounded_asset((82, 26), 7, (34, 7, 8, 220), (255, 77, 56, 190), 2, (255, 77, 56, 55)),
    )
    save(
        "badge_adaptation.png",
        rounded_asset((92, 26), 7, (5, 21, 22, 220), (53, 215, 255, 170), 2, (53, 215, 255, 45)),
    )
    save(
        "deploy_type_button.png",
        rounded_asset((64, 44), 8, (6, 14, 15, 222), (64, 94, 99, 145), 2),
    )
    save(
        "deploy_type_button_selected.png",
        rounded_asset((64, 44), 8, (20, 9, 5, 235), (255, 199, 57, 225), 3, (255, 199, 57, 80)),
    )
    save(
        "deploy_type_button_locked.png",
        rounded_asset((64, 44), 8, (4, 7, 8, 180), (100, 66, 72, 105), 2),
    )
    save(
        "detail_panel.png",
        rounded_asset((346, 230), 12, (5, 14, 16, 224), (255, 77, 56, 118), 2, (53, 215, 255, 28)),
    )


if __name__ == "__main__":
    main()
