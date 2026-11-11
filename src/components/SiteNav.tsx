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

/** Whether the page is scrolled to its bottom, where the short Contact section can't reach mid-screen. */
function useAtBottom(on: boolean) {
  const [atBottom, setAtBottom] = useState(false);
  useEffect(() => {
    if (!on) return;
    const check = () => {
      const end = document.documentElement.scrollHeight - window.innerHeight; // 0 when nothing scrolls
      setAtBottom(end > 0 && window.scrollY >= end - 2);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [on]);
  return atBottom;
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
  const atBottom = useAtBottom(home);
  // The dive's panels share one pinned stage, so while it's on screen its station says which is in view.
  // At the very bottom it's Contact, which is too short to reach the middle of the screen.
  const current = !home
    ? undefined
    : atBottom
      ? "contact"
      : (diveInView && station) || SECTIONS.find(({ id }) => seen.has(id))?.id;
  // Pale glass over the island's sky, dark glass once the visitor has scrolled past it: over the dive
  // even between stations, when no section is in view.
  const pastIsland = diveInView || (current !== undefined && current !== "work");
  const tone = !home ? "theme" : pastIsland ? "dark" : "sky";

  const choose = (id: SectionId) => {
    setOpen(false);
  };

  /**
   * On the home page the bar lands a section itself rather than leaving it to the browser's anchor jump,
   * which scrolls to wherever a dive panel happens to sit and fights the dive's own landing. The dive
   * lands its stations on the hashchange; Work and Contact are ordinary sections.
   */
  const land = (e: React.MouseEvent, id: SectionId) => {
    choose(id);
    e.preventDefault();
    if (window.location.hash !== `#${id}`) window.history.pushState(null, "", `#${id}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    if (id === "work" || id === "contact") document.getElementById(id)?.scrollIntoView?.();
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
              <a href={`#${id}`} className={s.link} aria-current={id === current ? "location" : undefined} onClick={(e) => land(e, id)}>
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
