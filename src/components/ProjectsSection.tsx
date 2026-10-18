import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS, AEGIS_STAGES } from '../data/projectsData';
import { SpotlightCard } from './reactbits/SpotlightCard';
import { DecryptedText } from './reactbits/DecryptedText';
import {
  sectionHeaderVariants,
  eyebrowVariants,
  titleVariants,
  descVariants,
  contentBlockVariants,
  reducedMotionVariants,
  SECTION_VIEWPORT,
  ITEM_VIEWPORT,
} from '../utils/revealVariants';
import './ProjectsSection.css';

interface ProjectsSectionProps {
  selectedProjectId?: string | null;
  onSelectProject?: (id: string | null) => void;
  isReducedMotion?: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  selectedProjectId: controlledSelectedProjectId,
  onSelectProject,
  isReducedMotion: propIsReducedMotion,
}) => {
  const [internalSelectedProjectId, setInternalSelectedProjectId] = useState<string | null>(null);
  const [activePipelineStage, setActivePipelineStage] = useState<number>(0);
  const [canHover, setCanHover] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const isReducedMotion =
    propIsReducedMotion ??
    (typeof window !== 'undefined'
      ? document.documentElement.getAttribute('data-reduced-motion') === 'true' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false);

  // Normalize legacy/canonical IDs so 'structura' seamlessly resolves to 'aegis3d'
  const rawId =
    controlledSelectedProjectId !== undefined
      ? controlledSelectedProjectId
      : internalSelectedProjectId;
  const selectedProjectId = rawId === 'structura' ? 'aegis3d' : rawId;

  const handleSelectProject = useCallback((id: string | null) => {
    const canonicalId = id === 'structura' ? 'aegis3d' : id;
    if (onSelectProject) {
      onSelectProject(canonicalId);
    }
    setInternalSelectedProjectId(canonicalId);
  }, [onSelectProject]);

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleSelectProject(null);
    };
    if (selectedProjectId) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('data-case-study-open', 'true');
    } else {
      document.body.style.overflow = '';
      document.body.removeAttribute('data-case-study-open');
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      document.body.removeAttribute('data-case-study-open');
    };
  }, [selectedProjectId, handleSelectProject]);

  const activeProject = PROJECTS.find((p) => p.id === selectedProjectId);

  return (
    <section id="work" className="projects-section" aria-labelledby="projects-heading">
      <div className="site-container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          variants={isReducedMotion ? reducedMotionVariants : sectionHeaderVariants}
          initial={isReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={SECTION_VIEWPORT}
        >
          <motion.div
            className="section-tag font-mono"
            variants={isReducedMotion ? reducedMotionVariants : eyebrowVariants}
          >
            <span className="tag-index">[ 01 ]</span>
            <DecryptedText
              text="SELECTED WORK"
              animateOn="view"
              speed={65}
              sequential={true}
              isReducedMotion={isReducedMotion}
            />
          </motion.div>
          <motion.h2
            id="projects-heading"
            className="section-title font-display"
            variants={isReducedMotion ? reducedMotionVariants : titleVariants}
          >
            Featured Engineering Projects
          </motion.h2>
          <motion.p
            className="section-desc font-body"
            variants={isReducedMotion ? reducedMotionVariants : descVariants}
          >
            A selection of projects I've built while learning software engineering and applied AI.
          </motion.p>
        </motion.div>

        {/* Projects Editorial Flow */}
        <div className="projects-editorial-list">
          {PROJECTS.map((project, index) => (
            <motion.article
              key={project.id}
              className={`project-entry project-${project.id} ${index % 2 === 1 ? 'project-reverse' : ''}`}
              aria-labelledby={`project-title-${project.id}`}
              variants={isReducedMotion ? reducedMotionVariants : contentBlockVariants}
              initial={isReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={ITEM_VIEWPORT}
              whileHover={
                !isReducedMotion && canHover
                  ? { y: -3.5, transition: { type: 'spring', stiffness: 380, damping: 26 } }
                  : undefined
              }
              whileTap={
                !isReducedMotion
                  ? { scale: 0.995, transition: { type: 'spring', stiffness: 450, damping: 30 } }
                  : undefined
              }
            >
              {/* Project Visual Presentation */}
              <div className="project-visual-wrapper" aria-label={`Visual demonstration for ${project.title}`}>
                {project.id === 'aegis3d' && (
                  <SpotlightCard
                    className="editorial-preview-widget aegis-widget"
                    spotlightSize={260}
                    intensity={0.22}
                    borderGlow={0.45}
                    softness={0.75}
                    isReducedMotion={isReducedMotion}
                  >
                    <div className="widget-header font-mono">
                      <span className="widget-dot cyan" />
                      <span>9-STAGE TELEMETRY &amp; DSP PIPELINE</span>
                    </div>

                    {/* Unified Architecture Visual: Waveform Conditioning & Pipeline Stages */}
                    <div className="central-illustration wave-pipeline-illustration font-mono" aria-hidden="true">
                      {/* Bounded Acoustic Waveform Stream */}
                      <div className="waveform-container">
                        <div className="waveform-label">ACOUSTIC STREAM (4.8 kHz BANDPASS)</div>
                        <svg viewBox="0 0 300 36" className="waveform-svg" preserveAspectRatio="xMidYMid meet">
                          <defs>
                            <linearGradient id="waveGradAegis" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#34D399" stopOpacity="0.25" />
                              <stop offset="50%" stopColor="#34D399" stopOpacity="0.9" />
                              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.65" />
                            </linearGradient>
                          </defs>
                          {/* Baseline */}
                          <line x1="4" y1="18" x2="296" y2="18" stroke="rgba(148, 163, 184, 0.16)" strokeDasharray="3 5" strokeWidth="0.8" />
                          {/* Smooth illustrative waveform — all peaks within Y:11–25, never touching edges */}
                          <path
                            d="M 4 18 C 16 18, 22 11, 38 18 C 54 25, 60 11, 76 18 C 88 25, 96 13, 110 18 C 124 23, 130 12, 146 18 C 162 24, 168 10, 184 18 C 200 26, 208 11, 224 18 C 238 25, 246 13, 260 18 C 272 23, 280 14, 296 18"
                            fill="none"
                            stroke="url(#waveGradAegis)"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      {/* Deterministic Pipeline Node Strip */}
                      <div className="pipeline-node-strip">
                        <div className="p-node">
                          <span className="p-num">01</span>
                          <span className="p-txt">INGEST</span>
                        </div>
                        <span className="p-arrow">→</span>
                        <div className="p-node">
                          <span className="p-num">03</span>
                          <span className="p-txt">FILTER</span>
                        </div>
                        <span className="p-arrow">→</span>
                        <div className="p-node">
                          <span className="p-num">06</span>
                          <span className="p-txt">DETECT</span>
                        </div>
                        <span className="p-arrow">→</span>
                        <div className="p-node highlight">
                          <span className="p-num">09</span>
                          <span className="p-txt">SHI</span>
                        </div>
                      </div>
                    </div>

                    <div className="widget-footer font-mono">
                      <span>LOCAL TEST SUITE · ESP32 PROTOTYPE</span>
                      <span className="text-mint">9-STAGE PIPELINE</span>
                    </div>
                  </SpotlightCard>
                )}

                {project.id === 'outreach-os' && (
                  <SpotlightCard
                    className="editorial-preview-widget outreach-widget"
                    spotlightSize={260}
                    intensity={0.22}
                    borderGlow={0.45}
                    softness={0.75}
                    isReducedMotion={isReducedMotion}
                  >
                    <div className="widget-header font-mono">
                      <span className="widget-dot amber" />
                      <span>FREELANCER SALES STUDIO // PROSPECTING PIPELINE</span>
                    </div>

                    {/* Restrained Prospecting & Deduplication Studio Preview */}
                    <div className="central-illustration outreach-illustration font-mono" aria-hidden="true">
                      <div className="outreach-studio-preview">
                        <div className="studio-record-header">
                          <span className="studio-lead-badge">PROSPECT RECORD</span>
                          <span className="studio-lead-status text-mint">FOLLOW-UP DUE</span>
                        </div>
                        <div className="studio-lead-body">
                          <div className="lead-meta-row">
                            <span className="lead-target">VP Engineering · Cloud SaaS</span>
                            <span className="lead-dedup-badge">SHA-256 DEDUP OK</span>
                          </div>
                          <div className="studio-pipeline-strip">
                            <span className="pipe-stage done">NEW</span>
                            <span className="pipe-arrow">›</span>
                            <span className="pipe-stage active">CONTACTED</span>
                            <span className="pipe-arrow">›</span>
                            <span className="pipe-stage">REPLIED</span>
                            <span className="pipe-arrow">›</span>
                            <span className="pipe-stage">POSITIVE</span>
                            <span className="pipe-arrow">›</span>
                            <span className="pipe-stage">CALL</span>
                          </div>
                          <div className="lead-action-status">
                            <span className="action-dot" />
                            <span>SEQUENCE STEP 2 OF 3 · PERSONALIZED DRAFT QUEUED</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="widget-footer font-mono">
                      <span>POSTGRESQL + PRISMA</span>
                      <span className="text-mint">3-TIER DETERMINISTIC DEDUP</span>
                    </div>
                  </SpotlightCard>
                )}
              </div>

              {/* Project Content Description */}
              <div className="project-details">
                {project.statusLabel && (
                  <div className="project-status-tag font-mono">
                    <span className="status-indicator-bullet" />
                    <span>{project.statusLabel}</span>
                  </div>
                )}

                <h3 id={`project-title-${project.id}`} className="project-headline font-display">
                  {project.title}
                </h3>

                <p className="project-one-liner font-body">
                  {project.summary}
                </p>

                {/* 3-5 Relevant Technology Labels */}
                <div className="project-tech-labels" aria-label="Key Technologies">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="tech-label font-mono">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="project-action-row">
                  <button
                    type="button"
                    className="btn-open-case-study font-mono"
                    onClick={() => handleSelectProject(project.id)}
                    aria-label={`View case study for ${project.title}`}
                  >
                    <span>View case study</span>
                    <span className="arrow-glyph" aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* ======================================================================
          REFINED EDITORIAL CASE STUDY MODAL
          ====================================================================== */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {activeProject && (
          <motion.div
            key="modal-backdrop"
            className="modal-backdrop"
            onClick={() => handleSelectProject(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            data-liquid-ignore="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: isReducedMotion ? 0.08 : 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <motion.div
              key="modal-window"
              className="modal-window"
              onClick={(e) => e.stopPropagation()}
              initial={
                isReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 16, scale: 0.975 }
              }
              animate={
                isReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                isReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 12, scale: 0.98 }
              }
              transition={{
                duration: isReducedMotion ? 0.08 : 0.22,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-title-group font-mono">
                <span className="modal-number">{activeProject.number}</span>
                <span className="modal-breadcrumb">CASE STUDY // {activeProject.title}</span>
              </div>
              <button
                type="button"
                className="modal-close-button font-mono"
                onClick={() => handleSelectProject(null)}
                aria-label="Close case study"
              >
                CLOSE [ESC] ✕
              </button>
            </div>

            {/* Modal Body - Structured 6-Part Editorial Sequence */}
            <div className="modal-body">
              <div className="modal-hero">
                <div className="modal-status-pill font-mono">
                  {activeProject.statusLabel}
                </div>
                <h3 id="modal-title" className="modal-main-title font-display">
                  {activeProject.title}
                </h3>
                <p className="modal-summary-lead font-body">
                  {activeProject.summary}
                </p>
              </div>

              {/* 1. Overview & Problem */}
              <section className="cs-block">
                <h4 className="cs-title font-display">1. Overview &amp; Problem</h4>
                <p className="font-body">{activeProject.problem}</p>
              </section>

              {/* 2. My Contribution */}
              <section className="cs-block">
                <h4 className="cs-title font-display">2. My Contribution</h4>
                <p className="font-body">{activeProject.myContribution}</p>
              </section>

              {/* 3. Technical Approach & Architecture */}
              <section className="cs-block">
                <h4 className="cs-title font-display">3. Technical Approach &amp; Architecture</h4>
                <p className="font-body">{activeProject.approach}</p>

                {activeProject.id === 'aegis3d' && (
                  <div className="pipeline-flow font-mono">
                    <div className="flow-step-item">
                      <span className="step-num">01</span>
                      <span className="step-label">PZT Edge Sensors</span>
                    </div>
                    <span className="flow-sep">→</span>
                    <div className="flow-step-item">
                      <span className="step-num">02</span>
                      <span className="step-label">ESP32 Sampling</span>
                    </div>
                    <span className="flow-sep">→</span>
                    <div className="flow-step-item">
                      <span className="step-num">03</span>
                      <span className="step-label">Butterworth Filter</span>
                    </div>
                    <span className="flow-sep">→</span>
                    <div className="flow-step-item">
                      <span className="step-num">04</span>
                      <span className="step-label">|z| ≥ 3.0 Detection</span>
                    </div>
                    <span className="flow-sep">→</span>
                    <div className="flow-step-item">
                      <span className="step-num">05</span>
                      <span className="step-label">SHI Health Index</span>
                    </div>
                  </div>
                )}
              </section>

              {/* 4. Implementation Details & Evidence */}
              <section className="cs-block">
                <h4 className="cs-title font-display">4. Implementation Details &amp; Evidence</h4>

                {activeProject.id === 'aegis3d' && (
                  <div className="aegis-unified-evidence">
                    <div className="pipeline-explorer font-mono">
                      <p className="explorer-caption">
                        Select a pipeline stage to inspect verified backend processing logic:
                      </p>
                      <div className="pipeline-btn-grid">
                        {AEGIS_STAGES.map((s, idx) => (
                          <button
                            key={s.step}
                            type="button"
                            className={`stage-nav-btn ${activePipelineStage === idx ? 'active' : ''}`}
                            onClick={() => setActivePipelineStage(idx)}
                          >
                            <span className="btn-step">{s.step}</span>
                            <span className="btn-name">{s.name}</span>
                          </button>
                        ))}
                      </div>
                      <div className="stage-explanation-box">
                        <div className="exp-box-header">
                          <span className="text-cyan">
                            STAGE {AEGIS_STAGES[activePipelineStage].step}: {AEGIS_STAGES[activePipelineStage].name.toUpperCase()}
                          </span>
                          <span className="text-mint">DOCUMENTED PIPELINE STAGE</span>
                        </div>
                        <p className="exp-box-text font-body">
                          {AEGIS_STAGES[activePipelineStage].desc}
                        </p>
                      </div>
                    </div>

                    {/* Static, Documented Architecture Pipeline Diagram */}
                    <div className="aegis-static-pipeline-card font-mono">
                      <div className="static-pipeline-header">
                        <span className="pipeline-diagram-tag">[ ARCHITECTURE DATAFLOW ]</span>
                        <span className="pipeline-diagram-title">Documented Ingestion &amp; Health Pipeline</span>
                      </div>
                      <div className="static-pipeline-grid" aria-label="Aegis3D architectural pipeline dataflow">
                        <div className="pipeline-flow-card">
                          <span className="flow-card-num">STAGE 01–02</span>
                          <strong className="flow-card-title">Signal Ingestion</strong>
                          <span className="flow-card-desc">ESP32 amplitude arrays &amp; channel metadata</span>
                        </div>
                        <span className="flow-card-arrow" aria-hidden="true">→</span>
                        <div className="pipeline-flow-card">
                          <span className="flow-card-num">STAGE 03–05</span>
                          <strong className="flow-card-title">DSP Conditioning</strong>
                          <span className="flow-card-desc">4th-order Butterworth bandpass &amp; baseline FFT</span>
                        </div>
                        <span className="flow-card-arrow" aria-hidden="true">→</span>
                        <div className="pipeline-flow-card">
                          <span className="flow-card-num">STAGE 06–07</span>
                          <strong className="flow-card-title">Anomaly Detection</strong>
                          <span className="flow-card-desc">|z| ≥ 3.0 statistical spikes &amp; correlation</span>
                        </div>
                        <span className="flow-card-arrow" aria-hidden="true">→</span>
                        <div className="pipeline-flow-card highlight">
                          <span className="flow-card-num">STAGE 08–09</span>
                          <strong className="flow-card-title">Health Index (SHI)</strong>
                          <span className="flow-card-desc">0–100 score &amp; async event dispatch</span>
                        </div>
                      </div>
                      <div className="static-pipeline-footer">
                        <span>9-STAGE FASTAPI &amp; NUMPY PIPELINE · TESTED WITH PYTEST</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeProject.id === 'outreach-os' && (
                  <div className="outreach-architecture-box font-mono">
                    <div className="architecture-header font-mono">
                      <span>3-TIER DETERMINISTIC DEDUPLICATION &amp; PIPELINE ARCHITECTURE</span>
                    </div>
                    <div className="dedup-pipeline-visual">
                      <div className="dedup-step">
                        <span className="step-tag text-mint">TIER 01</span>
                        <strong className="step-title">Email Normalization</strong>
                        <span className="step-desc">RFC standard lowercase, strip plus-addressing &amp; provider dots</span>
                      </div>
                      <span className="step-arrow" aria-hidden="true">→</span>
                      <div className="dedup-step">
                        <span className="step-tag text-mint">TIER 02</span>
                        <strong className="step-title">LinkedIn Canonicalization</strong>
                        <span className="step-desc">Normalize profile paths, strip UTM tracking queries &amp; trailing slashes</span>
                      </div>
                      <span className="step-arrow" aria-hidden="true">→</span>
                      <div className="dedup-step">
                        <span className="step-tag text-mint">TIER 03</span>
                        <strong className="step-title">Composite SHA-256</strong>
                        <span className="step-desc">SHA-256 hash over sanitized(fullName) + sanitized(companyDomain)</span>
                      </div>
                    </div>
                    <div className="implementation-status-grid">
                      <div className="status-grid-item verified">
                        <span className="status-grid-badge">IMPLEMENTED</span>
                        <span className="status-grid-text">Next.js 14 App Router, 6-Stage Pipeline, 3-Tier Dedup, Zod &amp; NextAuth, 128 Automated Vitest Suites</span>
                      </div>
                      <div className="status-grid-item in-dev">
                        <span className="status-grid-badge">IN DEVELOPMENT</span>
                        <span className="status-grid-text">Public web prospect discovery &amp; AI-assisted message personalization adapter</span>
                      </div>
                      <div className="status-grid-item planned">
                        <span className="status-grid-badge">PLANNED</span>
                        <span className="status-grid-text">Asynchronous sequence worker queue &amp; 2-way Google Calendar OAuth integration</span>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* 5. Challenges & Decisions */}
              <section className="cs-block">
                <h4 className="cs-title font-display">5. Challenges &amp; Engineering Decisions</h4>
                <p className="font-body">{activeProject.challenges}</p>
              </section>

              {/* 6. Technologies & Evidence */}
              <section className="cs-block">
                <h4 className="cs-title font-display">6. Verified Technologies &amp; Verification</h4>
                <div className="tech-tags-list">
                  {activeProject.techStack.map((tech) => (
                    <span key={tech} className="tech-tag-badge font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="evidence-footer-note font-mono">
                  EVIDENCE: {activeProject.repoEvidence}
                </p>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer font-mono">
              <span>MAULIK.EXE // CASE STUDY ARCHIVE</span>
              <button
                type="button"
                className="btn-modal-dismiss"
                onClick={() => handleSelectProject(null)}
              >
                CLOSE [ESC]
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )}
  </section>
);
};
