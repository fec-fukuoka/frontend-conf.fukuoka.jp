import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://frontend-conf.fukuoka.jp",
  output: "server",
  adapter: cloudflare({
    mode: "directory",
  }),
  integrations: [sitemap()],
});
