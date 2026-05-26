import { describe, expect, it } from "vitest";
import { buildInterpretMessages } from "@/lib/ai/build-interpret-prompt";

describe("buildInterpretMessages", () => {
  it("includes question and card positions", () => {
    const messages = buildInterpretMessages({
      question: "我该如何面对接下来的选择？",
      spreadId: "three-card",
      cards: [
        { positionLabel: "过去", cardNameZh: "愚者", orientation: "upright" },
        {
          positionLabel: "现在",
          cardNameZh: "魔术师",
          orientation: "reversed",
        },
        { positionLabel: "未来", cardNameZh: "女祭司", orientation: "upright" },
      ],
    });

    expect(messages[0].role).toBe("system");
    expect(messages[0].content).toContain("牌阵整体整合");
    expect(messages[0].content).toContain("🃏 牌意简述与基调");
    expect(messages[0].content).toContain("🎨 图像象征解读");
    expect(messages[1].content).toContain("我该如何面对接下来的选择？");
    expect(messages[1].content).toContain("过去");
    expect(messages[1].content).toContain("愚者");
    expect(messages[1].content).toContain("逆位");
  });
});
