#!/usr/bin/env node
/**
 * Issue TemplateとJSONファイルのカテゴリー整合性をチェックするスクリプト
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CATEGORIES_FILE = path.join(
  __dirname,
  "../src/data/session-categories.json"
);
const TEMPLATES = [
  path.join(__dirname, "../.github/ISSUE_TEMPLATE/Proposal_General.yml"),
  path.join(__dirname, "../.github/ISSUE_TEMPLATE/Proposal_Guest.yml"),
];

function loadCategories() {
  try {
    const data = fs.readFileSync(CATEGORIES_FILE, "utf8");
    const json = JSON.parse(data);
    return json.categories;
  } catch (error) {
    console.error(
      `❌ Error loading categories from ${CATEGORIES_FILE}:`,
      error.message
    );
    process.exit(1);
  }
}

function extractCategoriesFromTemplate(templatePath) {
  try {
    const content = fs.readFileSync(templatePath, "utf8");

    // session-categoryのoptionsを抽出
    const categoryOptionsRegex =
      /id: session-category[\s\S]*?options:\s*\n([\s\S]*?)\n\s+validations:/;
    const match = content.match(categoryOptionsRegex);

    if (!match) {
      console.error(
        `❌ Could not find session-category options in ${templatePath}`
      );
      return null;
    }

    // optionsから各行を抽出（"- Category"形式）
    const optionsText = match[1];
    const categories = optionsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => line.substring(2).trim());

    return categories;
  } catch (error) {
    console.error(`❌ Error reading template ${templatePath}:`, error.message);
    return null;
  }
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

function main() {
  console.log("🔍 Checking categories synchronization...\n");

  const expectedCategories = loadCategories();
  console.log(`📋 Expected categories (${expectedCategories.length} items):`);
  console.log(`   ${expectedCategories.join(", ")}\n`);

  let allInSync = true;

  for (const templatePath of TEMPLATES) {
    const templateName = path.basename(templatePath);
    process.stdout.write(`   Checking ${templateName}... `);

    const templateCategories = extractCategoriesFromTemplate(templatePath);

    if (!templateCategories) {
      console.log("❌ Failed to extract categories");
      allInSync = false;
      continue;
    }

    if (arraysEqual(expectedCategories, templateCategories)) {
      console.log("✅ In sync");
    } else {
      console.log("❌ Out of sync");
      allInSync = false;

      // 差分を表示
      console.log("\n   Expected:");
      console.log(`   ${expectedCategories.join(", ")}`);
      console.log("\n   Found:");
      console.log(`   ${templateCategories.join(", ")}\n`);

      // 不一致の詳細
      const missing = expectedCategories.filter(
        (cat) => !templateCategories.includes(cat)
      );
      const extra = templateCategories.filter(
        (cat) => !expectedCategories.includes(cat)
      );

      if (missing.length > 0) {
        console.log(`   Missing in template: ${missing.join(", ")}`);
      }
      if (extra.length > 0) {
        console.log(`   Extra in template: ${extra.join(", ")}`);
      }
      console.log("");
    }
  }

  if (allInSync) {
    console.log("✨ All templates are in sync with session-categories.json!");
    process.exit(0);
  } else {
    console.log("❌ Some templates are out of sync.");
    console.log("   Run `pnpm run sync:categories` to synchronize them.");
    process.exit(1);
  }
}

main();

export { loadCategories, extractCategoriesFromTemplate };
