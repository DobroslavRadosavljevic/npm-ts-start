import { defineConfig } from "tsdown";

export default defineConfig({
  attw: {
    level: "error",
    profile: "esm-only",
  },
  clean: true,
  deps: {
    // Libraries should not inline node_modules into the published bundle.
    skipNodeModulesBundle: true,
  },
  dts: true,
  entry: ["./src/index.ts"],
  // Keep package.json exports/main/types hand-authored (ESM-only + `require: null`).
  exports: false,
  // Explicit .mjs / .d.mts (default for platform: "node", kept for the ESM-only contract).
  fixedExtension: true,
  format: "esm",
  // Prefer explicit `node:` imports for built-ins.
  // Target comes from package.json engines.node (>=20 → node20).
  nodeProtocol: true,
  outDir: "dist",
  platform: "node",
  publint: {
    level: "error",
  },
  report: {
    brotli: true,
    gzip: true,
  },
  unused: {
    level: "error",
  },
});
