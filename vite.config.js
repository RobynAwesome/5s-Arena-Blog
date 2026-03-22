import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  build: {
    chunkSizeWarningLimit: 800,
  },
});
