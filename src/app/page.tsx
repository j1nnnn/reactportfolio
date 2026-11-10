import { Suspense } from "react";
import { ContactSection } from "@/components/ContactSection";
import { IslandHome } from "@/components/island/IslandHome";
import { IslandHomeWithFocus } from "@/components/island/IslandHomeWithFocus";

export default function Home() {
  // The fallback is what the static export prerenders: the full page with no card open.
  return (
    <>
      <Suspense fallback={<IslandHome />}>
        <IslandHomeWithFocus />
      </Suspense>
      <ContactSection />
    </>
  );
}
