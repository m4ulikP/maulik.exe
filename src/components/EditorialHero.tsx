import React, { useEffect, useRef } from 'react';
import { motion, type Variants } from 'motion/react';
import liquidGL, { type LiquidGLLens } from 'liquid-gl';
import { SystemsGeometry2D } from './SystemsGeometry2D';
import { type ThemeId } from '../types/theme';
import './EditorialHero.css';

interface EditorialHeroProps {
  onExploreClick?: () => void;
  onAboutClick?: () => void;
  isReducedMotion?: boolean;
  theme?: ThemeId;
  isReady?: boolean;
}

// Orchestrated Living Editorial Entrance Variants
const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
};

const nameContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.028,
      delayChildren: 0.04,
    },
  },
};

const charVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.52,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const focusLineVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.54,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const introVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.58,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const actionsVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const scrollCueVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const reducedImmediateVariants: Variants = {
  hidden: { opacity: 1, y: 0, filter: 'none' },
  visible: { opacity: 1, y: 0, filter: 'none', transition: { duration: 0 } },
};

const getPrimaryTint = (appearance: string) => {
  return appearance === 'light'
    ? 'rgba(5, 150, 105, 0.22)'
    : 'rgba(49, 214, 160, 0.28)';
};

const getSecondaryTint = (appearance: string) => {
  return appearance === 'light'
    ? 'rgba(15, 23, 42, 0.08)'
    : null;
};

const ensureRibbonMeasurable = () => {
  if (typeof document === 'undefined') return;
  const ribbonEl = document.querySelector('.glass-ribbon-background');
  if (ribbonEl?.hasAttribute('data-liquid-ignore')) {
    ribbonEl.removeAttribute('data-liquid-ignore');
  }
};

const refreshRendererSnapshot = async (lens: LiquidGLLens | null) => {
  ensureRibbonMeasurable();
  if (!lens?.renderer) return;
  const renderer = lens.renderer as any;
  if (renderer._destroyed || renderer._capturing) return;

  try {
    ensureRibbonMeasurable();
    await renderer.captureSnapshot?.();
    if (!renderer._destroyed) {
      renderer.render?.();
    }
  } catch (err: unknown) {
    console.warn('liquidGL Hero CTA snapshot capture warning:', err);
  }
};

