"use client";

import { useSyncExternalStore } from "react";

// "Is the dive on screen": set by the dive, read by the island so only one 3D scene runs at a time.
let inView = false;
const listeners = new Set<() => void>();

export function setDiveInView(value: boolean) {
  if (value === inView) return;
  inView = value;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** True while the dive covers the screen. */
export function useDiveInView() {
  return useSyncExternalStore(subscribe, () => inView, () => false);
}

// The home page section whose station is in the dive's view, if any: read by the site's bar.
export type DiveSection = "about" | "experience" | "skills" | "projects";
let section: DiveSection | undefined;

export function setDiveSection(value: DiveSection | undefined) {
  if (value === section) return;
  section = value;
  listeners.forEach((l) => l());
}

/** The section of the station the dive holds, while it holds one. */
export function useDiveSection() {
  return useSyncExternalStore(subscribe, () => section, () => undefined);
}
