from argparse import ArgumentParser
from pathlib import Path

from PIL import Image


OUTPUTS = [
    ("card_frame.png", (70, 40, 400, 545), (82, 144)),
    ("card_frame_selected.png", (455, 40, 815, 545), (82, 144)),
    ("card_frame_locked.png", (850, 40, 1195, 545), (82, 144)),
    ("badge_danger.png", (245, 575, 610, 730), (82, 26)),
    ("badge_adaptation.png", (650, 575, 990, 730), (92, 26)),
    ("deploy_type_button.png", (35, 755, 425, 920), (64, 44)),
    ("deploy_type_button_selected.png", (425, 750, 835, 925), (64, 44)),
    ("deploy_type_button_locked.png", (820, 755, 1215, 920), (64, 44)),
    ("detail_panel.png", (130, 925, 1125, 1210), (346, 230)),
]

STRETCH_TO_SIZE = {
    "deploy_type_button.png",
    "deploy_type_button_selected.png",
    "deploy_type_button_locked.png",
}


def remove_magenta(image):
    rgba = image.convert("RGBA")
    pixels = rgba.load()

    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, a = pixels[x, y]
            if r > 210 and g < 80 and b > 210:
                pixels[x, y] = (r, g, b, 0)

    return rgba


def trim_alpha(image, padding=8):
    pixels = image.load()
    left = image.width
    top = image.height
    right = 0
    bottom = 0

    for y in range(image.height):
        for x in range(image.width):
            if pixels[x, y][3] > 8:
                left = min(left, x)
                top = min(top, y)
                right = max(right, x)
                bottom = max(bottom, y)

    if right <= left or bottom <= top:
        return image

    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(image.width, right + padding + 1)
    bottom = min(image.height, bottom + padding + 1)
    return image.crop((left, top, right, bottom))


def fit_to_canvas(image, size):
    target_w, target_h = size
    scale = min(target_w / image.width, target_h / image.height)
    resized = image.resize(
        (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    canvas.alpha_composite(
        resized,
        ((target_w - resized.width) // 2, (target_h - resized.height) // 2),
    )
    return canvas


def main():
    parser = ArgumentParser(description="Extract MVP-071 generated stage select UI atlas.")
    parser.add_argument("--input", required=True)
    parser.add_argument("--output-dir", required=True)
    args = parser.parse_args()

    source = Image.open(args.input).convert("RGBA")
    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    for name, box, size in OUTPUTS:
        crop = source.crop(box)
        alpha = remove_magenta(crop)
        trimmed = trim_alpha(alpha)
        if name in STRETCH_TO_SIZE:
            fitted = trimmed.resize(size, Image.Resampling.LANCZOS)
        else:
            fitted = fit_to_canvas(trimmed, size)
        fitted.save(out_dir / name)

    print({"source": args.input, "output_dir": str(out_dir), "count": len(OUTPUTS)})


if __name__ == "__main__":
    main()
