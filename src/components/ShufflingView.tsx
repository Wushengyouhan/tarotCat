"use client";

import { useEffect } from "react";
import { HexagramSigil } from "@/components/HexagramSigil";

/** 略长于最长单牌打散动画，保证仪式播完 */
export const SHUFFLE_RITUAL_MS = 3400;

const SCATTER_CARD_COUNT = 8;

type ShufflingViewProps = {
  onComplete: () => void;
};

export function ShufflingView({ onComplete }: ShufflingViewProps) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, SHUFFLE_RITUAL_MS);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex w-full flex-col items-center gap-10 py-8">
      <p className="text-center text-base tracking-wide text-[var(--color-gold)]">
        正在洗牌……
      </p>
      <p className="max-w-xs px-2 text-center text-xs text-[var(--color-star)]/55">
        在六芒星法阵上随机打散，让牌序归于混沌
      </p>

      <div className="tarot-ritual-stage tarot-shuffle-stage relative aspect-square w-full max-w-[260px]">
        <HexagramSigil />
        <div className="tarot-shuffle-scatter">
          {Array.from({ length: SCATTER_CARD_COUNT }, (_, index) => (
            <div
              key={index}
              className={`tarot-card-back tarot-shuffle-scatter-card tarot-shuffle-scatter-card-${index}`}
              aria-hidden
            />
          ))}
        </div>
      </div>
    </div>
  );
}
