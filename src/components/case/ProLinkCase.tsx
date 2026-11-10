"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ContactSection } from "@/components/ContactSection";
import type { Project } from "@/content/projects";
import { CaseFacts, CaseHeader, NextProject } from "./CaseParts";
import { PHASES } from "./three/swingPoses";
import c from "./case.module.css";
import s from "./ProLinkCase.module.css";

const SwingFigure = dynamic(() => import("./three/SwingFigure"), { ssr: false });

// One chapter per swing phase. Wording from cv.md; don't add a claim that isn't there.
const CHAPTERS = [
  { title: "It sees the swing", body: "Google MediaPipe extracts 33 body landmarks per frame, in a WASM Web Worker." },
  { title: "It finds the faults", body: "9 biomechanical fault detectors with confidence-weighted scoring." },
  {
    title: "It compares you to the pros",
    body: "A DTW-based Ghost Comparator aligns a student's skeleton against a pro golfer's and scores phase-weighted error across 7 swing phases and 8 body groups.",
  },
  {
    title: "It coaches in two languages",
    body: "A coaching layer on Claude Haiku 4.5: versioned English and Korean prompts, prompt caching, a circuit breaker, tag-wrapped inputs against prompt injection, and a check that flags any number not in the measurements.",
  },
];

/** How far the visitor has scrolled through the track, from 0 at its top to 1 at its end. */
function trackProgress(el: HTMLElement): number {
  const r = el.getBoundingClientRect();
  return Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
}

/** Pro-Link AI (ADR 0002): direction A's scroll-driven swing is the spine of the page. */
export function ProLinkCase({ project, reduced }: { project: Project; reduced: boolean }) {
  const track = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      if (!track.current) return;
      const p = trackProgress(track.current);
      progress.current = p;
      setPhase(Math.round(p * (PHASES.length - 1)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  return (
    <>
      <CaseHeader project={project} />
      <main>
        <section ref={track} className={reduced ? s.trackStatic : s.track} aria-label={`How ${project.name} works`}>
          <div className={s.stage}>
            <div className={s.figure} aria-hidden="true">
              <SwingFigure progress={progress} reduced={reduced} />
            </div>
            <div className={s.copy}>
              <p className={c.kicker}>{project.status}</p>
              <h1 className={c.title}>{project.name}</h1>
              <p className={c.lede}>{project.blurb}</p>
              {reduced ? (
                <ol className={s.chaptersStatic}>
                  {CHAPTERS.map((ch) => (
                    <li key={ch.title}>
                      <h2>{ch.title}</h2>
                      <p>{ch.body}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <>
                  <div className={s.chapter} key={phase}>
                    <p className={s.phase}>
                      {PHASES[phase]} · {phase + 1} of {PHASES.length}
                    </p>
                    <h2>{CHAPTERS[phase].title}</h2>
                    <p>{CHAPTERS[phase].body}</p>
                  </div>
                  <div className={s.ticks} aria-hidden="true">
                    {PHASES.map((p, i) => (
                      <span key={p} className={i <= phase ? s.tickOn : s.tick} />
                    ))}
                    <span className={s.hint}>Scroll to swing</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
        <CaseFacts project={project} builtTitle="How it ships" />
        <ContactSection />
        <NextProject project={project} />
      </main>
    </>
  );
}
