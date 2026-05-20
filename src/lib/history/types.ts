import type { Orientation, SpreadId } from "@/lib/tarot/types";

export type ReadingHistoryCard = {
  positionId: string;
  positionLabel: string;
  cardId: string;
  cardNameZh: string;
  orientation: Orientation;
  meaning: string;
};

export type ReadingHistoryRecord = {
  id: string;
  createdAt: string;
  question: string;
  spreadId: SpreadId;
  spreadName: string;
  cards: ReadingHistoryCard[];
  aiText?: string;
};
