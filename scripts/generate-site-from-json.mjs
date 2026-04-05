#!/usr/bin/env node

/**
 * generate-site-from-json.mjs
 *
 * Reads one or more JSON config files and outputs a static HTML site per business.
 *
 * Usage:
 *   node scripts/generate-site-from-json.mjs ./data/example-plumber.json
 *   node scripts/generate-site-from-json.mjs ./data/*.json
 *   node scripts/generate-site-from-json.mjs ./data/*.json --out ./sites
 */

import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// ── Args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help')) {
  console.log(`
Usage: node scripts/generate-site-from-json.mjs <file(s)> [--out <dir>]

  <file(s)>   One or more JSON config paths (glob ok on shells that expand them)
  --out <dir>  Root output directory (default: ./output)
  --help       Show this help
`);
  process.exit(0);
}

const outFlagIdx = args.indexOf('--out');
const outRoot =
  outFlagIdx !== -1 && args[outFlagIdx + 1]
    ? path.resolve(args[outFlagIdx + 1])
    : path.resolve('output');

const rawPaths = args.filter((a, i) => {
  if (a === '--out') return false;
  if (outFlagIdx !== -1 && i === outFlagIdx + 1) return false;
  return true;
});

// Expand globs (e.g. ./data/*.json) that shells like cmd.exe don't expand
const jsonPaths = rawPaths.flatMap((p) => {
  if (p.includes('*')) {
    const dir = path.resolve(path.dirname(p));
    const pattern = path.basename(p);
    const regex = new RegExp(
      '^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$'
    );
    try {
      return fs
        .readdirSync(dir)
        .filter((f) => regex.test(f))
        .map((f) => path.join(dir, f));
    } catch {
      return [];
    }
  }
  return [p];
});

if (jsonPaths.length === 0) {
  console.error('No JSON files provided.');
  process.exit(1);
}

// ── Helpers ─────────────────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderPage(config, { title, bodyHTML }) {
  const c = config;
  const pageTitle = title
    ? `${title} | ${c.business_name}`
    : `${c.business_name} | ${c.service_category} in ${c.city}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(`Professional ${c.service_category.toLowerCase()} services in ${c.service_area}. Call ${c.phone}.`)}" />
  <meta name="keywords" content="${esc(`${c.service_category}, ${c.city}, ${c.service_area}`)}" />
  <script type="application/ld+json">
  ${JSON.stringify(buildSchema(c), null, 2)}
  </script>
  <style>
    body { margin:0; font-family:system-ui,-apple-system,sans-serif; color:#1a1a1a; background:#fff; }
    .container { width:90%; max-width:1100px; margin:auto; }
    header, footer { padding:16px 0; }
    header .container { display:flex; justify-content:space-between; align-items:center; }
    nav a { margin-right:16px; text-decoration:none; color:#1a1a1a; }
    .hero { padding:80px 0; text-align:center; color:white; }
    .btn-primary { display:inline-block; padding:10px 20px; border-radius:6px; text-decoration:none; color:#fff; }
    .service-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; }
    .service-card { border:1px solid #eee; border-radius:8px; padding:16px; }
    .contact-grid { display:grid; grid-template-columns:1fr 1fr; gap:48px; }
    @media(max-width:768px){ .contact-grid{grid-template-columns:1fr;} }
    .contact-form label { display:block; margin-bottom:16px; font-size:0.9rem; font-weight:500; }
    .contact-form input, .contact-form textarea { display:block; width:100%; margin-top:4px; padding:10px 12px; border:1px solid #ccc; border-radius:6px; font-size:1rem; box-sizing:border-box; }
    .cta-section { padding:48px 0; text-align:center; color:#fff; }
    .highlights-list { list-style:none; padding:0; }
    .highlights-list li { padding:8px 0; border-bottom:1px solid #f0f0f0; }
    .highlights-list li::before { content:"✓ "; color:#16a34a; font-weight:bold; }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <strong>${esc(c.business_name)}</strong>
      <nav>
        <a href="index.html">Home</a>
        <a href="services.html">Services</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
      </nav>
    </div>
  </header>
  <main>${bodyHTML}</main>
  <footer>
    <div class="container">
      <p>&copy; ${c.current_year} ${esc(c.business_name)} &mdash; Serving ${esc(c.service_area)}</p>
    </div>
  </footer>
</body>
</html>`;
}

function buildSchema(c) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: c.business_name,
    telephone: c.phone,
    email: c.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.address,
      addressLocality: c.city,
      addressRegion: 'FL',
      addressCountry: 'US'
    },
    areaServed: c.service_area,
    description: `Professional ${c.service_category.toLowerCase()} services in ${c.service_area}.`
  };
}

