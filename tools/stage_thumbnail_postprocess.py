import argparse
import json
from pathlib import Path

from PIL import Image, ImageEnhance


def crop_to_aspect(image, aspect_width, aspect_height):
    width, height = image.size
    target_ratio = aspect_width / aspect_height
    current_ratio = width / height

    if current_ratio > target_ratio:
      new_width = int(height * target_ratio)
      left = (width - new_width) // 2
      return image.crop((left, 0, left + new_width, height))

    new_height = int(width / target_ratio)
    top = (height - new_height) // 2
    return image.crop((0, top, width, top + new_height))


def main():
    parser = argparse.ArgumentParser(description="Prepare generated stage thumbnails for card UI.")
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--report", required=True)
    parser.add_argument("--width", type=int, default=1024)
    parser.add_argument("--height", type=int, default=576)
    parser.add_argument("--brightness", type=float, default=0.86)
    parser.add_argument("--contrast", type=float, default=0.9)
    parser.add_argument("--color", type=float, default=0.86)
    args = parser.parse_args()

    source = Image.open(args.input).convert("RGBA")
    original_size = source.size
    thumbnail = crop_to_aspect(source, args.width, args.height)
    thumbnail = thumbnail.resize((args.width, args.height), Image.Resampling.LANCZOS)
    thumbnail = ImageEnhance.Brightness(thumbnail).enhance(args.brightness)
    thumbnail = ImageEnhance.Contrast(thumbnail).enhance(args.contrast)
    thumbnail = ImageEnhance.Color(thumbnail).enhance(args.color)

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    thumbnail.save(output, "PNG")

    report = {
        "input": str(args.input),
        "output": str(args.output),
        "originalSize": {"width": original_size[0], "height": original_size[1]},
        "outputSize": {"width": args.width, "height": args.height},
        "readabilityTuning": {
            "brightness": args.brightness,
            "contrast": args.contrast,
            "color": args.color,
        },
        "note": "Stage-select thumbnail. More atmospheric than combat backgrounds, with overlay readability handled in UI.",
    }
    report_path = Path(args.report)
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print(json.dumps({"output": str(output), "width": args.width, "height": args.height}, ensure_ascii=False))


if __name__ == "__main__":
    main()
