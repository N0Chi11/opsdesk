#!/usr/bin/env python3
"""生成 OpsDesk 的原创几何品牌图标及平台派生资源。

图标由本文件中的基础几何形状确定性生成，不依赖第三方 Logo、字体或外部
位图素材。运行时只需要 Pillow；ICNS 使用 PNG 图层按 Apple 公开容器格式
写出，因此 Windows 也可以执行资源生成和校验。
"""

from __future__ import annotations

import struct
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "static" / "assets" / "console-app-icon.png"
ASSETS = ROOT / "static" / "assets"
ICNS = ROOT / "总控台.app" / "Contents" / "Resources" / "AppIcon.icns"

ICNS_SIZES = (
    (16, "icp4"),
    (32, "icp5"),
    (48, "icp6"),
    (128, "ic07"),
    (256, "ic08"),
    (512, "ic09"),
    (1024, "ic10"),
)


def brand_source(size: int = 1254) -> Image.Image:
    """Return the original OpsDesk mark as a transparent RGBA image."""
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    s = float(size)
    scale = lambda value: max(1, round(value * s))

    # Dark rounded tile with a restrained blue border.
    outer = scale(0.07)
    draw.rounded_rectangle(
        (outer, outer, size - outer, size - outer),
        radius=scale(0.22),
        fill="#0b1220",
        outline="#31425f",
        width=scale(0.014),
    )

    # Open rounded orbit: a visual shorthand for services moving through a desk.
    orbit = (scale(0.23), scale(0.25), scale(0.77), scale(0.75))
    draw.rounded_rectangle(
        orbit,
        radius=scale(0.16),
        outline="#5b9dff",
        width=scale(0.055),
    )

    # Original geometric signal path and three status nodes.
    path = [
        (scale(0.27), scale(0.61)),
        (scale(0.43), scale(0.61)),
        (scale(0.57), scale(0.43)),
        (scale(0.74), scale(0.43)),
    ]
    draw.line(path, fill="#e6edf3", width=scale(0.045), joint="curve")
    for x, y, color in (
        (0.27, 0.61, "#5b9dff"),
        (0.57, 0.43, "#a78bfa"),
        (0.74, 0.43, "#f5b544"),
    ):
        radius = scale(0.065)
        cx, cy = scale(x), scale(y)
        draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=color)

    # Small center cut gives the mark a clean, app-icon-ready focal point.
    radius = scale(0.018)
    center = scale(0.50)
    draw.ellipse(
        (center - radius, center - radius, center + radius, center + radius),
        fill="#0b1220",
    )
    return image


def resized(source: Image.Image, size: int) -> Image.Image:
    return source.resize((size, size), Image.Resampling.LANCZOS)


def write_icns(source: Image.Image) -> None:
    """Write a minimal PNG-backed ICNS container without platform tools."""
    entries = []
    for size, type_code in ICNS_SIZES:
        buffer = BytesIO()
        resized(source, size).save(buffer, format="PNG", optimize=True)
        payload = buffer.getvalue()
        entries.append(
            type_code.encode("ascii")
            + struct.pack(">I", len(payload) + 8)
            + payload
        )
    body = b"".join(entries)
    ICNS.write_bytes(b"icns" + struct.pack(">I", len(body) + 8) + body)


def main() -> None:
    source = brand_source()
    source.save(SOURCE, format="PNG", optimize=True)
    source.save(ASSETS / "brand-mark.png", format="PNG", optimize=True)

    resized(source, 32).save(ASSETS / "favicon-32.png", optimize=True)
    resized(source, 180).save(ASSETS / "apple-touch-icon.png", optimize=True)
    source.save(
        ASSETS / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )

    write_icns(source)

    print(f"已生成 {ASSETS / 'favicon.ico'}")
    print(f"已生成 {ASSETS / 'favicon-32.png'}")
    print(f"已生成 {ASSETS / 'apple-touch-icon.png'}")
    print(f"已生成 {SOURCE}")
    print(f"已生成 {ASSETS / 'brand-mark.png'}")
    print(f"已生成 {ICNS}")


if __name__ == "__main__":
    main()
