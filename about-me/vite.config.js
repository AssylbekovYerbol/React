import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" makes all links relative, so the app works on
// GitHub Pages under any repository name (username.github.io/repo-name/).
export default defineConfig({
  plugins: [react()],
  base: "./",
});
