import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import liquidGL, { type LiquidGLLens } from 'liquid-gl';
import { type ThemeId, type AppearanceMode } from '../types/theme';
import { DecryptedText } from './reactbits/DecryptedText';
import {
  sectionHeaderVariants,
  eyebrowVariants,
  titleVariants,
  contentBlockVariants,
  reducedMotionVariants,
  SECTION_VIEWPORT,
  ITEM_VIEWPORT,
} from '../utils/revealVariants';
import './ExperienceSection.css';

interface ExperienceSectionProps {
  isReducedMotion?: boolean;
  theme?: ThemeId;
  appearance?: AppearanceMode;
  isReady?: boolean;
}

const ensureRibbonMeasurable = () => {
  if (typeof document === 'undefined') return;
  const ribbonEl = document.querySelector('.glass-ribbon-background');
  if (ribbonEl?.hasAttribute('data-liquid-ignore')) {
    ribbonEl.removeAttribute('data-liquid-ignore');
  }
};

const getExperienceTint = (theme: ThemeId = 'obsidian', appearance: AppearanceMode = 'dark'): string | null => {
  if (appearance === 'light') {
    return 'rgba(255, 255, 255, 0.48)';
  }
  // In dark mode, tint: null or near-white preserving full optical transmission without crushing
  if (theme === 'amber') {
    return 'rgba(255, 230, 200, 0.02)';
  }
  if (theme === 'midnight') {
    return 'rgba(200, 230, 255, 0.02)';
  }
  return null;
};