export const EditorialHero: React.FC<EditorialHeroProps> = ({
  onExploreClick,
  onAboutClick,
  isReducedMotion = false,
  isReady = true,
}) => {
  const primaryLensRef = useRef<LiquidGLLens | null>(null);
  const secondaryLensRef = useRef<LiquidGLLens | null>(null);
  const primaryLensElRef = useRef<HTMLSpanElement | null>(null);
  const secondaryLensElRef = useRef<HTMLSpanElement | null>(null);

  // Synchronize snapshots whenever isReady transitions to true (e.g. after preloader aperture completes)
  useEffect(() => {
    if (isReady && !isReducedMotion) {
      const activeLens = primaryLensRef.current || secondaryLensRef.current;
      if (activeLens) {
        refreshRendererSnapshot(activeLens);
      }
    }
  }, [isReady, isReducedMotion]);

  useEffect(() => {
    if (isReducedMotion) {
      if (primaryLensRef.current) {
        try {
          primaryLensRef.current.destroy();
        } catch {}
        primaryLensRef.current = null;
      }
      if (secondaryLensRef.current) {
        try {
          secondaryLensRef.current.destroy();
        } catch {}
        secondaryLensRef.current = null;
      }
      return;
    }

    let isCancelled = false;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    const initTimer = requestAnimationFrame(() => {
      if (isCancelled || !primaryLensElRef.current || !secondaryLensElRef.current) return;

      ensureRibbonMeasurable();

      const currentAppearance =
        (document.documentElement.getAttribute('data-appearance') as string) || 'dark';

      try {
        // 1. Primary CTA Lens — Mint-Cyan Tinted Glass
        const resPrimary = liquidGL({
          target: '#hero-primary-lens',
          content: false,
          snapshot: '.glass-ribbon-background',
          resolution: Math.min(2.0, dpr),
          refraction: 0.007,
          aberration: 0,
          bevelDepth: 0.06,
          bevelWidth: 0.12,
          frost: 0,
          shadow: true,
          specular: true,
          reveal: 'none',
          tilt: false,
          draggable: false,
          interaction: 'none',
          magnify: 1.03,
          tint: getPrimaryTint(currentAppearance),
          helper: false,
        });

        // 2. Secondary CTA Lens — Neutral Liquid Glass
        const resSecondary = liquidGL({
          target: '#hero-secondary-lens',
          content: false,
          snapshot: '.glass-ribbon-background',
          resolution: Math.min(2.0, dpr),
          refraction: 0.007,
          aberration: 0,
          bevelDepth: 0.06,
          bevelWidth: 0.12,
          frost: 0,
          shadow: true,
          specular: true,
          reveal: 'none',
          tilt: false,
          draggable: false,
          interaction: 'none',
          magnify: 1.03,
          tint: getSecondaryTint(currentAppearance),
          helper: false,
        });

        if (isCancelled) {
          const destroyLens = (res: unknown) => {
            if (Array.isArray(res)) res.forEach((l) => l.destroy());
            else if (res && typeof (res as LiquidGLLens).destroy === 'function') {
              (res as LiquidGLLens).destroy();
            }
          };
          destroyLens(resPrimary);
          destroyLens(resSecondary);
          return;
        }

        primaryLensRef.current = Array.isArray(resPrimary)
          ? (resPrimary[0] ?? null)
          : (resPrimary ?? null);
        secondaryLensRef.current = Array.isArray(resSecondary)
          ? (resSecondary[0] ?? null)
          : (resSecondary ?? null);

        const activeLens = primaryLensRef.current || secondaryLensRef.current;
        if (activeLens) {
          refreshRendererSnapshot(activeLens);
        }
      } catch (err) {
        console.warn('liquidGL Hero CTA lens initialization fallback to CSS:', err);
      }
    });

    // Font settlement check
    const fontsPromise =
      typeof document !== 'undefined' && document.fonts ? document.fonts.ready : Promise.resolve();
    fontsPromise.then(() => {
      if (!isCancelled) {
        const activeLens = primaryLensRef.current || secondaryLensRef.current;
        if (activeLens) {
          refreshRendererSnapshot(activeLens);
        }
      }
    });

    // Scroll synchronization loop for ribbon tracking during GSAP scrub
    let syncRafId: number | null = null;
    let lastScrollTime = 0;
    let lastCaptureTime = 0;

    const runSyncLoop = () => {
      const now = performance.now();
      const timeSinceScroll = now - lastScrollTime;

      // GSAP scrub duration is ~500ms; track ribbon motion for 650ms after scroll
      if (timeSinceScroll < 650 && (primaryLensRef.current || secondaryLensRef.current)) {
        if (now - lastCaptureTime >= 32) {
          lastCaptureTime = now;
          primaryLensRef.current?.updateMetrics();
          secondaryLensRef.current?.updateMetrics();
          const activeLens = primaryLensRef.current || secondaryLensRef.current;
          if (activeLens) {
            refreshRendererSnapshot(activeLens);
          }
        }
        syncRafId = requestAnimationFrame(runSyncLoop);
      } else {
        syncRafId = null;
        // Final settling capture
        const activeLens = primaryLensRef.current || secondaryLensRef.current;
        if (activeLens) {
          refreshRendererSnapshot(activeLens);
        }
      }
    };

    const handleScroll = () => {
      lastScrollTime = performance.now();
      primaryLensRef.current?.updateMetrics();
      secondaryLensRef.current?.updateMetrics();
      if (!syncRafId) {
        syncRafId = requestAnimationFrame(runSyncLoop);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'data-appearance' || m.attributeName === 'data-theme') {
          const app = document.documentElement.getAttribute('data-appearance') || 'dark';
          primaryLensRef.current?.setTint(getPrimaryTint(app));
          secondaryLensRef.current?.setTint(getSecondaryTint(app));
          const activeLens = primaryLensRef.current || secondaryLensRef.current;
          if (activeLens) {
            refreshRendererSnapshot(activeLens);
          }
        }
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-appearance', 'data-theme'],
    });

    return () => {
      isCancelled = true;
      cancelAnimationFrame(initTimer);
      if (syncRafId) cancelAnimationFrame(syncRafId);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      if (primaryLensRef.current) {
        try {
          primaryLensRef.current.destroy();
        } catch {}
        primaryLensRef.current = null;
      }
      if (secondaryLensRef.current) {
        try {
          secondaryLensRef.current.destroy();
        } catch {}
        secondaryLensRef.current = null;
      }
    };
  }, [isReducedMotion]);

  return (
    <section
      className="hero-section"
      id="home"
      aria-labelledby="hero-heading"
    >
      <span id="top" aria-hidden="true" style={{ position: 'absolute', top: 0, pointerEvents: 'none' }} />

      {/* 1. Living 2D Systems Geometry Canvas (SVG-based, parallax & proximity reactive) */}
      <SystemsGeometry2D
        isReady={isReady}
        isReducedMotion={isReducedMotion}
      />

      {/* 2. Living Editorial Foreground Composition */}
      <div className="site-container hero-container">
        <motion.div
          className="hero-centered-content"
          initial={isReducedMotion ? false : 'hidden'}
          animate={isReady || isReducedMotion ? 'visible' : 'hidden'}
          variants={isReducedMotion ? reducedImmediateVariants : heroContainerVariants}
        >
          {/* Scroll Plane 1: Primary Name Focal Point */}
          <div className="hero-scroll-title-wrap">
            <motion.h1
              id="hero-heading"
              className="hero-focal-name font-display"
              aria-label="Maulik Pandey"
              variants={isReducedMotion ? reducedImmediateVariants : nameContainerVariants}
            >
              <span className="name-word">
                {'MAULIK'.split('').map((char, index) => (
                  <motion.span
                    key={`char-m-${char}-${index}`}
                    className="name-char"
                    variants={isReducedMotion ? reducedImmediateVariants : charVariants}
                    aria-hidden="true"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
              <span className="name-space" aria-hidden="true">&nbsp;</span>
              <span className="name-word name-word-frosted">
                {'PANDEY'.split('').map((char, index) => (
                  <motion.span
                    key={`char-p-${char}-${index}`}
                    className="name-char"
                    variants={isReducedMotion ? reducedImmediateVariants : charVariants}
                    aria-hidden="true"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </motion.h1>
          </div>

          {/* Scroll Plane 2: Supporting Technical Focus & Editorial Intro */}
          <div className="hero-scroll-meta-wrap">
            <motion.div
              className="hero-focus-line font-mono"
              variants={isReducedMotion ? reducedImmediateVariants : focusLineVariants}
            >
              <span className="focus-line-badge">
                Computer Science // Backend Systems &amp; Applied AI
              </span>
            </motion.div>

            <motion.p
              className="hero-supporting-intro font-body"
              variants={isReducedMotion ? reducedImmediateVariants : introVariants}
            >
              Computer Science student building backend systems and exploring applied AI through real-world projects.
            </motion.p>
          </div>

          {/* Scroll Plane 3: Action CTAs with Refined Tactile Interactions */}
          <motion.div
            className="hero-scroll-actions-wrap"
            variants={isReducedMotion ? reducedImmediateVariants : actionsVariants}
          >
            <div className="hero-actions-row">
              <a
                href="#work"
                className="btn-primary hero-btn-cta font-mono"
                id="hero-primary-cta"
                onClick={(e) => {
                  if (onExploreClick) {
                    e.preventDefault();
                    onExploreClick();
                  }
                }}
              >
                <span
                  id="hero-primary-lens"
                  ref={primaryLensElRef}
                  className="hero-cta-lens hero-cta-lens-primary"
                  aria-hidden="true"
                />
                <span className="btn-label">Explore my work</span>
                <span className="btn-arrow" aria-hidden="true">→</span>
              </a>

              <a
                href="#about"
                className="btn-secondary hero-btn-cta font-mono"
                id="hero-secondary-cta"
                onClick={(e) => {
                  if (onAboutClick) {
                    e.preventDefault();
                    onAboutClick();
                  }
                }}
              >
                <span
                  id="hero-secondary-lens"
                  ref={secondaryLensElRef}
                  className="hero-cta-lens hero-cta-lens-secondary"
                  aria-hidden="true"
                />
                <span className="btn-label">About me</span>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Plane 4: Bottom Scroll Guidance */}
        <motion.div
          className="hero-scroll-cue font-mono"
          initial={isReducedMotion ? false : 'hidden'}
          animate={isReady || isReducedMotion ? 'visible' : 'hidden'}
          variants={isReducedMotion ? reducedImmediateVariants : scrollCueVariants}
        >
          <a
            href="#work"
            className="scroll-cue-link"
            onClick={(e) => {
              if (onExploreClick) {
                e.preventDefault();
                onExploreClick();
              }
            }}
          >
            <span className="scroll-cue-indicator" aria-hidden="true">↓</span>
            <span className="scroll-cue-text">SCROLL TO EXPLORE SELECTED WORK</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
