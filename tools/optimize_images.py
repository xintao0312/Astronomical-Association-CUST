"""Generate web-optimised image assets for the CUST 天文协会 site.

Reads the untouched originals from image/ and writes optimised files into
assets/img/.  Never modifies the sources.

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

from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "image"
OUT = ROOT / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

# key -> (source filename, human label)
PHOTOS = {
    # 官马莲花山 · 2024 银河
    "milkyway-wide": ("aac1.jpg", "银河横贯夜空"),
    "milkyway-camp": ("aac2.jpg", "营地之上的银河与夏季大三角"),
    "milkyway-horizon": ("aac3.jpg", "银河自山脊升起"),
    # 向海自然保护区 · 银河与极光
    "aurora-1": ("aac6.jpg", "极光染紫"),
    "aurora-2": ("aac8.jpg", "银河横贯"),
    "aurora-3": ("aac9.jpg", "银河与远处的灯火"),
    # 哈拉海镇 · 银河
    "hala-1": ("aac11.jpg", "银河升起"),
    "hala-2": ("aac12.jpg", "树影与星河"),
    "hala-aurora": ("农安县哈拉海/Image_1760192465090.jpg", "原野尽头的极光"),
    # 星星哨水库 · 2025 野外观测
    "outdoor-1": ("2025野外观测1.jpg", "水库上空的银河"),
    "outdoor-2": ("2025野外观测2.jpg", "水面上的星光"),
    "group-outdoor": ("2025野外观测合影2.jpg", "2025 年野外观测合影"),
    # 其他作品
    "eclipse": ("250908月食.png", "月全食"),
    "eclipse-river": ("_DSC3759.png", "夜空里的红月"),
    # 星空毕业典礼（2022 级）
    "grad-1": ("20260618吉林省四平市双辽市双山镇北傅街/20260618-002300-DSC00974-1-1.png", "学士服与星河"),
    "grad-2": ("20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013839_505_393.png", "一束绿光"),
    "grad-3": ("20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013842_506_393.png", "抬头的瞬间"),
    "grad-4": ("20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013849_507_393.png", "指向星空"),
    "grad-5": ("20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013854_508_393.png", "银河之下"),
    "grad-6": ("20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013906_510_393.png", "学位帽的影子"),
    "grad-7": ("20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013909_511_393.png", "夜色里的毕业生"),
    "grad-8": ("20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013925_513_393.png", "横幅展开"),
    "grad-9": ("20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013944_515_393.png", "我们毕业了"),
    "grad-10": ("20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619013956_517_393.png", "光束越过小镇"),
    "grad-11": ("20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619014002_518_393.png", "绿光与星野"),
    "grad-12": ("20260618吉林省四平市双辽市双山镇北傅街/微信图片_20260619015354_519_393.png", "星空毕业合影"),
    "ngc6888": ("aac4-NGC_6888.png", "NGC 6888 新月星云"),
    "moon-full": ("20241116-220042-2.png", "满月"),
    # 旧合影（保留资源，画廊已不再引用）
    "group-observation": ("250908.jpeg", "社团成员与望远镜合影"),
    # image/ 下六个地点的素材
    "xinshan-1": ("20230326吉林省四平市伊通县新山水库/IMG_20230325_191849.png", "树梢上的初星"),
    "xinshan-2": ("20230326吉林省四平市伊通县新山水库/IMG_20230325_193152.png", "水库边的夜路"),
    "xinshan-3": ("20230326吉林省四平市伊通县新山水库/新山水库1.png", "提着灯的人"),
    "xinshan-4": ("20230326吉林省四平市伊通县新山水库/新山水库4.png", "湖岸的暮色"),
    "chaershen-1": ("20230429内蒙古兴安盟科尔沁右翼前旗察尔森水库/田埂·星夜.jpg", "田埂与星夜"),
    "mingshuihe-1": ("20230521内蒙古兴安盟阿尔山市明水河镇/明水河观星-20230521-004436-1.jpg", "明水河的银河"),
    "dijiaozi-1": ("20230623内蒙古兴安盟阿尔山市明水河镇下地窖子/20230623-004421-3-2.jpg", "营地外的银河"),
    "dijiaozi-2": ("20230623内蒙古兴安盟阿尔山市明水河镇下地窖子/IMG_20230623_013102-1.jpg", "帐篷里的暖光"),
    "dijiaozi-3": ("20230623内蒙古兴安盟阿尔山市明水河镇下地窖子/IMG_20230626_160911.jpg", "雷雨中的营地"),
    "dijiaozi-4": ("20230623内蒙古兴安盟阿尔山市明水河镇下地窖子/MTXX_MH20230623_230207988.jpg", "头顶的银河"),
    "dijiaozi-5": ("20230623内蒙古兴安盟阿尔山市明水河镇下地窖子/MTXX_MH20230624_132932627.jpg", "山脊与星空"),
    "dijiaozi-6": ("20230623内蒙古兴安盟阿尔山市明水河镇下地窖子/再访明水河1.png", "扎营的夜晚"),
    "dajianggang-1": ("20240330吉林省四平市伊通县河源镇大酱缸村/20240330-203224-2.jpg", "地平线上的亮星"),
    "dajianggang-2": ("20240330吉林省四平市伊通县河源镇大酱缸村/20240330-223711-1.jpg", "屋檐上的星轨"),
    "dajianggang-3": ("20240330吉林省四平市伊通县河源镇大酱缸村/20240330-232022-3.png", "村口的星空"),
    "erdao-1": ("20241110吉林省延边州安图县二道白河镇/20241110-001238-2.png", "镇外的夜空"),
    "erdao-2": ("20241110吉林省延边州安图县二道白河镇/20241115-7473-4.png", "村里升起的银河"),
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


def main() -> None:
    for key, (filename, _label) in PHOTOS.items():
        path = SRC / filename
        if not path.exists():
            print(f"skip (missing): {path}")
            continue

        with Image.open(path) as raw:
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
                resized.save(jpg, "JPEG", quality=80, optimize=True, progressive=True)
                webp = OUT / f"{key}{suffix}.webp"
                resized.save(webp, "WEBP", quality=76, method=6)
                print(
                    f"  -> {jpg.name} {resized.width}x{resized.height} "
                    f"{jpg.stat().st_size // 1024} KB | "
                    f"{webp.name} {webp.stat().st_size // 1024} KB"
                )

    save_badge()
    save_hero_logo()


if __name__ == "__main__":
    main()
