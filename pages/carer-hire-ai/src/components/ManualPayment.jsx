import { useState } from 'react';

const PAYID = 'mickiimac@up.me';
const CONTACT_EMAIL = 'mcnamaram86@gmail.com';

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
    maxWidth: 480,
    width: '100%',
    padding: '2rem',
    position: 'relative',
    color: '#fff',
  },
};

function buildMailtoLink(plan) {
  const subject = encodeURIComponent(
    `Carer Hire AI — Subscribe to ${plan.name} (${plan.priceLabel}${plan.period ? ' ' + plan.period : ''})`
  );
  const body = encodeURIComponent(
    `Hi,\n\nI'd like to subscribe to the ${plan.name} plan at ${plan.priceLabel}${plan.period ? ' ' + plan.period : ''}.\n\nI'll be making payment via PayID to ${PAYID}.\n\nPlease activate my subscription once payment is received.\n\nThanks`
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

export default function ManualPayment({ plan, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!plan) return null;

  const accent = plan.accent ?? '#81C784';

  function handleCopy() {
    navigator.clipboard.writeText(PAYID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      setCopied(false);
    });
  }

  return (
    <div
      style={MODAL_STYLES.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={MODAL_STYLES.modal} role="dialog" aria-modal="true">
        {/* Close */}
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

        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, marginBottom: 6 }}>
          How to Subscribe
        </h2>
        <p style={{ color: '#aaa', fontSize: 13, lineHeight: 1.55, marginBottom: 20 }}>
          Pay via PayID below, then email us with your chosen plan and we'll activate your subscription within 24 hours.
        </p>

        {/* Plan summary */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: '#12122a', border: `1px solid ${accent}`,
          borderRadius: 12, padding: '12px 16px', marginBottom: 20,
        }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>{plan.name}</span>
          <span style={{ color: accent, fontWeight: 800, fontSize: 20 }}>
            {plan.priceLabel}{plan.period ? ` ${plan.period}` : ''}
          </span>
        </div>

        {/* PayID */}
        <div style={{
          background: '#12122a', border: '1px solid #2a2a4a',
          borderRadius: 12, padding: '16px 18px', marginBottom: 20,
        }}>
          <p style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 700 }}>
            Pay via PayID
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>{PAYID}</span>
            <button
              onClick={handleCopy}
              style={{
                padding: '6px 14px',
                background: copied ? accent : 'transparent',
                border: `1px solid ${copied ? accent : '#2a2a4a'}`,
                borderRadius: 8,
                color: copied ? '#0d1a0d' : '#888',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Email button */}
        <a
          href={buildMailtoLink(plan)}
          style={{
            display: 'block',
            width: '100%',
            padding: '13px',
            borderRadius: 12,
            background: accent,
            color: '#0d1a0d',
            fontSize: 14,
            fontWeight: 700,
            textDecoration: 'none',
            textAlign: 'center',
            boxSizing: 'border-box',
            fontFamily: "'Playfair Display', Georgia, serif",
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          ✉️ Email Us to Subscribe
        </a>

        <p style={{ color: '#555', fontSize: 12, textAlign: 'center', marginTop: 12 }}>
          {CONTACT_EMAIL}
        </p>
      </div>
    </div>
  );
}
