import React, { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

interface CustomCursorProps {
  isReducedMotion?: boolean;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ isReducedMotion = false }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  // Position references for smooth interpolation
  const mousePos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const ringPos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Only enable if pointer is fine (mouse, trackpad) and not touch/coarse
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const systemPrefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || systemPrefersReduced || isReducedMotion) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('a, button, input, textarea, [role="button"], .interactive-target');
        setIsHovered(!!interactive);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth ring interpolation animation loop
    const render = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      if (ringRef.current) {
        // Interpolate ring toward mouse
        ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.22;
        ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.22;
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible, isReducedMotion]);

  // If not visible or disabled, render null
  if (!isVisible || isReducedMotion) return null;

  return (
    <div className="custom-cursor-container" aria-hidden="true">
      {/* Outer Spring Ring */}
      <div
        ref={ringRef}
        className={`cursor-ring ${isHovered ? 'cursor-hovered' : ''} ${isClicked ? 'cursor-clicked' : ''}`}
      />
      {/* Precision Inner Dot */}
      <div
        ref={dotRef}
        className={`cursor-dot ${isHovered ? 'cursor-hovered' : ''} ${isClicked ? 'cursor-clicked' : ''}`}
      />
    </div>
  );
};
