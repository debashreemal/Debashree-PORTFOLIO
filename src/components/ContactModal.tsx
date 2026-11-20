import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/sound';
import './ContactModal.css';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [navBottom, setNavBottom] = useState<number>(55);
  const [cardLeft, setCardLeft] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const stampPlayedRef = useRef(false);
  const lastKeySoundTimeRef = useRef(0);

  const handleTypingSound = (e: React.KeyboardEvent) => {
    // Ignore modifier and navigation keys alone
    if (
      [
        'Shift',
        'Control',
        'Alt',
        'Meta',
        'Tab',
        'CapsLock',
        'Escape',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
      ].includes(e.key)
    ) {
      return;
    }
    // Ignore keyboard shortcuts like Ctrl+C, Ctrl+V, etc.
    if (e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }
    // Throttle repeat keys so holding down a key stays smooth and gentle
    const now = performance.now();
    if (now - lastKeySoundTimeRef.current < 45) return;
    lastKeySoundTimeRef.current = now;

    // Organic micro-pitch variation for realistic physical keyboard feel
    const pitch = 0.96 + Math.random() * 0.08;
    playSound('softTap', pitch);
  };

  const handleSendStampSound = () => {
    if (stampPlayedRef.current) return;
    stampPlayedRef.current = true;
    playSound('stickerStamp');
    setTimeout(() => {
      stampPlayedRef.current = false;
    }, 250);
  };

  // Measure exact bottom coordinate of navbar & position anchored to navbar 'ABOUT' letter 'O'
  useEffect(() => {
    if (!isOpen) return;
    const updatePosition = () => {
      // 1. Navbar bottom for clean gap below navbar ("very little above": 14px)
      const navEl = document.querySelector('.nav');
      if (navEl) {
        const rect = navEl.getBoundingClientRect();
        setNavBottom(Math.round(rect.bottom));
      }

      // 2. Position card so its last right end aligns with the letter 'T' in navbar 'ABOUT' + shifted little towards the right
      const tNavEl = document.getElementById('nav-about-t') || document.getElementById('nav-about-o');
      if (tNavEl) {
        const tRect = tNavEl.getBoundingClientRect();
        const cardW = 356;
        const targetRight = Math.round(tRect.right) + 20;
        const idealLeft = targetRight - cardW;
        setCardLeft(Math.max(14, idealLeft));
      } else {
        const tEl = document.getElementById('connect-alpha-t');
        if (tEl) {
          const tRect = tEl.getBoundingClientRect();
          setCardLeft(Math.round(tRect.right) + 38);
        }
      }
    };

    updatePosition();
    const rafId = requestAnimationFrame(updatePosition);
    const timer = setTimeout(updatePosition, 60);
    window.addEventListener('resize', updatePosition);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset status on open
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSendStampSound();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('https://formsubmit.co/ajax/debashreee87@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          _subject: `Portfolio Message from ${name.trim() || 'Visitor'}`,
          _replyto: email.trim(),
          _captcha: 'false',
          _template: 'table',
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok || (data && (data.success === 'true' || data.success === true))) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
        setErrorMessage(data?.message || 'Could not send message. Please try again.');
      }
    } catch (err) {
      console.error('FormSubmit Error:', err);
      setStatus('error');
      setErrorMessage('Network connection error. Please try again.');
    }
  };

  return (
    <div
      className="contact-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onWheel={(e) => e.stopPropagation()}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div
        ref={cardRef}
        className="contact-modal-card"
        style={{
          top: navBottom + 14,
          left: cardLeft !== null ? cardLeft : undefined,
          right: cardLeft === null ? 'clamp(20px, 3.5vw, 54px)' : 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="contact-modal-header">
          <h2 id="contact-modal-title" className="contact-modal-title">
            Say Hello
          </h2>
          <button
            type="button"
            className="contact-modal-close-btn"
            onClick={() => {
              playSound('pop');
              onClose();
            }}
            aria-label="Close"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {status === 'success' ? (
          <div className="contact-modal-state-box success">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h3 className="contact-modal-state-title">Message Sent!</h3>
            <p className="contact-modal-state-desc">
              Thank you! Your message was delivered directly to debashreee87@gmail.com.
            </p>
            <button
              type="button"
              className="contact-modal-submit-btn"
              onClick={onClose}
              style={{ marginTop: 8, width: 'auto', padding: '9px 24px' }}
            >
              Done ✓
            </button>
          </div>
        ) : (
          <form className="contact-modal-form" onSubmit={handleSubmit} onKeyDown={handleTypingSound}>
            {status === 'error' && (
              <div className="contact-modal-state-box error">
                <p className="contact-modal-state-desc">{errorMessage}</p>
                <button
                  type="button"
                  className="contact-modal-retry-btn"
                  onClick={() => setStatus('idle')}
                >
                  Try Again
                </button>
              </div>
            )}

            <input
              type="text"
              className="contact-modal-input"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={status === 'sending'}
            />

            <input
              type="email"
              className="contact-modal-input"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'sending'}
            />

            <textarea
              className="contact-modal-textarea"
              placeholder="Write a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={status === 'sending'}
            />

            <button
              type="submit"
              className="contact-modal-submit-btn"
              disabled={status === 'sending'}
              onPointerDown={handleSendStampSound}
            >
              {status === 'sending' ? (
                <>
                  <span className="contact-modal-spinner" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
