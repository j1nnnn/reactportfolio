"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";
const KEY = "review-motion";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** Dev-only review override: ?motion=full or ?motion=reduced, remembered for the tab. */
function devOverride(): string | null {
  if (process.env.NODE_ENV === "production") return null;
  let value = new URLSearchParams(window.location.search).get("motion");
  try {
    if (value) sessionStorage.setItem(KEY, value);
    else value = sessionStorage.getItem(KEY);
  } catch {
    /* storage blocked */
  }
  document.documentElement.classList.toggle("motion-full", value === "full");
  return value;
}

function read() {
  const override = devOverride();
  if (override === "full") return false;
  if (override === "reduced") return true;
  return window.matchMedia(QUERY).matches;
}

/** True when the visitor's OS asks for less motion (reduced-motion mode). */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, read, () => false);
}
