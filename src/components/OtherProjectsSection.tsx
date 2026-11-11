import type { CSSProperties } from "react";
import { otherProjects, otherProjectsHeading } from "@/content/personal";
import panel from "./AboutSection.module.css";
import s from "./OtherProjectsSection.module.css";

/**
 * Jin's smaller projects, the dive's last station: a fan of glass cards that rise and turn into place
 * as the panel arrives (driven by the station's `--arrive`). With nothing driving it (the calm version,
 * or before JavaScript runs) it's a plain grid in its final state.
 */
export function OtherProjectsSection() {
  return (
    <section id="projects" className={`${panel.panel} ${s.section}`} aria-label="Other projects">
      <h2 className={panel.title}>{otherProjectsHeading}</h2>
      <div className={s.cards}>
        {otherProjects.map((p, i) => (
          <article key={p.id} className={s.card} style={{ "--i": i, "--n": otherProjects.length } as CSSProperties}>
            <span className={s.tag} data-testid="tag">
              {p.tag}
            </span>
            <h3 className={s.name}>
              {p.liveUrl ? (
                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                  {p.name}
                </a>
              ) : (
                p.name
              )}
            </h3>
            <p className={s.blurb} data-testid="blurb">
              {p.blurb}
            </p>
            <ul className={s.stack} aria-label="Stack">
              {p.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
