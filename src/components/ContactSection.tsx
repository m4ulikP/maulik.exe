import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import liquidGL, { type LiquidGLLens } from 'liquid-gl';
import { type ThemeId, type AppearanceMode } from '../types/theme';
import { DecryptedText } from './reactbits/DecryptedText';
import {
  sectionHeaderVariants,
  eyebrowVariants,
  titleVariants,
  descVariants,
  contentBlockVariants,
  reducedMotionVariants,
  SECTION_VIEWPORT,
  ITEM_VIEWPORT,
} from '../utils/revealVariants';
import './ContactSection.css';

interface ContactSectionProps {
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

const getContactTint = (theme: ThemeId = 'obsidian', appearance: AppearanceMode = 'dark'): string | null => {
  if (appearance === 'light') {
    return 'rgba(255, 255, 255, 0.58)';
  }
  // Tune Contact slightly more luminous than Experience in dark appearances
  if (theme === 'amber') {
    return 'rgba(255, 240, 215, 0.04)';
  }
  if (theme === 'midnight') {
    return 'rgba(215, 240, 255, 0.04)';
  }
  return 'rgba(255, 255, 255, 0.025)';
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
    console.warn('liquidGL Contact snapshot capture warning:', err);
  }
};

export const ContactSection: React.FC<ContactSectionProps> = ({
  isReducedMotion = false,
  theme = 'obsidian',
  appearance = 'dark',
  isReady = true,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const lensRef = useRef<LiquidGLLens | null>(null);
  const lensElementRef = useRef<HTMLDivElement | null>(null);
  const themeRef = useRef<ThemeId>(theme);
  const appearanceRef = useRef<AppearanceMode>(appearance);

  // Single verified source of truth
  const VERIFIED_EMAIL = 'maulik.pandey9@gmail.com';
  const GITHUB_URL = 'https://github.com/m4ulikP';
  const LINKEDIN_URL = 'https://www.linkedin.com/in/maulik-pandeyy/';
  const RESUME_URL = '/resume.pdf';

  useEffect(() => {
    themeRef.current = theme;
    appearanceRef.current = appearance;
    if (lensRef.current) {
      lensRef.current.setTint(getContactTint(theme, appearance));
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
          // safe teardown
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
          target: '#contact-lens',
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
          tint: getContactTint(currentTheme, currentAppearance),
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
        console.warn('liquidGL contact lens initialization fallback to CSS:', err);
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
      lensRef.current.setTint(getContactTint(curTheme, curApp));
      refreshRendererSnapshot(lensRef.current);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-appearance'],
    });

    // Viewport IntersectionObserver to refresh snapshot when scrolled into view
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
          // safe teardown
        }
        lensRef.current = null;
      }
    };
  }, [isReducedMotion]);

  const handleCopyEmail = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(VERIFIED_EMAIL)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2200);
        })
        .catch(() => {
          fallbackCopy();
        });
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = VERIFIED_EMAIL;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // noop
    }
  };

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-heading">
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
            <span className="tag-index">[ 05 ]</span>
            <DecryptedText
              text="CONTACT"
              animateOn="view"
              speed={65}
              sequential={true}
              isReducedMotion={isReducedMotion}
            />
          </motion.div>
          <motion.h2
            id="contact-heading"
            className="section-title font-display"
            variants={isReducedMotion ? reducedMotionVariants : titleVariants}
          >
            Let's connect.
          </motion.h2>
          <motion.p
            className="section-desc font-body"
            variants={isReducedMotion ? reducedMotionVariants : descVariants}
          >
            Open to software engineering internships and backend engineering roles.
            Reach out directly or explore my work online.
          </motion.p>
        </motion.div>

        {/* Minimal Editorial Contact Layout */}
        <motion.div
          className="contact-box-shell"
          variants={isReducedMotion ? reducedMotionVariants : contentBlockVariants}
          initial={isReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={ITEM_VIEWPORT}
        >
          <div
            id="contact-lens"
            ref={lensElementRef}
            className="contact-editorial-box glass"
          >
            <div className="contact-primary-action">
              <span className="contact-channel-label font-mono">DIRECT INQUIRIES</span>
              <div className="email-display-row">
                <a
                  href={`mailto:${VERIFIED_EMAIL}`}
                  className="email-address-link font-display"
                  aria-label={`Send email to ${VERIFIED_EMAIL}`}
                >
                  {VERIFIED_EMAIL}
                </a>
                <button
                  type="button"
                  className="btn-copy-address font-mono"
                  onClick={handleCopyEmail}
                  aria-label="Copy email address to clipboard"
                >
                  {copied ? '✓ COPIED' : 'COPY'}
                </button>
              </div>
            </div>

            <div className="contact-secondary-links font-mono">
              <a
                href={RESUME_URL}
                download="Maulik_Pandey_Resume.pdf"
                className="contact-link-item"
                aria-label="Download resume PDF"
              >
                <span>RESUME [PDF]</span>
                <span className="link-arrow" aria-hidden="true">↓</span>
              </a>

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-item"
                aria-label="Visit GitHub profile"
              >
                <span>GITHUB</span>
                <span className="link-arrow" aria-hidden="true">↗</span>
              </a>

              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-item"
                aria-label="Visit LinkedIn profile"
              >
                <span>LINKEDIN</span>
                <span className="link-arrow" aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
