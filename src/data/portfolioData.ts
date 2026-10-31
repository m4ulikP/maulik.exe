import type { PersonalInfo, Project, ExperienceItem, SkillCategory, CourseLearningItem } from '../types';

export const PERSONAL_INFO: PersonalInfo = {
  name: 'Maulik',
  handle: 'MAULIK.EXE',
  role: 'Software Developer | Backend & AI',
  headline:
    'Computer Science student interested in software engineering, building useful applications, and exploring AI through hands-on projects.',
  location: 'India',
  status: 'Open to Software Engineering & Backend Opportunities',
  email: 'maulik.pandey9@gmail.com',
  githubUrl: 'https://github.com/m4ulikP',
  linkedinUrl: 'https://www.linkedin.com/in/maulp/',
  xUrl: '',
  resumeUrl: '/resume.pdf',
  bio: "I'm a Computer Science and Engineering undergraduate at IILM University, specializing in Artificial Intelligence and Machine Learning. I'm interested in software engineering, especially building useful applications and understanding how their backend systems work.",
  education: {
    degree: 'B.Tech in Computer Science and Engineering',
    program: 'Computer Science and Engineering',
    specialization: 'Artificial Intelligence and Machine Learning (AI/ML)',
    institution: 'IILM University',
    status: 'Currently Pursuing',
    summary:
      'Undergraduate studies grounded in computer science fundamentals, data structures, algorithms, and practical software development.',
  },
  engineeringPhilosophy: [],
};

