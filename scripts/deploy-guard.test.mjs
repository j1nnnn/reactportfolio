// Seam B: the deploy guard run over a built export (a small fixture of out/).
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const SITE = "https://j1nnnn.github.io/reactportfolio";
const dirs = [];
afterEach(() => dirs.splice(0).forEach((d) => rmSync(d, { recursive: true, force: true })));

function exportWith(files) {
  const out = mkdtempSync(join(tmpdir(), "guard-out-"));
  dirs.push(out);
  for (const [path, content] of Object.entries({ ".nojekyll": "", ...files })) {
    mkdirSync(dirname(join(out, path)), { recursive: true });
    writeFileSync(join(out, path), content);
  }
  return out;
}

function page(extraHead = "") {
  return `<!DOCTYPE html><html><head><title>Jinwoo Lim</title>
<meta name="description" content="Engineer · Inventor · Builder."/>
<meta property="og:title" content="Jinwoo Lim"/>${extraHead}</head><body></body></html>`;
}

const previewTags = (url) =>
  `<meta property="og:image" content="${url}"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:image" content="${url}"/>`;

function runGuard(out) {
  const r = spawnSync(process.execPath, ["scripts/deploy-guard.mjs", out], { encoding: "utf8" });
  return { code: r.status, output: `${r.stdout}${r.stderr}` };
}

describe("deploy guard: link-preview images", () => {
  it("fails when a page declares no og:image", () => {
    const { code, output } = runGuard(exportWith({ "index.html": page() }));
    expect(code).toBe(1);
    expect(output).toContain("no og:image");
  });

  it("fails when the og:image a page names is not in the export", () => {
    const out = exportWith({ "index.html": page(previewTags(`${SITE}/og/home.png`)) });
    const { code, output } = runGuard(out);
    expect(code).toBe(1);
    expect(output).toContain(`og:image not in the export: ${SITE}/og/home.png`);
  });

  it("fails when a page has no Twitter large-image card", () => {
    const out = exportWith({
      "index.html": page(`<meta property="og:image" content="${SITE}/og/home.png"/>`),
      "og/home.png": "png",
    });
    const { code, output } = runGuard(out);
    expect(code).toBe(1);
    expect(output).toContain("no twitter:card summary_large_image");
  });

  it("passes a page whose preview image ships in the export", () => {
    const out = exportWith({ "index.html": page(previewTags(`${SITE}/og/home.png`)), "og/home.png": "png" });
    const { code, output } = runGuard(out);
    expect(output).toContain("deploy guard: passed");
    expect(code).toBe(0);
  });
});
