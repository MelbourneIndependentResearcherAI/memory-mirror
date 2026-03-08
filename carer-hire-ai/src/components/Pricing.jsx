import { useState } from 'react';
import ManualPayment from './ManualPayment';

const PLANS = [
  {
    id: 'free_trial',
    name: 'Free Trial',
    price: null,
    priceLabel: 'Free',
    period: '',
    description: 'Try Carer Hire AI with no commitment. Experience one full session with any carer.',
    features: [
      '1 free session with any carer',
      'Hands-free voice mode',
      'All 6 AI carers available',
      'No credit card required',
    ],
    cta: 'Start Free Trial',
    highlight: false,
    color: '#2a2a4a',
    accent: '#888',
  },
  {
    id: 'per_session',
    name: 'Per Session',
    price: 2.99,
    priceLabel: '$2.99',
    period: 'per session',
    description: 'Pay only for what you use. Perfect for occasional companionship or trying a new carer.',
    features: [
      'Unlimited session length',
      'Hands-free voice mode',
      'All 6 AI carers',
      'No subscription required',
    ],
    cta: 'Buy a Session',
    highlight: false,
    color: '#1B4020',
    accent: '#81C784',
  },
  {
    id: 'daily_companion',
    name: 'Daily Companion',
    price: 19.99,
    priceLabel: '$19.99',
    period: '/month',
    description: 'Daily connection for your loved one. Unlimited sessions every single day.',
    features: [
      'Unlimited daily sessions',
      'Hands-free voice mode',
      'All 6 AI carers',
      'Session history & notes',
      'Cancel anytime',
    ],
    cta: 'Start Daily Companion',
    highlight: true,
    color: '#2C5F2E',
    accent: '#81C784',
    badge: 'Most Popular',
  },
  {
    id: 'full_circle',
    name: 'Full Circle',
    price: 39.99,
    priceLabel: '$39.99',
    period: '/month',
    description: 'Complete care support for your whole family. Multi-user access with a family dashboard.',
    features: [
      'Everything in Daily Companion',
      'Up to 5 family members',
      'Family dashboard & reports',
      'Priority email support',
      'Early access to new carers',
      'Cancel anytime',
    ],
    cta: 'Start Full Circle',
    highlight: false,
    color: '#1A3A4A',
    accent: '#5DADE2',
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [manualPlan, setManualPlan] = useState(null);

  async function handleSelect(plan) {
    setError('');

    if (plan.id === 'free_trial') {
      // No payment needed — just acknowledge and proceed
      alert('Welcome! Your free trial is ready. Go back and start a conversation with any carer.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address to continue.');
      return;
    }

    setLoading(plan.id);

    try {
      const origin = window.location.origin;
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          email: email.trim(),
          successUrl: `${origin}/?payment=success&plan=${plan.id}`,
          cancelUrl: `${origin}/?payment=cancelled`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError('Unable to connect. Please check your internet connection and try again.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{ padding: '60px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(32px, 5vw, 54px)',
          fontWeight: 900,
          marginBottom: 16,
        }}>
          Simple, Honest <span style={{ color: '#81C784' }}>Pricing</span>
        </h1>
        <p style={{ color: '#aaa', fontSize: 16, maxWidth: 520, margin: '0 auto 32px' }}>
          Human carers cost $35–$80 per hour. We cost $2.99 per session.
          Your loved one deserves 24/7 companionship — not just when it's affordable.
        </p>

        {/* Email input */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 420, margin: '0 auto' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            style={{
              flex: 1,
              minWidth: 220,
              background: '#1e1e35',
              border: '1px solid #2a2a4a',
              borderRadius: 10,
              padding: '12px 16px',
              color: '#fff',
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>
        {error && (
          <p style={{ color: '#ef4444', fontSize: 13, marginTop: 10 }}>{error}</p>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20,
        alignItems: 'start',
      }}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: plan.highlight ? `linear-gradient(160deg, ${plan.color}cc, #0d1a0d)` : '#1a1a2e',
              border: `2px solid ${plan.highlight ? plan.accent : '#2a2a4a'}`,
              borderRadius: 20,
              padding: 28,
              position: 'relative',
              boxShadow: plan.highlight ? `0 0 40px ${plan.color}55` : 'none',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
          >
            {plan.badge && (
              <div style={{
                position: 'absolute',
                top: -14,
                left: '50%',
                transform: 'translateX(-50%)',
                background: plan.accent,
                color: '#0d1a0d',
                borderRadius: 20,
                padding: '4px 16px',
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}>
                {plan.badge}
              </div>
            )}

            <div style={{ marginBottom: 18 }}>
              <h3 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 20,
                marginBottom: 6,
                color: plan.highlight ? plan.accent : '#fff',
              }}>
                {plan.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>{plan.priceLabel}</span>
                {plan.period && (
                  <span style={{ color: '#888', fontSize: 14 }}>{plan.period}</span>
                )}
              </div>
              <p style={{ color: '#aaa', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{plan.description}</p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
              {plan.features.map((feature) => (
                <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#ccc' }}>
                  <span style={{ color: plan.accent, flexShrink: 0 }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelect(plan)}
              disabled={loading === plan.id}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 12,
                border: `1px solid ${plan.accent}`,
                background: plan.highlight ? plan.accent : 'transparent',
                color: plan.highlight ? '#0d1a0d' : plan.accent,
                fontSize: 14,
                fontWeight: 700,
                cursor: loading === plan.id ? 'wait' : 'pointer',
                fontFamily: "'Playfair Display', Georgia, serif",
                opacity: loading === plan.id ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
            >
              {loading === plan.id ? 'Redirecting…' : plan.cta}
            </button>

            {plan.price !== null && (
              <button
                onClick={() => setManualPlan(plan)}
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: 8,
                  padding: '9px',
                  background: 'none',
                  border: '1px solid #2a2a4a',
                  borderRadius: 12,
                  color: '#888',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = plan.accent; e.currentTarget.style.color = plan.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a4a'; e.currentTarget.style.color = '#888'; }}
              >
                Pay by Bank Transfer
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 48, color: '#555', fontSize: 13 }}>
        <p>🔒 Secure payments via Stripe &nbsp;•&nbsp; Cancel anytime &nbsp;•&nbsp; AUD pricing</p>
      </div>

      {manualPlan && (
        <ManualPayment plan={manualPlan} onClose={() => setManualPlan(null)} />
      )}
    </div>
  );
}
