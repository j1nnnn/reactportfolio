// Seam B: the deploy guard run over a built export (a minimal fixture of what `next build` writes to out/).
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const CSP_META = `<meta http-equiv="Content-Security-Policy" content="default-src &#x27;self&#x27;; object-src &#x27;none&#x27;"/>`;

const page = (head) =>
  `<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/>${head}<title>Jin</title>` +
  `<meta name="description" content="Engineer."/><meta property="og:title" content="Jin"/></head><body></body></html>`;

let dir;
const buildExport = (pages) => {
  dir = mkdtempSync(join(tmpdir(), "deploy-guard-"));
  writeFileSync(join(dir, ".nojekyll"), "");
  for (const [path, html] of Object.entries(pages)) {
    mkdirSync(join(dir, path, ".."), { recursive: true });
    writeFileSync(join(dir, path), html);
  }
  return spawnSync(process.execPath, ["scripts/deploy-guard.mjs", dir], { encoding: "utf8" });
};
afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe("deploy guard", () => {
  it("passes an export where every page carries the CSP meta tag", () => {
    const run = buildExport({ "index.html": page(CSP_META), "work/jepa.html": page(CSP_META) });
    expect(run.stderr).toBe("");
    expect(run.status).toBe(0);
  });

  it("fails when a page lacks the CSP meta tag", () => {
    const run = buildExport({ "index.html": page(CSP_META), "work/jepa.html": page("") });
    expect(run.status).toBe(1);
    expect(run.stderr).toMatch(/work[\\/]jepa\.html: no Content-Security-Policy meta tag/);
  });
});
