import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import '../styles/Pricing.css';
import ManualPayment from './ManualPayment';

const PLANS = [
  {
    id: 'free_trial',
    name: 'Free Trial',
    price: null,
    priceLabel: 'Free',
    period: '',
    description: 'Try Little Ones AI with no commitment. Explore personalised activities for your grandchild.',
    features: [
      '7-day free access',
      'AI-personalised activities',
      'All age groups (0–6 years)',
      'No credit card required',
    ],
    cta: 'Start Free Trial',
    highlight: false,
    recommended: false,
  },
  {
    id: 'one_grandchild',
    name: 'One Grandchild',
    price: 14.99,
    priceLabel: '$14.99',
    period: '/month',
    description: 'Perfect for grandparents — fully personalised activities tailored to one grandchild.',
    features: [
      'Activities for 1 child',
      'AI personalisation',
      'Milestone tracking',
      'Weekly activity packs',
      'Cancel anytime',
    ],
    cta: 'Get Started',
    highlight: false,
    recommended: false,
  },
  {
    id: 'full_family',
    name: 'Full Family',
    price: 29.99,
    priceLabel: '$29.99',
    period: '/month',
    description: 'For parents and grandparents with multiple little ones. Up to 4 children covered.',
    features: [
      'Activities for up to 4 children',
      'Individual AI profiles per child',
      'Milestone tracking for all',
      'Family activity calendar',
      'Cancel anytime',
    ],
    cta: 'Choose Full Family',
    highlight: true,
    recommended: true,
    badge: 'Best Value',
  },
  {
    id: 'bundle',
    name: 'Bundle',
    price: 54.99,
    priceLabel: '$54.99',
    period: '/month',
    description: 'Everything in Full Family plus full access to Carer Hire AI — the complete intergenerational care suite.',
    features: [
      'Everything in Full Family',
      'Unlimited children',
      'Carer Hire AI included',
      'Priority support',
      'Early access to new features',
      'Cancel anytime',
    ],
    cta: 'Get the Bundle',
    highlight: false,
    recommended: false,
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
      alert('Welcome! Your free trial is ready. Explore the activities and start your child\'s learning journey.');
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
    <section className="pricing-section">
      <div className="pricing-header">
        <h2 className="section-title">Simple, Transparent Pricing</h2>
        <p className="pricing-subtitle">
          Support your little one's development every day, for less than a cup of coffee a week.
        </p>

        <div className="pricing-email-row">
          <input
            type="email"
            className="pricing-email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
          />
        </div>
        {error && <p className="pricing-error">{error}</p>}
      </div>

      <div className="pricing-grid">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`pricing-card ${plan.highlight ? 'pricing-card--highlight' : ''}`}
          >
            {plan.badge && (
              <div className="pricing-badge">{plan.badge}</div>
            )}

            <div className="pricing-card-header">
              <h3 className="pricing-plan-name">{plan.name}</h3>
              <div className="pricing-price-row">
                <span className="pricing-price">{plan.priceLabel}</span>
                {plan.period && <span className="pricing-period">{plan.period}</span>}
              </div>
              <p className="pricing-plan-desc">{plan.description}</p>
            </div>

            <ul className="pricing-features">
              {plan.features.map((feature) => (
                <li key={feature} className="pricing-feature-item">
                  <span className="pricing-check">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`btn-primary pricing-cta ${plan.highlight ? 'pricing-cta--highlight' : ''}`}
              onClick={() => handleSelect(plan)}
              disabled={loading === plan.id}
            >
              {loading === plan.id ? 'Redirecting…' : plan.cta}
            </button>

            {plan.price !== null && (
              <button
                className="pricing-manual-btn"
                onClick={() => setManualPlan(plan)}
              >
                Pay by Bank Transfer
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="pricing-footer-note">
        🔒 Secure payments via Stripe &nbsp;•&nbsp; Cancel anytime &nbsp;•&nbsp; AUD pricing
      </p>

      {manualPlan && (
        <ManualPayment plan={manualPlan} onClose={() => setManualPlan(null)} />
      )}
    </section>
  );
}
