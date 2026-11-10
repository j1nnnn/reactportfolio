import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { setReducedMotion } from "@/test/setup";
import Page from "./[slug]/page";

// Boundaries faked for Seam A: WebGL can't run in jsdom, so each 3D canvas is a stub.
vi.mock("next/navigation", () => ({ notFound: vi.fn() }));
vi.mock("@/components/case/three/SwingFigure", () => ({ default: () => <div data-testid="swing-figure" /> }));
vi.mock("@/components/case/three/NetworkGraph", () => ({ default: () => <div data-testid="network-graph" /> }));
vi.mock("@/components/case/three/BuildingShowcase", () => ({ default: () => <div data-testid="building-showcase" /> }));
vi.mock("@/components/case/three/LiquidMetal", () => ({ default: () => <div data-testid="liquid-metal" /> }));
vi.mock("@/components/intro/ParticleField", () => ({ default: () => <div data-testid="particle-field" /> }));

async function visit(slug: string) {
  render(await Page({ params: Promise.resolve({ slug }) }));
}

describe("case study page", () => {
  it("tells the visitor what the project is and what Jin built", async () => {
    await visit("software-factory");
    expect(screen.getByRole("heading", { level: 1, name: "Software Factory" })).toBeInTheDocument();
    expect(screen.getByText("Personal prototype: draft PRs opened, none merged yet")).toBeInTheDocument();

    const built = screen.getByRole("region", { name: "What I built" });
    expect(within(built).getByText("A clean-checkout verify step and a fail-closed secret scan before any draft PR is opened.")).toBeInTheDocument();

    const numbers = screen.getByRole("region", { name: "By the numbers" });
    expect(within(numbers).getByText("443")).toBeInTheDocument();
    expect(within(numbers).getByText("test functions")).toBeInTheDocument();

    expect(within(screen.getByRole("region", { name: "Stack" })).getByText("Linear GraphQL")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "← Back to the island" })).toHaveAttribute("href", "/?focus=software-factory");
  });

  it("says a private project's code is private, and offers no link to it", async () => {
    await visit("jepa");
    expect(screen.getByText("Private repository. I'm happy to walk through the code in an interview.")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /github/i })).not.toBeInTheDocument();
  });

  it("links the patent to its public record", async () => {
    await visit("patent");
    const record = screen.getByRole("link", { name: "Read the public patent record" });
    expect(record).toHaveAttribute("href", "https://patents.google.com/patent/US12470530B2/en");
    expect(record).toHaveAttribute("target", "_blank");
    expect(record).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.queryByText(/Private repository/)).not.toBeInTheDocument();
  });

  it("leads the visitor on to the next project, wrapping round after the last", async () => {
    await visit("patent");
    const next = screen.getByRole("navigation", { name: "Next project" });
    expect(within(next).getByRole("link", { name: "Pro-Link AI" })).toHaveAttribute("href", "/work/pro-link-ai");
  });
});

