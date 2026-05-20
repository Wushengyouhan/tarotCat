"use client";

type ShufflingViewProps = {
  onComplete: () => void;
};

export function ShufflingView({ onComplete }: ShufflingViewProps) {
  return (
    <div className="flex w-full flex-col items-center gap-8 py-6">
      <p className="text-center text-sm text-[var(--color-star)]/70">
        将意念注入牌堆，让卡牌感知你的问题……
      </p>
      <div className="relative flex h-36 w-full max-w-xs items-center justify-center">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="absolute aspect-[350/600] w-16 animate-pulse rounded-lg border border-[var(--color-gold)]/40 bg-gradient-to-br from-[var(--color-mystic-mid)] to-[var(--color-mystic-deep)] shadow-lg"
            style={{
              left: `calc(50% + ${(index - 1) * 28}px)`,
              transform: `translateX(-50%) rotate(${(index - 1) * 8}deg)`,
              animationDelay: `${index * 0.15}s`,
            }}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onComplete}
        className="rounded-lg border border-[var(--color-gold)]/50 px-6 py-2.5 text-sm text-[var(--color-gold)] transition hover:bg-[var(--color-gold)]/10"
      >
        完成洗牌，开始切牌
      </button>
    </div>
  );
}
