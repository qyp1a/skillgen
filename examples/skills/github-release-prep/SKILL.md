---
name: github-release-prep
description: Prepare a GitHub release from the current main branch: review merged changes, draft the changelog, create a tag, and write release notes. Use when the user asks to cut a release, publish a new version, or prepare a GitHub release.
---

# GitHub Release Prep

Prepare a clean GitHub release from the current `main` branch. The skill produces a changelog draft, a version tag, and release notes with a predictable structure.

## When to Use

- The user asks to "cut a release", "publish vX.Y.Z", or "prepare release notes".
- The repository is about to tag a new version and needs a changelog.

## How to Use

1. Determine the target version from package metadata or the user's request (e.g. `v1.2.0`).
2. Fetch merged pull requests since the last tag: `git log $(git describe --tags --abbrev=0)..HEAD --oneline`.
3. Group changes by type: Features, Fixes, Docs, Chores.
4. Draft the changelog entry in the repository's changelog file using Keep a Changelog style.
5. Create the tag: `git tag vX.Y.Z && git push origin vX.Y.Z` (with explicit user confirmation).
6. Draft release notes summarizing highlights, breaking changes, and upgrade steps.

## Best Practices

- Only tag after the changelog is committed and the CI pipeline is green.
- Never push tags without explicit user confirmation.
- Note any breaking changes at the top of the release notes.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| No previous tag found | Repository never tagged | Compare against the initial commit instead |
| Tag already exists | Version was cut twice | Use a patch bump or reject the request |
