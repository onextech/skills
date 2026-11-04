// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { INSTALL, INSTALL_MODES } from "@/config/site";
import { InstallBlock } from "./install-block";

afterEach(cleanup);

describe("InstallBlock", () => {
  it("starts on Claude Code and shows its commands in order", () => {
    render(<InstallBlock />);
    expect(screen.getByRole("button", { name: INSTALL.claude.label })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByTestId("install-line").map((el) => el.querySelector("code")?.textContent)).toEqual([
      ...INSTALL.claude.commands,
    ]);
  });

  it.each(INSTALL_MODES)("switches to %s and gives every line its own copy button", (mode) => {
    render(<InstallBlock />);
    fireEvent.click(screen.getByRole("button", { name: INSTALL[mode].label }));

    INSTALL_MODES.forEach((m) =>
      expect(screen.getByRole("button", { name: INSTALL[m].label })).toHaveAttribute("aria-pressed", String(m === mode)),
    );
    const rendered = screen.getAllByTestId("install-line");
    expect(rendered.map((el) => el.querySelector("code")?.textContent)).toEqual([...INSTALL[mode].commands]);
    rendered.forEach((el, i) =>
      expect(within(el).getByRole("button", { name: `Copy step ${i + 1}` })).toBeInTheDocument(),
    );
  });
});
