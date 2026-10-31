import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Mail, Copy, Check, Send, ArrowUpRight, Terminal, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { playTactileClick, playSwitchTone } from '../utils/sound';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mjyyonop';

export const Contact: React.FC = () => {
  const [emailCopied, setEmailCopied] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [formSubject, setFormSubject] = useState('SDE / Backend Opportunity');
  const [formMessage, setFormMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [copyStatusMessage, setCopyStatusMessage] = useState<string>('');

  const hasConfiguredEmail = Boolean(PERSONAL_INFO.email && PERSONAL_INFO.email.trim());

  const handleCopyEmail = () => {
    if (!hasConfiguredEmail) {
      setCopyStatusMessage('[INFO] Please configure your real email in src/data/portfolioData.ts');
      return;
    }
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setEmailCopied(true);
    playSwitchTone(true);
    setTimeout(() => setEmailCopied(false), 2400);
  };

  const validateForm = (): boolean => {
    const trimmedEmail = senderEmail.trim();
    const trimmedMessage = formMessage.trim();

    if (!trimmedEmail) {
      setFormStatus('error');
      setFeedbackType('error');
      setFeedbackMessage('Please enter your email address.');
      return false;
    }

    // Standard RFC 5322 compliant email regex test
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setFormStatus('error');
      setFeedbackType('error');
      setFeedbackMessage('Please provide a valid email format (e.g., name@company.com).');
      return false;
    }

    if (!trimmedMessage) {
      setFormStatus('error');
      setFeedbackType('error');
      setFeedbackMessage('Please enter a message before sending.');
      return false;
    }

    if (trimmedMessage.length < 5) {
      setFormStatus('error');
      setFeedbackType('error');
      setFeedbackMessage('Message is too short. Please provide a little more detail.');
      return false;
    }

    return true;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    playTactileClick();

    // Prevent submission while in-flight
    if (formStatus === 'loading') return;

    if (!validateForm()) {
      return;
    }

    // Honeypot spam trap check: silently pretend success if filled by a bot
    if (honeypot.trim() !== '') {
      setFormStatus('success');
      setFeedbackType('success');
      setFeedbackMessage('Message transmitted.');
      setSenderName('');
      setSenderEmail('');
      setFormMessage('');
      return;
    }

    setFormStatus('loading');
    setFeedbackType(null);
    setFeedbackMessage('');

    const payload: Record<string, string> = {
      email: senderEmail.trim(),
      subject: formSubject,
      message: formMessage.trim(),
      _gotcha: honeypot,
    };

    if (senderName.trim()) {
      payload.name = senderName.trim();
    }

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        setFormStatus('success');
        setFeedbackType('success');
        setFeedbackMessage('Message sent successfully! Thank you for reaching out, I will get back to you soon.');
        playSwitchTone(true);

        // Reset form fields
        setSenderName('');
        setSenderEmail('');
        setFormMessage('');
        setFormSubject('SDE / Backend Opportunity');

        // Reset button state to idle after 5 seconds
        setTimeout(() => {
          setFormStatus('idle');
        }, 5000);
      } else {
        let errorDetail = "Couldn't send — please try again or email directly.";
        if (data && data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          errorDetail = data.errors.map((err: any) => err.message).join('. ');
        } else if (data && data.error) {
          errorDetail = data.error;
        }

        setFormStatus('error');
        setFeedbackType('error');
        setFeedbackMessage(errorDetail);
      }
    } catch (networkErr: any) {
      console.error('Error submitting form to Formspree:', networkErr);
      setFormStatus('error');
      setFeedbackType('error');
      setFeedbackMessage('Network transmission error. Please check your connection or reach out directly.');
    }
  };

  const socialLinks = [
    {
      name: 'GITHUB',
      url: PERSONAL_INFO.githubUrl,
      svg: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
    },
    {
      name: 'LINKEDIN',
      url: PERSONAL_INFO.linkedinUrl,
      svg: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: 'X.COM',
      url: PERSONAL_INFO.xUrl,
      svg: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ].filter((s) => Boolean(s.url && s.url.trim()));

  return (
    <section className="contact-section" id="contact" aria-label="Contact Section">
      <div className="container">
        {/* Section Header */}
        <div className="section-marker">
          <div className="label-mono">
            <span className="section-number">05</span>
            <span className="section-title">CONTACT</span>
          </div>
          <span className="label-mono font-mono text-muted">GET IN TOUCH</span>
        </div>

        {/* 2-Column Swiss Contact Grid */}
        <div className="contact-grid">
          {/* Left Column: Direct Inquiries & Links */}
          <div className="contact-info surface-card">
            <div className="card-header font-mono">
              <span>DIRECT INQUIRIES</span>
              <span className="status-badge">DIRECT</span>
            </div>

            <div className="info-body">
              <h3 className="info-headline">
                Open to software engineering internships, backend opportunities, and technical projects.
              </h3>
              <p className="info-desc">
                Whether you have an engineering role to discuss, want to talk about distributed systems,
                or have questions about Aegis3D or OutreachOS, feel free to reach out directly.
              </p>

              {/* Tactile Email Card */}
              <div className="email-tactile-box surface-flat">
                <div className="box-top font-mono">
                  <Mail size={15} />
                  <span>DIRECT EMAIL</span>
                </div>
                <div className="box-main">
                  {hasConfiguredEmail ? (
                    <>
                      <a
                        href={`mailto:${PERSONAL_INFO.email}`}
                        className="email-display font-mono email-link"
                        title="Compose email directly in your client"
                      >
                        {PERSONAL_INFO.email}
                      </a>
                      <button
                        type="button"
                        className="btn-brutal copy-email-btn"
                        onClick={handleCopyEmail}
                        title="Copy email to clipboard"
                        aria-label="Copy email address"
                      >
                        {emailCopied ? (
                          <>
                            <Check size={14} className="copied-icon" />
                            <span>COPIED!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>COPY ADDRESS</span>
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <div className="unconfigured-email font-mono">
                      <span>Email available via contact form.</span>
                    </div>
                  )}
                </div>
              </div>

              {copyStatusMessage && (
                <div className="copy-status font-mono">
                  {copyStatusMessage}
                </div>
              )}

              {/* External Channels */}
              {socialLinks.length > 0 && (
                <div className="channels-group">
                  <span className="channels-label font-mono">// PROFILES &amp; CHANNELS:</span>
                  <div className="channels-list">
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-brutal channel-link"
                        onClick={() => playTactileClick()}
                      >
                        {link.svg}
                        <span>{link.name}</span>
                        <ArrowUpRight size={14} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="info-footer font-mono">
              <span>LOCATION: GREATER NOIDA, INDIA // REMOTE FRIENDLY</span>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="contact-form-card surface-card">
            <div className="card-header font-mono">
              <div className="header-title-wrap">
                <Terminal size={14} />
                <span>SEND A MESSAGE</span>
              </div>
              <span className="formspree-badge font-mono">AJAX ENDPOINT</span>
            </div>

            <form
              className="dispatch-form"
              onSubmit={handleSendMessage}
              noValidate
              aria-label="Contact form"
            >
              {/* Hidden honeypot field for spam prevention */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
              />

              {/* 2-Column Name & Email Row */}
              <div className="form-row-2col">
                <div className="form-field">
                  <label htmlFor="sender-name" className="field-label font-mono">
                    YOUR NAME
                  </label>
                  <input
                    id="sender-name"
                    name="name"
                    type="text"
                    className="brutal-input font-mono"
                    placeholder="Alex Mercer"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    disabled={formStatus === 'loading'}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="sender-email" className="field-label font-mono">
                    YOUR EMAIL *
                  </label>
                  <input
                    id="sender-email"
                    name="email"
                    type="email"
                    className="brutal-input font-mono"
                    placeholder="alex@company.com"
                    required
                    value={senderEmail}
                    onChange={(e) => {
                      setSenderEmail(e.target.value);
                      if (feedbackType === 'error') {
                        setFormStatus('idle');
                        setFeedbackType(null);
                        setFeedbackMessage('');
                      }
                    }}
                    disabled={formStatus === 'loading'}
                  />
                </div>
              </div>

              {/* Subject Selector */}
              <div className="form-field">
                <label htmlFor="form-subject" className="field-label font-mono">
                  SUBJECT
                </label>
                <select
                  id="form-subject"
                  name="subject"
                  className="brutal-input font-mono"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  disabled={formStatus === 'loading'}
                >
                  <option value="SDE / Backend Opportunity">
                    SDE / Backend Opportunity
                  </option>
                  <option value="Aegis3D / OutreachOS Technical Inquiry">
                    Aegis3D / OutreachOS Technical Inquiry
                  </option>
                  <option value="General Technical Collaboration">
                    General Technical Collaboration
                  </option>
                  <option value="Other Inquiries">
                    Other Inquiries
                  </option>
                </select>
              </div>

              {/* Message Textarea */}
              <div className="form-field">
                <label htmlFor="form-message" className="field-label font-mono">
                  MESSAGE *
                </label>
                <textarea
                  id="form-message"
                  name="message"
                  rows={4}
                  className="brutal-input font-mono textarea"
                  placeholder="Tell me about your team, role, or project..."
                  required
                  value={formMessage}
                  onChange={(e) => {
                    setFormMessage(e.target.value);
                    if (feedbackType === 'error') {
                      setFormStatus('idle');
                      setFeedbackType(null);
                      setFeedbackMessage('');
                    }
                  }}
                  disabled={formStatus === 'loading'}
                />
              </div>

              {/* Inline Feedback Notification */}
              {feedbackMessage && feedbackType && (
                <div
                  className={`status-notification font-mono ${
                    feedbackType === 'success' ? 'is-success' : 'is-error'
                  }`}
                  role="alert"
                  aria-live="polite"
                >
                  {feedbackType === 'success' ? (
                    <CheckCircle2 size={16} className="feedback-icon" />
                  ) : (
                    <AlertCircle size={16} className="feedback-icon" />
                  )}
                  <span>{feedbackMessage}</span>
                </div>
              )}

              {/* Form Action Button */}
              <button
                type="submit"
                className={`btn-brutal submit-btn ${
                  formStatus === 'success'
                    ? 'is-success'
                    : formStatus === 'error'
                    ? 'is-error'
                    : 'btn-primary'
                }`}
                disabled={formStatus === 'loading'}
                aria-label="Submit message"
              >
                {formStatus === 'loading' && (
                  <>
                    <Loader2 size={16} className="spin-icon" />
                    <span>SENDING...</span>
                  </>
                )}
                {formStatus === 'success' && (
                  <>
                    <Check size={16} />
                    <span>MESSAGE SENT ✓</span>
                  </>
                )}
                {formStatus === 'error' && (
                  <>
                    <AlertCircle size={16} />
                    <span>COULDN'T SEND — TRY AGAIN</span>
                  </>
                )}
                {formStatus === 'idle' && (
                  <>
                    <Send size={16} />
                    <span>SEND MESSAGE</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .contact-section {
          padding-top: var(--space-2xl);
          padding-bottom: var(--space-4xl);
        }

        .text-muted {
          color: var(--color-text-muted);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 992px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr;
            align-items: start;
          }
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 1.25rem;
          background-color: var(--bg-header-contrast);
          color: var(--color-header-text);
          font-size: 0.72rem;
          font-weight: 700;
        }

        .header-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .status-badge {
          color: var(--accent-highlight);
        }

        .formspree-badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.15rem 0.45rem;
          background: rgba(223, 255, 0, 0.15);
          color: var(--accent-highlight);
          border: 1px solid var(--accent-highlight);
          letter-spacing: 0.04em;
        }

        .info-body {
          padding: 1.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .info-headline {
          font-size: clamp(1.2rem, 2vw, 1.6rem);
          line-height: 1.35;
          letter-spacing: -0.02em;
        }

        .info-desc {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
        }

        .email-tactile-box {
          background-color: var(--bg-surface-secondary);
          border: var(--border-width-md) solid var(--border-color-default);
          box-shadow: 3px 3px 0px var(--color-ink);
        }

        .box-top {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          background-color: var(--bg-surface-tertiary);
          border-bottom: 1px solid var(--border-color-default);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-text-muted);
        }

        .box-main {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1rem;
        }

        @media (min-width: 600px) {
          .box-main {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .email-display {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--color-text-primary);
          word-break: break-all;
        }

        .unconfigured-email {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.74rem;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        .copy-email-btn {
          font-size: 0.75rem;
          padding: 0.5rem 0.85rem;
          white-space: nowrap;
        }

        .copied-icon {
          color: var(--status-online);
        }

        .copy-status {
          font-size: 0.74rem;
          color: var(--color-text-accent);
          font-weight: 600;
        }

        .channels-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .channels-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-text-muted);
        }

        .channels-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .channel-link {
          font-size: 0.78rem;
          padding: 0.55rem 0.85rem;
          background-color: var(--bg-surface);
        }

        .info-footer {
          padding: 0.65rem 1.25rem;
          background-color: var(--bg-surface-tertiary);
          border-top: var(--border-width-md) solid var(--border-color-default);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-text-muted);
        }

        /* Dispatch Form */
        .dispatch-form {
          padding: 1.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-row-2col {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        @media (min-width: 600px) {
          .form-row-2col {
            grid-template-columns: 1fr 1fr;
          }
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .field-label {
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--color-text-secondary);
        }

        .brutal-input {
          width: 100%;
          padding: 0.75rem 0.85rem;
          border: var(--border-width-md) solid var(--border-color-default);
          background-color: var(--bg-surface-input);
          color: var(--color-text-primary);
          font-size: 0.85rem;
          box-shadow: 2px 2px 0px var(--color-ink);
          border-radius: var(--radius-subtle);
          outline: none;
          box-sizing: border-box;
          transition: var(--transition-tactile);
        }

        .brutal-input::placeholder {
          color: var(--color-text-muted);
          opacity: 1;
        }

        .brutal-input option {
          background-color: var(--bg-surface-input);
          color: var(--color-text-primary);
        }

        .brutal-input:focus {
          border-color: var(--accent-action);
          box-shadow: 3px 3px 0px var(--accent-action);
        }

        .brutal-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .textarea {
          resize: vertical;
          min-height: 105px;
        }

        /* Inline Status Notifications */
        .status-notification {
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          border-radius: var(--radius-subtle);
          box-sizing: border-box;
          line-height: 1.4;
        }

        .status-notification.is-success {
          background-color: rgba(64, 192, 87, 0.12);
          border: var(--border-width-md) solid var(--status-online);
          color: #2b8a3e;
        }

        [data-theme='cyber-contrast'] .status-notification.is-success {
          background-color: rgba(64, 192, 87, 0.18);
          color: #51cf66;
          border-color: #51cf66;
        }

        .status-notification.is-error {
          background-color: rgba(250, 82, 82, 0.12);
          border: var(--border-width-md) solid var(--status-urgent);
          color: #c92a2a;
        }

        [data-theme='cyber-contrast'] .status-notification.is-error {
          background-color: rgba(250, 82, 82, 0.18);
          color: #ff6b6b;
          border-color: #ff6b6b;
        }

        .feedback-icon {
          flex-shrink: 0;
        }

        /* Submit Button States */
        .submit-btn {
          width: 100%;
          padding: 0.85rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 800;
          font-size: 0.85rem;
          cursor: pointer;
          box-sizing: border-box;
          transition: var(--transition-tactile);
        }

        .submit-btn.is-success {
          background-color: var(--status-online) !important;
          color: #000000 !important;
          border-color: var(--border-color-default) !important;
        }

        .submit-btn.is-error {
          background-color: var(--status-urgent) !important;
          color: #ffffff !important;
          border-color: var(--border-color-default) !important;
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: 2px 2px 0px var(--color-ink) !important;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
};
