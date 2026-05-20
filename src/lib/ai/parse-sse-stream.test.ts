import { describe, expect, it } from "vitest";
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
});
