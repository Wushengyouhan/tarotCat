"use client";

import { useState } from "react";

export type SpreadChoice = "single" | "three-card";

export type ReadingStartPayload = {
  question: string;
  spreadId: SpreadChoice;
};

type ReadingStartFormProps = {
  onSubmit?: (payload: ReadingStartPayload) => void;
};

const MIN_QUESTION_LENGTH = 4;

export function ReadingStartForm({ onSubmit }: ReadingStartFormProps) {
  const [question, setQuestion] = useState("");
  const [spreadId, setSpreadId] = useState<SpreadChoice>("single");
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = question.trim();

    if (trimmed.length < MIN_QUESTION_LENGTH) {
      setMessage(`请至少写下 ${MIN_QUESTION_LENGTH} 个字的问题。`);
      return;
    }

    setMessage(null);
    onSubmit?.({ question: trimmed, spreadId });
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="question" className="text-sm font-medium text-[var(--color-gold)]">
          你的问题
        </label>
        <p className="text-xs leading-relaxed text-[var(--color-star)]/70">
          在心中默念你的问题，然后将其写下。越具体，牌面越能回应你。
        </p>
        <textarea
          id="question"
          name="question"
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="例如：我该如何面对接下来的选择？"
          className="w-full resize-none rounded-lg border border-[var(--color-mystic-glow)]/40 bg-[var(--color-mystic-deep)]/80 px-4 py-3 text-[var(--color-star)] placeholder:text-[var(--color-star)]/35 focus:border-[var(--color-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]/50"
          autoComplete="off"
        />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-[var(--color-gold)]">选择牌阵</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SpreadOption
            id="spread-single"
            name="spread"
            value="single"
            checked={spreadId === "single"}
            onChange={() => setSpreadId("single")}
            title="单牌"
            description="今日指引 · 一问一牌"
          />
          <SpreadOption
            id="spread-three"
            name="spread"
            value="three-card"
            checked={spreadId === "three-card"}
            onChange={() => setSpreadId("three-card")}
            title="三牌阵"
            description="过去 · 现在 · 未来"
          />
        </div>
      </fieldset>

      {message ? (
        <p role="alert" className="text-sm text-amber-300/90">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        className="rounded-lg bg-gradient-to-r from-[var(--color-mystic-glow)] to-[var(--color-mystic-mid)] px-6 py-3.5 text-base font-medium text-[var(--color-star)] shadow-lg shadow-[var(--color-mystic-glow)]/25 transition hover:brightness-110 active:scale-[0.98]"
      >
        开始占卜
      </button>
    </form>
  );
}

type SpreadOptionProps = {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
};

function SpreadOption({
  id,
  name,
  value,
  checked,
  onChange,
  title,
  description,
}: SpreadOptionProps) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer flex-col gap-1 rounded-lg border px-4 py-3 transition ${
        checked
          ? "border-[var(--color-gold)] bg-[var(--color-mystic-mid)]/60 shadow-[0_0_20px_rgb(201_162_39_/15%)]"
          : "border-[var(--color-mystic-glow)]/30 bg-[var(--color-mystic-deep)]/50 hover:border-[var(--color-mystic-glow)]/50"
      }`}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="font-medium text-[var(--color-star)]">{title}</span>
      <span className="text-xs text-[var(--color-star)]/60">{description}</span>
    </label>
  );
}
