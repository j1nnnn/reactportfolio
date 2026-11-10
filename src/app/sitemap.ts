import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { SITE_URL } from "@/content/site";

// Static export needs metadata routes marked static to prerender them to out/sitemap.xml.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL }, ...projects.map((p) => ({ url: `${SITE_URL}work/${p.slug}` }))];
}
