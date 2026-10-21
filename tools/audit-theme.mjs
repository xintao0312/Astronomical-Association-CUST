// Design-token audit: parses the real custom properties out of assets/css/base.css
// and proves three things.
//
//   1. Light and dark declare the same token set (no token left at an
//      inherited value, which is what makes a theme pair "feel" inconsistent).
//   2. Both themes walk the same hue path, so switching modes never looks like
//      a different brand.
//   3. Text/background pairs meet WCAG contrast minimums — including against
//      the gradient stops, where a single mid-gradient colour is not enough.
//
//   node tools/audit-theme.mjs

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const css = await readFile(resolve(here, "..", "assets", "css", "base.css"), "utf8");

/* ---------------------------------------------------------------- parsing */

function block(selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`selector not found: ${selector}`);
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) return css.slice(open + 1, i);
    }
  }
  throw new Error(`unbalanced block: ${selector}`);
}

function tokens(text) {
  const out = {};
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(text))) out[m[1]] = m[2].trim().replace(/\s+/g, " ");
  return out;
}

const light = tokens(block(":root {"));
const darkOverrides = tokens(block(':root[data-theme="dark"] {'));

/**
 * The dark block does not restate what it does not change, so a dark token may
 * legitimately reference a light-block token (the shared hue anchors, most
 * importantly). Resolve against the full cascade: light below, dark on top.
 */
const dark = { ...light, ...darkOverrides };

/* ---------------------------------------------------------------- colour */

function hsl(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
}

function hex(value) {
  const v = value.replace("#", "");
  const full = v.length === 3 ? v.split("").map((c) => c + c).join("") : v;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/** Substitute var(--name) references using the theme's own token table. */
function expand(value, table) {
  let out = value;
  for (let pass = 0; pass < 8 && out.includes("var("); pass++) {
    out = out.replace(/var\((--[\w-]+)\)/g, (whole, name) =>
      table[name] !== undefined ? table[name] : whole
    );
  }
  return out;
}

function parseHsl(body) {
  const m = body.match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
  if (!m) throw new Error(`unparsed hsl: ${body}`);
  return hsl(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
}

/** One stop: "hsl(H S% L%[ / A])" or "#rrggbb". Groups match the same start offset. */
const STOP = /#[0-9a-fA-F]{3,8}|hsl\(\s*[\d.]+\s+[\d.]+%\s+[\d.]+%(?:\s*\/\s*[\d.]+)?\s*\)/;

function parseStop(text) {
  if (text.startsWith("#")) {
    const rgb = hex(text);
    return { rgb, sat: saturation(rgb), light: lum(rgb) };
  }
  const body = text.replace(/^hsl\(/, "").replace(/\)$/, "");
  const m = body.match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
  if (!m) throw new Error(`unparsed stop: ${text}`);
  const h = parseFloat(m[1]);
  const s = parseFloat(m[2]);
  const lPercent = parseFloat(m[3]);
  return { rgb: hsl(h, s, lPercent), sat: s / 100, light: lPercent / 100 };
}

/**
 * A stop only counts as carrying hue if it is saturated enough and not so close
 * to white or black that the hue is invisible. White at 95% lightness is a
 * neutral endpoint in the design, not a "periwinkle at hue 232".
 */
function isChromatic(stop) {
  return stop.sat >= 0.12 && stop.light >= 0.08 && stop.light <= 0.9;
}

function parseGradient(value) {
  const open = value.indexOf("(");
  const body = open === -1 ? value : value.slice(open + 1);

  // single pass over the body: commas sitting at depth 0 separate the stops
  const parts = [];
  let depth = 0;
  let current = "";
  for (const ch of body) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      parts.push(current);
      current = "";
    } else current += ch;
  }
  parts.push(current);

  const stops = [];
  for (const part of parts) {
    const m = part.match(STOP);
    if (m) stops.push(parseStop(m[0]));
  }
  if (!stops.length) {
    throw new Error(`no stops parsed from: ${value.slice(0, 80)}`);
  }
  return stops;
}

