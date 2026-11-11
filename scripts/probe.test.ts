import { spawnSync } from "node:child_process";
import { copyFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, expect, it } from "vitest";

// Seam B, with the real résumé: the guard must be able to read the PDF Chromium printed for the site,
// and it must hold no phone number. (The rest of this export is incomplete, so other checks fail.)
const GUARD = resolve("scripts/deploy-guard.mjs");
let dir: string;
afterEach(() => rmSync(dir, { recursive: true, force: true }));

it("deploy guard reads the shipped résumé and finds no phone number in it", () => {
  dir = mkdtempSync(join(tmpdir(), "guard-resume-"));
  copyFileSync(resolve("public/resume.pdf"), join(dir, "resume.pdf"));
  const r = spawnSync(process.execPath, [GUARD, dir], { cwd: dir, encoding: "utf8" });
  const out = r.stdout + r.stderr;
  expect(out).toContain("deploy guard: FAILED"); // proves the guard ran its checks
  expect(out).not.toContain("resume.pdf:");
});
