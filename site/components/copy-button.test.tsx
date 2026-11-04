// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "./copy-button";

const stubClipboard = (writeText: (text: string) => Promise<void>) =>
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("CopyButton", () => {
  it("copies its text and confirms, then resets", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn(() => Promise.resolve());
    stubClipboard(writeText);
    render(<CopyButton text="/plugin install onex@skills" label="Copy install command" />);

    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copy install command" })));

    expect(writeText).toHaveBeenCalledWith("/plugin install onex@skills");
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
    await act(async () => vi.advanceTimersByTime(2000));
    expect(screen.getByRole("status")).toHaveTextContent("");
  });

  it("falls back to selecting text when the clipboard API refuses", async () => {
    stubClipboard(() => Promise.reject(new Error("denied")));
    const execCommand = vi.fn(() => true);
    Object.defineProperty(document, "execCommand", { value: execCommand, configurable: true });
    render(<CopyButton text="claude plugin install onex@skills" label="Copy" />);

    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copy" })));

    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
    expect(document.querySelector("textarea")).toBeNull();
  });

  it("tells the user to copy manually when every method fails", async () => {
    stubClipboard(() => Promise.reject(new Error("denied")));
    Object.defineProperty(document, "execCommand", { value: () => false, configurable: true });
    render(<CopyButton text="x" label="Copy" />);

    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copy" })));

    expect(screen.getByRole("status")).toHaveTextContent("Copy failed. Select the text to copy it.");
  });
});
