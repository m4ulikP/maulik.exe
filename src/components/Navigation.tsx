import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Navigation.css';
import { type ThemeId, type AppearanceMode } from '../types/theme';
import liquidGL, { type LiquidGLLens } from 'liquid-gl';

export type { ThemeId, AppearanceMode };

const getTintForTheme = (t: ThemeId, appearance: AppearanceMode = 'dark'): string => {
  if (appearance === 'light') {
    switch (t) {
      case 'amber':
        return 'rgba(217, 119, 6, 0.08)';
      case 'midnight':
        return 'rgba(2, 132, 199, 0.08)';
      case 'obsidian':
      default:
        return 'rgba(5, 150, 105, 0.08)';
    }
  }
  switch (t) {
    case 'amber':
      return 'rgba(255, 244, 225, 0.14)';
    case 'midnight':
      return 'rgba(220, 240, 255, 0.14)';
    case 'obsidian':
    default:
      return 'rgba(225, 250, 240, 0.14)';
  }
};

export interface NavigationProps {
  activeSection?: string;
  onHomeClick?: () => void;
  onWorkClick?: () => void;
  onExperienceClick?: () => void;
  onAboutClick?: () => void;
  onSkillsClick?: () => void;
  onContactClick?: () => void;
  onTerminalClick?: () => void;
  theme?: ThemeId;
  onThemeChange?: (theme: ThemeId) => void;
  appearance?: AppearanceMode;
  isReducedMotion?: boolean;
  systemReducedMotion?: boolean;
  onToggleMotion?: () => void;
  isReady?: boolean;
}

const SECTION_IDS = ['home', 'work', 'experience', 'about', 'skills', 'contact'] as const;

interface NavSectionItem {
  id: string;
  label: string;
  num: string;
  iconOutline: React.ComponentType<{ className?: string }>;
  iconFilled: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

// 0. Home Icon Pair (Phosphor House Outline / Fill)
const HomeOutlineIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 256 256" fill="none" aria-hidden="true">
    <path
      d="M104,216V152h48v64h64V120a8,8,0,0,0-2.34-5.66l-80-80a8,8,0,0,0-11.32,0l-80,80A8,8,0,0,0,40,120v96Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
  </svg>
);

const HomeFillIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M224,120v96a8,8,0,0,1-8,8H160a8,8,0,0,1-8-8V164a4,4,0,0,0-4-4H108a4,4,0,0,0-4,4v52a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V120a16,16,0,0,1,4.69-11.31l80-80a16,16,0,0,1,22.62,0l80,80A16,16,0,0,1,224,120Z" />
  </svg>
);

// 1. Work Icon Pair (Phosphor Briefcase Outline / Fill)
const WorkOutlineIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="32" y="64" width="192" height="144" rx="8" fill="none" />
    <path d="M168,64V48a16,16,0,0,0-16-16H104A16,16,0,0,0,88,48V64" />
    <path d="M224,118.31A191.09,191.09,0,0,1,128,144a191.14,191.14,0,0,1-96-25.68" />
    <line x1="112" y1="112" x2="144" y2="112" />
  </svg>
);

const WorkFillIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M152,112a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h32A8,8,0,0,1,152,112Zm80-40V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V72A16,16,0,0,1,40,56H80V48a24,24,0,0,1,24-24h48a24,24,0,0,1,24,24v8h40A16,16,0,0,1,232,72ZM96,56h64V48a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8Zm120,57.61V72H40v41.61A184,184,0,0,0,128,136,184,184,0,0,0,216,113.61Z" />
  </svg>
);

// 2. Experience Icon Pair (Phosphor Clock Outline / Fill)
const ExperienceOutlineIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="128" cy="128" r="96" fill="none" />
    <polyline points="128 72 128 128 184 128" />
  </svg>
);

const ExperienceFillIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z" />
  </svg>
);

// 3. About Icon Pair (Phosphor User Profile Outline / Fill)
const AboutOutlineIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="128" cy="96" r="64" fill="none" />
    <path d="M32,216c19.37-33.47,54.55-56,96-56s76.63,22.53,96,56" />
  </svg>
);

const AboutFillIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z" />
  </svg>
);

// 4. Skills Icon Pair (Phosphor Stack Layers Outline / Fill)
const SkillsOutlineIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="32 176 128 232 224 176" />
    <polyline points="32 128 128 184 224 128" />
    <polygon points="32 80 128 136 224 80 128 24 32 80" />
  </svg>
);

const SkillsFillIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M220,169.09l-92,53.65L36,169.09A8,8,0,0,0,28,182.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,169.09Z" />
    <path d="M220,121.09l-92,53.65L36,121.09A8,8,0,0,0,28,134.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,121.09Z" />
    <path d="M28,86.91l96,56a8,8,0,0,0,8.06,0l96-56a8,8,0,0,0,0-13.82l-96-56a8,8,0,0,0-8.06,0l-96,56a8,8,0,0,0,0,13.82Z" />
  </svg>
);

// 5. Contact Icon Pair (Phosphor Envelope Outline / Fill)
const ContactOutlineIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M32,56H224a0,0,0,0,1,0,0V192a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V56A0,0,0,0,1,32,56Z" />
    <polyline points="224 56 128 144 32 56" />
  </svg>
);

const ContactFillIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-8,144H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z" />
  </svg>
);

const FIXED_LENS_WIDTH = 88;
const FIXED_LENS_HEIGHT = 60;
const FIXED_LENS_TOP = 5;
const MOBILE_BREAKPOINT = 860;

