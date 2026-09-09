# Contributing to skillgen

Thanks for helping improve skillgen.

## Development

1. Fork and clone the repository.
2. Use Node.js 18 or later.
3. Run `npm test` before making changes.
4. Keep the CLI zero-dependency unless a dependency provides a clear, measurable benefit.
5. Run `npm run check` before opening a pull request.

Changes to a template should normally be reflected across its `zh`, `en`, and `both` variants. Add tests for behavior and invariants rather than exact prose whenever possible.

## Pull requests

- Keep each pull request focused on one problem.
- Explain user-visible behavior changes.
- Update both READMEs when flags, output structure, or installation guidance changes.
- Do not include generated archives, cache files, or unrelated formatting changes.
