"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useDiveInView, useDiveSection } from "@/components/dive/diveInView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import s from "./SiteNav.module.css";

/** The home page's sections, top to bottom, as the bar names them. */
const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

/** The sections whose box crosses a line just above the middle of the screen. */
function useSectionsInView(on: boolean): Set<SectionId> {
  const reduced = useReducedMotion(); // the calm version swaps the dive for a stack: watch the new boxes
  const [seen, setSeen] = useState<Set<SectionId>>(new Set());
  useEffect(() => {
    if (!on) return;
    const io = new IntersectionObserver(
      (entries) =>
        setSeen((prev) => {
          const next = new Set(prev);
          for (const e of entries) {
            const id = e.target.id as SectionId;
            if (e.isIntersecting) next.add(id);
            else next.delete(id);
          }
          return next;
        }),
      { rootMargin: "-45% 0px -55% 0px" },
    );
    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => {
      io.disconnect();
      setSeen(new Set());
    };
  }, [on, reduced]);
  return seen;
}

/**
 * The site-wide bar: a frosted pill at the top centre of every page, linking to the home page's
 * sections. On the home page it marks the section in view; on a phone it folds into a Menu button.
 */
export function SiteNav({ home = false }: { home?: boolean }) {
  const listId = useId();
  const menu = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const seen = useSectionsInView(home);
  const diveInView = useDiveInView();
  const station = useDiveSection();
  // The dive's panels share one pinned stage, so while it's on screen its station says which is in view.
  const current = home ? ((diveInView && station) || SECTIONS.find(({ id }) => seen.has(id))?.id) : undefined;
  // Pale glass over the island's sky, dark glass once the visitor has scrolled past it.
  const tone = !home ? "theme" : !current || current === "work" ? "sky" : "dark";

  const choose = (id: SectionId) => {
    setOpen(false);
    // Choosing the section already in the address bar fires no hashchange: tell the dive to land it again.
    if (home && window.location.hash === `#${id}`) window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <nav
      className={s.bar}
      data-tone={tone}
      aria-label="Site"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          menu.current?.focus();
        }
      }}
    >
      <button
        ref={menu}
        type="button"
        className={s.menu}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
      >
        Menu
      </button>
      <ul id={listId} className={s.links} data-open={open ? "" : undefined}>
        {SECTIONS.map(({ id, label }) => (
          <li key={id}>
            {home ? (
              <a href={`#${id}`} className={s.link} aria-current={id === current ? "location" : undefined} onClick={() => choose(id)}>
                {label}
              </a>
            ) : (
              <Link href={`/#${id}`} className={s.link} onClick={() => choose(id)}>
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
