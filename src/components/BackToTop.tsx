import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { playTactileClick } from '../utils/sound';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const checkScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 420);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    checkScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleScrollTop = () => {
    playTactileClick();
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: isReduced ? 'auto' : 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      className="btn-brutal floating-back-to-top font-mono"
      onClick={handleScrollTop}
      aria-label="Return to top of page"
      title="Back to top"
    >
      <ArrowUp size={16} />
      <span className="btt-text">TOP</span>

      <style>{`
        .floating-back-to-top {
          position: fixed;
          bottom: 1.75rem;
          right: 1.75rem;
          z-index: 90000;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.55rem 0.85rem;
          font-size: 0.72rem;
          font-weight: 800;
          background-color: var(--accent-highlight);
          color: var(--color-on-accent);
          border: var(--border-width-md) solid var(--border-color-default);
          box-shadow: var(--shadow-hard-md);
          cursor: pointer;
          animation: bttEnter 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes bttEnter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .floating-back-to-top:hover {
          transform: translate(-2px, -2px);
          box-shadow: var(--shadow-hard-lg);
        }

        .floating-back-to-top:active {
          transform: translate(2px, 2px);
          box-shadow: 0px 0px 0px var(--color-ink);
        }

        @media (max-width: 600px) {
          .floating-back-to-top {
            bottom: 1.25rem;
            right: 1.25rem;
            padding: 0.5rem 0.65rem;
          }
          .btt-text {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .floating-back-to-top {
            animation: none !important;
          }
        }
      `}</style>
    </button>
  );
};
