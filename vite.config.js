import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The asset base path depends on where the site is served from:
// - GitHub Pages project site lives under a sub-path (https://Dgcode88.github.io/tyson2/),
//   so assets must be requested from "/tyson2/...".
// - Vercel (and any root-domain host) serves from "/", where "/tyson2/..." would 404
//   every asset. Vercel sets VERCEL=1 in its build environment, so we detect that and
//   switch the base to "/". This keeps one codebase deployable to both hosts.
const base = process.env.VERCEL ? "/" : "/tyson2/";

export default defineConfig({
  base,
  plugins: [react()],
  server: { open: false },
});
