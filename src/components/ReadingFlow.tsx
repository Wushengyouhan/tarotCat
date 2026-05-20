"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useReducer, useRef } from "react";
import { CuttingDeckView } from "@/components/CuttingDeckView";
import { PageShell } from "@/components/PageShell";
import { ReadingCompleteView } from "@/components/ReadingCompleteView";
import { ShufflingView } from "@/components/ShufflingView";
import { TarotCard } from "@/components/TarotCard";
import { buildReadingRecord } from "@/lib/history/build-reading-record";
import { historyStore } from "@/lib/history/history-store";
import { defaultDeck } from "@/lib/tarot/deck";
import { draw } from "@/lib/tarot/draw-engine";
import { saveLastReadingId } from "@/lib/history/last-reading-id";
import { clearReadingDraft, loadReadingDraft } from "@/lib/reading-draft";
import { ReadingSession } from "@/lib/tarot/reading-session";
import { getSpread } from "@/lib/tarot/spread-registry";

const SHUFFLE_AUTO_MS = 2800;
const CUT_AUTO_MS = 3200;

export function ReadingFlow() {
  const router = useRouter();
  const sessionRef = useRef<ReadingSession | null>(null);
  const savedRef = useRef(false);
  const [, rerender] = useReducer((n: number) => n + 1, 0);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const draft = loadReadingDraft();
    if (!draft) {
      router.replace("/");
      return;
    }

    sessionRef.current = new ReadingSession({
      question: draft.question,
      spreadId: draft.spreadId,
      drawResult: draw(draft.spreadId),
    });
    rerender();
  }, [router]);

  useEffect(() => {
    const session = sessionRef.current;
    if (!session || session.getPhase() !== "shuffling") return;

    const timer = window.setTimeout(() => {
      session.finishShuffling();
      rerender();
    }, SHUFFLE_AUTO_MS);

    return () => window.clearTimeout(timer);
  });

  useEffect(() => {
    const session = sessionRef.current;
    if (!session || session.getPhase() !== "cutting") return;

    const timer = window.setTimeout(() => {
      session.finishCutting();
      rerender();
    }, CUT_AUTO_MS);

    return () => window.clearTimeout(timer);
  });

  const session = sessionRef.current;
  const spread = useMemo(
    () => (session ? getSpread(session.spreadId) : null),
    [session],
  );

  const phaseForSave = session?.getPhase();

  useEffect(() => {
    const current = sessionRef.current;
    if (!current || current.getPhase() !== "complete" || savedRef.current) return;

    const record = buildReadingRecord(current);
    historyStore.save(record);
    saveLastReadingId(record.id);
    savedRef.current = true;
  }, [phaseForSave]);

  if (!session || !spread) {
    return (
      <PageShell title="准备中" subtitle="牌堆正在回应你的问题……">
        <p className="text-sm text-[var(--color-star)]/60">请稍候</p>
      </PageShell>
    );
  }

  const phase = session.getPhase();
  const revealIndex = session.getCurrentRevealIndex();
  const currentDraw = session.drawResult.cards[revealIndex];
  const currentCard = currentDraw ? defaultDeck.getCardById(currentDraw.cardId) : null;
  const currentPosition = currentDraw
    ? spread.positions.find((p) => p.id === currentDraw.positionId)
    : null;

  function handleShuffleComplete() {
    sessionRef.current?.finishShuffling();
    rerender();
  }

  function handleCutComplete() {
    sessionRef.current?.finishCutting();
    rerender();
  }

  function handleReveal() {
    sessionRef.current?.revealNextCard();
    rerender();
  }

  function handleNewReading() {
    clearReadingDraft();
    router.push("/");
  }

  const progressLabel =
    session.totalCards > 1
      ? `第 ${Math.min(revealIndex + 1, session.totalCards)} / ${session.totalCards} 张`
      : null;

  return (
    <PageShell
      title={phase === "complete" ? "牌面解读" : "占卜进行中"}
      subtitle={`「${session.question}」`}
    >
      {phase === "shuffling" ? <ShufflingView onComplete={handleShuffleComplete} /> : null}

      {phase === "cutting" ? <CuttingDeckView onComplete={handleCutComplete} /> : null}

      {phase === "revealing" && currentDraw && currentCard && currentPosition ? (
        <div className="flex w-full flex-col items-center gap-4">
          {progressLabel ? (
            <p className="text-xs tracking-wide text-[var(--color-gold)]">{progressLabel}</p>
          ) : null}
          {revealIndex > 0 ? (
            <p className="text-center text-xs text-[var(--color-star)]/50">
              已翻开：
              {session.drawResult.cards.slice(0, revealIndex).map((d, i) => {
                const pos = spread.positions.find((p) => p.id === d.positionId);
                const c = defaultDeck.getCardById(d.cardId);
                return (
                  <span key={d.positionId}>
                    {i > 0 ? " · " : ""}
                    {pos?.label}
                    {c?.nameZh}
                  </span>
                );
              })}
            </p>
          ) : null}
          <TarotCard
            card={currentCard}
            orientation={currentDraw.orientation}
            revealed={false}
            onReveal={handleReveal}
            label={currentPosition.label}
            size={session.totalCards > 1 ? "compact" : "default"}
          />
        </div>
      ) : null}

      {phase === "complete" ? (
        <ReadingCompleteView session={session} onNewReading={handleNewReading} />
      ) : null}

      <Link
        href="/"
        className="mt-6 text-xs text-[var(--color-star)]/40 underline-offset-2 hover:text-[var(--color-star)]/60 hover:underline"
        onClick={() => clearReadingDraft()}
      >
        返回首页
      </Link>
    </PageShell>
  );
}
