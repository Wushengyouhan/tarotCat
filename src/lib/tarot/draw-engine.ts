import type { Deck } from "@/lib/tarot/deck";
import { defaultDeck } from "@/lib/tarot/deck";
import { getSpread } from "@/lib/tarot/spread-registry";
import type { DrawResult, Orientation, Rng, SpreadId } from "@/lib/tarot/types";

function pickOrientation(rng: Rng): Orientation {
  return rng() < 0.5 ? "upright" : "reversed";
}

export function draw(
  spreadId: SpreadId,
  deck: Deck = defaultDeck,
  rng: Rng = Math.random,
): DrawResult {
  const spread = getSpread(spreadId);
  const pool = deck.allCards();

  if (pool.length < spread.positions.length) {
    throw new Error("Deck too small for spread");
  }

  const cards = spread.positions.map((position) => {
    const index = Math.floor(rng() * pool.length);
    const [card] = pool.splice(index, 1);
    return {
      cardId: card.id,
      orientation: pickOrientation(rng),
      positionId: position.id,
    };
  });

  return { cards };
}
