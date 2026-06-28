// セッションカテゴリごとのアクセントカラー。
// キーは src/data/session-categories.json の categories と一致させること。
// ダーク背景で視認できるよう lightness/chroma を揃え、hue で色相を散らしている。
export const sessionCategoryColors: Record<string, string> = {
  CSS: "oklch(72% 0.15 264)",
  Accessibility: "oklch(74% 0.15 150)",
  Performance: "oklch(73% 0.16 45)",
  "ECMAScript/Web API": "oklch(78% 0.12 195)",
  "Server-side JS": "oklch(70% 0.16 300)",
  "Privacy & Security": "oklch(68% 0.19 25)",
  "FE Ecosystem/Tooling": "oklch(72% 0.19 330)",
  Testing: "oklch(76% 0.13 175)",
  "Design Engineering": "oklch(78% 0.15 95)",
  Architecture: "oklch(70% 0.15 285)",
  Browsers: "oklch(73% 0.15 230)",
  "Web Standards": "oklch(74% 0.14 130)",
  "Other / その他": "oklch(72% 0.02 264)",
};

const FALLBACK_COLOR = "var(--color-text-secondary)";

/** カテゴリ名からアクセントカラーを返す。未定義カテゴリはフォールバック色。 */
export function getSessionCategoryColor(category: string): string {
  return sessionCategoryColors[category] ?? FALLBACK_COLOR;
}
