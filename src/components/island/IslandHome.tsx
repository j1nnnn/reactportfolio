"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ContactActions } from "@/components/ContactActions";
import { projects, type ProjectId } from "@/content/projects";
import { site } from "@/content/site";
import { useReducedMotion } from "@/lib/useReducedMotion";
import s from "./IslandHome.module.css";

const IslandScene = dynamic(() => import("./IslandScene"), { ssr: false });

/** The home page hero: the island (ADR 0002) with Jin's intro over it. */
export function IslandHome({ initialFocus = null }: { initialFocus?: ProjectId | null }) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<ProjectId | null>(null);
  const [selected, setSelected] = useState<ProjectId | null>(initialFocus);
  const card = projects.find((p) => p.id === selected);
  const cardTitle = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const open = (id: ProjectId) => {
    opener.current = document.activeElement as HTMLElement | null;
    setSelected(id);
  };
  const close = () => {
    setSelected(null);
    opener.current?.focus();
  };

  // Move focus into the card when it opens, so keyboard and screen-reader visitors land on it.
  useEffect(() => {
    if (selected) cardTitle.current?.focus();
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <section className={s.section}>
      <div className={s.scene} aria-hidden="true">
        <IslandScene animate={!reduced} hovered={hovered} selected={selected} onHover={setHovered} onSelect={open} />
      </div>
      <div className={s.intro}>
        <p className={s.name}>{site.name}</p>
        <h1 className={s.identity}>{site.identity}</h1>
        <p className={s.subline}>{site.subline}</p>
        <ContactActions />
      </div>

      {card && (
        <section className={s.card} aria-labelledby="project-card-title">
          <p className={s.cardStatus}>{card.status}</p>
          <h2 id="project-card-title" className={s.cardTitle} tabIndex={-1} ref={cardTitle}>
            {card.name}
          </h2>
          <p className={s.cardBlurb}>{card.blurb}</p>
          <div className={s.cardActions}>
            <Link href={`/work/${card.slug}`} className={s.cardPrimary}>
              Read the case study
            </Link>
            <button type="button" className={s.cardBack} onClick={close}>
              Back to the island
            </button>
          </div>
        </section>
      )}

      <nav className={s.chips} aria-label="Featured work">
        <p className={s.hint}>Tap a building, or pick a project</p>
        {projects.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={selected === p.id}
            className={selected === p.id ? s.chipOn : s.chip}
            onClick={() => open(p.id)}
          >
            {p.name}
          </button>
        ))}
      </nav>
    </section>
  );
}
