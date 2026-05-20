"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { SiteNav } from "@/components/SiteNav";
import { historyStore } from "@/lib/history/history-store";
import { clearLastReadingId } from "@/lib/history/last-reading-id";
import type { ReadingHistoryRecord } from "@/lib/history/types";

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryListPage() {
  const [records, setRecords] = useState<ReadingHistoryRecord[]>([]);

  useEffect(() => {
    setRecords(historyStore.list());
  }, []);

  const handleClearAll = useCallback(() => {
    if (
      !window.confirm(
        "确定清除全部占卜历史吗？数据仅存于本机，清除后无法恢复。",
      )
    ) {
      return;
    }
    historyStore.clearAll();
    clearLastReadingId();
    setRecords([]);
  }, []);

  return (
    <PageShell title="占卜历史" subtitle="本机保存的最近 30 次占卜">
      <SiteNav />

      {records.length > 0 ? (
        <div className="mb-4 flex w-full justify-end">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-amber-200/75 underline-offset-2 hover:text-amber-200 hover:underline"
          >
            清除全部历史
          </button>
        </div>
      ) : null}

      {records.length === 0 ? (
        <p className="text-center text-sm text-[var(--color-star)]/55">
          还没有占卜记录。
          <Link href="/" className="ml-1 text-[var(--color-gold)] underline-offset-2 hover:underline">
            去抽第一张牌
          </Link>
        </p>
      ) : (
        <ul className="flex w-full flex-col gap-3">
          {records.map((record) => (
            <li key={record.id}>
              <Link
                href={`/history/${record.id}`}
                className="block rounded-lg border border-[var(--color-mystic-glow)]/25 bg-[var(--color-mystic-deep)]/60 px-4 py-3 transition hover:border-[var(--color-gold)]/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[var(--color-gold)]">{record.spreadName}</span>
                  <time className="text-[10px] text-[var(--color-star)]/40">
                    {formatWhen(record.createdAt)}
                  </time>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-[var(--color-star)]/85">
                  {record.question}
                </p>
                <p className="mt-2 text-xs text-[var(--color-star)]/45">
                  {record.cards.map((c) => c.cardNameZh).join(" · ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/"
        className="mt-8 rounded-lg border border-[var(--color-gold)]/40 px-6 py-2.5 text-sm text-[var(--color-gold)]"
      >
        开始新占卜
      </Link>
    </PageShell>
  );
}
