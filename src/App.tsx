import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { Navigation, type ThemeId } from './components/Navigation';
import { EditorialHero } from './components/EditorialHero';
import { ProjectsSection } from './components/ProjectsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { NotFoundPage } from './components/NotFoundPage';
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { GlassRibbonScrollCanvas } from './components/GlassRibbonScrollCanvas';
import type { AppearanceMode } from './types/theme';

const THEME_STORAGE_KEY = 'maulik_theme_pref';
const APPEARANCE_STORAGE_KEY = 'maulik_appearance_pref';
const MOTION_STORAGE_KEY = 'maulik_motion_pref';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  });

  // Appearance mode state ('light' | 'dark') with OS preference detection and safe persistence
  const [appearance, setAppearance] = useState<AppearanceMode>(() => {
    if (typeof window === 'undefined') return 'dark';
    try {
      const saved = localStorage.getItem(APPEARANCE_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
      // First visit: respect operating system's color-scheme preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    } catch {
      // Storage unavailable (restricted iframe or private browsing)
    }
    return 'dark';
  });

  // Theme preference state with safe localStorage persistence
  const [theme, setTheme] = useState<ThemeId>(() => {
    if (typeof window === 'undefined') return 'obsidian';
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'obsidian' || saved === 'amber' || saved === 'midnight') {
        return saved;
      }
    } catch {
      // Storage unavailable (restricted iframe or private browsing)
    }
    return 'obsidian';
  });

  // System OS reduced-motion media query listener
  const [systemReducedMotion, setSystemReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // User-explicit motion override: 'default' | 'reduced' | 'full'
  const [userMotionPref, setUserMotionPref] = useState<'default' | 'reduced' | 'full'>(() => {
    if (typeof window === 'undefined') return 'default';
    try {
      const saved = localStorage.getItem(MOTION_STORAGE_KEY);
      if (saved === 'reduced' || saved === 'full') {
        return saved;
      }
    } catch {
      // Storage unavailable
    }
    return 'default';
  });

  // Effective reduced-motion state: system preference takes absolute precedence
  const isReducedMotion = systemReducedMotion || userMotionPref === 'reduced';

  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<string | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);

  // Sync system reduced-motion changes live
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setSystemReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  // Sync appearance to root DOM attribute and persist synchronously before child effects
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-appearance', appearance);
    document.documentElement.style.colorScheme = appearance;
    try {
      localStorage.setItem(APPEARANCE_STORAGE_KEY, appearance);
    } catch {
      // Storage unavailable
    }
  }, [appearance]);

  // Sync theme to root DOM attribute and persist synchronously before child effects
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage unavailable
    }
  }, [theme]);

  // Sync reduced-motion DOM attribute to root
  useLayoutEffect(() => {
    if (isReducedMotion) {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    } else {
      document.documentElement.removeAttribute('data-reduced-motion');
    }
  }, [isReducedMotion]);

  const handleToggleAppearance = useCallback(() => {
    setAppearance((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-appearance', next);
      document.documentElement.style.colorScheme = next;
      return next;
    });
  }, []);

  const handleThemeChange = useCallback((newTheme: ThemeId) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
  }, []);

  const handleToggleMotion = () => {
    if (systemReducedMotion) return; // System preference is locked
    const nextPref = isReducedMotion ? 'full' : 'reduced';
    setUserMotionPref(nextPref);
    try {
      localStorage.setItem(MOTION_STORAGE_KEY, nextPref);
    } catch {
      // Storage unavailable
    }
  };

  // Listen to popstate for URL navigation (e.g. 404 or back)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Listen to keyboard shortcut (backtick `) to toggle interactive terminal (Desktop only > 860px)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (e.key === '`' && !isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (typeof window !== 'undefined' && window.innerWidth <= 860) return;
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Ensure terminal closes automatically if viewport is resized down to mobile (<= 860px)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth <= 860 && isTerminalOpen) {
        setIsTerminalOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isTerminalOpen]);

  // Synchronize active section with the section currently visible while scrolling
  useEffect(() => {
    if (currentPath !== '/' && currentPath !== '') return;

    const sections = ['home', 'work', 'experience', 'about', 'skills', 'contact'];
    const sectionElements = sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const checkActiveSection = () => {
      const scrollY = window.scrollY;
      const scrollBottom = window.innerHeight + scrollY;
      const docHeight = document.documentElement.scrollHeight;

      // At bottom of page -> contact
      if (scrollBottom >= docHeight - 70) {
        setActiveSection('contact');
        return;
      }

      // In Hero / above work section -> home
      const workEl = document.getElementById('work');
      if (workEl && scrollY < workEl.offsetTop - 280) {
        setActiveSection('home');
        return;
      }

      // Check section crossing the reading focus band (~35% down viewport)
      const viewportMid = scrollY + window.innerHeight * 0.35;
      for (const el of sectionElements) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (viewportMid >= top && viewportMid < top + height) {
          setActiveSection(el.id);
          return;
        }
      }
    };

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          checkActiveSection();
          rafId = null;
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    checkActiveSection();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [currentPath]);

  const scrollTo = (id: string) => {
    if (id === 'home' || id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToRoot = () => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if current route is 404
  const is404 = currentPath !== '/' && currentPath !== '' && currentPath !== '/index.html';

  if (is404) {
    return (
      <div className="app-root">
        <CustomCursor isReducedMotion={isReducedMotion} />
        <NotFoundPage onHomeClick={navigateToRoot} />
      </div>
    );
  }

  return (
    <div className="app-root">
      {/* Precision Custom Cursor for fine-pointer devices */}
      <CustomCursor isReducedMotion={isReducedMotion} />

      {/* Persistent Subtle Site-Wide Background Glass Ribbon Canvas */}
      <GlassRibbonScrollCanvas isReducedMotion={isReducedMotion} />

      {/* Skip to Content Link for Keyboard Accessibility */}
      <a href="#main-content" className="sr-only focus-skip-link" data-liquid-ignore="true">
        Skip to main content
      </a>

      {/* Editorial Header Navigation with Active State & Scroll Progress */}
      <Navigation
        activeSection={activeSection}
        onHomeClick={() => scrollTo('home')}
        onWorkClick={() => scrollTo('work')}
        onExperienceClick={() => scrollTo('experience')}
        onAboutClick={() => scrollTo('about')}
        onSkillsClick={() => scrollTo('skills')}
        onContactClick={() => scrollTo('contact')}
        onTerminalClick={() => {
          if (typeof window !== 'undefined' && window.innerWidth <= 860) return;
          setIsTerminalOpen(true);
        }}
        theme={theme}
        onThemeChange={handleThemeChange}
        appearance={appearance}
        isReducedMotion={isReducedMotion}
        systemReducedMotion={systemReducedMotion}
        onToggleMotion={handleToggleMotion}
        isReady={true}
      />

      {/* Main Portfolio Sections */}
      <main id="main-content">
        {/* Centered Name-First Hero with Animated 2D Systems Geometry */}
        <EditorialHero
          onExploreClick={() => scrollTo('work')}
          onAboutClick={() => scrollTo('about')}
          isReducedMotion={isReducedMotion}
          theme={theme}
          isReady={true}
        />

        {/* 01. Projects & Deep-Dive Case Studies */}
        <ProjectsSection
          selectedProjectId={selectedCaseStudyId}
          onSelectProject={(id) => setSelectedCaseStudyId(id)}
          isReducedMotion={isReducedMotion}
        />

        {/* 02. Verified Work Experience (FlyRank AI) */}
        <ExperienceSection
          isReducedMotion={isReducedMotion}
          theme={theme}
          appearance={appearance}
          isReady={true}
        />

        {/* 03. About Maulik Pandey */}
        <AboutSection isReducedMotion={isReducedMotion} />

        {/* 04. Technical Skills & Engineering Toolchain */}
        <SkillsSection
          onSelectProject={(id) => {
            setSelectedCaseStudyId(id);
            const workEl = document.getElementById('work');
            if (workEl) workEl.scrollIntoView({ behavior: 'smooth' });
          }}
          onNavToSection={(sectionId) => scrollTo(sectionId)}
          isReducedMotion={isReducedMotion}
        />

        {/* 05. Resume Download & Direct Contact */}
        <ContactSection
          isReducedMotion={isReducedMotion}
          theme={theme}
          appearance={appearance}
          isReady={true}
        />
      </main>

      {/* Site Footer with Integrated Theme & Motion Appearance Controls */}
      <Footer
        onNavClick={(id) => scrollTo(id)}
        theme={theme}
        onThemeChange={handleThemeChange}
        appearance={appearance}
        onToggleAppearance={handleToggleAppearance}
        isReducedMotion={isReducedMotion}
        systemReducedMotion={systemReducedMotion}
        onToggleMotion={handleToggleMotion}
      />

      {/* Minimalist Interactive Developer Terminal Overlay */}
      <InteractiveTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onSelectProject={(id) => {
          setSelectedCaseStudyId(id);
          scrollTo('work');
        }}
        onNavToSection={(sectionId) => scrollTo(sectionId)}
        theme={theme}
        isReducedMotion={isReducedMotion}
      />
    </div>
  );
}

export default App;
