import React from 'react';
import { ArrowDown, ExternalLink, FileText, Code2 } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { playTactileClick } from '../utils/sound';

interface HeroProps {
  onOpenResume?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  const scrollToSection = (id: string) => {
    playTactileClick();
    const el = document.querySelector(id);
    if (el) {
      el.querySelectorAll('.section-marker, .surface-card, .ledger-wrapper, .courses-card')
        .forEach((target) => target.classList.add('is-revealed'));
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" id="hero" aria-label="Introduction & Identity">
      <div className="container">
        {/* Main Hero Card */}
        <div className="hero-brand-block surface-card">
          <div className="brand-header-strip font-mono">
            <span>MAULIK PANDEY // PORTFOLIO</span>
            <span>BACKEND &amp; APPLIED AI</span>
          </div>

          <div className="hero-main-content">
            <div className="hero-title-group">
              <div className="hero-eyebrow font-mono animate-hero-eyebrow">
                <span className="badge-brutal badge-yellow">SOFTWARE DEVELOPER</span>
                <span>BACKEND &amp; AI</span>
              </div>
              <h1 className="hero-title animate-hero-title">
                MAULIK PANDEY
              </h1>
              <div className="hero-title-accent-line" aria-hidden="true"></div>
              <h2 className="hero-subtitle font-mono animate-hero-subtitle">
                Software Developer | Backend &amp; AI
              </h2>
              <p className="hero-lead animate-hero-lead">
                I'm a Computer Science student interested in software engineering, building useful applications, and exploring AI through hands-on projects.
              </p>
            </div>

            {/* Asymmetric Side Panel: What I'm Working On */}
            <div className="hero-cockpit surface-flat animate-hero-cockpit">
              <div className="cockpit-header font-mono">
                <div className="header-icon-group">
                  <Code2 size={15} />
                  <span className="cockpit-title">WHAT I'M WORKING ON</span>
                </div>
                <span className="badge-brutal badge-yellow">CURRENT</span>
              </div>

              <div className="cockpit-body">
                <div className="cockpit-item">
                  <span className="cockpit-label font-mono">CURRENT INTERESTS:</span>
                  <ul className="cockpit-list font-mono">
                    <li>→ Software Development</li>
                    <li>→ Backend Development</li>
                    <li>→ Problem Solving &amp; DSA</li>
                    <li>→ Exploring AI/ML</li>
                  </ul>
                </div>

                <div className="cockpit-item">
                  <span className="cockpit-label font-mono">LANGUAGES &amp; TOOLS:</span>
                  <div className="cockpit-tags">
                    <span className="cockpit-tag">Python</span>
                    <span className="cockpit-tag">C++</span>
                    <span className="cockpit-tag">Java</span>
                    <span className="cockpit-tag">Git &amp; GitHub</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer Bar */}
          <div className="hero-actions-bar animate-hero-actions">
            <div className="cta-group">
              <button
                type="button"
                className="btn-brutal btn-primary"
                onClick={() => scrollToSection('#projects')}
              >
                <span>EXPLORE PROJECTS</span>
                <ArrowDown size={16} />
              </button>
              <button
                type="button"
                className="btn-brutal btn-action"
                onClick={() => scrollToSection('#contact')}
              >
                <span>GET IN TOUCH</span>
                <ExternalLink size={16} />
              </button>
              {PERSONAL_INFO.resumeUrl ? (
                <button
                  type="button"
                  className="btn-brutal btn-action"
                  onClick={() => {
                    playTactileClick();
                    if (onOpenResume) {
                      onOpenResume();
                    } else {
                      window.open(PERSONAL_INFO.resumeUrl, '_blank');
                    }
                  }}
                  title="View Resume in PDF Viewer"
                >
                  <FileText size={16} />
                  <span>RESUME.PDF</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-brutal btn-disabled"
                  disabled
                  title="Resume PDF awaiting placement in portfolio public directory"
                  aria-disabled="true"
                >
                  <FileText size={16} />
                  <span>RESUME [UNAVAILABLE]</span>
                </button>
              )}
            </div>

            <div className="hero-footnote font-mono">
              <span>AVAILABLE FOR SOFTWARE &amp; BACKEND ROLES</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          padding-top: var(--space-xl);
          padding-bottom: var(--space-3xl);
        }

