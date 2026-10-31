import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { PROJECTS } from '../data/portfolioData';
import type { Project } from '../types';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { ArrowUpRight, Layers, CheckCircle2, X, Clock, HelpCircle, Cpu, ShieldCheck } from 'lucide-react';
import { playTactileClick, playSwitchTone } from '../utils/sound';

export const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  const triggerButtonRef = useRef<HTMLElement | null>(null);

  const handleCloseModal = useCallback(() => {
    playTactileClick();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSelectedProject(null);
      setIsClosing(false);
      return;
    }
    setIsClosing(true);
    setTimeout(() => {
      setSelectedProject(null);
      setIsClosing(false);
    }, 180);
  }, []);

  const handleOpenModal = (project: Project, e?: React.MouseEvent) => {
    playSwitchTone(true);
    if (e) {
      triggerButtonRef.current = e.currentTarget as HTMLElement;
    }
    setIsClosing(false);
    setSelectedProject(project);
  };

  useEffect(() => {
    if (!selectedProject) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the close button or first actionable element upon opening
    const timer = setTimeout(() => {
      const focusableElements = modalContainerRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }, 30);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      } else if (e.key === 'Tab' && modalContainerRef.current) {
        const focusables = Array.from(
          modalContainerRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const triggerBtn = triggerButtonRef.current;

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      // Restore focus to triggering button
      triggerBtn?.focus();
    };
  }, [selectedProject, handleCloseModal]);

  return (
    <section className="projects-section" id="projects" aria-label="Featured Projects">
      <div className="container">
        {/* Section Header */}
        <div className="section-marker">
          <div className="label-mono">
            <span className="section-number">03</span>
            <span className="section-title">FEATURED PROJECTS</span>
          </div>
          <span className="label-mono font-mono text-muted">
            [{PROJECTS.length.toString().padStart(2, '0')}] FEATURED
          </span>
        </div>

        {/* Projects Grid: Exactly Aegis3D and OutreachOS */}
        <div className="projects-grid">
          {PROJECTS.map((project) => (
            <article key={project.id} className="project-card surface-card">
              {/* Card Header */}
              <div className="project-card-header font-mono">
                <div className="header-left">
                  <span className="proj-title-tag">{project.title.toUpperCase()}</span>
                </div>
                <span className="badge-brutal badge-yellow font-mono">
                  {project.status.toUpperCase()}
                </span>
              </div>

              {/* Card Body - Focused & Scannable */}
              <div className="project-card-body">
                <div className="title-group">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-tagline font-mono">{project.tagline}</p>
                </div>

                <p className="project-desc">{project.description}</p>

                {/* Main Technologies */}
                <div className="tech-stack-row">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="tech-tag font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="project-card-footer font-mono">
                <div className="status-indicator">
                  <span className="status-pip active"></span>
                  <span>{project.status}</span>
                </div>

                <div className="card-actions">
                  <button
                    type="button"
                    className="btn-brutal btn-details-link"
                    onClick={(e) => handleOpenModal(project, e)}
                  >
                    <Layers size={14} />
                    <span>CASE STUDY &amp; ARCHITECTURE</span>
                  </button>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-brutal btn-repo-link"
                      onClick={() => playTactileClick()}
                    >
                      <span>REPO</span>
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Modal: Project Technical Breakdown rendered via Portal */}
        {selectedProject &&
          typeof document !== 'undefined' &&
          createPortal(
            <div
              className={`modal-backdrop ${isClosing ? 'is-leaving' : 'is-entering'}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              onClick={(e) => {
                if (e.target === e.currentTarget) handleCloseModal();
              }}
            >
              <div
                ref={modalContainerRef}
                className={`modal-container surface-card ${isClosing ? 'is-leaving' : 'is-entering'}`}
              >
                <div className="modal-header font-mono">
                  <div className="modal-tag-group">
                    <span className="modal-badge badge-brutal badge-yellow">
                      {selectedProject.status.toUpperCase()}
                    </span>
                    <span id="modal-title" className="modal-title">
                      {selectedProject.title} // CASE STUDY
                    </span>
                  </div>
                  <button
                    type="button"
                    className="modal-close-btn"
                    onClick={handleCloseModal}
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="modal-body">
                  {/* 1. OVERVIEW */}
                  <section className="modal-section" aria-labelledby="sec-overview">
                    <div className="section-header-tag font-mono">
                      <HelpCircle size={14} />
                      <h4 id="sec-overview" className="section-heading">1. OVERVIEW — PURPOSE &amp; PROBLEM CONTEXT</h4>
                    </div>
                    <div className="modal-overview-content">
                      <p className="modal-problem-desc">{selectedProject.problem}</p>
                      <p className="modal-desc">{selectedProject.description}</p>
                    </div>
                  </section>

                  {/* 2. ARCHITECTURE */}
                  <section className="modal-section" aria-labelledby="sec-arch">
                    <div className="section-header-tag font-mono">
                      <Layers size={14} />
                      <h4 id="sec-arch" className="section-heading">2. ARCHITECTURE — COMPONENT &amp; DATA FLOW PIPELINE</h4>
                    </div>
                    <ArchitectureDiagram project={selectedProject} />
                  </section>

                  {/* 3. IMPLEMENTATION */}
                  <section className="modal-section" aria-labelledby="sec-impl">
                    <div className="section-header-tag font-mono">
                      <CheckCircle2 size={14} />
                      <h4 id="sec-impl" className="section-heading">3. IMPLEMENTATION — VERIFIED SOFTWARE CAPABILITIES</h4>
                    </div>
                    <div className="implementation-box surface-flat">
                      <ul className="modal-feature-list font-mono">
                        {selectedProject.implementedFeatures.map((item, idx) => (
                          <li key={idx}>✓ {item}</li>
                        ))}
                      </ul>
                    </div>
                  </section>

                  {/* 4. TECHNICAL DECISIONS */}
                  {selectedProject.keyDecisions && selectedProject.keyDecisions.length > 0 && (
                    <section className="modal-section" aria-labelledby="sec-decisions">
                      <div className="section-header-tag font-mono">
                        <ShieldCheck size={14} />
                        <h4 id="sec-decisions" className="section-heading">4. TECHNICAL DECISIONS &amp; ENGINEERING TRADEOFFS</h4>
                      </div>
                      <div className="decisions-box font-mono">
                        <ul className="decisions-list">
                          {selectedProject.keyDecisions.map((decision, dIdx) => (
                            <li key={dIdx}>→ {decision}</li>
                          ))}
                        </ul>
                      </div>
                    </section>
                  )}

                  {/* 5. CURRENT STATUS */}
                  <section className="modal-section" aria-labelledby="sec-status">
                    <div className="section-header-tag font-mono">
                      <Clock size={14} />
                      <h4 id="sec-status" className="section-heading">5. CURRENT STATUS — VERIFIED VS. PLANNED INTEGRATION</h4>
                    </div>
                    <div className="status-grid">
                      <div className="status-card surface-flat">
                        <div className="status-card-header font-mono status-active-header">
                          <CheckCircle2 size={13} />
                          <span>CURRENT STATUS: {selectedProject.status.toUpperCase()}</span>
                        </div>
                        <p className="status-card-desc font-mono">
                          {selectedProject.id === 'aegis3d'
                            ? 'Software prototype fully functional against simulated multi-sensor telemetry in Docker Compose. Physical ESP32 hardware and alert escalation remain planned future milestones.'
                            : 'Core application, 3-tier deduplication, 6-stage sales pipeline, and Brevo transactional email are implemented and tested. External enrichment and calendar sync are in progress/planned.'}
                        </p>
                      </div>

                      {selectedProject.plannedFeatures && selectedProject.plannedFeatures.length > 0 && (
                        <div className="status-card surface-flat">
                          <div className="status-card-header font-mono">
                            <Clock size={13} />
                            <span>PLANNED INTEGRATIONS &amp; FUTURE ROADMAP</span>
                          </div>
                          <ul className="modal-feature-list font-mono text-muted">
                            {selectedProject.plannedFeatures.map((item, idx) => (
                              <li key={idx}>◇ {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* 6. TECHNOLOGY STACK */}
                  <section className="modal-section" aria-labelledby="sec-stack">
                    <div className="section-header-tag font-mono">
                      <Cpu size={14} />
                      <h4 id="sec-stack" className="section-heading">6. TECHNOLOGY STACK — EMPLOYED TECHNOLOGIES</h4>
                    </div>
                    <div className="modal-stack-group font-mono">
                      <div className="modal-chips">
                        {selectedProject.techStack.map((tech) => (
                          <span key={tech} className="modal-chip">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>

                <div className="modal-footer font-mono">
                  <button
                    type="button"
                    className="btn-brutal"
                    onClick={handleCloseModal}
                  >
                    CLOSE [ESC]
                  </button>
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-brutal btn-primary"
                      onClick={() => playTactileClick()}
                    >
                      <span>VIEW GITHUB REPOSITORY</span>
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>

      <style>{`
        .projects-section {
          padding-top: var(--space-2xl);
          padding-bottom: var(--space-3xl);
        }

        .text-muted {
          color: var(--color-text-muted);
        }

        .projects-audit-notice {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: var(--space-xl);
          padding: 0.65rem 1rem;
          background-color: var(--bg-surface-secondary);
          border: var(--border-width-sm) solid var(--border-color-default);
          font-size: 0.74rem;
          font-weight: 700;
        }

        .badge-pending {
          background-color: var(--bg-surface-tertiary);
          color: var(--color-text-secondary);
          border: 1px solid var(--border-color-default);
        }

        .projects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 900px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .project-card {
          display: flex;
          flex-direction: column;
          background-color: var(--bg-surface);
          position: relative;
          transition: transform 0.16s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.16s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 6px 6px 0px var(--color-ink);
        }

        .project-card:active {
          transform: translateY(0px);
          box-shadow: 2px 2px 0px var(--color-ink);
        }

        .project-card:focus-within {
          outline: 2px solid var(--accent-action);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .project-card,
          .project-card:hover,
          .project-card:active {
            transform: none !important;
            transition: none !important;
          }
        }

        .project-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 1rem;
          background-color: var(--bg-surface-secondary);
          border-bottom: var(--border-width-md) solid var(--border-color-default);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .proj-idx {
          color: var(--color-text-accent);
        }

        .project-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          flex: 1;
        }

        .title-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .project-title {
          font-size: 1.6rem;
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .project-tagline {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-text-accent);
          line-height: 1.4;
        }

        .project-desc {
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
        }

        .collab-note {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.72rem;
          color: var(--color-text-muted);
          padding: 0.45rem 0.65rem;
          background-color: var(--bg-surface-secondary);
          border: 1px dashed var(--border-color-default);
        }

        .collab-icon {
          color: var(--color-text-accent);
          flex-shrink: 0;
        }

        .arch-highlights {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          background-color: var(--bg-surface-secondary);
          padding: 0.85rem;
          border: 1.5px solid var(--border-color-default);
        }

        .arch-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
        }

        .arch-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .arch-list li {
          font-size: 0.76rem;
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          color: var(--color-text-secondary);
          line-height: 1.4;
        }

        .check-icon {
          color: var(--status-online);
          margin-top: 2px;
          flex-shrink: 0;
        }

        .tech-stack-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: auto;
          padding-top: 0.5rem;
        }

        .tech-tag {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          background-color: var(--bg-surface-tertiary);
          border: 1.5px solid var(--border-color-default);
          color: var(--color-text-primary);
        }

        .project-card-footer {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background-color: var(--bg-surface-secondary);
          border-top: var(--border-width-md) solid var(--border-color-default);
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-text-muted);
        }

        .status-pip {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .status-pip.active {
          background-color: var(--status-online);
        }

        .status-pip.pending {
          background-color: #FAB005;
        }

        .card-actions {
          display: flex;
          gap: 0.6rem;
        }

        .btn-details-link {
          flex: 1;
          padding: 0.55rem 0.75rem;
          font-size: 0.78rem;
          background: var(--bg-surface);
        }

        .btn-repo-link {
          padding: 0.55rem 0.85rem;
          font-size: 0.78rem;
          background: var(--accent-highlight);
          color: var(--color-on-accent);
        }

        .btn-repo-disabled {
          padding: 0.55rem 0.85rem;
          font-size: 0.72rem;
          font-weight: 700;
          background: var(--bg-surface-tertiary);
          color: var(--color-text-muted);
          border: 1.5px dashed var(--border-color-default);
          cursor: not-allowed;
          opacity: 0.85;
        }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(23, 23, 23, 0.78);
          backdrop-filter: blur(4px);
          z-index: 100000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          opacity: 1;
        }

        .modal-backdrop.is-entering {
          animation: modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .modal-backdrop.is-leaving {
          animation: modalFadeOut 0.18s cubic-bezier(0.7, 0, 0.84, 0) forwards;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .modal-container {
          width: 100%;
          max-width: 820px;
          max-height: 90vh;
          overflow-y: auto;
          background-color: var(--bg-surface);
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-hard-lg);
        }

        .modal-container.is-entering {
          animation: modalContainerEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .modal-container.is-leaving {
          animation: modalContainerLeave 0.18s cubic-bezier(0.7, 0, 0.84, 0) forwards;
        }

        @keyframes modalContainerEnter {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes modalContainerLeave {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(10px) scale(0.97);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .modal-backdrop.is-entering,
          .modal-backdrop.is-leaving,
          .modal-container.is-entering,
          .modal-container.is-leaving {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.25rem;
          background-color: var(--bg-header-contrast);
          color: var(--color-header-text);
          font-size: 0.82rem;
          font-weight: 700;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .modal-tag-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .modal-close-btn {
          background: var(--bg-surface);
          border: 1.5px solid var(--border-color-default);
          cursor: pointer;
          padding: 0.25rem;
          display: inline-flex;
          align-items: center;
          color: var(--color-text-primary);
        }

        .modal-body {
          padding: 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        /* 6 Modal Sections */
        .modal-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .section-header-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.75rem;
          background-color: var(--bg-surface-secondary);
          border: 1px solid var(--border-color-default);
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--color-text-primary);
          letter-spacing: 0.02em;
        }

        .section-heading {
          font-size: 0.76rem;
          font-weight: 800;
          margin: 0;
          text-transform: uppercase;
        }

        .modal-overview-content {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding: 0.25rem 0;
        }

        .modal-problem-desc {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--color-text-primary);
          font-weight: 600;
          margin: 0;
        }

        .modal-desc {
          font-size: 0.85rem;
          line-height: 1.55;
          color: var(--color-text-secondary);
          margin: 0;
        }

        .implementation-box {
          border: 1.5px solid var(--border-color-default);
          background-color: var(--bg-surface-secondary);
        }

        .status-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.85rem;
        }

        @media (min-width: 650px) {
          .status-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .status-card {
          border: 1.5px solid var(--border-color-default);
          background-color: var(--bg-surface-secondary);
          display: flex;
          flex-direction: column;
        }

        .status-card-header {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.5rem 0.85rem;
          background-color: var(--bg-surface-tertiary);
          border-bottom: 1px solid var(--border-color-default);
          font-size: 0.7rem;
          font-weight: 800;
        }

        .status-active-header {
          color: var(--status-online);
        }

        .status-card-desc {
          padding: 0.85rem;
          font-size: 0.76rem;
          line-height: 1.5;
          color: var(--color-text-secondary);
          margin: 0;
        }

        .decisions-box {
          border: 1.5px solid var(--border-color-default);
          background-color: var(--bg-surface-secondary);
          padding: 0.85rem 1rem;
        }

        .decisions-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-text-muted);
          margin-bottom: 0.5rem;
        }

        .decisions-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          font-size: 0.76rem;
          line-height: 1.45;
          color: var(--color-text-secondary);
        }

        .features-split-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .feature-block {
          border: 1.5px solid var(--border-color-default);
          background-color: var(--bg-surface-secondary);
        }

        .block-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 0.85rem;
          background-color: var(--bg-surface-tertiary);
          border-bottom: 1px solid var(--border-color-default);
          font-size: 0.72rem;
          font-weight: 700;
        }

        .block-header.green-header {
          color: var(--status-online);
        }

        .modal-feature-list {
          list-style: none;
          padding: 0.85rem;
          font-size: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          line-height: 1.45;
        }

        .modal-warning-box {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.75rem;
          background-color: var(--bg-surface-secondary);
          border: 1.5px solid var(--border-color-default);
          font-size: 0.72rem;
          line-height: 1.45;
          color: var(--color-text-secondary);
          font-weight: 600;
        }

        .modal-stack-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .modal-stack-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-text-muted);
        }

        .modal-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .modal-chip {
          padding: 0.25rem 0.6rem;
          background-color: var(--bg-surface-secondary);
          border: 1.5px solid var(--border-color-default);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .modal-footer {
          padding: 1rem 1.5rem;
          background-color: var(--bg-surface-secondary);
          border-top: var(--border-width-md) solid var(--border-color-default);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.85rem;
        }

        .pending-text {
          font-size: 0.72rem;
          color: var(--color-text-muted);
        }
      `}</style>
    </section>
  );
};
