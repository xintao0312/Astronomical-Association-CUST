"""Generate web-optimised image assets for the CUST 天文协会 site.

Reads the untouched originals from image/ and writes optimised files into
assets/img/.  Never modifies the sources.

用法：
  python tools/optimize_images.py                  全量生成
  python tools/optimize_images.py --only m42b      只生成 m42b（加图时用，几秒完成）

Two groups:

  photos  aac1-aac3 + 250908  -> multi-width JPEG / WebP for srcset
  logos   aaclogo1             -> the circular badge used in the site header
          aaclogo3             -> the horizontal lockup used as the hero wash

The badge keeps its alpha channel (it is transparent artwork), so it ships as
PNG + WebP rather than JPEG.  The hero lockup also keeps alpha so the theme's
gradient veil shows through it, and is emitted twice:

  aac-hero.webp        the blue artwork       (light mode, mix-blend-mode: multiply)
  aac-hero-invert.webp the same artwork inverted (dark mode, mix-blend-mode: screen)
"""

import argparse
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "image"
OUT = ROOT / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

# key -> source filename（站点资源名 → 原始文件名）
PHOTOS = {
    # 官马莲花山 · 2024 银河
    "milkyway-wide": "aac1.jpg",
    "milkyway-camp": "aac2.jpg",
    "milkyway-horizon": "aac3.jpg",
    # 向海自然保护区 · 银河与极光
    "aurora-1": "aac6.jpg",
    "aurora-2": "aac8.jpg",
    "aurora-3": "aac9.jpg",
    # 哈拉海镇 · 银河
    "hala-1": "aac11.jpg",
    "hala-2": "aac12.jpg",
    "hala-aurora": "农安县哈拉海/Image_1760192465090.jpg",
    # 星星哨水库 · 2025 野外观测
    "outdoor-1": "2025野外观测1.jpg",
    "outdoor-2": "2025野外观测2.jpg",
    "group-outdoor": "2025野外观测合影2.jpg",
    # 其他作品
    "eclipse": "250908月食.png",
    "eclipse-river": "_DSC3759.png",
    # 深空天体
    "m31": "resultM31-1.png",
    "m42": "starless5_M42-1-result-DeNoiseAI-low-light.png",
    "m57": "m57-20241106-1.png",
    # 依兰 / 塔河 / 白狼镇
    "yilan-1": "20250602黑龙江省哈尔滨市依兰县松花江公园/20250601-230124-1.png",
    "yilan-2": "20250602黑龙江省哈尔滨市依兰县松花江公园/20250601-235851-3-1.png",
    "yilan-3": "20250602黑龙江省哈尔滨市依兰县松花江公园/20250602-001530-2-1.png",
    "yilan-4": "20250602黑龙江省哈尔滨市依兰县松花江公园/20250602-002756-2-2.png",
    "yilan-5": "20250602黑龙江省哈尔滨市依兰县松花江公园/20250602-004138-1-2.png",
    "tahe-1": "20250928黑龙江省大兴安岭地区塔河县盘古镇/20250927-233432_DSC8126-1.png",
    "tahe-2": "20250928黑龙江省大兴安岭地区塔河县盘古镇/20250928-003106_DSC8183-1-2.png",
    "tahe-3": "20250928黑龙江省大兴安岭地区塔河县盘古镇/20250928-021438_DSC8264-1-6.png",
    "tahe-4": "20250928黑龙江省大兴安岭地区塔河县盘古镇/20250928-023724_DSC-8312-3-7.png",
    "tahe-5": "20250928黑龙江省大兴安岭地区塔河县盘古镇/20250928-030544_DSC8356-1.png",
    "tahe-6": "20250928黑龙江省大兴安岭地区塔河县盘古镇/20250928-032722-_DSC8391-2-2-2.png",
    "bailang-1": "20260426内蒙古兴安盟阿尔山市白狼镇/20260425-203352-3165-1-1.png",
    "bailang-2": "20260426内蒙古兴安盟阿尔山市白狼镇/20260426-024906-3374-3389-2-2.png",
    "bailang-3": "20260426内蒙古兴安盟阿尔山市白狼镇/20260426-030328-3409-2-1.png",
    "bailang-4": "20260426内蒙古兴安盟阿尔山市白狼镇/20260426-030516-3411-3420-1.png",
    "bailang-5": "20260426内蒙古兴安盟阿尔山市白狼镇/20260426-031634-3429-3448-1-3.png",
    # 星空毕业典礼（2022 级）
    "grad-1": "20260618吉林省四平市双辽市双山镇北傅街/20260618-002300-DSC00974-1-1.png",
    "grad-2": "20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013839_505_393.png",
    "grad-3": "20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013842_506_393.png",
    "grad-4": "20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013849_507_393.png",
    "grad-5": "20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013854_508_393.png",
    "grad-6": "20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013906_510_393.png",
    "grad-7": "20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013909_511_393.png",
    "grad-8": "20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013925_513_393.png",
    "grad-9": "20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013944_515_393.png",
    "grad-10": "20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013956_517_393.png",
    "grad-11": "20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619014002_518_393.png",
    "grad-12": "20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619015354_519_393.png",
    "ngc6888": "aac4-NGC_6888.png",
    "moon-full": "20241116-220042-2.png",
    # 旧合影（保留资源，画廊已不再引用）
    "group-observation": "250908.jpeg",
    # image/ 下六个地点的素材
    "xinshan-1": "20230326吉林省四平市伊通县新山水库/IMG_20230325_191849.png",
    "xinshan-2": "20230326吉林省四平市伊通县新山水库/IMG_20230325_193152.png",
    "xinshan-3": "20230326吉林省四平市伊通县新山水库/新山水库1.png",
    "xinshan-4": "20230326吉林省四平市伊通县新山水库/新山水库4.png",
    "chaershen-1": "20230429内蒙古兴安盟科尔沁右翼前旗察尔森水库/田埂·星夜.jpg",
    "mingshuihe-1": "20230521内蒙古兴安盟阿尔山市明水河镇/明水河观星-20230521-004436-1.jpg",
    "dijiaozi-1": "20230623内蒙古兴安盟阿尔山市明水河镇下地窖子/20230623-004421-3-2.jpg",
    "dijiaozi-2": "20230623内蒙古兴安盟阿尔山市明水河镇下地窖子/IMG_20230623_013102-1.jpg",
    "dijiaozi-3": "20230623内蒙古兴安盟阿尔山市明水河镇下地窖子/IMG_20230626_160911.jpg",
    "dijiaozi-4": "20230623内蒙古兴安盟阿尔山市明水河镇下地窖子/MTXX_MH20230623_230207988.jpg",
    "dijiaozi-5": "20230623内蒙古兴安盟阿尔山市明水河镇下地窖子/MTXX_MH20230624_132932627.jpg",
    "dijiaozi-6": "20230623内蒙古兴安盟阿尔山市明水河镇下地窖子/再访明水河1.png",
    "dajianggang-1": "20240330吉林省四平市伊通县河源镇大酱缸村/20240330-203224-2.jpg",
    "dajianggang-2": "20240330吉林省四平市伊通县河源镇大酱缸村/20240330-223711-1.jpg",
    "dajianggang-3": "20240330吉林省四平市伊通县河源镇大酱缸村/20240330-232022-3.png",
    "erdao-1": "20241110吉林省延边州安图县二道白河镇/20241110-001238-2.png",
    "erdao-2": "20241110吉林省延边州安图县二道白河镇/20241115-7473-4.png",
    # 魏史成（25 级）
    "c63": "25魏史成深空/C63_上帝之眼.png",
    "hcg92": "25魏史成深空/HCG-92_史蒂夫五重奏.jpg",
    "ic1805": "25魏史成深空/IC-1805_2.jpg",
    "m33": "25魏史成深空/M33.jpg",
    "m45": "25魏史成深空/M45_昴星团.jpg",
    "ngc7331": "25魏史成深空/NGC-7331.jpg",
    "wsc-1": "25魏史成/MilkyWay_WSC-1.jpg",
    "wsc-2": "25魏史成/MilkyWay_WSC-2.jpg",
    "wsc-3": "25魏史成/MilkyWay_WSC-3.jpg",
    "ic1805b": "25魏史成深空/IC-1805.jpg",
    "m31b": "25魏史成深空/M31_仙女座星系.png",
    "m31c": "25魏史成深空/M31_仙女座星系-2.jpg",
    "m42b": "25魏史成深空/M42_猎户座.png",
}