        .hero-top-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background-color: var(--border-color-default);
          border: var(--border-width-md) solid var(--border-color-default);
          margin-bottom: var(--space-lg);
          font-size: 0.75rem;
        }

        @media (min-width: 768px) {
          .hero-top-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .grid-cell {
          background-color: var(--bg-surface);
          padding: 0.6rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .cell-label {
          color: var(--color-text-muted);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .cell-value {
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .cell-value.highlight {
          color: var(--color-text-primary);
        }

        .hero-brand-block {
          background-color: var(--bg-surface);
          position: relative;
          overflow: hidden;
        }

        .brand-header-strip {
          background-color: var(--bg-surface-secondary);
          border-bottom: var(--border-width-md) solid var(--border-color-default);
          padding: 0.5rem 1.25rem;
          font-size: 0.72rem;
          font-weight: 700;
          display: flex;
          justify-content: space-between;
          color: var(--color-text-secondary);
        }

        .hero-main-content {
          padding: 2rem 1.5rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 992px) {
          .hero-main-content {
            padding: 3rem 2.5rem;
            grid-template-columns: 1.35fr 1fr;
            align-items: start;
            gap: 3rem;
          }
        }

        .hero-title-group {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .hero-eyebrow {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--color-text-secondary);
        }

        .hero-title {
          font-size: clamp(2.5rem, 6.2vw, 5.4rem);
          line-height: 0.95;
          letter-spacing: -0.035em;
          color: var(--color-text-primary);
          text-transform: uppercase;
          word-break: normal;
          overflow-wrap: break-word;
          margin: 0;
        }

        .hero-title-accent-line {
          height: 4px;
          width: 64px;
          background-color: var(--accent-action);
          transform-origin: left;
          animation: lineReveal 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.22s both;
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 1.8vw, 1.4rem);
          font-weight: 700;
          color: var(--color-text-accent);
          letter-spacing: -0.01em;
          margin-top: -0.25rem;
        }

        @keyframes heroEntrance {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes lineReveal {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        .animate-hero-eyebrow {
          animation: heroEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
        }

        .animate-hero-title {
          animation: heroEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both;
        }

        .animate-hero-subtitle {
          animation: heroEntrance 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.26s both;
        }

        .animate-hero-lead {
          animation: heroEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.34s both;
        }

        .animate-hero-cockpit {
          animation: heroEntrance 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.22s both;
        }

        .animate-hero-actions {
          animation: heroEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.42s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-hero-eyebrow,
          .animate-hero-title,
          .animate-hero-subtitle,
          .animate-hero-lead,
          .animate-hero-cockpit,
          .animate-hero-actions,
          .hero-title-accent-line {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }

        .hero-lead {
          font-size: clamp(1.05rem, 1.4vw, 1.22rem);
          line-height: 1.6;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        /* Cockpit Side Console */
        .hero-cockpit {
          background-color: var(--bg-surface-secondary);
          border: var(--border-width-md) solid var(--border-color-default);
          box-shadow: 4px 4px 0px var(--color-ink);
        }

        .cockpit-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.85rem;
          background-color: var(--bg-header-contrast);
          color: var(--color-header-text);
          font-size: 0.72rem;
          font-weight: 700;
        }

        .header-icon-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cockpit-title {
          letter-spacing: 0.05em;
        }

        .cockpit-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .cockpit-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .cockpit-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
        }

        .cockpit-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .cockpit-tag {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          background-color: var(--bg-surface);
          color: var(--color-text-primary);
          border: 1.5px solid var(--border-color-default);
        }

        .cockpit-list {
          list-style: none;
          font-size: 0.78rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          color: var(--color-text-secondary);
        }

        .summary-box {
          background-color: var(--bg-surface);
          border: 1.5px solid var(--border-color-default);
          padding: 0.75rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          font-size: 0.74rem;
        }

        .summary-line {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-primary);
          font-weight: 600;
        }

        .summary-icon {
          color: var(--color-text-accent);
          flex-shrink: 0;
        }

        .cockpit-footer {
          display: flex;
          align-items: center;
          padding: 0.5rem 1.25rem;
          background-color: var(--bg-surface-tertiary);
          border-top: 1px solid var(--border-color-default);
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--color-text-secondary);
        }

        /* Action Bar */
        .hero-actions-bar {
          border-top: var(--border-width-md) solid var(--border-color-default);
          padding: 1.25rem 1.5rem;
          background-color: var(--bg-surface-secondary);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        @media (min-width: 768px) {
          .hero-actions-bar {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 1.25rem 2.5rem;
          }
        }

        .cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.85rem;
        }

        .btn-disabled {
          background-color: var(--bg-surface-tertiary);
          color: var(--color-text-muted);
          border: var(--border-width-md) dashed var(--border-color-default);
          cursor: not-allowed;
          opacity: 0.85;
        }

        .hero-footnote {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-text-secondary);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
        }

        .hero-footnote .dash {
          color: var(--color-text-muted);
        }
      `}</style>
    </section>
  );
};
