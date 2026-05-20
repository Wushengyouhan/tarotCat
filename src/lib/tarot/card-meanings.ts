import meaningsData from "@/data/tarot/meanings.json";
import type { Orientation } from "@/lib/tarot/types";

type MeaningEntry = {
  upright: string;
  reversed: string;
};

const meanings = meaningsData as Record<string, MeaningEntry>;

export function getMeaning(cardId: string, orientation: Orientation): string {
  const entry = meanings[cardId];
  if (!entry) {
    return "牌义暂未收录。";
  }
  return orientation === "upright" ? entry.upright : entry.reversed;
}
