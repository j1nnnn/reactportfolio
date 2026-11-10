#!/usr/bin/env node
// Lighthouse check: serves the built site in out/ under the base path, runs Lighthouse (mobile,
// its default) against the home page and one case study, prints the four category scores and fails
// when a page is below the spec's floors. Run after `next build`. Needs Chrome installed.
//
//   node scripts/lighthouse.mjs [outDir]
//
// Lighthouse runs through a pinned `npx` rather than a devDependency: it is a large tree that only
// this manual check needs, so `npm ci` and the test run stay lean. First run downloads it.

import { execFile } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const BASE_PATH = "/reactportfolio";
const LIGHTHOUSE = "lighthouse@12";
export const PAGES = ["/", "/work/jepa"];
export const FLOORS = { performance: 85, accessibility: 95 };
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

/** Scores (0-100) from a Lighthouse JSON report, keyed by category id. */
export const scoresOf = (report) =>
  Object.fromEntries(CATEGORIES.map((c) => [c, Math.round((report.categories[c]?.score ?? 0) * 100)]));

/** One message per floor a page's scores fall below; empty when it passes. */
export const belowFloors = (scores) =>
  Object.entries(FLOORS)
    .filter(([c, floor]) => scores[c] < floor)
    .map(([c, floor]) => `${c} ${scores[c]} < ${floor}`);

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".webp": "image/webp", ".ico": "image/x-icon", ".woff2": "font/woff2", ".pdf": "application/pdf",
};

/** Serves outDir the way GitHub Pages does: under the base path, with .html and index.html fallbacks. */
const serve = (outDir) =>
  new Promise((done) => {
    const server = createServer((req, res) => {
      const url = decodeURIComponent((req.url ?? "/").split(/[?#]/)[0]);
      const p = join(outDir, url.slice(BASE_PATH.length).replace(/\/+$/, ""));
      const file = url.startsWith(BASE_PATH) && p.startsWith(outDir)
        ? [p, `${p}.html`, join(p, "index.html")].find((c) => existsSync(c) && statSync(c).isFile())
        : undefined;
      if (!file) {
        res.writeHead(404, { "content-type": TYPES[".html"] });
        return res.end(existsSync(join(outDir, "404.html")) ? readFileSync(join(outDir, "404.html")) : "not found");
      }
      res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
      res.end(readFileSync(file));
    });
    server.listen(0, "127.0.0.1", () => done(server));
  });

const lighthouse = (url) =>
  new Promise((done, failed) => {
    const args = ["--yes", LIGHTHOUSE, url, "--output=json", "--output-path=stdout", "--quiet",
      "--only-categories=" + CATEGORIES.join(","), '--chrome-flags="--headless=new"'];
    // shell: npx is npx.cmd on Windows.
    execFile("npx", args, { shell: true, maxBuffer: 256 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) return failed(new Error(`lighthouse failed for ${url}: ${stderr || err.message}`));
      done(JSON.parse(stdout));
    });
  });

async function main() {
  const outDir = resolve(process.argv[2] ?? "out");
  if (!existsSync(outDir)) {
    console.error(`lighthouse: ${outDir} does not exist. Run \`npm run build\` first.`);
    process.exit(2);
  }
  const server = await serve(outDir);
  const origin = `http://127.0.0.1:${server.address().port}`;
  const failures = [];
  try {
    for (const page of PAGES) {
      const scores = scoresOf(await lighthouse(`${origin}${BASE_PATH}${page}`));
      console.log(`lighthouse ${page}: ${CATEGORIES.map((c) => `${c} ${scores[c]}`).join(", ")}`);
      for (const msg of belowFloors(scores)) failures.push(`${page}: ${msg}`);
    }
  } finally {
    server.close();
  }
  if (failures.length) {
    console.error(`lighthouse: FAILED (${failures.length})\n  ${failures.join("\n  ")}`);
    process.exit(1);
  }
  console.log("lighthouse: passed");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(2);
  });
}
