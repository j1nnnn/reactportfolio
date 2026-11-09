"use client";

import { useState } from "react";
import { ParticleIntro } from "@/components/intro/ParticleIntro";
import { bySlug } from "@/content/projects";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { FactoryCase } from "./FactoryCase";
import { ProLinkCase } from "./ProLinkCase";
import { ShowcaseCase } from "./ShowcaseCase";
import s from "./case.module.css";

/** A case study (ADR 0002): one project, in its own theme, opened by its particle intro. */
export function CaseStudy({ slug }: { slug: string }) {
  const project = bySlug(slug)!;
  const t = project.theme;
  const reduced = useReducedMotion();
  const [introDone, setIntroDone] = useState(false);

  return (
    <div
      className={s.root}
      style={{ "--bg": t.bg, "--ink": t.ink, "--muted": t.muted, "--accent": t.accent, "--panel": t.panel } as React.CSSProperties}
    >
      {!reduced && !introDone && (
        <ParticleIntro key={slug} word={project.introWord} bg={t.bg} color={t.accent} onDone={() => setIntroDone(true)} />
      )}
      {project.id === "prolink" && <ProLinkCase project={project} reduced={reduced} />}
      {project.id === "factory" && <FactoryCase project={project} reduced={reduced} />}
      {project.id !== "prolink" && project.id !== "factory" && <ShowcaseCase project={project} reduced={reduced} />}
    </div>
  );
}

