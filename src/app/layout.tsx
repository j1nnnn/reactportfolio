import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo" });
const plex = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex" });
// Software Factory theme (direction C): serif title, mono console.
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-instrument" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

const description = `${site.identity}. ${site.subline}.`;

export const metadata: Metadata = {
  title: site.name,
  description,
  openGraph: { title: site.name, description, type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plex.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
