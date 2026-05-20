import { buildInterpretMessages } from "@/lib/ai/build-interpret-prompt";
import type { InterpretRequestBody } from "@/lib/ai/interpret-types";

type ChatCompletionError = {
  error?: {
    message?: string;
  };
};

export function getSiliconFlowConfig() {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  const baseUrl = process.env.SILICONFLOW_BASE_URL ?? "https://api.siliconflow.cn/v1";
  const model = process.env.SILICONFLOW_MODEL ?? "deepseek-ai/DeepSeek-V4-Flash";

  return { apiKey, baseUrl, model };
}

export async function createTarotInterpretationStream(
  body: InterpretRequestBody,
): Promise<Response> {
  const { apiKey, baseUrl, model } = getSiliconFlowConfig();

  if (!apiKey) {
    throw new Error("未配置 SILICONFLOW_API_KEY");
  }

  const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
  const messages = buildInterpretMessages(body);

  const upstream = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature: 0.8,
      max_tokens: 1024,
    }),
  });

  if (!upstream.ok) {
    const data = (await upstream.json()) as ChatCompletionError;
    const message = data.error?.message ?? `硅基流动 API 错误 (${upstream.status})`;
    throw new Error(message);
  }

  if (!upstream.body) {
    throw new Error("流式响应为空");
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
