import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export function PageShell({ children, title, subtitle }: PageShellProps) {
  return (
    <main className="stars-bg flex min-h-dvh flex-col items-center px-4 pb-10 pt-[max(2.5rem,env(safe-area-inset-top))]">
      {(title || subtitle) && (
        <header className="mb-8 flex w-full max-w-md flex-col items-center gap-2 text-center">
          <p className="text-xs tracking-[0.35em] text-[var(--color-gold-dim)] uppercase">
            ✦ 塔罗占卜 ✦
          </p>
          {title ? (
            <h1
              className="text-2xl font-semibold tracking-wide text-[var(--color-star)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="text-sm text-[var(--color-star)]/55">{subtitle}</p>
          ) : null}
        </header>
      )}
      <div className="flex w-full max-w-md flex-1 flex-col items-center">{children}</div>
      <footer className="mt-auto pt-10 text-center text-[10px] text-[var(--color-star)]/30">
        韦特塔罗 · 仅供娱乐与自我反思
      </footer>
    </main>
  );
}