function homeBody(c) {
  return `
  <section class="hero" style="background:${c.brand_colors.primary}">
    <div class="container">
      <h2>Reliable ${esc(c.service_category)} in ${esc(c.city)}</h2>
      <p>Trusted by homeowners and businesses across ${esc(c.service_area)}.</p>
      <a href="tel:${esc(c.phone)}" class="btn-primary" style="background:${c.brand_colors.accent}">${esc(c.phone)} — Call Now</a>
    </div>
  </section>
  <section style="padding:48px 0">
    <div class="container">
      <h3>Our Services</h3>
      <div class="service-grid">
        ${c.services_list.map((s) => `<div class="service-card"><h4>${esc(s)}</h4><p>Professional ${esc(s.toLowerCase())} services in ${esc(c.city)}.</p></div>`).join('\n        ')}
      </div>
    </div>
  </section>
  <section class="cta-section" style="background:${c.brand_colors.accent}">
    <div class="container">
      <h3>Need ${esc(c.service_category)} Help? Call Today!</h3>
      <a href="tel:${esc(c.phone)}" class="btn-primary" style="background:${c.brand_colors.primary}">${esc(c.phone)}</a>
    </div>
  </section>`;
}

function servicesBody(c) {
  return `
  <section class="hero" style="background:${c.brand_colors.primary}">
    <div class="container">
      <h2>Our ${esc(c.service_category)} Services</h2>
      <p>Professional solutions across ${esc(c.service_area)}.</p>
    </div>
  </section>
  <section style="padding:48px 0">
    <div class="container">
      <div class="service-grid">
        ${c.services_list.map((s) => `<div class="service-card"><h4>${esc(s)}</h4><p>Professional ${esc(s.toLowerCase())} services in ${esc(c.city)} and surrounding areas.</p></div>`).join('\n        ')}
      </div>
    </div>
  </section>`;
}

function aboutBody(c) {
  return `
  <section class="hero" style="background:${c.brand_colors.primary}">
    <div class="container"><h2>About ${esc(c.business_name)}</h2></div>
  </section>
  <section style="padding:48px 0">
    <div class="container">
      <p style="font-size:1.1rem;line-height:1.8">${esc(c.business_name)} has been proudly serving ${esc(c.city)} and the greater ${esc(c.service_area)} area with professional ${esc(c.service_category.toLowerCase())} services.</p>
      <h3>Why Choose Us</h3>
      <ul class="highlights-list">
        <li>Licensed &amp; Insured Professionals</li>
        <li>Upfront Pricing — No Hidden Fees</li>
        <li>Fast Response Times</li>
        <li>Satisfaction Guaranteed</li>
        <li>Locally Owned &amp; Operated</li>
      </ul>
    </div>
  </section>`;
}

function contactBody(c) {
  return `
  <section class="hero" style="background:${c.brand_colors.primary}">
    <div class="container">
      <h2>Contact ${esc(c.business_name)}</h2>
      <p>Ready to schedule service? Get in touch today.</p>
    </div>
  </section>
  <section style="padding:48px 0">
    <div class="container contact-grid">
      <div>
        <h3>Get In Touch</h3>
        <p><strong>Phone:</strong> <a href="tel:${esc(c.phone)}">${esc(c.phone)}</a></p>
        <p><strong>Email:</strong> <a href="mailto:${esc(c.email)}">${esc(c.email)}</a></p>
        <p><strong>Address:</strong> ${esc(c.address)}</p>
        <p><strong>Area:</strong> ${esc(c.service_area)}</p>
      </div>
      <div>
        <h3>Send a Message</h3>
        <form class="contact-form">
          <label>Name <input type="text" name="name" required /></label>
          <label>Phone <input type="tel" name="phone" required /></label>
          <label>Email <input type="email" name="email" /></label>
          <label>Message <textarea name="message" rows="4" required></textarea></label>
          <button type="submit" class="btn-primary" style="background:${c.brand_colors.primary};border:none;cursor:pointer">Send Message</button>
        </form>
      </div>
    </div>
  </section>`;
}

// ── Main ────────────────────────────────────────────────────────────────

let count = 0;
const generatedDirs = [];

for (const jsonPath of jsonPaths) {
  const resolved = path.resolve(jsonPath);
  if (!fs.existsSync(resolved)) {
    console.warn(`Skipping (not found): ${resolved}`);
    continue;
  }

  let config;
  try {
    config = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  } catch (err) {
    console.warn(`Skipping (invalid JSON): ${resolved} — ${err.message}`);
    continue;
  }

  if (!config.business_name) {
    console.warn(`Skipping (no business_name): ${resolved}`);
    continue;
  }

  const slug = slugify(config.business_name);
  const siteDir = path.join(outRoot, slug);
  fs.mkdirSync(siteDir, { recursive: true });

  const pages = [
    { file: 'index.html', title: null, body: homeBody },
    { file: 'services.html', title: 'Services', body: servicesBody },
    { file: 'about.html', title: 'About', body: aboutBody },
    { file: 'contact.html', title: 'Contact', body: contactBody }
  ];

  for (const pg of pages) {
    const html = renderPage(config, {
      title: pg.title,
      bodyHTML: pg.body(config)
    });
    fs.writeFileSync(path.join(siteDir, pg.file), html, 'utf8');
  }

  console.log(`✔ ${config.business_name} → ${siteDir} (4 pages)`);
  generatedDirs.push(siteDir);
  count++;
}

console.log(`\nGenerated ${count} site(s) in ${outRoot}`);
if (count > 0) {
  const indexPath = path.join(generatedDirs[0], 'index.html');
  const fileUrl = `file:///${indexPath.replace(/\\/g, '/')}`;
  console.log(`Opening ${fileUrl} in Edge...`);
  exec(`start msedge "${fileUrl}"`);
}
