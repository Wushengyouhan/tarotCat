import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomePage } from "@/components/HomePage";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
}));

vi.mock("@/lib/reading-draft", () => ({
  saveReadingDraft: vi.fn(),
  loadReadingDraft: vi.fn(),
  clearReadingDraft: vi.fn(),
}));

describe("HomePage", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("renders Chinese home shell with question form and spread choices", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /聆听牌面的低语/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/你的问题/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /占卜历史/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /单牌/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /三牌阵/i })).toBeInTheDocument();
  });

  it("navigates to reading when single spread submitted", async () => {
    const user = userEvent.setup();
    const { saveReadingDraft } = await import("@/lib/reading-draft");
    render(<HomePage />);

    await user.type(screen.getByLabelText(/你的问题/i), "我该如何面对接下来的选择？");
    await user.click(screen.getByRole("button", { name: /开始占卜/i }));

    expect(saveReadingDraft).toHaveBeenCalledWith({
      question: "我该如何面对接下来的选择？",
      spreadId: "single",
    });
    expect(push).toHaveBeenCalledWith("/reading");
  });

  it("navigates to reading for three-card spread", async () => {
    const user = userEvent.setup();
    const { saveReadingDraft } = await import("@/lib/reading-draft");
    render(<HomePage />);

    await user.type(screen.getByLabelText(/你的问题/i), "我该如何面对接下来的选择？");
    await user.click(screen.getByRole("radio", { name: /三牌阵/i }));
    await user.click(screen.getByRole("button", { name: /开始占卜/i }));

    expect(saveReadingDraft).toHaveBeenCalledWith({
      question: "我该如何面对接下来的选择？",
      spreadId: "three-card",
    });
    expect(push).toHaveBeenCalledWith("/reading");
  });
});
