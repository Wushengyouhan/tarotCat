import { describe, expect, it } from "vitest";
import { ReadingSession } from "@/lib/tarot/reading-session";
import type { DrawResult } from "@/lib/tarot/types";

const singleDraw: DrawResult = {
  cards: [{ cardId: "m00", orientation: "upright", positionId: "answer" }],
};

function createSession() {
  return new ReadingSession({
    question: "测试问题内容",
    spreadId: "single",
    drawResult: singleDraw,
  });
}

describe("ReadingSession", () => {
  it("starts in shuffling phase", () => {
    expect(createSession().getPhase()).toBe("shuffling");
  });

  it("moves to cutting after shuffle", () => {
    const session = createSession();
    session.finishShuffling();
    expect(session.getPhase()).toBe("cutting");
    expect(session.canReveal()).toBe(false);
  });

  it("moves to revealing after cutting", () => {
    const session = createSession();
    session.finishShuffling();
    session.finishCutting();
    expect(session.getPhase()).toBe("revealing");
    expect(session.canReveal()).toBe(true);
  });

  it("completes after revealing single card", () => {
    const session = createSession();
    session.finishShuffling();
    session.finishCutting();
    session.revealNextCard();
    expect(session.getPhase()).toBe("complete");
    expect(session.canReveal()).toBe(false);
  });

  it("cannot reveal before cutting finishes", () => {
    const session = createSession();
    session.finishShuffling();
    session.revealNextCard();
    expect(session.getPhase()).toBe("cutting");
  });

  it("cannot reveal during shuffling", () => {
    const session = createSession();
    session.revealNextCard();
    expect(session.getPhase()).toBe("shuffling");
  });

  it("reveals three cards sequentially for three-card spread", () => {
    const session = new ReadingSession({
      question: "三牌阵测试问题",
      spreadId: "three-card",
      drawResult: {
        cards: [
          { cardId: "m00", orientation: "upright", positionId: "past" },
          { cardId: "m01", orientation: "reversed", positionId: "present" },
          { cardId: "m02", orientation: "upright", positionId: "future" },
        ],
      },
    });

    session.finishShuffling();
    session.finishCutting();
    session.revealNextCard();
    expect(session.getPhase()).toBe("revealing");
    session.revealNextCard();
    expect(session.getPhase()).toBe("revealing");
    session.revealNextCard();
    expect(session.getPhase()).toBe("complete");
  });
});
