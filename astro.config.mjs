import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";

export default defineConfig({
  site: "https://frontend-conf.fukuoka.jp",
  output: "server",
  adapter: netlify(),
  integrations: [sitemap()],
  build: {
    inlineStylesheets: "always",
  },
});
