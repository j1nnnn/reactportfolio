import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  PERSONAL_LINE_PLACEHOLDER,
  PHOTO_PLACEHOLDER,
  experience,
  otherProjects,
  proofLabel,
  skills,
} from "@/content/personal";
import { projects } from "@/content/projects";
import { track } from "@/lib/analytics";
import { askForCalmVersion, bringOnScreen, setReducedMotion, takeOffScreen } from "@/test/setup";
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
// The dive's WebGL world can't run in jsdom either.
vi.mock("@/components/dive/DiveWorld", () => ({ default: () => <div data-testid="dive-world" /> }));

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
    // Non-breaking spaces keep each "·" off the start of a line; they read as plain spaces.
    const title = screen.getByRole("heading", { level: 1 });
    expect(title.textContent!.replace(/\s+/g, " ")).toBe("Engineer · Inventor · Builder · Architect");
    expect(screen.getByText("An engineer first: I solve real-world problems, with the business sense to lead")).toBeInTheDocument();
  });

  it("tells search engines who Jin is, with nothing the site doesn't already show", () => {
    const { container } = render(<Home />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(JSON.parse(script!.textContent!)).toEqual({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Jinwoo Lim",
      description: "Engineer · Inventor · Builder · Architect",
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
      "By day I'm a full-stack engineer at Wells Fargo, building investment software for financial advisors in Wealth & Investment Management, one of the most regulated corners of finance. My range runs from the UI to the microservices and APIs behind it, down to SQL and NoSQL databases and the cloud, with an AI layer on top, like a Claude agent that writes our tests and repairs them. I'm taking the analytics side further in my M.S. at Georgia Tech.",
      "The business side came with the work. I stepped in as my team's acting technical product owner, and I still design stories with our product owners while I take on more of the engineering, from new features to defects. Advisors and business partners send us requirements and defects as they test, so I build close to the people who use it. I brief senior leadership on release readiness every cycle, and I've led a workstream across the US and India.",
      "Outside work I keep building. Pro-Link AI is a coaching assistant for a golf coach in South Korea: it spots faults in a student's swing and measures it against a pro's to give tips. He uses it at least twice a week to plan lessons and make every session more productive, and I'm building the metrics that show how much a student improves. My software factory runs like an agile team on Linear, routing each ticket to the model and development method that fit it while keeping token spend down, then opening pull requests for my review. And now I'm building an agent for Human In Tech, my family's business.",
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

  it("opens About with Jin's own words, and keeps a marked place only for his photo", () => {
    // Exported so the deploy guard can refuse to publish the line placeholder.
    expect(PHOTO_PLACEHOLDER).toBe("photo goes here");
    expect(PERSONAL_LINE_PLACEHOLDER).toBe(
      "Your own two or three sentences go here: what drives you, and who you are outside work.",
    );
    render(<Home />);
    const about = screen.getByRole("region", { name: "About" });
    const photo = within(about).getByText("photo goes here");
    const line = within(about).getByText(
      "I'm a builder, an inventor, an engineer and an architect, and to me technology and business are one craft. I see every problem from the top view, put the sharpest AI tools to work on everything below, and experiment in my own sandbox until an idea works and earns. The edge is no longer who can write the code but who can combine what's out there into the best product: share ideas openly, iterate fast, then build the niche.",
    );
    const firstIntro = within(about).getByText(/^By day I'm a full-stack engineer at Wells Fargo/);
    expect(about).not.toHaveTextContent(PERSONAL_LINE_PLACEHOLDER);
    for (const [a, b] of [[photo, line], [line, firstIntro]]) {
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

  describe("the Experience section", () => {
    const roles = [
      {
        dates: "2023 – present",
        org: "Wells Fargo",
        title: "Software Engineer",
        scope: "Wealth & Investment Management Technology",
        points: [
          "Building a greenfield investment management platform, touching millions in client assets, that financial advisors use to maintain and reallocate client portfolios.",
          "Sole architect of the Playwright test-automation framework that is the release gate for a 20-person program: zero critical defects across every production release.",
          "Designed a production Claude API agent that generates, validates and self-heals test scripts, with its evaluation framework and confidence-gated rollouts.",
          "Led a workstream across a US and an India-based team, and acted as Product Owner during the test-automation phase.",
        ],
      },
      {
        dates: "2026 – present",
        org: "Pro-Link AI",
        title: "Creator and Engineer · Personal project",
        scope: "Built for a golf coach in South Korea, in use by him in production",
        points: [
          "Real-time pose estimation, 9 biomechanical fault detectors and a pro-swing comparator.",
          "A Claude coaching layer in English and Korean, guarded against prompt injection and invented numbers.",
          "1,000+ automated tests and smoke-test-gated rollouts with automatic rollback.",
        ],
        link: { name: "Read the case study", href: /\/work\/pro-link-ai$/ },
      },
      {
        dates: "2022 – 2023",
        org: "Wells Fargo",
        title: "Technology Analyst",
        scope: "Cloud Modernization & Innovation",
        points: [
          "Co-inventor, US Patent 12,470,530 B2, System and Method for Securing Financial Entity Networks (granted November 2025).",
          "Three top-5 hackathon finishes, each a 48-hour build: top 3, top 4 (with executive sponsorship) and top 5.",
          "Zero-downtime cloud migration of legacy investment apps.",
        ],
        link: { name: "About the patent", href: /\/work\/patent$/ },
      },
      {
        dates: "2021",
        org: "Wells Fargo",
        title: "Technology Intern",
        scope: "Early Careers program",
        points: [
          "Built automated unit test suites that caught critical pre-production defects.",
          "Co-led onboarding for 50+ incoming engineers; leadership adopted the model for future cohorts.",
        ],
      },
    ];

    /** The timeline's entries, newest first, as the visitor's screen reader lists them. */
    const entries = () => {
      const experience = screen.getByRole("region", { name: "Experience" });
      const timeline = within(experience).getByRole("list", { name: "Timeline" });
      expect(timeline.tagName).toBe("OL");
      return within(timeline).getAllByRole("listitem").filter((li) => li.parentElement === timeline);
    };

    it("follows About and lists Jin's four roles newest first, in his CV's words", () => {
      render(<Home />);
      const about = screen.getByRole("region", { name: "About" });
      const experience = screen.getByRole("region", { name: "Experience" });
      expect(experience).toHaveAttribute("id", "experience");
      expect(about.compareDocumentPosition(experience) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      const contact = screen.getByRole("region", { name: "Contact" });
      expect(experience.compareDocumentPosition(contact) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

      const items = entries();
      expect(items).toHaveLength(4);
      items.forEach((item, i) => {
        const role = roles[i];
        const shown = [role.dates, role.org, role.title, role.scope, ...role.points].map((text) => within(item).getByText(text));
        for (let k = 1; k < shown.length; k++) {
          expect(shown[k - 1].compareDocumentPosition(shown[k]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        }
        expect(within(item).getAllByRole("listitem")).toHaveLength(role.points.length);
      });
      expect(experience).not.toHaveTextContent(/\+?\d[\d\s().-]{8,}\d/); // no phone number
    });

    it("links the Pro-Link AI and Technology Analyst roles to their case studies, and only those", () => {
      render(<Home />);
      entries().forEach((item, i) => {
        const { link } = roles[i];
        const links = within(item).queryAllByRole("link");
        expect(links).toHaveLength(link ? 1 : 0);
        if (link) {
          expect(links[0]).toHaveAccessibleName(link.name);
          expect(links[0]).toHaveAttribute("href", expect.stringMatching(link.href));
        }
      });
    });

    it("stacks the same four roles as a plain list in the calm version, with no dive or year rail", async () => {
      const full = render(<Home />);
      const fullText = entries().map((li) => li.textContent);
      full.unmount();

      askForCalmVersion();
      render(<Home />);
      await screen.findByTestId("island-scene");
      expect(entries().map((li) => li.textContent)).toEqual(fullText);
      expect(screen.queryByTestId("dive-world")).not.toBeInTheDocument();
      expect(screen.queryByRole("list", { name: "Years", hidden: true })).not.toBeInTheDocument();
    });

    /**
     * jsdom has no layout or scrolling. Fakes a page whose every box starts at the top of the document
     * and is far taller than the screen, so the dive's progress is how far the window has scrolled.
     */
    function fakeTallPage() {
      const spies = [
        vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(40_000),
        vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
          () => ({ top: -window.scrollY, height: 40_000 }) as DOMRect,
        ),
        vi.spyOn(window, "scrollTo").mockImplementation(((opts: ScrollToOptions) => {
          Object.defineProperty(window, "scrollY", { configurable: true, value: opts.top });
          window.dispatchEvent(new Event("scroll"));
        }) as typeof window.scrollTo),
      ];
      return () => {
        spies.forEach((spy) => spy.mockRestore());
        Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
      };
    }

    it("lands #experience on the first role's station, with the year rail marking its dates", () => {
      const restore = fakeTallPage();
      try {
        window.history.replaceState(null, "", "/#experience");
        render(<Home />);
        const rail = screen.getByRole("list", { name: "Years" });
        expect(within(rail).getAllByRole("listitem").map((li) => li.textContent)).toEqual([
          "2023 – present",
          "2026 – present",
          "2022 – 2023",
          "2021",
        ]);
        expect(within(rail).getByText("2023 – present")).toHaveAttribute("aria-current", "step");
        expect(rail.querySelectorAll("[aria-current]")).toHaveLength(1);
      } finally {
        restore();
      }
    });

    it("shows the year rail only while a role's station is in view", () => {
      const restore = fakeTallPage();
      try {
        window.history.replaceState(null, "", "/#about");
        render(<Home />);
        expect(screen.queryByRole("list", { name: "Years" })).not.toBeInTheDocument();
      } finally {
        restore();
      }
    });
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

  describe("the Other projects station", () => {
    const cards = () => {
      const section = screen.getByRole("region", { name: "Other projects" });
      return within(section).getAllByRole("article").map((card) => ({
        tag: within(card).getByTestId("tag").textContent,
        name: within(card).getByRole("heading", { level: 3 }).textContent,
        blurb: within(card).getByTestId("blurb").textContent,
        stack: within(within(card).getByRole("list", { name: "Stack" }))
          .getAllByRole("listitem")
          .map((li) => li.textContent),
      }));
    };
    const FIVE = [
      {
        tag: "Personal · active",
        name: "Life OS",
        blurb: "My daily execution engine: a web app and PWA for goals, tasks, schedules and reflections, organized goal-first.",
        stack: ["Next.js 16", "TypeScript", "Dexie.js", "Zustand"],
      },
      {
        tag: "Personal · daily use",
        name: "Security Sweep",
        blurb: "A read-only sweep of 21 GitHub repos' security settings, alerts and new commits, failing closed on read errors.",
        stack: ["Python", "GitHub CLI", "64 unit tests"],
      },
      {
        tag: "Georgia Tech · team project",
        name: "Citi Bike demand forecasting",
        blurb: "A pipeline turning public Citi Bike, subway, weather and bike-route data into an H3 cell-by-hour panel under a fixed data contract.",
        stack: ["Python", "H3", "pytest"],
      },
      {
        tag: "University · 1st place midterm",
        name: "Smart City of Aurora",
        blurb: "A full-stack smart city platform for the City of Aurora, IL; top 5 overall.",
        stack: ["React", "Python", "Google Maps API", "IoT"],
      },
      {
        tag: "Personal",
        name: "Human In Tech",
        blurb: "A professional website for a family business.",
        stack: ["React", "Responsive design"],
      },
    ];

    it("shows Jin's five smaller projects, in order, after About and before Contact", () => {
      render(<Home />);
      const section = screen.getByRole("region", { name: "Other projects" });
      expect(section).toHaveAttribute("id", "projects");
      expect(within(section).getByRole("heading", { level: 2, name: "More things I've built" })).toBeInTheDocument();
      expect(cards()).toEqual(FIVE);
      const about = screen.getByRole("region", { name: "About" });
      const contact = screen.getByRole("region", { name: "Contact" });
      expect(about.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(section.compareDocumentPosition(contact) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it("links a card only to a live site, and only once one is set: the code is private", () => {
      const { unmount } = render(<Home />);
      const section = () => screen.getByRole("region", { name: "Other projects" });
      expect(within(section()).queryAllByRole("link")).toEqual([]);
      unmount();

      const lifeOs = otherProjects.find((p) => p.id === "lifeos")!;
      lifeOs.liveUrl = "https://lifeos.example.com/";
      try {
        render(<Home />);
        const links = within(section()).getAllByRole("link");
        expect(links).toHaveLength(1);
        expect(links[0]).toHaveAccessibleName("Life OS");
        expect(links[0]).toHaveAttribute("href", "https://lifeos.example.com/");
      } finally {
        delete lifeOs.liveUrl;
      }
    });

    it("lands #projects on the station, which stays as the visitor scrolls on to the end of the dive", () => {
      // jsdom has no layout: fake a 768px-tall screen with the dive starting 1000px down a page, 9000px
      // tall, and a page scroll that the dive can read back.
      let scrollY = 0;
      const isDive = (el: HTMLElement) => !!el.querySelector("#about") && !!el.querySelector("#projects");
      const spies = [
        vi.spyOn(window, "scrollY", "get").mockImplementation(() => scrollY),
        vi.spyOn(window, "scrollTo").mockImplementation(((opts: ScrollToOptions) => {
          scrollY = opts.top ?? 0;
          window.dispatchEvent(new Event("scroll"));
        }) as typeof window.scrollTo),
        vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (this: HTMLElement) {
          return isDive(this) ? 9000 : 400;
        }),
        vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
          const top = isDive(this) ? 1000 - scrollY : 0;
          const height = isDive(this) ? 9000 : 400;
          return { top, bottom: top + height, height, left: 0, right: 0, width: 0, x: 0, y: top } as DOMRect;
        }),
      ];
      const shown = (el: HTMLElement) => {
        for (let n: HTMLElement | null = el; n; n = n.parentElement) {
          if (Number(getComputedStyle(n).opacity || 1) < 1) return false;
        }
        return true;
      };
      try {
        window.history.replaceState(null, "", "/#projects");
        render(<Home />);
        const projects = screen.getByRole("region", { name: "Other projects" });
        const about = screen.getByRole("region", { name: "About" });
        expect(scrollY).toBeGreaterThan(1000);
        expect(shown(projects)).toBe(true);
        expect(shown(about)).toBe(false);

        act(() => window.scrollTo({ top: 1000 + 9000 - 768 })); // the end of the dive
        expect(shown(projects)).toBe(true);
      } finally {
        spies.forEach((spy) => spy.mockRestore());
      }
    });

    it("shows the same five cards in the calm version, with no dive", async () => {
      askForCalmVersion();
      render(<Home />);
      await screen.findByTestId("island-scene");
      expect(cards()).toEqual(FIVE);
      expect(screen.queryByTestId("dive-world")).not.toBeInTheDocument();
    });

    it("puts the five cards in the prerendered page, readable with JavaScript off", () => {
      const html = renderToString(<Home />);
      expect(html).toContain('id="projects"');
      expect(html).toContain("More things I&#x27;ve built");
      for (const { name } of FIVE) expect(html).toContain(name);
    });
  });

  describe("the Skills station", () => {
    // From Jin's CV, as the ticket lists them (SOF-233).
    const GROUPS = [
      ["AI & Agentic", ["Claude API", "Agentic workflows", "MCP servers", "Context engineering", "LLM evaluation", "RAG pipelines", "Computer vision"]],
      ["Languages", ["TypeScript", "Python", "Java", "C# / .NET"]],
      ["Frontend", ["React", "Next.js", "Angular", "Micro-frontends"]],
      ["Backend", ["Spring Boot", "Kafka", "FastAPI", "Cloudflare Workers"]],
      ["Data", ["MongoDB", "Data pipelines"]],
      ["Quality", ["Playwright", "Release gates", "Deterministic simulation", "Security automation"]],
      ["Leadership", ["Product ownership", "Cross-team leadership"]],
    ] as const;

    const section = () => screen.getByRole("region", { name: "Skills" });
    const skillButton = (name: string) =>
      within(within(section()).getByRole("group", { name: "Skills by group" })).getByRole("button", { name });
    /** What the readout says: the active node's name, then what it connects to. */
    const readout = () => {
      const r = within(section()).getByRole("status", { name: "Readout" });
      return {
        name: within(r).queryByRole("heading", { level: 3 })?.textContent,
        links: within(r).queryAllByRole("listitem").map((li) => li.textContent),
      };
    };

    it("sits between Experience and Other projects and lists every skill, grouped", () => {
      render(<Home />);
      const skills = section();
      expect(skills).toHaveAttribute("id", "skills");
      expect(within(skills).getByRole("heading", { level: 2, name: "Every skill, with proof" })).toBeInTheDocument();
      const experience = screen.getByRole("region", { name: "Experience" });
      const projects = screen.getByRole("region", { name: "Other projects" });
      expect(experience.compareDocumentPosition(skills) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(skills.compareDocumentPosition(projects) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

      const list = within(skills).getByRole("group", { name: "Skills by group" });
      const shown = within(list)
        .getAllByRole("list")
        .map((ul) => [ul.getAttribute("aria-label"), within(ul).getAllByRole("button").map((b) => b.textContent)]);
      expect(shown).toEqual(GROUPS);
    });

    // jsdom never scrolls, so the station's panel never arrives and stays pointer-events: none. Its
    // arrival is tested with #skills below; here the visitor's pointer reaches it regardless.
    const pointer = () => userEvent.setup({ pointerEventsCheck: 0 });

    it("names a hovered or focused skill in the readout with exactly its proofs", async () => {
      const user = pointer();
      render(<Home />);
      await user.hover(skillButton("Claude API"));
      expect(readout()).toEqual({
        name: "Claude API",
        links: ["Wells Fargo · Software Engineer", "Pro-Link AI", "Software Factory"],
      });

      act(() => skillButton("RAG pipelines").focus());
      expect(readout()).toEqual({ name: "RAG pipelines", links: ["Wells Fargo · Technology Analyst"] });
    });

    it("names an activated proof in the readout with the skills it proves", async () => {
      const user = pointer();
      render(<Home />);
      const proofs = within(section()).getByRole("list", { name: "Proofs" });
      await user.hover(within(proofs).getByRole("button", { name: "TurfGame, proof" }));
      expect(readout()).toEqual({ name: "TurfGame", links: ["C# / .NET", "Deterministic simulation"] });

      act(() => within(proofs).getByRole("button", { name: "Security Sweep, proof" }).focus());
      expect(readout()).toEqual({ name: "Security Sweep", links: ["Python", "Security automation"] });
    });

    it("backs every skill with at least one proof, each naming a real entry", () => {
      expect(skills.map((sk) => sk.name)).toEqual(GROUPS.flatMap(([, names]) => names));
      const entries = new Set<string>([
        ...experience.map((e) => e.id),
        ...projects.map((p) => p.id),
        ...otherProjects.map((p) => p.id),
      ]);
      for (const sk of skills) {
        expect(sk.proofs.length, sk.name).toBeGreaterThan(0);
        for (const id of sk.proofs) {
          expect(entries.has(id), `${sk.name} → ${id}`).toBe(true);
          expect(proofLabel(id), id).toBeTruthy();
        }
      }
    });

    it("lets a phone visitor tap a skill to do what hover does", async () => {
      const user = pointer();
      render(<Home />);
      await user.pointer({ keys: "[TouchA]", target: skillButton("Kafka") });
      expect(readout()).toEqual({ name: "Kafka", links: ["Wells Fargo · Software Engineer"] });
    });

    it("lands #skills on the station", () => {
      // As for #projects: a 768px screen, the dive 1000px down a 9000px page.
      let scrollY = 0;
      const isDive = (el: HTMLElement) => !!el.querySelector("#about") && !!el.querySelector("#skills");
      const spies = [
        vi.spyOn(window, "scrollY", "get").mockImplementation(() => scrollY),
        vi.spyOn(window, "scrollTo").mockImplementation(((opts: ScrollToOptions) => {
          scrollY = opts.top ?? 0;
          window.dispatchEvent(new Event("scroll"));
        }) as typeof window.scrollTo),
        vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (this: HTMLElement) {
          return isDive(this) ? 9000 : 400;
        }),
        vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
          const top = isDive(this) ? 1000 - scrollY : 0;
          const height = isDive(this) ? 9000 : 400;
          return { top, bottom: top + height, height, left: 0, right: 0, width: 0, x: 0, y: top } as DOMRect;
        }),
      ];
      const shown = (el: HTMLElement) => {
        for (let n: HTMLElement | null = el; n; n = n.parentElement) {
          if (Number(getComputedStyle(n).opacity || 1) < 1 || n.style.pointerEvents === "none") return false;
        }
        return true;
      };
      try {
        window.history.replaceState(null, "", "/#skills");
        render(<Home />);
        expect(shown(section())).toBe(true);
        expect(shown(screen.getByRole("region", { name: "Experience" }).querySelector("li")!)).toBe(false);
        expect(shown(screen.getByRole("region", { name: "Other projects" }))).toBe(false);
      } finally {
        spies.forEach((spy) => spy.mockRestore());
        window.history.replaceState(null, "", "/");
      }
    });

    it("shows the list and readout in the calm version, with no dive", async () => {
      askForCalmVersion();
      const user = userEvent.setup(); // the calm stack has no flight: the panel is always reachable
      render(<Home />);
      await screen.findByTestId("island-scene");
      expect(screen.queryByTestId("dive-world")).not.toBeInTheDocument();
      await user.hover(skillButton("Claude API"));
      expect(readout()).toEqual({
        name: "Claude API",
        links: ["Wells Fargo · Software Engineer", "Pro-Link AI", "Software Factory"],
      });
    });

    it("puts the skill list in the prerendered page, readable with JavaScript off", () => {
      const html = renderToString(<Home />);
      expect(html).toContain('id="skills"');
      expect(html).toContain("Every skill, with proof");
      expect(html).toContain("Cross-team leadership");
    });
  });

  describe("the navigation bar", () => {
    const bar = () => screen.getByRole("navigation", { name: "Site" });
    const link = (name: string) => within(bar()).getByRole("link", { name });

    it("links to the home page's six sections, in order, from the top of the page", () => {
      render(<Home />);
      const links = within(bar()).getAllByRole("link");
      expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
        ["Work", "#work"],
        ["About", "#about"],
        ["Experience", "#experience"],
        ["Skills", "#skills"],
        ["Projects", "#projects"],
        ["Contact", "#contact"],
      ]);
      for (const a of links) {
        const id = a.getAttribute("href")!.slice(1);
        expect(document.getElementById(id), id).not.toBeNull();
      }
      const island = screen.getByRole("navigation", { name: "Featured work" });
      expect(bar().compareDocumentPosition(island) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it("marks the link for the section in view", () => {
      render(<Home />);
      act(() => bringOnScreen(screen.getByRole("region", { name: "Skills" })));
      expect(link("Skills")).toHaveAttribute("aria-current", "location");
      expect(bar().querySelectorAll("[aria-current]")).toHaveLength(1);

      act(() => takeOffScreen(screen.getByRole("region", { name: "Skills" })));
      act(() => bringOnScreen(screen.getByRole("region", { name: "Contact" })));
      expect(link("Contact")).toHaveAttribute("aria-current", "location");
      expect(link("Skills")).not.toHaveAttribute("aria-current");
    });

    it("marks the link for the section in view in the calm version too", async () => {
      askForCalmVersion();
      render(<Home />);
      await screen.findByTestId("island-scene");
      act(() => bringOnScreen(screen.getByRole("region", { name: "Experience" })));
      expect(link("Experience")).toHaveAttribute("aria-current", "location");
    });

    it("turns dark over the dive, even between stations where no section is in view", async () => {
      render(<Home />);
      expect(bar()).toHaveAttribute("data-tone", "sky");
      // The dive's world on screen with no section box crossing the middle: a gap between stations.
      act(() => bringOnScreen(screen.getByTestId("dive-world")));
      expect(bar().querySelectorAll("[aria-current]")).toHaveLength(0);
      expect(bar()).toHaveAttribute("data-tone", "dark");
    });

    it("marks Contact once the visitor reaches the bottom of the page, short as the section is", () => {
      render(<Home />);
      // Contact is too short to reach the middle of the screen, and the dive's last station is still above it.
      act(() => bringOnScreen(screen.getByRole("region", { name: "Other projects" })));
      expect(link("Projects")).toHaveAttribute("aria-current", "location");

      Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 5000 });
      Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
      Object.defineProperty(window, "scrollY", { configurable: true, value: 4200 });
      act(() => {
        window.dispatchEvent(new Event("scroll"));
      });
      expect(link("Contact")).toHaveAttribute("aria-current", "location");
      expect(bar().querySelectorAll("[aria-current]")).toHaveLength(1);
      Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
      Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 0 });
    });

    it("folds into a Menu button a phone visitor can open and close from the keyboard", async () => {
      const user = userEvent.setup();
      render(<Home />);
      const menu = within(bar()).getByRole("button", { name: "Menu" });
      expect(menu).toHaveAttribute("aria-expanded", "false");
      expect(document.getElementById(menu.getAttribute("aria-controls")!)).toContainElement(link("About"));

      menu.focus();
      await user.keyboard("{Enter}");
      expect(menu).toHaveAttribute("aria-expanded", "true");
      await user.keyboard("{Escape}");
      expect(menu).toHaveAttribute("aria-expanded", "false");
      expect(menu).toHaveFocus();

      await user.click(menu);
      expect(menu).toHaveAttribute("aria-expanded", "true");
      await user.click(link("Skills"));
      expect(menu).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("the dive below the island", () => {
    it("pauses the island while the dive is on screen, and resumes it when the visitor scrolls back", async () => {
      render(<Home />);
      const island = await screen.findByTestId("island-scene");
      expect(island).toHaveAttribute("data-animate", "true");

      const about = screen.getByRole("region", { name: "About" });
      act(() => bringOnScreen(about));
      expect(island).toHaveAttribute("data-animate", "false");

      act(() => takeOffScreen(about));
      expect(island).toHaveAttribute("data-animate", "true");
    });

    it("flies the visitor through the dive's world below the island", async () => {
      render(<Home />);
      expect(await screen.findByTestId("dive-world")).toBeInTheDocument();
    });

    it("stacks the sections as plain panels, with no dive, in the calm version", async () => {
      askForCalmVersion();
      render(<Home />);
      await screen.findByTestId("island-scene");
      expect(screen.getByRole("region", { name: "About" })).toBeInTheDocument();
      expect(screen.queryByTestId("dive-world")).not.toBeInTheDocument();
    });

    it("never hides a station from assistive technology, in view or not", () => {
      render(<Home />);
      const about = screen.getByRole("region", { name: "About" });
      const check = () => {
        for (let el: HTMLElement | null = about; el; el = el.parentElement) {
          expect(el).not.toHaveAttribute("aria-hidden");
          expect(getComputedStyle(el).visibility).not.toBe("hidden");
        }
        expect(screen.getByRole("heading", { level: 2, name: "Hi, I'm Jin." })).toBeInTheDocument();
      };
      check();
      act(() => bringOnScreen(about));
      check();
      act(() => takeOffScreen(about));
      check();
    });

    it("puts the About section in the prerendered page, readable with JavaScript off", () => {
      const html = renderToString(<Home />);
      expect(html).toContain('id="about"');
      expect(html).toContain("critical defects across every release I gated");
      expect(html).toContain("Beyond the code");
    });
  });
});
