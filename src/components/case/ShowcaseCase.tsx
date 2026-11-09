"use client";

import dynamic from "next/dynamic";
import type { Project } from "@/content/projects";
import { CaseFacts, CaseHeader, NextProject } from "./CaseParts";
import c from "./case.module.css";
import s from "./ShowcaseCase.module.css";

const BuildingShowcase = dynamic(() => import("./three/BuildingShowcase"), { ssr: false });
const LiquidMetal = dynamic(() => import("./three/LiquidMetal"), { ssr: false });

/**
 * JEPA, TurfGame, the Claude API agent and the patent (ADR 0002). Each opens on its own building
 * from the island, enlarged and turning, in that project's colours. The patent sits on a
 * liquid-metal shader, a Rune-inspired effect.
 */
export function ShowcaseCase({ project, reduced }: { project: Project; reduced: boolean }) {
  return (
    <>
      <CaseHeader project={project} />
      <main>
        <section className={s.hero}>
          {project.id === "patent" && (
            <div className={s.shader} aria-hidden="true">
              <LiquidMetal reduced={reduced} />
            </div>
          )}
          <div className={s.copy}>
            <p className={c.kicker}>{project.status}</p>
            <h1 className={c.title} style={project.name.length > 16 ? { fontSize: "clamp(36px, 4.6vw, 68px)" } : undefined}>
              {project.name}
            </h1>
            <p className={c.lede}>{project.blurb}</p>
          </div>
          <div className={s.model} aria-hidden="true">
            <BuildingShowcase id={project.id} reduced={reduced} ground={project.theme.panel} />
          </div>
        </section>
        {project.id === "agent" && <AgentLoop />}
        {/* A co-invented patent: name Jin's share, never the whole invention. */}
        <CaseFacts project={project} builtTitle={project.id === "patent" ? "My part" : "What I built"} />
        <NextProject project={project} />
      </main>
    </>
  );
}

/** The loop cv.md describes: generate, validate, self-heal; measured by an evaluation framework and
 * shipped through confidence-gated rollouts. */
function AgentLoop() {
  return (
    <section className={s.loop} aria-label="How the agent works">
      <svg viewBox="0 0 640 360" className={s.loopSvg} role="img" aria-labelledby="agent-loop-title">
        <title id="agent-loop-title">
          The agent generates a test, validates it and self-heals it when it breaks; an evaluation framework measures it,
          and a confidence gate decides what ships.
        </title>
        <circle cx="200" cy="180" r="120" className={s.ring} />
        <circle cx="200" cy="180" r="120" className={s.ringRun} />
        {[
          { x: 200, y: 60, t: "Generate" },
          { x: 304, y: 240, t: "Validate" },
          { x: 96, y: 240, t: "Self-heal" },
        ].map((n) => (
          <g key={n.t}>
            <circle cx={n.x} cy={n.y} r="34" className={s.node} />
            <text x={n.x} y={n.y + 5} textAnchor="middle" className={s.nodeText}>
              {n.t}
            </text>
          </g>
        ))}
        <text x="200" y="176" textAnchor="middle" className={s.centerText}>
          Evaluation
        </text>
        <text x="200" y="196" textAnchor="middle" className={s.centerText}>
          framework
        </text>
        <path d="M 330 180 L 450 180" className={s.arrow} />
        <rect x="455" y="146" width="150" height="68" rx="14" className={s.gate} />
        <text x="530" y="176" textAnchor="middle" className={s.gateText}>
          Confidence
        </text>
        <text x="530" y="196" textAnchor="middle" className={s.gateText}>
          gated rollout
        </text>
      </svg>
    </section>
  );
}
