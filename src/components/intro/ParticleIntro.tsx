"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import s from "./ParticleIntro.module.css";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

const FADE = 0.7;
// The particles assemble and hold for about 2.2s, then burst. If WebGL never starts, the
// overlay still ends here, so no visitor is left looking at an empty screen.
const SAFETY_MS = 4500;

/**
 * The title page that opens a case study (GLOSSARY: Particle intro). The particles are decoration;
 * this overlay owns how the visitor gets past it.
 */
export function ParticleIntro({ word, bg, color, onDone }: { word: string; bg: string; color: string; onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const done = useRef(onDone);
  done.current = onDone;

  // Once the particles burst, fade the overlay out, then hand over to the page.
  useEffect(() => {
    if (!leaving) return;
    const id = setTimeout(() => done.current(), FADE * 1000);
    return () => clearTimeout(id);
  }, [leaving]);

  useEffect(() => {
    const safety = setTimeout(() => done.current(), SAFETY_MS);
    const skip = (e: KeyboardEvent) => e.key === "Escape" && done.current();
    window.addEventListener("keydown", skip);
    return () => {
      clearTimeout(safety);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  return (
    <div
      className={leaving ? s.overlayLeaving : s.overlay}
      style={{ "--intro-bg": bg, "--intro-ink": color, "--intro-fade": `${FADE}s` } as React.CSSProperties}
    >
      <div className={s.field} aria-hidden="true">
        <ParticleField word={word} color={color} onBurst={() => setLeaving(true)} />
      </div>
      <button type="button" className={s.skip} onClick={() => done.current()}>
        Skip intro
      </button>
    </div>
  );
}