export const Navigation: React.FC<NavigationProps> = ({
  activeSection = 'home',
  onHomeClick,
  onWorkClick,
  onExperienceClick,
  onAboutClick,
  onSkillsClick,
  onContactClick,
  onTerminalClick,
  theme = 'obsidian',
  appearance = 'dark',
  isReducedMotion = false,
  isReady = true,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const hasEnteredRef = useRef<boolean>(isReducedMotion || false);
  const [entranceStage, setEntranceStage] = useState<'compact' | 'expanding' | 'settled'>(() => {
    return isReducedMotion ? 'settled' : 'compact';
  });

  const [lensStyle, setLensStyle] = useState<{ left: number; top: number; width: number; height: number }>({
    left: 6,
    top: FIXED_LENS_TOP,
    width: FIXED_LENS_WIDTH,
    height: FIXED_LENS_HEIGHT,
  });
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [committedSection, setCommittedSection] = useState<string>(activeSection || 'home');

  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const dockBarRef = useRef<HTMLElement | null>(null);
  const lensRefElement = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const liquidLensRef = useRef<LiquidGLLens | null>(null);

  // Dedicated Web Animations API ref for horizontal travel
  const travelAnimRef = useRef<Animation | null>(null);
  const currentAnimTargetIndexRef = useRef<number | null>(null);

  // Click vs Drag disambiguation refs
  const isPointerDownRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const hasPassedDragThresholdRef = useRef<boolean>(false);
  const pointerStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartLeftRef = useRef<number>(0);
  const didJustDragRef = useRef<boolean>(false);
  const dragCandidateRef = useRef<number | null>(null);

  const themeRef = useRef<ThemeId>(theme);
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  const appearanceRef = useRef<AppearanceMode>(appearance);
  useEffect(() => {
    appearanceRef.current = appearance;
  }, [appearance]);

  const navItems: NavSectionItem[] = [
    { id: 'home', label: 'Home', num: '00', iconOutline: HomeOutlineIcon, iconFilled: HomeFillIcon, onClick: onHomeClick },
    { id: 'work', label: 'Work', num: '01', iconOutline: WorkOutlineIcon, iconFilled: WorkFillIcon, onClick: onWorkClick },
    { id: 'experience', label: 'Experience', num: '02', iconOutline: ExperienceOutlineIcon, iconFilled: ExperienceFillIcon, onClick: onExperienceClick },
    { id: 'about', label: 'About', num: '03', iconOutline: AboutOutlineIcon, iconFilled: AboutFillIcon, onClick: onAboutClick },
    { id: 'skills', label: 'Skills', num: '04', iconOutline: SkillsOutlineIcon, iconFilled: SkillsFillIcon, onClick: onSkillsClick },
    { id: 'contact', label: 'Contact', num: '05', iconOutline: ContactOutlineIcon, iconFilled: ContactFillIcon, onClick: onContactClick },
  ];

  // Helper to find index by section ID
  const getActiveIndex = useCallback((): number => {
    const target = committedSection || activeSection;
    const idx = SECTION_IDS.indexOf(target as typeof SECTION_IDS[number]);
    return idx >= 0 ? idx : 0;
  }, [committedSection, activeSection]);

  const activeIndex = getActiveIndex();

  const isNavigatingRef = useRef<boolean>(false);
  const navTimerRef = useRef<number | null>(null);

  const beginProgrammaticNav = useCallback(() => {
    isNavigatingRef.current = true;
    if (navTimerRef.current !== null) {
      window.clearTimeout(navTimerRef.current);
    }
    navTimerRef.current = window.setTimeout(() => {
      isNavigatingRef.current = false;
      navTimerRef.current = null;
    }, 850);
  }, []);

  // Keep committedSection in sync with activeSection while normal scrolling occurs
  useEffect(() => {
    if (activeSection && !isDraggingRef.current && !isNavigatingRef.current) {
      setCommittedSection(activeSection);
    }
  }, [activeSection]);

  // Measure target tab bounding rectangle relative to dock bar coordinate system
  const getTabMetrics = useCallback((index: number) => {
    const targetTab = tabsRef.current[index];
    const dockEl = dockBarRef.current;
    if (!targetTab || !dockEl) return null;

    const tabRect = targetTab.getBoundingClientRect();
    const dockRect = dockEl.getBoundingClientRect();

    const left = tabRect.left - dockRect.left;
    const top = FIXED_LENS_TOP;
    const width = FIXED_LENS_WIDTH;
    const height = FIXED_LENS_HEIGHT;
    const center = left + width / 2;

    return { left, top, width, height, center };
  }, []);

  // Unified Horizontal Spring Motion Engine via Web Animations API
  // Features relaxed 600–800ms duration, directional overshoot, rebound bounce, and physical settle
  const animateLensTo = useCallback(
    (targetIndex: number, options?: { immediate?: boolean; fromLeft?: number }) => {
      if (isMobile) return;
      const metrics = getTabMetrics(targetIndex);
      const lensEl = lensRefElement.current;
      if (!metrics || !lensEl) return;

      const { left: targetLeft } = metrics;

      // Lock width, height, and top to consistent fixed dimensions across all items
      lensEl.style.width = `${FIXED_LENS_WIDTH}px`;
      lensEl.style.height = `${FIXED_LENS_HEIGHT}px`;
      lensEl.style.top = `${FIXED_LENS_TOP}px`;

      // Reduced-motion or immediate jump: snap instantly with zero animation
      if (options?.immediate || isReducedMotion) {
        travelAnimRef.current?.cancel();
        travelAnimRef.current = null;
        currentAnimTargetIndexRef.current = targetIndex;
        lensEl.style.left = `${targetLeft}px`;
        lensEl.style.setProperty('--lens-left', `${targetLeft}px`);
        setLensStyle({ left: targetLeft, top: FIXED_LENS_TOP, width: FIXED_LENS_WIDTH, height: FIXED_LENS_HEIGHT });
        requestAnimationFrame(() => {
          liquidLensRef.current?.updateMetrics();
        });
        return;
      }

      // If already animating to this target destination, avoid repeatedly restarting
      if (
        currentAnimTargetIndexRef.current === targetIndex &&
        travelAnimRef.current &&
        travelAnimRef.current.playState === 'running'
      ) {
        return;
      }

      // Sample starting coordinate (from specified left or computed DOM offset)
      const startLeft =
        options?.fromLeft !== undefined ? options.fromLeft : lensEl.offsetLeft || lensStyle.left;

      // If already at destination, update state and return
      if (Math.abs(targetLeft - startLeft) < 1) {
        currentAnimTargetIndexRef.current = targetIndex;
        lensEl.style.left = `${targetLeft}px`;
        lensEl.style.setProperty('--lens-left', `${targetLeft}px`);
        setLensStyle({ left: targetLeft, top: FIXED_LENS_TOP, width: FIXED_LENS_WIDTH, height: FIXED_LENS_HEIGHT });
        return;
      }

      // Cancel prior running travel animation
      travelAnimRef.current?.cancel();
      currentAnimTargetIndexRef.current = targetIndex;

      const delta = targetLeft - startLeft;
      const dir = delta > 0 ? 1 : -1;
      const absDelta = Math.abs(delta);

      // Relaxed 600–800ms spring motion with physical inertia and settle
      // Overshoot: 10px to 18px in travel direction
      const overshootDist = Math.min(18, Math.max(9, absDelta * 0.12)) * dir;
      const overshootLeft = targetLeft + overshootDist;

      // Rebound: 2.5px to 5px back in opposite direction
      const reboundDist = Math.min(5.0, Math.max(2.2, absDelta * 0.035)) * dir;
      const reboundLeft = targetLeft - reboundDist;

      // Gentle sub-pixel settle pre-adjustment: ~0.8px
      const settlePreDist = Math.min(1.2, Math.max(0.5, absDelta * 0.009)) * dir;
      const settlePreLeft = targetLeft + settlePreDist;

      const keyframes: Keyframe[] = [
        { left: `${startLeft}px`, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', offset: 0 },
        { left: `${overshootLeft}px`, easing: 'cubic-bezier(0.34, 1.25, 0.64, 1)', offset: 0.50 },
        { left: `${reboundLeft}px`, easing: 'cubic-bezier(0.25, 1, 0.5, 1)', offset: 0.76 },
        { left: `${settlePreLeft}px`, easing: 'cubic-bezier(0.25, 1, 0.5, 1)', offset: 0.90 },
        { left: `${targetLeft}px`, offset: 1.0 },
      ];

      // Relaxed 620ms to 780ms duration
      const duration = Math.min(800, Math.max(620, 580 + absDelta * 0.45));

      const anim = lensEl.animate(keyframes, {
        duration,
        fill: 'forwards',
      });
      travelAnimRef.current = anim;

      anim.onfinish = () => {
        lensEl.style.left = `${targetLeft}px`;
        lensEl.style.setProperty('--lens-left', `${targetLeft}px`);
        setLensStyle({ left: targetLeft, top: FIXED_LENS_TOP, width: FIXED_LENS_WIDTH, height: FIXED_LENS_HEIGHT });
        anim.cancel();
        if (travelAnimRef.current === anim) {
          travelAnimRef.current = null;
          currentAnimTargetIndexRef.current = null;
        }
        requestAnimationFrame(() => {
          liquidLensRef.current?.updateMetrics();
        });
      };
    },
    [getTabMetrics, isMobile, isReducedMotion, lensStyle.left]
  );

  // Unified Transform Engine: combines immediate press-and-hold scale (1.14×)
  // and subtle cursor-responsive 3D tilt & translation into a single smooth RAF loop
  const scaleRef = useRef<number>(1.0);
  const targetScaleRef = useRef<number>(1.0);
  const hoverXRef = useRef<number>(0);
  const targetHoverXRef = useRef<number>(0);
  const hoverYRef = useRef<number>(0);
  const targetHoverYRef = useRef<number>(0);
  const rotateXRef = useRef<number>(0);
  const targetRotateXRef = useRef<number>(0);
  const rotateYRef = useRef<number>(0);
  const targetRotateYRef = useRef<number>(0);
  const transformRafRef = useRef<number | null>(null);

  const wakeTransformLoop = useCallback(() => {
    if (transformRafRef.current !== null) return;

    const tick = () => {
      const lensEl = lensRefElement.current;
      if (!lensEl) {
        transformRafRef.current = null;
        return;
      }

      if (isReducedMotion) {
        lensEl.style.transform = targetScaleRef.current !== 1.0 ? `scale(${targetScaleRef.current})` : '';
        transformRafRef.current = null;
        return;
      }

      // Smooth physical interpolation
      scaleRef.current += (targetScaleRef.current - scaleRef.current) * 0.18;
      hoverXRef.current += (targetHoverXRef.current - hoverXRef.current) * 0.14;
      hoverYRef.current += (targetHoverYRef.current - hoverYRef.current) * 0.14;
      rotateXRef.current += (targetRotateXRef.current - rotateXRef.current) * 0.14;
      rotateYRef.current += (targetRotateYRef.current - rotateYRef.current) * 0.14;

      const isScaleSettled = Math.abs(targetScaleRef.current - scaleRef.current) < 0.001;
      const isHoverSettled =
        Math.abs(targetHoverXRef.current - hoverXRef.current) < 0.01 &&
        Math.abs(targetHoverYRef.current - hoverYRef.current) < 0.01 &&
        Math.abs(targetRotateXRef.current - rotateXRef.current) < 0.02 &&
        Math.abs(targetRotateYRef.current - rotateYRef.current) < 0.02;

      if (isScaleSettled && isHoverSettled) {
        scaleRef.current = targetScaleRef.current;
        hoverXRef.current = targetHoverXRef.current;
        hoverYRef.current = targetHoverYRef.current;
        rotateXRef.current = targetRotateXRef.current;
        rotateYRef.current = targetRotateYRef.current;

        if (scaleRef.current === 1.0 && hoverXRef.current === 0 && hoverYRef.current === 0) {
          lensEl.style.transform = '';
        } else {
          lensEl.style.transform = `perspective(600px) translate3d(${hoverXRef.current.toFixed(2)}px, ${hoverYRef.current.toFixed(2)}px, 0) rotateX(${rotateXRef.current.toFixed(2)}deg) rotateY(${rotateYRef.current.toFixed(2)}deg) scale(${scaleRef.current.toFixed(3)})`;
        }
        transformRafRef.current = null;
      } else {
        lensEl.style.transform = `perspective(600px) translate3d(${hoverXRef.current.toFixed(2)}px, ${hoverYRef.current.toFixed(2)}px, 0) rotateX(${rotateXRef.current.toFixed(2)}deg) rotateY(${rotateYRef.current.toFixed(2)}deg) scale(${scaleRef.current.toFixed(3)})`;
        transformRafRef.current = requestAnimationFrame(tick);
      }
    };

    transformRafRef.current = requestAnimationFrame(tick);
  }, [isReducedMotion]);

  // Immediate Press-and-Hold Scale (1.14×) triggered right on pointer-down
  const startZoomScale = useCallback(() => {
    setIsPressed(true);
    targetScaleRef.current = 1.14;
    targetHoverXRef.current = 0;
    targetHoverYRef.current = 0;
    targetRotateXRef.current = 0;
    targetRotateYRef.current = 0;
    wakeTransformLoop();

    // Dynamically enhance WebGL/WebGPU shader magnification and cool cyan refractive tint
    if (liquidLensRef.current) {
      try {
        liquidLensRef.current.options.magnify = 1.25;
        liquidLensRef.current.options.refraction = 0.040;
        liquidLensRef.current.options.aberration = 0.28;
        liquidLensRef.current.setTint('rgba(6, 182, 212, 0.22)');
        liquidLensRef.current.renderer?.render();
      } catch {
        // safe fallback
      }
    }
  }, [wakeTransformLoop]);

  const settleZoomScale = useCallback(() => {
    setIsPressed(false);
    targetScaleRef.current = 1.0;
    wakeTransformLoop();

    // Restore resting optical properties to WebGL/WebGPU shader
    if (liquidLensRef.current) {
      try {
        liquidLensRef.current.options.magnify = 1.06;
        liquidLensRef.current.options.refraction = 0.028;
        liquidLensRef.current.options.aberration = 0.20;
        liquidLensRef.current.setTint(getTintForTheme(themeRef.current, appearanceRef.current));
        liquidLensRef.current.renderer?.render();
      } catch {
        // safe fallback
      }
    }
  }, [wakeTransformLoop]);

  useEffect(() => {
    return () => {
      if (transformRafRef.current !== null) {
        cancelAnimationFrame(transformRafRef.current);
      }
    };
  }, []);

  // Sync lens with activeSection when NOT dragging
  useEffect(() => {
    if (isMobile) return;
    if (!isDraggingRef.current) {
      animateLensTo(activeIndex);
    }
  }, [activeIndex, animateLensTo, isMobile]);

  // Recalculate immediately on window resize and layout changes via ResizeObserver
  useEffect(() => {
    if (isMobile) return;
    const handleResize = () => {
      if (!isDraggingRef.current && !(travelAnimRef.current && travelAnimRef.current.playState === 'running')) {
        animateLensTo(activeIndex, { immediate: true });
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && dockBarRef.current) {
      observer = new ResizeObserver(() => {
        if (isDraggingRef.current) return;
        if (travelAnimRef.current && travelAnimRef.current.playState === 'running') return;
        animateLensTo(activeIndex, { immediate: true });
      });
      observer.observe(dockBarRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer?.disconnect();
    };
  }, [activeIndex, animateLensTo, isMobile]);

  // Zero-Lag GPU-Accelerated Scroll Progress Bar along top edge of viewport
  useEffect(() => {
    let rafId: number | null = null;

    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const totalScroll = scrollHeight - clientHeight;
      const progress = totalScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / totalScroll)) : 0;

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
        progressBarRef.current.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
      }

      // Smooth outer dock glass dissolve: 1.0 at scrollY = 0 down to 0.0 by scrollY = 320px
      const scrollY = window.scrollY;
      const dissolve = Math.min(1, Math.max(0, scrollY / 320));
      if (dockBarRef.current) {
        dockBarRef.current.style.setProperty('--dock-glass-opacity', (1 - dissolve).toFixed(3));
      }

      rafId = null;
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateScrollProgress);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Cooldown ref for throttled scroll captures
  const lastCaptureTimeRef = useRef<number>(0);

  // Full-document snapshot capture that guarantees lower sections are measured in the WebGL texture
  const captureFullSnapshot = useCallback(async (minIntervalMs = 700) => {
    if (isMobile || typeof document === 'undefined' || !liquidLensRef.current?.renderer) return;
    const renderer = liquidLensRef.current.renderer as any;
    if (renderer._destroyed) return;

    const now = performance.now();
    if (now - lastCaptureTimeRef.current < minIntervalMs) return;
    lastCaptureTimeRef.current = now;

    // Bump internal generation counter so any running capture aborts stale upload
    renderer._captureGeneration = (renderer._captureGeneration || 0) + 1;
    if (renderer._capturing) return;

    try {
      await renderer.captureSnapshot();
      if (!renderer._destroyed && renderer.render) {
        renderer.render();
      }
    } catch (err) {
      console.warn('liquidGL snapshot capture warning:', err);
    }
  }, [isMobile]);

  // --- LIQUIDGL / MOBILE NAVBAR ENTRANCE ANIMATION CHOREOGRAPHY ---
  // Coordinates Stage A (compact active pill) -> Stage B (expansion) -> Stage C (resting settled dock)
  useEffect(() => {
    if (isReducedMotion || hasEnteredRef.current) return;
    if (!isReady) return;

    // Stage A: Deliberate 140ms pause in compact Home pill state before widening
    const expandTimer = window.setTimeout(() => {
      setEntranceStage('expanding');
    }, 140);

    // Stage B -> Stage C: Complete expansion and transition to settled resting state (~920ms expansion)
    // Settle occurs at 140ms + 780ms = 920ms after mount
    const settleTimer = window.setTimeout(() => {
      setEntranceStage('settled');
      hasEnteredRef.current = true;
      if (!isMobile) {
        requestAnimationFrame(() => {
          liquidLensRef.current?.updateMetrics();
          captureFullSnapshot(0);
        });
      }
    }, 920);

    return () => {
      window.clearTimeout(expandTimer);
      window.clearTimeout(settleTimer);
    };
  }, [isReady, isReducedMotion, isMobile, captureFullSnapshot]);

  // Continuously update LiquidGL metrics during expansion so refraction, bevel, and specular highlights move seamlessly
  useEffect(() => {
    if (entranceStage !== 'expanding') return;

    let rafId: number;
    const updateLoop = () => {
      liquidLensRef.current?.updateMetrics();
      rafId = requestAnimationFrame(updateLoop);
    };

    rafId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(rafId);
  }, [entranceStage]);

  // LiquidGL integration attached to the moving lens element (#nav-glass-lens)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isMobile || isReducedMotion) {
      if (liquidLensRef.current) {
        try {
          liquidLensRef.current.destroy();
        } catch {
          // safe teardown
        }
        liquidLensRef.current = null;
      }
      return;
    }

    let isCancelled = false;

    const initTimer = requestAnimationFrame(() => {
      if (isCancelled || !lensRefElement.current) return;

      try {
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        const result = liquidGL({
          target: '#nav-glass-lens',
          content: false, // Pure DOM HTML content; not rasterized or hidden by WebGL
          snapshot: 'body',
          engine: 'auto',
          resolution: Math.min(2.0, dpr), // Crisp retina optical baseline without memory bloat
          zIndex: 104, // Guarantees positive z-index within fixed nav-header stacking context
          refraction: 0.024, // Refined optical refraction: continuous, artifact-free background displacement
          aberration: 0.14, // Subtle, continuous micro-prism dispersion without jagged chromatic pixelation
          bevelDepth: 0.038, // Smooth convex curvature preventing steep discontinuous offset steps
          bevelWidth: 0.16, // Broad, gentle bevel gradient (~9.6px) eliminating abrupt edge cliffs
          frost: 0, // Crystal clear optical glass
          shadow: false, // Internal liquidGL shader shadow uses noisy dither pattern; smooth drop shadow handled via CSS
          specular: true, // Smooth moving light highlights
          reveal: 'none',
          tilt: false, // Tilt disabled to prevent overwriting custom 3D hover engine
          draggable: true, // Configured per optical baseline
          interaction: 'fluid',
          interactionStrength: 0.45,
          interactionRadius: 2.8,
          interactionViscosity: 0.25,
          magnify: 1.05, // Gentle convex magnification with clear center
          helper: false,
          tint: getTintForTheme(themeRef.current, appearanceRef.current),
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

        // The installed liquid-gl version's internal draggable handler implements free-form page dragging
        // which detaches the lens and prevents child tab button clicks. We disable liquid-gl's unconstrained
        // page drag so the dock's tab-constrained pointer drag and click handling function seamlessly.
        if (lensInstance && typeof lensInstance.setDraggable === 'function') {
          lensInstance.setDraggable(false);
        }

        // Ensure canvas z-index sits directly beneath nav-shell and tabs
        if (lensInstance?.renderer?.canvas) {
          lensInstance.renderer.canvas.style.zIndex = '3';
        }
      } catch (err) {
        console.warn('liquidGL lens initialization fallback to CSS glass:', err);
      }
    });

    // Once document fonts are ready and initial page reveal/loading screen settles (~1000ms),
    // trigger full-document snapshot capture so the hero, project cards, and sections are all in the texture
    const fontsPromise = (typeof document !== 'undefined' && document.fonts) ? document.fonts.ready : Promise.resolve();
    const heroSettleTimer = window.setTimeout(async () => {
      if (isCancelled) return;
      try {
        await fontsPromise;
        if (!isCancelled) {
          await captureFullSnapshot(0);
        }
      } catch (err) {
        console.warn('Hero snapshot capture warning:', err);
      }
    }, 1000);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(initTimer);
      clearTimeout(heroSettleTimer);
      if (liquidLensRef.current) {
        try {
          liquidLensRef.current.destroy();
        } catch {
          // safe cleanup
        }
        liquidLensRef.current = null;
      }
    };
  }, [isMobile, isReducedMotion, captureFullSnapshot]);

  // Immediate, synchronized theme refresh strategy for LiquidGL
  const refreshThemeSnapshot = useCallback(() => {
    if (typeof document === 'undefined') return;

    // 1. Force immediate synchronous DOM attributes and style recalculation
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-appearance', appearance);
    document.documentElement.style.colorScheme = appearance;
    void document.documentElement.offsetHeight; // synchronous layout/style reflow

    if (isMobile) return;

    // 2. Update lens optical tint immediately
    if (liquidLensRef.current && typeof liquidLensRef.current.setTint === 'function') {
      liquidLensRef.current.setTint(getTintForTheme(theme, appearance));
    }

    const renderer = liquidLensRef.current?.renderer as any;
    if (!renderer || renderer._destroyed) return;

    // 3. Increment internal generation counter in liquid-gl
    // This immediately invalidates any currently in-flight capture (so it aborts at line 5806)
    // and causes its finally block (line 5831) to automatically trigger a fresh capture.
    const nextGen = ((renderer._captureGeneration as number) || 0) + 1;
    Reflect.set(renderer, '_captureGeneration', nextGen);
    const currentGeneration = nextGen;

    // 4. If renderer is not currently capturing, start capture immediately
    if (!renderer._capturing) {
      renderer.captureSnapshot()
        .then(() => {
          if (!renderer._destroyed && renderer.render) {
            renderer.render();
          }
        })
        .catch((err: unknown) => {
          console.warn('liquidGL theme snapshot capture warning:', err);
        });
    }

    // 5. Follow-up settle capture after CSS color transitions complete (~450ms)
    // to capture elements that transition smoothly across 420ms
    const settleTimer = window.setTimeout(() => {
      if (!liquidLensRef.current?.renderer) return;
      const r = liquidLensRef.current.renderer as any;
      if (r._destroyed) return;
      if (r._captureGeneration === currentGeneration && !r._capturing) {
        r.captureSnapshot().then(() => {
          if (!r._destroyed && r.render) r.render();
        }).catch(() => {});
      }
    }, 450);

    return () => clearTimeout(settleTimer);
  }, [theme, appearance, isMobile]);

  // Synchronize tint and trigger immediate background snapshot refresh when theme or appearance changes
  useEffect(() => {
    const cleanup = refreshThemeSnapshot();
    return cleanup;
  }, [theme, appearance, refreshThemeSnapshot]);

  // Debounced scroll listener: refreshes background snapshot only after scrolling settles
  // at a controlled, throttled frequency (never per-frame or per-pointer-move)
  useEffect(() => {
    let scrollDebounceTimer: number | null = null;
    const onScrollSettle = () => {
      if (scrollDebounceTimer !== null) {
        window.clearTimeout(scrollDebounceTimer);
      }
      scrollDebounceTimer = window.setTimeout(() => {
        captureFullSnapshot(1500);
      }, 450);
    };

    window.addEventListener('scroll', onScrollSettle, { passive: true });
    window.addEventListener('resize', onScrollSettle, { passive: true });

    return () => {
      if (scrollDebounceTimer !== null) {
        window.clearTimeout(scrollDebounceTimer);
      }
      window.removeEventListener('scroll', onScrollSettle);
      window.removeEventListener('resize', onScrollSettle);
    };
  }, [captureFullSnapshot]);



  // Subtle Cursor-Responsive Motion: reacts subtly to cursor hovering over the active ring
  const handleDockPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    // If mobile, dragging, or pointer is down, drag handler manages motion
    if (isMobile || isPointerDownRef.current || isReducedMotion) return;
    // Desktop hover only (mouse)
    if (e.pointerType !== 'mouse') return;

    const lensEl = lensRefElement.current;
    if (!lensEl) return;

    const rect = lensEl.getBoundingClientRect();
    const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    // Subtle optical response when cursor hovers near or over the active lens
    if (Math.abs(relX) <= 1.4 && Math.abs(relY) <= 1.4) {
      targetHoverXRef.current = Math.max(-2.5, Math.min(2.5, relX * 2.2));
      targetHoverYRef.current = Math.max(-1.8, Math.min(1.8, relY * 1.6));
      targetRotateYRef.current = Math.max(-3.8, Math.min(3.8, relX * 3.5));
      targetRotateXRef.current = Math.max(-3.2, Math.min(3.2, -relY * 3.0));
    } else {
      targetHoverXRef.current = 0;
      targetHoverYRef.current = 0;
      targetRotateXRef.current = 0;
      targetRotateYRef.current = 0;
    }
    wakeTransformLoop();
  };

  const handleDockPointerLeave = () => {
    if (isMobile || isPointerDownRef.current) return;
    targetHoverXRef.current = 0;
    targetHoverYRef.current = 0;
    targetRotateXRef.current = 0;
    targetRotateYRef.current = 0;
    wakeTransformLoop();
  };

  // --- ROBUST DRAG-VS-CLICK INTERACTION HANDLING WITH DYNAMIC SIZING & SCALE RETENTION ---
  const handleDockPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (isMobile || e.button !== 0) return; // Desktop primary pointer button only

    const activePointerId = e.pointerId;
    pointerStartPosRef.current = { x: e.clientX, y: e.clientY };
    isPointerDownRef.current = true;
    hasPassedDragThresholdRef.current = false;
    isDraggingRef.current = false;

    // Phase 2: Start press-and-hold enlargement immediately in the same interaction frame!
    startZoomScale();

    // Measure active tab metrics dynamically
    const currentMetrics = getTabMetrics(activeIndex);
    const currentLeft = lensRefElement.current?.offsetLeft ?? (currentMetrics?.left ?? lensStyle.left);
    dragStartLeftRef.current = currentLeft;
    dragCandidateRef.current = activeIndex;

    const dockBar = dockBarRef.current;
    let rafMoveId: number | null = null;
    let pendingLeft = currentLeft;
    let pendingCandidate = activeIndex;

    const onPointerMove = (moveEvt: PointerEvent) => {
      if (!isPointerDownRef.current) return;

      const deltaX = moveEvt.clientX - pointerStartPosRef.current.x;
      const deltaY = moveEvt.clientY - pointerStartPosRef.current.y;

      // Require 6px horizontal movement threshold before activating drag mode
      if (!hasPassedDragThresholdRef.current) {
        if (Math.abs(deltaX) >= 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
          hasPassedDragThresholdRef.current = true;
          isDraggingRef.current = true;
          setIsDragging(true);

          // Now cancel in-flight horizontal travel animations
          travelAnimRef.current?.cancel();
          travelAnimRef.current = null;
          currentAnimTargetIndexRef.current = null;

          // Acquire pointer capture on the dock bar now that drag is confirmed
          try {
            dockBar?.setPointerCapture(moveEvt.pointerId);
          } catch {
            // safe fallback
          }
        } else {
          // Within click threshold or vertical gesture; do not engage drag
          return;
        }
      }

      // Drag is active: track pointer directly 1:1 and preview closest candidate
      const tabMetricsList = navItems.map((_, i) => getTabMetrics(i));
      const dockRect = dockBar?.getBoundingClientRect();
      const pointerLocalX = dockRect ? moveEvt.clientX - dockRect.left : dragStartLeftRef.current + deltaX;

      let closestIndex = activeIndex;
      let minDistance = Infinity;
      for (let i = 0; i < tabMetricsList.length; i++) {
        const m = tabMetricsList[i];
        if (!m) continue;
        const d = Math.abs(m.center - pointerLocalX);
        if (d < minDistance) {
          minDistance = d;
          closestIndex = i;
        }
      }

      pendingCandidate = closestIndex;
      const minLeft = 4;
      const maxLeft = Math.max(minLeft, (dockBar?.clientWidth ?? 520) - FIXED_LENS_WIDTH - 4);
      pendingLeft = Math.max(minLeft, Math.min(maxLeft, dragStartLeftRef.current + deltaX));

      if (rafMoveId === null) {
        rafMoveId = requestAnimationFrame(() => {
          if (lensRefElement.current) {
            lensRefElement.current.style.left = `${pendingLeft}px`;
            lensRefElement.current.style.setProperty('--lens-left', `${pendingLeft}px`);
            lensRefElement.current.style.width = `${FIXED_LENS_WIDTH}px`;
            lensRefElement.current.style.height = `${FIXED_LENS_HEIGHT}px`;
            lensRefElement.current.style.top = `${FIXED_LENS_TOP}px`;
            // Keep enlarged pressed scale active (1.14×) continuously throughout drag
            lensRefElement.current.style.transform = `perspective(600px) scale(${scaleRef.current.toFixed(3)})`;
          }
          dragCandidateRef.current = pendingCandidate;
          liquidLensRef.current?.updateMetrics();
          rafMoveId = null;
        });
      }
    };

    const cleanupDrag = (isCancelled = false) => {
      if (rafMoveId !== null) {
        cancelAnimationFrame(rafMoveId);
        rafMoveId = null;
      }
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      window.removeEventListener('lostpointercapture', onPointerLost);
      window.removeEventListener('blur', onWindowBlur);

      const didDrag = hasPassedDragThresholdRef.current;
      isPointerDownRef.current = false;
      hasPassedDragThresholdRef.current = false;
      isDraggingRef.current = false;
      setIsDragging(false);

      // Settle zoom scale back to resting 1.0 regardless of click or drag
      settleZoomScale();

      if (didDrag) {
        // Suppress subsequent synthetic click event from this drag release
        didJustDragRef.current = true;
        setTimeout(() => {
          didJustDragRef.current = false;
        }, 150);

        if (!isCancelled) {
          // Completed drag gesture: commit candidate section and launch horizontal spring settle
          const targetIndex = dragCandidateRef.current !== null ? dragCandidateRef.current : activeIndex;
          dragCandidateRef.current = null;

          const targetItem = navItems[targetIndex];
          if (targetItem) {
            beginProgrammaticNav();
            setCommittedSection(targetItem.id);
            animateLensTo(targetIndex, { fromLeft: pendingLeft });
            targetItem.onClick?.();
            window.setTimeout(() => {
              captureFullSnapshot(400);
            }, 750);
          } else {
            animateLensTo(activeIndex, { fromLeft: pendingLeft });
          }
        } else {
          // Cancelled: snap back to current committed active item with spring
          dragCandidateRef.current = null;
          animateLensTo(activeIndex, { fromLeft: pendingLeft });
        }
      }
      // If didDrag was false, this was a click! We do not suppress or animate, letting native button click fire
    };

    const onPointerUp = () => cleanupDrag(false);
    const onPointerCancel = () => cleanupDrag(true);
    const onPointerLost = (evt: PointerEvent) => {
      if (evt.pointerId === activePointerId) {
        cleanupDrag(true);
      }
    };
    const onWindowBlur = () => cleanupDrag(true);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
    window.addEventListener('lostpointercapture', onPointerLost);
    window.addEventListener('blur', onWindowBlur);
  };

  const handleTabClick = (index: number) => {
    // Suppress duplicate click event if a drag just ended
    if (didJustDragRef.current) return;

    const item = navItems[index];
    if (item) {
      beginProgrammaticNav();
      setCommittedSection(item.id);
      if (!isMobile) {
        animateLensTo(index);
      }
      item.onClick?.();
      if (!isMobile) {
        window.setTimeout(() => {
          captureFullSnapshot(400);
        }, 750);
      }
    }
  };

  return (
    <>
      <header className="nav-header" role="banner" data-liquid-ignore="">
        {/* Zero-Lag Full-Viewport Reading Progress Bar */}
        <div
          ref={progressBarRef}
          className="nav-scroll-progress-bar"
          role="progressbar"
          aria-valuenow={0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Page reading scroll progress"
        />

        {/* Main Transparent Dock Container */}
        <div className="nav-shell">
          {/* Centered Liquid-Glass Icon Navigation Bar (6 items: Home, Work, Experience, About, Skills, Contact) */}
          <nav
            id="nav-dock-bar"
            ref={dockBarRef}
            className={`nav-dock-bar nav-entrance-${entranceStage} ${isDragging ? 'is-dragging' : ''}`}
            aria-label="Main Section Navigation"
            role="tablist"
            data-liquid-ignore=""
            onPointerDown={handleDockPointerDown}
            onPointerMove={handleDockPointerMove}
            onPointerLeave={handleDockPointerLeave}
          >
            {/* Outer Translucent Liquid-Glass Dock Surface (Dissolves on Scroll) */}
            <div className="nav-dock-backdrop" aria-hidden="true">
              <div className="nav-dock-backdrop-glass" />
              <div className="nav-dock-backdrop-sweep" />
              <div className="nav-dock-backdrop-border" />
            </div>

            {/* Movable Liquid-Glass Ring Lens (Desktop Only) */}
            {!isMobile && (
              <div
                id="nav-glass-lens"
                ref={lensRefElement}
                className={`nav-glass-lens ${isPressed ? 'is-pressed' : ''} ${isDragging ? 'lens-active-drag' : ''}`}
                style={{
                  left: `${lensStyle.left}px`,
                  top: `${FIXED_LENS_TOP}px`,
                  width: `${FIXED_LENS_WIDTH}px`,
                  height: `${FIXED_LENS_HEIGHT}px`,
                }}
                title="Draggable liquid-glass active indicator"
                aria-hidden="true"
              />
            )}

            {/* 6 Centered Navigation Tabs (Icons above Labels) - Independent, Stable Layout */}
            {navItems.map((item, index) => {
              const currentCommitted = committedSection || activeSection;
              const isCommittedActive = currentCommitted ? currentCommitted === item.id : index === 0;
              const OutlineIcon = item.iconOutline;
              const FilledIcon = item.iconFilled;

              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabsRef.current[index] = el;
                  }}
                  id={`nav-tab-${item.id}`}
                  type="button"
                  role="tab"
                  data-tab-index={index}
                  aria-selected={isCommittedActive}
                  aria-label={item.label}
                  aria-controls={item.id}
                  aria-hidden={entranceStage === 'compact' && index > 0 ? true : undefined}
                  tabIndex={entranceStage === 'compact' && index > 0 ? -1 : (isCommittedActive ? 0 : -1)}
                  className={`nav-dock-tab ${isCommittedActive ? 'tab-active' : ''}`}
                  onClick={() => handleTabClick(index)}
                >
                  <span className="tab-icon-wrap" aria-hidden="true">
                    <span className="tab-icon-circle">
                      <span className="tab-icon-layer tab-icon-outline">
                        <OutlineIcon className="tab-icon" />
                      </span>
                      <span className="tab-icon-layer tab-icon-filled">
                        <FilledIcon className="tab-icon" />
                      </span>
                    </span>
                  </span>
                  <span className="tab-label">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Floating Developer Terminal Trigger (Desktop only > 860px) */}
      {!isMobile && (
        <button
          type="button"
          id="terminal-floating-trigger"
          className={`terminal-floating-trigger font-mono nav-entrance-${entranceStage}`}
          onClick={onTerminalClick}
          aria-label="Open Interactive Developer Terminal (`)"
          title="Open Interactive Terminal (`)"
          data-liquid-ignore=""
        >
          <span className="term-icon" aria-hidden="true">&gt;_</span>
          <span className="term-label">TERMINAL</span>
          <kbd className="term-shortcut" aria-hidden="true">`</kbd>
        </button>
      )}
    </>
  );
};

export default Navigation;
