# MAULIK.EXE — Personal Engineering Portfolio

The portfolio of **Maulik Pandey** — Computer Science & Engineering undergraduate specializing in Artificial Intelligence. Focuses on backend systems, API infrastructure, and applied signal processing.

Built with **React 19**, **TypeScript**, **Vite**, and native CSS custom properties.

---

## Prerequisites

- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later

---

## Quickstart & Commands

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Local Development
Start the local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The server will boot locally at `http://localhost:5173/`.

### 3. Code Quality & Validation
Run static linting with Oxlint:
```bash
npm run lint
```

Run TypeScript strict type-checking and production bundling:
```bash
npm run build
```

### 4. Production Preview
Test the compiled production bundle locally:
```bash
npm run preview
```
The preview server will boot at `http://localhost:4173/`.

---

## Build Output

- **Output Directory:** `dist/`
- **Output Structure:**
  - `dist/index.html`: Optimized static entrypoint with preconnect fonts and metadata.
  - `dist/assets/`: Minified JavaScript chunks and hashed CSS stylesheet bundles.
  - `dist/favicon.svg`: Brand icon asset.
  - `dist/robots.txt`: Search crawler directives.
  - `dist/resume.pdf`: Verified FlowCV engineering resume for recruiter downloads.

---

## Deployment Guide (Static Hosting)

Because `MAULIK.EXE` is an optimized client-side Single Page Application (SPA), it does not require a backend server and can be deployed for free on any major static edge network.

### Option A: Vercel (Recommended)
1. Push this repository to GitHub or install the [Vercel CLI](https://vercel.com/cli):
   ```bash
   npm i -g vercel
   vercel
   ```
2. Configuration defaults:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Option B: Cloudflare Pages
1. In the Cloudflare Dashboard, navigate to **Workers & Pages** > **Create application** > **Pages**.
2. Connect your repository.
3. Build Settings:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`

### Option C: Netlify
1. Connect via Netlify web console or CLI (`netlify deploy --prod --dir=dist`).
2. Build command: `npm run build`
3. Publish directory: `dist`

### Option D: GitHub Pages
1. In `vite.config.ts`, ensure `base` is configured to your repo path (or `/` if using a custom apex domain).
2. Use GitHub Actions with the standard `actions/deploy-pages` workflow targeting the `dist/` artifact.

---

## Project Codebase Provenance

- **Aegis3D:** Local Python/FastAPI backend repository (`Documents/Aegis3D`) with unit and integration test suite; benchtop ESP32 hardware prototype with PZT acoustic sensing and Butterworth digital bandpass filtering (originally developed under prototype name STRUCTURA).
- **Outreach OS:** Full-stack Next.js 14 / TypeScript sales studio repository (`Documents/OutreachOS`) with Prisma schema, 3-tier deterministic deduplication, and automated test suite.
- **FlyRank AI:** Internship repository (`Documents/flyrank-capstone-metering-billing`) with Docker integration tests covering request idempotency, quota gating, and integer-cent billing logic.
- **TransitOps:** Prior Smart India Hackathon 2024 team prototype (`Documents/sih`) with dynamic Dijkstra road-closure algorithms (not featured in current portfolio).
