import { useState } from "react";
import { TIERS } from "../hooks/useAuth";
import "../styles/landing.css";

export default function PricingPage({ onSelect, currentTier, onBack, onFaq }) {
  const [activating, setActivating] = useState(null);

  const handleSelect = (tierId) => {
    if (tierId === currentTier) return;
    setActivating(tierId);
    setTimeout(() => {
      onSelect(tierId);
      setActivating(null);
    }, 700);
  };

  return (
    <div className="l-page">
      {/* Demo banner */}
      <div className="l-demo-banner">
        🔬 Demo Mode — No real payments are processed. Selecting a plan saves your choice locally on this device.
      </div>

      {/* Nav */}
      <nav className="l-nav">
        <div className="l-nav-brand">
          <span className="l-nav-brand-icon">🪞</span>
          <span className="l-nav-brand-name">Memory Mirror</span>
        </div>
        <div className="l-nav-links">
          {onFaq  && <button className="l-nav-link" onClick={onFaq}>FAQ</button>}
          {onBack && <button className="l-nav-link" onClick={onBack}>← Back</button>}
        </div>
      </nav>

      <section className="l-section" style={{ paddingTop: 52 }}>
        <h1 className="l-section-title">
          Choose your <span style={{ color: "#4ade80" }}>care plan</span>
        </h1>
        <p className="l-section-sub">
          Start free. Upgrade when you are ready. Every plan includes a 7-day free trial.
        </p>

        <div className="l-pricing-grid">
          {TIERS.map((tier) => {
            const isCurrent  = tier.id === currentTier;
            const isActivating = activating === tier.id;

            return (
              <div
                key={tier.id}
                className={[
                  "l-pricing-card",
                  tier.highlight ? "highlight" : "",
                  isCurrent ? "current" : "",
                ].join(" ")}
              >
                {tier.badge && (
                  <div className={`l-pricing-badge${tier.id === "premium" ? " secondary" : ""}`}>
                    {tier.badge}
                  </div>
                )}
                {isCurrent && !tier.badge && (
                  <div className="l-pricing-badge" style={{ background: "#4ade80", color: "#07100a" }}>
                    ✓ Current Plan
                  </div>
                )}

                <div className="l-pricing-name">{tier.name}</div>
                <div className="l-pricing-price">
                  {tier.price === 0 ? "Free" : `$${tier.price}`}
                </div>
                <div className="l-pricing-price-sub">{tier.priceLabel}</div>
                <p className="l-pricing-desc">{tier.description}</p>

                <ul className="l-pricing-features">
                  {tier.features.map((f, i) => (
                    <li key={i} className="l-pricing-feature">
                      <span className="l-pricing-check">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={`l-pricing-cta ${isCurrent ? "active-plan" : tier.highlight ? "primary" : "outline"}`}
                  onClick={() => handleSelect(tier.id)}
                  disabled={isCurrent || !!activating}
                >
                  {isCurrent
                    ? "✓ Current Plan"
                    : isActivating
                    ? "Activating…"
                    : tier.cta}
                </button>
              </div>
            );
          })}
        </div>

        <div className="l-pricing-demo-note">
          <strong>Demo Mode:</strong> This is a demonstration application. No real payment is ever processed.<br />
          Selecting a plan saves your preference locally on your device only.
        </div>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button className="l-btn-small" onClick={onFaq}>Have questions? View our FAQ →</button>
        </div>
      </section>

      <footer className="l-footer" style={{ marginTop: "auto" }}>
        <div className="l-footer-brand">🪞 Memory Mirror · MM AI Technologies · Demo Mode</div>
      </footer>
    </div>
  );
}
