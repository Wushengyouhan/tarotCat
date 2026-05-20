import Link from "next/link";

export function SiteNav() {
  return (
    <nav className="mb-6 flex w-full max-w-md justify-center gap-6 text-xs">
      <Link
        href="/"
        className="text-[var(--color-star)]/50 transition hover:text-[var(--color-gold)]"
      >
        首页
      </Link>
      <Link
        href="/history"
        className="text-[var(--color-star)]/50 transition hover:text-[var(--color-gold)]"
      >
        占卜历史
      </Link>
    </nav>
  );
}
