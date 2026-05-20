const STORAGE_KEY = "tarot-last-reading-id";

export function saveLastReadingId(id: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, id);
}

export function loadLastReadingId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEY);
}

export function clearLastReadingId(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
