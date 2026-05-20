"use client";

import { AiDeepRead } from "@/components/AiDeepRead";
import { TarotCard } from "@/components/TarotCard";
import { getMeaning } from "@/lib/tarot/card-meanings";
import { defaultDeck } from "@/lib/tarot/deck";
import type { ReadingSession } from "@/lib/tarot/reading-session";
import { getSpread } from "@/lib/tarot/spread-registry";

type ReadingCompleteViewProps = {
  session: ReadingSession;
  onNewReading: () => void;
};

export function ReadingCompleteView({ session, onNewReading }: ReadingCompleteViewProps) {
  const spread = getSpread(session.spreadId);
  const isCompact = session.totalCards > 1;

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className={
          isCompact
            ? "grid w-full grid-cols-3 gap-2 sm:gap-3"
            : "flex w-full flex-col items-center"
        }
      >
        {session.drawResult.cards.map((drawn) => {
          const card = defaultDeck.getCardById(drawn.cardId);
          const position = spread.positions.find((p) => p.id === drawn.positionId);
          if (!card || !position) return null;

          return (
            <TarotCard
              key={drawn.positionId}
              card={card}
              orientation={drawn.orientation}
              revealed
              label={position.label}
              size={isCompact ? "compact" : "default"}
            />
          );
        })}
      </div>

      <div className="flex w-full flex-col gap-4">
        {session.drawResult.cards.map((drawn) => {
          const card = defaultDeck.getCardById(drawn.cardId);
          const position = spread.positions.find((p) => p.id === drawn.positionId);
          if (!card || !position) return null;

          return (
            <article
              key={`meaning-${drawn.positionId}`}
              className="w-full rounded-xl border border-[var(--color-mystic-glow)]/30 bg-[var(--color-mystic-deep)]/80 px-4 py-4 text-sm leading-relaxed text-[var(--color-star)]/90"
            >
              <h2 className="mb-1 text-xs font-medium tracking-wide text-[var(--color-gold)]">
                {position.label} · {card.nameZh}
                <span className="ml-2 text-[var(--color-star)]/50">
                  {drawn.orientation === "upright" ? "正位" : "逆位"}
                </span>
              </h2>
              <p>{getMeaning(drawn.cardId, drawn.orientation)}</p>
            </article>
          );
        })}
      </div>

      <AiDeepRead session={session} />

      <button
        type="button"
        onClick={onNewReading}
        className="w-full rounded-lg bg-gradient-to-r from-[var(--color-mystic-glow)] to-[var(--color-mystic-mid)] px-6 py-3.5 text-base font-medium text-[var(--color-star)]"
      >
        开始新占卜
      </button>
    </div>
  );
}
