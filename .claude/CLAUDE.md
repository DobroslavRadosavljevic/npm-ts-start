# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript npm package starter template. It produces a zero-dependency ESM library with TypeScript declarations.

## Commands

```bash
bun run build       # Bundle with tsdown → dist/
bun run dev         # Watch mode
bun run test        # Run all tests
bun test <file>     # Run single test file
bun run lint        # Check code quality
bun run format      # Auto-fix lint/format issues
bun run typecheck   # TypeScript type checking
bun run bump        # Bump version + changelog, creates git tag
git push --tags     # Triggers automated npm publish via GitHub Actions
```

## Architecture

- `src/index.ts` - Main package entry point, exports public API
- `tests/` - Test files using Bun's test runner (`describe`, `it`, `expect` from `bun:test`)
- `dist/` - Build output (ESM + `.d.mts` declarations)

Build tool is **tsdown** (Rolldown-based). Output is configured in `tsdown.config.ts`.

## Code Quality

Uses **Ultracite** (Oxlint + Oxfmt) for linting and formatting. Pre-commit hooks auto-format staged files.

Commit messages must follow Conventional Commits format: `type(scope): description`

## Code Standards

Write code that is **type-safe and maintainable**. Focus on clarity over brevity.

### TypeScript

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any`
- Use const assertions (`as const`) for immutable values
- Leverage type narrowing instead of type assertions
- Use `const` by default, `let` only when needed, never `var`

### Modern JavaScript

- Arrow functions for callbacks
- `for...of` over `.forEach()` and indexed loops
- Optional chaining (`?.`) and nullish coalescing (`??`)
- Template literals over string concatenation
- Destructuring for object/array assignments

### Async

- Always `await` promises in async functions
- Use `async/await` over promise chains
- Handle errors with try-catch

### Error Handling

- No `console.log`, `debugger`, or `alert` in production code
- Throw `Error` objects with descriptive messages
- Prefer early returns over nested conditionals

### Testing

- Write assertions inside `it()` or `test()` blocks
- Use async/await, not done callbacks
- No `.only` or `.skip` in committed code

## Auto-formatting

Most issues are auto-fixed by running `bun run format`. The pre-commit hook handles this for staged files.
