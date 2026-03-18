import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",   // ✅ properly closed string and object
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"], // ✅ separate from alias
  },
});