import { useId } from "react";
import { PHOTO_PLACEHOLDER, about } from "@/content/personal";
import s from "./AboutSection.module.css";

/** Who Jin is, the dive's first station: plain HTML in the static export, readable before JavaScript runs. */
export function AboutSection() {
  const beyondId = useId();
  return (
    <section id="about" className={s.panel} aria-label="About">
      <h2 className={s.title}>{about.heading}</h2>
      <div className={s.lead}>
        <div className={s.photo}>
          {/* Abstract silhouette until Jin supplies his photo. */}
          <svg viewBox="0 0 100 100" aria-hidden="true" className={s.silhouette}>
            <circle cx="50" cy="38" r="18" />
            <path d="M16 96c0-20 15-34 34-34s34 14 34 34z" />
          </svg>
          <span className={s.photoNote}>{PHOTO_PLACEHOLDER}</span>
        </div>
        <div>
          <p className={s.intro}>{about.personalLine}</p>
          {about.intro.map((paragraph) => (
            <p key={paragraph} className={s.intro}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <ul className={s.numbers} aria-label="Headline numbers">
        {about.numbers.map((n) => (
          <li key={n.label} className={s.number}>
            <span className={s.value}>{n.value}</span>
            <span className={s.label}>{n.label}</span>
          </li>
        ))}
      </ul>
      <h3 id={beyondId} className={s.subtitle}>
        Beyond the code
      </h3>
      <ul className={s.beyond} aria-labelledby={beyondId}>
        {about.beyondTheCode.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
