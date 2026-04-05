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
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <script type="application/ld+json">
  ${JSON.stringify(buildSchema(c), null, 2)}
  </script>
  <style>
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:'Inter',system-ui,-apple-system,sans-serif; color:#1e293b; background:#fff; line-height:1.6; -webkit-font-smoothing:antialiased; }
    img { max-width:100%; display:block; }
    a { color:inherit; text-decoration:none; }

    /* ── Container ─────────────────────────────────────── */
    .container { width:90%; max-width:1140px; margin:0 auto; }

    /* ── Header ────────────────────────────────────────── */
    .site-header { position:sticky; top:0; z-index:100; background:rgba(255,255,255,0.92); backdrop-filter:blur(12px); border-bottom:1px solid #f1f5f9; }
    .site-header .container { display:flex; justify-content:space-between; align-items:center; height:72px; }
    .logo { font-weight:800; font-size:1.25rem; color:${c.brand_colors.primary}; }
    .main-nav { display:flex; gap:32px; align-items:center; }
    .main-nav a { font-size:0.925rem; font-weight:500; color:#475569; transition:color .2s; }
    .main-nav a:hover, .main-nav a.active { color:${c.brand_colors.primary}; }
    .nav-cta { background:${c.brand_colors.primary}; color:#fff !important; padding:10px 22px; border-radius:8px; font-weight:600; transition:opacity .2s; }
    .nav-cta:hover { opacity:0.9; }
    .menu-toggle { display:none; background:none; border:none; cursor:pointer; }
    .menu-toggle span { display:block; width:24px; height:2px; background:#1e293b; margin:5px 0; transition:.3s; }

    /* ── Hero ──────────────────────────────────────────── */
    .hero { position:relative; padding:100px 0 80px; overflow:hidden; }
    .hero::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg, ${c.brand_colors.primary} 0%, ${c.brand_colors.primary}dd 50%, ${c.brand_colors.accent} 100%); z-index:0; }
    .hero::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:80px; background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 80'%3E%3Cpath fill='%23ffffff' d='M0,64L80,58.7C160,53,320,43,480,42.7C640,43,800,53,960,53.3C1120,53,1280,43,1360,37.3L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z'%3E%3C/path%3E%3C/svg%3E") no-repeat bottom/cover; z-index:1; }
    .hero .container { position:relative; z-index:2; text-align:center; color:#fff; }
    .hero-badge { display:inline-block; padding:6px 16px; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25); border-radius:50px; font-size:0.8rem; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; margin-bottom:24px; backdrop-filter:blur(4px); }
    .hero h1 { font-size:clamp(2.2rem,5vw,3.5rem); font-weight:800; line-height:1.15; margin-bottom:20px; }
    .hero p { font-size:1.15rem; max-width:600px; margin:0 auto 36px; opacity:0.9; line-height:1.7; }
    .hero-actions { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }

    /* ── Buttons ───────────────────────────────────────── */
    .btn { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; font-size:0.95rem; font-weight:600; border:none; cursor:pointer; transition:all .25s ease; }
    .btn-primary { background:#fff; color:${c.brand_colors.primary}; box-shadow:0 4px 14px rgba(0,0,0,0.1); }
    .btn-primary:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,0.15); }
    .btn-outline { background:transparent; color:#fff; border:2px solid rgba(255,255,255,0.4); }
    .btn-outline:hover { background:rgba(255,255,255,0.1); border-color:#fff; }
    .btn-accent { background:${c.brand_colors.accent}; color:#fff; }
    .btn-accent:hover { opacity:0.9; transform:translateY(-2px); }
    .btn-dark { background:${c.brand_colors.primary}; color:#fff; }
    .btn-dark:hover { opacity:0.9; transform:translateY(-2px); }

    /* ── Sections ──────────────────────────────────────── */
    .section { padding:80px 0; }
    .section-alt { background:#f8fafc; }
    .section-label { display:inline-block; font-size:0.8rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:${c.brand_colors.accent}; margin-bottom:12px; }
    .section-title { font-size:clamp(1.75rem,3.5vw,2.5rem); font-weight:800; color:#0f172a; margin-bottom:16px; line-height:1.2; }
    .section-subtitle { font-size:1.05rem; color:#64748b; max-width:600px; line-height:1.7; }
    .section-header { text-align:center; margin-bottom:56px; }
    .section-header .section-subtitle { margin:0 auto; }

    /* ── Service cards ─────────────────────────────────── */
    .service-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:24px; }
    .service-card { background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:32px 28px; transition:all .3s ease; position:relative; overflow:hidden; }
    .service-card:hover { transform:translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,0.08); border-color:transparent; }
    .service-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,${c.brand_colors.primary},${c.brand_colors.accent}); opacity:0; transition:opacity .3s; }
    .service-card:hover::before { opacity:1; }
    .service-icon { width:52px; height:52px; border-radius:12px; background:${c.brand_colors.primary}11; display:flex; align-items:center; justify-content:center; margin-bottom:20px; font-size:1.5rem; }
    .service-card h4 { font-size:1.15rem; font-weight:700; margin-bottom:10px; color:#0f172a; }
    .service-card p { font-size:0.925rem; color:#64748b; line-height:1.6; }

    /* ── Stats ─────────────────────────────────────────── */
    .stats-bar { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:32px; padding:40px 0; text-align:center; }
    .stat-item h3 { font-size:2.5rem; font-weight:800; color:${c.brand_colors.primary}; }
    .stat-item p { font-size:0.9rem; color:#64748b; font-weight:500; margin-top:4px; }

    /* ── Highlights / why-us ───────────────────────────── */
    .why-grid { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }
    .why-list { list-style:none; display:flex; flex-direction:column; gap:20px; }
    .why-list li { display:flex; gap:16px; align-items:flex-start; }
    .why-check { flex-shrink:0; width:28px; height:28px; border-radius:50%; background:${c.brand_colors.primary}11; color:${c.brand_colors.primary}; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem; margin-top:2px; }
    .why-list li div h4 { font-size:1rem; font-weight:700; color:#0f172a; margin-bottom:4px; }
    .why-list li div p { font-size:0.9rem; color:#64748b; }
    .why-image-area { background:linear-gradient(135deg,${c.brand_colors.primary}08,${c.brand_colors.accent}12); border-radius:20px; padding:48px; text-align:center; }
    .why-image-area .big-stat { font-size:4rem; font-weight:800; color:${c.brand_colors.primary}; }
    .why-image-area .big-stat-label { font-size:1.1rem; color:#475569; margin-top:8px; }

    /* ── CTA Banner ────────────────────────────────────── */
    .cta-banner { padding:80px 0; background:linear-gradient(135deg,${c.brand_colors.primary},${c.brand_colors.accent}); text-align:center; color:#fff; position:relative; overflow:hidden; }
    .cta-banner::before { content:''; position:absolute; width:400px; height:400px; border-radius:50%; background:rgba(255,255,255,0.05); top:-100px; right:-100px; }
    .cta-banner::after { content:''; position:absolute; width:300px; height:300px; border-radius:50%; background:rgba(255,255,255,0.05); bottom:-80px; left:-80px; }
    .cta-banner .container { position:relative; z-index:1; }
    .cta-banner h2 { font-size:clamp(1.75rem,3.5vw,2.5rem); font-weight:800; margin-bottom:16px; }
    .cta-banner p { font-size:1.1rem; opacity:0.9; max-width:560px; margin:0 auto 32px; }
    .cta-banner .btn-primary { background:#fff; color:${c.brand_colors.primary}; }

    /* ── Contact ───────────────────────────────────────── */
    .contact-grid { display:grid; grid-template-columns:1fr 1.2fr; gap:56px; }
    .contact-info-card { background:linear-gradient(135deg,${c.brand_colors.primary},${c.brand_colors.primary}dd); border-radius:20px; padding:40px; color:#fff; }
    .contact-info-card h3 { font-size:1.5rem; font-weight:700; margin-bottom:8px; }
    .contact-info-card > p { opacity:0.8; margin-bottom:32px; font-size:0.95rem; }
    .contact-detail { display:flex; gap:16px; align-items:flex-start; margin-bottom:24px; }
    .contact-detail-icon { width:44px; height:44px; border-radius:12px; background:rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:1.1rem; }
    .contact-detail div p:first-child { font-weight:600; font-size:0.85rem; opacity:0.7; text-transform:uppercase; letter-spacing:0.05em; }
    .contact-detail div p:last-child { font-size:1rem; margin-top:2px; }
    .contact-detail div a { color:#fff; }
    .contact-form { background:#fff; border:1px solid #e2e8f0; border-radius:20px; padding:40px; }
    .contact-form h3 { font-size:1.35rem; font-weight:700; margin-bottom:24px; color:#0f172a; }
    .form-group { margin-bottom:20px; }
    .form-group label { display:block; font-size:0.85rem; font-weight:600; color:#475569; margin-bottom:6px; }
    .form-group input, .form-group textarea { display:block; width:100%; padding:12px 16px; border:1.5px solid #e2e8f0; border-radius:10px; font-size:0.95rem; font-family:inherit; transition:border-color .2s, box-shadow .2s; background:#f8fafc; }
    .form-group input:focus, .form-group textarea:focus { outline:none; border-color:${c.brand_colors.primary}; box-shadow:0 0 0 3px ${c.brand_colors.primary}22; background:#fff; }
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .form-submit { width:100%; padding:14px; border:none; border-radius:10px; background:${c.brand_colors.primary}; color:#fff; font-size:1rem; font-weight:600; cursor:pointer; transition:all .25s; font-family:inherit; }
    .form-submit:hover { opacity:0.9; transform:translateY(-1px); box-shadow:0 4px 12px ${c.brand_colors.primary}44; }

    /* ── Footer ────────────────────────────────────────── */
    .site-footer { background:#0f172a; color:#94a3b8; padding:64px 0 0; }
    .footer-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:40px; padding-bottom:48px; border-bottom:1px solid #1e293b; }
    .footer-brand { }
    .footer-brand .logo { color:#fff; font-size:1.3rem; display:block; margin-bottom:16px; }
    .footer-brand p { font-size:0.9rem; line-height:1.7; max-width:280px; }
    .footer-col h4 { color:#f1f5f9; font-size:0.85rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:16px; }
    .footer-col a { display:block; font-size:0.9rem; padding:4px 0; transition:color .2s; }
    .footer-col a:hover { color:#fff; }
    .footer-bottom { display:flex; justify-content:space-between; align-items:center; padding:24px 0; font-size:0.85rem; }

    /* ── Responsive ────────────────────────────────────── */
    @media(max-width:900px) {
      .why-grid, .contact-grid, .footer-grid { grid-template-columns:1fr; }
      .form-row { grid-template-columns:1fr; }
    }
    @media(max-width:640px) {
      .main-nav a:not(.nav-cta) { display:none; }
      .menu-toggle { display:block; }
      .hero { padding:72px 0 60px; }
      .section { padding:56px 0; }
      .service-grid { grid-template-columns:1fr; }
      .footer-bottom { flex-direction:column; gap:8px; text-align:center; }
    }
  </style>
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a href="index.html" class="logo">${esc(c.business_name)}</a>
      <nav class="main-nav">
        <a href="index.html">Home</a>
        <a href="services.html">Services</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
        <a href="tel:${esc(c.phone)}" class="nav-cta">${esc(c.phone)}</a>
      </nav>
      <button class="menu-toggle" aria-label="Toggle menu" onclick="document.querySelector('.main-nav').classList.toggle('open')">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
  <main>${bodyHTML}</main>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <span class="logo">${esc(c.business_name)}</span>
          <p>Professional ${esc(c.service_category.toLowerCase())} services proudly serving ${esc(c.service_area)}.</p>
        </div>
        <div class="footer-col">
          <h4>Pages</h4>
          <a href="index.html">Home</a>
          <a href="services.html">Services</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="footer-col">
          <h4>Services</h4>
          ${c.services_list
            .slice(0, 4)
            .map((s) => `<a href="services.html">${esc(s)}</a>`)
            .join('\n          ')}
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <a href="tel:${esc(c.phone)}">${esc(c.phone)}</a>
          <a href="mailto:${esc(c.email)}">${esc(c.email)}</a>
          <a>${esc(c.address)}</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${c.current_year} ${esc(c.business_name)}. All rights reserved.</span>
        <span>Serving ${esc(c.service_area)}</span>
      </div>
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
  const serviceIcons = [
    '🔧',
    '🔍',
    '🔥',
    '🛠️',
    '🚨',
    '💧',
    '⚡',
    '🏠',
    '🪛',
    '✅'
  ];
  return `
  <section class="hero">
    <div class="container">
      <span class="hero-badge">Trusted ${esc(c.service_category)} Professionals</span>
      <h1>Reliable ${esc(c.service_category)} Services<br/>in ${esc(c.city)}</h1>
      <p>Trusted by homeowners and businesses across ${esc(c.service_area)} for fast, professional, and affordable ${esc(c.service_category.toLowerCase())} solutions.</p>
      <div class="hero-actions">
        <a href="tel:${esc(c.phone)}" class="btn btn-primary">📞 ${esc(c.phone)}</a>
        <a href="contact.html" class="btn btn-outline">Get a Free Quote</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="stats-bar">
        <div class="stat-item"><h3>500+</h3><p>Jobs Completed</p></div>
        <div class="stat-item"><h3>15+</h3><p>Years Experience</p></div>
        <div class="stat-item"><h3>4.9★</h3><p>Customer Rating</p></div>
        <div class="stat-item"><h3>24/7</h3><p>Emergency Service</p></div>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="section-header">
        <span class="section-label">What We Do</span>
        <h2 class="section-title">Our ${esc(c.service_category)} Services</h2>
        <p class="section-subtitle">From routine maintenance to emergency repairs, we deliver professional ${esc(c.service_category.toLowerCase())} solutions you can count on.</p>
      </div>
      <div class="service-grid">
        ${c.services_list
          .map(
            (s, i) => `<div class="service-card">
          <div class="service-icon">${serviceIcons[i % serviceIcons.length]}</div>
          <h4>${esc(s)}</h4>
          <p>Professional ${esc(s.toLowerCase())} services for homes and businesses in ${esc(c.city)}.</p>
        </div>`
          )
          .join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="why-grid">
        <div>
          <span class="section-label">Why Choose Us</span>
          <h2 class="section-title">The ${esc(c.service_area)} Team You Can Trust</h2>
          <p class="section-subtitle" style="margin-bottom:32px">We combine years of experience with genuine care for every customer.</p>
          <ul class="why-list">
            <li><span class="why-check">✓</span><div><h4>Licensed &amp; Insured</h4><p>Fully certified professionals for your peace of mind.</p></div></li>
            <li><span class="why-check">✓</span><div><h4>Upfront Pricing</h4><p>Transparent quotes with no hidden fees or surprises.</p></div></li>
            <li><span class="why-check">✓</span><div><h4>Fast Response Times</h4><p>We arrive quickly because your time matters.</p></div></li>
            <li><span class="why-check">✓</span><div><h4>Satisfaction Guaranteed</h4><p>We stand behind every job we complete.</p></div></li>
          </ul>
        </div>
        <div class="why-image-area">
          <div class="big-stat">15+</div>
          <div class="big-stat-label">Years proudly serving<br/><strong>${esc(c.service_area)}</strong></div>
        </div>
      </div>
    </div>
  </section>

  <section class="cta-banner">
    <div class="container">
      <h2>Need ${esc(c.service_category)} Help Today?</h2>
      <p>Don't wait — call now for fast, reliable service across ${esc(c.service_area)}.</p>
      <div class="hero-actions">
        <a href="tel:${esc(c.phone)}" class="btn btn-primary">📞 Call ${esc(c.phone)}</a>
        <a href="contact.html" class="btn btn-outline">Request a Quote</a>
      </div>
    </div>
  </section>`;
}

function servicesBody(c) {
  const serviceIcons = [
    '🔧',
    '🔍',
    '🔥',
    '🛠️',
    '🚨',
    '💧',
    '⚡',
    '🏠',
    '🪛',
    '✅'
  ];
  return `
  <section class="hero">
    <div class="container">
      <span class="hero-badge">Our Expertise</span>
      <h1>Our ${esc(c.service_category)} Services</h1>
      <p>Comprehensive ${esc(c.service_category.toLowerCase())} solutions for residential and commercial properties across ${esc(c.service_area)}.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="service-grid">
        ${c.services_list
          .map(
            (s, i) => `<div class="service-card">
          <div class="service-icon">${serviceIcons[i % serviceIcons.length]}</div>
          <h4>${esc(s)}</h4>
          <p>Our expert team provides professional ${esc(s.toLowerCase())} services throughout ${esc(c.city)} and the surrounding ${esc(c.service_area)} area. We use industry-leading techniques to deliver lasting results.</p>
        </div>`
          )
          .join('\n        ')}
      </div>
    </div>
  </section>

  <section class="cta-banner">
    <div class="container">
      <h2>Ready to Get Started?</h2>
      <p>Contact us today for a free estimate on any of our ${esc(c.service_category.toLowerCase())} services.</p>
      <div class="hero-actions">
        <a href="tel:${esc(c.phone)}" class="btn btn-primary">📞 Call ${esc(c.phone)}</a>
        <a href="contact.html" class="btn btn-outline">Get a Free Quote</a>
      </div>
    </div>
  </section>`;
}

function aboutBody(c) {
  return `
  <section class="hero">
    <div class="container">
      <span class="hero-badge">Our Story</span>
      <h1>About ${esc(c.business_name)}</h1>
      <p>Providing professional ${esc(c.service_category.toLowerCase())} services that ${esc(c.service_area)} residents count on.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="why-grid">
        <div>
          <span class="section-label">Who We Are</span>
          <h2 class="section-title">Your Local ${esc(c.service_category)} Experts</h2>
          <p class="section-subtitle" style="margin-bottom:24px">${esc(c.business_name)} has been proudly serving ${esc(c.city)} and the greater ${esc(c.service_area)} area with professional ${esc(c.service_category.toLowerCase())} services. Our team is committed to quality workmanship, transparent pricing, and exceptional customer care.</p>
          <p class="section-subtitle">Whether it's a routine job or an urgent repair, we treat every project with the same dedication and expertise. Your satisfaction is our top priority.</p>
        </div>
        <div class="why-image-area">
          <div class="big-stat">15+</div>
          <div class="big-stat-label">Years of trusted service<br/>in <strong>${esc(c.service_area)}</strong></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="section-header">
        <span class="section-label">Why Choose Us</span>
        <h2 class="section-title">What Sets Us Apart</h2>
        <p class="section-subtitle">We hold ourselves to the highest standards on every single job.</p>
      </div>
      <div class="service-grid">
        <div class="service-card">
          <div class="service-icon">🛡️</div>
          <h4>Licensed &amp; Insured</h4>
          <p>Fully licensed, bonded, and insured professionals for your complete peace of mind.</p>
        </div>
        <div class="service-card">
          <div class="service-icon">💰</div>
          <h4>Upfront Pricing</h4>
          <p>Transparent quotes before work begins — no hidden fees, no surprises on your bill.</p>
        </div>
        <div class="service-card">
          <div class="service-icon">⚡</div>
          <h4>Fast Response</h4>
          <p>Quick arrival times because we know your time is valuable and problems can't wait.</p>
        </div>
        <div class="service-card">
          <div class="service-icon">⭐</div>
          <h4>Satisfaction Guaranteed</h4>
          <p>We stand behind every job with a 100% satisfaction guarantee.</p>
        </div>
        <div class="service-card">
          <div class="service-icon">🏠</div>
          <h4>Locally Owned</h4>
          <p>A local business that cares about our ${esc(c.service_area)} neighbors and community.</p>
        </div>
        <div class="service-card">
          <div class="service-icon">🕐</div>
          <h4>Emergency Service</h4>
          <p>Available when you need us most — 24/7 emergency ${esc(c.service_category.toLowerCase())} support.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="stats-bar">
        <div class="stat-item"><h3>500+</h3><p>Jobs Completed</p></div>
        <div class="stat-item"><h3>15+</h3><p>Years Experience</p></div>
        <div class="stat-item"><h3>4.9★</h3><p>Customer Rating</p></div>
        <div class="stat-item"><h3>100%</h3><p>Satisfaction Guarantee</p></div>
      </div>
    </div>
  </section>

  <section class="cta-banner">
    <div class="container">
      <h2>Ready to Work With the Best?</h2>
      <p>Join hundreds of satisfied customers in ${esc(c.service_area)}.</p>
      <div class="hero-actions">
        <a href="tel:${esc(c.phone)}" class="btn btn-primary">📞 Call ${esc(c.phone)}</a>
        <a href="contact.html" class="btn btn-outline">Contact Us</a>
      </div>
    </div>
  </section>`;
}

function contactBody(c) {
  return `
  <section class="hero">
    <div class="container">
      <span class="hero-badge">Get In Touch</span>
      <h1>Contact ${esc(c.business_name)}</h1>
      <p>Ready to schedule service? We'd love to hear from you. Reach out today for a free estimate.</p>
    </div>
  </section>

  <section class="section">
    <div class="container contact-grid">
      <div class="contact-info-card">
        <h3>Let's Talk</h3>
        <p>We're here to help with all your ${esc(c.service_category.toLowerCase())} needs in ${esc(c.service_area)}.</p>
        <div class="contact-detail">
          <div class="contact-detail-icon">📞</div>
          <div>
            <p>Phone</p>
            <p><a href="tel:${esc(c.phone)}">${esc(c.phone)}</a></p>
          </div>
        </div>
        <div class="contact-detail">
          <div class="contact-detail-icon">✉️</div>
          <div>
            <p>Email</p>
            <p><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></p>
          </div>
        </div>
        <div class="contact-detail">
          <div class="contact-detail-icon">📍</div>
          <div>
            <p>Address</p>
            <p>${esc(c.address)}</p>
          </div>
        </div>
        <div class="contact-detail">
          <div class="contact-detail-icon">🗺️</div>
          <div>
            <p>Service Area</p>
            <p>${esc(c.service_area)}</p>
          </div>
        </div>
      </div>
      <div class="contact-form">
        <h3>Send Us a Message</h3>
        <form>
          <div class="form-row">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input type="text" id="name" name="name" placeholder="John Doe" required />
            </div>
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" placeholder="(954) 555-0000" required />
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="john@example.com" />
          </div>
          <div class="form-group">
            <label for="service">Service Needed</label>
            <input type="text" id="service" name="service" placeholder="e.g. ${esc(c.services_list[0])}" />
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="4" placeholder="Tell us about your project..." required></textarea>
          </div>
          <button type="submit" class="form-submit">Send Message →</button>
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