describe("particle intro", () => {
  it("opens a case study with the project's title intro, which the visitor can skip", async () => {
    const user = userEvent.setup();
    await visit("pro-link-ai");
    await user.click(screen.getByRole("button", { name: "Skip intro" }));
    expect(screen.queryByRole("button", { name: "Skip intro" })).not.toBeInTheDocument();
  });

  it("lets a keyboard visitor skip the intro with Escape", async () => {
    const user = userEvent.setup();
    await visit("pro-link-ai");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("button", { name: "Skip intro" })).not.toBeInTheDocument();
  });

  it("never traps the visitor: the intro ends on its own even if the particles never play", async () => {
    vi.useFakeTimers();
    try {
      await visit("pro-link-ai");
      expect(screen.getByRole("button", { name: "Skip intro" })).toBeInTheDocument();
      await act(() => vi.advanceTimersByTimeAsync(5000));
      expect(screen.queryByRole("button", { name: "Skip intro" })).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("goes straight to the page for a visitor who asks for reduced motion", async () => {
    setReducedMotion(true);
    await visit("pro-link-ai");
    expect(screen.queryByRole("button", { name: "Skip intro" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Pro-Link AI" })).toBeInTheDocument();
  });
});

describe("screenshot slots", () => {
  it.each([
    ["pro-link-ai", "The live swing view, with the pose overlay and fault markers"],
    ["software-factory", "A draft pull request opened by a worker, with its verify and secret-scan results"],
    ["jepa", "A time-blocked daily plan, as posted to Discord"],
    ["turfgame", "The Godot map, with the eight factions' territory"],
  ])("shows the visitor what screens are coming on %s", async (slug, caption) => {
    await visit(slug);
    const screens = screen.getByRole("region", { name: "Screens" });
    expect(within(screens).getByText(caption)).toBeInTheDocument();
    expect(within(screens).getAllByText("Screenshot coming soon").length).toBeGreaterThan(0);
  });

  it.each(["claude-api-agent", "patent"])("shows no slots on %s", async (slug) => {
    await visit(slug);
    expect(screen.queryByRole("region", { name: "Screens" })).not.toBeInTheDocument();
  });

  it("shows a shot's image once it has one, with its caption as the alt text", async () => {
    const { byId } = await import("@/content/projects");
    const jepa = byId("jepa");
    const original = jepa.shots;
    jepa.shots = [{ caption: "A time-blocked daily plan, as posted to Discord", image: "/shots/jepa-plan.png" }];
    try {
      await visit("jepa");
      const screens = screen.getByRole("region", { name: "Screens" });
      expect(within(screens).getByRole("img", { name: "A time-blocked daily plan, as posted to Discord" })).toHaveAttribute(
        "src",
        "/reactportfolio/shots/jepa-plan.png", // a file in public/, served under the site's base path
      );
      expect(within(screens).queryByText("Screenshot coming soon")).not.toBeInTheDocument();
    } finally {
      jepa.shots = original;
    }
  });
});

describe("Pro-Link AI case study", () => {
  /** jsdom has no layout: place the scroll track as the browser would, then scroll. */
  function scrollTrackTo(track: HTMLElement, progress: number) {
    const height = 4000;
    const top = -progress * (height - window.innerHeight);
    track.getBoundingClientRect = () => ({ top, height, bottom: top + height, left: 0, right: 0, width: 0, x: 0, y: top, toJSON: () => ({}) });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
  }

  it("walks the visitor through how it works, one chapter per swing phase, as they scroll", async () => {
    await visit("pro-link-ai");
    const track = screen.getByRole("region", { name: "How Pro-Link AI works" });
    expect(within(track).getByRole("heading", { level: 2, name: "It sees the swing" })).toBeInTheDocument();
    expect(within(track).getByText("Address · 1 of 4")).toBeInTheDocument();

    scrollTrackTo(track, 0.7);
    expect(within(track).getByRole("heading", { level: 2, name: "It compares you to the pros" })).toBeInTheDocument();
    expect(within(track).getByText("Impact · 3 of 4")).toBeInTheDocument();
  });

  it("shows every chapter at once to a visitor who asks for reduced motion", async () => {
    setReducedMotion(true);
    await visit("pro-link-ai");
    const track = screen.getByRole("region", { name: "How Pro-Link AI works" });
    const chapters = within(track).getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(chapters).toEqual(["It sees the swing", "It finds the faults", "It compares you to the pros", "It coaches in two languages"]);
    expect(within(track).queryByText("Scroll to swing")).not.toBeInTheDocument();
  });
});

describe("Software Factory case study", () => {
  it("replays one ticket's run in a console while the pipeline marks its current stage", async () => {
    vi.useFakeTimers();
    try {
      await visit("software-factory");
      const console_ = screen.getByRole("figure", { name: "Replay of one ticket's run through the factory (illustrative)" });
      const rail = screen.getByRole("list", { name: "Pipeline stages" });
      expect(within(rail).getAllByRole("listitem").map((li) => li.textContent)).toEqual([
        "Ticket", "Triage", "Sandbox", "Worker", "Verify", "Secret scan", "Draft PR",
      ]);

      await act(() => vi.advanceTimersByTimeAsync(650 * 3));
      expect(console_).toHaveTextContent("triage: schema-constrained LLM judges");
      expect(console_).not.toHaveTextContent("draft PR opened for review");
      expect(within(rail).getByText("Triage").closest("li")).toHaveAttribute("aria-current", "step");

      await act(() => vi.advanceTimersByTimeAsync(650 * 9));
      expect(console_).toHaveTextContent("draft PR opened for review");
      expect(within(rail).getByText("Draft PR").closest("li")).toHaveAttribute("aria-current", "step");
    } finally {
      vi.useRealTimers();
    }
  });

  it("shows the whole run at once to a visitor who asks for reduced motion", async () => {
    setReducedMotion(true);
    await visit("software-factory");
    const console_ = screen.getByRole("figure", { name: "Replay of one ticket's run through the factory (illustrative)" });
    expect(console_).toHaveTextContent("pulled the next ticket from Linear");
    expect(console_).toHaveTextContent("cost and latency logged to the SQLite ledger");
  });
});

describe("showcase case studies", () => {
  it("calls Jin's share of the co-invented patent his part, not the whole", async () => {
    await visit("patent");
    const part = screen.getByRole("region", { name: "My part" });
    expect(within(part).getByText("Engineered the solution.")).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "What I built" })).not.toBeInTheDocument();
  });

  it("draws the agent's loop, in a diagram a screen reader can read", async () => {
    await visit("claude-api-agent");
    const loop = screen.getByRole("region", { name: "How the agent works" });
    expect(within(loop).getByRole("img", { name: /generates a test, validates it and self-heals it/ })).toBeInTheDocument();
  });
});
