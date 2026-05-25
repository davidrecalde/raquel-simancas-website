# Raquel Simancas — Academic Website

Static HTML website for Dr. Raquel Simancas, Assistant Professor at the University of Tokyo.

**Live site:** Deployed via Cloudflare Pages

## Stack

Pure static HTML — no build step required.

- `index.html` — Homepage
- `research.html` — Research programme
- `publications.html` — Publications list (21 papers, filterable)
- `talks.html` — Conference presentations
- `about.html` — Biography & timeline
- `contact.html` — Contact & affiliations
- `styles.css` — Design system (Source Serif 4, Inter, petroleum palette)
- `vis.js` — Zeolite SVG visualizations
- `tweaks.js` — Theme panel (accent color, dark mode, density)
- `image-slot.js` — Portrait placeholder component

## Cloudflare Pages setup

- **Framework preset:** None
- **Build command:** *(leave empty)*
- **Build output directory:** `/`
- **Node version:** Not needed

## Local preview

Open `index.html` directly in a browser, or use a local server:

```bash
npx serve .
```

---
