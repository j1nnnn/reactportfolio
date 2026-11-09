"use client";

import { useState } from "react";
import { contact } from "@/content/site";
import { track } from "@/lib/analytics";
import s from "./ContactActions.module.css";

/** The three contact actions, used everywhere the site offers a way to reach Jin. */
export function ContactActions() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    track("copy_email");
    await navigator.clipboard.writeText(contact.email);
    setCopied(true);
  };

  return (
    <div className={s.actions}>
      <a className={s.primary} href={`mailto:${contact.email}`} onClick={() => track("email")}>
        Email
      </a>
      <a className={s.secondary} href={contact.resumePath} download onClick={() => track("resume")}>
        Download résumé
      </a>
      <a
        className={s.secondary}
        href={contact.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("book_call")}
      >
        Book a call
      </a>
      <button type="button" className={s.copy} onClick={copyEmail}>
        Copy email address
      </button>
      <span role="status" className={s.status}>
        {copied ? "Email address copied" : ""}
      </span>
    </div>
  );
}
