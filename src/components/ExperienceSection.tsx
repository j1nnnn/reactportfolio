import Link from "next/link";
import type { ComponentProps } from "react";
import { experience } from "@/content/personal";
import s from "./ExperienceSection.module.css";

/**
 * Where Jin has worked, newest first: an ordered timeline in the static export. In the dive each
 * entry is its own station, so the dive passes each entry's props (its place on the stage).
 */
export function ExperienceSection({
  className,
  entryProps,
}: {
  className?: string;
  entryProps?: (index: number) => ComponentProps<"li">;
}) {
  return (
    <section id="experience" className={`${s.section} ${className ?? ""}`} aria-label="Experience">
      <h2 className={s.heading}>Experience</h2>
      <ol className={s.timeline} aria-label="Timeline">
        {experience.map((role, i) => (
          <li key={role.id} {...entryProps?.(i)}>
            <article className={s.panel} aria-label={`${role.org}, ${role.title}`}>
              <p className={s.dates}>{role.dates}</p>
              <h3 className={s.org}>{role.org}</h3>
              <p className={s.title}>{role.title}</p>
              <p className={s.scope}>{role.scope}</p>
              <ul className={s.points}>
                {role.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              {role.link && (
                <Link href={role.link.href} className={s.link}>
                  {role.link.label}
                </Link>
              )}
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
