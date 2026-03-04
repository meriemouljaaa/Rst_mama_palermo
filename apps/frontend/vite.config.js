import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // plugin React pour Vite
import path from "path";
import tailwind from "tailwindcss";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: "static",
  base: "./",
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
