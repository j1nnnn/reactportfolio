"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Project } from "@/content/projects";
import { CaseFacts, CaseHeader, NextProject } from "./CaseParts";
import c from "./case.module.css";
import s from "./FactoryCase.module.css";

const NetworkGraph = dynamic(() => import("./three/NetworkGraph"), { ssr: false });

// Each console line belongs to a pipeline stage. The lines restate cv.md's description of the
// factory; they are illustrative, not captured output, and the console's label says so.
const RUN: { stage: number; text: string }[] = [
  { stage: 0, text: "$ factory run --next" },
  { stage: 0, text: "› pulled the next ticket from Linear" },
  { stage: 1, text: "› triage: schema-constrained LLM judges" },
  { stage: 1, text: "› verdict: ready for an agent" },
  { stage: 2, text: "› isolated git worktree created" },
  { stage: 2, text: "› tool allowlist applied" },
  { stage: 2, text: "› turn and dollar budget caps set" },
  { stage: 3, text: "› headless Claude Code worker running" },
  { stage: 4, text: "› verify on a clean checkout: passed" },
  { stage: 5, text: "› secret scan (fail-closed): clean" },
  { stage: 6, text: "› draft PR opened for review" },
  { stage: 6, text: "› cost and latency logged to the SQLite ledger" },
];
const STAGES = ["Ticket", "Triage", "Sandbox", "Worker", "Verify", "Secret scan", "Draft PR"];
const LINE_MS = 650;
const PAUSE_LINES = 5; // how long the finished run stays up before the replay starts again

/** Software Factory (ADR 0002): direction C's control room. */
export function FactoryCase({ project, reduced }: { project: Project; reduced: boolean }) {
  const [shown, setShown] = useState(reduced ? RUN.length : 0);

  useEffect(() => {
    if (reduced) {
      setShown(RUN.length);
      return;
    }
    setShown(0);
    const id = setInterval(() => setShown((n) => (n >= RUN.length + PAUSE_LINES ? 0 : n + 1)), LINE_MS);
    return () => clearInterval(id);
  }, [reduced]);

  const visible = RUN.slice(0, Math.min(shown, RUN.length));
  const stage = visible.length ? visible[visible.length - 1].stage : -1;

  return (
    <>
      <CaseHeader project={project} />
      <div className={s.graph} aria-hidden="true">
        <NetworkGraph reduced={reduced} />
      </div>
      <main>
        <section className={s.hero}>
          <div className={s.intro}>
            <p className={c.kicker}>{project.status}</p>
            <h1 className={`${c.title} ${s.title}`}>{project.name}</h1>
            <p className={c.lede}>{project.blurb}</p>
          </div>
          <figure className={s.console} aria-label="Replay of one ticket's run through the factory (illustrative)">
            <div className={s.bar} aria-hidden="true">
              <span />
              <span />
              <span />
              <em>factory · ticket run</em>
            </div>
            <pre className={s.body}>
              {visible.map((l) => l.text).join("\n")}
              <span className={s.cursor} aria-hidden="true" />
            </pre>
          </figure>
          <ol className={s.rail} aria-label="Pipeline stages">
            {STAGES.map((name, i) => (
              <li
                key={name}
                aria-current={i === stage ? "step" : undefined}
                className={i < stage ? s.stageDone : i === stage ? s.stageOn : s.stage}
              >
                <span className={s.dot} aria-hidden="true" />
                {name}
              </li>
            ))}
          </ol>
        </section>
        <div className={s.factsWrap}>
          <CaseFacts project={project} />
          <NextProject project={project} />
        </div>
      </main>
    </>
  );
}
