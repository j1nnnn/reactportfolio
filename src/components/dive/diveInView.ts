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
