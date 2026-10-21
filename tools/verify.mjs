// Sanity checks over the generated HTML:
//   * every local href / src / srcset entry resolves to a real file
//   * every in-page anchor target exists
//   * no leftover backslashes or unrendered template markers
//
//   node tools/verify.mjs

import { readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const pages = (await readdir(root)).filter((f) => f.endsWith(".html"));
let failures = 0;
const problems = [];

function fail(page, message) {
  failures++;
  problems.push(`${page}: ${message}`);
}

for (const page of pages) {
  const raw = await readFile(join(root, page), "utf8");

  if (raw.includes("\\")) fail(page, "contains a backslash");
  if (raw.includes("${")) fail(page, "contains an unrendered template marker");
  if (!raw.includes('href="assets/css/base.css"')) fail(page, "missing base.css link");
  if (!raw.includes('href="assets/css/main.css"')) fail(page, "missing main.css link");
  if (!raw.includes('src="assets/js/main.js"')) fail(page, "missing main.js script");
  if (!raw.includes("</html>")) fail(page, "does not close </html>");

  // collect every attribute value that should point at something local
  const refs = new Set();
  const patterns = [
    /(?:href|src)="([^"]+)"/g,
    /srcset="([^"]+)"/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(raw))) {
      if (re.source.startsWith("srcset")) {
        m[1].split(",").forEach((part) => {
          const url = part.trim().split(/\s+/)[0];
          if (url) refs.add(url);
        });
      } else {
        refs.add(m[1]);
      }
    }
  }

  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|#|javascript:)/.test(ref)) continue;
    const [pathPart] = ref.split("#");
    if (!pathPart) continue;
    const target = join(root, pathPart);
    if (!existsSync(target)) fail(page, `broken reference -> ${ref}`);
  }

  // in-page anchors
  const ids = new Set();
  let m;
  const idRe = /\sid="([^"]+)"/g;
  while ((m = idRe.exec(raw))) ids.add(m[1]);

  const anchorRe = /href="#([^"]+)"/g;
  while ((m = anchorRe.exec(raw))) {
    if (!ids.has(m[1])) fail(page, `anchor target #${m[1]} does not exist`);
  }

  // svg <use> targets must exist in the inlined sprite
  const useRe = /<use href="#([^"]+)"/g;
  const symbols = new Set();
  const symRe = /<symbol id="([^"]+)"/g;
  while ((m = symRe.exec(raw))) symbols.add(m[1]);
  while ((m = useRe.exec(raw))) {
    if (!symbols.has(m[1])) fail(page, `<use> references missing symbol ${m[1]}`);
  }

  const bytes = (await stat(join(root, page))).size;
  console.log(
    `ok  ${page.padEnd(16)} ${String(bytes).padStart(6)} B · ` +
      `${refs.size} refs · ${ids.size} ids · ${symbols.size} symbols`
  );
}

// every image referenced in the pages must exist in all documented widths
const needed = [
  "milkyway-wide.jpg", "milkyway-wide-900.jpg", "milkyway-wide-1400.jpg",
  "milkyway-camp.jpg", "milkyway-camp-900.jpg", "milkyway-camp-1400.jpg",
  "milkyway-horizon.jpg", "milkyway-horizon-900.jpg", "milkyway-horizon-1400.jpg",
  "group-observation.jpg", "group-observation-600.jpg",
];
for (const file of needed) {
  if (!existsSync(join(root, "assets", "img", file))) {
    fail("assets", `missing expected image ${file}`);
  }
}

if (failures) {
  console.error(`\nFAILED with ${failures} problem(s):`);
  problems.forEach((p) => console.error("  - " + p));
  process.exitCode = 1;
} else {
  console.log(`\nAll checks passed across ${pages.length} pages.`);
}
