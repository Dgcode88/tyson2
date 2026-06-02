import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base` matches the GitHub Pages project site (https://Dgcode88.github.io/tyson2/)
// so built asset URLs resolve correctly there while staying root-relative in dev.
export default defineConfig({
  base: "/tyson2/",
  plugins: [react()],
  server: { open: false },
});
