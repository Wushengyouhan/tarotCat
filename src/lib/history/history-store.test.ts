import { beforeEach, describe, expect, it } from "vitest";
import { HistoryStore, HISTORY_MAX_RECORDS } from "@/lib/history/history-store";
import type { ReadingHistoryRecord } from "@/lib/history/types";

function makeRecord(id: string, createdAt: string): ReadingHistoryRecord {
  return {
    id,
    createdAt,
    question: `问题 ${id}`,
    spreadId: "single",
    spreadName: "单牌",
    cards: [
      {
        positionId: "answer",
        positionLabel: "指引",
        cardId: "m00",
        cardNameZh: "愚者",
        orientation: "upright",
        meaning: "测试牌义",
      },
    ],
  };
}

describe("HistoryStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("save then list contains the record", () => {
    const store = new HistoryStore();
    const record = makeRecord("a", "2026-05-19T10:00:00.000Z");
    store.save(record);

    expect(store.list()).toHaveLength(1);
    expect(store.list()[0].id).toBe("a");
  });

  it("get returns a saved record", () => {
    const store = new HistoryStore();
    const record = makeRecord("b", "2026-05-19T11:00:00.000Z");
    store.save(record);

    expect(store.get("b")?.question).toBe("问题 b");
  });

  it("prune keeps only the newest max records", () => {
    const store = new HistoryStore();
    for (let i = 0; i < HISTORY_MAX_RECORDS + 5; i += 1) {
      const day = String(i).padStart(2, "0");
      store.save(makeRecord(`id-${i}`, `2026-05-${day}T12:00:00.000Z`));
    }

    const list = store.list();
    expect(list.length).toBeLessThanOrEqual(HISTORY_MAX_RECORDS);
    expect(list.some((r) => r.id === "id-0")).toBe(false);
    expect(list.some((r) => r.id === `id-${HISTORY_MAX_RECORDS + 4}`)).toBe(true);
  });

  it("clearAll removes all records", () => {
    const store = new HistoryStore();
    store.save(makeRecord("a", "2026-05-19T10:00:00.000Z"));
    store.save(makeRecord("b", "2026-05-19T11:00:00.000Z"));
    store.clearAll();
    expect(store.list()).toHaveLength(0);
  });
});
