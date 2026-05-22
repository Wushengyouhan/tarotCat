"use client";

import { useEffect, useRef, useState } from "react";
import { historyStore } from "@/lib/history/history-store";
import { loadLastReadingId } from "@/lib/history/last-reading-id";
import type { InterpretRequestBody } from "@/lib/ai/interpret-types";
import { readOpenAIChatStream } from "@/lib/ai/parse-sse-stream";
import type { ReadingSession } from "@/lib/tarot/reading-session";
import { defaultDeck } from "@/lib/tarot/deck";
import { getSpread } from "@/lib/tarot/spread-registry";

type AiDeepReadProps = {
  session: ReadingSession;
};

const REQUEST_TIMEOUT_MS = 120_000;
const STREAM_IDLE_TIMEOUT_MS = 30_000;

function buildRequestBody(session: ReadingSession): InterpretRequestBody {
  const spread = getSpread(session.spreadId);
  return {
    question: session.question,
    spreadId: session.spreadId,
    cards: session.drawResult.cards.map((drawn) => {
      const position = spread.positions.find((p) => p.id === drawn.positionId);
      const card = defaultDeck.getCardById(drawn.cardId);
      return {
        positionLabel: position?.label ?? drawn.positionId,
        cardNameZh: card?.nameZh ?? drawn.cardId,
        orientation: drawn.orientation,
      };
    }),
  };
}

function formatInterpretError(err: unknown, userCancelled: boolean): string {
  if (userCancelled) return "";
  if (err instanceof DOMException && err.name === "AbortError") {
    return "解读超时，请稍后重试";
  }
  if (err instanceof Error) {
    if (err.name === "TimeoutError" || err.message.includes("timeout")) {
      return "解读超时，请稍后重试";
    }
    return err.message;
  }
  return "解读失败";
}

export function AiDeepRead({ session }: AiDeepReadProps) {
  const [status, setStatus] = useState<"idle" | "streaming" | "done" | "error">("idle");
  const [interpretation, setInterpretation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const outputRef = useRef<HTMLElement>(null);
  /** 合并 SSE 碎片，避免每个 token 都触发整段重渲染 */
  const pendingDeltaRef = useRef("");
  const rafIdRef = useRef<number | null>(null);
  const lastScrollAtRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const userCancelledRef = useRef(false);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const flushPendingDeltas = (sync: boolean) => {
    if (rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    const merged = pendingDeltaRef.current;
    pendingDeltaRef.current = "";
    if (!merged) return;

    setInterpretation((prev) => prev + merged);

    if (sync) {
      outputRef.current?.scrollIntoView({ behavior: "auto", block: "nearest" });
      lastScrollAtRef.current = Date.now();
      return;
    }

    const now = Date.now();
    if (now - lastScrollAtRef.current >= 160) {
      lastScrollAtRef.current = now;
      outputRef.current?.scrollIntoView({ behavior: "auto", block: "nearest" });
    }
  };

  const scheduleFlush = () => {
    if (rafIdRef.current != null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      flushPendingDeltas(false);
    });
  };

  function handleCancel() {
    userCancelledRef.current = true;
    abortRef.current?.abort();
  }

  async function handleInterpret() {
    abortRef.current?.abort();
    userCancelledRef.current = false;

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    setStatus("streaming");
    setInterpretation("");
    setError(null);
    pendingDeltaRef.current = "";
    if (rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRequestBody(session)),
        signal: controller.signal,
      });

      if (requestId !== requestIdRef.current) return;

      const contentType = response.headers.get("content-type") ?? "";

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "AI 解读请求失败");
      }

      if (!contentType.includes("text/event-stream")) {
        throw new Error("服务端未返回流式响应");
      }

      const full = await readOpenAIChatStream(
        response.body,
        (delta) => {
          pendingDeltaRef.current += delta;
          scheduleFlush();
        },
        { signal: controller.signal, idleTimeoutMs: STREAM_IDLE_TIMEOUT_MS },
      );

      if (requestId !== requestIdRef.current) return;

      flushPendingDeltas(true);

      if (!full) {
        throw new Error("未收到解读内容");
      }

      setStatus("done");

      const readingId = loadLastReadingId();
      if (readingId) {
        historyStore.updateAiText(readingId, full);
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      const cancelled = userCancelledRef.current;
      userCancelledRef.current = false;

      if (cancelled) {
        setStatus("idle");
        setInterpretation("");
        return;
      }

      setStatus("error");
      setError(formatInterpretError(err, false));
      setInterpretation("");
    } finally {
      clearTimeout(timeoutId);
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    }
  }

  const isActive = status === "streaming" || status === "done";
  const waitingForFirstToken = status === "streaming" && interpretation.length === 0;

  return (
    <section className="w-full">
      {status === "error" && error ? (
        <p
          role="alert"
          className="mb-3 rounded-lg border border-red-400/30 bg-red-950/40 px-3 py-2 text-center text-sm text-red-200/90"
        >
          {error}
        </p>
      ) : null}

      {isActive ? (
        <article
          ref={outputRef}
          className="mb-4 min-h-[4.5rem] text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-star)]/90"
          aria-live={status === "done" ? "polite" : "off"}
          aria-busy={status === "streaming"}
        >
          {waitingForFirstToken ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <span
                className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-gold)]/30 border-t-[var(--color-gold)]"
                aria-hidden
              />
              <p className="text-center text-sm text-[var(--color-star)]/70">
                牌灵正在编织话语……
              </p>
              <button
                type="button"
                onClick={handleCancel}
                className="text-xs text-[var(--color-star)]/45 underline-offset-2 hover:text-[var(--color-star)]/65 hover:underline"
              >
                取消解读
              </button>
            </div>
          ) : (
            <>
              {interpretation}
              {status === "streaming" ? (
                <span
                  className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-[var(--color-gold)] align-middle"
                  aria-hidden
                />
              ) : null}
            </>
          )}
        </article>
      ) : null}

      {status === "streaming" && !waitingForFirstToken ? (
        <button
          type="button"
          onClick={handleCancel}
          className="mb-3 w-full text-center text-xs text-[var(--color-star)]/45 underline-offset-2 hover:text-[var(--color-star)]/65 hover:underline"
        >
          取消解读
        </button>
      ) : null}

      {status !== "streaming" && status !== "done" ? (
        <button
          type="button"
          onClick={handleInterpret}
          className="w-full rounded-lg border border-[var(--color-gold)]/50 py-3 text-base text-[var(--color-gold)] transition hover:bg-[var(--color-gold)]/10 disabled:opacity-50"
        >
          {status === "error" ? "重试 AI 深读" : "开启 AI 深读"}
        </button>
      ) : null}

      {status === "done" ? (
        <p className="text-center text-xs text-[var(--color-star)]/45">解读已保存至本机历史</p>
      ) : null}
    </section>
  );
}
