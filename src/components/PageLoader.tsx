import React, { useState, useEffect, useRef } from 'react';
import './PageLoader.css';

interface PageLoaderProps {
  currentTheme: 'paper' | 'cyber-contrast';
  onComplete: () => void;
}

const FIRST_NAME = ['M', 'A', 'U', 'L', 'I', 'K'];
const LAST_NAME = ['P', 'A', 'N', 'D', 'E', 'Y'];

export const PageLoader: React.FC<PageLoaderProps> = ({ currentTheme, onComplete }) => {
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    // 1. Accessibility: Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
      return;
    }

    // 2. Lock body scroll during initial loader execution
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 3. Application Readiness Listeners:
    // Font loading verification
    const fontsPromise =
      typeof document !== 'undefined' && 'fonts' in document
        ? (document.fonts.ready as Promise<any>)
        : Promise.resolve();

    // DOM complete verification
    const domPromise = new Promise<void>((resolve) => {
      if (typeof document !== 'undefined' && document.readyState === 'complete') {
        resolve();
      } else if (typeof window !== 'undefined') {
        window.addEventListener('load', () => resolve(), { once: true });
      } else {
        resolve();
      }
    });

    const startTime = performance.now();
    let readyTimer: ReturnType<typeof setTimeout> | null = null;
    let exitTimer: ReturnType<typeof setTimeout> | null = null;
    let finishTimer: ReturnType<typeof setTimeout> | null = null;

    Promise.all([fontsPromise, domPromise]).then(() => {
      const elapsed = performance.now() - startTime;
      // Allow letter snapping sequence (minimum ~420ms) to settle naturally
      const remainingEntrance = Math.max(0, 420 - elapsed);

      readyTimer = setTimeout(() => {
        setIsReady(true);

        // Brief status confirmation before smooth curtain exit
        exitTimer = setTimeout(() => {
          setIsExiting(true);

          // Wait for curtain slide animation (420ms) to finish before unmounting
          finishTimer = setTimeout(() => {
            if (!completedRef.current) {
              completedRef.current = true;
              onComplete();
            }
          }, 430);
        }, 260);
      }, remainingEntrance);
    });

    // Failsafe timer (maximum 1800ms) to guarantee the loader never blocks the user
    const failsafeTimer = setTimeout(() => {
      if (!completedRef.current) {
        setIsReady(true);
        setIsExiting(true);
        setTimeout(() => {
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete();
          }
        }, 430);
      }
    }, 1800);

    return () => {
      document.body.style.overflow = originalOverflow;
      if (readyTimer) clearTimeout(readyTimer);
      if (exitTimer) clearTimeout(exitTimer);
      if (finishTimer) clearTimeout(finishTimer);
      clearTimeout(failsafeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`page-loader-root ${isReady ? 'is-ready' : ''} ${isExiting ? 'is-exiting' : ''}`}
      data-theme={currentTheme}
      role="status"
      aria-live="polite"
      aria-busy={!isExiting}
    >
      <span className="sr-only">
        {isReady ? 'Portfolio loaded. Displaying home content.' : 'Loading Maulik Pandey portfolio.'}
      </span>

      {/* Architectural Corner Crosshairs */}
      <span className="loader-crosshair crosshair-tl" aria-hidden="true">+</span>
      <span className="loader-crosshair crosshair-tr" aria-hidden="true">+</span>
      <span className="loader-crosshair crosshair-bl" aria-hidden="true">+</span>
      <span className="loader-crosshair crosshair-br" aria-hidden="true">+</span>

      {/* Top Header Metadata Bar */}
      <header className="loader-header font-mono">
        <div className="loader-header-left">
          <span className="loader-header-title">MAULIK PANDEY</span>
          <span className="loader-header-sep">/</span>
          <span className="loader-header-sub">ARCHIVE // 2026</span>
        </div>
        <div className="loader-header-right">
          <div className="loader-status-pill">
            <span className="loader-status-pip" aria-hidden="true" />
            <span>{isReady ? 'SYSTEM: READY' : 'SYSTEM: INITIALIZING'}</span>
          </div>
        </div>
      </header>

      {/* Center Stage: Geometric M_ Logo & Oversized Typography */}
      <div className="loader-center">
        {/* Geometric M_ Logo Construction */}
        <div className="loader-logo-wrap" aria-hidden="true">
          <div className="loader-logo-tile">
            <span className="loader-logo-glyph">
              M<span className="loader-cursor-pulse">_</span>
            </span>
          </div>
        </div>

        {/* Oversized Typographic Assembly */}
        <div className="loader-typography" aria-label="MAULIK PANDEY">
          {/* Row 1: MAULIK */}
          <div className="loader-name-row" aria-hidden="true">
            {FIRST_NAME.map((char, index) => (
              <span
                key={`first-${char}-${index}`}
                className="loader-char"
                style={{ '--char-idx': index } as React.CSSProperties}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Row 2: PANDEY */}
          <div className="loader-name-row" aria-hidden="true">
            {LAST_NAME.map((char, index) => (
              <span
                key={`last-${char}-${index}`}
                className="loader-char"
                style={{ '--char-idx': index + FIRST_NAME.length } as React.CSSProperties}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Restrained Kinetic Accent Datum Rule */}
        <div className="loader-accent-line" aria-hidden="true">
          <div className="loader-accent-runner" />
        </div>

        {/* Discipline Subtitle */}
        <div className="loader-discipline font-mono" aria-hidden="true">
          <span>SOFTWARE DEVELOPER</span>
          <span className="loader-discipline-bullet">■</span>
          <span>BACKEND &amp; AI</span>
        </div>
      </div>

      {/* Bottom Footer Metadata */}
      <footer className="loader-footer font-mono">
        <div className="loader-footer-left">
          <span>BUILDING. LEARNING. IMPROVING.</span>
        </div>
        <div className="loader-footer-right">
          <span>SOFTWARE / BACKEND / AI</span>
        </div>
      </footer>
    </div>
  );
};
