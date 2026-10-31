import React from 'react';
import { EXPERIENCES } from '../data/portfolioData';
import { Calendar, Briefcase, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';

export const Experience: React.FC = () => {
  return (
    <section className="experience-section" id="experience" aria-label="Professional Experience">
      <div className="container">
        {/* Section Header */}
        <div className="section-marker">
          <div className="label-mono">
            <span className="section-number">02</span>
            <span className="section-title">WORK EXPERIENCE</span>
          </div>
          <span className="label-mono font-mono text-muted">VERIFIED INTERNSHIP</span>
        </div>

        {/* Clean Editorial Experience Card */}
        <div className="ledger-wrapper surface-card">
          {EXPERIENCES.map((item) => (
            <article key={item.id} className="exp-card">
              {/* Card Top Strip */}
              <div className="exp-card-header font-mono">
                <div className="header-left">
                  <Briefcase size={14} />
                  <span>{item.company.toUpperCase()}</span>
                </div>
                <div className="header-right">
                  <span className="badge-brutal badge-green font-mono">
                    {item.status?.toUpperCase() || 'COMPLETED'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="exp-body">
                <div className="exp-title-row">
                  <div className="role-group">
                    <h3 className="role-title">{item.role}</h3>
                    <div className="org-meta font-mono">
                      <span className="org-name">{item.company}</span>
                      <span className="meta-separator">•</span>
                      <span className="loc-tag">
                        <MapPin size={12} />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  <div className="period-badge font-mono">
                    <Calendar size={13} />
                    <span>{item.period}</span>
                  </div>
                </div>

                <p className="exp-summary">{item.summary}</p>

                {/* Key Contributions */}
                <div className="contributions-panel font-mono">
                  <div className="contrib-header">
                    <CheckCircle2 size={13} />
                    <span>VERIFIED RESPONSIBILITIES &amp; CONTRIBUTIONS:</span>
                  </div>
                  <ul className="contrib-list">
                    {item.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx}>
                        <ChevronRight size={13} className="bullet-icon" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="tech-row font-mono">
                  <span className="tech-label">TECHNOLOGIES &amp; METHODOLOGIES:</span>
                  <div className="tech-pills">
                    {item.stack.map((tech) => (
                      <span key={tech} className="tech-pill">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .experience-section {
          padding-top: var(--space-2xl);
          padding-bottom: var(--space-3xl);
        }

        .text-muted {
          color: var(--color-text-muted);
        }

        .ledger-wrapper {
          background-color: var(--bg-surface);
          border: var(--border-width-md) solid var(--border-color-default);
          box-shadow: var(--shadow-hard-md);
        }

        .exp-card-header {
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

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .exp-body {
          padding: 1.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .exp-body {
            padding: 2.25rem 2rem;
          }
        }

        .exp-title-row {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        @media (min-width: 768px) {
          .exp-title-row {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }
        }

        .role-title {
          font-size: clamp(1.3rem, 2vw, 1.75rem);
          line-height: 1.25;
          letter-spacing: -0.02em;
          color: var(--color-text-primary);
        }

        .org-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.35rem;
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }

        .org-name {
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .meta-separator {
          color: var(--color-text-muted);
        }

        .loc-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          color: var(--color-text-muted);
        }

        .period-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.4rem 0.75rem;
          background-color: var(--bg-surface-secondary);
          border: 1.5px solid var(--border-color-default);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-text-primary);
          width: fit-content;
        }

        .exp-summary {
          font-size: 1rem;
          line-height: 1.65;
          color: var(--color-text-secondary);
        }

        .contributions-panel {
          background-color: var(--bg-surface-secondary);
          padding: 1.25rem 1.4rem;
          border: 1.5px solid var(--border-color-default);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .contrib-header {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-text-accent);
          letter-spacing: 0.05em;
        }

        .contrib-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .contrib-list li {
          font-size: 0.88rem;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .bullet-icon {
          color: var(--color-text-accent);
          margin-top: 4px;
          flex-shrink: 0;
        }

        .tech-row {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding-top: 0.75rem;
          border-top: 1px dashed var(--border-color-muted);
        }

        .tech-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-text-muted);
          letter-spacing: 0.04em;
        }

        .tech-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tech-pill {
          padding: 0.25rem 0.65rem;
          background-color: var(--accent-highlight);
          color: var(--color-on-accent);
          border: 1px solid var(--border-color-default);
          font-size: 0.76rem;
          font-weight: 700;
        }
      `}</style>
    </section>
  );
};