# key -> target widths for the responsive srcset
PHOTO_WIDTHS = {
    "milkyway-wide": [900, 1400, 2000],
    "milkyway-camp": [900, 1400, 2000],
    "milkyway-horizon": [900, 1400, 2000],
    "aurora-1": [900, 1400, 2000],
    "aurora-2": [900, 1400, 2000],
    "aurora-3": [900, 1400, 2000],
    "hala-1": [900, 1400, 2000],
    "hala-2": [900, 1400, 2000],
    "hala-aurora": [900, 1400, 2000],
    "outdoor-1": [900, 1400, 2000],
    "outdoor-2": [900, 1400, 2000],
    "group-outdoor": [900, 1400, 2000],
    "eclipse": [900, 1400, 2000],
    "eclipse-river": [900, 1400, 2000],
    "m31": [900, 1400, 2000],
    "m42": [900, 1400],
    "m57": [900, 1400],
    "yilan-1": [900, 1400, 2000],
    "yilan-2": [900, 1400, 2000],
    "yilan-3": [900, 1400, 2000],
    "yilan-4": [900, 1400, 2000],
    "yilan-5": [900, 1400, 2000],
    "tahe-1": [900, 1400, 2000],
    "tahe-2": [900, 1400, 2000],
    "tahe-3": [900, 1400, 2000],
    "tahe-4": [900, 1400, 2000],
    "tahe-5": [900, 1400, 2000],
    "tahe-6": [900, 1400, 2000],
    "bailang-1": [900, 1400, 2000],
    "bailang-2": [900, 1400, 2000],
    "bailang-3": [900, 1400, 2000],
    "bailang-4": [900, 1400, 2000],
    "bailang-5": [900, 1400, 2000],
    "grad-1": [900, 1400, 2000],
    "grad-2": [900, 1400, 2000],
    "grad-3": [900, 1400, 2000],
    "grad-4": [900, 1400, 2000],
    "grad-5": [900, 1400, 2000],
    "grad-6": [900, 1400, 2000],
    "grad-7": [900, 1400, 2000],
    "grad-8": [900, 1400, 2000],
    "grad-9": [900, 1400, 2000],
    "grad-10": [900, 1400, 2000],
    "grad-11": [900, 1400, 2000],
    "grad-12": [900, 1400, 2000],
    "ngc6888": [900, 1400, 2000],
    "moon-full": [900, 1400, 2000],
    "group-observation": [600, 972],
    "xinshan-1": [900, 1400, 2000],
    "xinshan-2": [900, 1400, 2000],
    "xinshan-3": [900, 1400, 2000],
    "xinshan-4": [900, 1400, 2000],
    "chaershen-1": [900, 1400, 2000],
    "mingshuihe-1": [900, 1400, 2000],
    "dijiaozi-1": [900, 1400, 2000],
    "dijiaozi-2": [900, 1400, 2000],
    "dijiaozi-3": [900, 1400, 2000],
    "dijiaozi-4": [900, 1400, 2000],
    "dijiaozi-5": [900, 1400, 2000],
    "dijiaozi-6": [900, 1400, 2000],
    "dajianggang-1": [900, 1400, 2000],
    "dajianggang-2": [900, 1400, 2000],
    "dajianggang-3": [900, 1400, 2000],
    "erdao-1": [900, 1400, 2000],
    "erdao-2": [900, 1400, 2000],
    "c63": [900, 1400, 2000],
    "hcg92": [600, 800],
    "ic1805": [900, 1400, 2000],
    "m33": [900, 1400, 2000],
    "m45": [900, 1400, 2000],
    "ngc7331": [600, 1000],
    "wsc-1": [900, 1400, 2000],
    "wsc-2": [900, 1400, 2000],
    "wsc-3": [900, 1400, 2000],
    "ic1805b": [900, 1400, 2000],
    "m31b": [900, 1400, 2000],
    "m31c": [900, 1400, 2000],
    "m42b": [900, 1400, 2000],
}

