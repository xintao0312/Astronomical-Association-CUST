// Minimal static file server for local preview.
//
//   node tools/serve.mjs [port]
//
// The site needs no server — opening index.html directly works. This exists
// because `file://` hides some behaviour (relative fetch, caching) and some
// browsers restrict `file://` differently from `http://`.

import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.argv[2]) || 5178;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${port}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";

    const target = normalize(join(root, pathname));
    // reject anything that escapes the project directory
    if (target !== root && !target.startsWith(root + sep)) {
      res.writeHead(403).end("Forbidden");
      return;
    }

    const info = await stat(target).catch(() => null);
    if (!info || !info.isFile()) {
      const notFound = join(root, "404.html");
      const body = await stat(notFound).catch(() => null);
      res.writeHead(404, { "content-type": TYPES[".html"] });
      if (body) createReadStream(notFound).pipe(res);
      else res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "content-type": TYPES[extname(target).toLowerCase()] || "application/octet-stream",
      "content-length": info.size,
      "cache-control": "no-cache",
    });
    createReadStream(target).pipe(res);
  } catch (err) {
    res.writeHead(500, { "content-type": TYPES[".txt"] }).end(String(err));
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`CUST 理工天文 site → http://127.0.0.1:${port}/`);
  console.log("Ctrl+C to stop.");
});
