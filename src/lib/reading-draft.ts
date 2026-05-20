import type { ReadingStartPayload } from "@/components/ReadingStartForm";

const STORAGE_KEY = "tarot-reading-draft";

export function saveReadingDraft(payload: ReadingStartPayload): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadReadingDraft(): ReadingStartPayload | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ReadingStartPayload;
    if (
      typeof parsed.question === "string" &&
      (parsed.spreadId === "single" || parsed.spreadId === "three-card")
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearReadingDraft(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
