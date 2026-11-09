"use client";

import { useSearchParams } from "next/navigation";
import { projects } from "@/content/projects";
import { IslandHome } from "./IslandHome";

/** Reads ?focus=<slug>, set by a case study's "Back to the island", and reopens that project's card. */
export function IslandHomeWithFocus() {
  const slug = useSearchParams().get("focus");
  const focus = projects.find((p) => p.slug === slug)?.id ?? null;
  return <IslandHome key={focus ?? "none"} initialFocus={focus} />;
}
