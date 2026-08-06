import { describe, expect, it } from "vitest";
import { FORM_HEADINGS } from "./constants";
import type { FormFieldKey } from "./constants";
import { parseSubEventIssue } from "./parser";
import type { GitHubIssue } from "./types";

const CHECKED_TERMS = [
  "- [x] [行動規範（Code of Conduct）](https://github.com/fec-fukuoka/frontend-conf.fukuoka.jp/wiki/CoC)を読み、イベント運営においても遵守することに同意します / I have read the Code of Conduct and agree to follow it in operating this event",
  "- [x] 入力した内容（イベント名、日時、会場、主催者、概要、URL）が公式ウェブサイトに掲載されることを了承します / I understand that the submitted content (event name, date, venue, organizer, description, URL) will be published on the official website",
].join("\n");

const VALID_FIELDS: Record<FormFieldKey, string> = {
  name: "FEC Fukuoka 前夜祭",
  startsAt: "2026-09-11 18:30",
  endsAt: "2026-09-11 21:00",
  venue: "福岡市中央区○○ビル 3F",
  organizer: "Fukuoka Frontend Meetup",
  eventUrl: "https://example.connpass.com/event/000000/",
  imageUrl: "https://example.com/ogp.png",
  language: "日本語",
  description: "カンファレンス前夜に開催する交流イベントです。",
  terms: CHECKED_TERMS,
};

/** GitHub が Issue Form を直列化する形式（### <label> + 空行 + 値）で本文を組み立てる */
function issueBody(
  overrides: Partial<Record<FormFieldKey, string>> = {},
  eol = "\n"
): string {
  const fields = { ...VALID_FIELDS, ...overrides };
  return (Object.keys(FORM_HEADINGS) as FormFieldKey[])
    .map((key) => `### ${FORM_HEADINGS[key]}\n\n${fields[key]}`)
    .join("\n\n")
    .replaceAll("\n", eol);
}

function issue(overrides: Partial<GitHubIssue> = {}): GitHubIssue {
  return {
    number: 42,
    html_url:
      "https://github.com/fec-fukuoka/frontend-conf.fukuoka.jp/issues/42",
    body: issueBody(),
    updated_at: "2026-08-01T03:15:00Z",
    user: { login: "octocat" },
    ...overrides,
  };
}

