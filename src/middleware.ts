import { defineMiddleware } from "astro:middleware";

/**
 * Redirect old language-based URLs to new query parameter based URLs
 * /ja/* -> /*?hl=ja
 * /en/* -> /*?hl=en
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Check if the path matches old language URL pattern
  const match = pathname.match(/^\/(ja|en)(\/.*)?$/);
  if (match) {
    const lang = match[1];
    const path = match[2] || "/";

    // Redirect to new URL with query parameter
    const newUrl = new URL(context.url);
    newUrl.pathname = path;
    newUrl.searchParams.set("hl", lang);

    return context.redirect(newUrl.pathname + newUrl.search, 301);
  }

  return next();
});
