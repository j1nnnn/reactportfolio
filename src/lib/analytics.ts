// The site's only analytics boundary. The cookieless provider (Umami or GoatCounter, per the spec)
// is wired in its own slice; until then track() records nothing and never throws.
export type SiteEvent = "email" | "resume" | "book_call" | "copy_email";

export function track(event: SiteEvent): void {
  void event;
}
