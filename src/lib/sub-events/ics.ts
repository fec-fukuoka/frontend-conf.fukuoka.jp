import { SUB_EVENT_UID_DOMAIN, SUB_EVENT_YEAR } from "./constants";
import type { SubEvent } from "./types";

const CRLF = "\r\n";
/** RFC 5545 3.1: 1行は折返し含め75オクテット以内 */
const MAX_LINE_OCTETS = 75;

const encoder = new TextEncoder();

/**
 * オフセット付き ISO 8601 を iCalendar の UTC 形式に変換する。
 * "2026-09-11T18:30:00+09:00" → "20260911T093000Z"
 * JST は固定 +09:00（DST なし）なので UTC 変換は無損失で、VTIMEZONE の同梱義務を回避できる。
 */
export function toIcsUtc(iso: string): string {
  return new Date(iso)
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z")
    .replace(/[-:]/g, "");
}

/** RFC 5545 3.3.11 TEXT のエスケープ（backslash を最初に処理する） */
function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

/**
 * 75オクテット超の行を折り返す（継続行は先頭に半角スペース）。
 * オクテット数は UTF-8 で数え、コードポイント境界でのみ分割する
 * （日本語・絵文字をバイト途中で切らない）。
 */
function foldLine(line: string): string {
  if (encoder.encode(line).length <= MAX_LINE_OCTETS) return line;

  const folded: string[] = [];
  let current = "";
  let currentOctets = 0;
  for (const char of line) {
    const charOctets = encoder.encode(char).length;
    if (currentOctets + charOctets > MAX_LINE_OCTETS) {
      folded.push(current);
      current = " ";
      currentOctets = 1;
    }
    current += char;
    currentOctets += charOctets;
  }
  folded.push(current);
  return folded.join(CRLF);
}

/**
 * 全公開サブイベントの iCalendar フィードを生成する。
 * UID は Issue 番号から導出して不変（Issue 編集では同一イベントとして更新され、
 * close / ラベル除去でフィードから消えると購読側でも削除される）。
 */
export function buildIcsFeed(events: SubEvent[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//Frontend Conference Fukuoka//Sub Events ${SUB_EVENT_YEAR}//JA`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:Frontend Conf Fukuoka ${SUB_EVENT_YEAR} Community Sub-Events`,
    "X-WR-TIMEZONE:Asia/Tokyo",
  ];

  for (const event of events) {
    const description = [
      event.description,
      "",
      `主催 / Organizer: ${event.organizer}`,
      `詳細 / Details: ${event.eventUrl}`,
      `GitHub Issue: ${event.issueUrl}`,
    ].join("\n");

    lines.push(
      "BEGIN:VEVENT",
      `UID:sub-event-${event.issueNumber}@${SUB_EVENT_UID_DOMAIN}`,
      `DTSTAMP:${toIcsUtc(event.updatedAt)}`,
      `LAST-MODIFIED:${toIcsUtc(event.updatedAt)}`,
      `DTSTART:${toIcsUtc(event.startsAt)}`,
      `DTEND:${toIcsUtc(event.endsAt)}`,
      `SUMMARY:${escapeIcsText(event.name)}`,
      `LOCATION:${escapeIcsText(event.venue)}`,
      `DESCRIPTION:${escapeIcsText(description)}`,
      `URL:${event.eventUrl}`,
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.map(foldLine).join(CRLF) + CRLF;
}
