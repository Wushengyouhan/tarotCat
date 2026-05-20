import { afterEach, describe, expect, it, vi } from "vitest";
import { generateId } from "@/lib/generate-id";

describe("generateId", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a string id", () => {
    expect(generateId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it("falls back when randomUUID is unavailable (http:// IP 部署场景)", () => {
    vi.stubGlobal("crypto", {
      getRandomValues: (arr: Uint8Array) => {
        arr.fill(0xab);
        return arr;
      },
    });

    const id = generateId();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });
});
