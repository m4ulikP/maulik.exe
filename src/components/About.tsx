import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { GraduationCap, Briefcase, BookOpen } from 'lucide-react';
import { playTactileClick } from '../utils/sound';

export const About: React.FC = () => {
  const { education } = PERSONAL_INFO;

  return (
    <section className="about-section" id="about" aria-label="About and Education">
      <div className="container">
        {/* Section Header */}
        <div className="section-marker">
          <div className="label-mono">
            <span className="section-number">01</span>
            <span className="section-title">ABOUT &amp; EDUCATION</span>
          </div>
          <span className="label-mono font-mono text-muted">BACKGROUND &amp; STUDIES</span>
        </div>

        {/* 2-Column Swiss Editorial Layout */}
        <div className="about-grid">
          {/* Left Column: Personal Statement & Learning Journey */}
          <div className="about-main surface-card">
            <div className="card-top-tag font-mono">
              <span>ABOUT ME</span>
              <span>PROFILE &amp; GOALS</span>
            </div>
            <div className="about-inner">
              <h3 className="about-lead-title">
                Building useful applications, learning backend systems, and exploring AI.
              </h3>
              <p className="about-para">
                I'm a Computer Science and Engineering undergraduate at IILM University, specializing in Artificial Intelligence and Machine Learning.
              </p>
              <p className="about-para">
                I'm interested in software engineering, especially building useful applications and understanding how their backend systems work.
              </p>
              <p className="about-para">
                I've worked on projects involving structural health monitoring and sales workflow automation, and I've also completed a Backend AI Engineer internship at Flyrank AI.
              </p>
              <p className="about-para">
                Right now, I'm focused on improving my programming, problem-solving, and software development skills through consistent learning and hands-on projects.
              </p>
              <p className="about-para">
                My goal is to become a stronger software engineer first, then gradually move toward AI/ML engineering.
              </p>
            </div>
          </div>

          {/* Right Column: Formal Education */}
          <div className="about-sidebar">
            <div className="surface-card education-card">
              <div className="card-top-tag font-mono">
                <GraduationCap size={15} />
                <span>FORMAL EDUCATION</span>
              </div>
              <div className="education-body">
                <div className="edu-header">
                  <h4 className="edu-degree">{education.degree}</h4>
                  <span className="edu-status badge-brutal badge-yellow font-mono">
                    {education.status.toUpperCase()}
                  </span>
                </div>

                <div className="edu-meta-list font-mono">
                  <div className="edu-meta-item">
                    <span className="meta-k">INSTITUTION:</span>
                    <span className="meta-v">{education.institution}</span>
                  </div>
                  <div className="edu-meta-item">
                    <span className="meta-k">SPECIALIZATION:</span>
                    <span className="meta-v">{education.specialization}</span>
                  </div>
                </div>

                <p className="edu-summary">
                  Pursuing foundational computer science, data structures, algorithms, and applied machine learning principles.
                </p>

                <div className="edu-coursework-note font-mono">
                  <BookOpen size={13} />
                  <span>FOUNDATIONS: DATA STRUCTURES, ALGORITHMS &amp; SYSTEMS</span>
                </div>
              </div>

              {/* Seamless Action Footer */}
              <div className="edu-action-strip">
                <div className="action-strip-content">
                  <span className="action-strip-label font-mono">OPEN TO OPPORTUNITIES</span>
                  <a
                    href="#contact"
                    className="btn-brutal btn-primary font-mono"
                    onClick={() => {
                      playTactileClick();
                      document.querySelector('#contact')?.querySelectorAll('.section-marker, .surface-card, .ledger-wrapper, .courses-card')
                        .forEach((el) => el.classList.add('is-revealed'));
                    }}
                  >
                    <Briefcase size={14} />
                    <span>GET IN TOUCH</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .about-section {
          padding-top: var(--space-2xl);
          padding-bottom: var(--space-3xl);
        }

        .text-muted {
          color: var(--color-text-muted);
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: var(--space-xl);
        }

        @media (min-width: 992px) {
          .about-grid {
            grid-template-columns: 1.3fr 1fr;
            align-items: start;
          }
        }

        .card-top-tag {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1.25rem;
          background-color: var(--bg-header-contrast);
          color: var(--color-header-text);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .about-inner {
          padding: 1.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        @media (min-width: 768px) {
          .about-inner {
            padding: 2.25rem 2rem;
          }
        }

        .about-lead-title {
          font-size: clamp(1.2rem, 1.8vw, 1.55rem);
          line-height: 1.4;
          letter-spacing: -0.02em;
          color: var(--color-text-primary);
        }

        .about-para {
          font-size: 0.98rem;
          line-height: 1.75;
          color: var(--color-text-secondary);
        }

        /* Sidebar & Education */
        .about-sidebar {
          display: flex;
          flex-direction: column;
        }

        .education-card {
          background-color: var(--bg-surface);
          display: flex;
          flex-direction: column;
        }

        .education-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        @media (min-width: 768px) {
          .education-body {
            padding: 1.75rem;
          }
        }

        .edu-header {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .edu-degree {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .edu-status {
          width: fit-content;
          font-size: 0.72rem;
        }

        .edu-meta-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.85rem;
          background-color: var(--bg-surface-secondary);
          border: 1.5px solid var(--border-color-default);
          font-size: 0.75rem;
        }

        .edu-meta-item {
          display: flex;
          gap: 0.5rem;
        }

        .meta-k {
          color: var(--color-text-muted);
          font-weight: 700;
          min-width: 120px;
        }

        .meta-v {
          color: var(--color-text-primary);
          font-weight: 700;
        }

        .edu-summary {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
        }

        .edu-coursework-note {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-text-muted);
          padding-top: 0.5rem;
          border-top: 1px dashed var(--border-color-muted);
        }

        .edu-action-strip {
          padding: 1rem 1.5rem;
          background-color: var(--bg-surface-secondary);
          border-top: var(--border-width-md) solid var(--border-color-default);
        }

        .action-strip-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .action-strip-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-text-muted);
          letter-spacing: 0.04em;
        }
      `}</style>
    </section>
  );
};
