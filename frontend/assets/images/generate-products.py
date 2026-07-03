#!/usr/bin/env python3
"""
Генератор индивидальных изображений для каждой карточки товара «Плюши».
Стилизованные под мягкие игрушки, с акцентами из описания (бантики, шарфы,
свитера, цвета).
"""
import math
import os
import random
from PIL import Image, ImageDraw, ImageFilter, ImageChops


def radial_gradient(size, center_color, edge_color):
    w, h = size
    img = Image.new("RGB", size, edge_color)
    draw = ImageDraw.Draw(img)
    cx, cy = w // 2, h // 2
    max_r = math.hypot(cx, cy)
    for r in range(int(max_r), -1, -1):
        t = r / max_r
        c = tuple(int(center_color[i] * (1 - t) + edge_color[i] * t) for i in range(3))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=c)
    return img


def make_noise(size, intensity=14):
    w, h = size
    noise = Image.new("RGB", (w // 2, h // 2))
    px = noise.load()
    for y in range(noise.height):
        for x in range(noise.width):
            v = random.randint(-intensity, intensity)
            px[x, y] = (128 + v, 128 + v, 128 + v)
    noise = noise.resize(size, Image.BILINEAR)
    return noise.filter(ImageFilter.GaussianBlur(radius=0.8))


def add_fabric_texture(img, intensity=14):
    noise = make_noise(img.size, intensity)
    return ImageChops.screen(img, noise)


def soft_blob(size, color, bbox, blur=10):
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x1, y1, x2, y2 = bbox
    ox = size[0] * 0.018
    oy = size[1] * 0.028
    draw.ellipse((x1 + ox, y1 + oy, x2 + ox, y2 + oy), fill=(60, 50, 75, 55))
    draw.ellipse(bbox, fill=color + (255,))
    hx1 = x1 + (x2 - x1) * 0.22
    hy1 = y1 + (y2 - y1) * 0.14
    hx2 = x1 + (x2 - x1) * 0.52
    hy2 = y1 + (y2 - y1) * 0.42
    hl = tuple(min(255, int(c * 1.18)) for c in color)
    draw.ellipse((hx1, hy1, hx2, hy2), fill=hl + (200,))
    return layer.filter(ImageFilter.GaussianBlur(radius=blur))


def canvas(bg_from, bg_to, s=600):
    img = radial_gradient((s, s), bg_from, bg_to)
    img = add_fabric_texture(img, 12)
    return img.convert("RGBA")


def vignette(img, s=600):
    v = radial_gradient((s, s), (255, 255, 255), (240, 235, 245))
    return Image.blend(img.convert("RGB"), v, 0.10)


def save(img, path, s=600):
    img = vignette(img, s)
    img.save(path, quality=92)


# ---------- Helpers for parts ----------

def ear(size, color, bbox, blur=8):
    return soft_blob(size, color, bbox, blur=blur)


def blush(size, color, center, r):
    x, y = center
    return soft_blob(size, color, (x - r, y - r, x + r, y + r), blur=6)


def eye(size, color, center, rx, ry):
    x, y = center
    return soft_blob(size, color, (x - rx, y - ry, x + rx, y + ry), blur=3)


def small_eye_highlight(size, center, r):
    x, y = center
    return soft_blob(size, (255, 255, 255), (x - r, y - r, x + r, y + r), blur=2)


def bow(size, color, center, w, h):
    cx, cy = center
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    # left and right loops
    draw.ellipse((cx - w, cy - h * 0.6, cx - w * 0.2, cy + h * 0.6), fill=color + (255,))
    draw.ellipse((cx + w * 0.2, cy - h * 0.6, cx + w, cy + h * 0.6), fill=color + (255,))
    # center knot
    draw.ellipse((cx - w * 0.18, cy - h * 0.25, cx + w * 0.18, cy + h * 0.25), fill=tuple(min(255, int(c * 0.85)) for c in color) + (255,))
    return layer.filter(ImageFilter.GaussianBlur(radius=3))


def scarf(size, color, y_center, w, h):
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    s = size[0]
    # band
    draw.rounded_rectangle((s * 0.32, y_center - h * 0.35, s * 0.68, y_center + h * 0.35), radius=h // 2, fill=color + (255,))
    # hanging end
    draw.rounded_rectangle((s * 0.55, y_center, s * 0.66, y_center + h * 2.2), radius=w // 2, fill=color + (255,))
    return layer.filter(ImageFilter.GaussianBlur(radius=4))


def sweater(size, body_color, bbox):
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x1, y1, x2, y2 = bbox
    draw.rounded_rectangle((x1, y1, x2, y2), radius=(x2 - x1) // 4, fill=body_color + (255,))
    # ribbing texture
    stripe_w = (x2 - x1) / 14
    for i in range(1, 14, 2):
        sx = x1 + i * stripe_w
        draw.line([(sx, y1 + 10), (sx, y2 - 10)], fill=tuple(min(255, int(c * 0.9)) for c in body_color) + (160,), width=max(1, int(stripe_w * 0.6)))
    return layer.filter(ImageFilter.GaussianBlur(radius=5))


def butterfly(size, color, center, w, h):
    cx, cy = center
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    # upper wings
    draw.ellipse((cx - w, cy - h, cx - w * 0.15, cy - h * 0.1), fill=color + (255,))
    draw.ellipse((cx + w * 0.15, cy - h, cx + w, cy - h * 0.1), fill=color + (255,))
    # lower wings
    draw.ellipse((cx - w * 0.7, cy - h * 0.1, cx - w * 0.1, cy + h * 0.6), fill=color + (255,))
    draw.ellipse((cx + w * 0.1, cy - h * 0.1, cx + w * 0.7, cy + h * 0.6), fill=color + (255,))
    # body
    draw.ellipse((cx - w * 0.08, cy - h * 0.5, cx + w * 0.08, cy + h * 0.5), fill=(120, 100, 90) + (255,))
    return layer.filter(ImageFilter.GaussianBlur(radius=2))


def closed_eye_line(size, color, center, w):
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    cx, cy = center
    draw.arc((cx - w, cy - w // 2, cx + w, cy + w // 2), start=200, end=340, fill=color + (255,), width=3)
    return layer.filter(ImageFilter.GaussianBlur(radius=1))


# ---------- Product generators ----------

def make_bunny(path, base, bg_from, bg_to, accessory="bow", eye_type="open"):
    s = 600
    img = canvas(bg_from, bg_to, s)

    # body
    img = Image.alpha_composite(img, soft_blob((s, s), base, (s * 0.30, s * 0.45, s * 0.70, s * 0.86), blur=4))
    # head
    img = Image.alpha_composite(img, soft_blob((s, s), base, (s * 0.28, s * 0.18, s * 0.72, s * 0.58), blur=4))
    # ears
    ear_color = tuple(min(255, int(c * 1.05)) for c in base)
    img = Image.alpha_composite(img, ear((s, s), ear_color, (s * 0.34, s * 0.02, s * 0.44, s * 0.32), blur=3))
    img = Image.alpha_composite(img, ear((s, s), ear_color, (s * 0.56, s * 0.02, s * 0.66, s * 0.32), blur=3))

    # face
    blush_color = (255, 155, 185)
    img = Image.alpha_composite(img, blush((s, s), blush_color, (s * 0.38, s * 0.40), s * 0.035))
    img = Image.alpha_composite(img, blush((s, s), blush_color, (s * 0.62, s * 0.40), s * 0.035))

    if eye_type == "open":
        img = Image.alpha_composite(img, eye((s, s), (74, 63, 85), (s * 0.42, s * 0.36), s * 0.018, s * 0.024))
        img = Image.alpha_composite(img, eye((s, s), (74, 63, 85), (s * 0.58, s * 0.36), s * 0.018, s * 0.024))
        img = Image.alpha_composite(img, small_eye_highlight((s, s), (s * 0.421, s * 0.348), s * 0.006))
        img = Image.alpha_composite(img, small_eye_highlight((s, s), (s * 0.581, s * 0.348), s * 0.006))
    else:
        img = Image.alpha_composite(img, closed_eye_line((s, s), (74, 63, 85), (s * 0.42, s * 0.36), s * 0.022))
        img = Image.alpha_composite(img, closed_eye_line((s, s), (74, 63, 85), (s * 0.58, s * 0.36), s * 0.022))

    # nose
    img = Image.alpha_composite(img, soft_blob((s, s), (224, 138, 168), (s * 0.47, s * 0.40, s * 0.53, s * 0.45), blur=1))

    # accessories
    if accessory == "bow":
        img = Image.alpha_composite(img, bow((s, s), (197, 179, 240), (s * 0.50, s * 0.18), s * 0.12, s * 0.07))
    elif accessory == "scarf":
        img = Image.alpha_composite(img, scarf((s, s), (255, 200, 170), s * 0.52, s * 0.05, s * 0.025))

    # subtle outline for definition
    outline = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    od = ImageDraw.Draw(outline)
    od.ellipse((s * 0.28, s * 0.18, s * 0.72, s * 0.58), outline=(100, 85, 80, 35), width=2)
    outline = outline.filter(ImageFilter.GaussianBlur(radius=2))
    img = Image.alpha_composite(img, outline)

    save(img, path, s)


def make_bear(path, base, bg_from, bg_to, accessory="bow"):
    s = 600
    img = canvas(bg_from, bg_to, s)

    # body
    img = Image.alpha_composite(img, soft_blob((s, s), base, (s * 0.30, s * 0.44, s * 0.70, s * 0.84), blur=4))
    # head
    img = Image.alpha_composite(img, soft_blob((s, s), base, (s * 0.26, s * 0.18, s * 0.74, s * 0.60), blur=4))
    # ears
    ear_color = tuple(min(255, int(c * 1.06)) for c in base)
    img = Image.alpha_composite(img, ear((s, s), ear_color, (s * 0.30, s * 0.10, s * 0.42, s * 0.26), blur=3))
    img = Image.alpha_composite(img, ear((s, s), ear_color, (s * 0.58, s * 0.10, s * 0.70, s * 0.26), blur=3))

    # snout
    img = Image.alpha_composite(img, soft_blob((s, s), tuple(min(255, int(c * 1.12)) for c in base), (s * 0.40, s * 0.40, s * 0.60, s * 0.54), blur=3))

    # face
    blush_color = (255, 150, 180) if base[1] > 180 else (200, 175, 235)
    img = Image.alpha_composite(img, blush((s, s), blush_color, (s * 0.37, s * 0.39), s * 0.034))
    img = Image.alpha_composite(img, blush((s, s), blush_color, (s * 0.63, s * 0.39), s * 0.034))
    img = Image.alpha_composite(img, eye((s, s), (74, 63, 85), (s * 0.42, s * 0.34), s * 0.016, s * 0.022))
    img = Image.alpha_composite(img, eye((s, s), (74, 63, 85), (s * 0.58, s * 0.34), s * 0.016, s * 0.022))
    img = Image.alpha_composite(img, small_eye_highlight((s, s), (s * 0.420, s * 0.330), s * 0.005))
    img = Image.alpha_composite(img, small_eye_highlight((s, s), (s * 0.580, s * 0.330), s * 0.005))
    img = Image.alpha_composite(img, soft_blob((s, s), (120, 95, 150), (s * 0.47, s * 0.42, s * 0.53, s * 0.46), blur=1))

    if accessory == "bow":
        img = Image.alpha_composite(img, bow((s, s), (255, 180, 200), (s * 0.50, s * 0.18), s * 0.11, s * 0.06))
    elif accessory == "sweater":
        img = Image.alpha_composite(img, sweater((s, s), (165, 200, 210), (s * 0.30, s * 0.48, s * 0.70, s * 0.80)))

    # subtle outline for definition
    outline = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    od = ImageDraw.Draw(outline)
    od.ellipse((s * 0.26, s * 0.18, s * 0.74, s * 0.60), outline=(100, 85, 80, 35), width=2)
    outline = outline.filter(ImageFilter.GaussianBlur(radius=2))
    img = Image.alpha_composite(img, outline)

    save(img, path, s)


def make_cat(path, base, bg_from, bg_to, accessory="bow", cheeks=False):
    s = 600
    img = canvas(bg_from, bg_to, s)

    # body
    img = Image.alpha_composite(img, soft_blob((s, s), base, (s * 0.32, s * 0.48, s * 0.68, s * 0.84), blur=4))
    # head
    img = Image.alpha_composite(img, soft_blob((s, s), base, (s * 0.28, s * 0.20, s * 0.72, s * 0.58), blur=4))
    # ears (triangular-ish using small blobs)
    ear_color = tuple(min(255, int(c * 1.05)) for c in base)
    img = Image.alpha_composite(img, soft_blob((s, s), ear_color, (s * 0.32, s * 0.16, s * 0.42, s * 0.32), blur=3))
    img = Image.alpha_composite(img, soft_blob((s, s), ear_color, (s * 0.58, s * 0.16, s * 0.68, s * 0.32), blur=3))

    # snout
    snout = tuple(min(255, int(c * 1.15)) for c in base)
    img = Image.alpha_composite(img, soft_blob((s, s), snout, (s * 0.40, s * 0.42, s * 0.60, s * 0.54), blur=3))

    # face
    if cheeks:
        img = Image.alpha_composite(img, blush((s, s), (255, 140, 175), (s * 0.38, s * 0.42), s * 0.040))
        img = Image.alpha_composite(img, blush((s, s), (255, 140, 175), (s * 0.62, s * 0.42), s * 0.040))

    # closed sleepy eyes
    img = Image.alpha_composite(img, closed_eye_line((s, s), (74, 63, 85), (s * 0.43, s * 0.37), s * 0.022))
    img = Image.alpha_composite(img, closed_eye_line((s, s), (74, 63, 85), (s * 0.57, s * 0.37), s * 0.022))

    # nose
    img = Image.alpha_composite(img, soft_blob((s, s), (224, 138, 168), (s * 0.47, s * 0.43, s * 0.53, s * 0.47), blur=0))

    if accessory == "bow":
        img = Image.alpha_composite(img, bow((s, s), (255, 170, 190), (s * 0.50, s * 0.56), s * 0.09, s * 0.05))
    elif accessory == "butterfly":
        img = Image.alpha_composite(img, butterfly((s, s), (255, 160, 185), (s * 0.50, s * 0.56), s * 0.10, s * 0.07))

    # subtle outline for definition
    outline = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    od = ImageDraw.Draw(outline)
    od.ellipse((s * 0.28, s * 0.20, s * 0.72, s * 0.58), outline=(100, 85, 80, 35), width=2)
    outline = outline.filter(ImageFilter.GaussianBlur(radius=2))
    img = Image.alpha_composite(img, outline)

    save(img, path, s)


def main():
    out_dir = os.path.dirname(os.path.abspath(__file__))

    # Rabbits
    make_bunny(
        os.path.join(out_dir, "bunny-mia.jpg"),
        base=(247, 184, 204),
        bg_from=(255, 232, 238),
        bg_to=(255, 217, 228),
        accessory="bow",
        eye_type="open",
    )
    make_bunny(
        os.path.join(out_dir, "bunny-leo.jpg"),
        base=(197, 179, 240),
        bg_from=(240, 233, 255),
        bg_to=(227, 214, 255),
        accessory="bow",
        eye_type="open",
    )
    make_bunny(
        os.path.join(out_dir, "bunny-nora.jpg"),
        base=(165, 225, 197),
        bg_from=(227, 247, 237),
        bg_to=(205, 242, 226),
        accessory="scarf",
        eye_type="open",
    )

    # Bears
    make_bear(
        os.path.join(out_dir, "bear-tom.jpg"),
        base=(238, 210, 220),
        bg_from=(255, 240, 245),
        bg_to=(255, 228, 235),
        accessory="bow",
    )
    make_bear(
        os.path.join(out_dir, "bear-bella.jpg"),
        base=(197, 179, 240),
        bg_from=(240, 233, 255),
        bg_to=(227, 214, 255),
        accessory="bow",
    )
    make_bear(
        os.path.join(out_dir, "bear-oskar.jpg"),
        base=(165, 225, 197),
        bg_from=(227, 247, 237),
        bg_to=(205, 242, 226),
        accessory="sweater",
    )

    # Cats
    make_cat(
        os.path.join(out_dir, "cat-luna.jpg"),
        base=(250, 225, 215),
        bg_from=(255, 245, 240),
        bg_to=(255, 232, 225),
        accessory="bow",
        cheeks=False,
    )
    make_cat(
        os.path.join(out_dir, "cat-pixie.jpg"),
        base=(197, 179, 240),
        bg_from=(240, 233, 255),
        bg_to=(227, 214, 255),
        accessory="butterfly",
        cheeks=True,
    )
    make_cat(
        os.path.join(out_dir, "cat-mochi.jpg"),
        base=(165, 225, 197),
        bg_from=(227, 247, 237),
        bg_to=(205, 242, 226),
        accessory="bow",
        cheeks=True,
    )

    print("Product images generated in", out_dir)


if __name__ == "__main__":
    main()
