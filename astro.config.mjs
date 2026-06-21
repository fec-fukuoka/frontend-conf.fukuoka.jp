import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";

export default defineConfig({
  site: "https://frontend-conf.fukuoka.jp",
  output: "server",
  adapter: netlify(),
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // Drive token colours from CSS custom properties so code blocks inherit
      // the conference design tokens instead of Shiki's default github-dark.
      theme: "css-variables",
      // Soft-wrap long lines (e.g. the verbatim Japanese templates in news
      // posts) instead of forcing a horizontal scrollbar.
      wrap: true,
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
});
