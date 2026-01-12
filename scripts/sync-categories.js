#!/usr/bin/env node
/**
 * セッションカテゴリーをsession-categories.jsonから
 * Issue Templateに同期するスクリプト
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
      `Error loading categories from ${CATEGORIES_FILE}:`,
      error.message
    );
    process.exit(1);
  }
}

function updateTemplate(templatePath, categories) {
  try {
    let content = fs.readFileSync(templatePath, "utf8");

    // カテゴリーのoptionsセクションを置換
    // session-categoryのoptionsを探して置換
    const categoryOptionsRegex =
      /(id: session-category[\s\S]*?options:\s*\n)([\s\S]*?)(\n\s+validations:)/;

    const match = content.match(categoryOptionsRegex);
    if (!match) {
      console.warn(
        `Warning: Could not find session-category options in ${templatePath}`
      );
      return false;
    }

    // 新しいoptionsを生成
    const indent = "        ";
    const newOptions = categories.map((cat) => `${indent}- ${cat}`).join("\n");

    // 置換
    content = content.replace(categoryOptionsRegex, `$1${newOptions}\n$3`);

    fs.writeFileSync(templatePath, content, "utf8");
    return true;
  } catch (error) {
    console.error(`Error updating template ${templatePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log("🔄 Syncing session categories to Issue Templates...\n");

  const categories = loadCategories();
  console.log(
    `📋 Loaded ${categories.length} categories from ${CATEGORIES_FILE}`
  );
  console.log(`   Categories: ${categories.join(", ")}\n`);

  let success = true;
  for (const templatePath of TEMPLATES) {
    const templateName = path.basename(templatePath);
    process.stdout.write(`   Updating ${templateName}... `);

    if (updateTemplate(templatePath, categories)) {
      console.log("✅");
    } else {
      console.log("❌");
      success = false;
    }
  }

  if (success) {
    console.log("\n✨ All templates updated successfully!");
    process.exit(0);
  } else {
    console.log("\n❌ Some templates failed to update");
    process.exit(1);
  }
}

main();

export { loadCategories, updateTemplate };
