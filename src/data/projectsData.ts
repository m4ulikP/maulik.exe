export interface Project {
  id: string;
  number: string;
  title: string;
  statusLabel?: string;
  summary: string;
  techStack: string[];
  repoEvidence: string;
  myContribution: string;
  problem: string;
  approach: string;
  challenges: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'aegis3d',
    number: '01',
    title: 'Aegis3D',
    statusLabel: 'Signal Processing & Backend · ESP32 Prototype',
    summary:
      'A structural-health monitoring system I built to learn signal processing and backend development. It collects acoustic sensor data from a benchtop prototype, runs it through a 9-stage processing pipeline, and outputs a 0–100 health index for the monitored structure.',
    techStack: ['FastAPI / Python', 'ESP32 & PZT Sensor', 'Butterworth DSP', 'PostgreSQL / SSE', 'Pytest'],
    repoEvidence:
      'Local repository Aegis3D contains 180 unit and integration tests (locally authored; not verified by CI). Benchtop prototype uses an ESP32 microcontroller and a PZT acoustic sensor. Multi-sensor TDOA cross-correlation remains an exploratory concept and is not claimed as verified hardware capability. Sub-15ms pipeline timing is a locally-observed development-machine estimate, not a formally reproducible benchmark.',
    problem:
      'Structural failures in buildings and bridges often start as microscopic cracks long before anything is visually visible. I wanted to explore how a software system could continuously listen for acoustic stress signals, flag anomalies automatically, and produce an interpretable health score — using open hardware and an auditable processing pipeline rather than a black-box approach.',
    myContribution:
      'I wrote the backend processing pipeline in Python using FastAPI, including the signal-conditioning logic (Butterworth bandpass filtering), feature extraction (peak, RMS, FFT), z-score anomaly detection, and the Structural Health Index calculation. I also built the PostgreSQL database schema, set up Server-Sent Events for live streaming, and wrote the automated pytest suite (180 tests in a local repo). I assembled a benchtop prototype using an ESP32 and a PZT acoustic sensor. Cross-channel TDOA correlation remains an exploratory concept. Parts of the codebase were built with AI coding assistance.',
    approach:
      'Acoustic data sampled via an ESP32 microcontroller is sent to a FastAPI backend, which processes it through 9 stages: DC-offset removal and 4th-order Butterworth bandpass filtering at 4.8 kHz, peak and RMS feature extraction, z-score anomaly scoring (flagging |z| ≥ 3.0), rolling temporal persistence tracking across sample windows, and a bounded 0–100 Structural Health Index (SHI) output. Results are streamed to clients via Server-Sent Events. On a development machine, batch processing of 1,000-sample arrays was consistently observed under 15ms, though this has not been formally benchmarked.',
    challenges:
      'Distinguishing real acoustic anomalies from ordinary environmental vibrations without generating too many false alerts, while keeping the pipeline responsive enough to stream results to multiple clients. Addressed using spectral bandpass filtering, rolling temporal persistence tracking, and in-memory async pub-sub channels.',
  },
  {
    id: 'outreach-os',
    number: '02',
    title: 'Outreach OS',
    statusLabel: 'CURRENTLY BUILDING · Freelancer Sales Studio',
    summary:
      'An AI-powered prospecting and outreach platform designed to help freelancers discover potential clients, personalize outreach, manage follow-ups, and move prospects through their pipeline.',
    techStack: [
      'Next.js 14 / React',
      'TypeScript & Tailwind',
      'PostgreSQL & Prisma',
      'Deterministic Deduplication',
      'Zod & NextAuth',
    ],
    repoEvidence:
      'Local repository OutreachOS with 128 automated unit and integration tests across 11 suites. Full-stack Next.js 14 App Router, Prisma ORM, and Phase 2B production reliability implemented; live AI enrichment and sequence worker in active development.',
    problem:
      'Freelancers lose high-value contracts because prospecting across disparate channels is disorganized, manual outreach leads to generic messages that get ignored, and busy schedules cause follow-up sequences to slip through the cracks. Enterprise CRMs are over-engineered and lack built-in discovery and deduplication, while spreadsheets provide zero automated validation or pipeline intelligence.',
    myContribution:
      'I am building the full-stack system using Next.js 14 App Router and TypeScript. I architected the 11-model Prisma database schema, designed the 6-stage sales pipeline and daily Attention Deck, built the 3-tier deterministic deduplication engine to guarantee prospect uniqueness, implemented NextAuth session security with Zod request validation, created structured NDJSON logging with automated PII scrubbing, and authored the 128 automated unit and integration tests.',
    approach:
      'The architecture centers on a freelancer Daily Action Studio with an Attention Deck (flagging due follow-ups, unread replies, and upcoming discovery calls) tied to a 6-stage pipeline (New → Contacted → Replied → Positive → Discovery Call → Client). Lead ingestion enforces a 3-tier deduplication hierarchy: RFC email normalization, canonical LinkedIn URL parsing, and composite SHA-256 hashing on sanitized name and company domain. Backend routes use Zod schemas and transactional Prisma queries, backed by an adapter interface for AI synthesis and Brevo email dispatch.',
    challenges:
      'Preventing duplicate outreach when prospect data arrives through different sources with partial contact fields (e.g. missing direct email or varying URL structures). Solved by engineering a 3-tier deterministic deduplication engine that falls back across normalized email, canonical LinkedIn profile, and a composite SHA-256 hash. Additionally, ensured sensitive client information is protected by implementing automated regex-based PII redaction in all application logs.',
  },
];

export const AEGIS_STAGES = [
  { step: '01', name: 'Ingestion', desc: 'Accepts discrete amplitude arrays via POST /api/v1/telemetry with ISO timestamps and channel IDs.' },
  { step: '02', name: 'Conditioning', desc: 'Applies DC offset removal and 4th-order digital Butterworth bandpass filtering.' },
  { step: '03', name: 'Event Detection', desc: 'Evaluates peak thresholding and extracts windowed transient acoustic bursts.' },
  { step: '04', name: 'Feature Extraction', desc: 'Computes Peak amplitude, RMS voltage, signal energy, and FFT frequency spectrum.' },
  { step: '05', name: 'Baseline Ref', desc: 'Compares extracted features against baseline zone statistics (mean and standard deviation).' },
  { step: '06', name: 'Anomaly Score', desc: 'Calculates standardized z-scores (|z| ≥ 3.0 threshold for structural anomaly flags).' },
  { step: '07', name: 'Persistence', desc: 'Tracks rolling temporal anomaly persistence ratio across consecutive sample windows.' },
  { step: '08', name: 'Correlation', desc: 'Cross-channel correlation logic designed for relative wave propagation analysis across sample windows (exploratory / in development).' },
  { step: '09', name: 'SHI Evaluation', desc: 'Generates bounded Structural Health Index (0–100) and dispatches system alert snapshots.' },
];
