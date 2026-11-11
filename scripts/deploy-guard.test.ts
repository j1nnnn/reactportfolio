import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { deflateSync } from "node:zlib";
import { dirname, join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { PERSONAL_LINE_PLACEHOLDER, PHOTO_PLACEHOLDER } from "../src/content/personal";

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

// A one-page PDF built the way Chromium prints the résumé: a Type0 font with Identity-H glyph codes, a
// ToUnicode map back to characters, and a deflated content stream.
const pdf = (text: string, { toUnicode = true } = {}) => {
  const chars = [...new Set(text)];
  const hex = (n: number) => n.toString(16).padStart(4, "0").toUpperCase();
  // Without a ToUnicode map the glyph codes are all a reader has; start them at "AA" so that misreading
  // them as characters would look like text rather than fail by luck.
  const glyph = (c: string) => hex(chars.indexOf(c) + (toUnicode ? 3 : 0x4141));
  const cmap =
    `/CIDInit /ProcSet findresource begin 12 dict begin begincmap\n1 begincodespacerange\n<0000> <FFFF>\nendcodespacerange\n` +
    `${chars.length} beginbfchar\n${chars.map((c) => `<${glyph(c)}> <${hex(c.charCodeAt(0))}>`).join("\n")}\nendbfchar\n` +
    `endcmap CMapName currentdict /CMap defineresource pop end end`;
  const content = deflateSync(`BT /F4 11 Tf 1 0 0 -1 72 720 Tm [<${[...text].map(glyph).join("")}>] TJ ET`);
  const stream = (data: Buffer, dict = "") => [`<< ${dict} /Length ${data.length} >>\nstream\n`, data, "\nendstream"];
  const objects = [
    ["<< /Type /Catalog /Pages 2 0 R >>"],
    ["<< /Type /Pages /Kids [3 0 R] /Count 1 >>"],
    ["<< /Type /Page /Parent 2 0 R /Resources << /Font << /F4 5 0 R >> >> /Contents 4 0 R >>"],
    stream(content, "/Filter /FlateDecode"),
    [`<< /Type /Font /Subtype /Type0 /BaseFont /AAAAAA+Invented /Encoding /Identity-H${toUnicode ? " /ToUnicode 6 0 R" : ""} >>`],
    stream(Buffer.from(cmap, "latin1")),
  ];
  const parts: (string | Buffer)[] = ["%PDF-1.4\n%\xd3\xeb\xe9\xe1\n"];
  objects.forEach((o, i) => parts.push(`${i + 1} 0 obj\n`, ...o, "\nendobj\n"));
  parts.push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n%%EOF\n`);
  return Buffer.concat(parts.map((p) => (typeof p === "string" ? Buffer.from(p, "latin1") : p)));
};

let dir: string;
const write = (path: string, text: string | Buffer) => {
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
  write("resume.pdf", pdf("Jinwoo Lim · Software Engineer · jin@j1nnnn.dev"));
  write("sitemap.xml", sitemap([SITE, `${SITE}work/jepa`]));
  write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
};
const guard = (...flags: string[]) => {
  const r = spawnSync(process.execPath, [GUARD, dir, ...flags], { cwd: dir, encoding: "utf8" });
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

// The blocked-name list lives at the root the guard runs from (here, the fixture dir). Names are invented.
const writeBlocklist = (...names: string[]) => write(".deploy-guard-blocklist", `# invented\n${names.join("\n")}\n`);

describe("deploy guard: deploy mode", () => {
  it("fails in deploy mode when there is no blocked-name list, and says how to create it", () => {
    goodExport();
    const r = guard("--deploy");
    expect(r.code).toBe(1);
    expect(r.out).toContain("no .deploy-guard-blocklist");
    expect(r.out).toContain("one name per line");
    expect(r.out).not.toContain("deploy guard: passed");
  });

  it("passes in deploy mode when the list is there and nothing on it ships", () => {
    goodExport();
    writeBlocklist("Zorblax Quentaro");
    const r = guard("--deploy");
    expect(r.out).toContain("deploy guard: passed");
    expect(r.code).toBe(0);
  });

  it("without deploy mode (CI), runs the public checks and says the private checks were skipped", () => {
    goodExport();
    const r = guard();
    expect(r.code).toBe(0);
    expect(r.out).toContain("private checks were skipped");
  });

  it("fails in deploy mode when the list has no names in it", () => {
    goodExport();
    writeBlocklist();
    const r = guard("--deploy");
    expect(r.code).toBe(1);
    expect(r.out).toContain(".deploy-guard-blocklist has no names");
  });

  it("fails when a page contains a name on the list", () => {
    goodExport();
    writeBlocklist("Zorblax Quentaro");
    write("work/jepa.html", page({ preview: previewTags(`${SITE}og/jepa.png`), extra: "<i>zorblax quentaro</i>" }));
    const r = guard("--deploy");
    expect(r.code).toBe(1);
    expect(r.out).toMatch(/work[\\/]jepa\.html: contains the blocked name on line 2 of/);
  });
});

describe("deploy guard: résumé PDF", () => {
  it("fails when the résumé contains a name on the list", () => {
    goodExport();
    writeBlocklist("Zorblax Quentaro");
    write("resume.pdf", pdf("Jinwoo Lim · Led the ZORBLAX QUENTARO migration"));
    const r = guard("--deploy");
    expect(r.code).toBe(1);
    expect(r.out).toContain("resume.pdf: contains the blocked name on line 2 of");
  });

  it("fails when the résumé contains a phone number", () => {
    goodExport();
    write("resume.pdf", pdf("Jinwoo Lim · (201) 555-0143 · Software Engineer"));
    const r = guard();
    expect(r.code).toBe(1);
    expect(r.out).toContain('resume.pdf: looks like a phone number: "(201) 555-0143"');
  });

  it("says which line of the list each blocked name is on, without printing the name", () => {
    goodExport();
    writeBlocklist("Zorblax Quentaro", "Mirvane Oxtell");
    write("resume.pdf", pdf("Jinwoo Lim · Built Mirvane Oxtell at the Zorblax Quentaro hackathon"));
    const r = guard("--deploy");
    expect(r.code).toBe(1);
    expect(r.out).toContain("resume.pdf: contains the blocked name on line 2 of .deploy-guard-blocklist");
    expect(r.out).toContain("resume.pdf: contains the blocked name on line 3 of .deploy-guard-blocklist");
    expect(r.out.toLowerCase()).not.toContain("mirvane");
  });

  it("fails when a résumé font has no map back to characters, rather than reading it as gibberish", () => {
    goodExport();
    write("resume.pdf", pdf("Jinwoo Lim · Software Engineer", { toUnicode: false }));
    const r = guard();
    expect(r.code).toBe(1);
    expect(r.out).toContain("resume.pdf: can't read this PDF");
  });

  it("reads the real résumé the site ships, and finds no phone number in it", () => {
    goodExport();
    copyFileSync(resolve("public/resume.pdf"), join(dir, "resume.pdf"));
    const r = guard();
    expect(r.out).not.toContain("resume.pdf:");
    expect(r.code).toBe(0);
  });

  it("fails when it can't read the résumé", () => {
    goodExport();
    write("resume.pdf", Buffer.from("%PDF-1.4\n1 0 obj\n<< /Length 9 /Filter /FlateDecode >>\nstream\nnot zlib!\nendstream\nendobj\n"));
    const r = guard();
    expect(r.code).toBe(1);
    expect(r.out).toContain("resume.pdf: can't read this PDF");
  });
});

describe("deploy guard: About placeholders", () => {
  it("lets the site ship without a photo yet: the photo placeholder doesn't block (Jin's call)", () => {
    goodExport();
    write("index.html", page({ extra: person + `<div aria-label="${PHOTO_PLACEHOLDER}"></div>` }));
    const r = guard();
    expect(r.out).not.toContain("placeholder");
    expect(r.code).toBe(0);
  });

  it("fails when a page still shows the personal-line placeholder", () => {
    goodExport();
    write("index.html", page({ extra: person + `<p>${PERSONAL_LINE_PLACEHOLDER}</p>` }));
    const r = guard();
    expect(r.code).toBe(1);
    expect(r.out).toMatch(/index\.html: still shows the About personal-line placeholder/);
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
