<div align="center">

# MAULIK.EXE

**An interactive digital portfolio engineered with a neo-brutalist editorial aesthetic to showcase backend systems, software engineering, and applied AI architectures.**

[![Live Website](https://img.shields.io/badge/Live_Site-maulik--exe.vercel.app-171717?style=for-the-badge&logo=vercel&logoColor=DFFF00)](https://maulik-exe.vercel.app/)
[![React 19](https://img.shields.io/badge/React-19.3-171717?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-~7.0-171717?style=for-the-badge&logo=typescript&logoColor=3178C6)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-171717?style=for-the-badge&logo=vite&logoColor=646CFF)](https://vitejs.dev/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-171717?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

[Explore Production](https://maulik-exe.vercel.app/) • [Architecture & Design System](#-architecture--design-system) • [Core Features](#-features) • [Local Setup](#-getting-started)

</div>

---

## 📌 Overview

**MAULIK.EXE** is the personal engineering portfolio of **Maulik Pandey**, designed and built from scratch as a high-performance single-page web application. Moving away from generic portfolio templates, the project implements a tactile neo-brutalist design language inspired by Swiss editorial layouts, system readouts, and brutalist physical hardware.

The application serves as both a production frontend showcase and an interactive presentation of backend architectures, telemetry pipelines, and engineering experiences.

```
┌────────────────────────────────────────────────────────────────────────┐
│  PORTFOLIO SYSTEM SPECIFICATIONS                                       │
├──────────────────────┬─────────────────────────────────────────────────┤
│ Core Framework       │ React 19.3.1 + TypeScript ~7.0.2 + Vite 8.3.5   │
│ Design Direction     │ Neo-Brutalist Swiss Editorial                   │
│ Dual Themes          │ Paper (Warm Brutalist) & Cyber-Contrast (Dark)  │
│ Audio Feedback       │ Procedural Web Audio API Synthesizer            │
│ Document Engine      │ In-Browser Canvas PDF.js Renderer               │
│ Production Host      │ Vercel Edge Network                             │
└──────────────────────┴─────────────────────────────────────────────────┘
```

---

## 🎨 Architecture & Design System

The visual identity is guided by neo-brutalist software engineering aesthetics, prioritizing clarity, legibility, and physical tactile feedback.

### 1. Three-Layer Token Architecture
The styling system is implemented in pure CSS using a structured three-tier token hierarchy defined in `src/styles/tokens.css`:

```
Tokens Hierarchy:
  └── 1. Primitive Tokens   --> Raw colors (#F4F0E8, #171717, #DFFF00, #4263EB), space scales, radii
  └── 2. Semantic Tokens    --> Theme intents (--bg-app, --color-text-primary, --border-color-default)
  └── 3. Component Tokens   --> Concrete elements (--shadow-hard-md, buttons, badges, tables)
```

### 2. Dual-Engine Color Palettes

* **Paper Mode (Default)**: Inspired by technical schematics, print media, and warm industrial paper.
  * Canvas: `#F4F0E8`
  * Ink: `#171717`
  * Action Cobalt: `#4263EB`
  * Acid Highlight: `#DFFF00`
* **Cyber-Contrast Mode**: A 5-tier dark theme engineered for low-light legibility and developer tools.
  * Surfaces: Tier 1 (`#0a0b0e`) to Tier 5 (`#0e1015`)
  * Text Contrast: Crisp off-white (`#F4F0E8`) with secondary muted slate (`#c5cbd5`)
  * Neon Accents: Acid yellow (`#DFFF00`) and cyber cobalt (`#748FFC`)

### 3. Flash-Free Theme Initialization
Theme persistence is handled with zero visual flicker via an inline blocking script located in `<head>` within `index.html`. The script reads `localStorage.getItem('maulik_theme_pref')` and sets the `data-theme` attribute on `document.documentElement` before the browser performs its initial layout pass. In-app toggling updates the attribute and synchronizes state across active browser tabs through a `StorageEvent` listener.

### 4. Typography Stack
* **Display / Headings**: Space Grotesk (geometric display typography)
* **Body / Prose**: Plus Jakarta Sans (editorial sans-serif)
* **Data / Micro-Labels**: JetBrains Mono (monospaced system readouts, ledger tags, and code elements)

### 5. Tactile Interaction Principles
* **Hard Drop Shadows**: Solid geometric offsets (`2px`, `3px`, `5px`, `8px`) without blur radius (`box-shadow: 5px 5px 0px var(--color-ink)`).
* **Borders & Radii**: Zero border radius (`0px`) on cards and interactive panels, paired with strict `1.5px` to `3px` solid ink boundaries.
* **Haptic Audio Synthesizer**: Native Web Audio API procedural synthesis produces subtle 18ms triangular click tones on user interactions without downloading external audio files.

---

## ⚡ Features

### 💻 User Interface & Navigation
* **Interactive Hero Terminal**: Real-time status indicators, dynamic role tags, quick navigation dispatch, and system metadata.
* **Dual Theme Engine**: Instant toggle between `Paper` and `Cyber-Contrast` modes with zero-flicker `<head>` initialization and cross-tab storage synchronization.
* **Zero-Bandwidth Audio Feedback**: Self-contained Web Audio API synthesizer generates tactile mechanical click frequencies on demand. Users can toggle audio at any time (`maulik_sound_pref`).
* **Custom Desktop Cursor**: Hardware-accelerated pointer with `translate3d`, hover expansions, active press compression, automatic touch-device suppression (`pointer: fine`), and native scrollbar drag detection.
* **Scroll Utilities**: High-precision reading progress bar (`ScrollProgress`) and a floating tactile Back-to-Top trigger.
* **Smart 404 Route Resolution**: Custom `NotFound` route handling that renders immediately without triggering unnecessary initial loading sequences.

### 📐 Engineering Deep Dives & Case Studies
* **Interactive Case Study Modals**: Technical modals for featured systems (**Aegis3D** and **OutreachOS**) including engineering trade-offs, architecture summaries, and key challenges.
* **Interactive Pipeline Diagrams**: Custom visual component graphs displaying data ingestion, processing nodes, output contracts, and technology tags.
* **Structured Experience Ledger**: Chronological engineering timeline detailing roles (including Backend AI Engineer Intern at Flyrank AI) with responsibilities, tech stacks, and impact metrics.
* **Categorized Skills Matrix**: Scannable categories covering Programming Languages, Web Fundamentals, Developer Tools, Machine Learning & Data Science, Engineering & CS, and AI-Assisted Workflows.

### 📄 Integrated Document Engine
* **In-Browser PDF.js Viewer**: Fully integrated PDF viewer (`PdfViewerModal`) rendered onto high-DPI HTML5 canvas using `pdfjs-dist` inside a Web Worker thread.
* **Viewer Controls**: Page forward/back controls, zoom adjustments (60% to 220%), scale reset, direct PDF download, and keyboard shortcuts (`[Esc]`, `[←]`, `[→]`, `[PageUp]`, `[PageDown]`).

### 📬 Dispatch & Networking
* **AJAX Contact Form**: Direct client-side message dispatch integrated with Formspree, featuring live state transitions (idle, transmitting, success, error) and field validation.
* **Direct Communication Channels**: Quick-copy email trigger with instant visual confirmation and direct professional profile links.

### ♿ Accessibility & Motion
* **Reduced Motion Support**: Universal `@media (prefers-reduced-motion: reduce)` overrides disabling non-essential transitions and animations.
* **Keyboard Accessible Modals**: Focus trapping, Escape key listeners, and page-flipping shortcuts for the PDF document viewer.
* **Native Input Preservation**: Custom cursor automatically unmounts over form fields and text areas to preserve native operating system I-beam and selection cursors.

### 🤖 Machine Discoverability
* **LLM Profile Manifest**: Curated `/llms.txt` file structured with markdown headings, developer background, verified resource links, and technical summaries for AI crawlers.
* **Agentic Resource Discovery (ARD)**: Published `/.well-known/ard.json` and `/ai-catalog.json` manifests detailing developer capabilities and representative queries.
* **Search Directives**: Direct plain-text `/robots.txt` configuration granting search and indexing access.

---

## 🛠️ Technology Stack

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Core Framework** | [React](https://react.dev/) | `^19.3.1` | Component architecture, state management, and UI transitions |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `~7.0.2` | End-to-end static typing, interface contracts, and safety |
| **Build Tool** | [Vite](https://vitejs.dev/) | `^8.3.5` | High-speed ESM development server and Rollup production bundling |
| **Icons** | [Lucide React](https://lucide.dev/) | `^1.64.0` | Vector iconography |
| **Document Processing** | [PDF.js (pdfjs-dist)](https://mozilla.github.io/pdf.js/) | `^6.4.299` | Canvas-based PDF rendering with Web Worker thread offloading |
| **Linting** | [Oxlint](https://oxc.rs/docs/guide/usage/linter) | `^1.89.0` | Rust-based high-performance code linter |
| **Styling** | Vanilla CSS + CSS Tokens | — | Zero-runtime CSS variables, custom media queries, and responsive layouts |
| **Audio** | Web Audio API | — | Procedural audio synthesis for tactile click feedback |
| **Contact Backend** | [Formspree](https://formspree.io/) | — | Serverless AJAX form submission endpoint |
| **Hosting & CI/CD** | [Vercel](https://vercel.com/) | — | Edge deployment, global CDN, and automated Git CI/CD |

---

## 📂 Project Structure

```
maulik.exe/
├── public/                         # Static assets served at root
│   ├── .well-known/                # Agentic discovery specifications
│   │   ├── ai-catalog.json         # Machine-readable AI capability catalog
│   │   └── ard.json                # Agentic Resource Discovery manifest
│   ├── ai-catalog.json             # Root compatibility discovery mirror
│   ├── favicon.svg                 # Neo-brutalist site icon
│   ├── icons.svg                   # Vector icon definitions
│   ├── llms.txt                    # Structured LLM & crawler context
│   ├── resume.pdf                  # Canonical curriculum vitae document
│   └── robots.txt                  # Production search crawler instructions
│
├── src/                            # Application source code
│   ├── assets/                     # Packaged static assets
│   │   └── hero.png                # Hero visual asset
│   │
│   ├── components/                 # React UI components
│   │   ├── About.tsx               # Biography, philosophy, and background
│   │   ├── ArchitectureDiagram.tsx # Interactive project pipeline diagrams
│   │   ├── BackToTop.tsx           # Floating scroll-to-top control
│   │   ├── Contact.tsx             # Dispatch contact form & channel list
│   │   ├── CustomCursor.tsx        # Neo-brutalist hardware-accelerated cursor
│   │   ├── Experience.tsx          # Engineering experience & role ledger
│   │   ├── Footer.tsx              # System specs, links, and status footer
│   │   ├── Hero.tsx                # Terminal header & primary introduction
│   │   ├── Navbar.tsx              # Navigation bar, theme & audio controls
│   │   ├── NotFound.tsx            # Custom neo-brutalist 404 screen
│   │   ├── PageLoader.css          # Boot sequence loader styles
│   │   ├── PageLoader.tsx          # Initial boot sequence loader
│   │   ├── PdfViewerModal.tsx      # Canvas-based PDF viewer modal
│   │   ├── Projects.tsx            # Project cards & case study modals
│   │   ├── ScrollProgress.tsx      # Viewport scroll progress indicator
│   │   └── Skills.tsx              # Technical competencies ledger
│   │
│   ├── data/                       # Portfolio content & static datasets
│   │   └── portfolioData.ts        # Source of truth for projects, skills & bio
│   │
│   ├── styles/                     # Global styling and token architecture
│   │   ├── global.css              # Reset, typography, buttons & utilities
│   │   └── tokens.css              # Primitive, semantic, and component tokens
│   │
│   ├── types/                      # TypeScript definitions & interfaces
│   │   └── index.ts                # Data models for projects, skills, etc.
│   │
│   ├── utils/                      # Utilities & browser helpers
│   │   └── sound.ts                # Web Audio API click sound generator
│   │
│   ├── App.css                     # Root application wrapper styles
│   ├── App.tsx                     # Main layout, routing & modal controller
│   ├── index.css                   # Global entry stylesheet
│   └── main.tsx                    # React DOM entry point
│
├── .oxlintrc.json                  # Oxlint linter configuration
├── index.html                      # HTML document template with FOIT prevention
├── package.json                    # Project dependencies, scripts & metadata
├── tsconfig.app.json               # TypeScript compiler config (application)
├── tsconfig.json                   # TypeScript project references root
├── tsconfig.node.json              # TypeScript compiler config (node/tooling)
├── vercel.json                     # Vercel deployment & rewrite rules
└── vite.config.ts                  # Vite build and plugin configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine (enforced by Vite 8 and Oxlint engine requirements):
* **Node.js**: `^20.19.0` or `>=22.12.0`
* **npm**: `v9.0.0` or higher

### 1. Clone the Repository

```bash
git clone https://github.com/m4ulikP/maulik.exe.git
cd maulik.exe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to inspect the application with hot module replacement (HMR).

### 4. Code Quality & Linting

Run the Rust-powered `oxlint` suite to check code quality and React best practices:

```bash
npm run lint
```

### 5. Production Build & Preview

Verify static type checking with `tsc` and generate an optimized production bundle in `dist/`:

```bash
npm run build
```

Preview the production build locally before deployment:

```bash
npm run preview
```

---

## ⚙️ Configuration & Environment

* **Zero-Secret Static Frontend**: The application runs entirely on static client-side assets and does not require private API keys or server-side environment variables for local development or production.
* **Contact Form Endpoint**: Message dispatch is configured in `src/components/Contact.tsx` pointing to Formspree (`https://formspree.io/f/mjyyonop`).
* **Client Preferences**:
  * Theme preference is saved to `localStorage` under `maulik_theme_pref` (`paper` or `cyber-contrast`).
  * Sound feedback state is saved to `localStorage` under `maulik_sound_pref` (`on` or `off`).

---

## 🌐 Deployment Workflow

The application is deployed on **Vercel** with continuous deployment connected to the `main` branch.

* **Configuration**: Managed via `vercel.json` with the Vite framework preset.
* **Build Command**: `npm run build` (`tsc -b && vite build`)
* **Output Directory**: `dist`
* **SPA Routing**: Incoming routes are routed to `/index.html` via rewrite rules defined in `vercel.json`.
* **Live Production URL**: [https://maulik-exe.vercel.app](https://maulik-exe.vercel.app/)

---

## 👤 Author & Connect

**Maulik Pandey**  
Computer Science Undergrad (AI & ML) & Backend AI Engineer Intern

* **Portfolio Website**: [https://maulik-exe.vercel.app](https://maulik-exe.vercel.app/)
* **GitHub**: [@m4ulikP](https://github.com/m4ulikP)
* **LinkedIn**: [linkedin.com/in/maulp](https://www.linkedin.com/in/maulp/)
* **Email**: [maulik.pandey9@gmail.com](mailto:maulik.pandey9@gmail.com)

---

## 📄 Copyright Notice

© 2026 Maulik Pandey. All rights reserved.
