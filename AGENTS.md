# Repository Guidelines

## Project Structure & Module Organization

The package source lives in `src/` (current entry point: `src/index.ts`). Keep public API exports explicit there. Tests live in `tests/` and should mirror source modules (for example, `tests/index.test.ts` for `src/index.ts`). Build artifacts are generated into `dist/` and should not be edited manually. Use `scripts/` for maintenance checks such as `scripts/consumer-smoke.mjs`. CI/release automation is in `.github/workflows/`.

## Build, Test, and Development Commands

- `bun install`: install dependencies (Bun is the package manager in this repo).
- `bun run dev`: watch-mode builds with `tsdown`.
- `bun run build`: produce the distributable output in `dist/`.
- `bun run test`: run Bun tests.
- `bun run lint`: run Ultracite lint checks.
- `bun run format`: apply Ultracite formatting/lint fixes.
- `bun run typecheck`: run TypeScript checks (no emit).
- `bun run check:package`: validate package contract (`publint` + `@arethetypeswrong/cli`).
- `bun run test:consumer`: smoke-test the packed tarball in a consumer project.
- `bun run check:all`: full local quality gate (same gate used in CI).

## Coding Style & Naming Conventions

Use TypeScript with ESM syntax and Node 20+ compatibility. Formatting is enforced by Ultracite (`oxfmt` + `oxlint`): 2-space indentation, semicolons, double quotes, 80-char print width, and LF line endings. Prefer clear, small modules and keep filenames descriptive (for example, `feature-name.ts`). Name tests with the `.test.ts` suffix.

## Testing Guidelines

This repo uses Bun’s test runner (`bun:test`). Add or update tests for every behavior change, especially public exports. Keep tests deterministic and colocated in `tests/` with mirrored naming. Run `bun run check:all` before opening a PR; CI runs this exact command on pushes/PRs to `main`.

## Commit & Pull Request Guidelines

Conventional Commits are required and enforced by Husky + commitlint (examples from history: `feat:`, `fix:`, `docs:`, `chore:`). Keep commit messages concise, imperative, and scoped to one change. Use focused branch names like `feat/short-description`. PRs should include:

- what changed and why,
- linked issue(s) when applicable,
- reviewer notes on tradeoffs, risks, or follow-ups.

## Security & Release Notes

Do not commit secrets. Publishing uses npm trusted publishing (OIDC) via GitHub Actions. For releases, run `bun run bump` and push tags; the release workflow reruns quality checks before publish.
