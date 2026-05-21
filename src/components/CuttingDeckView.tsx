"use client";

import { useEffect } from "react";
import { HexagramSigil } from "@/components/HexagramSigil";

/** 与 globals.css 中 tarot-cut-pile 动画时长一致 */
export const CUT_RITUAL_MS = 3200;

type CuttingDeckViewProps = {
  onComplete: () => void;
};

function CutPile({ variant, id }: { variant: "left" | "center" | "right"; id: string }) {
  return (
    <div className={`tarot-cut-pile tarot-cut-pile-${variant}`} aria-hidden>
      {[0, 1, 2].map((i) => (
        <div
          key={`${id}-${i}`}
          className="tarot-card-back tarot-cut-card absolute top-1/2 left-1/2"
          style={{
            transform: `translate(-50%, -50%) translateY(${(i - 1) * 3}px)`,
            zIndex: i,
          }}
        />
      ))}
    </div>
  );
}

/** 法阵上左 · 中 · 右三堆正放，等距排开后再合堆 */
export function CuttingDeckView({ onComplete }: CuttingDeckViewProps) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, CUT_RITUAL_MS);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex w-full flex-col items-center gap-10 py-8">
      <p className="text-center text-base tracking-wide text-[var(--color-gold)]">
        正在切牌……
      </p>
      <p className="max-w-sm shrink-0 px-2 text-center text-xs leading-relaxed text-[var(--color-star)]/55">
        在法阵上按左、中、右分成三堆正放，再合为一堆
      </p>

      <div className="tarot-ritual-stage tarot-cut-stage relative aspect-square w-full max-w-[260px]">
        <HexagramSigil />

        <div className="tarot-cut-grid">
          <div className="tarot-cut-cell">
            <div className="tarot-cut-slot" />
            <CutPile variant="left" id="l" />
          </div>
          <div className="tarot-cut-cell">
            <div className="tarot-cut-slot" />
            <CutPile variant="center" id="c" />
          </div>
          <div className="tarot-cut-cell">
            <div className="tarot-cut-slot" />
            <CutPile variant="right" id="r" />
          </div>
        </div>
      </div>
    </div>
  );
}
