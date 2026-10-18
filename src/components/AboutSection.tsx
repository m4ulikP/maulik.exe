import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DecryptedText } from './reactbits/DecryptedText';
import {
  sectionHeaderVariants,
  eyebrowVariants,
  titleVariants,
  staggerListVariants,
  staggerItemVariants,
  reducedMotionVariants,
  SECTION_VIEWPORT,
  ITEM_VIEWPORT,
} from '../utils/revealVariants';
import './AboutSection.css';

gsap.registerPlugin(ScrollTrigger);

interface AboutSectionProps {
  isReducedMotion?: boolean;
}

const ABOUT_PARAGRAPHS = [
  "I'm a Computer Science and Engineering undergraduate specializing in Artificial Intelligence. I'm interested in software engineering, especially building useful applications and learning how their backend systems work.",
  "I've built projects involving structural-health acoustic monitoring and sales workflow automation, and I'm continuing to improve my programming, problem-solving, and machine-learning skills.",
  "My current goal is to become a stronger software engineer through hands-on projects and experience, then gradually move toward AI/ML engineering.",
] as const;

export const AboutSection: React.FC<AboutSectionProps> = ({
  isReducedMotion = false,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const narrativeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isReducedMotion || typeof window === 'undefined') return;

    const narrativeEl = narrativeRef.current;
    if (!narrativeEl) return;

    // Use gsap.context for clean scoping, automatic element tracking, and bulletproof revert
    const ctx = gsap.context(() => {
      const words = narrativeEl.querySelectorAll<HTMLElement>('.about-word');
      if (!words.length) return;

      // Scrubbed editorial text reveal: starts muted slate-gray and progressively illuminates to warm white
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: narrativeEl,
          start: 'top 78%',
          end: 'bottom 42%',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        words,
        {
          opacity: 0.22,
        },
        {
          opacity: 1,
          duration: 0.35,
          stagger: {
            each: 0.02,
            ease: 'none',
          },
          ease: 'power1.out',
        }
      );
    }, narrativeEl);

    // Recalculate ScrollTrigger measurements once web fonts settle
    const fontsPromise = typeof document !== 'undefined' && document.fonts ? document.fonts.ready : Promise.resolve();
    fontsPromise.then(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
    };
  }, [isReducedMotion]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`about-section ${isReducedMotion ? 'is-reduced-motion' : ''}`}
      aria-labelledby="about-heading"
    >
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
            <span className="tag-index">[ 03 ]</span>
            <DecryptedText
              text="PROFILE"
              animateOn="view"
              speed={65}
              sequential={true}
              isReducedMotion={isReducedMotion}
            />
          </motion.div>
          <motion.h2
            id="about-heading"
            className="section-title font-display"
            variants={isReducedMotion ? reducedMotionVariants : titleVariants}
          >
            About Maulik Pandey
          </motion.h2>
        </motion.div>

        {/* About Editorial Layout */}
        <div className="about-editorial-grid">
          {/* Main Narrative with Scroll-Driven Text Color-Fill Effect */}
          <div ref={narrativeRef} className="about-narrative font-body">
            {ABOUT_PARAGRAPHS.map((paragraphText, pIdx) => {
              const words = paragraphText.split(/\s+/);
              return (
                <p key={`about-p-${pIdx}`} className="about-paragraph">
                  {/* Accessible full text for screen readers */}
                  <span className="sr-only" data-liquid-ignore="true">{paragraphText}</span>
                  {/* Segmented words for continuous scrubbed optical fill */}
                  <span aria-hidden="true" className="about-words-wrap">
                    {words.map((word, wIdx) => (
                      <React.Fragment key={`w-${pIdx}-${wIdx}`}>
                        <span className="about-word">{word}</span>
                        {wIdx < words.length - 1 ? ' ' : ''}
                      </React.Fragment>
                    ))}
                  </span>
                </p>
              );
            })}
          </div>

          {/* Compact Education & Engineering Focus Summary */}
          <motion.div
            className="about-meta-column font-mono"
            variants={isReducedMotion ? reducedMotionVariants : staggerListVariants}
            initial={isReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={ITEM_VIEWPORT}
          >
            <motion.div
              className="about-meta-item"
              variants={isReducedMotion ? reducedMotionVariants : staggerItemVariants}
            >
              <span className="meta-label">EDUCATION</span>
              <span className="meta-value font-display">B.Tech in Computer Science</span>
              <span className="meta-sub">IILM University (2025 – Present) · AI Specialization</span>
            </motion.div>

            <motion.div
              className="about-meta-item"
              variants={isReducedMotion ? reducedMotionVariants : staggerItemVariants}
            >
              <span className="meta-label">ENGINEERING FOCUS</span>
              <span className="meta-value font-display">Software Engineering &amp; Backend Development</span>
              <span className="meta-sub">Hands-on application development &amp; foundational AI/ML</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
