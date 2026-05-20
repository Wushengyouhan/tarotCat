import type { DrawResult, SpreadId } from "@/lib/tarot/types";

export type SessionPhase = "shuffling" | "cutting" | "revealing" | "complete";

export type ReadingSessionInput = {
  question: string;
  spreadId: SpreadId;
  drawResult: DrawResult;
};

export class ReadingSession {
  private phase: SessionPhase = "shuffling";
  private revealedCount = 0;

  readonly question: string;
  readonly spreadId: SpreadId;
  readonly drawResult: DrawResult;

  constructor(input: ReadingSessionInput) {
    this.question = input.question;
    this.spreadId = input.spreadId;
    this.drawResult = input.drawResult;
  }

  getPhase(): SessionPhase {
    return this.phase;
  }

  get totalCards(): number {
    return this.drawResult.cards.length;
  }

  get revealedCards(): number {
    return this.revealedCount;
  }

  finishShuffling(): void {
    if (this.phase === "shuffling") {
      this.phase = "cutting";
    }
  }

  /** 切牌仪式结束，进入逐张翻牌 */
  finishCutting(): void {
    if (this.phase === "cutting") {
      this.phase = "revealing";
    }
  }

  revealNextCard(): void {
    if (this.phase !== "revealing") {
      return;
    }

    if (this.revealedCount < this.totalCards) {
      this.revealedCount += 1;
    }

    if (this.revealedCount >= this.totalCards) {
      this.phase = "complete";
    }
  }

  canReveal(): boolean {
    return this.phase === "revealing" && this.revealedCount < this.totalCards;
  }

  isCardRevealed(index: number): boolean {
    return index < this.revealedCount;
  }

  getCurrentRevealIndex(): number {
    return this.revealedCount;
  }
}
