import argparse
import json
from pathlib import Path

from PIL import Image, ImageEnhance


READABILITY_PRESETS = {
    "jungle": {
        "brightness": 1.28,
        "contrast": 1.04,
        "color": 1.13,
        "note": "Lift dark greens while keeping blue-green mist and ground detail subdued.",
    },
    "volcano": {
        "brightness": 1.20,
        "contrast": 1.01,
        "color": 1.10,
        "note": "Raise red-brown terrain readability without over-amplifying lava glow.",
    },
    "swamp": {
        "brightness": 1.48,
        "contrast": 1.02,
        "color": 1.22,
        "note": "Correct the darkest tile and reveal toxic yellow-green / blue-green surface cues.",
    },
    "ruins": {
        "brightness": 1.22,
        "contrast": 1.02,
        "color": 1.10,
        "note": "Lift grey-purple terrain detail for combat readability.",
    },
}


def crop_square(image):
    width, height = image.size
    side = min(width, height)
    left = (width - side) // 2
    top = (height - side) // 2
    return image.crop((left, top, left + side, top + side))


def blend_pixel(a, b, t):
    return tuple(int(a[i] * (1 - t) + b[i] * t) for i in range(3)) + (255,)


def soften_tile_edges(image, band):
    image = image.convert("RGBA")
    pixels = image.load()
    width, height = image.size

    for offset in range(band):
        t = (offset + 1) / (band + 1)
        left_x = offset
        right_x = width - band + offset
        for y in range(height):
            left = pixels[left_x, y]
            right = pixels[right_x, y]
            shared = blend_pixel(left, right, 0.5)
            pixels[left_x, y] = blend_pixel(shared, left, t * 0.45)
            pixels[right_x, y] = blend_pixel(shared, right, t * 0.45)

    for offset in range(band):
        t = (offset + 1) / (band + 1)
        top_y = offset
        bottom_y = height - band + offset
        for x in range(width):
            top = pixels[x, top_y]
            bottom = pixels[x, bottom_y]
            shared = blend_pixel(top, bottom, 0.5)
            pixels[x, top_y] = blend_pixel(shared, top, t * 0.45)
            pixels[x, bottom_y] = blend_pixel(shared, bottom, t * 0.45)

    return image


def tune_for_readability(image, brightness, contrast, color):
    image = ImageEnhance.Brightness(image).enhance(brightness)
    image = ImageEnhance.Contrast(image).enhance(contrast)
    image = ImageEnhance.Color(image).enhance(color)
    return image


def main():
    parser = argparse.ArgumentParser(description="Prepare generated battlefield backgrounds as readable loop tiles.")
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--report", required=True)
    parser.add_argument("--size", type=int, default=1024)
    parser.add_argument("--edge-band", type=int, default=96)
    parser.add_argument("--preset", choices=sorted(READABILITY_PRESETS.keys()), default=None)
    parser.add_argument("--brightness", type=float, default=None)
    parser.add_argument("--contrast", type=float, default=None)
    parser.add_argument("--color", type=float, default=None)
    args = parser.parse_args()

    preset = READABILITY_PRESETS.get(args.preset, {})
    brightness = args.brightness if args.brightness is not None else preset.get("brightness", 0.64)
    contrast = args.contrast if args.contrast is not None else preset.get("contrast", 0.78)
    color = args.color if args.color is not None else preset.get("color", 0.74)

    source = Image.open(args.input).convert("RGBA")
    original_size = source.size
    tile = crop_square(source).resize((args.size, args.size), Image.Resampling.LANCZOS)
    tile = tune_for_readability(tile, brightness, contrast, color)
    tile = soften_tile_edges(tile, args.edge_band)

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    tile.save(output, "PNG")

    report = {
        "input": str(args.input),
        "output": str(args.output),
        "preset": args.preset,
        "originalSize": {"width": original_size[0], "height": original_size[1]},
        "outputSize": {"width": args.size, "height": args.size},
        "edgeBand": args.edge_band,
        "readabilityTuning": {
            "brightness": brightness,
            "contrast": contrast,
            "color": color,
        },
        "note": preset.get("note", "Low-contrast combat background tile. Edge blending is intentionally mild to preserve battlefield readability."),
    }
    report_path = Path(args.report)
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print(json.dumps({"output": str(output), "size": args.size, "edgeBand": args.edge_band}, ensure_ascii=False))


if __name__ == "__main__":
    main()
