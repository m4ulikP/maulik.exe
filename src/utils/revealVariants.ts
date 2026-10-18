import { type Variants } from 'motion/react';

/**
 * MAULIK.EXE — Cohesive Editorial Scroll-Reveal System
 * Restrained vertical movement (12-18px), smooth cubic-bezier easing,
 * coordinated staggering (eyebrow -> title -> description -> content).
 */

export const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

// Viewport trigger settings for section-level entrances
export const SECTION_VIEWPORT = {
  once: true,
  amount: 0.15,
  margin: '0px 0px -40px 0px',
} as const;

// Viewport trigger settings for individual content items/cards
export const ITEM_VIEWPORT = {
  once: true,
  amount: 0.12,
  margin: '0px 0px -30px 0px',
} as const;

// 1. Coordinated Section Header Container
export const sectionHeaderVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.02,
    },
  },
};

// Eyebrow / Tag Index: Fades in with subtle lift
export const eyebrowVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: REVEAL_EASE,
    },
  },
};

// Section Heading: Fades in with 16px upward motion
export const titleVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.54,
      ease: REVEAL_EASE,
    },
  },
};

// Section Intro Description: Follows heading with subtle delay
export const descVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.52,
      ease: REVEAL_EASE,
    },
  },
};

// Main Content Blocks / Cards / Surfaces
export const contentBlockVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.58,
      ease: REVEAL_EASE,
    },
  },
};

// Staggered Container for lists (e.g. Project cards, Footer columns)
export const staggerListVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.04,
    },
  },
};

// Staggered Item within list
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.54,
      ease: REVEAL_EASE,
    },
  },
};

// Immediate Zero-Motion Variant for Reduced Motion preference
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } },
};
