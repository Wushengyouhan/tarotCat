import type { ReadingHistoryRecord } from "@/lib/history/types";

const STORAGE_KEY = "tarot-reading-history";
export const HISTORY_MAX_RECORDS = 30;

function isRecord(value: unknown): value is ReadingHistoryRecord {
  if (!value || typeof value !== "object") return false;
  const r = value as ReadingHistoryRecord;
  return (
    typeof r.id === "string" &&
    typeof r.createdAt === "string" &&
    typeof r.question === "string" &&
    (r.spreadId === "single" || r.spreadId === "three-card") &&
    typeof r.spreadName === "string" &&
    Array.isArray(r.cards)
  );
}

export class HistoryStore {
  private readAll(): ReadingHistoryRecord[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isRecord);
    } catch {
      return [];
    }
  }

  private writeAll(records: ReadingHistoryRecord[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  prune(records: ReadingHistoryRecord[], max = HISTORY_MAX_RECORDS): ReadingHistoryRecord[] {
    if (records.length <= max) return records;
    return records
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, max);
  }

  save(record: ReadingHistoryRecord): void {
    const existing = this.readAll();
    const next = this.prune([record, ...existing.filter((r) => r.id !== record.id)]);
    this.writeAll(next);
  }

  list(): ReadingHistoryRecord[] {
    return this.readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  get(id: string): ReadingHistoryRecord | undefined {
    return this.readAll().find((r) => r.id === id);
  }

  updateAiText(id: string, aiText: string): void {
    const records = this.readAll();
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) return;

    records[index] = { ...records[index], aiText };
    this.writeAll(records);
  }

  /** 清空本机全部占卜历史 */
  clearAll(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const historyStore = new HistoryStore();
