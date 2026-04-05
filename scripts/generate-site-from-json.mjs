import fs from "node:fs";
import path from "node:path";

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("Usage: node generate-site-from-json.mjs ./data/example.json");
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, "utf8");
const config = JSON.parse(raw);

// This is a placeholder for future automation.
// GitHub Copilot can help you:
// - Generate static HTML files from this config
// - Create multiple sites from a list of JSON configs
// - Integrate with scraping output

console.log("Loaded config for:", config.business_name);
console.log("Next step: implement static export logic here.");
