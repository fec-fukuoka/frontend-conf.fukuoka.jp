/**
 * GitHub Actions（validate-sub-event.yml）から Issue 本文を検証する CLI ラッパー。
 * サイト掲載時と同一のパーサー（src/lib/sub-events/parser.ts）を使うことで、
 * 「バリデーションは通るのにサイトに載らない」という判定のズレをなくす。
 *
 * 入力: 環境変数 ISSUE_NUMBER / ISSUE_BODY
 * 出力: GITHUB_OUTPUT に result=<JSON {valid, reasons}> を追記（stdout にも出力）
 * 実行: pnpm exec tsx scripts/validate-sub-event-issue.ts
 */
import { appendFileSync } from "node:fs";
import { parseSubEventIssue } from "../src/lib/sub-events/parser";

const result = parseSubEventIssue({
  number: Number(process.env.ISSUE_NUMBER ?? 0),
  body: process.env.ISSUE_BODY ?? null,
  html_url: "",
  updated_at: new Date().toISOString(),
  user: null,
});

const output = JSON.stringify(
  result.ok
    ? { valid: true, reasons: [] }
    : { valid: false, reasons: result.reasons }
);

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `result=${output}\n`);
}
console.log(output);
