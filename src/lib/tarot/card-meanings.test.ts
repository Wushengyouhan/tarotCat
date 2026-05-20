import { describe, expect, it } from "vitest";
import { getMeaning } from "@/lib/tarot/card-meanings";

describe("getMeaning", () => {
  it("returns non-empty Chinese text for known card upright", () => {
    const text = getMeaning("m00", "upright");
    expect(text.length).toBeGreaterThan(4);
    expect(text).not.toBe("牌义暂未收录。");
  });

  it("returns different text for reversed vs upright", () => {
    const upright = getMeaning("m01", "upright");
    const reversed = getMeaning("m01", "reversed");
    expect(upright).not.toBe(reversed);
  });
});
