import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { load } from "js-yaml";
import {
  FORM_HEADINGS,
  SUB_EVENT_LABEL,
  SUB_EVENT_TEMPLATE,
} from "./constants";

interface IssueFormElement {
  type: string;
  attributes?: { label?: string };
}

interface IssueFormTemplate {
  labels: string[];
  body: IssueFormElement[];
}

const template = load(
  readFileSync(
    new URL(
      `../../../.github/ISSUE_TEMPLATE/${SUB_EVENT_TEMPLATE}`,
      import.meta.url
    ),
    "utf8"
  )
) as IssueFormTemplate;

describe("Issue Form テンプレートとパーサー定数の同期", () => {
  it("フォームの全フィールド label が FORM_HEADINGS と一致する", () => {
    const templateLabels = template.body
      .filter((element) => element.type !== "markdown")
      .map((element) => element.attributes?.label);
    expect(templateLabels).toEqual(Object.values(FORM_HEADINGS));
  });

  it("フォームの初期ラベルが SUB_EVENT_LABEL と一致する", () => {
    expect(template.labels).toEqual([SUB_EVENT_LABEL]);
  });
});
