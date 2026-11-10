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

// GitHub Pages can't send headers, so the CSP ships as a meta tag (ADR 0001). Inline scripts and
// styles stay allowed: the static export inlines its RSC bootstrap (self.__next_f.push) with no
// per-request nonce, and the WebGL canvas sets inline styles. Fonts are self-hosted by next/font.
// A meta tag can't carry frame-ancestors, so framing is NOT blocked; that needs a real header.
// `next dev` evaluates modules with eval(), so only development allows it.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export const metadata: Metadata = {
  title: site.name,
  description,
  openGraph: { title: site.name, description, type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plex.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={csp} />
      </head>
      <body>{children}</body>
    </html>
  );
}