/** Resolve a colour token to the list of stops it paints. */
function resolveColour(token, table) {
  if (!token) return null;
  const t = expand(token.trim(), table);

  if (t.includes("gradient")) return parseGradient(t);
  if (t.startsWith("hsl(")) return [parseStop(t)];
  if (/^#[0-9a-fA-F]{3,8}$/.test(t)) return [parseStop(t)];
  return null;
}

function lum(rgb) {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** HSL saturation, recovered from RGB. */
function saturation(rgb) {
  const [r, g, b] = rgb.map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return 0;
  return d / (1 - Math.abs(2 * l - 1));
}

function ratio(a, b) {
  const la = lum(a);
  const lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Worst contrast of `fg` against any stop of a background token. */
function worst(fgToken, bgToken, table) {
  const fg = resolveColour(fgToken, table)[0].rgb;
  const stops = resolveColour(bgToken, table);
  return Math.min(...stops.map((s) => ratio(fg, s.rgb)));
}

function hue(rgb) {
  const [r, g, b] = rgb.map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 0;
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  return h < 0 ? h + 360 : h;
}

/* ---------------------------------------------------------------- checks */

let failures = 0;
const line = (label, detail) => console.log(`  ${label.padEnd(38)} ${detail}`);
const bad = (msg) => {
  failures++;
  console.log(`  \u001b[31mFAIL\u001b[0m ${msg}`);
};
const good = (msg) => console.log(`  \u001b[32m ok \u001b[0m ${msg}`);

/**
 * Theme-invariant tokens: geometry, motion, type scale and the shared hue
 * anchors. These are deliberately declared once — a "dark counterpart" would
 * be meaningless and would invite the two themes to drift apart.
 */
const INVARIANT = new Set([
  "--h-brand", "--h-mid", "--h-violet",
  "--r-sm", "--r-md", "--r-lg", "--r-xl", "--r-pill",
  "--shell", "--gutter", "--sec-y", "--nav-h",
  "--ease", "--t-fast", "--t-base", "--t-slow",
  "--font-sans", "--font-display", "--font-mono",
  "--hero-focus",
]);

/**
 * Tokens that must be stated per theme even though their value holds no colour
 * function: the hero artwork ships as two graded files (blue for light, a
 * luminance-inverted twin for dark), and keeping the pair explicit is what
 * stops one theme from silently inheriting the other's image.
 */
const PAIRED_ASSETS = new Set(["--hero-img"]);

/** Tokens whose value paints colour, and therefore must be re-stated per theme. */
const COLOURISH =
  /#[0-9a-fA-F]{3,8}\b|hsl\(|rgb\(|rgba\(|gradient|transparent|\bcolor-mix\b/;

/* 1 — every themable token must have a dark counterpart */
console.log("\n1. Token parity between themes");
const lightKeys = new Set(Object.keys(light));
const darkKeys = new Set(Object.keys(darkOverrides));
const themable = [...lightKeys].filter(
  (k) => !INVARIANT.has(k) && (PAIRED_ASSETS.has(k) || COLOURISH.test(light[k]))
);
const missing = themable.filter((k) => !darkKeys.has(k));
const invariantCount = [...lightKeys].filter((k) => INVARIANT.has(k)).length;

line("tokens declared (light)", String(lightKeys.size));
line("tokens declared (dark block)", String(darkKeys.size));
line("theme-invariant (declared once)", String(invariantCount));
line("tokens needing a pair", String(themable.length));

if (missing.length) {
  bad(`no dark counterpart for: ${missing.join(", ")}`);
} else {
  good(`all ${themable.length} paired tokens have a dark counterpart`);
}

// paired assets must differ between themes — inheriting the other mode's file
// is exactly the inconsistency this check exists to catch
const sameAsset = [...PAIRED_ASSETS].filter(
  (k) => darkKeys.has(k) && dark[k] === light[k]
);
if (sameAsset.length) {
  bad(`paired asset identical in both themes: ${sameAsset.join(", ")}`);
} else if ([...PAIRED_ASSETS].every((k) => darkKeys.has(k))) {
  good(`paired assets differ per theme (${[...PAIRED_ASSETS].join(", ")})`);
}

// an invariant token must NOT be redefined per theme, or the pairing drifts
const redefined = [...INVARIANT].filter((k) => darkKeys.has(k));
if (redefined.length) {
  bad(`theme-invariant token redefined in dark: ${redefined.join(", ")}`);
} else {
  good("no theme-invariant token is redefined in dark mode");
}

// and the dark block must not silently drop a colour it used to set
const orphan = [...darkKeys].filter((k) => !lightKeys.has(k));
if (orphan.length) {
  bad(`dark-only tokens with no light source: ${orphan.join(", ")}`);
} else {
  good("no dark-only token exists");
}

/* 2 — the two themes must walk one shared hue band
 *
 * Design rule from the brief: light walks azure -> white, dark walks
 * azure -> violet -> black. Both are allowed to reach the violet end, so the
 * right test is not "identical stops" but:
 *   a) each theme keeps every chromatic stop inside one contiguous band,
 *   b) each individual gradient has no internal hue jump,
 *   c) the two bands overlap rather than diverging, and
 *   d) dark surfaces actually reach the violet end (the blue-purple-black ask),
 *      while light surfaces stay anchored in blue (the blue-white ask).
 */
console.log("\n2. Shared hue band across both themes");
const BAND_WIDTH = 70; // max hue span a single theme may occupy
// The palette sweeps azure (214) -> periwinkle (232) -> violet (268), so a
// three-stop walk legitimately steps 18-27 degrees. Anything past 30 is a
// misplaced or duplicated stop rather than a deliberate step.
const JUMP = 30; // max hue jump between neighbouring stops of one gradient
const walkTokens = [
  "--grad-page",
  "--grad-hero",
  "--grad-page-head",
  "--grad-panel",
  "--grad-footer",
  "--grad-brand",
  "--grad-text",
  "--grad-hairline",
];

const bands = { light: [], dark: [] }; // per-theme chromatic hues

for (const token of walkTokens) {
  const l = resolveColour(light[token], light);
  const d = resolveColour(dark[token], dark);
  if (!l || !d) {
    bad(`${token} could not be parsed in both themes`);
    continue;
  }

  const lh = l.filter(isChromatic).map((s) => hue(s.rgb));
  const dh = d.filter(isChromatic).map((s) => hue(s.rgb));
  bands.light.push(...lh);
  bands.dark.push(...dh);

  // (b) no single gradient may jump hue part-way through
  const maxJump = (arr) => {
    let worst = 0;
    for (let i = 1; i < arr.length; i++) {
      const raw = Math.abs(arr[i] - arr[i - 1]);
      worst = Math.max(worst, Math.min(raw, 360 - raw));
    }
    return worst;
  };
  const jump = Math.max(maxJump(lh), maxJump(dh));

  const text =
    `${token.padEnd(17)} light=[${lh.map((h) => h.toFixed(0)).join(", ") || "—"}] ` +
    `dark=[${dh.map((h) => h.toFixed(0)).join(", ") || "—"}] ` +
    `jump=${jump.toFixed(1)}°`;
  if (jump <= JUMP) good(text);
  else
    bad(`${text} — the walk jumps ${jump.toFixed(1)}° mid-gradient (>${JUMP}°)`);
}

// (a) each theme's own band
const span = (arr) => Math.max(...arr) - Math.min(...arr);
for (const [name, arr] of Object.entries(bands)) {
  const s = span(arr);
  const text =
    `${name.padEnd(5)} band ${Math.min(...arr).toFixed(0)}°—` +
    `${Math.max(...arr).toFixed(0)}° (span ${s.toFixed(0)}°, ${arr.length} stops)`;
  if (s <= BAND_WIDTH) good(text);
  else bad(`${text} — wider than the ${BAND_WIDTH}° budget for one theme`);
}

// (c) the bands must overlap, not diverge into two palettes
const overlap =
  Math.min(Math.max(...bands.light), Math.max(...bands.dark)) -
  Math.max(Math.min(...bands.light), Math.min(...bands.dark));
if (overlap > 0) good(`the two bands overlap across ${overlap.toFixed(0)}° of hue`);
else bad("the light and dark hue bands do not overlap — the pair would look bolted together");

// (d) the colour direction promised by the brief: dark must carry the violet
// end somewhere in its palette (the large brand and gradient-text fills are
// what make it read as blue-purple-black) and light must share that violet end
// so the two read as one pair, while light's page surfaces stay blue-anchored.
const darkViolet = walkTokens.filter((token) =>
  (resolveColour(dark[token], dark) || []).some(
    (s) => isChromatic(s) && hue(s.rgb) >= 248 && hue(s.rgb) <= 292
  )
);
if (darkViolet.length) {
  good(`dark reaches the violet end in: ${darkViolet.join(", ")}`);
} else {
  bad("no dark gradient reaches the violet end (248°—292°) — it would not read as blue-purple-black");
}

const lightViolet = walkTokens.filter((token) =>
  (resolveColour(light[token], light) || []).some(
    (s) => isChromatic(s) && hue(s.rgb) >= 248
  )
);
if (lightViolet.length) {
  good(`light shares the violet end too, in: ${lightViolet.join(", ")}`);
} else {
  bad("light never reaches violet — the two palettes would not be a matching pair");
}

const lightBlue = ["--grad-page", "--grad-hero", "--grad-page-head"].every((token) =>
  (resolveColour(light[token], light) || []).some(
    (s) => s.sat >= 0.15 && hue(s.rgb) >= 200 && hue(s.rgb) <= 245
  )
);
if (lightBlue) good("light page surfaces are anchored in blue (blue-white gradient)");
else bad("light mode has no blue anchor in its page surfaces");

/* 3 — contrast */
console.log("\n3. WCAG contrast (AA body 4.5, AA large 3.0, UI 3.0)");
const pairs = [
  ["--text", "--bg", 4.5, "body text on page"],
  ["--text", "--surface", 4.5, "body text on card"],
  ["--text-soft", "--bg", 4.5, "secondary text on page"],
  ["--text-soft", "--surface", 4.5, "secondary text on card"],
  ["--text-muted", "--bg", 4.5, "muted text on page"],
  ["--text-muted", "--surface-2", 4.5, "muted text on alt surface"],
  ["--text", "--surface-2", 4.5, "text on alt surface"],
  ["--brand", "--bg", 4.5, "link colour on page"],
  ["--brand", "--surface", 4.5, "link colour on card"],
  ["--brand-strong", "--brand-soft", 4.5, "brand text on brand chip"],
  ["--text", "--brand-soft", 4.5, "text on brand chip"],
];

const gradients = [
  ["--text-on-brand", "--grad-brand", 4.5, "button label on brand gradient"],
  ["--text-on-brand", "--grad-text", 3.0, "label on gradient text fill"],
];

for (const [theme, table] of [["light", light], ["dark", dark]]) {
  console.log(`\n   -- ${theme} --`);
  for (const [fgTok, bgTok, min, label] of pairs) {
    if (!table[fgTok] || !table[bgTok]) {
      bad(`${theme}: missing token for ${label}`);
      continue;
    }
    const r = worst(table[fgTok], table[bgTok], table);
    const okFlag = r >= min;
    const text = `${label.padEnd(30)} ${r.toFixed(2)}:1  (min ${min})`;
    if (okFlag) good(text);
    else bad(`${theme}: ${text}`);
  }

  for (const [fgTok, bgTok, min, label] of gradients) {
    const r = worst(table[fgTok], table[bgTok], table);
    const text = `${label.padEnd(30)} ${r.toFixed(2)}:1  (min ${min})`;
    if (r >= min) good(text);
    else bad(`${theme}: ${text}`);
  }
}

/* hero veil must actually cover the photograph in both themes */
console.log("\n4. Hero veil coverage");
for (const [theme, table] of [["light", light], ["dark", dark]]) {
  const raw = expand(table["--hero-veil"], table);
  // every trailing "/ A" alpha in the veil's hsl() stops
  const alphas = [...raw.matchAll(/\/\s*([\d.]+)\s*\)/g)].map((m) =>
    parseFloat(m[1])
  );
  const solid = (raw.match(/#[0-9a-fA-F]{6}\s+100%/g) || []).length;
  const total = alphas.length + solid;
  const allOpaqueEnough = total >= 3 && alphas.every((a) => a >= 0.8);
  const text =
    `${theme.padEnd(6)} stops=${total} alphas=[${alphas.join(", ")}] ` +
    `opaque-tail=${solid > 0 ? "yes" : "no"}`;
  if (allOpaqueEnough && solid > 0) good(text);
  else bad(`${text} — the photograph could overpower the headline`);
}

console.log(
  failures === 0
    ? "\nTheme audit passed: token parity, shared hue path and contrast all hold.\n"
    : `\nTheme audit FAILED with ${failures} problem(s).\n`
);
process.exitCode = failures ? 1 : 0;
