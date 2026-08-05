import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://frontend-conf.fukuoka.jp",
  output: "server",
  adapter: netlify(),
  integrations: [sitemap(), mdx()],
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
  env: {
    schema: {
      // GitHub API の認証用トークン（サブイベント取得）。未設定なら未認証で
      // アクセスする（60 req/h/IP）。本番では Netlify の環境変数に設定する。
      SUB_EVENTS_GITHUB_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },
});
