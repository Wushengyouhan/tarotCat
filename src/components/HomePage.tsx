"use client";

import { useRouter } from "next/navigation";
import {
  ReadingStartForm,
  type ReadingStartPayload,
} from "@/components/ReadingStartForm";
import { PageShell } from "@/components/PageShell";
import { SiteNav } from "@/components/SiteNav";
import { saveReadingDraft } from "@/lib/reading-draft";

export function HomePage() {
  const router = useRouter();

  function handleSubmit(payload: ReadingStartPayload) {
    saveReadingDraft(payload);
    const search =
      typeof window !== "undefined" ? window.location.search : "";
    router.push(search ? `/reading${search}` : "/reading");
  }

  return (
    <PageShell
      title="聆听牌面的低语"
      subtitle="写下问题，选择牌阵，让卡牌为你指引"
    >
      <SiteNav />
      <ReadingStartForm onSubmit={handleSubmit} />
    </PageShell>
  );
}
