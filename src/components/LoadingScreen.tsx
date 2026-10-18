import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onComplete: () => void;
  isReducedMotion?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  isReducedMotion = false,
}) => {
  const [phase, setPhase] = useState<'converging' | 'settled' | 'exit'>('converging');

  // Check if system or user prefers reduced motion immediately
  const effectiveReducedMotion = useMemo(() => {
    if (isReducedMotion) return true;
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, [isReducedMotion]);

  useEffect(() => {
    if (effectiveReducedMotion) {
      onComplete();
      return;
    }

    // Step 1: Shapes converge with spring motion (0ms - 650ms)
    // Step 2: Settled in balanced liquid harmony with wordmark in focus (650ms - 1180ms)
    const settleTimer = setTimeout(() => {
      setPhase('settled');
    }, 650);

    // Step 3: Gentle liquid aperture expansion and fade exit (1180ms)
    const exitTimer = setTimeout(() => {
      setPhase('exit');
    }, 1180);

    // Step 4: Complete transition and hand off to portfolio (1420ms)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1420);

    return () => {
      clearTimeout(settleTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [effectiveReducedMotion, onComplete]);

  if (effectiveReducedMotion) {
    return null;
  }

  return (
    <motion.div
      className="loading-screen"
      role="status"
      aria-live="polite"
      aria-label="Loading MAULIK.EXE"
      data-liquid-ignore="true"
      initial={{ opacity: 1 }}
      animate={phase === 'exit' ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="liquid-playground"
        animate={
          phase === 'exit'
            ? { scale: 1.05, opacity: 0, filter: 'blur(8px)' }
            : { scale: 1, opacity: 1, filter: 'blur(0px)' }
        }
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Soft Ambient Caustic Light Behind Glass Elements */}
        <div className="liquid-caustic-field" aria-hidden="true">
          <div className="caustic-blob blob-1" />
          <div className="caustic-blob blob-2" />
        </div>

        {/* Suspended Translucent Liquid-Glass Cluster */}
        <div className="liquid-glass-cluster" aria-hidden="true">
          {/* Satellite Droplet A: Floating Organic Glass Orb (Top-Left) */}
          <motion.div
            className="glass-shape glass-droplet-a"
            initial={{ x: -75, y: -50, scale: 0.25, opacity: 0 }}
            animate={{
              x: [-75, 8, -2, 0],
              y: [-50, 6, -1, 0],
              scale: [0.25, 1.15, 0.96, 1],
              opacity: 1,
            }}
            transition={{
              duration: 0.85,
              times: [0, 0.58, 0.82, 1],
              ease: [0.22, 1, 0.36, 1],
              delay: 0.06,
            }}
          >
            <div className="glass-specular-arc" />
            <div className="glass-iridescent-film" />
          </motion.div>

          {/* Satellite Pill B: Translucent Glass Capsule (Bottom-Right) */}
          <motion.div
            className="glass-shape glass-pill-b"
            initial={{ x: 75, y: 55, scale: 0.3, rotate: -24, opacity: 0 }}
            animate={{
              x: [75, -6, 2, 0],
              y: [55, -5, 1, 0],
              scale: [0.3, 1.12, 0.97, 1],
              rotate: [-24, 7, -2, 0],
              opacity: 1,
            }}
            transition={{
              duration: 0.9,
              times: [0, 0.58, 0.82, 1],
              ease: [0.22, 1, 0.36, 1],
              delay: 0.14,
            }}
          >
            <div className="glass-specular-arc" />
            <div className="glass-iridescent-film" />
          </motion.div>

          {/* Micro Droplet C: Floating Buoyant Glass Bead (Top-Right) */}
          <motion.div
            className="glass-shape glass-bead-c"
            initial={{ scale: 0, y: 20, opacity: 0 }}
            animate={{
              scale: [0, 1.35, 0.9, 1],
              y: [20, -5, 1, 0],
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              times: [0, 0.55, 0.8, 1],
              ease: [0.22, 1, 0.36, 1],
              delay: 0.22,
            }}
          >
            <div className="glass-specular-dot" />
          </motion.div>

          {/* Central Liquid Focal Lens: Main Tactile Glass Element */}
          <motion.div
            className="glass-shape glass-lens-core"
            initial={{ scale: 0.35, rotate: -12, opacity: 0 }}
            animate={{
              scale: [0.35, 1.09, 0.97, 1],
              rotate: [-12, 4, -1, 0],
              opacity: 1,
            }}
            transition={{
              duration: 0.92,
              times: [0, 0.54, 0.78, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Primary Curved Specular Glint along Upper Rim */}
            <div className="glass-lens-specular" />

            {/* Subtle Refractive Iridescent Sheen */}
            <div className="glass-lens-iridescent" />

            {/* Elastic Liquid Ripple Expands on Convergence */}
            <motion.div
              className="glass-liquid-ripple"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{
                scale: [0.3, 1.35, 1.8],
                opacity: [0.8, 0.35, 0],
              }}
              transition={{
                duration: 0.85,
                delay: 0.32,
                ease: 'easeOut',
              }}
            />

            {/* Central Luminous Liquid Dewdrop */}
            <div className="glass-core-bead" />
          </motion.div>
        </div>

        {/* Confident, Polished Wordmark & Editorial Subtitle */}
        <motion.div
          className="liquid-identity-wrap"
          initial={{ opacity: 0, y: 16, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
        >
          <div className="liquid-brand-row">
            <span className="liquid-brand font-display">MAULIK.EXE</span>
          </div>

          <motion.div
            className="liquid-descriptor font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.52 }}
          >
            <span className="liquid-status-dot" aria-hidden="true" />
            <span>PLAYFUL SYSTEMS &amp; CREATIVE CODE</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
