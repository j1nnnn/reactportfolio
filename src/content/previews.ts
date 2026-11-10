// Link-preview images (og:image, Twitter large card): one 1200×630 PNG per page, rendered at build
// time by src/app/og/[image]/route.tsx. Each shows only a project name and/or Jin's name.

import type { Metadata } from "next";
import { projects } from "./projects";
import { BASE_PATH, site } from "./site";

/** Unfurlers need absolute image URLs. */
export const SITE_ORIGIN = "https://j1nnnn.github.io";

export const PREVIEW_SIZE = { width: 1200, height: 630 };

export type Preview = { file: string; title: string; byline: boolean; bg: string; ink: string; accent: string };

export const previews: Preview[] = [
  // The island home's sky and ink.
  { file: "home.png", title: site.name, byline: false, bg: "#cfe3f3", ink: "#1d2a35", accent: "#3d5afe" },
  ...projects.map((p) => ({ file: `${p.slug}.png`, title: p.name, byline: true, ...p.theme })),
];

/** The page's og:image and Twitter large card, pointing at its preview image. */
export function previewMetadata(file: string, alt: string) {
  const image = { url: `${SITE_ORIGIN}${BASE_PATH}/og/${file}`, ...PREVIEW_SIZE, alt };
  const twitter: Metadata["twitter"] = { card: "summary_large_image", images: [image] };
  return { image, twitter };
}
