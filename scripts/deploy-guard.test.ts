import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

// Seam B: the deploy guard run over a built export. goodExport() is a minimal export that passes every
// check; each test breaks one thing and expects the guard to name it.
const GUARD = resolve("scripts/deploy-guard.mjs");
const SITE = "https://j1nnnn.github.io/reactportfolio/";

const CSP = `<meta http-equiv="Content-Security-Policy" content="default-src &#x27;self&#x27;; object-src &#x27;none&#x27;"/>`;
const previewTags = (url: string) =>
  `<meta property="og:image" content="${url}"/><meta name="twitter:card" content="summary_large_image"/>` +
  `<meta name="twitter:image" content="${url}"/>`;

type Head = { csp?: string; preview?: string; extra?: string };
const page = ({ csp = CSP, preview = previewTags(`${SITE}og/home.png`), extra = "" }: Head = {}) =>
  `<!DOCTYPE html><html lang="en"><head>${csp}<title>Jinwoo Lim</title>` +
  `<meta name="description" content="Engineer · Inventor · Builder."/>` +
  `<meta property="og:title" content="Jinwoo Lim"/>${preview}${extra}</head><body></body></html>`;

const personData = (data: Record<string, unknown>) => `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
const person = personData({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jinwoo Lim",
  description: "Engineer · Inventor · Builder",
  url: SITE,
});
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
  write("index.html", page({ extra: person }));
  write("work/jepa.html", page({ preview: previewTags(`${SITE}og/jepa.png`) }));
  write("og/home.png", "png");
  write("og/jepa.png", "png");
  write("sitemap.xml", sitemap([SITE, `${SITE}work/jepa`]));
  write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
};
const guard = () => {
  const r = spawnSync(process.execPath, [GUARD, dir], { cwd: dir, encoding: "utf8" });
  return { code: r.status, out: r.stdout + r.stderr };
};

afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe("deploy guard", () => {
  it("passes an export that meets every check", () => {
    goodExport();
    const r = guard();
    expect(r.out).toContain("deploy guard: passed");
    expect(r.code).toBe(0);
  });
});

describe("deploy guard: search basics", () => {
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
    write("index.html", page({ extra: personData(leaky) }));
    const r = guard();
    expect(r.code).toBe(1);
    expect(r.out).toContain("Person data has telephone");
    expect(r.out).toContain("Person data has address");
  });
});

describe("deploy guard: link-preview images", () => {
  it("fails when a page declares no og:image", () => {
    goodExport();
    write("work/jepa.html", page({ preview: `<meta name="twitter:card" content="summary_large_image"/>` }));
    const r = guard();
    expect(r.code).toBe(1);
    expect(r.out).toContain("no og:image");
  });

  it("fails when the og:image a page names is not in the export", () => {
    goodExport();
    rmSync(join(dir, "og/jepa.png"));
    const r = guard();
    expect(r.code).toBe(1);
    expect(r.out).toContain(`og:image not in the export: ${SITE}og/jepa.png`);
  });

  it("fails when a page has no Twitter large-image card", () => {
    goodExport();
    write("work/jepa.html", page({ preview: `<meta property="og:image" content="${SITE}og/jepa.png"/>` }));
    const r = guard();
    expect(r.code).toBe(1);
    expect(r.out).toContain("no twitter:card summary_large_image");
  });
});

describe("deploy guard: Content Security Policy", () => {
  it("fails when a page lacks the CSP meta tag", () => {
    goodExport();
    write("work/jepa.html", page({ csp: "", preview: previewTags(`${SITE}og/jepa.png`) }));
    const r = guard();
    expect(r.code).toBe(1);
    expect(r.out).toMatch(/work[\\/]jepa\.html: no Content-Security-Policy meta tag/);
  });
});
