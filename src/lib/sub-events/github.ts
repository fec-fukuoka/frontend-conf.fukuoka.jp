import { SUB_EVENT_LABEL, SUB_EVENT_REPO } from "./constants";
import { parseSubEventIssue } from "./parser";
import type { GitHubIssue, SubEvent } from "./types";

const PER_PAGE = 100;
/** 想定外のデータ量でも暴走しないための安全弁（100件/ページ × 10） */
const MAX_PAGES = 10;

/**
 * open かつ sub-event ラベル付きの Issue を GitHub REST API から全ページ取得する。
 * token が無い場合は未認証（60 req/h/IP）でアクセスする。
 */
export async function fetchSubEventIssues(
  token?: string
): Promise<GitHubIssue[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    // Node の fetch は User-Agent を送らず、GitHub API は UA 無しを 403 にする
    "User-Agent": "frontend-conf.fukuoka.jp-sub-events",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const issues: GitHubIssue[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = new URL(
      `https://api.github.com/repos/${SUB_EVENT_REPO.owner}/${SUB_EVENT_REPO.repo}/issues`
    );
    url.searchParams.set("state", "open");
    url.searchParams.set("labels", SUB_EVENT_LABEL);
    url.searchParams.set("per_page", String(PER_PAGE));
    url.searchParams.set("page", String(page));

    const response = await fetch(url, { headers });
    if (!response.ok) {
      const remaining = response.headers.get("x-ratelimit-remaining");
      throw new Error(
        `GitHub API responded ${response.status} (ratelimit remaining: ${remaining ?? "unknown"})`
      );
    }

    const batch = (await response.json()) as GitHubIssue[];
    // /issues は Pull Request も返すため除外する
    issues.push(...batch.filter((issue) => !("pull_request" in issue)));
    if (batch.length < PER_PAGE) break;
  }
  return issues;
}

/**
 * 公開対象のサブイベントを取得して正規化し、開始日時の昇順で返す。
 * 解析できない Issue は一覧全体を失敗させず、理由をサーバーログに残して除外する。
 */
export async function loadSubEvents(token?: string): Promise<SubEvent[]> {
  const issues = await fetchSubEventIssues(token);
  const events: SubEvent[] = [];
  for (const issue of issues) {
    const result = parseSubEventIssue(issue);
    if (result.ok) {
      events.push(result.event);
    } else {
      console.warn(
        `[sub-events] skip issue #${result.issueNumber}: ${result.reasons.join("; ")}`
      );
    }
  }
  // 同一オフセット(+09:00)の ISO 8601 なので文字列比較で時系列順になる
  return events.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
