import { FORM_HEADINGS } from "./constants";
import type { FormFieldKey } from "./constants";
import type { GitHubIssue, ParseResult, SubEvent } from "./types";

/** GitHub が optional フィールドの未入力を表すのに使うプレースホルダー */
const NO_RESPONSE = "_No response_";

/** フォームの入力形式「YYYY-MM-DD HH:mm」（区切りは T も許容） */
const DATE_TIME_PATTERN = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})$/;

const HEADING_TO_KEY = new Map<string, FormFieldKey>(
  (Object.entries(FORM_HEADINGS) as [FormFieldKey, string][]).map(
    ([key, heading]) => [heading, key]
  )
);

/**
 * Issue Form が直列化した本文を「### <既知の見出し>」単位のセクションに分割する。
 * FORM_HEADINGS に完全一致する見出し行だけを境界として扱うため、textarea 内に
 * ユーザーが書いた任意の「### 」見出しでは壊れない。
 */
function splitSections(body: string): Map<FormFieldKey, string> {
  const sections = new Map<FormFieldKey, string>();
  let currentKey: FormFieldKey | null = null;
  let currentLines: string[] = [];

  const flush = () => {
    if (currentKey !== null) {
      sections.set(currentKey, currentLines.join("\n").trim());
    }
    currentLines = [];
  };

  for (const line of body.split(/\r\n|\r|\n/)) {
    const key = line.startsWith("### ")
      ? HEADING_TO_KEY.get(line.slice(4).trim())
      : undefined;
    if (key !== undefined) {
      flush();
      currentKey = key;
    } else {
      currentLines.push(line);
    }
  }
  flush();

  return sections;
}

function fieldValue(
  sections: Map<FormFieldKey, string>,
  key: FormFieldKey
): string | undefined {
  const raw = sections.get(key);
  if (raw === undefined || raw === "" || raw === NO_RESPONSE) return undefined;
  return raw;
}

/** "2026-09-11 18:30" (JST) → "2026-09-11T18:30:00+09:00"。不正な形式・存在しない日時は undefined */
function parseJstDateTime(value: string): string | undefined {
  const match = DATE_TIME_PATTERN.exec(value);
  if (!match) return undefined;
  const iso = `${match[1]}T${match[2]}:00+09:00`;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  // V8 は 2026-02-30 のような存在しない日付をロールオーバーして受理するため、
  // UTC+9h の壁時計時刻に戻して入力と一致するか検証する
  const wallClock = new Date(date.getTime() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  if (wallClock !== `${match[1]}T${match[2]}`) return undefined;
  return iso;
}

function parseHttpUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}

/**
 * 同意チェックボックスのセクションを検証する。フォーム上は required だが、
 * Issue 本文は提出後に自由に編集できるため、`- [x]` の存在を毎回確認する。
 */
function termsAccepted(section: string | undefined): boolean {
  if (section === undefined) return false;
  const checked = section.match(/^- \[[xX]\] /gm)?.length ?? 0;
  const unchecked = section.match(/^- \[ \] /gm)?.length ?? 0;
  return checked >= 2 && unchecked === 0;
}

/**
 * GitHub Issue を正規化済み SubEvent に変換する。掲載条件を満たさない Issue は
 * `{ ok: false, reason }` を返し、呼び出し側でログに残して除外する。
 */
export function parseSubEventIssue(issue: GitHubIssue): ParseResult {
  const fail = (reason: string): ParseResult => ({
    ok: false,
    issueNumber: issue.number,
    reason,
  });

  if (!issue.body) return fail("issue body is empty");

  const sections = splitSections(issue.body);
  const problems: string[] = [];

  const requiredKeys = [
    "name",
    "venue",
    "organizer",
    "description",
  ] as const satisfies readonly FormFieldKey[];
  for (const key of requiredKeys) {
    if (fieldValue(sections, key) === undefined) {
      problems.push(`missing required field "${FORM_HEADINGS[key]}"`);
    }
  }

  const startsAtRaw = fieldValue(sections, "startsAt");
  const startsAt =
    startsAtRaw === undefined ? undefined : parseJstDateTime(startsAtRaw);
  if (startsAt === undefined) {
    problems.push(`invalid or missing start date-time: "${startsAtRaw ?? ""}"`);
  }

  const endsAtRaw = fieldValue(sections, "endsAt");
  const endsAt =
    endsAtRaw === undefined ? undefined : parseJstDateTime(endsAtRaw);
  if (endsAt === undefined) {
    problems.push(`invalid or missing end date-time: "${endsAtRaw ?? ""}"`);
  }

  if (
    startsAt !== undefined &&
    endsAt !== undefined &&
    new Date(endsAt).getTime() <= new Date(startsAt).getTime()
  ) {
    problems.push("end date-time must be after start date-time");
  }

  const eventUrlRaw = fieldValue(sections, "eventUrl");
  const eventUrl =
    eventUrlRaw === undefined ? undefined : parseHttpUrl(eventUrlRaw);
  if (eventUrl === undefined) {
    problems.push(`invalid or missing event URL: "${eventUrlRaw ?? ""}"`);
  }

  if (!termsAccepted(sections.get("terms"))) {
    problems.push("terms checkboxes are not all checked");
  }

  if (problems.length > 0) return fail(problems.join("; "));

  const event: SubEvent = {
    issueNumber: issue.number,
    issueUrl: issue.html_url,
    issueAuthor: issue.user?.login ?? "ghost",
    name: fieldValue(sections, "name")!,
    startsAt: startsAt!,
    endsAt: endsAt!,
    venue: fieldValue(sections, "venue")!,
    organizer: fieldValue(sections, "organizer")!,
    eventUrl: eventUrl!,
    language: fieldValue(sections, "language"),
    description: fieldValue(sections, "description")!,
    updatedAt: issue.updated_at,
  };
  return { ok: true, event };
}
