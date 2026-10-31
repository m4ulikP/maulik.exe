import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isFine = window.matchMedia('(pointer: fine)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return isFine && !isReduced;
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isInput, setIsInput] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const finePointerMedia = window.matchMedia('(pointer: fine)');
    const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    const checkSupport = () => {
      const isFine = finePointerMedia.matches;
      const isReduced = reducedMotionMedia.matches;
      return isFine && !isReduced;
    };

    if (!checkSupport()) {
      return;
    }

    document.body.classList.add('custom-cursor-active');

    let rafId: number | null = null;
    let mouseX = -100;
    let mouseY = -100;
    let isScrollbarDragging = false;
    let scrollTimeoutId: number | null = null;

    const updateCursorPosition = (x: number, y: number) => {
      mouseX = x;
      mouseY = y;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          if (cursorRef.current) {
            cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
          }
          rafId = null;
        });
      }
    };

    // Helper: detect if a point is within the vertical/horizontal scrollbar area of a container or window
    const isPointOnScrollbar = (clientX: number, clientY: number, target: EventTarget | null) => {
      // 1. Check window/viewport scrollbar
      const windowScrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (windowScrollbarWidth > 0 && clientX >= document.documentElement.clientWidth) {
        return true;
      }
      const windowScrollbarHeight = window.innerHeight - document.documentElement.clientHeight;
      if (windowScrollbarHeight > 0 && clientY >= document.documentElement.clientHeight) {
        return true;
      }

      // 2. Check scrollable element under pointer (e.g. modal-container, code blocks, etc.)
      const el = target as HTMLElement | null;
      if (el) {
        let current: HTMLElement | null = el;
        while (current && current !== document.documentElement && current !== document.body) {
          const hasVScroll = current.scrollHeight > current.clientHeight && current.clientHeight > 0;
          const overflowY = window.getComputedStyle(current).overflowY;
          const isScrollableY = overflowY === 'auto' || overflowY === 'scroll';

          if (hasVScroll && isScrollableY) {
            const rect = current.getBoundingClientRect();
            // Scrollbar track is on the right side of the element (width usually ~10-18px)
            const scrollbarWidth = current.offsetWidth - current.clientWidth;
            if (scrollbarWidth > 0) {
              const scrollbarLeft = rect.right - scrollbarWidth;
              if (
                clientX >= scrollbarLeft &&
                clientX <= rect.right &&
                clientY >= rect.top &&
                clientY <= rect.bottom
              ) {
                return true;
              }
            }
          }

          const hasHScroll = current.scrollWidth > current.clientWidth && current.clientWidth > 0;
          const overflowX = window.getComputedStyle(current).overflowX;
          const isScrollableX = overflowX === 'auto' || overflowX === 'scroll';

          if (hasHScroll && isScrollableX) {
            const rect = current.getBoundingClientRect();
            const scrollbarHeight = current.offsetHeight - current.clientHeight;
            if (scrollbarHeight > 0) {
              const scrollbarTop = rect.bottom - scrollbarHeight;
              if (
                clientY >= scrollbarTop &&
                clientY <= rect.bottom &&
                clientX >= rect.left &&
                clientX <= rect.right
              ) {
                return true;
              }
            }
          }

          current = current.parentElement;
        }
      }

      return false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      // If we are currently dragging a scrollbar and pointermove arrives, check if mouse button is still pressed
      if (isScrollbarDragging) {
        if (e.buttons === 0) {
          isScrollbarDragging = false;
        } else {
          // Still dragging scrollbar: keep custom cursor hidden
          setIsVisible(false);
          return;
        }
      }

      updateCursorPosition(e.clientX, e.clientY);
      setIsVisible(true);

      // Check hover targets
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, [role="button"], .btn-brutal, .interactive, select, summary, .tech-tag, .modal-chip, .pipeline-node-box'
      );
      setIsHovered(Boolean(interactive));

      const inputElement = target.closest(
        'input:not([type="submit"]):not([type="button"]), textarea, [contenteditable="true"]'
      );
      setIsInput(Boolean(inputElement));
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Check if clicked directly on a scrollbar track/thumb
      if (isPointOnScrollbar(e.clientX, e.clientY, e.target)) {
        isScrollbarDragging = true;
        setIsVisible(false);
        return;
      }
      setIsDown(true);
    };

    const handlePointerUp = () => {
      setIsDown(false);
      if (isScrollbarDragging) {
        isScrollbarDragging = false;
        // Don't immediately show cursor at stale location; wait for next pointermove
      }
    };

    // Global scroll listener: if scroll happens while mouse button is pressed and no pointermove is firing,
    // it's a native scrollbar drag. Hide the cursor so it doesn't freeze in place.
    const handleScroll = (e: Event) => {
      if (isScrollbarDragging) {
        setIsVisible(false);
        return;
      }

      // If scroll occurs, clear any pending scroll timer
      if (scrollTimeoutId) {
        window.clearTimeout(scrollTimeoutId);
      }

      // If user scrolls via wheel/touchpad, keep cursor position intact.
      // But if user grabbed a native scrollbar (where browser doesn't send pointermove),
      // we check if pointer was near the scrollbar of the target.
      const target = e.target;
      if (target && target instanceof HTMLElement) {
        if (isPointOnScrollbar(mouseX, mouseY, target)) {
          isScrollbarDragging = true;
          setIsVisible(false);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      if (e.buttons === 0) {
        isScrollbarDragging = false;
        updateCursorPosition(e.clientX, e.clientY);
        setIsVisible(true);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const onPreferenceChange = () => {
      if (!checkSupport()) {
        setEnabled(false);
        document.body.classList.remove('custom-cursor-active');
      } else {
        setEnabled(true);
        document.body.classList.add('custom-cursor-active');
      }
    };

    finePointerMedia.addEventListener('change', onPreferenceChange);
    reducedMotionMedia.addEventListener('change', onPreferenceChange);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('scroll', handleScroll, { capture: true });
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      finePointerMedia.removeEventListener('change', onPreferenceChange);
      reducedMotionMedia.removeEventListener('change', onPreferenceChange);
      if (rafId) cancelAnimationFrame(rafId);
      if (scrollTimeoutId) window.clearTimeout(scrollTimeoutId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      className={`neo-cursor-wrapper ${isVisible ? 'visible' : ''} ${isInput ? 'input-mode' : ''}`}
      aria-hidden="true"
    >
      <div
        className={`neo-cursor-box ${isHovered ? 'hovered' : ''} ${isDown ? 'pressed' : ''}`}
      >
        <span className="neo-cursor-core"></span>
      </div>

      <style>{`
        .neo-cursor-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 999999;
          opacity: 0;
          transition: opacity 0.15s ease;
          will-change: transform;
        }

        .neo-cursor-wrapper.visible {
          opacity: 1;
        }

        .neo-cursor-wrapper.input-mode {
          opacity: 0;
        }

        .neo-cursor-box {
          position: absolute;
          top: -7px;
          left: -7px;
          width: 14px;
          height: 14px;
          background-color: var(--bg-app);
          border: 2px solid var(--border-color-default);
          box-shadow: 2px 2px 0px var(--color-ink);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: width 0.12s cubic-bezier(0.16, 1, 0.3, 1),
                      height 0.12s cubic-bezier(0.16, 1, 0.3, 1),
                      top 0.12s cubic-bezier(0.16, 1, 0.3, 1),
                      left 0.12s cubic-bezier(0.16, 1, 0.3, 1),
                      background-color 0.12s ease,
                      box-shadow 0.12s ease,
                      transform 0.12s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .neo-cursor-core {
          width: 3px;
          height: 3px;
          background-color: var(--color-text-accent);
          display: block;
        }

        .neo-cursor-box.hovered {
          width: 22px;
          height: 22px;
          top: -11px;
          left: -11px;
          background-color: var(--accent-highlight);
          box-shadow: 3px 3px 0px var(--color-ink);
          transform: rotate(45deg);
        }

        .neo-cursor-box.hovered .neo-cursor-core {
          background-color: var(--color-on-accent);
          width: 4px;
          height: 4px;
        }

        .neo-cursor-box.pressed {
          transform: scale(0.85);
          box-shadow: 1px 1px 0px var(--color-ink);
        }

        @media (pointer: fine) {
          body.custom-cursor-active,
          body.custom-cursor-active a,
          body.custom-cursor-active button,
          body.custom-cursor-active [role="button"] {
            cursor: none !important;
          }

          body.custom-cursor-active input,
          body.custom-cursor-active textarea,
          body.custom-cursor-active select {
            cursor: auto !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .neo-cursor-wrapper {
            display: none !important;
          }
          body.custom-cursor-active,
          body.custom-cursor-active * {
            cursor: auto !important;
          }
        }
      `}</style>
    </div>
  );
};
