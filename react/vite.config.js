import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],

  base: "",

  build: {
    outDir: resolve(__dirname, "../plugin/bomsistema-catalogo/build"),
    assetsDir: "assets",
    manifest: true,
    emptyOutDir: true,
  },
});
