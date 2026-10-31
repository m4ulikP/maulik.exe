import React, { useState, useEffect } from 'react';

export const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight;
      const totalScrollable = scrollHeight - clientHeight;

      if (totalScrollable <= 0) {
        setProgress(0);
      } else {
        const currentProgress = Math.min(Math.max(scrollY / totalScrollable, 0), 1);
        setProgress(currentProgress);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    updateScrollProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      className="scroll-progress-track"
      role="progressbar"
      aria-label="Page reading progress"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="scroll-progress-fill"
        style={{
          transform: `scaleX(${progress})`,
        }}
      />

      <style>{`
        .scroll-progress-track {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background-color: var(--scroll-track-bg, rgba(0, 0, 0, 0.08));
          z-index: 999999;
          pointer-events: none;
          box-sizing: border-box;
        }

        [data-theme='cyber-contrast'] .scroll-progress-track {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .scroll-progress-fill {
          height: 100%;
          width: 100%;
          background-color: var(--accent-highlight);
          transform-origin: left center;
          will-change: transform;
          transition: transform 0.05s linear;
        }

        [data-theme='paper'] .scroll-progress-fill {
          background-color: var(--accent-action);
        }

        [data-theme='cyber-contrast'] .scroll-progress-fill {
          background-color: var(--accent-highlight);
          box-shadow: 0 0 6px rgba(184, 255, 0, 0.5);
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-progress-fill {
            transition: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};
