import React from 'react';
import { ArrowUpRight, SunMoon, CornerDownLeft } from 'lucide-react';
import { playTactileClick } from '../utils/sound';

interface NotFoundProps {
  onNavigateHome: () => void;
  currentTheme: 'paper' | 'cyber-contrast';
  onToggleTheme: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({
  onNavigateHome,
  currentTheme,
  onToggleTheme,
}) => {
  const handleHomeClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    playTactileClick();
    onNavigateHome();
  };

  const handleNavSection = (sectionId: string) => {
    playTactileClick();
    onNavigateHome();
    setTimeout(() => {
      const el = document.querySelector(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className={`ghost-404-root theme-${currentTheme}`} role="main" aria-label="404 Page Not Found">
      {/* Top Editorial Nav Header */}
      <header className="ghost-header font-mono">
        <div className="ghost-brand" onClick={() => handleHomeClick()}>
          <span className="brand-logo-text">MAULIK PANDEY</span>
          <span className="brand-symbol">✕</span>
        </div>

        <nav className="ghost-nav" aria-label="Quick Navigation">
          <button
            type="button"
            className="ghost-nav-link"
            onClick={() => handleNavSection('#about')}
          >
            ABOUT
          </button>
          <span className="nav-separator">,</span>
          <button
            type="button"
            className="ghost-nav-link"
            onClick={() => handleNavSection('#projects')}
          >
            WORK
          </button>
          <span className="nav-separator">,</span>
          <button
            type="button"
            className="ghost-nav-link"
            onClick={() => handleNavSection('#experience')}
          >
            EXPERIENCE
          </button>
          <span className="nav-separator">,</span>
          <button
            type="button"
            className="ghost-nav-link is-contact"
            onClick={() => handleNavSection('#contact')}
          >
            CONTACT
          </button>

          <button
            type="button"
            className="ghost-theme-toggle"
            onClick={() => {
              playTactileClick();
              onToggleTheme();
            }}
            title="Toggle Theme"
            aria-label={`Switch to ${currentTheme === 'paper' ? 'Cyber' : 'Paper'} theme`}
          >
            <SunMoon size={14} />
            <span>{currentTheme === 'paper' ? 'CYBER' : 'PAPER'}</span>
          </button>
        </nav>
      </header>

      {/* Main Spacious Editorial Poster Body */}
      <div className="ghost-poster-container">
        {/* Left Typography Block */}
        <div className="ghost-typography-col">
          {/* Outlined 404 Display */}
          <div className="ghost-404-outline" aria-hidden="true">
            404
          </div>
          <span className="sr-only">404</span>

          {/* Editorial Serif Heading */}
          <h1 className="ghost-heading">This page is a ghost.</h1>

          {/* Supporting Narrative Copy */}
          <p className="ghost-supporting-text">
            Sorry if things got moved. We remodeled a bit.{' '}
            <button
              type="button"
              className="ghost-inline-link"
              onClick={handleHomeClick}
            >
              Let's start again.
            </button>
          </p>

          {/* Prominent Tactile Action Button */}
          <div className="ghost-cta-wrap">
            <button
              type="button"
              className="ghost-action-btn font-mono"
              onClick={handleHomeClick}
              autoFocus
            >
              <span>LET'S START AGAIN</span>
              <CornerDownLeft size={16} className="cta-icon" />
            </button>
          </div>
        </div>

        {/* Right Expressive White Brushstroke X with Continuous Glitch */}
        <div className="ghost-art-col" aria-hidden="true">
          <div className="brush-x-glitch-stage">
            {/* SVG Brushstroke X with Organic Edge Filter */}
            <svg
              className="brush-x-svg base-brush"
              viewBox="0 0 320 320"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="distressed-brush" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.045 0.08"
                    numOctaves="4"
                    result="noise"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale="14"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>

              {/* Slanted Dry-Brush Stroke 1: Top-Left to Bottom-Right */}
              <path
                d="M 52,65 Q 150,150 268,255"
                stroke="#FFFFFF"
                strokeWidth="56"
                strokeLinecap="square"
                fill="none"
                filter="url(#distressed-brush)"
              />

              {/* Slanted Dry-Brush Stroke 2: Bottom-Left to Top-Right */}
              <path
                d="M 60,255 Q 165,160 262,60"
                stroke="#FFFFFF"
                strokeWidth="56"
                strokeLinecap="square"
                fill="none"
                filter="url(#distressed-brush)"
              />

              {/* Natural Bristle Texture Splatters for expressive hand-painted look */}
              <circle cx="58" cy="74" r="6" fill="#FFFFFF" opacity="0.8" />
              <circle cx="260" cy="246" r="7" fill="#FFFFFF" opacity="0.85" />
              <circle cx="66" cy="242" r="5" fill="#FFFFFF" opacity="0.75" />
              <circle cx="254" cy="70" r="8" fill="#FFFFFF" opacity="0.9" />
            </svg>

            {/* Continuous Displaced Slice Overlay */}
            <div className="glitch-brush-slice">
              <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 52,65 Q 150,150 268,255"
                  stroke="#FFFFFF"
                  strokeWidth="56"
                  strokeLinecap="square"
                  fill="none"
                />
                <path
                  d="M 60,255 Q 165,160 262,60"
                  stroke="#FFFFFF"
                  strokeWidth="56"
                  strokeLinecap="square"
                  fill="none"
                />
              </svg>
            </div>

            {/* Continuous Glitch Overlay 1: Cyan/Cobalt Channel Shift */}
            <div className="glitch-brush-channel channel-cyan">
              <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 52,65 Q 150,150 268,255"
                  stroke="#4263EB"
                  strokeWidth="56"
                  strokeLinecap="square"
                  fill="none"
                />
                <path
                  d="M 60,255 Q 165,160 262,60"
                  stroke="#4263EB"
                  strokeWidth="56"
                  strokeLinecap="square"
                  fill="none"
                />
              </svg>
            </div>

            {/* Continuous Glitch Overlay 2: Lime/Red Sliced Shift */}
            <div className="glitch-brush-channel channel-lime">
              <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 52,65 Q 150,150 268,255"
                  stroke="#FA5252"
                  strokeWidth="56"
                  strokeLinecap="square"
                  fill="none"
                />
                <path
                  d="M 60,255 Q 165,160 262,60"
                  stroke="#FA5252"
                  strokeWidth="56"
                  strokeLinecap="square"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Editorial Brutalist Footer Strip */}
      <footer className="ghost-footer font-mono">
        <div className="footer-cell brand-cell">
          <span className="cell-pill">MAULIK PANDEY</span>
          <span className="cell-caption">PORTFOLIO // 404</span>
        </div>

        <div className="footer-cell action-cell">
          <button
            type="button"
            className="footer-start-link"
            onClick={handleHomeClick}
          >
            <span>START OVER</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="footer-cell links-cell">
          <a
            href="https://github.com/m4ulikP"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/maulp"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
          >
            LinkedIn
          </a>
          <a
            href="mailto:maulik.pandey9@gmail.com"
            className="footer-social-link"
          >
            Email
          </a>
        </div>

        <div className="footer-cell copyright-cell">
          <span>2026 © MAULIK PANDEY</span>
        </div>
      </footer>

      <style>{`
        /* Import expressive editorial serif */
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&display=swap');

        /* Root Container */
        .ghost-404-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.5rem 2rem 1.25rem 2rem;
          box-sizing: border-box;
          position: relative;
          overflow-x: hidden;
          transition: background-color 0.25s ease, color 0.25s ease;
        }

        /* Paper Theme: Canonical Bold Acid Lime background */
        .ghost-404-root.theme-paper {
          background-color: #DFFF00;
          color: #0B0B0B;
        }

        /* Cyber Theme: Complementary Deep Obsidian with Acid Lime Accents */
        .ghost-404-root.theme-cyber-contrast {
          background-color: #0a0b0e;
          color: #F4F0E8;
        }

        /* Header Navigation */
        .ghost-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.5rem;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .ghost-brand {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          cursor: pointer;
          font-weight: 800;
        }

        .brand-logo-text {
          font-size: 1.15rem;
          font-weight: 900;
          letter-spacing: -0.03em;
        }

        .brand-symbol {
          font-size: 0.85rem;
          font-weight: 900;
        }

        .ghost-nav {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .ghost-nav-link {
          background: transparent;
          border: none;
          color: inherit;
          font-family: inherit;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 0.25rem 0.35rem;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }

        .ghost-nav-link:hover {
          opacity: 0.65;
        }

        .ghost-nav-link.is-contact {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .nav-separator {
          opacity: 0.6;
        }

        .ghost-theme-toggle {
          margin-left: 1rem;
          background: #0B0B0B;
          color: #DFFF00;
          border: 2px solid #0B0B0B;
          font-family: inherit;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.3rem 0.65rem;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
          box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.4);
          transition: transform 0.12s ease;
        }

        .theme-cyber-contrast .ghost-theme-toggle {
          background: #DFFF00;
          color: #0B0B0B;
          border-color: #DFFF00;
        }

        .ghost-theme-toggle:hover {
          transform: translate(-1px, -1px);
        }

        /* Spacious Asymmetrical Poster Container */
        .ghost-poster-container {
          flex: 1;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          align-items: center;
          gap: 3rem;
          max-width: 1340px;
          width: 100%;
          margin: 0 auto;
          padding: 2rem 0;
          box-sizing: border-box;
        }

        /* Left Typography Column */
        .ghost-typography-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 680px;
        }

        /* Large Outlined 404 */
        .ghost-404-outline {
          font-family: var(--font-display), 'Space Grotesk', -apple-system, sans-serif;
          font-size: clamp(6.5rem, 15vw, 15rem);
          font-weight: 900;
          line-height: 0.82;
          letter-spacing: -0.04em;
          margin-bottom: 1.5rem;
          user-select: none;
        }

        .theme-paper .ghost-404-outline {
          color: transparent;
          -webkit-text-stroke: 2.5px #0B0B0B;
        }

        .theme-cyber-contrast .ghost-404-outline {
          color: transparent;
          -webkit-text-stroke: 2.5px #DFFF00;
        }

        /* Expressive Editorial Serif Heading */
        .ghost-heading {
          font-family: 'Newsreader', 'Playfair Display', 'Times New Roman', Georgia, serif;
          font-size: clamp(2.4rem, 5.5vw, 4.8rem);
          font-weight: 500;
          font-style: normal;
          text-transform: none !important;
          line-height: 1.05;
          letter-spacing: -0.01em;
          margin: 0 0 1.25rem 0;
        }

        .theme-paper .ghost-heading {
          color: transparent;
          -webkit-text-stroke: 1.5px #0B0B0B;
        }

        .theme-cyber-contrast .ghost-heading {
          color: transparent;
          -webkit-text-stroke: 1.5px #F4F0E8;
        }

        /* Supporting Copy */
        .ghost-supporting-text {
          font-family: var(--font-sans), 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(1rem, 1.6vw, 1.35rem);
          font-weight: 500;
          line-height: 1.45;
          margin: 0 0 2rem 0;
          max-width: 48ch;
        }

        .theme-paper .ghost-supporting-text {
          color: #0B0B0B;
        }

        .theme-cyber-contrast .ghost-supporting-text {
          color: #c5cbd5;
        }

        .ghost-inline-link {
          background: transparent;
          border: none;
          padding: 0;
          font-family: inherit;
          font-size: inherit;
          font-weight: 700;
          color: inherit;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-thickness: 2px;
          transition: opacity 0.15s ease;
        }

        .ghost-inline-link:hover {
          opacity: 0.65;
        }

        /* CTA Button */
        .ghost-cta-wrap {
          margin-top: 0.5rem;
        }

        .ghost-action-btn {
          background: #0B0B0B;
          color: #DFFF00;
          border: 3px solid #0B0B0B;
          font-size: 0.95rem;
          font-weight: 800;
          padding: 0.9rem 1.6rem;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.45);
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }

        .theme-cyber-contrast .ghost-action-btn {
          background: #DFFF00;
          color: #0B0B0B;
          border-color: #DFFF00;
          box-shadow: 5px 5px 0px #000000;
        }

        .ghost-action-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 7px 7px 0px rgba(0, 0, 0, 0.45);
        }

        .theme-cyber-contrast .ghost-action-btn:hover {
          box-shadow: 7px 7px 0px #000000;
        }

        .ghost-action-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.45);
        }

        .cta-icon {
          transition: transform 0.15s ease;
        }

        .ghost-action-btn:hover .cta-icon {
          transform: translateX(-2px);
        }

        /* Right Column: Expressive White Brushstroke X */
        .ghost-art-col {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .brush-x-glitch-stage {
          position: relative;
          width: 100%;
          max-width: 380px;
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(18deg);
          animation: continuousGlitchStage 1.8s steps(1, end) infinite;
        }

        .brush-x-svg {
          width: 100%;
          height: 100%;
          display: block;
          filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.18));
        }

        .theme-cyber-contrast .brush-x-svg {
          filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.6));
        }

        /* Continuous Horizontal Slice Overlay */
        .glitch-brush-slice {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          opacity: 0.95;
          animation: continuousSliceGlitch 1.4s steps(1, end) infinite;
        }

        .glitch-brush-slice svg {
          width: 100%;
          height: 100%;
        }

        /* Continuous Chromatic Channel Glitch Overlays */
        .glitch-brush-channel {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .glitch-brush-channel svg {
          width: 100%;
          height: 100%;
        }

        .channel-cyan {
          animation: continuousCyanGlitch 1.6s steps(1, end) infinite;
        }

        .channel-lime {
          animation: continuousLimeGlitch 2.1s steps(1, end) infinite;
        }

        /* Continuous Stage Jitter */
        @keyframes continuousGlitchStage {
          0% {
            transform: rotate(18deg) translate(0, 0);
          }
          5% {
            transform: rotate(18deg) translate(-4px, 2px) skewX(2deg);
          }
          10% {
            transform: rotate(18deg) translate(3px, -1px);
          }
          15% {
            transform: rotate(18deg) translate(-2px, 0);
          }
          20% {
            transform: rotate(18deg) translate(5px, 2px) skewX(-2deg);
          }
          25% {
            transform: rotate(18deg) translate(-4px, -2px);
          }
          30% {
            transform: rotate(18deg) translate(2px, 1px);
          }
          35% {
            transform: rotate(18deg) translate(-5px, 3px) scale(1.02);
          }
          40% {
            transform: rotate(18deg) translate(4px, -1px);
          }
          45% {
            transform: rotate(18deg) translate(-2px, 2px);
          }
          50% {
            transform: rotate(18deg) translate(6px, -2px) skewX(3deg);
          }
          55% {
            transform: rotate(18deg) translate(-3px, 1px);
          }
          60% {
            transform: rotate(18deg) translate(2px, -3px);
          }
          65% {
            transform: rotate(18deg) translate(-6px, 2px);
          }
          70% {
            transform: rotate(18deg) translate(4px, 0) scale(0.99);
          }
          75% {
            transform: rotate(18deg) translate(-2px, -2px);
          }
          80% {
            transform: rotate(18deg) translate(5px, 2px) skewX(-2deg);
          }
          85% {
            transform: rotate(18deg) translate(-4px, 1px);
          }
          90% {
            transform: rotate(18deg) translate(3px, -2px);
          }
          95% {
            transform: rotate(18deg) translate(-1px, 2px);
          }
          100% {
            transform: rotate(18deg) translate(0, 0);
          }
        }

        /* Continuous Horizontal Slicing */
        @keyframes continuousSliceGlitch {
          0% {
            clip-path: inset(0 0 0 0);
            transform: translate(0, 0);
          }
          7% {
            clip-path: inset(15% 0 65% 0);
            transform: translate(-7px, 2px);
          }
          14% {
            clip-path: inset(0 0 0 0);
            transform: translate(0, 0);
          }
          21% {
            clip-path: inset(45% 0 30% 0);
            transform: translate(8px, -2px);
          }
          28% {
            clip-path: inset(70% 0 10% 0);
            transform: translate(-5px, 0);
          }
          35% {
            clip-path: inset(0 0 0 0);
            transform: translate(0, 0);
          }
          42% {
            clip-path: inset(25% 0 50% 0);
            transform: translate(6px, 2px);
          }
          49% {
            clip-path: inset(0 0 0 0);
            transform: translate(0, 0);
          }
          56% {
            clip-path: inset(60% 0 20% 0);
            transform: translate(-8px, -1px);
          }
          63% {
            clip-path: inset(10% 0 75% 0);
            transform: translate(5px, 1px);
          }
          70% {
            clip-path: inset(0 0 0 0);
            transform: translate(0, 0);
          }
          77% {
            clip-path: inset(35% 0 40% 0);
            transform: translate(-6px, 2px);
          }
          84% {
            clip-path: inset(80% 0 5% 0);
            transform: translate(7px, -2px);
          }
          91% {
            clip-path: inset(0 0 0 0);
            transform: translate(0, 0);
          }
          100% {
            clip-path: inset(0 0 0 0);
            transform: translate(0, 0);
          }
        }

        /* Continuous Cyan/Blue Channel Separation */
        @keyframes continuousCyanGlitch {
          0% {
            opacity: 0.35;
            transform: translate(-3px, 1px);
            clip-path: inset(10% 0 60% 0);
          }
          8% {
            opacity: 0.85;
            transform: translate(-8px, -2px);
            clip-path: inset(0 0 0 0);
          }
          16% {
            opacity: 0.25;
            transform: translate(2px, 1px);
            clip-path: inset(40% 0 25% 0);
          }
          24% {
            opacity: 0.8;
            transform: translate(-7px, 3px);
            clip-path: inset(15% 0 50% 0);
          }
          32% {
            opacity: 0.4;
            transform: translate(0, 0);
            clip-path: inset(0 0 0 0);
          }
          40% {
            opacity: 0.9;
            transform: translate(-9px, -1px);
            clip-path: inset(65% 0 10% 0);
          }
          48% {
            opacity: 0.3;
            transform: translate(3px, -2px);
            clip-path: inset(20% 0 40% 0);
          }
          56% {
            opacity: 0.75;
            transform: translate(-6px, 2px);
            clip-path: inset(5% 0 70% 0);
          }
          64% {
            opacity: 0.2;
            transform: translate(1px, -1px);
            clip-path: inset(0 0 0 0);
          }
          72% {
            opacity: 0.85;
            transform: translate(-8px, 2px);
            clip-path: inset(30% 0 35% 0);
          }
          80% {
            opacity: 0.3;
            transform: translate(4px, 1px);
            clip-path: inset(70% 0 5% 0);
          }
          88% {
            opacity: 0.9;
            transform: translate(-7px, -3px);
            clip-path: inset(10% 0 55% 0);
          }
          94% {
            opacity: 0.35;
            transform: translate(-2px, 0);
            clip-path: inset(0 0 0 0);
          }
          100% {
            opacity: 0.35;
            transform: translate(-3px, 1px);
            clip-path: inset(10% 0 60% 0);
          }
        }

        /* Continuous Lime/Red Channel Separation */
        @keyframes continuousLimeGlitch {
          0% {
            opacity: 0.3;
            transform: translate(4px, -1px);
            clip-path: inset(30% 0 35% 0);
          }
          9% {
            opacity: 0.25;
            transform: translate(-2px, 2px);
            clip-path: inset(0 0 0 0);
          }
          18% {
            opacity: 0.9;
            transform: translate(7px, -3px);
            clip-path: inset(55% 0 10% 0);
          }
          27% {
            opacity: 0.3;
            transform: translate(1px, 1px);
            clip-path: inset(10% 0 70% 0);
          }
          36% {
            opacity: 0.85;
            transform: translate(8px, 2px);
            clip-path: inset(0 0 0 0);
          }
          45% {
            opacity: 0.2;
            transform: translate(-3px, -1px);
            clip-path: inset(40% 0 30% 0);
          }
          54% {
            opacity: 0.8;
            transform: translate(6px, -2px);
            clip-path: inset(20% 0 45% 0);
          }
          63% {
            opacity: 0.35;
            transform: translate(2px, 3px);
            clip-path: inset(0 0 0 0);
          }
          72% {
            opacity: 0.9;
            transform: translate(8px, -1px);
            clip-path: inset(65% 0 5% 0);
          }
          81% {
            opacity: 0.25;
            transform: translate(-2px, 0);
            clip-path: inset(15% 0 60% 0);
          }
          90% {
            opacity: 0.85;
            transform: translate(7px, 2px);
            clip-path: inset(35% 0 25% 0);
          }
          95% {
            opacity: 0.3;
            transform: translate(1px, -2px);
            clip-path: inset(0 0 0 0);
          }
          100% {
            opacity: 0.3;
            transform: translate(4px, -1px);
            clip-path: inset(30% 0 35% 0);
          }
        }

        /* Reduced Motion Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .brush-x-glitch-stage,
          .channel-cyan,
          .channel-lime {
            animation: none !important;
            transform: rotate(18deg) !important;
            opacity: 0 !important;
          }
          .brush-x-glitch-stage {
            opacity: 1 !important;
          }
        }

        /* Compact Brutalist 4-Cell Footer */
        .ghost-footer {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1.3fr 1.2fr;
          border: 2px solid #0B0B0B;
          border-radius: 8px;
          overflow: hidden;
          margin-top: 1.5rem;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .theme-cyber-contrast .ghost-footer {
          border-color: #394250;
          background: #14171f;
        }

        .footer-cell {
          padding: 0.9rem 1.25rem;
          display: flex;
          align-items: center;
          border-right: 2px solid #0B0B0B;
          box-sizing: border-box;
        }

        .footer-cell:last-child {
          border-right: none;
        }

        .theme-cyber-contrast .footer-cell {
          border-right-color: #394250;
        }

        .brand-cell {
          gap: 0.6rem;
        }

        .cell-pill {
          background: #0B0B0B;
          color: #DFFF00;
          padding: 0.2rem 0.5rem;
          font-weight: 900;
          letter-spacing: 0.04em;
        }

        .theme-cyber-contrast .cell-pill {
          background: #DFFF00;
          color: #0B0B0B;
        }

        .cell-caption {
          font-size: 0.7rem;
          opacity: 0.8;
        }

        .action-cell {
          justify-content: center;
        }

        .footer-start-link {
          background: transparent;
          border: none;
          color: inherit;
          font-family: inherit;
          font-size: inherit;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          cursor: pointer;
          letter-spacing: 0.05em;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .footer-start-link:hover {
          opacity: 0.7;
        }

        .links-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.2rem;
        }

        .footer-social-link {
          color: inherit;
          text-decoration: none;
          font-weight: 700;
          transition: opacity 0.15s ease;
        }

        .footer-social-link:hover {
          text-decoration: underline;
          opacity: 0.7;
        }

        .copyright-cell {
          justify-content: flex-end;
          font-size: 0.72rem;
          opacity: 0.85;
        }

        /* Mobile & Tablet Responsive Adjustments */
        @media (max-width: 900px) {
          .ghost-poster-container {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: left;
            padding: 1.5rem 0;
          }

          .ghost-art-col {
            order: -1;
            justify-content: flex-start;
          }

          .brush-x-glitch-stage {
            max-width: 220px;
          }

          .ghost-footer {
            grid-template-columns: 1fr 1fr;
          }

          .footer-cell:nth-child(2) {
            border-right: none;
          }

          .footer-cell:nth-child(1),
          .footer-cell:nth-child(2) {
            border-bottom: 2px solid #0B0B0B;
          }

          .theme-cyber-contrast .footer-cell:nth-child(1),
          .theme-cyber-contrast .footer-cell:nth-child(2) {
            border-bottom-color: #394250;
          }
        }

        @media (max-width: 600px) {
          .ghost-404-root {
            padding: 1.25rem 1rem 1rem 1rem;
          }

          .ghost-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .ghost-nav {
            flex-wrap: wrap;
            gap: 0.25rem;
          }

          .ghost-theme-toggle {
            margin-left: 0;
            margin-top: 0.35rem;
          }

          .ghost-footer {
            grid-template-columns: 1fr;
          }

          .footer-cell {
            border-right: none !important;
            border-bottom: 2px solid #0B0B0B;
            justify-content: flex-start !important;
          }

          .theme-cyber-contrast .footer-cell {
            border-bottom-color: #394250;
          }

          .footer-cell:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </div>
  );
};
