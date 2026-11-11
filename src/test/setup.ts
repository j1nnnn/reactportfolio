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

// jsdom has no IntersectionObserver and no layout. Nothing is on screen until a test says so:
// bringOnScreen(el) tells every observer watching el, or an element containing it, that it's in view.
type Observed = { target: Element; observer: FakeIntersectionObserver };
let observed: Observed[] = [];
class FakeIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];
  constructor(private callback: IntersectionObserverCallback) {}
  observe(target: Element) {
    observed.push({ target, observer: this });
  }
  unobserve(target: Element) {
    observed = observed.filter((o) => o.observer !== this || o.target !== target);
  }
  disconnect() {
    observed = observed.filter((o) => o.observer !== this);
  }
  takeRecords() {
    return [];
  }
  report(target: Element, on: boolean) {
    const entry = { target, isIntersecting: on, intersectionRatio: on ? 1 : 0 } as IntersectionObserverEntry;
    this.callback([entry], this as unknown as IntersectionObserver);
  }
}
function setOnScreen(el: Element, on: boolean) {
  for (const o of observed.filter((o) => o.target.contains(el))) o.observer.report(o.target, on);
}
export const bringOnScreen = (el: Element) => setOnScreen(el, true);
export const takeOffScreen = (el: Element) => setOnScreen(el, false);
Object.defineProperty(window, "IntersectionObserver", { writable: true, value: FakeIntersectionObserver });
afterEach(() => {
  observed = [];
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