const refreshRendererSnapshot = async (lens: LiquidGLLens | null) => {
  ensureRibbonMeasurable();
  if (!lens?.renderer) return;
  const renderer = lens.renderer as any;
  if (renderer._destroyed) return;

  renderer._captureGeneration = (renderer._captureGeneration || 0) + 1;
  if (renderer._capturing) return;

  try {
    ensureRibbonMeasurable();
    await renderer.captureSnapshot?.();
    if (!renderer._destroyed) {
      renderer.render?.();
    }
  } catch (err: unknown) {
    console.warn('liquidGL Experience snapshot capture warning:', err);
  }
};

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  isReducedMotion = false,
  theme = 'obsidian',
  appearance = 'dark',
  isReady = true,
}) => {
  const lensRef = useRef<LiquidGLLens | null>(null);
  const lensElementRef = useRef<HTMLElement | null>(null);
  const themeRef = useRef<ThemeId>(theme);
  const appearanceRef = useRef<AppearanceMode>(appearance);

  useEffect(() => {
    themeRef.current = theme;
    appearanceRef.current = appearance;
    if (lensRef.current) {
      lensRef.current.setTint(getExperienceTint(theme, appearance));
      refreshRendererSnapshot(lensRef.current);
    }
  }, [theme, appearance]);

  useEffect(() => {
    if (isReady && lensRef.current) {
      refreshRendererSnapshot(lensRef.current);
    }
  }, [isReady]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isReducedMotion) {
      if (lensRef.current) {
        try {
          lensRef.current.destroy();
        } catch {
          // safe cleanup
        }
        lensRef.current = null;
      }
      lensElementRef.current?.classList.remove('liquid-active');
      return;
    }

    let isCancelled = false;

    const initTimer = requestAnimationFrame(() => {
      if (isCancelled || !lensElementRef.current) return;

      ensureRibbonMeasurable();

      try {
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        const currentTheme =
          (document.documentElement.getAttribute('data-theme') as ThemeId) ||
          themeRef.current ||
          'obsidian';
        const currentAppearance =
          (document.documentElement.getAttribute('data-appearance') as AppearanceMode) ||
          appearanceRef.current ||
          'dark';

        const result = liquidGL({
          target: '#experience-lens',
          content: false,
          snapshot: '.glass-ribbon-background',
          resolution: Math.min(2.0, dpr),
          zIndex: 2,
          refraction: 0.008,
          aberration: 0,
          bevelDepth: 0.08,
          bevelWidth: 0.15,
          frost: 4,
          shadow: true,
          specular: true,
          reveal: 'none',
          tilt: false,
          tiltFactor: 4,
          tiltEase: 500,
          draggable: false,
          interaction: 'none',
          interactionStrength: 0.5,
          interactionRadius: 0.35,
          interactionViscosity: 0.65,
          magnify: 1.15,
          helper: false,
          tint: getExperienceTint(currentTheme, currentAppearance),
        });

        if (isCancelled) {
          if (Array.isArray(result)) {
            result.forEach((l) => l.destroy());
          } else if (result && typeof result.destroy === 'function') {
            result.destroy();
          }
          return;
        }

        const lensInstance = Array.isArray(result) ? (result[0] ?? null) : (result ?? null);
        lensRef.current = lensInstance;
        if (lensInstance) {
          lensElementRef.current?.classList.add('liquid-active');
          refreshRendererSnapshot(lensInstance);
        }
      } catch (err) {
        console.warn('liquidGL experience lens initialization fallback to CSS:', err);
      }
    });

    const fontsPromise =
      typeof document !== 'undefined' && document.fonts ? document.fonts.ready : Promise.resolve();
    const settleTimer = window.setTimeout(async () => {
      if (isCancelled || !lensRef.current) return;
      try {
        await fontsPromise;
        if (!isCancelled && lensRef.current) {
          refreshRendererSnapshot(lensRef.current);
        }
      } catch {
        // noop
      }
    }, 1100);

    const observer = new MutationObserver(() => {
      if (!lensRef.current) return;
      const curTheme =
        (document.documentElement.getAttribute('data-theme') as ThemeId) || 'obsidian';
      const curApp =
        (document.documentElement.getAttribute('data-appearance') as AppearanceMode) || 'dark';
      lensRef.current.setTint(getExperienceTint(curTheme, curApp));
      refreshRendererSnapshot(lensRef.current);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-appearance'],
    });

    // Viewport IntersectionObserver to track visibility and manage sync loop
    let isIntersecting = false;
    let syncRafId: number | null = null;
    let lastScrollTime = 0;
    let lastCaptureTime = 0;

    const stopSyncLoop = () => {
      if (syncRafId !== null) {
        cancelAnimationFrame(syncRafId);
        syncRafId = null;
      }
    };

    const runSyncLoop = () => {
      const now = performance.now();
      const timeSinceScroll = now - lastScrollTime;

      // GSAP scrub has a duration of ~500ms; keep synchronizing until scrub settles (~650ms after scroll)
      if (timeSinceScroll < 650 && isIntersecting && lensRef.current) {
        // Refresh at ~30fps (every 32ms) during active scrubbing to balance perfect ribbon tracking and high performance
        if (now - lastCaptureTime >= 32) {
          lastCaptureTime = now;
          lensRef.current.updateMetrics();
          refreshRendererSnapshot(lensRef.current);
        }
        syncRafId = requestAnimationFrame(runSyncLoop);
      } else {
        // Final settling capture: ensures static resting state is 100% pixel-perfect with current ribbon
        syncRafId = null;
        if (isIntersecting && lensRef.current) {
          lensRef.current.updateMetrics();
          refreshRendererSnapshot(lensRef.current);
        }
      }
    };

    const handleScroll = () => {
      lastScrollTime = performance.now();
      if (!isIntersecting) return;

      if (syncRafId === null) {
        syncRafId = requestAnimationFrame(runSyncLoop);
      }
    };

    let intersectionObs: IntersectionObserver | null = null;
    if (lensElementRef.current && typeof IntersectionObserver !== 'undefined') {
      intersectionObs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            isIntersecting = entry.isIntersecting;
            if (isIntersecting && lensRef.current) {
              lensRef.current.updateMetrics();
              refreshRendererSnapshot(lensRef.current);
            } else {
              stopSyncLoop();
            }
          }
        },
        { rootMargin: '120px 0px 120px 0px' }
      );
      intersectionObs.observe(lensElementRef.current);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      lensRef.current?.updateMetrics();
      refreshRendererSnapshot(lensRef.current);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const element = lensElementRef.current;

    return () => {
      isCancelled = true;
      cancelAnimationFrame(initTimer);
      clearTimeout(settleTimer);
      stopSyncLoop();
      observer.disconnect();
      intersectionObs?.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      element?.classList.remove('liquid-active');
      if (lensRef.current) {
        try {
          lensRef.current.destroy();
        } catch {
          // safe cleanup
        }
        lensRef.current = null;
      }
    };
  }, [isReducedMotion]);

  return (
    <section id="experience" className="experience-section" aria-labelledby="exp-heading">
      <div className="site-container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          variants={isReducedMotion ? reducedMotionVariants : sectionHeaderVariants}
          initial={isReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={SECTION_VIEWPORT}
        >
          <motion.div
            className="section-tag font-mono"
            variants={isReducedMotion ? reducedMotionVariants : eyebrowVariants}
          >
            <span className="tag-index">[ 02 ]</span>
            <DecryptedText
              text="EXPERIENCE"
              animateOn="view"
              speed={65}
              sequential={true}
              isReducedMotion={isReducedMotion}
            />
          </motion.div>
          <motion.h2
            id="exp-heading"
            className="section-title font-display"
            variants={isReducedMotion ? reducedMotionVariants : titleVariants}
          >
            Work Experience
          </motion.h2>
        </motion.div>

        {/* Experience Timeline */}
        <div className="experience-flow">
          <motion.div
            className="experience-card-shell"
            variants={isReducedMotion ? reducedMotionVariants : contentBlockVariants}
            initial={isReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={ITEM_VIEWPORT}
          >
            <article
              id="experience-lens"
              ref={lensElementRef}
              className="experience-entry glass"
            >
              <div className="exp-meta-header font-mono">
                <div className="exp-role-title-wrap">
                  <h3 className="exp-role font-display">Backend AI Engineer Intern</h3>
                  <span className="exp-company">FlyRank AI</span>
                </div>
                <span className="exp-stack">Node.js · TypeScript · PostgreSQL · Vitest</span>
              </div>

              <p className="exp-intro font-body">
                Engineered backend usage metering, quota enforcement, and billing pipelines for
                multi-tenant AI services, with automated integration test coverage in Docker.
              </p>

              {/* No more than four concise contribution bullets */}
              <ul className="exp-bullets-list font-body">
                <li>
                  <strong>Idempotent Event Ingestion:</strong> Designed header-based request deduplication
                  using <code>X-Idempotency-Key</code>, preventing duplicate charge events across network replays and client retries.
                </li>
                <li>
                  <strong>Usage Quota Enforcement:</strong> Implemented monthly quota enforcement across Free and Pro tiers,
                  tracking API invocations and token volume with immediate <code>HTTP 429</code> threshold responses.
                </li>
                <li>
                  <strong>Integer-Cent Precision:</strong> Standardized token and request pricing models on integer-cent arithmetic
                  to eliminate floating-point rounding discrepancies.
                </li>
                <li>
                  <strong>Webhook Reconciliation:</strong> Built Stripe webhook verification and background
                  reconciliation workers to synchronize subscription states with PostgreSQL.
                </li>
              </ul>
            </article>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
