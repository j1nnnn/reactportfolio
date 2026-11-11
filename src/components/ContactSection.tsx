import { useId } from "react";
import { ContactActions } from "./ContactActions";
import s from "./ContactSection.module.css";

/** The contact actions as a titled section, for the end of a page: below the island, after each case study. */
export function ContactSection({ anchor }: { anchor?: string }) {
  const id = useId();
  return (
    <section id={anchor} className={s.section} aria-labelledby={id}>
      <div className={s.inner}>
        <h2 id={id} className={s.title}>
          Contact
        </h2>
        <ContactActions />
      </div>
    </section>
  );
}
