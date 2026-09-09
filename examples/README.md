# Complete example skills

These skills are complete, ready-to-use examples generated in the style of skillgen output. They live outside `.agents/skills/`, so cloning this repository does **not** activate them automatically.

| Skill | Purpose | Highlights |
| --- | --- | --- |
| [`github-release-prep`](skills/github-release-prep/) | Prepare a GitHub release: changelog, tag, and notes | Multi-stage workflow, quality gates |
| [`bilingual-readme-sync`](skills/bilingual-readme-sync/) | Keep a README and its English version in sync | Section-level mapping, diff-style review |
| [`node-cli-regression-test`](skills/node-cli-regression-test/) | Run regression checks against a Node.js CLI | Deterministic runner script (`scripts/run-cli-cases.mjs`) |
| [`skill-quality-review`](skills/skill-quality-review/) | Review a SKILL.md against community quality criteria | Checklist in `references/review-checklist.md` |
| [`changelog-drafter`](skills/changelog-drafter/) | Draft a Keep a Changelog–style entry | Categorized entries, version linking |
| [`npm-release-check`](skills/npm-release-check/) | Verify a package is ready before `npm publish` | Pre-flight checklist, dry-run verification |

To try one locally with Codex, copy it into a repository's `.agents/skills/` or your user-level `~/.agents/skills/`.
