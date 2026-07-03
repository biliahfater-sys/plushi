#!/usr/bin/env python3
"""
Генератор placeholder-изображений для «Плюши».
Создаёт мягкие, пастельные изображения-заглушки в стиле реальных фото.
В production заменить на настоящие фото продукции.
"""
import math
import os
import random
from PIL import Image, ImageDraw, ImageFilter, ImageChops


def radial_gradient(size, center_color, edge_color):
    """Радиальный градиент от центра к краям."""
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
    """RGB-шум для имитации ткани."""
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
    """Накладывает мягкий шум, имитирующий ткань (screen blend)."""
    noise = make_noise(img.size, intensity)
    return ImageChops.screen(img, noise)


def soft_blob(canvas_size, color, bbox, blur=18):
    """Создаёт размытое цветное пятно с тенью."""
    layer = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    x1, y1, x2, y2 = bbox
    # тень
    ox = canvas_size[0] * 0.018
    oy = canvas_size[1] * 0.028
    shadow = (x1 + ox, y1 + oy, x2 + ox, y2 + oy)
    draw.ellipse(shadow, fill=(60, 50, 75, 55))

    # основная форма
    draw.ellipse(bbox, fill=color + (255,))

    # блик
    hx1 = x1 + (x2 - x1) * 0.22
    hy1 = y1 + (y2 - y1) * 0.14
    hx2 = x1 + (x2 - x1) * 0.52
    hy2 = y1 + (y2 - y1) * 0.42
    hl = tuple(min(255, int(c * 1.18)) for c in color)
    draw.ellipse((hx1, hy1, hx2, hy2), fill=hl + (200,))

    return layer.filter(ImageFilter.GaussianBlur(radius=blur))


def make_hero_bunny(path, s=800):
    """Hero: мягкий кролик на розово-лавандовом фоне."""
    size = (s, s)
    img = radial_gradient(size, (255, 232, 238), (227, 214, 255))
    img = add_fabric_texture(img, 14)
    img = img.convert("RGBA")

    img = Image.alpha_composite(img, soft_blob(size, (247, 184, 204), (s * 0.30, s * 0.38, s * 0.70, s * 0.82), blur=10))
    img = Image.alpha_composite(img, soft_blob(size, (247, 184, 204), (s * 0.36, s * 0.12, s * 0.46, s * 0.48), blur=8))
    img = Image.alpha_composite(img, soft_blob(size, (247, 184, 204), (s * 0.54, s * 0.12, s * 0.64, s * 0.48), blur=8))
    img = Image.alpha_composite(img, soft_blob(size, (255, 232, 238), (s * 0.38, s * 0.20, s * 0.44, s * 0.42), blur=6))
    img = Image.alpha_composite(img, soft_blob(size, (255, 232, 238), (s * 0.56, s * 0.20, s * 0.62, s * 0.42), blur=6))
    img = Image.alpha_composite(img, soft_blob(size, (197, 179, 240), (s * 0.45, s * 0.32, s * 0.55, s * 0.42), blur=5))

    vignette = radial_gradient(size, (255, 255, 255), (240, 235, 245))
    img = Image.blend(img.convert("RGB"), vignette, 0.12)
    img.save(path, quality=92)


def make_product_image(path, color, bg_from, bg_to, s=600):
    """Универсальная карточка товара с плюшевым шаром."""
    size = (s, s)
    img = radial_gradient(size, bg_from, bg_to)
    img = add_fabric_texture(img, 12)
    img = img.convert("RGBA")

    img = Image.alpha_composite(img, soft_blob(size, color, (s * 0.22, s * 0.24, s * 0.78, s * 0.80), blur=10))

    detail_color = tuple(min(255, int(c * 1.06)) for c in color)
    img = Image.alpha_composite(img, soft_blob(size, detail_color, (s * 0.30, s * 0.10, s * 0.44, s * 0.36), blur=7))
    img = Image.alpha_composite(img, soft_blob(size, detail_color, (s * 0.56, s * 0.10, s * 0.70, s * 0.36), blur=7))
    img = Image.alpha_composite(img, soft_blob(size, (255, 217, 228), (s * 0.42, s * 0.34, s * 0.58, s * 0.48), blur=5))

    vignette = radial_gradient(size, (255, 255, 255), (240, 235, 245))
    img = Image.blend(img.convert("RGB"), vignette, 0.10)
    img.save(path, quality=92)


def make_workshop(path, s=800):
    """О мастерской: рабочее место с мягким освещением."""
    size = (s, int(s * 0.75))
    img = radial_gradient(size, (255, 244, 235), (255, 232, 238))
    img = add_fabric_texture(img, 10)
    img = img.convert("RGBA")

    table = Image.new("RGBA", size, (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(table)
    tdraw.rounded_rectangle(
        (s * 0.10, s * 0.42, s * 0.90, s * 0.72),
        radius=40,
        fill=(245, 235, 225, 220),
        outline=(235, 222, 210, 180),
        width=2,
    )
    table = table.filter(ImageFilter.GaussianBlur(radius=2))
    img = Image.alpha_composite(img, table)

    toys = [
        (s * 0.20, s * 0.28, s * 0.40, s * 0.58, (247, 184, 204)),
        (s * 0.40, s * 0.26, s * 0.60, s * 0.56, (197, 179, 240)),
        (s * 0.60, s * 0.30, s * 0.80, s * 0.58, (165, 225, 197)),
    ]
    for x1, y1, x2, y2, c in toys:
        img = Image.alpha_composite(img, soft_blob(size, c, (x1, y1, x2, y2), blur=9))

    vignette = radial_gradient(size, (255, 255, 255), (240, 235, 245))
    img = Image.blend(img.convert("RGB"), vignette, 0.10)
    img.save(path, quality=92)


def main():
    out_dir = os.path.dirname(os.path.abspath(__file__))

    make_hero_bunny(os.path.join(out_dir, "hero-bunny.jpg"))
    make_product_image(
        os.path.join(out_dir, "plush-rabbit.jpg"),
        color=(247, 184, 204),
        bg_from=(255, 232, 238),
        bg_to=(255, 217, 228),
    )
    make_product_image(
        os.path.join(out_dir, "plush-bear.jpg"),
        color=(197, 179, 240),
        bg_from=(240, 233, 255),
        bg_to=(227, 214, 255),
    )
    make_product_image(
        os.path.join(out_dir, "plush-cat.jpg"),
        color=(165, 225, 197),
        bg_from=(227, 247, 237),
        bg_to=(205, 242, 226),
    )
    make_workshop(os.path.join(out_dir, "about-workshop.jpg"))

    print("Placeholder images generated in", out_dir)


if __name__ == "__main__":
    main()
