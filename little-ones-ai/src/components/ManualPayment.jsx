import { useState } from 'react';
import '../styles/ManualPayment.css';

const PAYID = 'mickiimac@up.me';
const CONTACT_EMAIL = 'mcnamaram86@gmail.com';

function buildMailtoLink(plan) {
  const subject = encodeURIComponent(
    `Little Ones AI — Subscribe to ${plan.name} (${plan.priceLabel}${plan.period ? ' ' + plan.period : ''})`
  );
  const body = encodeURIComponent(
    `Hi,\n\nI'd like to subscribe to the ${plan.name} plan at ${plan.priceLabel}${plan.period ? ' ' + plan.period : ''}.\n\nI'll be making payment via PayID to ${PAYID}.\n\nPlease activate my subscription once payment is received.\n\nThanks`
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

export default function ManualPayment({ plan, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!plan) return null;

  function handleCopy() {
    navigator.clipboard.writeText(PAYID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      setCopied(false);
    });
  }

  return (
    <div className="manual-payment-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="manual-payment-modal" role="dialog" aria-modal="true" aria-labelledby="mp-title">
        <button className="manual-payment-close" onClick={onClose} aria-label="Close">✕</button>

        <h2 id="mp-title" className="manual-payment-title">How to Subscribe</h2>
        <p className="manual-payment-subtitle">
          Pay via PayID below, then email us with your chosen plan and we'll activate your subscription within 24 hours.
        </p>

        {/* Plan summary */}
        <div className="manual-payment-plan-summary">
          <span className="manual-payment-plan-name">{plan.name}</span>
          <span className="manual-payment-plan-price">
            {plan.priceLabel}{plan.period ? ` ${plan.period}` : ''}
          </span>
        </div>

        {/* PayID */}
        <div className="manual-payment-payid-box">
          <p className="manual-payment-payid-label">Pay via PayID</p>
          <div className="manual-payment-payid-row">
            <span className="manual-payment-payid-value">{PAYID}</span>
            <button
              className={`manual-payment-copy-btn${copied ? ' copied' : ''}`}
              onClick={handleCopy}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Email button */}
        <a
          href={buildMailtoLink(plan)}
          className="btn-primary manual-payment-email-btn"
        >
          ✉️ Email Us to Subscribe
        </a>

        <p className="manual-payment-contact-note">{CONTACT_EMAIL}</p>
      </div>
    </div>
  );
}
