// Reads assets/icons.svg and exposes the inner markup of the sprite,
// so the icon set has exactly one source of truth.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const spritePath = join(here, "..", "assets", "icons.svg");

export async function loadSprite() {
  const raw = await readFile(spritePath, "utf8");
  const inner = raw
    .replace(/^[\s\S]*?<defs>/, "")
    .replace(/<\/defs>[\s\S]*$/, "")
    .trim();
  if (!inner.includes("<symbol")) {
    throw new Error("assets/icons.svg did not yield any <symbol> elements");
  }
  return inner;
}
