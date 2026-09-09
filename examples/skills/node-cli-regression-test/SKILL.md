---
name: node-cli-regression-test
description: Run deterministic regression checks against a Node.js CLI by executing case files and comparing exit codes and output. Use when the user asks to regression-test, smoke-test, or verify a Node.js CLI after changes.
---

# Node CLI Regression Test

Run deterministic regression checks against a Node.js CLI. Cases are plain text files executed with `scripts/run-cli-cases.mjs`; every case records the command, expected exit code, and expected output.

## When to Use

- The user asks to regression-test or smoke-test a Node.js CLI.
- The user wants to verify that a refactor did not change observable CLI behavior.

## How to Use

1. Locate or create case files under `cases/` (one command per line, `exit:<code>` and `out:<substring>` expectations).
2. Run the runner: `node scripts/run-cli-cases.mjs --cli ./cli.js --cases ./cases`.
3. Review the summary: every case reports pass/fail with diff context.
4. Fix failures by adjusting code or, only if the expectation is wrong, the case file.

## Best Practices

- Keep cases deterministic: no network calls, no time-dependent output.
- Prefer substring matching (`out:`) over full output equality.
- Add one case per observable behavior change.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Runner exits 0 but a case failed | Runner treats failures as non-fatal | Use `--strict` to exit non-zero on any failure |
| Output has ANSI colors | CLI emits escape codes | Strip ANSI in the runner or disable colors |
