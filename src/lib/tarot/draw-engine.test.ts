import { describe, expect, it } from "vitest";
import { Deck } from "@/lib/tarot/deck";
import { draw } from "@/lib/tarot/draw-engine";

describe("draw", () => {
  const testDeck = new Deck();

  it("draws one card for single spread without duplicates", () => {
    const result = draw("single", testDeck, () => 0.1);

    expect(result.cards).toHaveLength(1);
    expect(result.cards[0].positionId).toBe("answer");
    expect(["upright", "reversed"]).toContain(result.cards[0].orientation);
  });

  it("draws unique cards when spread needs multiple", () => {
    const rng = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
    let i = 0;
    const result = draw("three-card", testDeck, () => rng[i++] ?? 0.5);

    const ids = result.cards.map((c) => c.cardId);
    expect(new Set(ids).size).toBe(3);
  });

  it("is reproducible with seeded rng", () => {
    const seq = [0.2, 0.7, 0.4, 0.9];
    let n = 0;
    const rng = () => seq[n++ % seq.length];

    const a = draw("single", testDeck, rng);
    n = 0;
    const b = draw("single", testDeck, rng);

    expect(a).toEqual(b);
  });
});
