import { createTarotInterpretationStream } from "@/lib/ai/siliconflow-client";
import type { InterpretErrorResponse, InterpretRequestBody } from "@/lib/ai/interpret-types";
import type { SpreadId } from "@/lib/tarot/types";
import { NextResponse } from "next/server";

function isInterpretBody(value: unknown): value is InterpretRequestBody {
  if (!value || typeof value !== "object") return false;
  const body = value as InterpretRequestBody;
  if (typeof body.question !== "string" || body.question.trim().length < 4) {
    return false;
  }
  if (body.spreadId !== "single" && body.spreadId !== "three-card") {
    return false;
  }
  if (!Array.isArray(body.cards) || body.cards.length === 0) return false;

  return body.cards.every(
    (c) =>
      typeof c.positionLabel === "string" &&
      typeof c.cardNameZh === "string" &&
      (c.orientation === "upright" || c.orientation === "reversed"),
  );
}

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    if (!isInterpretBody(json)) {
      return NextResponse.json<InterpretErrorResponse>(
        { error: "请求格式无效：需要 question、spreadId 与 cards" },
        { status: 400 },
      );
    }

    return await createTarotInterpretationStream({
      question: json.question.trim(),
      spreadId: json.spreadId as SpreadId,
      cards: json.cards,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "解读失败";
    const status = message.includes("SILICONFLOW_API_KEY") ? 503 : 502;
    return NextResponse.json<InterpretErrorResponse>({ error: message }, { status });
  }
}
