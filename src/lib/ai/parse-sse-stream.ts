type StreamChunkJson = {
  choices?: Array<{ delta?: { content?: string | null } }>;
  error?: { message?: string };
};

/**
 * 解析 OpenAI 兼容的 SSE 流（硅基流动 chat/completions stream=true）
 */
export async function readOpenAIChatStream(
  body: ReadableStream<Uint8Array> | null,
  onDelta: (text: string) => void,
): Promise<string> {
  if (!body) {
    throw new Error("响应体为空");
  }

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
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

  return full.trim();
}
