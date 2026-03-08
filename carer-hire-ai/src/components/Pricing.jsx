import { useState } from 'react';
import FreeTrial from './FreeTrial';
import ManualPayment from './ManualPayment';

const PLANS = [
  {
    id: 'free_trial',
    name: '7-Day Free Trial',
    price: null,
    priceLabel: 'Free',
    period: '',
    description: 'Try Carer Hire AI with no commitment. Full access to all 6 AI carers for 7 days.',
    features: [
      'Unlimited sessions for 7 days',
      'Hands-free voice mode',
      'All 6 AI carers available',
      'No credit card required',
    ],
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
    highlight: false,
    color: '#1A3A4A',
    accent: '#5DADE2',
  },
];

export default function Pricing() {
  const [showTrial, setShowTrial] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

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
        <p style={{ color: '#aaa', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
          Human carers cost $35–$80 per hour. We cost $2.99 per session.
          Your loved one deserves 24/7 companionship — not just when it's affordable.
        </p>
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

            {plan.price === null ? (
              <button
                onClick={() => setShowTrial(true)}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: 12,
                  border: '1px solid #81C784',
                  background: '#81C784',
                  color: '#0d1a0d',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  transition: 'all 0.2s',
                }}
              >
                Start 7-Day Free Trial
              </button>
            ) : (
              <button
                onClick={() => setSelectedPlan(plan)}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: 12,
                  border: `1px solid ${plan.accent}`,
                  background: plan.highlight ? plan.accent : 'transparent',
                  color: plan.highlight ? '#0d1a0d' : plan.accent,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  transition: 'all 0.2s',
                }}
              >
                Contact to Subscribe
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 48, color: '#555', fontSize: 13 }}>
        <p>✉️ Contact us to subscribe &nbsp;•&nbsp; Cancel anytime &nbsp;•&nbsp; AUD pricing</p>
      </div>

      {showTrial && (
        <FreeTrial onClose={() => setShowTrial(false)} />
      )}

      {selectedPlan && (
        <ManualPayment plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}
    </div>
  );
}
