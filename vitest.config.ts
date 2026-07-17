import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    clearMocks: true,
    environment: "node",
    exclude: [...configDefaults.exclude, "opensrc/**", "dist/**"],
    include: ["tests/**/*.{test,spec}.ts"],
    mockReset: true,
    pool: "forks",
    restoreMocks: true,
  },
});
