"""Report raw vs gzip size for the site's text assets.

Used when preparing a deployment to see what a visitor actually downloads once
the web server has compression enabled.
"""

import glob
import gzip
import os

TEXT = (
    ["index.html", "activities.html", "gallery.html", "404.html"]
    + sorted(glob.glob("assets/css/*.css"))
    + sorted(glob.glob("assets/js/*.js"))
    + ["assets/icons.svg"]
)


def main() -> None:
    raw_total = gz_total = 0
    for path in TEXT:
        if not os.path.exists(path):
            continue
        raw = open(path, "rb").read()
        gz = gzip.compress(raw, 9)
        raw_total += len(raw)
        gz_total += len(gz)
        print(f"  {path:28s} {len(raw) / 1024:7.1f} KB -> {len(gz) / 1024:6.1f} KB")
    print(f"  {'text total':28s} {raw_total / 1024:7.1f} KB -> {gz_total / 1024:6.1f} KB")
    label = "compressible text assets"
    print(f"  {label:28s} saved {100 * (1 - gz_total / raw_total):.0f}%")


if __name__ == "__main__":
    main()
