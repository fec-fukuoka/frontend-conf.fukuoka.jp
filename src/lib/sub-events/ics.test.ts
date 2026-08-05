import { describe, expect, it } from "vitest";
import { buildIcsFeed, toIcsUtc } from "./ics";
import type { SubEvent } from "./types";

const encoder = new TextEncoder();

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

/** 折返し（CRLF + スペース）を復元した論理行に戻す */
function unfold(ics: string): string[] {
  return ics.replace(/\r\n /g, "").split("\r\n").filter(Boolean);
}

describe("toIcsUtc", () => {
  it("JST オフセット付き ISO 8601 を UTC 基本形式へ変換する", () => {
    expect(toIcsUtc("2026-09-11T18:30:00+09:00")).toBe("20260911T093000Z");
  });

  it("日をまたぐ変換（JST 未明 → 前日 UTC）を正しく行う", () => {
    expect(toIcsUtc("2026-09-13T01:00:00+09:00")).toBe("20260912T160000Z");
  });

  it("GitHub API の updated_at（UTC）も変換できる", () => {
    expect(toIcsUtc("2026-08-01T03:15:00Z")).toBe("20260801T031500Z");
  });
});

describe("buildIcsFeed", () => {
  it("RFC 5545 の骨格（CRLF・カレンダープロパティ・VEVENT）を出力する", () => {
    const ics = buildIcsFeed([EVENT]);
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    // CRLF 以外の裸の改行が存在しない
    expect(ics.replaceAll("\r\n", "").includes("\n")).toBe(false);

    const lines = unfold(ics);
    expect(lines).toContain("VERSION:2.0");
    expect(lines).toContain("METHOD:PUBLISH");
    expect(lines).toContain("X-WR-TIMEZONE:Asia/Tokyo");
    expect(lines).toContain("UID:sub-event-42@frontend-conf.fukuoka.jp");
    expect(lines).toContain("DTSTART:20260911T093000Z");
    expect(lines).toContain("DTEND:20260911T120000Z");
    expect(lines).toContain("DTSTAMP:20260801T031500Z");
    expect(lines).toContain("LAST-MODIFIED:20260801T031500Z");
    expect(lines).toContain("SUMMARY:FEC Fukuoka 前夜祭");
  });

  it("全行が 75 オクテット以内に折り返され、継続行はスペースで始まる", () => {
    const ics = buildIcsFeed([
      {
        ...EVENT,
        name: "とても長いイベント名".repeat(10),
        description: "長い概要 🍻 emoji入り。".repeat(50),
      },
    ]);
    for (const line of ics.split("\r\n")) {
      expect(encoder.encode(line).length).toBeLessThanOrEqual(75);
    }
    expect(ics).toContain("\r\n ");
    // 折返しを復元すると元のテキストが壊れていない（絵文字・多バイト境界の検証）
    const summary = unfold(ics).find((line) => line.startsWith("SUMMARY:"));
    expect(summary).toBe(`SUMMARY:${"とても長いイベント名".repeat(10)}`);
  });

  it("TEXT 値のカンマ・セミコロン・バックスラッシュ・改行をエスケープする", () => {
    const ics = buildIcsFeed([
      {
        ...EVENT,
        name: "Party; drinks, snacks\\fun",
        venue: "3F, Bldg A",
        description: "1行目\n2行目",
      },
    ]);
    const lines = unfold(ics);
    expect(lines).toContain("SUMMARY:Party\\; drinks\\, snacks\\\\fun");
    expect(lines).toContain("LOCATION:3F\\, Bldg A");
    const description = lines.find((line) => line.startsWith("DESCRIPTION:"));
    expect(description).toContain("1行目\\n2行目");
  });

  it("UID は Issue 番号から導出され内容の編集で変わらない", () => {
    const before = unfold(buildIcsFeed([EVENT]));
    const after = unfold(
      buildIcsFeed([
        { ...EVENT, name: "改名後", updatedAt: "2026-08-02T00:00:00Z" },
      ])
    );
    const uid = "UID:sub-event-42@frontend-conf.fukuoka.jp";
    expect(before).toContain(uid);
    expect(after).toContain(uid);
    expect(after).toContain("DTSTAMP:20260802T000000Z");
  });

  it("イベント 0 件でも妥当なカレンダーを返す（close・ラベル除去で消えるケース）", () => {
    const ics = buildIcsFeed([]);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).not.toContain("BEGIN:VEVENT");
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });
});
