import { toIcsUtc } from "./ics";
import type { SubEvent } from "./types";

const GCAL_RENDER_URL = "https://calendar.google.com/calendar/render";
/** URL が長すぎると一部環境で切れるため、概要は先頭のみ使う */
const MAX_DETAILS_CHARS = 1000;

/** 「Google Calendar に追加」リンクを生成する */
export function buildGoogleCalendarUrl(event: SubEvent): string {
  const summary =
    event.description.length > MAX_DETAILS_CHARS
      ? `${event.description.slice(0, MAX_DETAILS_CHARS)}…`
      : event.description;
  const details = [
    summary,
    "",
    `主催 / Organizer: ${event.organizer}`,
    `詳細 / Details: ${event.eventUrl}`,
    `GitHub Issue: ${event.issueUrl}`,
  ].join("\n");

  const url = new URL(GCAL_RENDER_URL);
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", event.name);
  url.searchParams.set(
    "dates",
    `${toIcsUtc(event.startsAt)}/${toIcsUtc(event.endsAt)}`
  );
  url.searchParams.set("location", event.venue);
  url.searchParams.set("details", details);
  url.searchParams.set("ctz", "Asia/Tokyo");
  return url.toString();
}
