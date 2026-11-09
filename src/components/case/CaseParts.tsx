"use client";

import Link from "next/link";
import { useId } from "react";
import { projects, type Project } from "@/content/projects";
import s from "./case.module.css";

/** Top bar shared by every case study. */
export function CaseHeader({ project }: { project: Project }) {
  return (
    <header className={s.header}>
      <Link href={`/?focus=${project.slug}`} className={s.back}>
        ← Back to the island
      </Link>
      <span className={s.headerName}>{project.name}</span>
    </header>
  );
}

/** A titled block that screen readers can jump to by its title. */
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  const id = useId();
  return (
    <section className={s.block} aria-labelledby={id}>
      <h2 id={id} className={s.blockTitle}>
        {title}
      </h2>
      {children}
    </section>
  );
}

/** The facts: numbers, what was built, stack. Content-driven, so every theme shares it. */
export function CaseFacts({ project, builtTitle = "What I built" }: { project: Project; builtTitle?: string }) {
  return (
    <div className={s.facts}>
      {project.numbers.length > 0 && (
        <Block title="By the numbers">
          <dl className={s.numbers}>
            {project.numbers.map((n) => (
              <div key={n.label} className={s.number}>
                <dt>{n.label}</dt>
                <dd>{n.value}</dd>
              </div>
            ))}
          </dl>
        </Block>
      )}
      <Block title={builtTitle}>
        <ul className={s.built}>
          {project.built.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </Block>
      {project.stack.length > 0 && (
        <Block title="Stack">
          <ul className={s.tags}>
            {project.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Block>
      )}
      {project.privateRepo && (
        <p className={s.private}>Private repository. I&apos;m happy to walk through the code in an interview.</p>
      )}
      {project.link && (
        <a className={s.external} href={project.link.href} target="_blank" rel="noopener noreferrer">
          {project.link.label}
        </a>
      )}
    </div>
  );
}

/** The way on: the next featured project, wrapping round after the last. */
export function NextProject({ project }: { project: Project }) {
  const i = projects.findIndex((p) => p.id === project.id);
  const next = projects[(i + 1) % projects.length];
  return (
    <nav className={s.next} aria-label="Next project">
      <span>Next project</span>
      <Link href={`/work/${next.slug}`} className={s.nextLink} style={{ color: next.theme.accent }}>
        {next.name}
      </Link>
    </nav>
  );
}
