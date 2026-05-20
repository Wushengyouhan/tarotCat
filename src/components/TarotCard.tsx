"use client";

import Image from "next/image";
import type { CardDefinition, Orientation } from "@/lib/tarot/types";

type TarotCardProps = {
  card: CardDefinition;
  orientation: Orientation;
  revealed: boolean;
  onReveal?: () => void;
  label?: string;
  size?: "default" | "compact";
};

export function TarotCard({
  card,
  orientation,
  revealed,
  onReveal,
  label,
  size = "default",
}: TarotCardProps) {
  const widthClass =
    size === "compact" ? "w-[min(26vw,96px)]" : "w-[min(72vw,220px)]";
  const orientationLabel = orientation === "upright" ? "正位" : "逆位";

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {label ? (
        <p className="text-sm font-medium tracking-wide text-[var(--color-gold)]">{label}</p>
      ) : null}
      <button
        type="button"
        onClick={revealed ? undefined : onReveal}
        disabled={revealed}
        className={`group relative aspect-[350/600] ${widthClass} [perspective:1000px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] disabled:cursor-default`}
        aria-label={revealed ? `${card.nameZh} ${orientationLabel}` : "点击翻开牌"}
      >
        <div
          className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
            revealed ? "[transform:rotateY(180deg)]" : ""
          } ${!revealed ? "motion-safe:animate-pulse" : ""}`}
        >
          <div className="absolute inset-0 overflow-hidden rounded-xl border-2 border-[var(--color-gold)]/50 bg-[var(--color-mystic-mid)] shadow-lg shadow-black/40 [backface-visibility:hidden]">
            <CardBack />
          </div>
          <div className="absolute inset-0 overflow-hidden rounded-xl border-2 border-[var(--color-gold)]/40 bg-[var(--color-mystic-deep)] shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <Image
              src={card.image}
              alt={card.nameZh}
              width={350}
              height={600}
              className={`h-full w-full object-cover ${orientation === "reversed" ? "rotate-180" : ""}`}
              priority
            />
          </div>
        </div>
      </button>
      {revealed ? (
        <div className="text-center">
          <p className="text-lg font-medium text-[var(--color-star)]">{card.nameZh}</p>
          <p className="text-xs text-[var(--color-gold)]">{orientationLabel}</p>
        </div>
      ) : (
        <p className="text-xs text-[var(--color-star)]/50">轻触牌面揭晓</p>
      )}
    </div>
  );
}

function CardBack() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-mystic-deep)] via-[var(--color-mystic-mid)] to-[var(--color-void)]">
      <div className="flex h-[70%] w-[70%] items-center justify-center rounded-full border border-[var(--color-gold)]/40">
        <span className="text-4xl text-[var(--color-gold)]/80">✦</span>
      </div>
    </div>
  );
}
