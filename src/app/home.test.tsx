import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PERSONAL_LINE_PLACEHOLDER, PHOTO_PLACEHOLDER } from "@/content/personal";
import { track } from "@/lib/analytics";
import { askForCalmVersion, setReducedMotion } from "@/test/setup";
import Home from "./page";

// Boundaries faked for Seam A: the router's search params, the analytics client, the 3D canvas.
const search = { value: "" };
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(search.value) }));
vi.mock("@/lib/analytics", () => ({ track: vi.fn() }));
// The WebGL island can't run in jsdom: this stub stands in for "the visitor clicked a building".
vi.mock("@/components/island/IslandScene", () => ({
  default: (props: { onSelect: (id: string) => void; animate: boolean }) => (
    <div data-testid="island-scene" data-animate={String(props.animate)}>
      <button type="button" onClick={() => props.onSelect("patent")}>
        Fake building: patent
      </button>
    </div>
  ),
}));

/** The hero's contact actions: the first on the page, above the island's Contact section. */
const hero = {
  link: (name: string) => screen.getAllByRole("link", { name })[0],
  copy: () => screen.getAllByRole("button", { name: "Copy email address" })[0],
  status: () => screen.getAllByRole("status")[0],
};

describe("home page", () => {
  it("tells the visitor who Jin is", () => {
    render(<Home />);
    expect(screen.getByText("Jinwoo Lim")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Engineer · Inventor · Builder" })).toBeInTheDocument();
    expect(screen.getByText("I build AI products and the systems that ship them")).toBeInTheDocument();
  });

  it("tells search engines who Jin is, with nothing the site doesn't already show", () => {
    const { container } = render(<Home />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(JSON.parse(script!.textContent!)).toEqual({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Jinwoo Lim",
      description: "Engineer · Inventor · Builder",
      url: "https://j1nnnn.github.io/reactportfolio/",
    });
  });

  it("offers ways to reach Jin", () => {
    render(<Home />);
    expect(hero.link("Email")).toHaveAttribute("href", "mailto:devj49i@outlook.com");
    const resume = hero.link("Download résumé");
    expect(resume).toHaveAttribute("href", "/reactportfolio/resume.pdf");
    expect(resume).toHaveAttribute("download", "Jinwoo_Lim_Resume.pdf"); // saved under his name, not "resume.pdf"
    // No booking link yet: the button stays off until Jin has one.
    expect(screen.queryByRole("link", { name: "Book a call" })).not.toBeInTheDocument();
  });

  it("lets a visitor without a mail app copy the email address", async () => {
    const user = userEvent.setup(); // installs a clipboard stub
    render(<Home />);
    await user.click(hero.copy());
    expect(await navigator.clipboard.readText()).toBe("devj49i@outlook.com");
    expect(hero.status()).toHaveTextContent("Email address copied");
  });

  it("counts which contact action a visitor uses", async () => {
    const user = userEvent.setup();
    render(<Home />);
    for (const name of ["Email", "Download résumé"]) {
      const link = hero.link(name);
      link.addEventListener("click", (e) => e.preventDefault()); // jsdom can't navigate
      await user.click(link);
    }
    await user.click(hero.copy());
    expect(vi.mocked(track).mock.calls).toEqual([["email"], ["resume"], ["copy_email"]]);
  });

  it("offers the same ways to reach Jin again in a Contact section below the island", async () => {
    const user = userEvent.setup(); // installs a clipboard stub
    render(<Home />);
    const contact = screen.getByRole("region", { name: "Contact" });
    const island = screen.getByRole("navigation", { name: "Featured work" });
    expect(island.compareDocumentPosition(contact) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    const email = within(contact).getByRole("link", { name: "Email" });
    expect(email).toHaveAttribute("href", "mailto:devj49i@outlook.com");
    const resume = within(contact).getByRole("link", { name: "Download résumé" });
    expect(resume).toHaveAttribute("href", "/reactportfolio/resume.pdf");
    expect(resume).toHaveAttribute("download", "Jinwoo_Lim_Resume.pdf");
    expect(within(contact).queryByRole("link", { name: "Book a call" })).not.toBeInTheDocument();

    for (const link of [email, resume]) {
      link.addEventListener("click", (e) => e.preventDefault()); // jsdom can't navigate
      await user.click(link);
    }
    await user.click(within(contact).getByRole("button", { name: "Copy email address" }));
    expect(await navigator.clipboard.readText()).toBe("devj49i@outlook.com");
    expect(within(contact).getByRole("status")).toHaveTextContent("Email address copied");
    expect(vi.mocked(track).mock.calls).toEqual([["email"], ["resume"], ["copy_email"]]);
  });

  it("introduces Jin in an About section between the island and Contact", () => {
    render(<Home />);
    const about = screen.getByRole("region", { name: "About" });
    expect(about).toHaveAttribute("id", "about");
    expect(within(about).getByRole("heading", { level: 2, name: "Hi, I'm Jin." })).toBeInTheDocument();
    const island = screen.getByRole("navigation", { name: "Featured work" });
    const contact = screen.getByRole("region", { name: "Contact" });
    expect(island.compareDocumentPosition(about) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(about.compareDocumentPosition(contact) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("tells the visitor about Jin in his own words, his numbers and what he does beyond the code", () => {
    render(<Home />);
    const about = screen.getByRole("region", { name: "About" });
    const intro = [
      "I'm a full-stack engineer at Wells Fargo, with four-plus years building and running production systems in Wealth & Investment Management, one of the most regulated corners of financial services.",
      "I work across the whole stack, from React and TypeScript to Java and Spring Boot, and I build the AI layer on top: Claude API agents, MCP servers, and the context that makes them reliable. What I like most is turning an ambiguous, high-stakes problem into software people actually use.",
      "Outside work I built Pro-Link AI, real-time swing analysis now in use by a golf coach in South Korea, and I'm a co-inventor on a granted US patent.",
    ].map((text) => within(about).getByText(text));

    const numbers = within(about).getByRole("list", { name: "Headline numbers" });
    expect(within(numbers).getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "4+years shipping production systems",
      "1granted US patent",
      "3top-5 hackathon finishes",
      "0critical defects across every release I gated",
    ]);

    const beyond = within(about).getByRole("list", { name: "Beyond the code" });
    expect(within(beyond).getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "M.S. Analytics, AI/ML track, Georgia Tech (in progress)",
      "B.S. Computer Science, Cum Laude, NJIT (2018 – 2022)",
      "Co-inventor, US Patent 12,470,530 B2",
      "Chair, Early Careers Alumni Leadership Council, Wells Fargo (2023 – 2025)",
      "Chair, New Member Educator, Mentor, Theta Tau (2019 – present)",
      "Gold Member, ALPFA (2024 – present)",
    ]);
    expect(within(about).getByRole("heading", { level: 3, name: "Beyond the code" })).toBeInTheDocument();

    // In order: intro, then the numbers, then beyond the code.
    for (const [a, b] of [[intro[0], intro[1]], [intro[1], intro[2]], [intro[2], numbers], [numbers, beyond]]) {
      expect(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    expect(about).not.toHaveTextContent(/certif/i);
    expect(about).not.toHaveTextContent(/\+?\d[\d\s().-]{8,}\d/); // no phone number
  });

  it("holds marked places for Jin's photo and his own personal line until he supplies them", () => {
    // Exported so the deploy guard can refuse to publish them.
    expect(PHOTO_PLACEHOLDER).toBe("photo goes here");
    expect(PERSONAL_LINE_PLACEHOLDER).toBe(
      "Your own two or three sentences go here: what drives you, and who you are outside work.",
    );
    render(<Home />);
    const about = screen.getByRole("region", { name: "About" });
    const photo = within(about).getByText("photo goes here");
    const firstIntro = within(about).getByText(/^I'm a full-stack engineer at Wells Fargo/);
    const lastIntro = within(about).getByText(/^Outside work I built Pro-Link AI/);
    const line = within(about).getByText(
      "Your own two or three sentences go here: what drives you, and who you are outside work.",
    );
    const numbers = within(about).getByRole("list", { name: "Headline numbers" });
    for (const [a, b] of [[photo, firstIntro], [lastIntro, line], [line, numbers]]) {
      expect(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
  });

  it("shows the same About section in the calm version (ADR 0003)", () => {
    const full = render(<Home />);
    const fullText = screen.getByRole("region", { name: "About" }).textContent;
    full.unmount();

    askForCalmVersion();
    render(<Home />);
    const about = screen.getByRole("region", { name: "About" });
    expect(about).toHaveTextContent("Hi, I'm Jin.");
    expect(about).toHaveTextContent("0critical defects across every release I gated");
    expect(about.textContent).toBe(fullText);
  });

  it("lets a visitor open any featured project without the 3D scene", async () => {
    const user = userEvent.setup();
    render(<Home />);
    const featured = screen.getByRole("navigation", { name: "Featured work" });
    const names = within(featured).getAllByRole("button").map((b) => b.textContent);
    expect(names).toEqual(["Pro-Link AI", "Software Factory", "JEPA", "TurfGame", "Claude API agent", "Patent US 12,470,530 B2"]);

    await user.click(within(featured).getByRole("button", { name: "Software Factory" }));
    const card = screen.getByRole("region", { name: "Software Factory" });
    expect(within(card).getByText("Personal prototype: draft PRs opened, none merged yet")).toBeInTheDocument();
    expect(within(card).getByRole("link", { name: "Read the case study" })).toHaveAttribute(
      "href",
      expect.stringMatching(/\/work\/software-factory$/),
    );

    await user.click(within(card).getByRole("button", { name: "Back to the island" }));
    expect(screen.queryByRole("region", { name: "Software Factory" })).not.toBeInTheDocument();
  });

  it("opens a project when the visitor selects its building on the island", async () => {
    const user = userEvent.setup();
    render(<Home />);
    // The canvas is aria-hidden (the chip row is its accessible twin), so reach it as a pointer would.
    await user.click(await screen.findByRole("button", { name: "Fake building: patent", hidden: true }));
    const card = screen.getByRole("region", { name: "Patent US 12,470,530 B2" });
    expect(within(card).getByText("System and Method for Securing Financial Entity Networks.")).toBeInTheDocument();
  });

  it("reopens a project's card when the visitor comes back from its case study", () => {
    search.value = "focus=pro-link-ai";
    render(<Home />);
    expect(screen.getByRole("region", { name: "Pro-Link AI" })).toBeInTheDocument();
    search.value = "";
  });

  it("takes a keyboard visitor to the card they opened, and back again with Escape", async () => {
    const user = userEvent.setup();
    render(<Home />);
    const chip = screen.getByRole("button", { name: "JEPA" });
    chip.focus();
    await user.keyboard("{Enter}");
    const card = screen.getByRole("region", { name: "JEPA" });
    expect(card).toContainElement(document.activeElement as HTMLElement);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("region", { name: "JEPA" })).not.toBeInTheDocument();
    expect(chip).toHaveFocus();
  });

  it("animates the island even when the visitor's OS asks for reduced motion (ADR 0003)", async () => {
    setReducedMotion(true);
    render(<Home />);
    expect(await screen.findByTestId("island-scene")).toHaveAttribute("data-animate", "true");
  });
});
