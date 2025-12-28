import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { site } from "../data/site";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const newsItems = await getCollection("news", ({ data }) => !data.draft);

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.url,
    items: newsItems.map((item) => ({
      title: item.data.title,
      pubDate: item.data.pubDate,
      description: item.data.description,
      link: `/news/${item.id}/`,
    })),
  });
}
