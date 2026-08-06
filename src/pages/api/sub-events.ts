import type { APIRoute } from "astro";
import { SUB_EVENTS_GITHUB_TOKEN } from "astro:env/server";
import { loadSubEvents } from "../../lib/sub-events/github";

export const GET: APIRoute = async () => {
  try {
    const events = await loadSubEvents(SUB_EVENTS_GITHUB_TOKEN);

    return new Response(JSON.stringify(events), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // ブラウザには常に再検証させ、鮮度は CDN キャッシュで担保する
        "Cache-Control": "public, max-age=0, must-revalidate",
        // Netlify CDN: 5分キャッシュ + 1時間 stale-while-revalidate。
        // GitHub API への到達は最大でも5分に1回に抑えられる
        "Netlify-CDN-Cache-Control":
          "public, durable, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("[sub-events] failed to load sub-events:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch sub-events" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
