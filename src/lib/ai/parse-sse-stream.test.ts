import { afterEach, describe, expect, it, vi } from "vitest";
import { readOpenAIChatStream } from "@/lib/ai/parse-sse-stream";

function sse(lines: string[]): ReadableStream<Uint8Array> {
  const text = lines.join("\n");
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text));
      controller.close();
    },
  });
}

describe("readOpenAIChatStream", () => {
  it("accumulates delta content from SSE lines", async () => {
    const deltas: string[] = [];
    const full = await readOpenAIChatStream(
      sse([
        'data: {"choices":[{"delta":{"content":"星"}}]}',
        "",
        'data: {"choices":[{"delta":{"content":"光"}}]}',
        "",
        "data: [DONE]",
      ]),
      (text) => deltas.push(text),
    );

    expect(full).toBe("星光");
    expect(deltas).toEqual(["星", "光"]);
  });

  it("rejects when no bytes arrive within idle timeout", async () => {
    vi.useFakeTimers();

    const stream = new ReadableStream<Uint8Array>({
      start() {
        // never enqueue — simulates hung upstream
      },
    });

    const readPromise = readOpenAIChatStream(stream, () => undefined, {
      idleTimeoutMs: 50,
    });

    const assertion = expect(readPromise).rejects.toThrow("解读响应超时");
    await vi.advanceTimersByTimeAsync(60);
    await assertion;

    vi.useRealTimers();
  });
});

afterEach(() => {
  vi.useRealTimers();
});
