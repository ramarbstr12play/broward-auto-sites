#!/usr/bin/env node

/**
 * import-leads.mjs
 *
 * Reads a CSV or JSON file of scraped business leads and creates
 * a JSON config file per business in ./data/.
 *
 * Supported input formats:
 *   CSV  — columns: business_name, city, service_category, phone, email, address, services (semicolon-separated)
 *   JSON — array of objects with the same fields
 *
 * Usage:
 *   node scripts/import-leads.mjs leads.csv
 *   node scripts/import-leads.mjs leads.json
 *   node scripts/import-leads.mjs leads.csv --out ./data
 */

import fs from "node:fs";
import path from "node:path";

// ── Args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help")) {
  console.log(`
Usage: node scripts/import-leads.mjs <leads-file> [--out <dir>]

Formats:
  CSV columns: business_name, city, service_category, phone, email, address, services
               ("services" is semicolon-separated, e.g. "Drain Cleaning;Leak Detection")
  JSON: array of objects with the same fields

Options:
  --out <dir>   Output directory for configs (default: ./data)
  --help        Show this help
`);
  process.exit(0);
}

const outIdx = args.indexOf("--out");
const outDir = outIdx !== -1 && args[outIdx + 1]
  ? path.resolve(args[outIdx + 1])
  : path.resolve("data");

const inputFile = path.resolve(args.filter((a, i) => {
  if (a === "--out") return false;
  if (outIdx !== -1 && i === outIdx + 1) return false;
  return true;
})[0]);

if (!fs.existsSync(inputFile)) {
  console.error(`File not found: ${inputFile}`);
  process.exit(1);
}

// ── Parse input ─────────────────────────────────────────────────────────

function parseCSV(text) {
  const lines = text.trim().split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/[^a-z_]/g, ""));

  return lines.slice(1).map((line) => {
    const values = [];
    let current = "";
    let inQuotes = false;

    for (const ch of line) {
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    values.push(current.trim());

    const obj = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ""; });
    return obj;
  });
}

const raw = fs.readFileSync(inputFile, "utf8");
const ext = path.extname(inputFile).toLowerCase();
let leads;

if (ext === ".json") {
  leads = JSON.parse(raw);
  if (!Array.isArray(leads)) {
    console.error("JSON file must contain an array of lead objects.");
    process.exit(1);
  }
} else {
  leads = parseCSV(raw);
}

if (leads.length === 0) {
  console.error("No leads found in input file.");
  process.exit(1);
}

// ── Default colors by category ──────────────────────────────────────────

const COLOR_PRESETS = {
  plumbing:    { primary: "#004AAD", accent: "#FF7A00" },
  electrical:  { primary: "#1B5E20", accent: "#FFD600" },
  hvac:        { primary: "#0D47A1", accent: "#FF6D00" },
  roofing:     { primary: "#4E342E", accent: "#FF8F00" },
  landscaping: { primary: "#33691E", accent: "#AEEA00" },
  cleaning:    { primary: "#00695C", accent: "#26C6DA" },
  painting:    { primary: "#283593", accent: "#FF7043" },
  default:     { primary: "#004AAD", accent: "#FF7A00" },
};

function getColors(category) {
  const key = (category || "").toLowerCase();
  return COLOR_PRESETS[key] || COLOR_PRESETS.default;
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ── Generate configs ────────────────────────────────────────────────────

fs.mkdirSync(outDir, { recursive: true });
let created = 0;

for (const lead of leads) {
  if (!lead.business_name) {
    console.warn("Skipping lead with no business_name:", lead);
    continue;
  }

  const servicesRaw = lead.services || lead.services_list || "";
  const servicesList = Array.isArray(servicesRaw)
    ? servicesRaw
    : servicesRaw.split(";").map((s) => s.trim()).filter(Boolean);

  const config = {
    business_name: lead.business_name,
    city: lead.city || "Fort Lauderdale",
    service_category: lead.service_category || "General Contractor",
    services_list: servicesList.length > 0
      ? servicesList
      : ["General Service"],
    phone: lead.phone || "",
    email: lead.email || "",
    address: lead.address || "",
    service_area: lead.service_area || "Broward County",
    brand_colors: getColors(lead.service_category),
    current_year: new Date().getFullYear(),
  };

  const slug = slugify(config.business_name);
  const outPath = path.join(outDir, `${slug}.json`);

  if (fs.existsSync(outPath)) {
    console.warn(`Exists, skipping: ${outPath}`);
    continue;
  }

  fs.writeFileSync(outPath, JSON.stringify(config, null, 2) + "\n", "utf8");
  console.log(`✔ ${config.business_name} → ${outPath}`);
  created++;
}

console.log(`\nCreated ${created} config(s) in ${outDir}`);
if (created > 0) {
  console.log("Next: node scripts/generate-site-from-json.mjs ./data/*.json");
}
