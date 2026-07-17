# 📦 npm-ts-start

A clean starter for building and publishing a **TypeScript npm package** — ESM-only, Bun-first, quality-gated.

## ✨ What’s included

- 🔷 **TypeScript** with strict, modern `tsconfig` (typecheck-only; bundler emits)
- 📦 **ESM-only package contract** (`.mjs` / `.d.mts`, `require` disabled)
- ⚡ **tsdown** builds with declaration emit
- 🧪 **Vitest** for Node runtime tests
- 🎨 **Ultracite** lint + format (`oxlint` + `oxfmt`)
- 🧰 **Build-time package checks** — publint, arethetypeswrong (ESM), unused deps
- 🐙 **GitHub Actions CI** — quality + Node compat (no publish)
- 🚀 **Manual local release** via npm browser login (2FA-friendly)
- 🧰 **VS Code / Cursor** Oxc settings (format + fix on save)

## 🧱 Stack

| Area               | Tool                       |
| ------------------ | -------------------------- |
| 🧰 Package manager | Bun `1.3.14+`              |
| 🟦 Language        | TypeScript                 |
| 📦 Bundler         | tsdown                     |
| 🧪 Tests           | Vitest                     |
| 🎨 Lint / format   | Ultracite (oxlint + oxfmt) |
| 🐙 CI              | GitHub Actions             |
| 📡 Registry        | npm                        |

## 📋 Prerequisites

- 🥟 Bun `1.3.14+`
- 🟢 Node.js `20+` for package consumers
- 🟢 Node.js `22.18+` (or `24.11+`) to run **tsdown** locally / in CI
- 📦 npm CLI for login + publish

## 🚀 Quick start

1. Use this repo as a GitHub template (or clone it).
2. Install:

```bash
bun install
```

3. Personalize `package.json`:
   - `name`
   - `description`
   - `author`
   - `homepage`
   - `bugs.url`
   - `repository.url`

4. Run the full gate:

```bash
bun run check:all
```

5. Edit `src/index.ts` and add tests under `tests/`.

## 📦 Runtime contract

| ✅             | ❌                   |
| -------------- | -------------------- |
| ESM `import`   | CommonJS `require()` |
| Node.js `>=20` | Dual CJS/ESM builds  |

For CJS consumers, use dynamic import:

```js
(async () => {
  const { fn } = await import("your-package-name");
  console.log(fn());
})();
```

## 🛠️ Scripts

| Command                  | What it does                    |
| ------------------------ | ------------------------------- |
| 👀 `bun run dev`         | Watch build                     |
| 🏗️ `bun run build`       | Build + publint / attw / unused |
| 🧪 `bun run test`        | Run Vitest once                 |
| ♻️ `bun run test:watch`  | Vitest watch mode               |
| 🔍 `bun run lint`        | Lint + format check             |
| ✨ `bun run format`      | Apply lint/format fixes         |
| 🧠 `bun run typecheck`   | `tsc --noEmit`                  |
| 📦 `bun run check:pack`  | `npm pack --dry-run`            |
| ✅ `bun run check:all`   | Full quality gate               |
| 🔐 `bun run login`       | npm browser login (2FA)         |
| 🙋 `bun run whoami`      | Show logged-in npm user         |
| 🚪 `bun run logout`      | Log out of npm                  |
| 🏜️ `bun run release:dry` | Dry-run publish                 |
| 🚀 `bun run release`     | Publish to npm                  |

`prepublishOnly` runs `check:all` before every publish.

## 🌿 Workflow

1. Branch from `main` — don’t commit straight to it.
2. Implement + test.
3. Bump `version` in `package.json` when preparing a release.
4. Run `bun run check:all`.
5. Open a PR; CI must stay green.

## 🚢 Release (local only)

Publishing is **manual from your machine**. CI never publishes.

```bash
# 1) bump package.json "version"
# 2) authenticate (browser + 2FA)
bun run login
bun run whoami

# 3) optional dry run
bun run release:dry

# 4) publish
bun run release
```

## 🐙 CI

`.github/workflows/ci.yml` on push/PR to `main`:

| Job            | Runs                                 |
| -------------- | ------------------------------------ |
| ✅ **Quality** | Bun `1.3.14` + Node 22 → `check:all` |
| 🧩 **Compat**  | Node 22 / 24 → `test` + `build`      |

No release jobs. No npm tokens in CI.

## 🗂️ Layout

```txt
├── src/
│   └── index.ts              # public API
├── tests/
│   └── index.test.ts
├── dist/                     # generated (do not edit)
├── .github/workflows/
│   └── ci.yml
├── .vscode/                  # Oxc editor defaults
├── tsconfig.json
├── tsdown.config.ts
├── vitest.config.ts
├── oxlint.config.ts
├── oxfmt.config.ts
├── AGENTS.md                 # agent / automation guide
└── package.json
```

## 📄 License

MIT
