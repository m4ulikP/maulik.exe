import React from 'react';
import './NotFoundPage.css';

interface NotFoundPageProps {
  onHomeClick?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onHomeClick }) => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/unknown';

  const handleReturnHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onHomeClick) {
      onHomeClick();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="not-found-container" role="main" aria-labelledby="not-found-code">
      <div className="site-container not-found-content">
        {/* Terminal Header Chrome */}
        <div className="not-found-terminal-box">
          <div className="not-found-terminal-header font-mono">
            <div className="terminal-dots">
              <span className="dot red" />
              <span className="dot amber" />
              <span className="dot green" />
            </div>
            <span className="terminal-title">MAULIK.EXE // ERROR HANDLER</span>
            <span className="terminal-status font-mono">CODE: 404</span>
          </div>

          <div className="not-found-terminal-body font-mono">
            <div className="terminal-line prompt-line">
              <span className="term-prompt">$</span>
              <span className="term-cmd">resolve-route --path "{currentPath}"</span>
            </div>

            <div className="terminal-line error-line">
              <span className="term-warn">ERR_NOT_FOUND:</span>
              <span className="term-msg">No entrypoint or static route mapped to target resource.</span>
            </div>

            <div className="terminal-hero-code font-display" id="not-found-code">
              404
            </div>

            <p className="terminal-desc font-body">
              The requested address does not exist in this system directory. The route may have been
              relocated, removed, or mistyped.
            </p>

            <div className="terminal-actions">
              <a
                href="/"
                className="btn-return-home font-mono"
                onClick={handleReturnHome}
              >
                <span>RETURN TO ROOT [ ~/ ]</span>
                <span className="arrow-glyph" aria-hidden="true">→</span>
              </a>

              <a
                href="/#work"
                className="btn-browse-work font-mono"
                onClick={(e) => {
                  e.preventDefault();
                  if (onHomeClick) {
                    onHomeClick();
                    setTimeout(() => {
                      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  } else {
                    window.location.href = '/#work';
                  }
                }}
              >
                <span>EXPLORE WORK</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
