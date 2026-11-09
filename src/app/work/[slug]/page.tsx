import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/case/CaseStudy";
import { bySlug, projects } from "@/content/projects";
import { site } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = bySlug((await params).slug);
  if (!p) return {};
  const title = `${p.name} | ${site.name}`;
  return { title, description: p.blurb, openGraph: { title, description: p.blurb, type: "article" } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!bySlug(slug)) notFound();
  return <CaseStudy slug={slug} />;
}
