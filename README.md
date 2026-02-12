# 📦 npm-ts-start

A minimal starter template for creating npm packages in pure TypeScript.

## ✨ Features

- 🔷 **TypeScript** - Write type-safe code with full TypeScript support
- ⚡ **tsdown** - Fast bundling powered by Rolldown
- 🧪 **Bun Test** - Fast built-in test runner
- 🎨 **Ultracite** - Zero-config linting and formatting with Oxlint + Oxfmt
- 📦 **ESM-only** - Ships as ES modules with TypeScript declarations
- 🟢 **Node 20+** - Explicit runtime baseline for consumers
- 🚀 **GitHub Actions** - CI/CD pipeline with automated testing and npm publishing
- 🐶 **Husky** - Pre-commit hooks for code quality enforcement
- 📝 **Commitlint** - Conventional commit message validation

## 🚀 Getting Started

1. Clone or use this template:

```bash
git clone https://github.com/dobroslavradosavljevic/npm-ts-start.git my-package
cd my-package
```

2. Update `package.json` with your package name, description, and author info.

3. Install dependencies:

```bash
bun install
```

4. Start developing in `src/index.ts`.

## 🧩 Runtime & Module Support

- This template publishes an **ESM-only** package.
- Supported runtime: **Node.js 20 or newer**.
- CommonJS `require()` is intentionally not supported.

### CJS to ESM Migration Note

If you are in a CommonJS codebase, use dynamic import:

```js
// CommonJS file
(async () => {
  const { fn } = await import("npm-ts-start");
  console.log(fn());
})();
```

## 📜 Scripts

| Command                 | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `bun run build`         | Build the package                              |
| `bun run dev`           | Build in watch mode                            |
| `bun run test`          | Run tests                                      |
| `bun run lint`          | Check for linting issues                       |
| `bun run format`        | Fix linting and formatting issues              |
| `bun run typecheck`     | Run TypeScript type checking                   |
| `bun run check:package` | Validate package exports/types metadata        |
| `bun run test:consumer` | Smoke-test packed artifact from a consumer app |
| `bun run check:all`     | Run full release quality gate                  |
| `bun run bump`          | Bump version and generate changelog            |

## 📁 Project Structure

```txt
├── src/
│   └── index.ts          # Package entry point
├── tests/
│   └── index.test.ts     # Test files
├── dist/                 # Build output (generated)
├── .github/
│   └── workflows/
│       ├── ci.yml             # Full quality gate in CI
│       ├── release.yml        # Automated npm publishing
│       └── security-audit.yml # Scheduled dependency/security checks
├── scripts/
│   └── consumer-smoke.mjs # Packed artifact consumer smoke test
├── .husky/
│   ├── pre-commit        # Runs lint-staged before commits
│   └── commit-msg        # Validates commit messages
├── tsdown.config.ts      # Build configuration
├── tsconfig.json         # TypeScript configuration
├── tsconfig.typecheck.json # Typecheck config for src + tests
├── commitlint.config.ts  # Commit message rules
├── .github/dependabot.yml # Automated dependency update PRs
└── package.json
```

## 🐶 Git Hooks

This template uses Husky for Git hooks:

- **pre-commit**: Runs `lint-staged` to lint and format staged files
- **commit-msg**: Validates commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)

### Commit Message Format

```
type(scope): description

# Examples:
feat: add new feature
fix: resolve bug in parser
docs: update README
chore: update dependencies
```

## 🔄 CI/CD

### Continuous Integration

On every push to `main` and pull request, the CI workflow runs:

- ✅ Lint check
- ✅ Type check (including tests)
- ✅ Tests
- ✅ Build
- ✅ Package contract checks (`publint` + `@arethetypeswrong/cli`)
- ✅ Consumer smoke test from packed tarball

### Automated Releases

When you push a version tag (`v*`), the release workflow:

1. Runs all CI checks
2. Publishes to npm with provenance
3. Creates a GitHub release with auto-generated notes

### Setup for Publishing (Trusted Publishing)

This template uses [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/) with OIDC - no tokens required.

1. Go to [npmjs.com](https://www.npmjs.com) and navigate to your package settings
2. Under **Publishing access**, click **Add trusted publisher**
3. Configure GitHub Actions as the trusted publisher:
   - **Repository owner**: your GitHub username or org
   - **Repository name**: your repo name
   - **Workflow file**: `release.yml`
   - **Environment** (optional): leave blank

That's it - no secrets or tokens to manage. The workflow uses short-lived OIDC credentials that are automatically generated for each run.

## 🚢 Publishing

1. Bump the version (creates a tag):

```bash
bun run bump
```

2. Push the tag to trigger the release workflow:

```bash
git push --tags
```

Or publish manually:

```bash
bun publish
```

## 📄 License

MIT
