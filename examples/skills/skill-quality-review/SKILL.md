---
name: skill-quality-review
description: Review a SKILL.md file against community quality criteria: name rules, description quality, structure, and readiness. Use when the user asks to review, audit, or check a skill before publishing it.
---

# Skill Quality Review

Review a `SKILL.md` file against community quality criteria and produce a pass/fail verdict with an action list. The skill never edits the file; it only reports.

## When to Use

- The user asks to review or audit a skill before publishing it.
- The user wants a checklist-based quality gate for generated skills.

## How to Use

1. Read the target `SKILL.md`.
2. Walk through `references/review-checklist.md` item by item.
3. Record evidence for each item (quote the relevant lines).
4. Produce a verdict: pass, fail, or needs-work, with the failing items listed.

## Best Practices

- Quote evidence; do not summarize loosely.
- Distinguish hard requirements from recommendations in the report.
- Never modify the reviewed file unless explicitly asked.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Checklist item not applicable | Skill type differs | Mark N/A with a note |
| Verdict is always fail | Checklist too strict | Split into required vs recommended |
