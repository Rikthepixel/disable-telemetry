import { defineConfig } from "tsdown"

export default defineConfig({
  format: "cjs",
  sourcemap: true,
  banner: "#!/usr/bin/env node",
  dts: false,
  platform: "node",
  outputOptions: {
    dynamicImportInCjs: false,
  }
}) 
