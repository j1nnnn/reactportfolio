"use client";

import { useState } from "react";
import { contact } from "@/content/site";
import { track } from "@/lib/analytics";
import s from "./ContactActions.module.css";

/** The contact actions, used everywhere the site offers a way to reach Jin. "Book a call" shows only once a
 * booking link is set. */
export function ContactActions() {
  const [copyResult, setCopyResult] = useState<"copied" | "failed" | null>(null);

  const copyEmail = async () => {
    track("copy_email");
    try {
      // Throws when the clipboard API is missing (insecure context, old browser); rejects when the write is refused.
      await navigator.clipboard.writeText(contact.email);
      setCopyResult("copied");
    } catch {
      setCopyResult("failed");
    }
  };

  return (
    <div className={s.actions}>
      <a className={s.primary} href={`mailto:${contact.email}`} onClick={() => track("email")}>
        Email
      </a>
      <a className={s.secondary} href={contact.resumePath} download="Jinwoo_Lim_Resume.pdf" onClick={() => track("resume")}>
        Download résumé
      </a>
      {contact.bookingUrl && (
        <a
          className={s.secondary}
          href={contact.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("book_call")}
        >
          Book a call
        </a>
      )}
      <button type="button" className={s.copy} onClick={copyEmail}>
        Copy email address
      </button>
      <span role="status" className={s.status}>
        {copyResult === "copied" && "Email address copied"}
        {copyResult === "failed" && `Couldn't copy. The address is ${contact.email}`}
      </span>
    </div>
  );
}
