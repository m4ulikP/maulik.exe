import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgress } from './components/ScrollProgress';
import { BackToTop } from './components/BackToTop';
import { PageLoader } from './components/PageLoader';

import { NotFound } from './components/NotFound';

const PdfViewerModal = lazy(() =>
  import('./components/PdfViewerModal').then((mod) => ({ default: mod.PdfViewerModal }))
);

const getInitialTheme = (): 'paper' | 'cyber-contrast' => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('maulik_theme_pref');
      if (saved === 'cyber-contrast' || saved === 'paper') {
        return saved;
      }
      const attr = document.documentElement.getAttribute('data-theme');
      if (attr === 'cyber-contrast' || attr === 'paper') {
        return attr;
      }
    } catch {
      // Safe fallback if localStorage is blocked
    }
  }
  return 'paper';
};

const isHomeRoutePath = (pathname: string): boolean => {
  return (
    pathname === '/' ||
    pathname === '' ||
    pathname === '/index.html' ||
    pathname.startsWith('/#')
  );
};

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'paper' | 'cyber-contrast'>(getInitialTheme);
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  const isHomeRoute = isHomeRoutePath(currentPath);

  // Route resolution happens before deciding whether to display the loading animation.
  // 404 routes bypass the loader entirely.
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return isHomeRoutePath(window.location.pathname);
    }
    return true;
  });

  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [activePdfUrl, setActivePdfUrl] = useState<string>('/resume.pdf');
  const [activePdfTitle, setActivePdfTitle] = useState<string>('RESUME — MAULIK PANDEY [PDF]');

  // Sync theme with html data-theme and persist to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('maulik_theme_pref', theme);
    } catch {
      // Ignore quota/private mode errors
    }
  }, [theme]);

  // Sync theme changes across browser tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'maulik_theme_pref' && (e.newValue === 'paper' || e.newValue === 'cyber-contrast')) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen to browser history changes for client-side route tracking
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Scroll Reveal Observer & Failsafe System
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const selector =
      '.section-marker, .surface-card:not(.hero-brand-block), .ledger-wrapper, .courses-card';

    // Respect prefers-reduced-motion: reveal all immediately without hiding
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll(selector).forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      // If IntersectionObserver is unavailable, keep everything 100% visible
      return;
    }

    document.documentElement.classList.add('reveal-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '100px 0px 50px 0px',
      }
    );

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => observer.observe(el));

    // Immediate viewport & restoration check
    const revealVisible = () => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      document.querySelectorAll(selector).forEach((el) => {
        if (el.classList.contains('is-revealed')) return;
        const rect = el.getBoundingClientRect();
        // If element is already in view or scrolled past, reveal immediately
        if (rect.top < viewportHeight + 100 && rect.bottom > -100) {
          el.classList.add('is-revealed');
          observer.unobserve(el);
        }
      });
    };

    // Run immediately after layout
    revealVisible();
    requestAnimationFrame(revealVisible);

    // Direct URL hash navigation handling (e.g., #about, #experience)
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const targetSection = document.querySelector(hash);
        if (targetSection) {
          targetSection.querySelectorAll(selector).forEach((el) => {
            el.classList.add('is-revealed');
            observer.unobserve(el);
          });
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);

    // Passive scroll & resize listeners for high-speed scrolling or viewport orientation changes
    window.addEventListener('scroll', revealVisible, { passive: true });
    window.addEventListener('resize', revealVisible, { passive: true });

    // Safety fallback timers: guarantee zero stuck elements
    const timer1 = setTimeout(revealVisible, 400);
    const timer2 = setTimeout(() => {
      document.querySelectorAll(selector).forEach((el) => el.classList.add('is-revealed'));
    }, 2000);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('scroll', revealVisible);
      window.removeEventListener('resize', revealVisible);
      clearTimeout(timer1);
      clearTimeout(timer2);
      document.documentElement.classList.remove('reveal-ready');
    };
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'paper' ? 'cyber-contrast' : 'paper'));
  };

  const handleOpenPdf = (url: string = '/resume.pdf', title: string = 'RESUME — MAULIK PANDEY [PDF]') => {
    setActivePdfUrl(url);
    setActivePdfTitle(title);
    setIsPdfModalOpen(true);
  };

  if (!isHomeRoute) {
    return (
      <div className="app-root" aria-busy={false}>
        <CustomCursor />
        <NotFound
          onNavigateHome={() => {
            window.history.pushState({}, '', '/');
            setCurrentPath('/');
          }}
          currentTheme={theme}
          onToggleTheme={handleToggleTheme}
        />
      </div>
    );
  }

  return (
    <div className="app-root" aria-busy={isLoading}>
      {isLoading && isHomeRoute && (
        <PageLoader
          currentTheme={theme}
          onComplete={() => setIsLoading(false)}
        />
      )}

      {/* Themed Scroll Progress Bar */}
      <ScrollProgress />

      {/* Custom Neo-Brutalist Cursor */}
      <CustomCursor />

      {/* Skip to Main Content Link for Accessibility */}
      <a href="#main-content" className="skip-link font-mono">
        Skip to main content
      </a>

      {/* Main Navigation */}
      <Navbar
        currentTheme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenResume={() => handleOpenPdf('/resume.pdf')}
      />

      {/* Primary Semantic Container */}
      <main id="main-content" tabIndex={-1}>
        <Hero onOpenResume={() => handleOpenPdf('/resume.pdf')} />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>

      {/* Footer */}
      <Footer onOpenResume={() => handleOpenPdf('/resume.pdf')} />

      {/* Themed Floating Back-To-Top Button */}
      <BackToTop />

      {/* Custom PDF Viewer Modal */}
      {isPdfModalOpen && (
        <Suspense fallback={null}>
          <PdfViewerModal
            isOpen={isPdfModalOpen}
            pdfUrl={activePdfUrl}
            title={activePdfTitle}
            onClose={() => setIsPdfModalOpen(false)}
          />
        </Suspense>
      )}

      <style>{`
        .skip-link {
          position: fixed;
          top: calc(88px + 0.75rem);
          left: clamp(0.75rem, 2vw, 1.25rem);
          max-width: calc(100vw - 1.5rem);
          background-color: var(--accent-highlight);
          color: var(--color-on-accent);
          padding: 0.65rem 1.25rem;
          border: var(--border-width-md) solid var(--border-color-default);
          box-shadow: 4px 4px 0px var(--color-ink);
          z-index: 10001;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.04em;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transform: translateY(calc(-100% - 88px - 1.5rem));
          opacity: 0;
          pointer-events: none;
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.18s ease;
          box-sizing: border-box;
        }

        .skip-link:focus,
        .skip-link:focus-visible {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
          outline: 3px solid var(--raw-cobalt-blue);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .skip-link {
            transition: none !important;
          }
        }

        main#main-content {
          outline: none;
          scroll-margin-top: calc(88px + 1rem);
        }
      `}</style>
    </div>
  );
};

export default App;
