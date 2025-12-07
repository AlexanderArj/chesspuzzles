import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  server: { port: 3000 },
  preview: { port: 4173 },
  build: { outDir: "dist" }
});
