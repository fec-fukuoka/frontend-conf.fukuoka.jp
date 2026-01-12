セッションカテゴリーは Single Source of Truth (SSOT) として `src/data/session-categories.json` で一元管理されています。

#### カテゴリーの追加・変更

1. `src/data/session-categories.json` を編集
2. Issue Templates に変更を同期:

   ```bash
   pnpm run sync:categories
   ```

3. 整合性を確認（任意）:

   ```bash
   pnpm run check:categories
   ```

#### 関連ファイル

- `src/data/session-categories.json` - カテゴリー定義（SSOT）
- `src/content.config.ts` - Astro コンテンツコレクション設定（JSONから自動読込）
- `.github/ISSUE_TEMPLATE/Proposal_*.yml` - Issue Templates（`sync:categories`で自動更新）
- `.github/workflows/validate-proposal.yml` - プロポーザル検証ワークフロー（JSONから自動読込）
- `hooks/pre-commit` - commit時の整合性チェック
