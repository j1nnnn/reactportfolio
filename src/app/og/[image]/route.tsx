import { ImageResponse } from "next/og";
import { PREVIEW_SIZE, previews } from "@/content/previews";
import { site } from "@/content/site";

// Rendered once at `next build` into out/og/<file>.png; GitHub Pages serves them as plain files.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return previews.map((p) => ({ image: p.file }));
}

// The site's display font (Archivo ExtraBold), subset to the letters the images use. Satori needs
// TTF/OTF, which Google Fonts serves to a client that doesn't ask for woff2.
const letters = [...new Set(previews.flatMap((p) => [p.title, site.name]).join(""))].join("");
const archivo = await loadGoogleFont("Archivo", 800, letters);

async function loadGoogleFont(family: string, weight: number, text: string) {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`)
  ).text();
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error(`preview images: could not load the ${family} font`);
  return (await fetch(url)).arrayBuffer();
}

export async function GET(_req: Request, { params }: { params: Promise<{ image: string }> }) {
  const { image } = await params;
  const p = previews.find((x) => x.file === image);
  if (!p) return new Response("Not found", { status: 404 });
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: p.bg,
          color: p.ink,
          fontFamily: "Archivo",
          borderBottom: `24px solid ${p.accent}`,
        }}
      >
        <div style={{ fontSize: p.title.length > 16 ? 88 : 120, lineHeight: 1.05, letterSpacing: -2 }}>{p.title}</div>
        {p.byline && <div style={{ fontSize: 40, marginTop: 36, color: p.accent }}>{site.name}</div>}
      </div>
    ),
    { ...PREVIEW_SIZE, fonts: [{ name: "Archivo", data: archivo, weight: 800, style: "normal" }] },
  );
}
