/**
 * Community sub-events: single source of truth for the yearly settings.
 *
 * 年度更新時に変更する箇所:
 * 1. このファイルの SUB_EVENT_YEAR
 * 2. .github/ISSUE_TEMPLATE/Sub_Event_<year>.yml の新設
 * 3. src/pages/<year>/sub-events.astro と sub-events.ics.ts
 * 4. src/data/navigation.ts のパス
 */
export const SUB_EVENT_YEAR = 2026;

export const SUB_EVENT_LABEL = `sub-event-${SUB_EVENT_YEAR}`;

export const SUB_EVENT_REPO = {
  owner: "fec-fukuoka",
  repo: "frontend-conf.fukuoka.jp",
} as const;

export const SUB_EVENT_TEMPLATE = `Sub_Event_${SUB_EVENT_YEAR}.yml`;

export const SUB_EVENT_SUBMIT_URL = `https://github.com/${SUB_EVENT_REPO.owner}/${SUB_EVENT_REPO.repo}/issues/new?template=${SUB_EVENT_TEMPLATE}`;

export const SUB_EVENT_UID_DOMAIN = "frontend-conf.fukuoka.jp";

/**
 * Issue Form (.github/ISSUE_TEMPLATE/Sub_Event_2026.yml) の各フィールド label と
 * 完全一致させること。GitHub は Issue Form の入力を「### <label>」見出し付きの
 * Markdown 本文に直列化するため、この表がフォームとパーサーの対応表になる。
 * 整合性は template-sync.test.ts で検証される。
 */
export const FORM_HEADINGS = {
  name: "イベント名 / Event Name",
  startsAt: "開始日時（JST） / Start Date & Time (JST)",
  endsAt: "終了日時（JST） / End Date & Time (JST)",
  venue: "会場またはオンライン / Venue or Online",
  organizer: "主催者・コミュニティ名 / Organizer or Community",
  eventUrl: "参加・詳細URL / Registration or Details URL",
  language: "主な言語 / Primary Language",
  description: "イベント概要 / Event Description",
  terms: "同意事項 / Terms and Conditions",
} as const;

export type FormFieldKey = keyof typeof FORM_HEADINGS;
