"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { SiteNav } from "@/components/SiteNav";
import { TarotCard } from "@/components/TarotCard";
import { historyStore } from "@/lib/history/history-store";
import type { ReadingHistoryRecord } from "@/lib/history/types";
import { defaultDeck } from "@/lib/tarot/deck";

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [record, setRecord] = useState<ReadingHistoryRecord | null>(null);

  useEffect(() => {
    const found = historyStore.get(params.id);
    if (!found) {
      router.replace("/history");
      return;
    }
    setRecord(found);
  }, [params.id, router]);

  if (!record) {
    return (
      <PageShell title="加载中">
        <p className="text-sm text-[var(--color-star)]/50">请稍候</p>
      </PageShell>
    );
  }

  const isCompact = record.cards.length > 1;

  return (
    <PageShell title="历史详情" subtitle={`「${record.question}」`}>
      <SiteNav />

      <p className="mb-4 text-center text-xs text-[var(--color-star)]/45">
        {record.spreadName} · {formatWhen(record.createdAt)}
      </p>

      <div
        className={
          isCompact
            ? "mb-6 grid w-full grid-cols-3 gap-2"
            : "mb-6 flex w-full justify-center"
        }
      >
        {record.cards.map((item) => {
          const card = defaultDeck.getCardById(item.cardId);
          if (!card) return null;
          return (
            <TarotCard
              key={item.positionId}
              card={card}
              orientation={item.orientation}
              revealed
              label={item.positionLabel}
              size={isCompact ? "compact" : "default"}
            />
          );
        })}
      </div>

      <div className="flex w-full flex-col gap-4">
        {record.cards.map((item) => (
          <article
            key={`${item.positionId}-meaning`}
            className="rounded-xl border border-[var(--color-mystic-glow)]/30 bg-[var(--color-mystic-deep)]/80 px-4 py-4 text-sm leading-relaxed text-[var(--color-star)]/90"
          >
            <h2 className="mb-1 text-xs font-medium text-[var(--color-gold)]">
              {item.positionLabel} · {item.cardNameZh}
              <span className="ml-2 text-[var(--color-star)]/50">
                {item.orientation === "upright" ? "正位" : "逆位"}
              </span>
            </h2>
            <p>{item.meaning}</p>
          </article>
        ))}
      </div>

      {record.aiText ? (
        <article className="w-full rounded-xl border border-[var(--color-gold)]/25 bg-[var(--color-mystic-deep)]/50 px-4 py-4 text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-star)]/90">
          <h2 className="mb-2 text-xs font-medium text-[var(--color-gold)]">AI 深读</h2>
          <p>{record.aiText}</p>
        </article>
      ) : null}

      <div className="mt-8 flex w-full flex-col gap-3">
        <Link
          href="/"
          className="w-full rounded-lg bg-gradient-to-r from-[var(--color-mystic-glow)] to-[var(--color-mystic-mid)] py-3.5 text-center text-base font-medium text-[var(--color-star)]"
        >
          开始新占卜
        </Link>
        <Link
          href="/history"
          className="text-center text-xs text-[var(--color-star)]/45 hover:text-[var(--color-star)]/70"
        >
          返回历史列表
        </Link>
      </div>
    </PageShell>
  );
}
