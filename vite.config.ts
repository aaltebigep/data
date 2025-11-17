import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { resolve } from "@std/path";

export default defineConfig({
  plugins: [preact()],
  root: "app",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@app": resolve(import.meta.dirname!, "app"),
    },
  },
});
