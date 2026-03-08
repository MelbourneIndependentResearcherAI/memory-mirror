import { useState } from 'react';
import '../styles/ManualPayment.css';

const BANK_DETAILS = {
  bsb: '633-123',
  account: '116572719',
  payId: 'mickiimac@up.me',
  accountName: 'Little Ones AI',
};

export default function ManualPayment({ plan, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reference = plan
    ? `LOA-${plan.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`
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
          app: 'little-ones-ai',
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

  return (
    <div className="manual-payment-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="manual-payment-modal" role="dialog" aria-modal="true" aria-labelledby="mp-title">
        <button className="manual-payment-close" onClick={onClose} aria-label="Close">✕</button>

        {submitted ? (
          <div className="manual-payment-success">
            <div className="manual-payment-success-icon">✓</div>
            <h2>Payment details received!</h2>
            <p>
              Thanks, <strong>{name}</strong>. We'll activate your <strong>{plan.name}</strong> subscription
              once your bank transfer arrives.
            </p>
            <p className="manual-payment-ref-note">
              Your reference number: <code>{reference}</code>
            </p>
            <button className="btn-primary" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <h2 id="mp-title" className="manual-payment-title">Pay by Bank Transfer</h2>
            <p className="manual-payment-subtitle">
              Transfer the amount for your selected plan to the account below, then complete
              the form so we can activate your subscription.
            </p>

            {/* Plan summary */}
            <div className="manual-payment-plan-summary">
              <span className="manual-payment-plan-name">{plan.name}</span>
              <span className="manual-payment-plan-price">
                {plan.priceLabel}{plan.period ? ` ${plan.period}` : ''}
              </span>
            </div>

            {/* Bank details */}
            <div className="manual-payment-bank">
              <h3 className="manual-payment-bank-title">Bank Transfer Details</h3>
              <div className="manual-payment-bank-grid">
                <div className="manual-payment-bank-row">
                  <span className="manual-payment-bank-label">Account Name</span>
                  <span className="manual-payment-bank-value">{BANK_DETAILS.accountName}</span>
                </div>
                <div className="manual-payment-bank-row">
                  <span className="manual-payment-bank-label">BSB</span>
                  <span className="manual-payment-bank-value">{BANK_DETAILS.bsb}</span>
                </div>
                <div className="manual-payment-bank-row">
                  <span className="manual-payment-bank-label">Account Number</span>
                  <span className="manual-payment-bank-value">{BANK_DETAILS.account}</span>
                </div>
                <div className="manual-payment-bank-row">
                  <span className="manual-payment-bank-label">PayID</span>
                  <span className="manual-payment-bank-value">{BANK_DETAILS.payId}</span>
                </div>
                <div className="manual-payment-bank-row">
                  <span className="manual-payment-bank-label">Reference</span>
                  <span className="manual-payment-bank-value manual-payment-ref">{reference}</span>
                </div>
              </div>
              <p className="manual-payment-bank-note">
                ⚠️ Please include the reference above so we can match your payment.
              </p>
            </div>

            {/* Confirmation form */}
            <form onSubmit={handleSubmit} className="manual-payment-form">
              <h3 className="manual-payment-form-title">Confirm your details</h3>
              <label className="manual-payment-label" htmlFor="mp-name">Full name</label>
              <input
                id="mp-name"
                type="text"
                className="manual-payment-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
              />
              <label className="manual-payment-label" htmlFor="mp-email">Email address</label>
              <input
                id="mp-email"
                type="email"
                className="manual-payment-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {error && <p className="manual-payment-error">{error}</p>}
              <button
                type="submit"
                className="btn-primary manual-payment-submit"
                disabled={loading}
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
