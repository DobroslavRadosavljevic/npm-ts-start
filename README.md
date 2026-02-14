# 📦 npm-ts-start

[![npm version](https://img.shields.io/npm/v/npm-ts-start.svg)](https://www.npmjs.com/package/npm-ts-start)
[![CI](https://github.com/your-org/your-package/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/your-package/actions/workflows/ci.yml)
[![Release](https://github.com/your-org/your-package/actions/workflows/release.yml/badge.svg)](https://github.com/your-org/your-package/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node 20+](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org)

Production-grade starter for TypeScript npm packages.

- ESM-only package contract
- Bun-first development workflow
- Changesets release automation
- npm trusted publishing with provenance
- CI compatibility checks for Node 20/22/24

Replace `your-org/your-package` badge links after creating your own repository.

## Docs You Should Read

- `GETTING_STARTED.md` - template -> first publish, step-by-step
- `CONTRIBUTING.md` - contributor workflow
- `MAINTAINERS.md` - owner/maintainer runbook
- `.changeset/README.md` - changeset conventions

## Prerequisites

- Bun `1.3.9+`
- Node.js `20+` for runtime compatibility
- Node.js `22+` in release CI for npm trusted publishing requirements

## Quick Start

1. Use this repository as a GitHub template.
2. Clone your new repository:

```bash
git clone https://github.com/<your-user-or-org>/<your-repo>.git
cd <your-repo>
```

3. Install dependencies:

```bash
bun install
```

4. Update `package.json` metadata:
   - `name`
   - `description`
   - `author`
   - `homepage`
   - `bugs.url`
   - `repository.url`

5. Run the full gate:

```bash
bun run check:all
```

6. Start building in `src/index.ts`.

For the full beginner flow, follow `GETTING_STARTED.md`.

## Runtime Contract

- Published package is **ESM-only**.
- Runtime floor is **Node 20+**.
- CommonJS `require()` is intentionally unsupported.

CommonJS consumers must use dynamic import:

```js
(async () => {
  const { fn } = await import("your-package-name");
  console.log(fn());
})();
```

## Scripts

| Command                    | Description                                                  |
| -------------------------- | ------------------------------------------------------------ |
| `bun run dev`              | Build in watch mode                                          |
| `bun run build`            | Build package to `dist/`                                     |
| `bun run test`             | Run Bun tests                                                |
| `bun run lint`             | Run Ultracite checks                                         |
| `bun run format`           | Apply Ultracite fixes                                        |
| `bun run typecheck`        | Run TypeScript checks (no emit)                              |
| `bun run check:pack`       | Validate packed publish contents (`npm pack --dry-run`)      |
| `bun run check:package`    | Run `publint` and `@arethetypeswrong/cli`                    |
| `bun run test:consumer`    | Smoke-test packed artifact in a temp consumer app            |
| `bun run check:all`        | Full quality gate                                            |
| `bun run changeset`        | Create a changeset for releasable changes                    |
| `bun run release:status`   | Show pending release plan from changesets                    |
| `bun run version-packages` | Apply version/changelog updates from changesets              |
| `bun run release`          | Direct publish via Changesets                                |
| `bun run release:ci`       | Guarded publish path used by CI (`NPM_PUBLISH_ENABLED=true`) |

## Branch + PR Workflow

1. Sync `main`:

```bash
git checkout main
git pull --rebase origin main
```

2. Create a branch:

```bash
git checkout -b feat/<short-name>
```

3. Make changes.
4. If package behavior/API/metadata changed, run:

```bash
bun run changeset
```

5. Run checks:

```bash
bun run check:all
```

6. Commit and push branch.
7. Open PR to `main`.

CI enforces changesets for package-impacting paths.

## Release Flow (What Happens on Merge)

1. PR with changeset merges to `main`.
2. `release.yml` runs `changesets/action`.
3. Changesets creates/updates a release PR.
4. You merge the release PR.
5. Publish runs only if `NPM_PUBLISH_ENABLED=true`.

## Trusted Publishing Setup (npm Website)

1. Sign in at [npmjs.com](https://www.npmjs.com).
2. Open your package settings.
3. Go to **Publishing access**.
4. Click **Add trusted publisher**.
5. Select **GitHub Actions**.
6. Configure:
   - Repository owner
   - Repository name
   - Workflow file: `release.yml`

Then configure GitHub repository variable:

- Name: `NPM_PUBLISH_ENABLED`
- Value: `true` to allow publishing

Keep it unset or `false` to safely block accidental publishes.

## CI/CD Summary

### `ci.yml`

- `quality` job: full `check:all` on Node 20
- `compat` matrix: test/build/package checks on Node 20/22/24
- `changeset-required`: PR guard for release intent

### `release.yml`

- Triggered on push to `main` and manual dispatch
- Runs quality checks before release action
- Uses trusted publishing + provenance
- Publish guarded by `NPM_PUBLISH_ENABLED`

### `security-audit.yml`

- Weekly `bun audit --production`
- Includes dependency drift summary (`bun outdated`)

## Project Structure

```txt
├── src/
│   └── index.ts
├── tests/
│   └── index.test.ts
├── scripts/
│   └── consumer-smoke.ts
├── dist/                           # generated
├── .changeset/
│   ├── config.json
│   └── README.md
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── release.yml
│   │   └── security-audit.yml
│   └── ISSUE_TEMPLATE/
├── GETTING_STARTED.md
├── MAINTAINERS.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── SECURITY.md
├── tsconfig.json
├── tsconfig.typecheck.json
├── tsdown.config.ts
└── package.json
```

## License

MIT