export const PROJECTS: Project[] = [
  {
    id: 'aegis3d',
    title: 'Aegis3D',
    codeName: 'PROJ.AEG-01',
    tagline: 'AI-Powered Structural Health Monitoring & Sensor Telemetry Prototype',
    problem:
      'Civil infrastructure monitoring traditionally depends on infrequent visual checks or opaque black-box machine learning models with unpredictable failure modes. Aegis3D is a software prototype that ingests simulated acoustic sensor signals to detect structural anomalies using deterministic signal processing and statistical baselines.',
    description:
      'An AI-powered structural health monitoring system designed to detect unusual structural behavior using sensor data and signal processing.',
    architectureFlow:
      'Structure → Sensor Data (PZT + IMU + Environmental) [Planned Hardware / Implemented Simulator] → FastAPI Ingestion → Signal Processing (DC Filter, Butterworth, Windowing) → Anomaly Detection (Z-Score & Rolling Persistence) → Sensor Fusion (PZT TDOA Cross-Correlation) → Structural Health Index Calculation → SSE Live Telemetry Stream & Dashboard Alerts',
    architectureNodes: [
      {
        id: 'struct-sensor',
        name: 'Structure & Sensors',
        category: 'input',
        status: 'planned',
        details: 'Physical structural members with surface-mounted PZT acoustic transducers, IMUs, and environmental probes (currently running via physics-driven virtual simulator).',
      },
      {
        id: 'esp32-ingest',
        name: 'Sensor Ingestion / Simulator',
        category: 'input',
        status: 'implemented',
        details: 'Virtual physics-based multi-sensor simulator generating multi-sensor acoustic telemetry, tone burst excitation, and spatial wave damping across structural zones.',
      },
      {
        id: 'fastapi-backend',
        name: 'FastAPI Backend & Async Bus',
        category: 'software',
        status: 'implemented',
        details: 'FastAPI service with Pydantic v2 validation, in-memory LiveEventBus, and Server-Sent Events (SSE) streaming live telemetry to connected clients.',
      },
      {
        id: 'signal-proc',
        name: 'Signal Processing (NumPy/SciPy)',
        category: 'analysis',
        status: 'implemented',
        details: '9-stage deterministic pipeline: DC offset removal, Butterworth bandpass filtering, sample window burst detection, and FFT / RMS frequency extraction.',
      },
      {
        id: 'anomaly-detect',
        name: 'Anomaly Detection & Baselines',
        category: 'analysis',
        status: 'implemented',
        details: 'Dynamic baseline estimation, multi-window z-score anomaly scoring, and rolling persistence verification to filter transient noise.',
      },
      {
        id: 'sensor-fusion',
        name: 'Sensor Fusion & TDOA',
        category: 'analysis',
        status: 'implemented',
        details: 'Cross-correlation time-difference-of-arrival (TDOA) estimation across sensor pairs for acoustic burst localization and zone mapping.',
      },
      {
        id: 'shi-calc',
        name: 'Structural Health Index (SHI)',
        category: 'output',
        status: 'implemented',
        details: 'Explainable, bounded 0–100 Structural Health Index calculation reflecting cumulative zone integrity and deviation from baselines.',
      },
      {
        id: 'dashboard-alerts',
        name: 'Dashboard & Alert Escalation',
        category: 'output',
        status: 'partially-implemented',
        details: 'Live SSE telemetry stream and PostgreSQL event storage implemented; multi-level automated emergency alert escalation is planned.',
      },
    ],
    architectureDetails: {
      pipelineTitle: 'Aegis3D 9-Stage Telemetry & Signal Processing Pipeline',
      pipelineSummary:
        'Aegis3D uses explainable, deterministic mathematical signal processing rather than opaque neural networks to guarantee interpretable structural safety metrics.',
      stageExplanation: [
        {
          stage: '1. Sensor Data Ingestion',
          desc: 'FastAPI ingestion endpoint receiving time-series telemetry packets. Runs against a virtual multi-sensor simulator mimicking acoustic tone bursts and attenuation.',
          status: 'implemented',
        },
        {
          stage: '2. DC Offset Removal & Butterworth Filtering',
          desc: 'High-pass baseline correction followed by SciPy Butterworth 4th-order bandpass filter isolating acoustic frequencies and rejecting environmental noise.',
          status: 'implemented',
        },
        {
          stage: '3. Windowed Event Detection',
          desc: 'Sliding window sample segmentation detecting energetic acoustic emission bursts above adaptive noise thresholds.',
          status: 'implemented',
        },
        {
          stage: '4. FFT & RMS Feature Extraction',
          desc: 'Fast Fourier Transform (FFT) peak frequency identification, spectral energy centroid, and Root Mean Square (RMS) amplitude quantification.',
          status: 'implemented',
        },
        {
          stage: '5. Baseline Calculation',
          desc: 'Continuous calculation and tracking of ambient structural baselines across individual sensor zones.',
          status: 'implemented',
        },
        {
          stage: '6. Z-Score Anomaly Scoring',
          desc: 'Statistical deviation measurement against calibrated baseline distributions to identify abnormal stress spikes.',
          status: 'implemented',
        },
        {
          stage: '7. Rolling Persistence Analysis',
          desc: 'Multi-frame temporal verification ensuring single transient sensor glitches do not trigger false positive alarms.',
          status: 'implemented',
        },
        {
          stage: '8. PZT TDOA Cross-Correlation',
          desc: 'Cross-correlation time-difference-of-arrival (TDOA) estimation between transducer pairs to approximate acoustic disturbance origin.',
          status: 'implemented',
        },
        {
          stage: '9. Structural Health Index (SHI)',
          desc: 'Bounded composite index (0–100) aggregating anomaly severity, persistence, and zone health history for human engineering review.',
          status: 'implemented',
        },
      ],
    },
    keyDecisions: [
      'Chose deterministic signal processing (Butterworth + FFT + Z-score) over black-box deep learning models to guarantee fully explainable safety metrics for civil engineering evaluation.',
      'Adopted Pydantic v2 schemas for runtime input validation, serialization, and strict sensor packet contract enforcement.',
      'Selected Server-Sent Events (SSE) for unidirectional, lightweight live event streaming from the backend event bus.',
      'Built a physics-driven virtual sensor simulator to validate multi-sensor attenuation and concurrent burst processing before physical ESP32 hardware deployment.',
    ],
    challengesLearned:
      'Designing synthetic acoustic wave attenuation models that realistically simulate physical dampening across structural zones, and maintaining zero-lag asynchronous event broadcast under concurrent telemetry bursts.',
    myContribution:
      'Architected the FastAPI backend services and asynchronous in-memory event bus (LiveEventBus), designed the PostgreSQL database schema with Alembic migrations, implemented the 9-stage signal processing and anomaly scoring algorithms using NumPy/SciPy, built the physics-based synthetic sensor simulator, and wrote automated test suites.',
    cardHighlights: [
      'Deterministic 9-stage signal processing pipeline (Butterworth filtering, FFT spectra & z-score anomaly detection)',
      'FastAPI backend with in-memory LiveEventBus streaming telemetry via Server-Sent Events (SSE)',
      'PostgreSQL persistence with Alembic migrations modeling monitoring zones, sessions, and events',
      'Physics-based virtual simulator generating multi-sensor acoustic telemetry',
    ],
    implementedFeatures: [
      'FastAPI REST API with an asynchronous event bus (LiveEventBus) streaming live telemetry via Server-Sent Events (SSE).',
      'Deterministic 9-stage signal processing pipeline (DC offset removal, Butterworth filtering, burst detection, FFT frequency extraction, baseline z-scoring, and bounded 0–100 SHI score calculation).',
      'Relational database schema in PostgreSQL with Alembic migrations modeling Zones, MonitoringSessions, Events, Baselines, HealthSnapshots, and Alerts.',
      'Virtual multi-sensor physics-based signal simulator generating synthetic acoustic tone-burst excitation and propagation attenuation across structural zones.',
      'Strict request/response validation using Pydantic v2 schemas.',
      'Automated backend test suite covering signal processing, anomaly evaluation, and API endpoints.',
      'Containerized local development setup configured with Docker Compose for PostgreSQL and Mosquitto MQTT.',
    ],
    plannedFeatures: [
      'Physical benchtop hardware integration with ESP32 microcontrollers, PZT piezo ceramic transducers, and I2C IMU sensors.',
      'Field calibration for real-world predictive structural load limits.',
      'Multi-level automated emergency alert escalation workflows (SMS, email dispatch, webhook triggers).',
    ],
    techStack: [
      'FastAPI',
      'Python',
      'PostgreSQL',
      'NumPy & SciPy',
      'Alembic',
      'Pydantic v2',
      'Docker Compose',
      'Server-Sent Events (SSE)',
    ],
    status: 'Prototype',
    githubUrl: 'https://github.com/m4ulikP/Aegis3D',
    demoUrl: '',
    pendingConfirmation: false,
  },
  {
    id: 'outreach-os',
    title: 'OutreachOS',
    codeName: 'PROJ.OUT-02',
    tagline: 'Freelancer Sales Studio & Lead Management Application',
    problem:
      'Freelancers and small consulting studios often struggle with scattered lead lists across spreadsheets and heavyweight enterprise CRMs that add unnecessary overhead. OutreachOS is being developed as a focused, lightweight sales application for prospecting, duplicate prevention, and contact lifecycle tracking.',
    description:
      'A sales outreach and lead-management application designed to organize prospects, manage interactions, and support outreach workflows.',
    architectureFlow:
      'User Interface (Next.js 14 App Router) → API / Application Logic (Route Handlers & Server Actions) → Zod Payload Validation → 3-Tier Canonical Deduplication Engine → Prisma ORM → PostgreSQL Database → Brevo API Transactional Email Dispatcher with Exponential Retries',
    architectureNodes: [
      {
        id: 'ui-layer',
        name: 'User Interface',
        category: 'input',
        status: 'implemented',
        details: 'Next.js 14 App Router responsive interface with sales pipeline columns, lead creation modals, and Recharts conversion dashboards.',
      },
      {
        id: 'nextjs-app',
        name: 'Next.js 14 Application',
        category: 'software',
        status: 'implemented',
        details: 'Full-stack TypeScript architecture uniting server components, client interactivity, and modular REST route handlers (/api/leads, /api/health).',
      },
      {
        id: 'zod-valid',
        name: 'API Logic & Zod Validation',
        category: 'software',
        status: 'implemented',
        details: 'Strict schema validation on incoming leads, stage transitions, and interaction notes ensuring clean input sanitization.',
      },
      {
        id: 'dedup-engine',
        name: '3-Tier Deduplication Engine',
        category: 'analysis',
        status: 'implemented',
        details: 'Deterministic duplicate prevention: email address normalization, canonical LinkedIn URL cleaning, and composite company/name key matching.',
      },
      {
        id: 'prisma-orm',
        name: 'Prisma ORM & PostgreSQL',
        category: 'software',
        status: 'implemented',
        details: 'PostgreSQL relational persistence modeling Leads, Tags, Interactions, and Campaigns with type-safe Prisma client queries.',
      },
      {
        id: 'brevo-email',
        name: 'Brevo Email Integration',
        category: 'output',
        status: 'implemented',
        details: 'Transactional email delivery with exponential backoff retry handling for transient API errors (@getbrevo/brevo client).',
      },
      {
        id: 'enrichment-api',
        name: 'B2B Data Enrichment',
        category: 'analysis',
        status: 'partially-implemented',
        details: 'Pluggable provider interface adapter created; live integrations with third-party data APIs (Apollo, Hunter) are partially implemented.',
      },
      {
        id: 'calendar-sync',
        name: 'Calendar & Multi-Touch Scheduling',
        category: 'output',
        status: 'planned',
        details: 'Planned automated sequence timing, follow-up scheduling, and Google Calendar meeting discovery call synchronization.',
      },
    ],
    architectureDetails: {
      pipelineTitle: 'OutreachOS Lead Management & Deduplication Architecture',
      pipelineSummary:
        'OutreachOS combines deterministic 3-tier duplicate prevention with a structured 6-stage sales progression pipeline.',
      stageExplanation: [
        {
          stage: '1. Lead Creation & Ingestion',
          desc: 'Prospects added manually or via batch import. Inputs are validated through Zod schemas before database processing.',
          status: 'implemented',
        },
        {
          stage: '2. Normalized Email Matching',
          desc: 'Lowercases, trims, and strips provider aliases (e.g., +tags) to match against existing lead records.',
          status: 'implemented',
        },
        {
          stage: '3. Canonical LinkedIn URL Resolution',
          desc: 'Normalizes varied LinkedIn profile URL formats (removing query parameters, protocol variations, and localized subdomains) to ensure unique profile mapping.',
          status: 'implemented',
        },
        {
          stage: '4. Composite Key Matching',
          desc: 'Generates normalized composite keys combining full name and company domain to catch duplicates where emails differ.',
          status: 'implemented',
        },
        {
          stage: '5. Sales Lifecycle Tracking',
          desc: 'Six implemented progression stages: New → Contacted → Follow-Up → Replied → Meeting Scheduled → Client.',
          status: 'implemented',
        },
        {
          stage: '6. Tagging & Interaction Logging',
          desc: 'Records timestamped notes, outreach history, and multi-tag filtering across campaigns.',
          status: 'implemented',
        },
        {
          stage: '7. Transactional Email with Retry Handling',
          desc: 'Dispatches outreach emails through Brevo API with retry logic and exponential backoff for transient network issues.',
          status: 'implemented',
        },
        {
          stage: '8. Lead Enrichment',
          desc: 'Adapter interfaces drafted for external B2B profile enrichment (Apollo/Hunter), currently partially implemented.',
          status: 'partially-implemented',
        },
        {
          stage: '9. Multi-Touch Sequences & Calendar Sync',
          desc: 'Automated follow-up reminders and direct Google Calendar meeting scheduling planned for future release.',
          status: 'planned',
        },
      ],
    },
    keyDecisions: [
      'Constructed a 3-tier canonical deduplication system (email normalization, LinkedIn URL canonicalization, and normalized composite keys) to avoid awkward duplicate client outreach.',
      'Adopted Next.js 14 App Router for a unified full-stack TypeScript codebase, co-locating server actions, REST route handlers, and UI components.',
      'Integrated Brevo transactional email delivery with exponential backoff and transient failure retries.',
      'Designed a normalized relational schema with Prisma ORM to track comprehensive lead interaction histories and lifecycle transitions.',
    ],
    challengesLearned:
      'Normalizing unstructured, inconsistent lead URLs and international contact records into deterministic database composite keys before batch ingestion.',
    myContribution:
      'Architected and implemented the full-stack Next.js 14 application, structured the PostgreSQL database schema with Prisma ORM, engineered the 3-tier deduplication algorithms (email normalization, LinkedIn URL canonicalization, and normalized composite keys), built REST API route handlers with Zod validation, integrated Brevo transactional email, and authored the automated test suite.',
    cardHighlights: [
      'Deterministic 3-tier deduplication engine (email normalization, LinkedIn URL parsing & normalized composite keys)',
      'Continuous 6-stage sales progression pipeline (New → Contacted → Follow-Up → Replied → Meeting Scheduled → Client)',
      'Next.js 14 App Router architecture with Zod schema validation and PostgreSQL/Prisma persistence',
      'Transactional email integration via Brevo with exponential backoff retry handling',
    ],
    implementedFeatures: [
      'Deterministic 3-tier deduplication engine (email normalization, canonical LinkedIn URL parsing, and normalized composite keys on name and company domain).',
      'Continuous sales progression pipeline (New → Contacted → Follow-Up → Replied → Meeting Scheduled → Client) with quick-action contact triggers.',
      'Next.js 14 App Router architecture with modular API route handlers (/api/leads, /api/health, /api/discovery) and Zod payload validation.',
      'PostgreSQL database persistence with Prisma ORM modeling Leads, Tags, Interactions, and Campaigns.',
      'Outreach and conversion analytics dashboard powered by Recharts (conversion rates, stage drop-offs, and daily activity tracking).',
      'Transactional email provider integration using Brevo (@getbrevo/brevo) with exponential backoff retry handling for transient API errors.',
      'Automated test suite verifying deduplication logic, lifecycle transitions, and API adapters.',
    ],
    plannedFeatures: [
      'Live third-party B2B data enrichment APIs (Apollo, Hunter, Proxycurl) via existing adapter interfaces (partially implemented).',
      'Automated multi-turn sequence drafting and Google Calendar discovery call synchronization.',
    ],
    techStack: [
      'Next.js 14',
      'React 18',
      'TypeScript',
      'PostgreSQL',
      'Prisma ORM',
      'Tailwind CSS',
      'Zod',
      'Brevo API',
      'Recharts',
      'Docker Compose',
    ],
    status: 'Partially implemented',
    githubUrl: 'https://github.com/m4ulikP/OutreachOS',
    demoUrl: '',
    pendingConfirmation: false,
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'flyrank-ai',
    index: '01',
    period: 'Jul 1 – Aug 26, 2026',
    role: 'Backend AI Engineer Intern',
    company: 'Flyrank AI',
    roleType: 'Internship',
    location: 'Remote',
    status: 'Completed',
    summary:
      'Completed a backend AI engineering internship focused on backend AI systems, REST API development, and applied machine learning integration.',
    responsibilities: [
      'Developed and maintained backend AI services and REST API endpoints using Python and FastAPI.',
      'Implemented Retrieval-Augmented Generation (RAG) pipelines for contextual knowledge retrieval.',
      'Integrated Large Language Model (LLM) APIs with structured output validation and function/tool calling.',
      'Assisted in AI model and agent evaluation workflows to assess output quality and consistency.',
    ],
    technicalAreas: [
      'Backend AI Systems',
      'REST APIs',
      'Retrieval-Augmented Generation (RAG)',
      'AI Agents & LLM Integration',
      'Tool Calling & Structured Outputs',
      'Model Evaluation',
    ],
    stack: ['Python', 'FastAPI', 'LLM APIs', 'RAG Pipelines', 'REST APIs'],
    pendingConfirmation: false,
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: '01',
    code: '01',
    categoryName: 'Programming Languages',
    items: [
      { skill: 'Python', proficiency: 'Intermediate', linkUrl: 'https://www.python.org/' },
      { skill: 'Java', proficiency: 'Intermediate' },
      { skill: 'C++', proficiency: 'Intermediate' },
      { skill: 'JavaScript', proficiency: 'Currently Learning' },
      { skill: 'TypeScript', proficiency: 'Currently Learning' },
    ],
  },
  {
    id: '02',
    code: '02',
    categoryName: 'Web Fundamentals',
    items: [
      { skill: 'HTML', proficiency: 'Beginner / Currently Learning' },
      { skill: 'CSS', proficiency: 'Beginner / Currently Learning' },
    ],
  },
  {
    id: '03',
    code: '03',
    categoryName: 'Developer Tools',
    items: [
      { skill: 'Git', proficiency: 'Comfortable Using' },
      { skill: 'GitHub', proficiency: 'Comfortable Using', linkUrl: 'https://github.com/m4ulikP' },
      { skill: 'VS Code', proficiency: 'Comfortable Using' },
    ],
  },
  {
    id: '04',
    code: '04',
    categoryName: 'Machine Learning & Data Science',
    items: [
      { skill: 'Machine Learning', proficiency: 'Beginner / Currently Learning' },
      { skill: 'NumPy', proficiency: 'Beginner' },
      { skill: 'pandas', proficiency: 'Beginner' },
      { skill: 'Matplotlib', proficiency: 'Beginner' },
    ],
  },
  {
    id: '05',
    code: '05',
    categoryName: 'Engineering & CS',
    items: [
      { skill: 'Data Structures & Algorithms', proficiency: 'Currently Learning' },
      { skill: 'Docker', proficiency: 'Beginner / Currently Learning' },
    ],
  },
  {
    id: '06',
    code: '06',
    categoryName: 'AI-Assisted Development',
    items: [
      {
        skill: 'Google Antigravity',
        proficiency: 'Hands-on Experience',
        linkUrl: 'https://antigravity.google/',
      },
    ],
  },
];

export const COURSES_AND_LEARNING: CourseLearningItem[] = [
  {
    title: "Machine Learning Specialization",
    issuer: "DeepLearning.AI & Stanford Online — Andrew Ng",
    description: "Coursework covering supervised learning, neural networks, decision trees, and foundational machine learning algorithms.",
    tag: "Specialization Certificate",
  },
];
