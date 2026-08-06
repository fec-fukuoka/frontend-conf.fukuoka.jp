import { describe, expect, it } from "vitest";
import { filterByEditionYear } from "./github";
import type { SubEvent } from "./types";

function event(startsAt: string): SubEvent {
  return {
    issueNumber: 1,
    issueUrl:
      "https://github.com/fec-fukuoka/frontend-conf.fukuoka.jp/issues/1",
    issueAuthor: "octocat",
    name: "event",
    startsAt,
    endsAt: startsAt,
    venue: "venue",
    organizer: "organizer",
    eventUrl: "https://example.com/",
    description: "description",
    updatedAt: "2026-08-01T00:00:00Z",
  };
}

describe("filterByEditionYear", () => {
  it("開始日時（JST）の年でイベントを振り分ける", () => {
    const events = [
      event("2025-12-31T23:00:00+09:00"),
      event("2026-01-01T00:00:00+09:00"),
      event("2026-09-11T18:30:00+09:00"),
      event("2027-01-10T19:00:00+09:00"),
    ];
    const filtered = filterByEditionYear(events, 2026);
    expect(filtered.map((e) => e.startsAt)).toEqual([
      "2026-01-01T00:00:00+09:00",
      "2026-09-11T18:30:00+09:00",
    ]);
  });

  it("該当年のイベントがなければ空配列を返す", () => {
    expect(
      filterByEditionYear([event("2026-09-11T18:30:00+09:00")], 2027)
    ).toEqual([]);
  });
});
