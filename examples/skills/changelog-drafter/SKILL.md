---
name: changelog-drafter
description: Draft a Keep a Changelog style changelog entry from recent commits, grouped by type with version linking. Use when the user asks to write, update, or generate a changelog entry.
---

# Changelog Drafter

Draft a Keep a Changelog–style entry from recent commits. The output groups changes by type, links the version, and follows the project's changelog conventions.

## When to Use

- The user asks to write or update a changelog.
- A release is being prepared and the changelog needs an entry.

## How to Use

1. Read recent commits: `git log --oneline -20`.
2. Classify each commit: Added, Changed, Fixed, Removed, Docs, Chores.
3. Draft the entry under `## [Unreleased]` or the next version heading.
4. Link the version heading to the compare URL (Keep a Changelog convention).

## Best Practices

- One line per change, imperative mood, no trailing period.
- Put breaking changes in a dedicated subsection.
- Never invent versions or dates.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Commit messages are vague | History is not conventional | Ask the user for clarification per change |
| No changelog file exists | New project | Create one with `## [Unreleased]` |
