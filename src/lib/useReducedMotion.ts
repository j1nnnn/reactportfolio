"use client";

import { useSyncExternalStore } from "react";

// ADR 0003: the site always runs its full motion, whatever the visitor's OS motion setting says. The
// calm version of each effect still exists, reachable only on purpose with ?motion=reduced (remembered
// for the tab), so it stays testable and anyone who needs it can ask for it.
const KEY = "motion";

const subscribe = () => () => {};

function read() {
  let value = new URLSearchParams(window.location.search).get("motion");
  try {
    if (value) sessionStorage.setItem(KEY, value);
    else value = sessionStorage.getItem(KEY);
  } catch {
    /* storage blocked */
  }
  const reduced = value === "reduced";
  document.documentElement.classList.toggle("motion-reduced", reduced);
  return reduced;
}

/** True only when the visitor asked for the calm version with ?motion=reduced. */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, read, () => false);
}
