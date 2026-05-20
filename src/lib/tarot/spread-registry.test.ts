import { describe, expect, it } from "vitest";
import { getSpread } from "@/lib/tarot/spread-registry";

describe("getSpread", () => {
  it("three-card spread has stable past-present-future positions", () => {
    const spread = getSpread("three-card");

    expect(spread.positions).toHaveLength(3);
    expect(spread.positions.map((p) => p.id)).toEqual(["past", "present", "future"]);
    expect(spread.positions.map((p) => p.label)).toEqual(["过去", "现在", "未来"]);
  });
});
