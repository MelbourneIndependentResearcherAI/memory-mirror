import { useState } from 'react';
import { supabase } from '../utils/supabase';

const MODAL_STYLES = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.65)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modal: {
    background: '#1a1a2e',
    border: '1px solid #2a2a4a',
    borderRadius: 20,
    maxWidth: 440,
    width: '100%',
    padding: '2rem',
    position: 'relative',
    color: '#fff',
  },
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  background: '#12122a',
  border: '1px solid #2a2a4a',
  borderRadius: 10,
  color: '#fff',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  marginBottom: 4,
};

export default function FreeTrial({ onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const { error: dbError } = await supabase
        .from('free_trials')
        .insert([{ name: name.trim(), email: email.trim(), app: 'carer-hire-ai' }]);

      if (dbError) {
        setError('Unable to register for free trial. Please try again or contact support if the problem persists.');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Unable to connect. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={MODAL_STYLES.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={MODAL_STYLES.modal} role="dialog" aria-modal="true">
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none', color: '#888',
            fontSize: 16, cursor: 'pointer',
          }}
        >
          ✕
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#81C784', color: '#0d1a0d',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700, margin: '0 auto 20px',
            }}>
              ✓
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, marginBottom: 12 }}>
              You're in!
            </h2>
            <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.6 }}>
              Thanks, <strong style={{ color: '#fff' }}>{name}</strong>! Your 7-day free trial is ready.
              Head back and start a conversation with any carer.
            </p>
            <button
              onClick={onClose}
              style={{
                marginTop: 20, padding: '11px 32px',
                background: '#81C784', color: '#0d1a0d',
                border: 'none', borderRadius: 12,
                fontWeight: 700, cursor: 'pointer', fontSize: 14,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, marginBottom: 8 }}>
              Start Your 7-Day Free Trial
            </h2>
            <p style={{ color: '#aaa', fontSize: 13, lineHeight: 1.55, marginBottom: 20 }}>
              No credit card required. Full access to all 6 AI carers for 7 days — completely free.
            </p>

            <form onSubmit={handleSubmit}>
              <label style={{ fontSize: 13, color: '#aaa', display: 'block', marginBottom: 4 }} htmlFor="ft-cha-name">
                Full name
              </label>
              <input
                id="ft-cha-name"
                type="text"
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
              />
              <label style={{ fontSize: 13, color: '#aaa', display: 'block', marginTop: 10, marginBottom: 4 }} htmlFor="ft-cha-email">
                Email address
              </label>
              <input
                id="ft-cha-email"
                type="email"
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {error && <p style={{ color: '#ef4444', fontSize: 13, margin: '8px 0' }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', marginTop: 14, padding: '13px',
                  background: '#81C784', color: '#0d1a0d',
                  border: 'none', borderRadius: 12,
                  fontWeight: 700, fontSize: 14, cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  fontFamily: "'Playfair Display', Georgia, serif",
                  transition: 'opacity 0.2s',
                }}
              >
                {loading ? 'Starting trial…' : 'Start My Free Trial'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
