# Broward Auto Sites

Goal: Generate simple, high-conversion websites for local Broward County service businesses from JSON configs.

## Tech Stack

- Next.js App Router
- JSON configs per business
- Components wired to config

## How it works

- `data/*.json` holds business configs.
- `app/page.jsx` and other pages import a config and render a full site.
- `scripts/generate-site-from-json.mjs` is the starting point for static generation.

## Getting started

```bash
npm install
npm run dev
