import type { Orientation, SpreadId } from "@/lib/tarot/types";

export type InterpretCardInput = {
  positionLabel: string;
  cardNameZh: string;
  orientation: Orientation;
};

export type InterpretRequestBody = {
  question: string;
  spreadId: SpreadId;
  cards: InterpretCardInput[];
};

export type InterpretSuccessResponse = {
  interpretation: string;
};

export type InterpretErrorResponse = {
  error: string;
};