describe("parseSubEventIssue", () => {
  it("正常な Issue を SubEvent に正規化する", () => {
    const result = parseSubEventIssue(issue());
    expect(result).toEqual({
      ok: true,
      event: {
        issueNumber: 42,
        issueUrl:
          "https://github.com/fec-fukuoka/frontend-conf.fukuoka.jp/issues/42",
        issueAuthor: "octocat",
        name: "FEC Fukuoka 前夜祭",
        startsAt: "2026-09-11T18:30:00+09:00",
        endsAt: "2026-09-11T21:00:00+09:00",
        venue: "福岡市中央区○○ビル 3F",
        organizer: "Fukuoka Frontend Meetup",
        eventUrl: "https://example.connpass.com/event/000000/",
        imageUrl: "https://example.com/ogp.png",
        language: "日本語",
        description: "カンファレンス前夜に開催する交流イベントです。",
        updatedAt: "2026-08-01T03:15:00Z",
      },
    });
  });

  it("CRLF 改行の本文（GitHub API の実際の形式）を解析できる", () => {
    const result = parseSubEventIssue(issue({ body: issueBody({}, "\r\n") }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.event.startsAt).toBe("2026-09-11T18:30:00+09:00");
    }
  });

  it("本文が空なら除外する", () => {
    const result = parseSubEventIssue(issue({ body: null }));
    expect(result).toEqual({
      ok: false,
      issueNumber: 42,
      reasons: ["issue body is empty"],
    });
  });

  it("必須フィールドの欠落（_No response_）を検出する", () => {
    const result = parseSubEventIssue(
      issue({ body: issueBody({ name: "_No response_" }) })
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasons.join("; ")).toContain(FORM_HEADINGS.name);
    }
  });

  it.each([
    "2026/09/11 18:30",
    "2026-09-11",
    "18:30",
    "2026-02-30 10:00",
    "2026-09-11 25:00",
    "September 11, 2026 6:30pm",
  ])("不正な開始日時 %j を除外する", (startsAt) => {
    const result = parseSubEventIssue(issue({ body: issueBody({ startsAt }) }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasons.join("; ")).toContain("start date-time");
    }
  });

  it("区切りが T の日時も許容する", () => {
    const result = parseSubEventIssue(
      issue({ body: issueBody({ startsAt: "2026-09-11T18:30" }) })
    );
    expect(result.ok).toBe(true);
  });

  it("終了が開始以前なら除外する", () => {
    const result = parseSubEventIssue(
      issue({ body: issueBody({ endsAt: "2026-09-11 18:30" }) })
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasons.join("; ")).toContain("after start");
    }
  });

  it("日をまたぐイベントを許容する", () => {
    const result = parseSubEventIssue(
      issue({
        body: issueBody({
          startsAt: "2026-09-12 23:00",
          endsAt: "2026-09-13 01:00",
        }),
      })
    );
    expect(result.ok).toBe(true);
  });

  it.each(["not a url", "javascript:alert(1)", "ftp://example.com/"])(
    "不正な参加URL %j を除外する",
    (eventUrl) => {
      const result = parseSubEventIssue(
        issue({ body: issueBody({ eventUrl }) })
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reasons.join("; ")).toContain("event URL");
      }
    }
  );

  it("Markdown・HTML を含む概要をプレーンテキストのまま保持する", () => {
    const description =
      '**強調** と <script>alert("xss")</script> と [リンク](https://example.com)\n2行目';
    const result = parseSubEventIssue(
      issue({ body: issueBody({ description }) })
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.event.description).toBe(description);
    }
  });

  it("概要内のユーザー見出し（###）ではセクションが壊れない", () => {
    const description = "### タイムテーブル\n\n- 19:00 開場\n- 19:30 LT";
    const result = parseSubEventIssue(
      issue({ body: issueBody({ description }) })
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.event.description).toBe(description);
    }
  });

  it("絵文字・英語の入力を扱える", () => {
    const result = parseSubEventIssue(
      issue({
        body: issueBody({
          name: "🎉 FEC After Party 🎉",
          description: "Casual networking event. Everyone is welcome! 🍻",
          language: "English",
        }),
      })
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.event.name).toBe("🎉 FEC After Party 🎉");
      expect(result.event.language).toBe("English");
    }
  });

  it("画像URLが未入力（_No response_）なら undefined になる", () => {
    const result = parseSubEventIssue(
      issue({ body: issueBody({ imageUrl: "_No response_" }) })
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.event.imageUrl).toBeUndefined();
    }
  });

  it.each(["http://example.com/ogp.png", "not a url", "javascript:alert(1)"])(
    "https でない画像URL %j を除外する",
    (imageUrl) => {
      const result = parseSubEventIssue(
        issue({ body: issueBody({ imageUrl }) })
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reasons.join("; ")).toContain("image URL");
      }
    }
  );

  it("言語が未選択（_No response_）なら undefined になる", () => {
    const result = parseSubEventIssue(
      issue({ body: issueBody({ language: "_No response_" }) })
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.event.language).toBeUndefined();
    }
  });

  it("同意チェックが外れている Issue を除外する（本文の事後編集対策）", () => {
    const uncheckedTerms = CHECKED_TERMS.replace(
      "- [x] 入力した内容",
      "- [ ] 入力した内容"
    );
    const result = parseSubEventIssue(
      issue({ body: issueBody({ terms: uncheckedTerms }) })
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasons.join("; ")).toContain("terms");
    }
  });

  it("投稿者が削除済み（user: null）でも解析できる", () => {
    const result = parseSubEventIssue(issue({ user: null }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.event.issueAuthor).toBe("ghost");
    }
  });
});
