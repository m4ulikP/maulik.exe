import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { playTactileClick } from '../utils/sound';

const CURRENT_YEAR = new Date().getFullYear();

interface FooterProps {
  onOpenResume?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenResume }) => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        {/* Main Footer Block */}
        <div className="footer-main-block surface-card">
          <div className="footer-content">
            {/* Brand & Editorial Tagline Area */}
            <div className="footer-brand">
              <div className="footer-logo font-mono">
                <span className="logo-badge" aria-hidden="true">M_</span>
                <span className="logo-title">MAULIK PANDEY</span>
              </div>
              <div className="footer-editorial">
                <span className="footer-tagline font-display">BUILDING. LEARNING. IMPROVING.</span>
                <span className="footer-role font-mono">SOFTWARE DEVELOPER | BACKEND &amp; AI</span>
              </div>
            </div>

            {/* Profiles, Contact & Interests */}
            <div className="footer-specs font-mono">
              <div className="spec-col">
                <span className="col-heading">// PROFILES &amp; CONTACT</span>
                <a
                  href={PERSONAL_INFO.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spec-val link-channel"
                >
                  <span>GITHUB [m4ulikP]</span>
                  <ArrowUpRight size={11} />
                </a>
                <a
                  href={PERSONAL_INFO.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spec-val link-channel"
                >
                  <span>LINKEDIN [maulp]</span>
                  <ArrowUpRight size={11} />
                </a>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="spec-val link-channel"
                >
                  <span>EMAIL</span>
                  <ArrowUpRight size={11} />
                </a>
                {PERSONAL_INFO.resumeUrl && (
                  <button
                    type="button"
                    className="spec-val link-channel footer-resume-btn font-mono"
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
                    <span>RESUME [PDF]</span>
                    <ArrowUpRight size={11} />
                  </button>
                )}
              </div>

              <div className="spec-col">
                <span className="col-heading">// INTERESTS</span>
                <div className="interest-tags-wrap">
                  <span className="interest-tag">Backend Engineering</span>
                  <span className="interest-tag">AI / ML Workflows</span>
                  <span className="interest-tag">Software Development</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar — Copyright Only */}
          <div className="footer-bottom-bar font-mono">
            <div className="copyright-line">
              <span>© {CURRENT_YEAR} MAULIK PANDEY. ALL RIGHTS RESERVED.</span>
              <span className="bullet">/</span>
              <span>SOFTWARE DEVELOPER | BACKEND &amp; AI</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          padding-top: var(--space-xl);
          padding-bottom: var(--space-3xl);
          background-color: var(--bg-app);
          border-top: var(--border-width-lg) solid var(--border-color-default);
        }


        .footer-main-block {
          background-color: var(--bg-surface);
          border: var(--border-width-md) solid var(--border-color-default);
        }

        .footer-content {
          padding: 2rem 1.5rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }

        @media (min-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr auto;
            padding: 2.25rem 2rem;
          }
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 1.15rem;
          font-weight: 800;
        }

        .logo-badge {
          background-color: var(--accent-highlight);
          color: var(--color-on-accent);
          padding: 0.25rem 0.5rem;
          border: var(--border-width-sm) solid var(--border-color-default);
          box-shadow: 2px 2px 0px var(--color-ink);
          font-size: 0.85rem;
          font-weight: 900;
          user-select: none;
        }

        .logo-title {
          letter-spacing: -0.02em;
          color: var(--color-text-primary);
        }

        .footer-editorial {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .footer-tagline {
          font-size: clamp(1rem, 1.6vw + 0.5rem, 1.35rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--color-text-primary);
          line-height: 1.2;
          text-transform: uppercase;
        }

        .footer-role {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--color-text-muted);
        }

        .footer-specs {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.75rem;
        }

        @media (min-width: 540px) {
          .footer-specs {
            grid-template-columns: auto auto;
            gap: 2.5rem;
          }
        }

        .spec-col {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .col-heading {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
          margin-bottom: 0.35rem;
        }

        .interest-tags-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .interest-tag {
          display: inline-flex;
          align-items: center;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.28rem 0.65rem;
          background-color: var(--bg-surface-secondary);
          border: 1px solid var(--border-color-default);
          color: var(--color-text-primary);
          width: fit-content;
          letter-spacing: 0.01em;
          transition: transform 0.12s ease, background-color 0.12s ease;
        }

        .interest-tag:hover {
          background-color: var(--bg-surface-tertiary);
          transform: translateY(-1px);
        }

        [data-theme='cyber-contrast'] .interest-tag {
          background-color: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.14);
          color: var(--color-text-primary);
        }

        [data-theme='cyber-contrast'] .interest-tag:hover {
          background-color: rgba(255, 255, 255, 0.08);
          border-color: rgba(223, 255, 0, 0.4);
        }

        .spec-val {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .spec-val.highlight {
          color: var(--color-text-accent);
        }

        .link-channel {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          text-decoration: none;
          color: var(--color-text-primary);
          transition: color var(--transition-fast);
        }

        .link-channel:hover {
          color: var(--color-text-accent);
          text-decoration: underline;
        }

        .footer-resume-btn {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: inherit;
          line-height: inherit;
          cursor: pointer;
          text-align: left;
        }

        .footer-bottom-bar {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          background-color: var(--bg-surface-secondary);
          border-top: var(--border-width-md) solid var(--border-color-default);
          font-size: 0.72rem;
          font-weight: 700;
        }

        @media (min-width: 768px) {
          .footer-bottom-bar {
            padding: 1rem 2rem;
          }
        }

        .copyright-line {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-secondary);
          width: 100%;
        }

        .copyright-line .bullet {
          color: var(--color-text-muted);
        }
      `}</style>
    </footer>
  );
};
