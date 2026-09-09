---
name: npm-release-check
description: Verify a package is ready before npm publish by checking version, registry availability, pack contents, and dry-run. Use when the user asks to publish, prep for publish, or check npm release readiness.
---

# npm Release Check

Verify a package is ready before `npm publish`. The skill checks version consistency, registry collisions, pack contents, and a publish dry-run, then reports a go/no-go verdict.

## When to Use

- The user asks to publish or prepare a release to npm.
- The user wants a pre-flight check before running `npm publish`.

## How to Use

1. Check version: `npm view skillgen version` (or the package's own name) and compare with `package.json`.
2. Verify the package name is not already taken: `npm view <name> versions`.
3. Inspect pack contents: `npm pack --dry-run` and review the file list.
4. Run the project's own checks: `npm test` and `npm run check` if defined.
5. Report a go/no-go verdict with any blockers.

## Best Practices

- Never run `npm publish` without explicit user confirmation.
- Flag missing `files` allowlist or accidental inclusion of secrets.
- Confirm the version is not already published before re-publishing.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `npm view` returns nothing | Package not published yet | First publish is allowed; re-check name availability |
| Pack includes extra files | Missing `files` field | Add a `files` allowlist to package.json |
