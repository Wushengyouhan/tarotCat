import type { SpreadDefinition, SpreadId } from "@/lib/tarot/types";

const spreads: Record<SpreadId, SpreadDefinition> = {
  single: {
    id: "single",
    name: "单牌",
    positions: [{ id: "answer", label: "指引" }],
  },
  "three-card": {
    id: "three-card",
    name: "三牌阵",
    positions: [
      { id: "past", label: "过去" },
      { id: "present", label: "现在" },
      { id: "future", label: "未来" },
    ],
  },
};

export function getSpread(spreadId: SpreadId): SpreadDefinition {
  const spread = spreads[spreadId];
  if (!spread) {
    throw new Error(`Unknown spread: ${spreadId}`);
  }
  return spread;
}
