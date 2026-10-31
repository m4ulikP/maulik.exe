import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, SunMoon, Menu, X, ArrowUpRight } from 'lucide-react';
import { playTactileClick, playSwitchTone, setSoundEnabled, isSoundEnabled } from '../utils/sound';

interface NavbarProps {
  currentTheme: 'paper' | 'cyber-contrast';
  onToggleTheme: () => void;
  onOpenResume?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTheme,
  onToggleTheme,
  onOpenResume,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const [activeSection, setActiveSection] = useState<string>('');

  const mobileToggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const mobileDrawerRef = useRef<HTMLDivElement | null>(null);

  // Lock body scroll, listen to Escape, and manage focus when mobile drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the first actionable element in drawer
    const focusableElements = mobileDrawerRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      } else if (e.key === 'Tab' && mobileDrawerRef.current) {
        // Simple focus trap inside mobile drawer
        const focusables = Array.from(
          mobileDrawerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const toggleBtn = mobileToggleBtnRef.current;

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      // Return focus to mobile toggle button upon closing
      toggleBtn?.focus();
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const sectionIds = ['about', 'experience', 'projects', 'skills', 'contact'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0,
      }
    );

    sections.forEach((sec) => observer.observe(sec));

    const checkScroll = () => {
      if (window.scrollY < 200) {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', checkScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkScroll);
    };
  }, []);

  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) {
      setTimeout(() => playSwitchTone(true), 50);
    }
  };

  const navLinks = [
    { label: '01. ABOUT', href: '#about' },
    { label: '02. EXPERIENCE', href: '#experience' },
    { label: '03. PROJECTS', href: '#projects' },
    { label: '04. SKILLS', href: '#skills' },
    { label: '05. CONTACT', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    playTactileClick();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element
        .querySelectorAll('.section-marker, .surface-card, .ledger-wrapper, .courses-card')
        .forEach((el) => el.classList.add('is-revealed'));
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="site-header" role="banner">
      {/* Top Status & Focus Ticker Ribbon */}
      <div className="ticker-ribbon font-mono">
        <div className="ticker-inner">
          <span className="ticker-item highlight">
            STATUS: OPEN TO OPPORTUNITIES
          </span>
          <span className="ticker-separator">—</span>
          <span className="ticker-item">SOFTWARE DEVELOPER // BACKEND &amp; AI</span>
          <span className="ticker-separator">—</span>
          <span className="ticker-item">LOCATED IN INDIA</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="nav-container">
        <div className="nav-wrapper">
          {/* Brand Logo & Name */}
          <a
            href="#"
            className="brand-logo"
            aria-label="MAULIK PANDEY — Homepage"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              playTactileClick();
            }}
          >
            <span className="logo-badge" aria-hidden="true">M_</span>
            <span className="logo-text-wrap">
              <span className="logo-text">MAULIK PANDEY</span>
              <span className="logo-underline" aria-hidden="true" />
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link font-mono ${activeSection === link.href ? 'is-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Controls & Quick Actions */}
          <div className="nav-controls">
            {/* Audio Toggle */}
            <button
              type="button"
              className={`ctrl-btn ${soundOn ? 'active' : ''}`}
              onClick={handleToggleSound}
              title={soundOn ? 'Mute tactile sound' : 'Enable tactile audio clicks'}
              aria-label={soundOn ? 'Sound enabled' : 'Sound disabled'}
            >
              {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span className="ctrl-text font-mono">{soundOn ? 'AUDIO:ON' : 'AUDIO:OFF'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              className="ctrl-btn"
              onClick={() => {
                playTactileClick();
                onToggleTheme();
              }}
              title="Toggle Paper / Cyber theme"
              aria-label="Toggle theme"
            >
              <SunMoon size={16} />
              <span className="ctrl-text font-mono">
                {currentTheme === 'paper' ? 'THEME:PAPER' : 'THEME:CYBER'}
              </span>
            </button>

            {/* Primary CTA */}
            <a
              href="#contact"
              className="btn-brutal btn-primary nav-cta"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
            >
              <span>GET IN TOUCH</span>
              <ArrowUpRight size={15} />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              ref={mobileToggleBtnRef}
              type="button"
              className="mobile-toggle-btn"
              onClick={() => {
                playTactileClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div ref={mobileDrawerRef} className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
          <div className="mobile-drawer-header font-mono">
            <span>// NAVIGATION_INDEX</span>
            <button
              type="button"
              className="mobile-close-btn"
              onClick={() => {
                playTactileClick();
                setMobileMenuOpen(false);
              }}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="mobile-nav-links">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`mobile-nav-link font-mono ${activeSection === link.href ? 'is-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
              >
                <span>{link.label}</span>
                <ArrowUpRight size={18} />
              </a>
            ))}
          </nav>
          <div className="mobile-drawer-footer">
            <div className="mobile-actions-row">
              <button
                type="button"
                className="btn-brutal"
                onClick={handleToggleSound}
              >
                {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span>{soundOn ? 'SOUND ON' : 'SOUND OFF'}</span>
              </button>
              <button
                type="button"
                className="btn-brutal"
                onClick={onToggleTheme}
              >
                <SunMoon size={16} />
                <span>{currentTheme === 'paper' ? 'CYBER THEME' : 'PAPER THEME'}</span>
              </button>
            </div>
            {onOpenResume && (
              <button
                type="button"
                className="btn-brutal w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
              >
                <span>VIEW RESUME [PDF]</span>
                <ArrowUpRight size={16} />
              </button>
            )}
            <a
              href="#contact"
              className="btn-brutal btn-primary w-full"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
            >
              <span>GET IN TOUCH</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      )}

      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background-color: var(--bg-app);
          border-bottom: var(--border-width-md) solid var(--border-color-default);
        }

        .ticker-ribbon {
          background-color: var(--bg-header-contrast);
          color: var(--color-header-text);
          font-size: 0.72rem;
          padding: 0.35rem 1rem;
          overflow: hidden;
          white-space: nowrap;
          border-bottom: 1.5px solid var(--border-color-default);
        }

        .ticker-inner {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          animation: tickerScroll 45s linear infinite;
        }

        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-35%); }
        }

        .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          letter-spacing: 0.05em;
        }

        .ticker-item.highlight {
          color: var(--accent-highlight);
          font-weight: 700;
        }

        .ticker-separator {
          color: var(--color-text-muted);
          user-select: none;
        }

        .nav-container {
          max-width: var(--max-content-width);
          margin-inline: auto;
          padding: 0.6rem 1.25rem;
        }

        .nav-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-family: var(--font-display);
          font-weight: 800;
          color: var(--color-text-primary);
          text-decoration: none;
          cursor: pointer;
          outline: none;
          border-radius: var(--radius-subtle);
          padding: 0.2rem 0.25rem;
          margin: -0.2rem -0.25rem;
          transition: outline-color 0.15s ease;
        }

        /* Focus feedback for keyboard navigation */
        .brand-logo:focus-visible {
          outline: var(--focus-ring);
          outline-offset: 3px;
        }

        /* Logo Badge: Acid-lime square M_ with tactile downward movement & shadow adjustment */
        .logo-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: var(--accent-highlight);
          color: var(--color-on-accent);
          font-family: var(--font-mono);
          font-weight: 900;
          font-size: 0.9rem;
          padding: 0.25rem 0.5rem;
          border: var(--border-width-sm) solid var(--border-color-default);
          box-shadow: 2px 2px 0px var(--color-ink);
          transform: translateY(0);
          transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.18s ease;
          user-select: none;
          flex-shrink: 0;
        }

        /* Logo Text Wrap with Left-to-Right Animated Underline */
        .logo-text-wrap {
          display: inline-flex;
          flex-direction: column;
          position: relative;
        }

        .logo-text {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--color-text-primary);
          transition: color 0.18s ease;
          white-space: nowrap;
        }

        .logo-underline {
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--accent-action);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1),
                      background-color 0.18s ease;
          pointer-events: none;
        }

        [data-theme='cyber-contrast'] .logo-underline {
          background-color: var(--accent-highlight);
        }

        /* Brand Area Hover Interactions (Touch-safe via media hover or active focus) */
        @media (hover: hover) {
          .brand-logo:hover .logo-badge {
            transform: translateY(2px);
            box-shadow: 0px 0px 0px var(--color-ink);
            border-color: var(--border-color-default);
          }

          .brand-logo:hover .logo-text {
            color: var(--color-text-accent);
          }

          [data-theme='cyber-contrast'] .brand-logo:hover .logo-text {
            color: var(--color-text-primary);
            text-shadow: 0 0 12px rgba(223, 255, 0, 0.25);
          }

          .brand-logo:hover .logo-underline {
            transform: scaleX(1);
          }
        }

        /* Keyboard Focus triggers the same visual polish */
        .brand-logo:focus-visible .logo-badge {
          transform: translateY(2px);
          box-shadow: 0px 0px 0px var(--color-ink);
        }

        .brand-logo:focus-visible .logo-text {
          color: var(--color-text-accent);
        }

        .brand-logo:focus-visible .logo-underline {
          transform: scaleX(1);
        }

        /* Reduced motion accessibility */
        @media (prefers-reduced-motion: reduce) {
          .logo-badge,
          .logo-text,
          .logo-underline {
            transition: none !important;
          }

          .brand-logo:hover .logo-badge,
          .brand-logo:focus-visible .logo-badge {
            transform: none !important;
          }
        }



        .desktop-nav {
          display: none;
          align-items: center;
          gap: 1.5rem;
        }

        @media (min-width: 992px) {
          .desktop-nav {
            display: flex;
          }
        }

        .nav-link {
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 0.3rem 0.5rem;
          position: relative;
          color: var(--color-text-secondary);
          transition: var(--transition-tactile);
        }

        .nav-link:hover,
        .nav-link.is-active {
          color: var(--color-on-accent);
          background-color: var(--accent-highlight);
          box-shadow: 2px 2px 0px var(--color-ink);
        }

        .nav-controls {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .ctrl-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--bg-surface-secondary);
          border: var(--border-width-sm) solid var(--border-color-default);
          padding: 0.4rem 0.6rem;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-text-primary);
          box-shadow: var(--shadow-hard-xs);
          transition: var(--transition-tactile);
        }

        .ctrl-btn:hover {
          background-color: var(--bg-surface-tertiary);
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0px var(--color-ink);
        }

        .ctrl-btn:active {
          transform: translate(1px, 1px);
          box-shadow: 0px 0px 0px transparent;
        }

        .ctrl-btn.active {
          background-color: var(--accent-highlight);
          color: var(--color-on-accent);
        }

        .ctrl-text {
          display: none;
        }

        @media (min-width: 1100px) {
          .ctrl-text {
            display: inline-block;
          }
        }

        .nav-cta {
          display: none;
          padding: 0.45rem 0.9rem;
          font-size: 0.8rem;
        }

        @media (min-width: 768px) {
          .nav-cta {
            display: inline-flex;
          }
        }

        .mobile-toggle-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.4rem;
          background: var(--bg-surface);
          border: var(--border-width-sm) solid var(--border-color-default);
          box-shadow: var(--shadow-hard-xs);
          cursor: pointer;
          color: var(--color-text-primary);
        }

        @media (min-width: 992px) {
          .mobile-toggle-btn {
            display: none;
          }
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--bg-app);
          z-index: 2000;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          border-bottom: var(--border-width-lg) solid var(--border-color-default);
        }

        .mobile-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1rem;
          border-bottom: var(--border-width-md) solid var(--border-color-default);
          font-weight: 700;
        }

        .mobile-close-btn {
          background: var(--bg-surface);
          color: var(--color-text-primary);
          border: var(--border-width-sm) solid var(--border-color-default);
          padding: 0.35rem;
          cursor: pointer;
          box-shadow: var(--shadow-hard-xs);
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 2rem;
          flex: 1;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: var(--bg-surface);
          color: var(--color-text-primary);
          border: var(--border-width-md) solid var(--border-color-default);
          box-shadow: var(--shadow-hard-sm);
          font-size: 1.1rem;
          font-weight: 700;
        }

        .mobile-nav-link.is-active {
          background-color: var(--accent-highlight);
          color: var(--color-on-accent);
          box-shadow: var(--shadow-hard-md);
        }

        .mobile-nav-link:active {
          transform: translate(2px, 2px);
          box-shadow: none;
        }

        .mobile-drawer-footer {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: var(--border-width-md) solid var(--border-color-default);
        }

        .mobile-actions-row {
          display: flex;
          gap: 0.75rem;
        }

        .mobile-actions-row button {
          flex: 1;
        }

        .w-full {
          width: 100%;
        }
        @media (max-width: 480px) {
          .nav-container {
            padding: 0.5rem 0.75rem;
          }
          .nav-wrapper {
            gap: 0.5rem;
          }
          .brand-logo {
            gap: 0.45rem;
          }
          .logo-text {
            font-size: 1rem;
          }
          .nav-controls {
            gap: 0.35rem;
          }
          .ctrl-btn {
            padding: 0.35rem 0.45rem;
          }
          .mobile-toggle-btn {
            padding: 0.35rem;
          }
        }

        @media (max-width: 360px) {
          .nav-container {
            padding: 0.45rem 0.5rem;
          }
          .logo-badge {
            padding: 0.2rem 0.35rem;
            font-size: 0.8rem;
          }
          .logo-text {
            font-size: 0.88rem;
          }
        }
      `}</style>
    </header>
  );
};
