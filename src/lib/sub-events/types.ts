/** Normalized community sub-event as published on the site. */
export interface SubEvent {
  issueNumber: number;
  issueUrl: string;
  issueAuthor: string;
  name: string;
  /** ISO 8601 with explicit +09:00 offset, e.g. "2026-09-11T18:30:00+09:00" */
  startsAt: string;
  /** Same format as startsAt */
  endsAt: string;
  venue: string;
  organizer: string;
  eventUrl: string;
  /** OGP・バナー画像の URL（任意、https のみ） */
  imageUrl?: string;
  language?: string;
  description: string;
  /** issue.updated_at — drives DTSTAMP / LAST-MODIFIED in the ICS feed */
  updatedAt: string;
}

/** Minimal shape of a GitHub REST API issue that the parser relies on. */
export interface GitHubIssue {
  number: number;
  html_url: string;
  body: string | null;
  updated_at: string;
  user: { login: string } | null;
  /** Present only when the item is a pull request (the issues API returns both). */
  pull_request?: unknown;
}

export type ParseResult =
  | { ok: true; event: SubEvent }
  | { ok: false; issueNumber: number; reasons: string[] };