# the circular badge, rendered large enough for hidpi at any header size we use
BADGE_WIDTHS = [48, 96, 192, 384]

# the hero lockup: keep the source 16:9 framing so `background-size: cover`
# behaves like it did with the photographs
HERO_WIDTHS = [1280, 1920]


def save_badge() -> None:
    src_path = SRC / "aaclogo1.png"
    if not src_path.exists():
        print(f"skip (missing): {src_path}")
        return

    with Image.open(src_path) as raw:
        img = raw.convert("RGBA")
        # trim to the artwork, then re-centre on a square with a hair of margin
        crop = img.crop(img.getbbox())
        side = max(crop.size)
        pad = int(side * 0.03)
        square = Image.new("RGBA", (side + pad * 2,) * 2, (0, 0, 0, 0))
        square.paste(
            crop,
            ((square.width - crop.width) // 2, (square.height - crop.height) // 2),
            crop,
        )
        print(f"aaclogo1.png: source {img.width}x{img.height} -> square {square.width}")

        for width in BADGE_WIDTHS:
            small = square.resize((width, width), Image.Resampling.LANCZOS)
            png = OUT / f"aac-badge-{width}.png"
            small.save(png, optimize=True)
            webp = OUT / f"aac-badge-{width}.webp"
            small.save(webp, "WEBP", quality=90, method=6, lossless=False)
            print(
                f"  -> {png.name} {png.stat().st_size // 1024} KB | "
                f"{webp.name} {webp.stat().st_size // 1024} KB"
            )

    # A 64px PNG doubles as the favicon.
    fav = square.resize((64, 64), Image.Resampling.LANCZOS)
    fav.save(OUT / "favicon.png", optimize=True)
    print("  -> favicon.png (from the badge)")


def save_hero_logo() -> None:
    src_path = SRC / "aaclogo3.png"
    if not src_path.exists():
        print(f"skip (missing): {src_path}")
        return

    with Image.open(src_path) as raw:
        img = raw.convert("RGBA")
        print(f"aaclogo3.png: source {img.width}x{img.height}")

        for width in HERO_WIDTHS:
            if width > img.width:
                continue
            height = max(1, round(img.height * width / img.width))
            resized = img.resize((width, height), Image.Resampling.LANCZOS)

            blue = OUT / f"aac-hero-{width}.webp"
            resized.save(blue, "WEBP", quality=84, method=6)
            print(f"  -> {blue.name} {resized.width}x{resized.height} {blue.stat().st_size // 1024} KB")

            # Dark-mode sibling. aaclogo3 is an opaque white plate with dark blue
            # artwork, so dark mode needs the luminance inverted: the artwork
            # becomes light and the plate becomes near-black. With
            # `mix-blend-mode: screen` the black plate then contributes nothing
            # and only the artwork lights the background. (Inverting the colour
            # would land on warm amber, because inverting blue gives its
            # complement — the artwork has to stay blue while it brightens.)
            light = ImageOps.invert(resized.convert("RGB"))
            inv_path = OUT / f"aac-hero-dark-{width}.webp"
            light.save(inv_path, "WEBP", quality=84, method=6)
            print(f"  -> {inv_path.name} {inv_path.stat().st_size // 1024} KB")


def main(only=None) -> None:
    keys = list(PHOTOS)

    if only:
        unknown = [k for k in only if k not in PHOTOS]
        if unknown:
            raise SystemExit(
                "未知的 key：%s\n可用的 key：\n  %s"
                % (", ".join(unknown), "\n  ".join(keys))
            )
        keys = [k for k in keys if k in only]
        print(f"只生成指定的 {len(keys)} 项：{', '.join(keys)}")

    done = 0

    for key in keys:
        filename = PHOTOS[key]
        path = SRC / filename
        if not path.exists():
            print(f"skip (missing): {path}")
            continue

        with Image.open(path) as raw:
            # 记下源文件的 ICC 色彩配置：丢掉它会让广色域作品的颜色发闷
            icc = raw.info.get("icc_profile")
            img = ImageOps.exif_transpose(raw).convert("RGB")
            print(f"{filename}: source {img.width}x{img.height}")

            for width in PHOTO_WIDTHS[key]:
                if width > img.width:
                    continue
                ratio = width / img.width
                resized = img.resize(
                    (width, max(1, round(img.height * ratio))),
                    Image.Resampling.LANCZOS,
                )
                suffix = "" if width == max(PHOTO_WIDTHS[key]) else f"-{width}"
                jpg = OUT / f"{key}{suffix}.jpg"
                keep = {"icc_profile": icc} if icc else {}
                resized.save(
                    jpg, "JPEG", quality=80, optimize=True, progressive=True, **keep
                )
                webp = OUT / f"{key}{suffix}.webp"
                resized.save(webp, "WEBP", quality=76, method=6, **keep)
                print(
                    f"  -> {jpg.name} {resized.width}x{resized.height} "
                    f"{jpg.stat().st_size // 1024} KB | "
                    f"{webp.name} {webp.stat().st_size // 1024} KB"
                )

        done += 1

    # 社徽与 hero 与作品无关，指定 --only 时不重复生成
    if not only:
        save_badge()
        save_hero_logo()

    print(f"完成：生成 {done} 项")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="生成 assets/img/ 下的图片资源。不带参数时全量生成。"
    )
    parser.add_argument(
        "--only",
        nargs="+",
        metavar="KEY",
        help="只生成这些 key（对应 PHOTOS 里的键名），其余跳过",
    )
    main(parser.parse_args().only)

