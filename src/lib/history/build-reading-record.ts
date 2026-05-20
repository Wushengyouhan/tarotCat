import { generateId } from "@/lib/generate-id";
import { getMeaning } from "@/lib/tarot/card-meanings";
import { defaultDeck } from "@/lib/tarot/deck";
import type { ReadingSession } from "@/lib/tarot/reading-session";
import { getSpread } from "@/lib/tarot/spread-registry";
import type { ReadingHistoryRecord } from "@/lib/history/types";

export function buildReadingRecord(session: ReadingSession): ReadingHistoryRecord {
  const spread = getSpread(session.spreadId);

  const cards = session.drawResult.cards.map((drawn) => {
    const position = spread.positions.find((p) => p.id === drawn.positionId);
    const card = defaultDeck.getCardById(drawn.cardId);
    if (!position || !card) {
      throw new Error(`Invalid draw data for ${drawn.cardId}`);
    }

    return {
      positionId: drawn.positionId,
      positionLabel: position.label,
      cardId: drawn.cardId,
      cardNameZh: card.nameZh,
      orientation: drawn.orientation,
      meaning: getMeaning(drawn.cardId, drawn.orientation),
    };
  });

  return {
    id: generateId(),
    createdAt: new Date().toISOString(),
    question: session.question,
    spreadId: session.spreadId,
    spreadName: spread.name,
    cards,
  };
}
