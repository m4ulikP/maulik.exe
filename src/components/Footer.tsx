import React from 'react';
import { motion } from 'motion/react';
import './Footer.css';
import { type ThemeId, type AppearanceMode, THEMES } from '../types/theme';
import { ThemeAppearanceToggle } from './ThemeAppearanceToggle';
import {
  staggerListVariants,
  staggerItemVariants,
  reducedMotionVariants,
  SECTION_VIEWPORT,
} from '../utils/revealVariants';

const CURRENT_YEAR = new Date().getFullYear();
const VERIFIED_EMAIL = 'maulik.pandey9@gmail.com';
const GITHUB_URL = 'https://github.com/m4ulikP';
const LINKEDIN_URL = 'https://www.linkedin.com/in/maulik-pandeyy/';
const RESUME_URL = '/resume.pdf';

export interface FooterProps {
  onNavClick?: (targetId: string) => void;
  theme?: ThemeId;
  onThemeChange?: (theme: ThemeId) => void;
  appearance?: AppearanceMode;
  onToggleAppearance?: () => void;
  isReducedMotion?: boolean;
  systemReducedMotion?: boolean;
  onToggleMotion?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavClick,
  theme = 'obsidian',
  onThemeChange,
  appearance = 'dark',
  onToggleAppearance,
  isReducedMotion = false,
  systemReducedMotion = false,
  onToggleMotion,
}) => {
  return (
    <footer className="site-footer" role="contentinfo">
      <motion.div
        className="site-container footer-container"
        variants={isReducedMotion ? reducedMotionVariants : staggerListVariants}
        initial={isReducedMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={SECTION_VIEWPORT}
      >
        {/* Main Footer Row */}
        <div className="footer-main-row">
          {/* Brand Identity Column */}
          <motion.div
            className="footer-identity-col"
            variants={isReducedMotion ? reducedMotionVariants : staggerItemVariants}
          >
            <div className="footer-brand">
              <div className="brand-lockup">
                <span className="brand-text font-display">MAULIK.EXE</span>
                <span className="footer-status-pill font-mono">ONLINE</span>
              </div>
              <p className="footer-tagline font-body">
                Backend systems, telemetry pipelines, and applied software development.
              </p>
            </div>

            {/* Quick Section Navigation */}
            <nav className="footer-nav font-mono" aria-label="Footer Section Navigation">
              <span className="footer-meta-label">SECTIONS:</span>
              <div className="footer-nav-links">
                <a
                  href="#work"
                  onClick={(e) => {
                    if (onNavClick) {
                      e.preventDefault();
                      onNavClick('work');
                    }
                  }}
                >
                  [01] Work
                </a>
                <a
                  href="#experience"
                  onClick={(e) => {
                    if (onNavClick) {
                      e.preventDefault();
                      onNavClick('experience');
                    }
                  }}
                >
                  [02] Experience
                </a>
                <a
                  href="#about"
                  onClick={(e) => {
                    if (onNavClick) {
                      e.preventDefault();
                      onNavClick('about');
                    }
                  }}
                >
                  [03] About
                </a>
                <a
                  href="#skills"
                  onClick={(e) => {
                    if (onNavClick) {
                      e.preventDefault();
                      onNavClick('skills');
                    }
                  }}
                >
                  [04] Skills
                </a>
                <a
                  href="#contact"
                  onClick={(e) => {
                    if (onNavClick) {
                      e.preventDefault();
                      onNavClick('contact');
                    }
                  }}
                >
                  [05] Contact
                </a>
              </div>
            </nav>

            {/* Verified External Channels */}
            <div className="footer-channels font-mono">
              <span className="footer-meta-label">CHANNELS:</span>
              <div className="footer-channels-links">
                <a
                  href={`mailto:${VERIFIED_EMAIL}`}
                  className="footer-channel-link"
                  aria-label={`Send email to ${VERIFIED_EMAIL}`}
                >
                  <span>Email ↗</span>
                </a>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-channel-link"
                  aria-label="Visit Maulik's GitHub profile"
                >
                  <span>GitHub ↗</span>
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-channel-link"
                  aria-label="Visit Maulik's LinkedIn profile"
                >
                  <span>LinkedIn ↗</span>
                </a>
                <a
                  href={RESUME_URL}
                  download="Maulik_Pandey_Resume.pdf"
                  className="footer-channel-link resume-channel"
                  aria-label="Download Resume PDF"
                >
                  <span>Resume [PDF] ↓</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Minimal Integrated Preference Controls (Directly on footer background, no boxed card) */}
          <motion.div
            className="footer-preferences-area font-mono"
            variants={isReducedMotion ? reducedMotionVariants : staggerItemVariants}
          >
            <span className="footer-pref-heading">PREFERENCES:</span>

            <div
              className="footer-controls-strip"
              role="group"
              aria-label="Theme, appearance, and motion preferences"
            >
              {/* Neumorphic × Liquid Glass Light/Dark Appearance Switch */}
              <ThemeAppearanceToggle
                appearance={appearance}
                onToggle={onToggleAppearance || (() => {})}
                isReducedMotion={isReducedMotion}
              />

              {/* Minimal Vertical Divider */}
              <span className="footer-controls-divider" aria-hidden="true">/</span>

              {/* Horizontal Theme Swatches */}
              <div
                className="footer-theme-swatches"
                role="radiogroup"
                aria-label="Theme color"
              >
                {THEMES.map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <div key={t.id} className="footer-swatch-wrapper">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`Theme: ${t.label}${isSelected ? ' (active)' : ''}`}
                        className={`footer-swatch-btn ${isSelected ? 'swatch-active' : ''}`}
                        onClick={() => onThemeChange?.(t.id)}
                      >
                        <span
                          className="swatch-circle"
                          style={{
                            backgroundColor: t.accentColor,
                            boxShadow: isSelected
                              ? `0 0 0 2px var(--color-bg-base), 0 0 0 4px ${t.accentColor}`
                              : undefined,
                          }}
                        >
                          {isSelected && (
                            <span className="swatch-check-glyph" aria-hidden="true">✓</span>
                          )}
                        </span>

                        {/* Tooltip beneath swatch on hover/focus */}
                        <span className="footer-swatch-tooltip" role="tooltip">
                          {t.label}
                        </span>
                      </button>

                      <span className={`footer-swatch-sublabel ${isSelected ? 'sublabel-active' : ''}`} aria-hidden="true">
                        {t.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Minimal Vertical Divider */}
              <span className="footer-controls-divider" aria-hidden="true">/</span>

              {/* Understated Motion Effects Toggle */}
              <button
                type="button"
                className={`footer-motion-toggle ${isReducedMotion ? 'motion-off' : 'motion-on'}`}
                onClick={onToggleMotion}
                disabled={systemReducedMotion}
                aria-pressed={!isReducedMotion}
                aria-label={
                  systemReducedMotion
                    ? 'Motion effects disabled by operating system preference (locked)'
                    : `Motion effects: ${isReducedMotion ? 'Off' : 'On'}. Click to toggle`
                }
                title={
                  systemReducedMotion
                    ? 'Motion effects: Off (OS locked)'
                    : `Motion effects: ${isReducedMotion ? 'Off' : 'On'} (Click to toggle)`
                }
              >
                <span className="motion-toggle-icon" aria-hidden="true">
                  {isReducedMotion ? '⊘' : '⟳'}
                </span>
                <span className="motion-toggle-label">
                  {systemReducedMotion
                    ? 'Motion: Off (OS)'
                    : isReducedMotion
                    ? 'Motion: Off'
                    : 'Motion: On'}
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom Strip */}
        <motion.div
          className="footer-bottom font-mono"
          variants={isReducedMotion ? reducedMotionVariants : staggerItemVariants}
        >
          <div className="footer-legal">
            <span>© {CURRENT_YEAR} MAULIK PANDEY</span>
            <span className="legal-sep">/</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>

          <div className="footer-status-tag">
            <span>PORTFOLIO // v1.0</span>
          </div>

          <a href="#top" className="back-to-top-link">
            <span>BACK TO TOP ↑</span>
          </a>
        </motion.div>
      </motion.div>
    </footer>
  );
};
