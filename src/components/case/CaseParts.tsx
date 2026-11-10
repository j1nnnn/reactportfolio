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

function ProjectLink({ label, to }: { label: string; to: Project }) {
  return (
    <nav className={s.next} aria-label={label}>
      <span>{label}</span>
      <Link href={`/work/${to.slug}`} className={s.nextLink} style={{ color: to.theme.accent }}>
        {to.name}
      </Link>
    </nav>
  );
}

/** The ways on: the next and previous featured projects, wrapping round at either end. */
export function NextProject({ project }: { project: Project }) {
  const i = projects.findIndex((p) => p.id === project.id);
  const next = projects[(i + 1) % projects.length];
  const previous = projects[(i - 1 + projects.length) % projects.length];
  return (
    <div className={s.ways}>
      <ProjectLink label="Next project" to={next} />
      <ProjectLink label="Previous project" to={previous} />
    </div>
  );
}
