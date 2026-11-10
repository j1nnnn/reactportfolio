#!/usr/bin/env node
// Deploy guard (Seam B): reads the built site in out/ — exactly what GitHub Pages will serve — and
// refuses to pass if anything broken or private would ship. Run after `next build`, before deploy.
//
//   node scripts/deploy-guard.mjs [outDir]
//
// Blocked names: one per line in .deploy-guard-blocklist at the repo root (gitignored, never
// committed: the list itself would leak the names). Without it the guard says so and runs the
// public checks only, which is what CI gets.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const BASE_PATH = "/reactportfolio";
// Link previews need absolute URLs: unfurlers don't resolve relative ones.
const ORIGIN = "https://j1nnnn.github.io";
const SITE_URL = `${ORIGIN}${BASE_PATH}`;
const outDir = resolve(process.argv[2] ?? "out");
const root = resolve(".");
const failures = [];
const fail = (file, msg) => failures.push(`${relative(root, file) || file}: ${msg}`);

if (!existsSync(outDir)) {
  console.error(`deploy guard: ${outDir} does not exist. Run \`npm run build\` first.`);
  process.exit(2);
}

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p) : files.push(p);
  }
})(outDir);

const textFiles = files.filter((f) => /\.(html|txt|js|json|xml|css)$/.test(f));
const htmlFiles = files.filter((f) => f.endsWith(".html"));

// 1. GitHub Pages runs Jekyll unless told not to, and Jekyll drops the _next/ folder.
if (!existsSync(join(outDir, ".nojekyll"))) fail(outDir, "missing .nojekyll (Pages would drop _next/)");

const resolves = (urlPath) => {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]).slice(BASE_PATH.length) || "/";
  const p = join(outDir, clean);
  return [p, `${p}.html`, join(p, "index.html")].some((c) => existsSync(c) && statSync(c).isFile());
};

// 2. Every page has a title, a description and link-preview tags, and its preview image ships.
for (const f of htmlFiles) {
  if (f.endsWith("404.html") || f.includes(`${join("_not-found")}`)) continue;
  const html = readFileSync(f, "utf8");
  if (!/<title>[^<]+<\/title>/.test(html)) fail(f, "no <title>");
  if (!/<meta name="description" content="[^"]+"/.test(html)) fail(f, "no meta description");
  if (!/<meta property="og:title" content="[^"]+"/.test(html)) fail(f, "no og:title (link previews)");
  const image = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  if (!image) fail(f, "no og:image (link previews)");
  else if (!image.startsWith(`${SITE_URL}/`) || !resolves(image.slice(ORIGIN.length))) {
    fail(f, `og:image not in the export: ${image}`);
  }
  if (!/<meta name="twitter:card" content="summary_large_image"/.test(html)) {
    fail(f, "no twitter:card summary_large_image (link previews)");
  }
}

// 3. Every internal link and asset sits under the base path and resolves to a built file.
for (const f of htmlFiles) {
  const html = readFileSync(f, "utf8");
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (url.startsWith("//")) continue;
    const path = url.split(/[?#]/)[0]; // "/reactportfolio?focus=jepa" is the home page with a query
    if (!path.startsWith(`${BASE_PATH}/`) && path !== BASE_PATH) fail(f, `link outside ${BASE_PATH}: ${url}`);
    else if (!resolves(url)) fail(f, `broken internal link: ${url}`);
  }
}

// 4. Search engines get a sitemap, a robots file pointing to it, and Person data on the home page.
const SITE_URL = `https://j1nnnn.github.io${BASE_PATH}/`;
const sitemapFile = join(outDir, "sitemap.xml");
if (!existsSync(sitemapFile)) fail(outDir, "missing sitemap.xml");
else {
  const locs = [...readFileSync(sitemapFile, "utf8").matchAll(/<loc>([^<]*)<\/loc>/g)].map(([, u]) => u.trim());
  if (!locs.length) fail(sitemapFile, "sitemap lists no URLs");
  for (const url of locs) {
    if (!url.startsWith(SITE_URL) && url !== SITE_URL.slice(0, -1)) fail(sitemapFile, `sitemap URL not under ${SITE_URL}: ${url}`);
    else if (!resolves(new URL(url).pathname)) fail(sitemapFile, `sitemap URL has no built page: ${url}`);
  }
}
const robotsFile = join(outDir, "robots.txt");
if (!existsSync(robotsFile)) fail(outDir, "missing robots.txt");
else {
  const robots = readFileSync(robotsFile, "utf8");
  if (!new RegExp(`^Sitemap:\\s*${SITE_URL}sitemap\\.xml\\s*$`, "mi").test(robots))
    fail(robotsFile, `robots.txt does not point to ${SITE_URL}sitemap.xml`);
  if (/^Disallow:\s*\/\s*$/mi.test(robots)) fail(robotsFile, "robots.txt blocks crawling");
}
const homeFile = join(outDir, "index.html");
if (existsSync(homeFile)) {
  const persons = [...readFileSync(homeFile, "utf8").matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
    .map(([, json]) => { try { return JSON.parse(json); } catch { return null; } })
    .filter((d) => d?.["@type"] === "Person" && d.name && d.url === SITE_URL);
  if (!persons.length) fail(homeFile, `home page has no schema.org Person data (name, url ${SITE_URL})`);
  // Person data repeats what the site shows; contact details beyond that stay off it.
  for (const key of ["telephone", "address", "faxNumber", "birthDate"]) {
    if (persons.some((d) => key in d)) fail(homeFile, `Person data has ${key}`);
  }
} else fail(outDir, "missing index.html (home page)");

// 5. Nothing private or placeholder ships.
const PHONE = /(?:\+?1[-.\s])?\(?\b\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/;
const PLACEHOLDER = /\bexample\.com\b/i;
const blocklistFile = join(root, ".deploy-guard-blocklist");
const blocked = existsSync(blocklistFile)
  ? readFileSync(blocklistFile, "utf8").split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#"))
  : null;
for (const f of textFiles) {
  const text = readFileSync(f, "utf8");
  const phone = text.match(PHONE);
  if (phone) fail(f, `looks like a phone number: "${phone[0]}"`);
  if (PLACEHOLDER.test(text)) fail(f, "contains a placeholder address (example.com)");
  for (const name of blocked ?? []) {
    if (text.toLowerCase().includes(name.toLowerCase())) fail(f, "contains a blocked name from .deploy-guard-blocklist");
  }
}

console.log(`deploy guard: checked ${htmlFiles.length} pages, ${textFiles.length} text files in ${relative(root, outDir)}`);
if (!blocked) console.log("deploy guard: no .deploy-guard-blocklist found, so blocked-name checks were skipped");
if (failures.length) {
  console.error(`deploy guard: FAILED (${failures.length})\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.log("deploy guard: passed");
