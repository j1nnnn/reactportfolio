import { describe, expect, it } from "vitest";
import { belowFloors, scoresOf } from "./lighthouse.mjs";

const report = (perf, a11y, bp = 1, seo = 1) => ({
  categories: { performance: { score: perf }, accessibility: { score: a11y }, "best-practices": { score: bp }, seo: { score: seo } },
});

describe("lighthouse floors", () => {
  it("reads the four category scores as 0-100", () => {
    expect(scoresOf(report(0.9, 0.97, 0.8, 1))).toEqual({ performance: 90, accessibility: 97, "best-practices": 80, seo: 100 });
  });

  it("passes at exactly the floors", () => {
    expect(belowFloors(scoresOf(report(0.85, 0.95)))).toEqual([]);
  });

  it("fails below 85 performance or 95 accessibility", () => {
    expect(belowFloors(scoresOf(report(0.84, 0.95)))).toEqual(["performance 84 < 85"]);
    expect(belowFloors(scoresOf(report(0.99, 0.94)))).toEqual(["accessibility 94 < 95"]);
  });

  it("ignores best-practices and SEO for pass/fail", () => {
    expect(belowFloors(scoresOf(report(1, 1, 0.1, 0.1)))).toEqual([]);
  });
});
