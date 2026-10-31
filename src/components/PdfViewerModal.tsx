import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  ExternalLink,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { playTactileClick, playSwitchTone } from '../utils/sound';

// Configure PDF.js worker reliably using module worker
if (typeof window !== 'undefined' && 'Worker' in window && !pdfjsLib.GlobalWorkerOptions.workerPort) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerPort = new Worker(
      new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url),
      { type: 'module' }
    );
  } catch (err) {
    console.warn('Worker module initialization fallback:', err);
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    }
  }
}

interface PdfViewerModalProps {
  isOpen: boolean;
  pdfUrl: string;
  title?: string;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  pdfUrl,
  title = 'RESUME — MAULIK PANDEY [PDF]',
  onClose,
}) => {
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.15);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const loadingTaskRef = useRef<any>(null);
  const renderTaskRef = useRef<any>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  const handleInitiateClose = useCallback(() => {
    playTactileClick();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClose();
      return;
    }
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 180);
  }, [onClose]);

  // Handle body scroll lock & Escape key & Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElementRef.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button or first actionable element upon opening
    const timer = setTimeout(() => {
      const focusables = modalContainerRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables && focusables.length > 0) {
        focusables[0].focus();
      }
    }, 40);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleInitiateClose();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage((prev) => Math.min(prev + 1, numPages || 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      } else if (e.key === 'Tab' && modalContainerRef.current) {
        const focusables = Array.from(
          modalContainerRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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

    const prevActive = previousActiveElementRef.current;

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (prevActive) {
        prevActive.focus();
      }
    };
  }, [isOpen, numPages, handleInitiateClose]);

  // Load PDF document safely whenever modal opens or pdfUrl changes
  useEffect(() => {
    if (!isOpen || !pdfUrl) {
      // Clear all references if closed
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
        renderTaskRef.current = null;
      }
      if (loadingTaskRef.current) {
        try {
          loadingTaskRef.current.destroy().catch(() => {});
        } catch {
          // ignore
        }
        loadingTaskRef.current = null;
      }
      pdfDocRef.current = null;
      return;
    }

    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        setLoading(true);
        setError(null);
        setCurrentPage(1);
      }
    });

    // Cancel any previous tasks before loading fresh
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch {
        // ignore
      }
      renderTaskRef.current = null;
    }
    if (loadingTaskRef.current) {
      try {
        loadingTaskRef.current.destroy().catch(() => {});
      } catch {
        // ignore
      }
      loadingTaskRef.current = null;
    }
    pdfDocRef.current = null;

    try {
      const task = pdfjsLib.getDocument({ url: pdfUrl });
      loadingTaskRef.current = task;

      task.promise
        .then((loadedPdf) => {
          if (!isMounted) {
            try {
              loadedPdf.cleanup();
            } catch {
              // ignore
            }
            return;
          }
          pdfDocRef.current = loadedPdf;
          setNumPages(loadedPdf.numPages);
          setCurrentPage(1);
          setLoading(false);
          setError(null);
        })
        .catch((err) => {
          if (!isMounted) return;
          console.error('Error loading PDF document:', err);
          setError('Failed to render PDF using built-in engine. You can still download or open directly.');
          setLoading(false);
        });
    } catch (syncErr: any) {
      if (isMounted) {
        console.error('Synchronous error loading PDF document:', syncErr);
        Promise.resolve().then(() => {
          if (isMounted) {
            setError('Initialization error. Use external fallback or download.');
            setLoading(false);
          }
        });
      }
    }

    return () => {
      isMounted = false;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
        renderTaskRef.current = null;
      }
      if (loadingTaskRef.current) {
        try {
          loadingTaskRef.current.destroy().catch(() => {});
        } catch {
          // ignore
        }
        loadingTaskRef.current = null;
      }
      pdfDocRef.current = null;
    };
  }, [isOpen, pdfUrl]);

  // Render Page onto Canvas with complete error handling
  useEffect(() => {
    if (!isOpen || !pdfDocRef.current || loading || error) return;

    let isCancelled = false;
    const doc = pdfDocRef.current;

    try {
      doc
        .getPage(currentPage)
        .then((page) => {
          if (isCancelled || !canvasRef.current) return;

          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Cancel previous render task if active
          if (renderTaskRef.current) {
            try {
              renderTaskRef.current.cancel();
            } catch {
              // ignore
            }
            renderTaskRef.current = null;
          }

          const dpr = window.devicePixelRatio || 1;
          const viewport = page.getViewport({ scale });

          // Scale dimensions for crisp retina rendering
          canvas.width = Math.floor(viewport.width * dpr);
          canvas.height = Math.floor(viewport.height * dpr);
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;

          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

          const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
            canvas: canvas,
          };

          const renderTask = page.render(renderContext);
          renderTaskRef.current = renderTask;

          renderTask.promise
            .then(() => {
              renderTaskRef.current = null;
            })
            .catch((err: any) => {
              if (err?.name !== 'RenderingCancelledException') {
                console.warn('Canvas page render warning:', err);
              }
            });
        })
        .catch((pageErr: any) => {
          if (isCancelled) return;
          console.error('Error fetching page from PDF doc:', pageErr);
          setError('Could not render document page.');
        });
    } catch (err: any) {
      if (!isCancelled) {
        console.error('Synchronous error calling getPage:', err);
        Promise.resolve().then(() => {
          if (!isCancelled) {
            setError('Error accessing page data.');
          }
        });
      }
    }

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
        renderTaskRef.current = null;
      }
    };
  }, [isOpen, currentPage, scale, loading, error]);

  const handlePrevPage = () => {
    playTactileClick();
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    playTactileClick();
    setCurrentPage((prev) => Math.min(prev + 1, numPages));
  };

  const handleZoomIn = () => {
    playTactileClick();
    setScale((prev) => Math.min(Math.round((prev + 0.15) * 100) / 100, 2.2));
  };

  const handleZoomOut = () => {
    playTactileClick();
    setScale((prev) => Math.max(Math.round((prev - 0.15) * 100) / 100, 0.6));
  };

  const handleResetZoom = () => {
    playTactileClick();
    setScale(1.15);
  };

  if (!isOpen && !isClosing) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`pdf-modal-backdrop ${isClosing ? 'is-leaving' : 'is-entering'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleInitiateClose();
      }}
    >
      <div
        ref={modalContainerRef}
        className={`pdf-modal-container ${isClosing ? 'is-leaving' : 'is-entering'}`}
      >
        {/* Modal Top Title Bar */}
        <div className="pdf-modal-header font-mono">
          <div className="title-wrap">
            <FileText size={17} className="title-icon" />
            <h3 id="pdf-modal-title" className="pdf-title">
              {title}
            </h3>
            <span className="pdf-doc-badge">
              <CheckCircle2 size={11} />
              <span>OFFICIAL</span>
            </span>
          </div>

          <div className="header-actions">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brutal external-btn"
              title="Open original PDF in new browser tab"
              onClick={() => playTactileClick()}
            >
              <span>OPEN EXTERNALLY</span>
              <ExternalLink size={13} />
            </a>

            <button
              type="button"
              className="pdf-close-btn"
              onClick={handleInitiateClose}
              aria-label="Close PDF Viewer"
              title="Close [Esc]"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="pdf-toolbar font-mono">
          {/* Page Navigation */}
          <div className="toolbar-group">
            <button
              type="button"
              className="toolbar-btn"
              onClick={handlePrevPage}
              disabled={currentPage <= 1 || loading || Boolean(error)}
              aria-label="Previous page"
              title="Previous page (Left arrow)"
            >
              <ChevronLeft size={16} />
              <span className="btn-label-desktop">PREV</span>
            </button>

            <span className="page-indicator">
              PAGE {currentPage} / {numPages || 1}
            </span>

            <button
              type="button"
              className="toolbar-btn"
              onClick={handleNextPage}
              disabled={currentPage >= numPages || loading || Boolean(error)}
              aria-label="Next page"
              title="Next page (Right arrow)"
            >
              <span className="btn-label-desktop">NEXT</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="toolbar-group">
            <button
              type="button"
              className="toolbar-btn"
              onClick={handleZoomOut}
              disabled={scale <= 0.6 || loading || Boolean(error)}
              aria-label="Zoom out"
              title="Zoom out (-15%)"
            >
              <ZoomOut size={15} />
            </button>

            <span className="zoom-indicator">{Math.round(scale * 100)}%</span>

            <button
              type="button"
              className="toolbar-btn"
              onClick={handleZoomIn}
              disabled={scale >= 2.2 || loading || Boolean(error)}
              aria-label="Zoom in"
              title="Zoom in (+15%)"
            >
              <ZoomIn size={15} />
            </button>

            <button
              type="button"
              className="toolbar-btn reset-btn"
              onClick={handleResetZoom}
              disabled={scale === 1.15 || loading || Boolean(error)}
              aria-label="Reset zoom"
              title="Reset scale to default 115%"
            >
              <RotateCcw size={14} />
              <span className="btn-label-desktop">FIT / RESET</span>
            </button>
          </div>

          {/* Download Action */}
          <div className="toolbar-group">
            <a
              href={pdfUrl}
              download="Maulik_Pandey_Resume.pdf"
              className="toolbar-btn download-btn"
              title="Download PDF directly to your device"
              onClick={() => playSwitchTone(true)}
            >
              <Download size={15} />
              <span>DOWNLOAD PDF</span>
            </a>
          </div>
        </div>

        {/* PDF Document Canvas Viewport */}
        <div className="pdf-viewport">
          {loading && (
            <div className="pdf-loading-state font-mono">
              <Loader2 size={26} className="spin-icon" />
              <span>RENDERING DOCUMENT PAGES...</span>
            </div>
          )}

          {error ? (
            <div className="pdf-error-state font-mono">
              <AlertCircle size={32} className="error-icon" />
              <p className="error-text">{error}</p>
              <div className="error-actions">
                <a
                  href={pdfUrl}
                  download="Maulik_Pandey_Resume.pdf"
                  className="toolbar-btn download-btn"
                >
                  <Download size={14} />
                  <span>DIRECT DOWNLOAD</span>
                </a>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="toolbar-btn"
                >
                  <ExternalLink size={14} />
                  <span>VIEW ORIGINAL LINK</span>
                </a>
              </div>
              <div className="fallback-frame-wrap">
                <iframe
                  src={pdfUrl}
                  title="PDF Fallback Embed"
                  className="pdf-iframe-fallback"
                />
              </div>
            </div>
          ) : (
            <div className={`canvas-scroll-stage ${loading ? 'is-loading' : ''}`}>
              <canvas ref={canvasRef} className="pdf-canvas" />
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className="pdf-modal-footer font-mono">
          <span className="footer-doc-info">SOURCE: {pdfUrl}</span>
          <span className="shortcut-hint">KEYBOARD: [← / →] PAGE • [ESC] CLOSE</span>
        </div>
      </div>

      <style>{`
        .pdf-modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(10, 11, 14, 0.82);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 200000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          box-sizing: border-box;
          opacity: 1;
        }

        .pdf-modal-backdrop.is-entering {
          animation: pdfFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .pdf-modal-backdrop.is-leaving {
          animation: pdfFadeOut 0.18s cubic-bezier(0.7, 0, 0.84, 0) forwards;
        }

        @keyframes pdfFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pdfFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .pdf-modal-container {
          width: 100%;
          max-width: 1020px;
          height: 92vh;
          max-height: 920px;
          background-color: var(--bg-surface);
          border: var(--border-width-lg) solid var(--border-color-default);
          box-shadow: var(--shadow-hard-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-sizing: border-box;
          position: relative;
        }

        .pdf-modal-container.is-entering {
          animation: pdfModalEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .pdf-modal-container.is-leaving {
          animation: pdfModalLeave 0.18s cubic-bezier(0.7, 0, 0.84, 0) forwards;
        }

        @keyframes pdfModalEnter {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pdfModalLeave {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
        }

        /* Reduced motion override */
        @media (prefers-reduced-motion: reduce) {
          .pdf-modal-backdrop.is-entering,
          .pdf-modal-backdrop.is-leaving,
          .pdf-modal-container.is-entering,
          .pdf-modal-container.is-leaving {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }

        /* Header Bar */
        .pdf-modal-header {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.25rem;
          background-color: var(--bg-header-contrast);
          color: var(--color-header-text);
          border-bottom: var(--border-width-md) solid var(--border-color-default);
        }

        .title-wrap {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }

        .title-icon {
          color: var(--accent-highlight);
          flex-shrink: 0;
        }

        /* Explicit contrast override to prevent global h3 text color inheritance */
        .pdf-title {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          margin: 0;
          color: var(--color-header-text) !important;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .pdf-doc-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background-color: rgba(223, 255, 0, 0.15);
          color: var(--accent-highlight);
          border: 1px solid var(--accent-highlight);
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.15rem 0.45rem;
          flex-shrink: 0;
          letter-spacing: 0.05em;
        }

        [data-theme='cyber-contrast'] .pdf-doc-badge {
          background-color: rgba(223, 255, 0, 0.12);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-shrink: 0;
        }

        .external-btn {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.35rem 0.65rem;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background-color: var(--bg-surface);
          color: var(--color-text-primary);
          border: var(--border-width-md) solid var(--border-color-default);
          box-shadow: 2px 2px 0px var(--color-ink);
          transition: var(--transition-tactile);
          cursor: pointer;
        }

        .external-btn:hover {
          background-color: var(--accent-highlight);
          color: var(--color-on-accent);
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0px var(--color-ink);
        }

        .pdf-close-btn {
          background: var(--bg-surface);
          border: var(--border-width-md) solid var(--border-color-default);
          color: var(--color-text-primary);
          padding: 0.3rem 0.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 2px 2px 0px var(--color-ink);
          transition: var(--transition-tactile);
        }

        .pdf-close-btn:hover {
          background-color: #FA5252;
          border-color: #FA5252;
          color: #FFFFFF;
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0px var(--color-ink);
        }

        /* Toolbar Controls */
        .pdf-toolbar {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.65rem;
          padding: 0.65rem 1.25rem;
          background-color: var(--bg-surface-secondary);
          border-bottom: var(--border-width-md) solid var(--border-color-default);
        }

        .toolbar-group {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .toolbar-btn {
          height: 34px;
          background-color: var(--bg-surface);
          border: var(--border-width-md) solid var(--border-color-default);
          color: var(--color-text-primary);
          font-family: var(--font-mono);
          font-size: 0.74rem;
          font-weight: 700;
          padding: 0 0.75rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          cursor: pointer;
          box-shadow: 2px 2px 0px var(--color-ink);
          transition: var(--transition-tactile);
          box-sizing: border-box;
        }

        .toolbar-btn:hover:not(:disabled) {
          background-color: var(--bg-surface-tertiary);
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0px var(--color-ink);
        }

        .toolbar-btn:active:not(:disabled) {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px var(--color-ink);
        }

        .toolbar-btn:disabled {
          opacity: 0.45;
          background-color: var(--bg-surface-tertiary);
          color: var(--color-text-muted);
          border-color: var(--border-color-muted);
          box-shadow: none !important;
          cursor: not-allowed;
          transform: none !important;
        }

        .download-btn {
          background-color: var(--accent-highlight) !important;
          color: var(--color-on-accent) !important;
          font-weight: 800;
          border-color: var(--border-color-default) !important;
        }

        .download-btn:hover {
          filter: brightness(1.04);
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0px var(--color-ink) !important;
        }

        .page-indicator,
        .zoom-indicator {
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 0.75rem;
          font-family: var(--font-mono);
          font-size: 0.74rem;
          font-weight: 800;
          background-color: var(--bg-surface);
          border: var(--border-width-md) solid var(--border-color-default);
          color: var(--color-text-primary);
          box-shadow: inset 1px 1px 0px rgba(0, 0, 0, 0.08);
          min-width: 90px;
          text-align: center;
          box-sizing: border-box;
        }

        .zoom-indicator {
          min-width: 60px;
        }

        /* PDF Document Canvas Viewport */
        .pdf-viewport {
          flex: 1;
          overflow: auto;
          background-color: #21242b;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 2rem 1rem;
          box-sizing: border-box;
          position: relative;
          min-height: 0;
        }

        [data-theme='cyber-contrast'] .pdf-viewport {
          background-color: #0c0e12;
        }

        .canvas-scroll-stage {
          display: inline-block;
          margin: auto;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55), 4px 4px 0px rgba(0, 0, 0, 0.4);
          background: #ffffff;
          border: 2px solid #000000;
          line-height: 0;
          transition: opacity 0.15s ease;
        }

        .canvas-scroll-stage.is-loading {
          opacity: 0.4;
        }

        .pdf-canvas {
          display: block;
          max-width: none;
          background: #ffffff;
        }

        .pdf-loading-state {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
          background-color: rgba(14, 16, 20, 0.85);
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 700;
          z-index: 10;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
          color: var(--accent-highlight);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .pdf-error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.1rem;
          text-align: center;
          color: #ffffff;
          max-width: 650px;
          width: 100%;
          margin: auto;
          padding: 2rem 1rem;
        }

        .error-icon {
          color: #ff5555;
        }

        .error-text {
          font-size: 0.88rem;
          line-height: 1.5;
          margin: 0;
          color: #e2e8f0;
        }

        .error-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .fallback-frame-wrap {
          width: 100%;
          height: 480px;
          border: var(--border-width-md) solid var(--border-color-default);
          margin-top: 1rem;
          background: #ffffff;
        }

        .pdf-iframe-fallback {
          width: 100%;
          height: 100%;
          border: none;
        }

        /* Footer info strip */
        .pdf-modal-footer {
          flex-shrink: 0;
          padding: 0.6rem 1.25rem;
          background-color: var(--bg-surface-secondary);
          border-top: var(--border-width-md) solid var(--border-color-default);
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .footer-doc-info {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .btn-label-desktop {
            display: none;
          }
          .pdf-modal-header {
            padding: 0.65rem 0.85rem;
          }
          .pdf-doc-badge {
            display: none;
          }
          .external-btn {
            display: none;
          }
          .pdf-toolbar {
            padding: 0.55rem 0.75rem;
            justify-content: center;
            gap: 0.4rem;
          }
          .toolbar-btn {
            height: 32px;
            padding: 0 0.55rem;
          }
          .page-indicator,
          .zoom-indicator {
            height: 32px;
            padding: 0 0.45rem;
            min-width: 65px;
            font-size: 0.7rem;
          }
          .reset-btn {
            display: none;
          }
          .shortcut-hint {
            display: none;
          }
          .pdf-viewport {
            padding: 1rem 0.5rem;
          }
        }
      `}</style>
    </div>,
    document.body
  );
};
