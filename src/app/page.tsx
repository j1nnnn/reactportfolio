import { Suspense } from "react";
import { ContactSection } from "@/components/ContactSection";
import { Dive } from "@/components/dive/Dive";
import { IslandHome } from "@/components/island/IslandHome";
import { IslandHomeWithFocus } from "@/components/island/IslandHomeWithFocus";
import { SiteNav } from "@/components/SiteNav";
import { SITE_URL, site } from "@/content/site";

// Only what the site already shows: no phone, no address, no profile the site doesn't link to.
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  description: site.identity,
  url: SITE_URL,
};

export default function Home() {
  // The fallback is what the static export prerenders: the full page with no card open.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }}
      />
      <SiteNav home />
      <Suspense fallback={<IslandHome />}>
        <IslandHomeWithFocus />
      </Suspense>
      <Dive />
      <ContactSection anchor="contact" />
    </>
  );
}
