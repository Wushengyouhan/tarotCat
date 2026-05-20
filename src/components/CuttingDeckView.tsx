"use client";

type CuttingDeckViewProps = {
  onComplete: () => void;
};

/** 两叠牌背：左右分开 → 交叉换位 → 回落合并，模拟实体切牌 */
export function CuttingDeckView({ onComplete }: CuttingDeckViewProps) {
  return (
    <div className="flex w-full flex-col items-center gap-12 py-8">
      <p className="max-w-sm shrink-0 px-2 text-center text-sm leading-relaxed text-[var(--color-star)]/70">
        在心中感受切点，把牌堆分成两半再交换——能量随之重组……
      </p>

      {/* 额外顶距：牌旋转时视觉上会偏高，避免压住说明文字 */}
      <div className="relative flex min-h-[12rem] w-full max-w-xs items-center justify-center px-2 pt-4 pb-6">
        <div className="relative h-40 w-full max-w-[220px]">
          <div
            className="tarot-cut-pile-left absolute top-1/2 flex aspect-[350/600] w-[4.25rem] -translate-y-1/2 items-stretch justify-center"
            style={{ left: "50%" }}
            aria-hidden
          >
            {[0, 1, 2].map((i) => (
              <div
                key={`l-${i}`}
                className="absolute aspect-[350/600] w-[4.25rem] rounded-lg border border-[var(--color-gold)]/45 bg-gradient-to-br from-[var(--color-mystic-glow)]/50 to-[var(--color-mystic-deep)] shadow-[0_0_20px_rgba(201,162,39,0.12)]"
                style={{
                  transform: `translateX(${(i - 1) * 5}px) rotate(${(i - 1) * 6}deg)`,
                  zIndex: i,
                }}
              />
            ))}
          </div>
          <div
            className="tarot-cut-pile-right absolute top-1/2 flex aspect-[350/600] w-[4.25rem] -translate-y-1/2 items-stretch justify-center"
            style={{ left: "50%" }}
            aria-hidden
          >
            {[0, 1, 2].map((i) => (
              <div
                key={`r-${i}`}
                className="absolute aspect-[350/600] w-[4.25rem] rounded-lg border border-[var(--color-gold)]/40 bg-gradient-to-br from-[var(--color-mystic-mid)] to-[var(--color-mystic-deep)] shadow-[0_0_18px_rgba(107,63,160,0.2)]"
                style={{
                  transform: `translateX(${(i - 1) * 5}px) rotate(${(i - 1) * -5}deg)`,
                  zIndex: i,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onComplete}
        className="rounded-lg border border-[var(--color-gold)]/50 px-6 py-2.5 text-sm text-[var(--color-gold)] transition hover:bg-[var(--color-gold)]/10"
      >
        完成切牌，开始翻牌
      </button>
    </div>
  );
}
