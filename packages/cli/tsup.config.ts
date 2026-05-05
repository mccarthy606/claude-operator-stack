import { defineConfig } from "tsup";

export default defineConfig({
  entry: { cli: "src/cli.ts" },
  format: ["esm"],
  target: "node20",
  platform: "node",
  bundle: true,
  splitting: false,
  shims: false,
  clean: true,
  sourcemap: false,
  minify: false,
  dts: false,
  treeshake: true,
  banner: {
    js: "#!/usr/bin/env node",
  },
  outExtension() {
    return { js: ".js" };
  },
});
