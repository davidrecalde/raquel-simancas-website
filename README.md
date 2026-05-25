# Raquel Simancas — Personal Academic Website

Personal academic website for Dr. Raquel Simancas, Assistant Professor at the University of Tokyo.

**Stack:** Astro 5 · Tailwind CSS v4 · Cloudflare Pages

## Getting Started

```bash
pnpm install
pnpm dev
```

Open http://localhost:4321

## Deployment: GitHub + Cloudflare Pages

### 1. Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/raquel-simancas.git
git push -u origin main
```

### 2. Connect to Cloudflare Pages

1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
2. Select the GitHub repository
3. Build settings:
   - Build command: `pnpm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION = 20`
4. Save and Deploy

### 3. Custom Domain (Optional)

Add domain in Cloudflare Pages → Custom domains.
Update `site` in `astro.config.mjs` to match.

## Content Updates

- **Publications:** Edit the `publications` array in `src/pages/publications/index.astro`
- **Presentations:** Edit the `presentations` array in `src/pages/presentations/index.astro`
- **Biography/Research:** Edit the respective `.astro` page files directly

## Build Commands

```bash
pnpm dev        # Development server
pnpm build      # Production build
pnpm preview    # Preview locally
```
