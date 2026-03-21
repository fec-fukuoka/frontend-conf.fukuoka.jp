import type { APIRoute } from "astro";

const CALENDAR_ID =
  "60414e3802f22675d6be738c211a3d5e3bc0247dce53b20500d64e9f6313664b@group.calendar.google.com";
const ICAL_URL = `https://calendar.google.com/calendar/ical/${encodeURIComponent(CALENDAR_ID)}/public/basic.ics`;

interface ScheduleItem {
  id: string;
  title: string;
  titleEn: string;
  start: string;
  end: string | null;
}

/**
 * タイトルをパースして日本語と英語に分離
 * 形式: [FECF]日本語タイトル(English Title)
 */
function parseTitle(rawTitle: string): { ja: string; en: string } {
  const withoutPrefix = rawTitle.replace(/^\[FECF\]\s*/, "");
  const match = withoutPrefix.match(/^(.+?)\s*\(([^)]+)\)\s*$/);

  if (match) {
    return { ja: match[1].trim(), en: match[2].trim() };
  }
  return { ja: withoutPrefix.trim(), en: withoutPrefix.trim() };
}

/**
 * iCal の日付文字列をパース
 */
function parseICalDate(dateStr: string): string {
  if (dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  }
  const match = dateStr.match(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/
  );
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return dateStr;
}

/**
 * iCal テキストからイベントをパース
 */
function parseICal(icalText: string): ScheduleItem[] {
  const events: ScheduleItem[] = [];
  const lines = icalText.split(/\r?\n/);

  let currentEvent: Partial<{
    uid: string;
    summary: string;
    dtstart: string;
    dtend: string;
  }> | null = null;

  let currentKey = "";
  let currentValue = "";

  for (const line of lines) {
    if (line.startsWith(" ") || line.startsWith("\t")) {
      currentValue += line.slice(1);
      continue;
    }

    if (currentEvent && currentKey) {
      switch (currentKey) {
        case "UID":
          currentEvent.uid = currentValue;
          break;
        case "SUMMARY":
          currentEvent.summary = currentValue;
          break;
        case "DTSTART":
        case "DTSTART;VALUE=DATE":
          currentEvent.dtstart = currentValue;
          break;
        case "DTEND":
        case "DTEND;VALUE=DATE":
          currentEvent.dtend = currentValue;
          break;
      }
    }

    if (line === "BEGIN:VEVENT") {
      currentEvent = {};
      currentKey = "";
      currentValue = "";
      continue;
    }

    if (line === "END:VEVENT" && currentEvent) {
      if (currentEvent.summary?.startsWith("[FECF]")) {
        const { ja, en } = parseTitle(currentEvent.summary);
        events.push({
          id: currentEvent.uid || crypto.randomUUID(),
          title: ja,
          titleEn: en,
          start: parseICalDate(currentEvent.dtstart || ""),
          end: currentEvent.dtend ? parseICalDate(currentEvent.dtend) : null,
        });
      }
      currentEvent = null;
      currentKey = "";
      currentValue = "";
      continue;
    }

    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      currentKey = line.slice(0, colonIndex);
      currentValue = line.slice(colonIndex + 1);
    }
  }

  events.sort((a, b) => a.start.localeCompare(b.start));
  return events;
}

export const GET: APIRoute = async () => {
  try {
    const response = await fetch(ICAL_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch calendar: ${response.status}`);
    }

    const icalText = await response.text();
    const events = parseICal(icalText);

    return new Response(JSON.stringify(events), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching calendar:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch schedule" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
