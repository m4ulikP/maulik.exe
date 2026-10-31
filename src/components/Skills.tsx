import React from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { ArrowUpRight } from 'lucide-react';

export const Skills: React.FC = () => {
  return (
    <section className="skills-section" id="skills" aria-label="Technical Skills">
      <div className="container">
        {/* Section Header */}
        <div className="section-marker">
          <div className="label-mono">
            <span className="section-number">04</span>
            <span className="section-title">TECHNICAL SKILLS</span>
          </div>
          <span className="label-mono font-mono text-muted">CURRENT TECH STACK &amp; PROFICIENCIES</span>
        </div>

        {/* 6 Category Blocks matching the source screenshot */}
        <div className="skills-category-stack">
          {SKILL_CATEGORIES.map((category) => (
            <div key={category.id} className="skill-category-card">
              {/* Category Header */}
              <div className="category-header font-mono">
                <span className="category-num-bracket">[ <span className="category-num">{category.code}</span> ]</span>
                <h3 className="category-title">{category.categoryName}</h3>
              </div>

              {/* Skills Row / Wrap */}
              <div className="skills-items-wrap">
                {category.items.map((item, idx) => {
                  const content = (
                    <>
                      <span className="skill-name">{item.skill}</span>
                      <span className="skill-proficiency-badge">{item.proficiency}</span>
                      {item.linkUrl && (
                        <ArrowUpRight size={13} className="skill-link-arrow" aria-hidden="true" />
                      )}
                    </>
                  );

                  if (item.linkUrl) {
                    return (
                      <a
                        key={idx}
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="skill-pill-item skill-pill-link"
                        title={`Visit ${item.skill} reference`}
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <div key={idx} className="skill-pill-item">
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .skills-section {
          padding-top: var(--space-2xl);
          padding-bottom: var(--space-3xl);
        }

        .text-muted {
          color: var(--color-text-muted);
        }

        .skills-category-stack {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        /* Category Card Container */
        .skill-category-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color-default);
          padding: 1.25rem 1.4rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        /* Hover elevation in neo-brutalist style */
        .skill-category-card:hover {
          border-color: var(--accent-action);
          box-shadow: var(--shadow-hard-xs);
        }

        [data-theme='cyber-contrast'] .skill-category-card {
          background-color: rgba(20, 23, 31, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        [data-theme='cyber-contrast'] .skill-category-card:hover {
          border-color: rgba(64, 192, 87, 0.45);
          box-shadow: 0 0 16px rgba(64, 192, 87, 0.07);
        }

        /* Category Header [ 01 ] Title */
        .category-header {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 1.05rem;
          font-family: var(--font-mono);
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .category-num-bracket {
          color: #237836; /* High contrast emerald green (5.5:1 on white, WCAG AA compliant) */
          font-weight: 700;
          font-size: 0.92rem;
          letter-spacing: 0.02em;
        }

        [data-theme='cyber-contrast'] .category-num-bracket {
          color: #55f377;
          text-shadow: 0 0 10px rgba(85, 243, 119, 0.35);
        }

        .category-num {
          font-weight: 800;
        }

        .category-title {
          font-family: var(--font-mono);
          font-size: 0.96rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
          letter-spacing: -0.01em;
        }

        /* Skills Pill Wrap */
        .skills-items-wrap {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem 0.85rem;
          min-width: 0;
        }

        /* Individual Skill Pill */
        .skill-pill-item {
          display: inline-flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.45rem 0.6rem;
          padding: 0.48rem 0.85rem;
          background-color: var(--bg-surface-secondary);
          border: 1px solid var(--border-color-default);
          font-family: var(--font-mono);
          line-height: 1.25;
          transition: transform 0.12s ease, border-color 0.12s ease, background-color 0.12s ease;
          user-select: none;
          max-width: 100%;
          box-sizing: border-box;
        }

        .skill-pill-link {
          text-decoration: none;
          cursor: pointer;
        }

        .skill-pill-link:hover,
        .skill-pill-item:hover {
          background-color: var(--bg-surface-tertiary);
          border-color: var(--color-text-primary);
          transform: translateY(-1px);
        }

        /* Dark / Cyber Mode pill appearance matching screenshot */
        [data-theme='cyber-contrast'] .skill-pill-item {
          background-color: rgba(14, 16, 21, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        [data-theme='cyber-contrast'] .skill-pill-link:hover,
        [data-theme='cyber-contrast'] .skill-pill-item:hover {
          background-color: rgba(28, 33, 43, 0.95);
          border-color: rgba(255, 255, 255, 0.28);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        /* Skill Name */
        .skill-name {
          font-size: 0.86rem;
          font-weight: 700;
          color: var(--color-text-primary);
          letter-spacing: -0.01em;
          word-break: normal;
          overflow-wrap: break-word;
        }

        /* Proficiency Badge */
        .skill-proficiency-badge {
          font-size: 0.68rem;
          font-weight: 600;
          padding: 0.2rem 0.5rem;
          background-color: rgba(0, 0, 0, 0.05);
          color: var(--color-text-muted);
          border: 1px solid rgba(0, 0, 0, 0.08);
          letter-spacing: 0.01em;
          border-radius: 1px;
          white-space: normal;
          word-break: normal;
          display: inline-block;
        }

        [data-theme='cyber-contrast'] .skill-proficiency-badge {
          background-color: rgba(255, 255, 255, 0.04);
          color: #8b949e;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Optional Arrow */
        .skill-link-arrow {
          color: var(--color-text-muted);
          opacity: 0.6;
          transition: opacity 0.15s ease, transform 0.15s ease;
          flex-shrink: 0;
        }

        .skill-pill-link:hover .skill-link-arrow {
          opacity: 1;
          color: var(--accent-action);
          transform: translate(1px, -1px);
        }

        [data-theme='cyber-contrast'] .skill-pill-link:hover .skill-link-arrow {
          color: #55f377;
        }

        /* Responsive Breakpoints */
        @media (max-width: 640px) {
          .skill-category-card {
            padding: 0.9rem 0.8rem;
          }

          .category-header {
            font-size: 0.86rem;
            margin-bottom: 0.75rem;
            flex-wrap: wrap;
            gap: 0.45rem;
          }

          .skills-items-wrap {
            gap: 0.5rem;
          }

          .skill-pill-item {
            padding: 0.4rem 0.6rem;
            gap: 0.35rem 0.5rem;
            max-width: 100%;
          }

          .skill-name {
            font-size: 0.78rem;
          }

          .skill-proficiency-badge {
            font-size: 0.62rem;
            padding: 0.15rem 0.35rem;
          }
        }
      `}</style>
    </section>
  );
};
