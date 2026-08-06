/**
 * Community sub-events: single source of truth for the settings.
 *
 * ラベル・Issue テンプレート・登録 URL は年度に依存しない。どの年度のページに
 * 掲載するかは、Issue に入力された開始日時の年（EDITION_YEAR）で振り分ける。
 *
 * 年度更新時に変更する箇所:
 * 1. src/pages/<year>/sub-events.astro と sub-events.ics.ts を新年度ディレクトリへ
 *    複製し、それぞれの EDITION_YEAR を更新する
 * 2. netlify.toml の /sub-events・/sub-events.ics リダイレクト先を新年度に向ける
 * 3. src/data/navigation.ts のパスを更新する
 */
export const SUB_EVENT_LABEL = "sub-event";

/**
 * 掲載承認ラベル。バリデーション通過後に運営が手動で付与し、
 * open かつ SUB_EVENT_LABEL とこのラベルの両方が付いた Issue だけが掲載される。
 * Issue 本文が編集されると CI（validate-sub-event.yml）が自動で外し、再承認まで掲載を停止する。
 * ラベル名を変える場合は .github/workflows/validate-sub-event.yml も更新すること。
 */
export const SUB_EVENT_APPROVED_LABEL = "sub-event:approved";

export const SUB_EVENT_REPO = {
  owner: "fec-fukuoka",
  repo: "frontend-conf.fukuoka.jp",
} as const;

export const SUB_EVENT_TEMPLATE = "Sub_Event.yml";

export const SUB_EVENT_SUBMIT_URL = `https://github.com/${SUB_EVENT_REPO.owner}/${SUB_EVENT_REPO.repo}/issues/new?template=${SUB_EVENT_TEMPLATE}`;

export const SUB_EVENT_UID_DOMAIN = "frontend-conf.fukuoka.jp";

/**
 * Issue Form (.github/ISSUE_TEMPLATE/Sub_Event.yml) の各フィールド label と
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
  imageUrl: "画像URL / Image URL",
  language: "主な言語 / Primary Language",
  description: "イベント概要 / Event Description",
  terms: "同意事項 / Terms and Conditions",
} as const;

export type FormFieldKey = keyof typeof FORM_HEADINGS;
