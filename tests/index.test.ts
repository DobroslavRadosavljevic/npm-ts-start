import { describe, expect, it } from "vitest";

import { fn } from "../src";

describe("index", () => {
  it("should return 'Hello, tsdown!'", () => {
    expect(fn()).toBe("Hello, tsdown!");
  });
});
