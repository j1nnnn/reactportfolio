import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

// Seam B: the deploy guard run over a built export. The fixture is a minimal export that passes.
const GUARD = resolve("scripts/deploy-guard.mjs");
const SITE = "https://j1nnnn.github.io/reactportfolio/";
const page = (extra = "") =>
  `<html><head><title>Jinwoo Lim</title><meta name="description" content="Engineer"/>` +
  `<meta property="og:title" content="Jinwoo Lim"/>${extra}</head><body></body></html>`;
const person = `<script type="application/ld+json">${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jinwoo Lim",
  description: "Engineer · Inventor · Builder",
  url: SITE,
})}</script>`;
const sitemap = (urls: string[]) =>
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
  urls.map((u) => `<url><loc>${u}</loc></url>`).join("") +
  `</urlset>`;

let dir: string;
const write = (path: string, text: string) => {
  mkdirSync(dirname(join(dir, path)), { recursive: true });
  writeFileSync(join(dir, path), text);
};
const goodExport = () => {
  dir = mkdtempSync(join(tmpdir(), "guard-"));
  write(".nojekyll", "");
  write("index.html", page(person));
  write("work/jepa.html", page());
  write("sitemap.xml", sitemap([SITE, `${SITE}work/jepa`]));
  write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
};
const guard = () => {
  const r = spawnSync(process.execPath, [GUARD, dir], { cwd: dir, encoding: "utf8" });
  return { code: r.status, out: r.stdout + r.stderr };
};

afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe("deploy guard: search basics", () => {
  it("passes an export with a sitemap, a robots file and Person data", () => {
    goodExport();
    const r = guard();
    expect(r.out).toContain("deploy guard: passed");
    expect(r.code).toBe(0);
  });

  it("fails when the sitemap is missing", () => {
    goodExport();
    rmSync(join(dir, "sitemap.xml"));
    const r = guard();
    expect(r.code).toBe(1);
    expect(r.out).toContain("missing sitemap.xml");
  });

  it("fails when a sitemap URL has no built page behind it", () => {
    goodExport();
    write("sitemap.xml", sitemap([SITE, `${SITE}work/jepa`, `${SITE}work/gone`]));
    const r = guard();
    expect(r.code).toBe(1);
    expect(r.out).toContain(`sitemap URL has no built page: ${SITE}work/gone`);
    expect(r.out).not.toContain("work/jepa");
  });

  it("fails when a sitemap URL is not under the site's address", () => {
    goodExport();
    write("sitemap.xml", sitemap([SITE, "/reactportfolio/work/jepa"]));
    const r = guard();
    expect(r.code).toBe(1);
    expect(r.out).toContain(`sitemap URL not under ${SITE}: /reactportfolio/work/jepa`);
  });

  it("fails when the robots file is missing", () => {
    goodExport();
    rmSync(join(dir, "robots.txt"));
    const r = guard();
    expect(r.code).toBe(1);
    expect(r.out).toContain("missing robots.txt");
  });

  it("fails when the robots file is the old one, with no sitemap line", () => {
    goodExport();
    write("robots.txt", "# https://www.robotstxt.org/robotstxt.html\nUser-agent: *\nDisallow:\n");
    const r = guard();
    expect(r.code).toBe(1);
    expect(r.out).toContain(`robots.txt does not point to ${SITE}sitemap.xml`);
  });

  it("fails when the robots file blocks crawling", () => {
    goodExport();
    write("robots.txt", `User-agent: *\nDisallow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
    const r = guard();
    expect(r.code).toBe(1);
    expect(r.out).toContain("robots.txt blocks crawling");
  });

  it("fails when the home page has no Person data", () => {
    goodExport();
    write("index.html", page());
    const r = guard();
    expect(r.code).toBe(1);
    expect(r.out).toContain("home page has no schema.org Person data");
  });

  it("fails when the Person data carries a phone number or an address", () => {
    goodExport();
    const leaky = { "@context": "https://schema.org", "@type": "Person", name: "Jinwoo Lim", url: SITE, telephone: "x", address: "y" };
    write("index.html", page(`<script type="application/ld+json">${JSON.stringify(leaky)}</script>`));
    const r = guard();
    expect(r.code).toBe(1);
    expect(r.out).toContain("Person data has telephone");
    expect(r.out).toContain("Person data has address");
  });
});
