import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { track } from "@/lib/analytics";
import { setReducedMotion } from "@/test/setup";
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

  it("keeps the island still for a visitor who asks for reduced motion", async () => {
    setReducedMotion(true);
    render(<Home />);
    expect(await screen.findByTestId("island-scene")).toHaveAttribute("data-animate", "false");
  });
});
