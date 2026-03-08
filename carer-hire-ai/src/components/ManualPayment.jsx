import { useState } from 'react';

const BANK_DETAILS = {
  bsb: '633-123',
  account: '116572719',
  payId: 'mickiimac@up.me',
  accountName: 'Carer Hire AI',
};

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
    maxWidth: 520,
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '2rem',
    position: 'relative',
    color: '#fff',
  },
};

export default function ManualPayment({ plan, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reference = plan
    ? `CHA-${plan.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    : '';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Please enter your name and email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/manual-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app: 'carer-hire-ai',
          planId: plan.id,
          planName: plan.name,
          amount: plan.price,
          name: name.trim(),
          email: email.trim(),
          reference,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Unable to connect. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!plan) return null;

  const accent = plan.accent ?? '#81C784';

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

  return (
    <div
      style={MODAL_STYLES.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={MODAL_STYLES.modal} role="dialog" aria-modal="true">
        {/* Close button */}
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
              background: accent, color: '#0d1a0d',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700, margin: '0 auto 20px',
            }}>
              ✓
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, marginBottom: 12 }}>
              Payment details received!
            </h2>
            <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
              Thanks, <strong style={{ color: '#fff' }}>{name}</strong>. We'll activate your{' '}
              <strong style={{ color: accent }}>{plan.name}</strong> plan once your bank transfer arrives.
            </p>
            <p style={{ color: '#aaa', fontSize: 13, lineHeight: 1.6 }}>
              Your reference: <code style={{ background: '#2a2a4a', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>{reference}</code>
            </p>
            <button
              onClick={onClose}
              style={{
                marginTop: 20, padding: '11px 32px',
                background: accent, color: '#0d1a0d',
                border: 'none', borderRadius: 12,
                fontWeight: 700, cursor: 'pointer', fontSize: 14,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, marginBottom: 6 }}>
              Pay by Bank Transfer
            </h2>
            <p style={{ color: '#aaa', fontSize: 13, lineHeight: 1.55, marginBottom: 20 }}>
              Transfer the amount for your selected plan to the account below, then complete the
              form so we can activate your subscription.
            </p>

            {/* Plan summary */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#12122a', border: `1px solid ${accent}`,
              borderRadius: 12, padding: '12px 16px', marginBottom: 20,
            }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{plan.name}</span>
              <span style={{ color: accent, fontWeight: 800, fontSize: 18 }}>
                {plan.priceLabel}{plan.period ? ` ${plan.period}` : ''}
              </span>
            </div>

            {/* Bank details */}
            <div style={{
              background: '#12122a', border: '1px solid #2a2a4a',
              borderRadius: 12, padding: '16px 18px', marginBottom: 20,
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#fff' }}>
                Bank Transfer Details
              </h3>
              {[
                ['Account Name', BANK_DETAILS.accountName],
                ['BSB', BANK_DETAILS.bsb],
                ['Account Number', BANK_DETAILS.account],
                ['PayID', BANK_DETAILS.payId],
                ['Reference', reference],
              ].map(([label, value], i, arr) => (
                <div
                  key={label}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: i < arr.length - 1 ? '1px solid #2a2a4a' : 'none',
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: '#888' }}>{label}</span>
                  <span style={{
                    fontWeight: 600, color: '#fff',
                    fontFamily: label === 'Reference' ? 'monospace' : 'inherit',
                    background: label === 'Reference' ? '#2a2a4a' : 'none',
                    padding: label === 'Reference' ? '2px 6px' : 0,
                    borderRadius: label === 'Reference' ? 4 : 0,
                    fontSize: label === 'Reference' ? 12 : 13,
                  }}>
                    {value}
                  </span>
                </div>
              ))}
              <p style={{ color: '#888', fontSize: 12, marginTop: 10, lineHeight: 1.5 }}>
                ⚠️ Please include the reference above so we can match your payment.
              </p>
            </div>

            {/* Confirmation form */}
            <form onSubmit={handleSubmit}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Confirm your details</h3>
              <label style={{ fontSize: 13, color: '#aaa', display: 'block', marginBottom: 4 }} htmlFor="mp-cha-name">
                Full name
              </label>
              <input
                id="mp-cha-name"
                type="text"
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
              />
              <label style={{ fontSize: 13, color: '#aaa', display: 'block', marginTop: 10, marginBottom: 4 }} htmlFor="mp-cha-email">
                Email address
              </label>
              <input
                id="mp-cha-email"
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
                  background: accent, color: '#0d1a0d',
                  border: 'none', borderRadius: 12,
                  fontWeight: 700, fontSize: 14, cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  fontFamily: "'Playfair Display', Georgia, serif",
                  transition: 'opacity 0.2s',
                }}
              >
                {loading ? 'Submitting…' : "I've sent the transfer"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
