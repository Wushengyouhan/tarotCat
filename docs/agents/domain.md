# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root, or
- **`CONTEXT-MAP.md`** at the repo root if it exists — it points at one `CONTEXT.md` per context. Read each one relevant to the topic.
- **`docs/`** numbered decision docs (`01-*.md`, `02-*.md`, …) — architecture decisions (ADRs) and feature guides for the area you're about to work in.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The producer skill (`/grill-with-docs`) creates them lazily when terms or decisions actually get resolved.

## File structure

This repo uses a **flat `docs/` layout** (human docs) plus **`docs/agents/`** (Cursor Agent 配置):

```
/
├── CONTEXT.md
├── docs/
│   ├── 01-tech-stack.md           ← ADR-0001
│   ├── 02-tarot-deck-assets.md    ← ADR-0002
│   ├── 03-pwa.md                  ← PWA 运维说明
│   └── agents/                    ← issue tracker、triage、本文件
└── src/
```

New decisions: add the next sequential file (`04-slug.md`). Keep the `ADR-00NN` heading inside the doc for cross-references.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/grill-with-docs`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0002 (tarot deck assets) — but worth reopening because…_
