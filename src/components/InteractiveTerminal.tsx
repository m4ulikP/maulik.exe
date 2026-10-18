import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './InteractiveTerminal.css';

export interface InteractiveTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (projectId: string) => void;
  onNavToSection?: (sectionId: string) => void;
  theme?: string;
  isReducedMotion?: boolean;
}

interface OutputEntry {
  id: string;
  command?: string;
  type: 'welcome' | 'command' | 'response' | 'error' | 'success';
  content: React.ReactNode;
}

const SUPPORTED_COMMANDS = [
  'help',
  'about',
  'whoami',
  'projects',
  'open aegis3d',
  'open outreach-os',
  'open outreachos',
  'open flyrank',
  'experience',
  'skills',
  'contact',
  'resume',
  'github',
  'history',
  'clear',
  'exit',
] as const;

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onNavToSection,
  isReducedMotion = false,
}) => {
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandCount, setCommandCount] = useState<number>(0);
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(0);

  // Animation & Rendering State Machine
  const [isRendered, setIsRendered] = useState<boolean>(isOpen);
  const [prevIsOpen, setPrevIsOpen] = useState<boolean>(isOpen);
  const [animPhase, setAnimPhase] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle');

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen && !isRendered) {
      setIsRendered(true);
    }
  }

  const inputRef = useRef<HTMLInputElement | null>(null);
  const terminalBodyRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  const contentWrapRef = useRef<HTMLDivElement | null>(null);
  const activeAnimationsRef = useRef<Animation[]>([]);
  const isClosingRef = useRef<boolean>(false);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Initial welcome message lines
  const initialOutputs = useMemo<OutputEntry[]>(() => {
    return [
      {
        id: 'welcome-banner',
        type: 'welcome',
        content: (
          <div className="term-welcome-block font-mono">
            <pre className="term-ascii-art" aria-hidden="true">
{` __  __    _   _   _ _     ___ _  __
|  \\/  |  /_\\ | | | | |   |_ _| |/ /
| |\\/| | / _ \\| |_| | |__  | || ' < 
|_|  |_|/_/ \\_\\\\___/|____|___|_|\\_\\`}
            </pre>
            <div className="term-welcome-meta">
              <span className="term-tagline">Backend & Systems Engineering · Applied AI</span>
              <p className="term-welcome-greeting">
                Welcome to MAULIK.EXE. Enter a command or click directives to explore systems and evidence.
              </p>
              <div className="term-example-commands">
                <span className="term-example-label">Example commands:</span>
                <div className="term-example-list">
                  <div className="term-example-row">
                    <span className="term-example-cmd">help</span>
                    <span className="term-example-desc">— list all available directives</span>
                  </div>
                  <div className="term-example-row">
                    <span className="term-example-cmd">projects</span>
                    <span className="term-example-desc">— explore verified engineering projects</span>
                  </div>
                  <div className="term-example-row">
                    <span className="term-example-cmd">skills</span>
                    <span className="term-example-desc">— view technical skills and knowledge graph</span>
                  </div>
                  <div className="term-example-row">
                    <span className="term-example-cmd">contact</span>
                    <span className="term-example-desc">— get verified communication channels</span>
                  </div>
                </div>
              </div>
              <span className="term-welcome-sub">
                Tab to autocomplete · ↑↓ for command history · click any directive on the right.
              </span>
            </div>
          </div>
        ),
      },
    ];
  }, []);

  const [outputs, setOutputs] = useState<OutputEntry[]>(initialOutputs);

  // Smooth Morphing Open Animation (originates dynamically from launcher button)
  const runOpenAnimation = useCallback(() => {
    const frame = modalContainerRef.current;
    const backdrop = backdropRef.current;
    const content = contentWrapRef.current;
    if (!frame || !backdrop) return;

    activeAnimationsRef.current.forEach((a) => a.cancel());
    activeAnimationsRef.current = [];
    isClosingRef.current = false;
    setAnimPhase('opening');

    if (isReducedMotion) {
      const anim = frame.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 120, easing: 'ease-out', fill: 'forwards' }
      );
      activeAnimationsRef.current.push(anim);
      anim.onfinish = () => {
        setAnimPhase('open');
        inputRef.current?.focus();
      };
      return;
    }

    const launcher =
      document.getElementById('terminal-floating-trigger') ||
      (document.querySelector('.terminal-floating-trigger') as HTMLElement | null);
    const launcherRect = launcher?.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();

    let deltaX = 0;
    let deltaY = 0;
    let scaleX = 0.5;
    let scaleY = 0.5;

    if (launcherRect && launcherRect.width > 0 && frameRect.width > 0) {
      const launcherCenterX = launcherRect.left + launcherRect.width / 2;
      const launcherCenterY = launcherRect.top + launcherRect.height / 2;
      const frameCenterX = frameRect.left + frameRect.width / 2;
      const frameCenterY = frameRect.top + frameRect.height / 2;
      deltaX = launcherCenterX - frameCenterX;
      deltaY = launcherCenterY - frameCenterY;
      scaleX = Math.max(0.06, launcherRect.width / frameRect.width);
      scaleY = Math.max(0.03, launcherRect.height / frameRect.height);
    } else {
      deltaX = window.innerWidth / 2 - 100;
      deltaY = window.innerHeight / 2 - 80;
      scaleX = 0.55;
      scaleY = 0.55;
    }

    // 1. Backdrop fade in
    const backdropAnim = backdrop.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 320, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
    );

    // 2. Fluid morphing expansion of obsidian glass frame (350ms, spring-like settle)
    const frameAnim = frame.animate(
      [
        {
          transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})`,
          borderRadius: '9999px',
          opacity: 0.65,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.65), 0 0 16px rgba(52, 211, 153, 0.22)'
        },
        {
          transform: 'translate3d(0, 0, 0) scale(1, 1)',
          borderRadius: '16px',
          opacity: 1,
          boxShadow: '0 32px 80px -16px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.04) inset, inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.22), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.4), inset 0 0 24px rgba(52, 211, 153, 0.03)'
        }
      ],
      {
        duration: 350,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards'
      }
    );

    // 3. Inner content fades in cleanly without text stretching
    if (content) {
      const contentAnim = content.animate(
        [
          { opacity: 0, transform: 'scale(0.97)' },
          { opacity: 0, offset: 0.32 },
          { opacity: 1, transform: 'scale(1)' }
        ],
        {
          duration: 350,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'forwards'
        }
      );
      activeAnimationsRef.current.push(contentAnim);
    }

    activeAnimationsRef.current.push(backdropAnim, frameAnim);

    frameAnim.onfinish = () => {
      setAnimPhase('open');
      if (inputRef.current) {
        inputRef.current.focus();
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      }
    };
  }, [isReducedMotion]);

  // Reverse Closing Morph Animation (smooth contraction into launcher button)
  const runCloseAnimation = useCallback((onFinishedCallback?: () => void) => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setAnimPhase('closing');

    const frame = modalContainerRef.current;
    const backdrop = backdropRef.current;
    const content = contentWrapRef.current;

    const cleanup = () => {
      isClosingRef.current = false;
      setIsRendered(false);
      setAnimPhase('idle');
      onFinishedCallback?.();
      onClose();
      // Restore focus to launcher trigger
      const launcher =
        document.getElementById('terminal-floating-trigger') ||
        triggerElementRef.current;
      launcher?.focus?.();
    };

    if (!frame || !backdrop) {
      cleanup();
      return;
    }

    activeAnimationsRef.current.forEach((a) => a.cancel());
    activeAnimationsRef.current = [];

    if (isReducedMotion) {
      const anim = frame.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 110, easing: 'ease-in', fill: 'forwards' }
      );
      anim.onfinish = cleanup;
      activeAnimationsRef.current.push(anim);
      return;
    }

    const launcher =
      document.getElementById('terminal-floating-trigger') ||
      (document.querySelector('.terminal-floating-trigger') as HTMLElement | null);
    const launcherRect = launcher?.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();

    let deltaX = 0;
    let deltaY = 0;
    let scaleX = 0.5;
    let scaleY = 0.5;

    if (launcherRect && launcherRect.width > 0 && frameRect.width > 0) {
      const launcherCenterX = launcherRect.left + launcherRect.width / 2;
      const launcherCenterY = launcherRect.top + launcherRect.height / 2;
      const frameCenterX = frameRect.left + frameRect.width / 2;
      const frameCenterY = frameRect.top + frameRect.height / 2;
      deltaX = launcherCenterX - frameCenterX;
      deltaY = launcherCenterY - frameCenterY;
      scaleX = Math.max(0.06, launcherRect.width / frameRect.width);
      scaleY = Math.max(0.03, launcherRect.height / frameRect.height);
    } else {
      deltaX = window.innerWidth / 2 - 100;
      deltaY = window.innerHeight / 2 - 80;
      scaleX = 0.55;
      scaleY = 0.55;
    }

    // 1. Content fades out first
    if (content) {
      const contentAnim = content.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 110, easing: 'ease-in', fill: 'forwards' }
      );
      activeAnimationsRef.current.push(contentAnim);
    }

    // 2. Frame contracts toward launcher (260ms)
    const frameAnim = frame.animate(
      [
        {
          transform: 'translate3d(0, 0, 0) scale(1, 1)',
          borderRadius: '16px',
          opacity: 1
        },
        {
          transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})`,
          borderRadius: '9999px',
          opacity: 0
        }
      ],
      {
        duration: 260,
        easing: 'cubic-bezier(0.32, 0, 0.67, 0)',
        fill: 'forwards'
      }
    );

    // 3. Backdrop fades out (240ms)
    const backdropAnim = backdrop.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 240, easing: 'ease-in', fill: 'forwards' }
    );

    activeAnimationsRef.current.push(backdropAnim, frameAnim);

    frameAnim.onfinish = () => {
      // Tactile response on launcher button
      if (launcher && !isReducedMotion) {
        launcher.animate(
          [
            { transform: 'scale(0.93)', boxShadow: '0 0 16px var(--color-accent-primary)' },
            { transform: 'scale(1.05)', boxShadow: '0 0 8px var(--color-accent-glow)' },
            { transform: 'scale(1)', boxShadow: '' }
          ],
          { duration: 260, easing: 'cubic-bezier(0.34, 1.4, 0.64, 1)' }
        );
      }
      cleanup();
    };
  }, [isReducedMotion, onClose]);

  // Sync open/close states and trigger animations
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current =
        (document.getElementById('terminal-floating-trigger') ||
          document.activeElement) as HTMLElement | null;

      if (isClosingRef.current) {
        isClosingRef.current = false;
        activeAnimationsRef.current.forEach((a) => a.cancel());
        activeAnimationsRef.current = [];
        runOpenAnimation();
      }
    } else if (!isOpen && isRendered && !isClosingRef.current) {
      runCloseAnimation();
    }
  }, [isOpen, isRendered, runOpenAnimation, runCloseAnimation]);

  useEffect(() => {
    if (isRendered && isOpen && !isClosingRef.current && animPhase === 'idle') {
      runOpenAnimation();
    }
  }, [isRendered, isOpen, animPhase, runOpenAnimation]);

  // Clean up running animations on unmount
  useEffect(() => {
    return () => {
      activeAnimationsRef.current.forEach((a) => a.cancel());
      activeAnimationsRef.current = [];
    };
  }, []);

  // Sync body attribute to coordinate cursor and launcher visibility
  useEffect(() => {
    if (isRendered) {
      document.body.setAttribute('data-terminal-open', 'true');
    } else {
      document.body.removeAttribute('data-terminal-open');
    }
    return () => {
      document.body.removeAttribute('data-terminal-open');
    };
  }, [isRendered]);

  // Uptime counter
  useEffect(() => {
    if (!isRendered) return;
    const timer = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRendered]);

  const formatUptime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  // Auto-scroll terminal output to bottom
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [outputs]);

  // Global escape key to close terminal overlay
  useEffect(() => {
    if (!isRendered) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        runCloseAnimation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRendered, runCloseAnimation]);

  // Execute a command string safely through strict allowlist parser
  const executeCommand = (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    if (!trimmed) {
      // Empty input: just print empty prompt line
      setOutputs((prev) => [
        ...prev,
        {
          id: `cmd-${Date.now()}`,
          command: '',
          type: 'command',
          content: null,
        },
      ]);
      return;
    }

    // Record in history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setCommandCount((prev) => prev + 1);

    // Normalize: strip leading slash if user typed '/help' or '/about'
    const normalized = trimmed.startsWith('/') ? trimmed.slice(1).toLowerCase() : trimmed.toLowerCase();

    const newOutputs: OutputEntry[] = [
      {
        id: `cmd-${Date.now()}`,
        command: trimmed,
        type: 'command',
        content: null,
      },
    ];

    switch (normalized) {
      case 'help': {
        newOutputs.push({
          id: `res-${Date.now()}`,
          type: 'response',
          content: (
            <div className="term-help-grid font-mono">
              <span className="term-section-title">Available Directives:</span>
              <div className="term-cmd-row">
                <span className="cmd-name">help</span>
                <span className="cmd-desc">List available commands and controls</span>
              </div>
              <div className="term-cmd-row">
                <span className="cmd-name">about</span>
                <span className="cmd-desc">Core background & engineering specialization</span>
              </div>
              <div className="term-cmd-row">
                <span className="cmd-name">whoami</span>
                <span className="cmd-desc">Display developer profile & current session</span>
              </div>
              <div className="term-cmd-row">
                <span className="cmd-name">projects</span>
                <span className="cmd-desc">List featured systems & real codebase implementations</span>
              </div>
              <div className="term-cmd-row">
                <span className="cmd-name">open aegis3d</span>
                <span className="cmd-desc">Launch deep-dive case study for Aegis3D (formerly STRUCTURA)</span>
              </div>
              <div className="term-cmd-row">
                <span className="cmd-name">open outreach-os</span>
                <span className="cmd-desc">Launch deep-dive case study for Outreach OS (In Development)</span>
              </div>
              <div className="term-cmd-row">
                <span className="cmd-name">open flyrank</span>
                <span className="cmd-desc">Inspect FlyRank AI backend engineering internship details</span>
              </div>
              <div className="term-cmd-row">
                <span className="cmd-name">experience</span>
                <span className="cmd-desc">Navigate to Work Experience section</span>
              </div>
              <div className="term-cmd-row">
                <span className="cmd-name">skills</span>
                <span className="cmd-desc">Navigate to Interactive Technical Skills map</span>
              </div>
              <div className="term-cmd-row">
                <span className="cmd-name">contact</span>
                <span className="cmd-desc">Display verified email & professional channels</span>
              </div>
              <div className="term-cmd-row">
                <span className="cmd-name">resume</span>
                <span className="cmd-desc">Open official Curriculum Vitae PDF in a new tab</span>
              </div>
              <div className="term-cmd-row">
                <span className="cmd-name">github</span>
                <span className="cmd-desc">Open verified GitHub profile (github.com/m4ulikP)</span>
              </div>
              <div className="term-cmd-row">
                <span className="cmd-name">history</span>
                <span className="cmd-desc">Display list of executed commands in current session</span>
              </div>
              <div className="term-cmd-row">
                <span className="cmd-name">clear</span>
                <span className="cmd-desc">Clear terminal screen output</span>
              </div>
              <div className="term-cmd-row">
                <span className="cmd-name">exit</span>
                <span className="cmd-desc">Close and dismiss interactive terminal</span>
              </div>
            </div>
          ),
        });
        break;
      }

      case 'about': {
        newOutputs.push({
          id: `res-${Date.now()}`,
          type: 'response',
          content: (
            <div className="term-response-block font-mono">
              <p className="term-highlight-text font-display">Maulik Pandey</p>
              <p className="term-text-secondary">
                Computer Science & Engineering undergraduate specializing in Artificial Intelligence.
              </p>
              <p className="term-text-muted">
                Engineering focus: Backend systems, high-throughput signal telemetry, deterministic
                data pipelines, and dynamic graph routing. Experienced with asynchronous Python (FastAPI),
                TypeScript/Node.js, PostgreSQL/PostGIS, and hardware edge signal conditioning (ESP32/PZT).
              </p>
            </div>
          ),
        });
        break;
      }

      case 'whoami': {
        newOutputs.push({
          id: `res-${Date.now()}`,
          type: 'response',
          content: (
            <div className="term-meta-grid font-mono">
              <div className="meta-pair">
                <span className="meta-k">User:</span>
                <span className="meta-v">Maulik Pandey</span>
              </div>
              <div className="meta-pair">
                <span className="meta-k">Role:</span>
                <span className="meta-v">Backend & Systems Engineer</span>
              </div>
              <div className="meta-pair">
                <span className="meta-k">Education:</span>
                <span className="meta-v">B.Tech in Computer Science (Specialization: AI)</span>
              </div>
              <div className="meta-pair">
                <span className="meta-k">Status:</span>
                <span className="meta-v text-nominal">Open to Backend / SWE Internships</span>
              </div>
              <div className="meta-pair">
                <span className="meta-k">Session:</span>
                <span className="meta-v">visitor@maulik.exe (interactive session)</span>
              </div>
            </div>
          ),
        });
        break;
      }

      case 'projects': {
        newOutputs.push({
          id: `res-${Date.now()}`,
          type: 'response',
          content: (
            <div className="term-projects-list font-mono">
              <span className="term-section-title">Verified Engineering Projects:</span>

              <div className="term-project-item">
                <div className="proj-item-head">
                  <span className="proj-num">[ 01 ]</span>
                  <button
                    type="button"
                    className="proj-name-link font-display"
                    onClick={() => executeCommand('open aegis3d')}
                  >
                    Aegis3D (originally STRUCTURA) ↗
                  </button>
                  <span className="proj-badge">Signal Processing & Backend Prototype</span>
                </div>
                <p className="proj-desc">
                  Structural-health monitoring system collecting acoustic sensor data from an ESP32
                  benchtop prototype and processing it through a 9-stage signal and health-index pipeline.
                </p>
                <div className="proj-stack">
                  Stack: FastAPI / Python · ESP32 & PZT Sensors · Butterworth DSP · PostgreSQL/SSE · Pytest
                </div>
                <div className="proj-action-hint">
                  Action: Type <span className="term-highlight">'open aegis3d'</span> to launch case study modal.
                </div>
              </div>

              <div className="term-project-item">
                <div className="proj-item-head">
                  <span className="proj-num">[ 02 ]</span>
                  <button
                    type="button"
                    className="proj-name-link font-display"
                    onClick={() => executeCommand('open outreach-os')}
                  >
                    Outreach OS ↗
                  </button>
                  <span className="proj-badge">IN DEVELOPMENT · Sales Studio</span>
                </div>
                <p className="proj-desc">
                  AI-powered prospecting and outreach platform designed to help freelancers
                  discover potential clients, personalize outreach, and manage follow-up pipelines.
                </p>
                <div className="proj-stack">
                  Stack: Next.js 14 / React · TypeScript &amp; Tailwind · PostgreSQL &amp; Prisma · 3-Tier Dedup · Zod
                </div>
                <div className="proj-action-hint">
                  Action: Type <span className="term-highlight">'open outreach-os'</span> to launch case study modal.
                </div>
              </div>

              <div className="term-project-item">
                <div className="proj-item-head">
                  <span className="proj-num">[ 03 ]</span>
                  <button
                    type="button"
                    className="proj-name-link font-display"
                    onClick={() => executeCommand('open flyrank')}
                  >
                    FlyRank AI Metering & Billing ↗
                  </button>
                  <span className="proj-badge">Internship Engineering</span>
                </div>
                <p className="proj-desc">
                  Backend usage metering, quota enforcement, and integer-cent billing
                  pipelines built during internship and covered by Docker integration tests.
                </p>
                <div className="proj-stack">
                  Stack: Node.js · TypeScript · PostgreSQL · Stripe Webhooks · Vitest (Docker)
                </div>
                <div className="proj-action-hint">
                  Action: Type <span className="term-highlight">'open flyrank'</span> to navigate to experience details.
                </div>
              </div>
            </div>
          ),
        });
        break;
      }

      case 'open aegis3d':
      case 'open structura': {
        newOutputs.push({
          id: `res-${Date.now()}`,
          type: 'success',
          content: (
            <div className="term-action-feedback font-mono">
              <span className="feedback-status">✓ SUCCESS</span>
              <p>Opening Aegis3D (originally developed as STRUCTURA) case study modal...</p>
              <p className="term-text-muted">9-stage telemetry pipeline & 180 pytest verification suite loaded.</p>
            </div>
          ),
        });
        setTimeout(() => {
          runCloseAnimation(() => {
            onSelectProject?.('aegis3d');
          });
        }, 350);
        break;
      }

      case 'open outreach-os':
      case 'open outreachos': {
        newOutputs.push({
          id: `res-${Date.now()}`,
          type: 'success',
          content: (
            <div className="term-action-feedback font-mono">
              <span className="feedback-status">✓ SUCCESS</span>
              <p>Opening Outreach OS (In Development) case study modal...</p>
              <p className="term-text-muted">3-tier deduplication engine &amp; sales studio pipeline architecture loaded.</p>
            </div>
          ),
        });
        setTimeout(() => {
          runCloseAnimation(() => {
            onSelectProject?.('outreach-os');
          });
        }, 350);
        break;
      }

      case 'open transitops': {
        newOutputs.push({
          id: `res-${Date.now()}`,
          type: 'response',
          content: (
            <div className="term-action-feedback font-mono">
              <span className="feedback-status">INFO</span>
              <p>TransitOps was an earlier hackathon prototype and is not featured in this portfolio.</p>
              <p className="term-text-muted">Type 'projects' to view currently featured projects (Aegis3D, Outreach OS).</p>
            </div>
          ),
        });
        break;
      }

      case 'open flyrank':
      case 'experience': {
        newOutputs.push({
          id: `res-${Date.now()}`,
          type: 'success',
          content: (
            <div className="term-action-feedback font-mono">
              <span className="feedback-status">✓ NAVIGATING</span>
              <p>Navigating to [ 02 ] Work Experience (FlyRank AI Backend Internship)...</p>
              <p className="term-text-muted">Idempotency headers, quota gating, and Stripe webhook workers.</p>
            </div>
          ),
        });
        setTimeout(() => {
          runCloseAnimation(() => {
            onNavToSection?.('experience');
          });
        }, 350);
        break;
      }

      case 'skills': {
        newOutputs.push({
          id: `res-${Date.now()}`,
          type: 'success',
          content: (
            <div className="term-action-feedback font-mono">
              <span className="feedback-status">✓ NAVIGATING</span>
              <p>Navigating to [ 04 ] Technical Skills & Interactive Knowledge Map...</p>
            </div>
          ),
        });
        setTimeout(() => {
          runCloseAnimation(() => {
            onNavToSection?.('skills');
          });
        }, 350);
        break;
      }

      case 'contact': {
        newOutputs.push({
          id: `res-${Date.now()}`,
          type: 'response',
          content: (
            <div className="term-contact-card font-mono">
              <span className="term-section-title">Verified Communication Channels:</span>
              <div className="contact-row">
                <span className="contact-label">Email:</span>
                <a href="mailto:maulik.pandey9@gmail.com" className="contact-link">
                  maulik.pandey9@gmail.com
                </a>
              </div>
              <div className="contact-row">
                <span className="contact-label">GitHub:</span>
                <a href="https://github.com/m4ulikP" target="_blank" rel="noopener noreferrer" className="contact-link">
                  github.com/m4ulikP ↗
                </a>
              </div>
              <div className="contact-row">
                <span className="contact-label">LinkedIn:</span>
                <a href="https://www.linkedin.com/in/maulik-pandeyy/" target="_blank" rel="noopener noreferrer" className="contact-link">
                  linkedin.com/in/maulik-pandeyy ↗
                </a>
              </div>
            </div>
          ),
        });
        break;
      }

      case 'resume': {
        newOutputs.push({
          id: `res-${Date.now()}`,
          type: 'success',
          content: (
            <div className="term-action-feedback font-mono">
              <span className="feedback-status">✓ OPENING RESUME</span>
              <p>Opening official Curriculum Vitae (/resume.pdf) in a new tab...</p>
            </div>
          ),
        });
        window.open('/resume.pdf', '_blank', 'noopener,noreferrer');
        break;
      }

      case 'github': {
        newOutputs.push({
          id: `res-${Date.now()}`,
          type: 'success',
          content: (
            <div className="term-action-feedback font-mono">
              <span className="feedback-status">✓ OPENING GITHUB</span>
              <p>Opening verified profile https://github.com/m4ulikP in a new tab...</p>
            </div>
          ),
        });
        window.open('https://github.com/m4ulikP', '_blank', 'noopener,noreferrer');
        break;
      }

      case 'history': {
        newOutputs.push({
          id: `res-${Date.now()}`,
          type: 'response',
          content: (
            <div className="term-history-list font-mono">
              <span className="term-section-title">Session Command History ({history.length + 1}):</span>
              {[...history, trimmed].map((cmd, i) => (
                <div key={i} className="history-line">
                  <span className="history-num">{String(i + 1).padStart(2, '0')}.</span>
                  <span className="history-cmd">{cmd}</span>
                </div>
              ))}
            </div>
          ),
        });
        break;
      }

      case 'clear': {
        setOutputs([]);
        return;
      }

      case 'exit': {
        runCloseAnimation();
        return;
      }

      default: {
        newOutputs.push({
          id: `res-${Date.now()}`,
          type: 'error',
          content: (
            <div className="term-error-block font-mono">
              <span className="error-prefix">Command not recognized:</span> "{trimmed}"
              <p className="error-hint">
                Type <span className="term-highlight">'help'</span> for an allowlist of supported commands, or click any link in the info panel.
              </p>
            </div>
          ),
        });
        break;
      }
    }

    setOutputs((prev) => [...prev, ...newOutputs]);

    // Keep input focused and scroll to bottom
    setTimeout(() => {
      inputRef.current?.focus();
      if (terminalBodyRef.current) {
        terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
      }
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ctrl+L or Cmd+L to clear terminal screen
    if ((e.ctrlKey || e.metaKey) && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      setOutputs([]);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(inputVal);
      setInputVal('');
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(history[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) {
        setInputVal('help');
        return;
      }
      const match = SUPPORTED_COMMANDS.find((cmd) => cmd.startsWith(current));
      if (match) {
        setInputVal(match);
      }
    }
  };

  // Focus input when clicking anywhere inside terminal main area (unless selecting text or clicking a link)
  const handleTerminalAreaClick = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;
    if ((e.target as HTMLElement).closest('button, a')) return;
    if (inputRef.current) {
      inputRef.current.focus();
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  };

  if (!isRendered) return null;

  return (
    <div
      ref={backdropRef}
      className={`term-modal-backdrop ${isReducedMotion ? 'reduced-motion' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) runCloseAnimation();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="MAULIK.EXE Interactive Terminal"
      data-liquid-ignore="true"
    >
      <div className="term-window-frame" ref={modalContainerRef}>
        <div className="term-frame-content-wrap" ref={contentWrapRef}>
          {/* Window Chrome Header */}
          <div className="term-window-header font-mono">
            <div className="term-header-left">
              <span className="term-status-pip" aria-hidden="true" />
              <span className="term-header-title font-display">MAULIK.EXE TERMINAL</span>
              <span className="term-header-env">[bash: live]</span>
            </div>
            <div className="term-header-actions">
              <button
                type="button"
                className="term-win-btn term-min-btn"
                onClick={() => runCloseAnimation()}
                title="Minimize terminal"
                aria-label="Minimize terminal"
              >
                —
              </button>
              <button
                type="button"
                className="term-win-btn term-close-btn"
                onClick={() => runCloseAnimation()}
                title="Close terminal (Esc)"
                aria-label="Close terminal (Escape)"
              >
                ✕
              </button>
            </div>
          </div>

        {/* Dual-Panel Workspace Layout: Main Terminal + Secondary Info Panel */}
        <div className="term-workspace-grid">
          {/* Main Terminal Area */}
          <section className="term-main-section" onClick={handleTerminalAreaClick}>
            <div className="term-output-scroll" ref={terminalBodyRef}>
              {outputs.map((entry) => (
                <div key={entry.id} className={`term-output-item term-type-${entry.type}`}>
                  {entry.command !== undefined && (
                    <div className="term-executed-line font-mono">
                      <span className="term-prompt-prefix">maulik@portfolio:~$</span>
                      <span className="term-prompt-cmd">{entry.command}</span>
                    </div>
                  )}
                  {entry.content && <div className="term-item-content">{entry.content}</div>}
                </div>
              ))}

              {/* Native Inline Command Prompt inside Terminal Flow */}
              <form
                className="term-active-prompt-line font-mono"
                onSubmit={(e) => {
                  e.preventDefault();
                  executeCommand(inputVal);
                  setInputVal('');
                }}
                onClick={() => inputRef.current?.focus()}
              >
                <label htmlFor="term-native-input" className="term-prompt-prefix">
                  maulik@portfolio:~$
                </label>
                <div className="term-input-field-wrap">
                  <input
                    ref={inputRef}
                    id="term-native-input"
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="term-native-input font-mono"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    aria-label="Terminal command input"
                  />
                </div>
              </form>
            </div>

            {/* Bottom Status Bar */}
            <div className="term-bottom-bar font-mono">
              <span className="status-item">~ uptime: {formatUptime(uptimeSeconds)}</span>
              <span className="status-item">cmds: {commandCount}</span>
              <span className="status-item status-ready">status: ready</span>
              <span className="status-item session-tag">session: visitor@portfolio</span>
            </div>
          </section>

          {/* Secondary Information Panel (Side-by-side on desktop, stacked on mobile) */}
          <aside className="term-info-panel font-mono" aria-label="System Identity & Directives">
            {/* Identity Block */}
            <div className="info-block info-identity">
              <div className="info-block-header">
                <span className="info-glyph">$</span>
                <span className="info-heading">whoami</span>
              </div>
              <div className="info-identity-body">
                <h3 className="info-name font-display">Maulik Pandey</h3>
                <p className="info-role">Computer Science Undergraduate</p>
                <p className="info-sub">Backend Engineering & Applied AI</p>
                <span className="info-session">Session: visitor@maulik.exe</span>
              </div>
            </div>

            <div className="info-divider" aria-hidden="true" />

            {/* Quick Command Directives */}
            <div className="info-block info-quick-links">
              <div className="info-block-header">
                <span className="info-glyph">&gt;</span>
                <span className="info-heading">Quick Directives</span>
              </div>
              <div className="quick-links-list">
                <button
                  type="button"
                  className="quick-cmd-btn"
                  onClick={() => executeCommand('about')}
                  title="Execute: about"
                >
                  <span className="cmd-chip">1.</span>
                  <span className="cmd-label">about</span>
                  <span className="cmd-hint">who is Maulik</span>
                </button>
                <button
                  type="button"
                  className="quick-cmd-btn"
                  onClick={() => executeCommand('projects')}
                  title="Execute: projects"
                >
                  <span className="cmd-chip">2.</span>
                  <span className="cmd-label">projects</span>
                  <span className="cmd-hint">featured systems</span>
                </button>
                <button
                  type="button"
                  className="quick-cmd-btn"
                  onClick={() => executeCommand('skills')}
                  title="Execute: skills"
                >
                  <span className="cmd-chip">3.</span>
                  <span className="cmd-label">skills</span>
                  <span className="cmd-hint">knowledge map</span>
                </button>
                <button
                  type="button"
                  className="quick-cmd-btn"
                  onClick={() => executeCommand('experience')}
                  title="Execute: experience"
                >
                  <span className="cmd-chip">4.</span>
                  <span className="cmd-label">experience</span>
                  <span className="cmd-hint">FlyRank AI intern</span>
                </button>
                <button
                  type="button"
                  className="quick-cmd-btn"
                  onClick={() => executeCommand('contact')}
                  title="Execute: contact"
                >
                  <span className="cmd-chip">5.</span>
                  <span className="cmd-label">contact</span>
                  <span className="cmd-hint">get in touch</span>
                </button>
                <button
                  type="button"
                  className="quick-cmd-btn"
                  onClick={() => executeCommand('resume')}
                  title="Execute: resume"
                >
                  <span className="cmd-chip">6.</span>
                  <span className="cmd-label">resume</span>
                  <span className="cmd-hint">view PDF CV</span>
                </button>
                <button
                  type="button"
                  className="quick-cmd-btn"
                  onClick={() => executeCommand('github')}
                  title="Execute: github"
                >
                  <span className="cmd-chip">7.</span>
                  <span className="cmd-label">github</span>
                  <span className="cmd-hint">code repositories</span>
                </button>
              </div>
            </div>

            {/* Info Panel Footer */}
            <div className="info-bottom-bar font-mono">
              <span>click directive or type command · esc to close</span>
            </div>
          </aside>
        </div>
        </div>
      </div>
    </div>
  );
};

