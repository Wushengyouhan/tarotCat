type StreamChunkJson = {
  choices?: Array<{ delta?: { content?: string | null } }>;
  error?: { message?: string };
};

export type ReadOpenAIChatStreamOptions = {
  signal?: AbortSignal;
  /** 连续多久未收到任何字节则视为超时（默认 30s） */
  idleTimeoutMs?: number;
};

const DEFAULT_IDLE_TIMEOUT_MS = 30_000;

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }
}

async function readWithIdleTimeout(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  idleTimeoutMs: number,
  signal?: AbortSignal,
): Promise<ReadableStreamReadResult<Uint8Array>> {
  throwIfAborted(signal);

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    };

    const onAbort = () => {
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
    };

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("解读响应超时，请稍后重试"));
    }, idleTimeoutMs);

    signal?.addEventListener("abort", onAbort, { once: true });

    reader.read().then(
      (result) => {
        cleanup();
        resolve(result);
      },
      (err) => {
        cleanup();
        reject(err);
      },
    );
  });
}

/**
 * 解析 OpenAI 兼容的 SSE 流（硅基流动 chat/completions stream=true）
 */
export async function readOpenAIChatStream(
  body: ReadableStream<Uint8Array> | null,
  onDelta: (text: string) => void,
  options?: ReadOpenAIChatStreamOptions,
): Promise<string> {
  if (!body) {
    throw new Error("响应体为空");
  }

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";
  const idleTimeoutMs = options?.idleTimeoutMs ?? DEFAULT_IDLE_TIMEOUT_MS;

  try {
    while (true) {
      const { done, value } = await readWithIdleTimeout(reader, idleTimeoutMs, options?.signal);
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(":")) continue;
        if (!trimmed.startsWith("data:")) continue;

        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") continue;

        let json: StreamChunkJson;
        try {
          json = JSON.parse(payload) as StreamChunkJson;
        } catch {
          continue;
        }

        if (json.error?.message) {
          throw new Error(json.error.message);
        }

        const chunk = json.choices?.[0]?.delta?.content;
        if (chunk) {
          full += chunk;
          onDelta(chunk);
        }
      }
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      // ignore cancel errors
    }
    reader.releaseLock();
  }

  return full.trim();
}
