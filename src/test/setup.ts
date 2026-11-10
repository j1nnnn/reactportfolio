import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// jsdom has no matchMedia. setReducedMotion(true) fakes the OS asking for reduced motion, which the
// site ignores (ADR 0003); askForCalmVersion() is the ?motion=reduced link that does turn motion down.
let reduced = false;
export function setReducedMotion(on: boolean) {
  reduced = on;
}
export function askForCalmVersion() {
  window.history.replaceState(null, "", "/?motion=reduced");
}
afterEach(() => {
  setReducedMotion(false);
  window.history.replaceState(null, "", "/");
  sessionStorage.clear();
  document.documentElement.classList.remove("motion-reduced");
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? reduced : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  }),
});
