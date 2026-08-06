import type { APIRoute } from "astro";
import { SUB_EVENTS_GITHUB_TOKEN } from "astro:env/server";
import {
  filterByEditionYear,
  loadSubEvents,
} from "../../lib/sub-events/github";
import { buildIcsFeed } from "../../lib/sub-events/ics";

// このフィードが掲載する開催年（ページの配置ディレクトリと揃える）
const EDITION_YEAR = 2026;

export const GET: APIRoute = async () => {
  try {
    const events = filterByEditionYear(
      await loadSubEvents(SUB_EVENTS_GITHUB_TOKEN),
      EDITION_YEAR
    );

    return new Response(buildIcsFeed(events), {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `inline; filename="fec-fukuoka-sub-events-${EDITION_YEAR}.ics"`,
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Netlify-CDN-Cache-Control":
          "public, durable, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("[sub-events] failed to build ics feed:", error);
    return new Response("Failed to build sub-events calendar", {
      status: 500,
    });
  }
};
