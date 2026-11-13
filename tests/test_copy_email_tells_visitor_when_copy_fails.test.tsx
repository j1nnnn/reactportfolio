import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactActions } from "@/components/ContactActions";
import { contact } from "@/content/site";
import { track } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({ track: vi.fn() }));

const setClipboard = (clipboard: unknown) =>
  Object.defineProperty(navigator, "clipboard", { value: clipboard, configurable: true });

afterEach(() => vi.mocked(track).mockClear());

describe("Copy email address when the copy fails", () => {
  it("test_status_says_copy_failed_and_shows_address_when_write_rejects", async () => {
    const user = userEvent.setup();
    setClipboard({ writeText: vi.fn().mockRejectedValue(new Error("denied")) });
    render(<ContactActions />);

    await user.click(screen.getByRole("button", { name: "Copy email address" }));

    const status = await screen.findByRole("status");
    await vi.waitFor(() => expect(status.textContent).toContain(contact.email));
    expect(status.textContent).not.toBe("Email address copied");
    expect(track).toHaveBeenCalledTimes(1);
  });

  it("test_status_says_copy_failed_and_shows_address_when_clipboard_is_undefined", async () => {
    const user = userEvent.setup();
    setClipboard(undefined);
    render(<ContactActions />);

    await user.click(screen.getByRole("button", { name: "Copy email address" }));

    const status = screen.getByRole("status");
    await vi.waitFor(() => expect(status.textContent).toContain(contact.email));
    expect(track).toHaveBeenCalledTimes(1);
  });
});
