---
name: bilingual-readme-sync
description: Keep a README and its English translation in sync by comparing section-level structure and flagging drift. Use when the user asks to update, check, or translate both language versions of a README.
---

# Bilingual README Sync

Keep a README and its English translation consistent. The skill compares section-level structure, flags drift, and produces an edit list instead of silently rewriting.

## When to Use

- The user updates one language version and wants the other updated.
- The user asks whether the two READMEs have drifted.

## How to Use

1. Extract the section headings from both files (`grep -n '^#' README.md README.en.md`).
2. Compare heading sequences. Differences are structural drift.
3. For each drift, map the changed section and translate or update it.
4. Produce an edit list first; apply edits only after user approval.

## Best Practices

- Keep section order identical across languages.
- Never translate code blocks, commands, or inline identifiers.
- Flag ambiguous wording instead of guessing.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Heading counts differ | One file gained a section | Align section order, then translate content |
| Same heading, different content | Translation outdated | Update the stale language version |
