"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AboutSection } from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { OtherProjectsSection } from "@/components/OtherProjectsSection";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { FLY_IN, FLY_OUT, stationArrival, stationAt, stations, type Station, type StationId } from "./stations";
import { setDiveInView } from "./diveInView";
import s from "./Dive.module.css";

const DiveWorld = dynamic(() => import("./DiveWorld"), { ssr: false });

/** A station's place on the stage, by where its panel holds. */
const PLACE = { left: s.stationLeft, right: s.stationRight, centre: s.stationCentre };

/** The role stations, newest first: the year rail lists their dates. */
const roles = stations.filter((st) => st.gate);

/** How far the visitor has scrolled through the dive, from 0 at its top to 1 at its end. */
function diveProgress(el: HTMLElement): number {
  const r = el.getBoundingClientRect();
  const run = r.height - window.innerHeight;
  return run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
}

const ease = (t: number) => 1 - (1 - t) ** 3;

/**
 * A station's panel at progress p: flies in from depth, holds, flies past toward the viewer. A panel
 * taller than the screen (About on a phone) slides up through the screen while it holds, top first,
 * so the visitor reads it by scrolling the page: it never scrolls on its own, which would trap them.
 */
function placePanel(el: HTMLElement, station: Station, last: boolean, p: number) {
  const [from, to] = station.range;
  const t = (p - from) / (to - from);
  const tilt = { left: 1, right: -1, centre: 0 }[station.side];
  const panel = el.firstElementChild as HTMLElement | null;
  const overflow = Math.max(0, (panel?.offsetHeight ?? 0) - (window.innerHeight - 48));
  const held = Math.min(1, Math.max(0, (t - FLY_IN) / (FLY_OUT - FLY_IN)));
  const slide = overflow / 2 - overflow * held; // px; centred on a flex line, so ±overflow/2 shows top/bottom
  let depth = 0; // px; negative is away from the viewer
  let fade = 1;
  let turn = 0; // 0 when facing the viewer, 1 at full tilt
  if (t < FLY_IN) {
    const k = ease(Math.max(0, t / FLY_IN));
    depth = -900 * (1 - k);
    fade = k;
    turn = 1 - k;
  } else if (t > FLY_OUT && !last) {
    const k = Math.min(1, (t - FLY_OUT) / (1 - FLY_OUT));
    depth = 500 * k * k;
    fade = 1 - k;
    turn = -k * 0.5;
  }
  // Faded and moved, never hidden: screen readers can still read every station. Opacity is cleared
  // when held, because opacity below 1 would stop the panel's frosted glass from blurring the world.
  el.style.opacity = fade < 0.999 ? String(fade) : "";
  // Its own perspective, so a role's panel inside the Experience section's markup moves as About's does.
  el.style.transform = `perspective(1200px) translate3d(0, ${slide}px, ${depth}px) rotateY(${tilt * 14 * turn}deg)`;
  el.style.filter = fade < 0.99 ? `blur(${(1 - fade) * 6}px)` : "";
  el.style.pointerEvents = fade > 0.5 ? "" : "none";
  // How far the panel has arrived, 0 to 1, for anything inside that arrives with it (the projects' fan).
  el.style.setProperty("--arrive", String(Math.min(1, Math.max(0, t / FLY_IN))));
}

/**
 * The home page's continuation below the island (spec #13, "The dive"): a tall scroll region holding a pinned
 * 3D world that the camera flies through, one station per personal section. The calm version
 * stacks the sections as plain glass panels.
 */
export function Dive() {
  const reduced = useReducedMotion();
  const region = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLElement | null)[]>([]);
  const progress = useRef(0);
  // The role station in view, if any: the year rail shows while there is one.
  const [role, setRole] = useState<StationId>();

  // The island pauses while the dive covers the top of the screen.
  useEffect(() => {
    const el = region.current;
    if (reduced || !el) return;
    const io = new IntersectionObserver(([entry]) => setDiveInView(entry.isIntersecting), {
      rootMargin: "0px 0px -99% 0px",
    });
    io.observe(el);
    return () => {
      io.disconnect();
      setDiveInView(false);
    };
  }, [reduced]);

  // One progress value drives the camera (through the ref) and the panels.
  useEffect(() => {
    const el = region.current;
    if (reduced || !el) return;
    const onScroll = () => {
      const p = diveProgress(el);
      progress.current = p;
      const here = stationAt(p);
      setRole(here?.gate ? here.id : undefined);
      stations.forEach((st, i) => {
        const panel = panels.current[i];
        if (panel) placePanel(panel, st, i === stations.length - 1, p);
      });
    };
    el.dataset.live = ""; // JavaScript is placing the panels: the no-JS inner scroll is off
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  // A section's anchor (#about, #experience) lands where its station's panel has arrived (top in view),
  // not at the pinned stage.
  useEffect(() => {
    if (reduced) return;
    const onHash = () => {
      const st = stations.find((x) => x.anchor && `#${x.anchor}` === window.location.hash);
      if (st) scrollToStation(st);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [reduced]);

  const scrollToStation = (st: Station) => {
    const el = region.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const run = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + run * stationArrival(st), behavior: "instant" });
  };

  // Tabbing into a station brings it to the front.
  const onFocus = (st: Station) => {
    const [from, to] = st.range;
    const t = (progress.current - from) / (to - from);
    if (t < FLY_IN || t > FLY_OUT) scrollToStation(st);
  };

  if (reduced) {
    return (
      <div className={s.stack}>
        <AboutSection />
        <ExperienceSection />
        <OtherProjectsSection />
      </div>
    );
  }

  /** A station's place on the stage: the element its panel sits in, which placePanel moves. */
  const place = (id: StationId) => {
    const i = stations.findIndex((st) => st.id === id);
    const st = stations[i];
    return {
      ref: (el: HTMLElement | null) => {
        panels.current[i] = el;
      },
      className: PLACE[st.side],
      onFocus: () => onFocus(st),
    };
  };

  return (
    <div ref={region} className={s.dive} style={{ "--stations": stations.length } as CSSProperties}>
      <div className={s.stage}>
        <div className={s.world} aria-hidden="true">
          <DiveWorld progress={progress} />
        </div>
        <div {...place("about")}>
          <AboutSection />
        </div>
        <ExperienceSection className={s.experience} entryProps={(i) => place(roles[i].id)} />
        <div {...place("projects")}>
          <OtherProjectsSection />
        </div>
        {/* The year rail: while a role is in view, all four roles' dates, the current one marked. */}
        <ol className={s.rail} aria-label="Years" aria-hidden={role ? undefined : true} data-on={role ? "" : undefined}>
          {roles.map((st) => (
            <li key={st.id} aria-current={st.id === role ? "step" : undefined}>
              {st.gate}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
