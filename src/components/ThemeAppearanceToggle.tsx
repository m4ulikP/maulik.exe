import React, { useEffect, useRef, useCallback } from 'react';
import liquidGL, { type LiquidGLLens } from 'liquid-gl';
import type { AppearanceMode } from '../types/theme';
import './ThemeAppearanceToggle.css';

export interface ThemeAppearanceToggleProps {
  appearance: AppearanceMode;
  onToggle: () => void;
  isReducedMotion?: boolean;
}

export const ThemeAppearanceToggle: React.FC<ThemeAppearanceToggleProps> = ({
  appearance,
  onToggle,
  isReducedMotion = false,
}) => {
  const isDark = appearance === 'dark';
  const liquidLensRef = useRef<LiquidGLLens | null>(null);
  const lensTargetRef = useRef<HTMLSpanElement | null>(null);
  const lastToggleTimeRef = useRef<number>(0);

  const appearanceRef = useRef<AppearanceMode>(appearance);
  useEffect(() => {
    appearanceRef.current = appearance;
  }, [appearance]);

  // Throttled toggle handler prevents accidental double-triggering
  const handleToggle = useCallback(() => {
    const now = Date.now();
    if (now - lastToggleTimeRef.current < 260) return;
    lastToggleTimeRef.current = now;
    onToggle();
  }, [onToggle]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  // Initialize genuine liquid-gl optical glass on the spherical knob
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isCancelled = false;

    // Small rAF delay ensures DOM element is rendered and measurable
    const initTimer = requestAnimationFrame(() => {
      if (isCancelled || !lensTargetRef.current) return;

      try {
        const result = liquidGL({
          target: '#neumorphic-liquid-lens',
          content: false,
          snapshot: 'body',
          engine: 'auto',
          resolution: 1.0,
          zIndex: 2,
          refraction: 0.022,
          aberration: 0,
          bevelDepth: 0.04,
          bevelWidth: 0.25,
          frost: 0,
          shadow: false,
          specular: true,
          reveal: 'none',
          tilt: false,
          draggable: false,
          interaction: 'fluid',
          interactionStrength: 0.35,
          interactionRadius: 2.5,
          magnify: 1.05,
          tint: appearanceRef.current === 'light' ? 'rgba(255, 255, 255, 0.16)' : 'rgba(15, 23, 42, 0.35)',
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
        liquidLensRef.current = lensInstance;
      } catch (err) {
        // Graceful fallback to CSS glass shading and gradients
        console.warn('liquidGL appearance toggle initialization fallback:', err);
      }
    });

    return () => {
      isCancelled = true;
      cancelAnimationFrame(initTimer);
      if (liquidLensRef.current) {
        try {
          liquidLensRef.current.destroy();
        } catch {
          // safe cleanup
        }
        liquidLensRef.current = null;
      }
    };
  }, []); // mounted once per instance

  // Synchronize liquidGL optical tint and update metrics upon switch movement settle
  useEffect(() => {
    if (liquidLensRef.current) {
      try {
        liquidLensRef.current.setTint(
          appearance === 'light' ? 'rgba(255, 255, 255, 0.16)' : 'rgba(15, 23, 42, 0.35)'
        );
      } catch {
        // safe fallback
      }
    }

    // After knob slide completes (520ms transition), sync optical metrics
    const settleTimer = window.setTimeout(() => {
      if (liquidLensRef.current) {
        try {
          liquidLensRef.current.updateMetrics();
        } catch {
          // safe fallback
        }
      }
    }, isReducedMotion ? 40 : 540);

    return () => clearTimeout(settleTimer);
  }, [appearance, isReducedMotion]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Appearance mode: currently ${isDark ? 'Dark' : 'Light'}. Click or press Space to switch to ${isDark ? 'Light' : 'Dark'}.`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      className={`theme-appearance-toggle ${isDark ? 'state-dark' : 'state-light'} ${isReducedMotion ? 'reduced-motion' : ''}`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      data-liquid-ignore=""
    >
      {/* Neumorphic Recessed Housing Track */}
      <span className="toggle-track" aria-hidden="true">
        {/* Monochromatic State Labels */}
        <span className="toggle-label label-dark font-mono">DARK</span>
        <span className="toggle-label label-light font-mono">LIGHT</span>

        {/* Sculpted Spherical Knob */}
        <span className="toggle-knob">
          {/* liquidGL Refractive Glass Lens Surface */}
          <span
            id="neumorphic-liquid-lens"
            ref={lensTargetRef}
            className="toggle-liquid-glass"
          />
          {/* Directional Glass Specular Highlight Sheen */}
          <span className="knob-specular-sheen" />
        </span>
      </span>
    </button>
  );
};

export default ThemeAppearanceToggle;
