# Repository Guidelines for Agents

Agent-facing source of truth for this codebase. Prefer this file over assumptions from older templates.

## 1) What this project is

`npm-ts-start` is a starter for a **publishable TypeScript npm package** with:

- ESM-only output (no CJS)
- Bun-first local tooling
- Vitest for tests
- tsdown for build + package validation
- Ultracite (`oxlint` + `oxfmt`) for lint/format
- GitHub Actions CI for quality checks only
- Manual local npm publish (browser login + 2FA)

## 2) Read these first

| File | Role |
| --- | --- |
| `package.json` | Scripts, exports contract, engines, metadata |
| `src/index.ts` | Public API entry |
| `tsdown.config.ts` | Build, dts, publint, attw, unused |
| `tsconfig.json` | Typecheck-only (`noEmit`) |
| `vitest.config.ts` | Node test runner config |
| `oxlint.config.ts` / `oxfmt.config.ts` | Lint + format policy |
| `.github/workflows/ci.yml` | Quality CI |
| `.vscode/settings.json` | Oxc format/fix on save |
| `README.md` | Human-facing usage |

## 3) Package contract (do not break)

ESM-only by design:

- `"type": "module"`
- `exports["."].import` → `./dist/index.mjs`
- `exports["."].types` → `./dist/index.d.mts`
- `exports["."].require` → `null`
- Published files: `dist/` only
- Consumer runtime: Node `>=20`
- Build tooling (tsdown): Node `^22.18 || >=24.11`

Do **not** add dual CJS/ESM, enable tsdown `exports: true` (would overwrite hand-authored `require: null`), or publish from CI unless explicitly asked.

## 4) Commands

Use Bun for local workflows:

```bash
bun install
bun run dev          # tsdown --watch
bun run build        # build + publint + attw + unused
bun run test         # vitest run
bun run test:watch
bun run lint         # ultracite check
bun run format       # ultracite fix
bun run typecheck    # tsc --noEmit
bun run check:pack   # npm pack --dry-run
bun run check:all    # lint + typecheck + test + build + pack
```

Default validation target: **`bun run check:all`**.

Release (local only):

```bash
bun run login        # npm login --auth-type=web
bun run whoami
bun run release:dry
bun run release      # npm publish --access public (runs prepublishOnly → check:all)
```

## 5) Architecture notes

### Build (`tsdown`)

- Entry: `src/index.ts` → `dist/index.mjs` + `dist/index.d.mts`
- `platform: "node"`, `format: "esm"`, `fixedExtension: true`
- `nodeProtocol: true`, `deps.skipNodeModulesBundle: true`
- `exports: false` (package.json stays hand-authored)
- Post-build checks: `publint` (error), `attw` (`esm-only`, error), `unused` (error)
- Size report: gzip + brotli

### Types

- `tsc` is typecheck-only (`noEmit: true`)
- Declarations come from tsdown (`dts: true`)

### Tests

- Vitest, `environment: "node"`, files under `tests/**/*.{test,spec}.ts`
- Explicit imports from `vitest` (no globals)

### Lint / format

- Ultracite presets via `oxlint.config.ts` and `oxfmt.config.ts`
- Editor: Oxc extension + `.vscode/settings.json` (format + fixAll on save, including unused imports)

## 6) CI

`.github/workflows/ci.yml` only:

- **Quality**: Bun `1.3.14` + Node 22 → `bun run check:all`
- **Compat**: Node 22/24 → `test` + `build`
- Triggers: push/PR to `main`
- No publish, no tokens, no release workflow

## 7) Change rules

1. Do not hand-edit `dist/`.
2. Keep `README.md` and this file aligned with real behavior.
3. Prefer Bun-native scripts where practical.
4. Preserve the ESM-only contract unless the user asks otherwise.
5. Do not reintroduce Changesets, Husky, commitlint, consumer smoke tests, or CI publishing.
6. Do not commit secrets or put npm tokens in the repo.

## 8) Typical edit paths

- `src/*.ts` — implementation
- `tests/*.test.ts` — tests
- `*.config.ts` — tooling
- `.github/workflows/*.yml` — CI quality only
- `package.json` — version bumps for release

## 9) Pitfalls

- Publishing without `bun run login` / active npm session
- Forgetting to bump `package.json` `version` before `release`
- Expecting CI to publish
- Enabling tsdown auto-`exports` and losing `require: null`
- Assuming Node 20 can run the **build** toolchain (consumers: yes; tsdown CLI: no)
- TypeScript 7 may warn as experimental during dts emit — expected with current tsdown
