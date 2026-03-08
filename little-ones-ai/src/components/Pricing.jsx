import { useState } from 'react';
import '../styles/Pricing.css';
import FreeTrial from './FreeTrial';

const PLANS = [
  {
    id: 'free_trial',
    name: '7-Day Free Trial',
    price: null,
    priceLabel: 'Free',
    period: '',
    description: 'Try Little Ones AI with no commitment. Full access to all features for 7 days.',
    features: [
      '7-day free access',
      'AI-personalised activities',
      'All age groups (0–6 years)',
      'No credit card required',
    ],
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
    highlight: false,
    recommended: false,
  },
];

function buildMailtoLink(plan) {
  const subject = encodeURIComponent(
    `Little Ones AI — Subscribe to ${plan.name} (${plan.priceLabel}${plan.period ? ' ' + plan.period : ''})`
  );
  return `mailto:michael@memory-mirror.app?subject=${subject}`;
}

export default function Pricing() {
  const [showTrial, setShowTrial] = useState(false);

  return (
    <section className="pricing-section">
      <div className="pricing-header">
        <h2 className="section-title">Simple, Transparent Pricing</h2>
        <p className="pricing-subtitle">
          Support your little one's development every day, for less than a cup of coffee a week.
        </p>
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

            {plan.price === null ? (
              <button
                className="btn-primary pricing-cta"
                onClick={() => setShowTrial(true)}
              >
                Start 7-Day Free Trial
              </button>
            ) : (
              <a
                href={buildMailtoLink(plan)}
                className={`btn-primary pricing-cta ${plan.highlight ? 'pricing-cta--highlight' : ''}`}
              >
                Contact to Subscribe
              </a>
            )}
          </div>
        ))}
      </div>

      <p className="pricing-footer-note">
        ✉️ Contact us to subscribe &nbsp;•&nbsp; Cancel anytime &nbsp;•&nbsp; AUD pricing
      </p>

      {showTrial && (
        <FreeTrial onClose={() => setShowTrial(false)} />
      )}
    </section>
  );
}
