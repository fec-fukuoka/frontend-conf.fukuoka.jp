import { describe, expect, it } from "vitest";
import { buildGoogleCalendarUrl } from "./gcal";
import type { SubEvent } from "./types";

const EVENT: SubEvent = {
  issueNumber: 42,
  issueUrl: "https://github.com/fec-fukuoka/frontend-conf.fukuoka.jp/issues/42",
  issueAuthor: "octocat",
  name: "FEC Fukuoka 前夜祭",
  startsAt: "2026-09-11T18:30:00+09:00",
  endsAt: "2026-09-11T21:00:00+09:00",
  venue: "福岡市中央区○○ビル 3F",
  organizer: "Fukuoka Frontend Meetup",
  eventUrl: "https://example.connpass.com/event/000000/",
  language: "日本語",
  description: "カンファレンス前夜に開催する交流イベントです。",
  updatedAt: "2026-08-01T03:15:00Z",
};

describe("buildGoogleCalendarUrl", () => {
  it("イベント情報を含むテンプレート URL を生成する", () => {
    const url = new URL(buildGoogleCalendarUrl(EVENT));
    expect(url.origin + url.pathname).toBe(
      "https://calendar.google.com/calendar/render"
    );
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
    expect(url.searchParams.get("text")).toBe("FEC Fukuoka 前夜祭");
    // JST 18:30-21:00 → UTC 09:30-12:00
    expect(url.searchParams.get("dates")).toBe(
      "20260911T093000Z/20260911T120000Z"
    );
    expect(url.searchParams.get("location")).toBe("福岡市中央区○○ビル 3F");
    expect(url.searchParams.get("ctz")).toBe("Asia/Tokyo");
    const details = url.searchParams.get("details");
    expect(details).toContain(EVENT.description);
    expect(details).toContain(EVENT.eventUrl);
    expect(details).toContain(EVENT.issueUrl);
    expect(details).toContain(EVENT.organizer);
  });

  it("長すぎる概要は切り詰めてもリンクは保持する", () => {
    const url = new URL(
      buildGoogleCalendarUrl({ ...EVENT, description: "あ".repeat(5000) })
    );
    const details = url.searchParams.get("details")!;
    expect(details.length).toBeLessThan(1200);
    expect(details).toContain("…");
    expect(details).toContain(EVENT.eventUrl);
    expect(details).toContain(EVENT.issueUrl);
  });
});
