import { describe, expect, it } from "vitest";

import packageJson from "../package.json" with { type: "json" };
import plugin from "../src/index.js";

describe("plugin", () => {
  it("exposes meta with the package name", () => {
    expect(plugin.meta.name).toBe(packageJson.name);
  });

  it("exposes a rules map", () => {
    expect(plugin.rules).toBeTypeOf("object");
  });

  it("exposes the named config presets", () => {
    for (const preset of [
      "base",
      "base/recommended",
      "react",
      "react/recommended",
      "all",
      "all/recommended",
    ]) {
      expect(plugin.configs).toHaveProperty([preset]);
      expect(plugin.configs[preset]?.name).toBe(`next-friday/${preset}`);
    }
  });

  it("enables every rule in the all preset", () => {
    expect(Object.keys(plugin.configs.all?.rules ?? {})).toHaveLength(
      Object.keys(plugin.rules).length,
    );
  });
});
