import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { TAB_DEFS } from "./src/data/tabs.js";

// The asset base path depends on where the site is served from:
// - GitHub Pages project site lives under a sub-path (https://Dgcode88.github.io/tyson2/),
//   so assets must be requested from "/tyson2/...".
// - Vercel (and any root-domain host) serves from "/", where "/tyson2/..." would 404
//   every asset. Vercel sets VERCEL=1 in its build environment, so we detect that and
//   switch the base to "/". This keeps one codebase deployable to both hosts.
const base = process.env.VERCEL ? "/" : "/tyson2/";

// Absolute site origin for canonical/OG/sitemap. Host-aware, never guessed:
// - on Vercel, VERCEL_PROJECT_PRODUCTION_URL is the real production domain;
// - otherwise the known GitHub Pages origin;
// - override anytime with SITE_ORIGIN=https://your-domain.
const origin = (
  process.env.SITE_ORIGIN ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  "https://dgcode88.github.io"
).replace(/\/+$/, "");
const siteUrl = origin + base; // canonical home (Vercel root is the chosen canonical)
const ogImage = origin + base + "og-image.jpg";

const SEO = {
  title: "90-Day Tyson Transformation — Forge a Weapon",
  description:
    "A 90-day transformation program: train, fuel, recover, and lock in every single day. Three phases — Demolition, Reconstruction, Weaponization.",
  imageAlt:
    "Day 31 of 90 on a blood-red field — the giant day number above the phase name RECONSTRUCTION.",
};

// Injects social/share metadata + JSON-LD into index.html and emits robots.txt
// and sitemap.xml at build time, all using the host-aware absolute URLs above.
function seoPlugin() {
  const meta = (attrs) => ({ tag: "meta", attrs, injectTo: "head" });
  return {
    name: "tyson-seo",
    transformIndexHtml() {
      return {
        tags: [
          { tag: "link", attrs: { rel: "canonical", href: siteUrl }, injectTo: "head" },
          meta({ name: "robots", content: "index, follow" }),
          meta({ property: "og:type", content: "website" }),
          meta({ property: "og:site_name", content: "90-Day Tyson Transformation" }),
          meta({ property: "og:title", content: SEO.title }),
          meta({ property: "og:description", content: SEO.description }),
          meta({ property: "og:url", content: siteUrl }),
          meta({ property: "og:image", content: ogImage }),
          meta({ property: "og:image:width", content: "1200" }),
          meta({ property: "og:image:height", content: "630" }),
          meta({ property: "og:image:alt", content: SEO.imageAlt }),
          meta({ name: "twitter:card", content: "summary_large_image" }),
          meta({ name: "twitter:title", content: SEO.title }),
          meta({ name: "twitter:description", content: SEO.description }),
          meta({ name: "twitter:image", content: ogImage }),
          {
            tag: "script",
            attrs: { type: "application/ld+json" },
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "90-Day Tyson Transformation",
              description: SEO.description,
              url: siteUrl,
              applicationCategory: "HealthApplication",
              operatingSystem: "Any (installable PWA)",
              image: ogImage,
              isAccessibleForFree: true,
            }),
            injectTo: "head",
          },
        ],
      };
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${origin}${base}sitemap.xml\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          `  <url>\n    <loc>${siteUrl}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n` +
          `</urlset>\n`,
      });
    },
  };
}

// Build a PWA manifest shortcut from a tab id, validated against TAB_DEFS.
const tabShortcut = (id, name) => {
  const tab = TAB_DEFS.find((t) => t.id === id);
  if (!tab) throw new Error(`PWA shortcut points at unknown tab id "${id}" — check src/data/tabs.js`);
  return { name, short_name: tab.label, url: `${base}?tab=${tab.id}` };
};

export default defineConfig({
  base,
  plugins: [
    react(),
    seoPlugin(),
    // Installable, offline-capable PWA. Scope + start_url + service-worker scope
    // all derive from `base`, so the same config works on both deploy hosts.
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png", "icon-maskable.svg"],
      manifest: {
        id: base,
        name: "90-Day Tyson Transformation",
        short_name: "Tyson 90",
        description:
          "A 90-day transformation program — train, fuel, recover, and lock in every single day. Three phases: Demolition, Reconstruction, Weaponization.",
        lang: "en",
        dir: "ltr",
        theme_color: "#0B0E14",
        background_color: "#0B0E14",
        display: "standalone",
        orientation: "portrait",
        scope: base,
        start_url: base,
        categories: ["health", "fitness", "lifestyle"],
        icons: [
          { src: "pwa-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "pwa-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        // Shortcut ids resolve against the app's real tab list — a renamed or
        // removed tab fails the build here instead of silently stranding the
        // home-screen shortcut of every installed user.
        shortcuts: [
          tabShortcut("schedule", "Today's schedule"),
          tabShortcut("checklist", "Daily checklist"),
        ],
        screenshots: [
          {
            src: "screenshot-wide.png",
            sizes: "1280x800",
            type: "image/png",
            form_factor: "wide",
            label: "The command-center dashboard",
          },
          {
            src: "screenshot-narrow.png",
            sizes: "390x844",
            type: "image/png",
            form_factor: "narrow",
            label: "Today's mission",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2,svg,png,ico,webmanifest}"],
        // Screenshots are only fetched by the OS install dialog — don't waste
        // ~590KB of offline precache on them.
        globIgnores: ["**/screenshot-*.png"],
        navigateFallback: `${base}index.html`,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  server: { open: false },
  build: {
    rollupOptions: {
      output: {
        // Split stable dependencies into long-lived vendor chunks so an app-code
        // change doesn't force returning visitors to re-download React + the
        // animation/styling libraries. React rarely changes; keep it isolated.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/[\\/]react(-dom)?[\\/]|[\\/]scheduler[\\/]/.test(id)) return "react-vendor";
          return "vendor";
        },
      },
    },
  },
});
