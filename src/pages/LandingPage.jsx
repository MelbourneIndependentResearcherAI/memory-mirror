import "../styles/landing.css";

const FEATURES = [
  { icon: "🧠", title: "Memory Mirror",     desc: "A digital memory book — store photos, stories and life moments that matter most." },
  { icon: "🌿", title: "Carer Companion AI", desc: "Six warm, culturally diverse AI carers available 24/7. Never condescending. Always adult to adult." },
  { icon: "💜", title: "Little Ones AI",     desc: "AI grandchildren who chat, ask questions and make Nanny or Poppy feel like the most important person alive." },
  { icon: "🌅", title: "Fresh Start AI",     desc: "A gentle morning routine — affirmations, hydration reminders and a simple wellness checklist." },
  { icon: "🎵", title: "Music Therapy",      desc: "Familiar, calming music from the 50s–70s — proven to reduce agitation and improve mood." },
  { icon: "🖼️", title: "Photo Hub",          desc: "Browse cherished memories. Talk about them together. Keep the past alive and vivid." },
];

const PERSONAS = [
  {
    icon: "👴",
    title: "People living with dementia",
    desc: "Memory Mirror gives you a warm, patient companion who is always available — never rushed, never condescending. Speak naturally, share memories, and feel genuinely heard at any hour.",
  },
  {
    icon: "❤️",
    title: "Family carers",
    desc: "Caring for a loved one with dementia is one of the most demanding roles there is. Memory Mirror is here to share the load — providing engagement, stimulation and companionship when you need a rest.",
  },
  {
    icon: "🏥",
    title: "Professional carers & aged care",
    desc: "Add Memory Mirror to your care toolkit. It sits alongside your existing care routines, providing AI-powered engagement that scales across your residents without replacing the irreplaceable human touch.",
  },
];

const STEPS = [
  { num: "1", title: "Create your account",        desc: "Quick sign-up — just your name and email. No credit card required to start." },
  { num: "2", title: "Choose your care plan",       desc: "Start free or choose the Care Plan for AI companions and the full feature suite." },
  { num: "3", title: "Begin your care journey",     desc: "Your loved one is ready to talk, remember and connect — from the very first minute." },
];

export default function LandingPage({ onGetStarted, onSignIn, onFaq, onPricing }) {
  return (
    <div className="l-page">
      {/* Demo banner */}
      <div className="l-demo-banner">
        🔬 Demo Mode — No real payments are processed. All data is stored locally on this device only.
      </div>

      {/* Nav */}
      <nav className="l-nav">
        <div className="l-nav-brand">
          <span className="l-nav-brand-icon">🪞</span>
          <span className="l-nav-brand-name">Memory Mirror</span>
        </div>
        <div className="l-nav-links">
          <button className="l-nav-link" onClick={onFaq}>FAQ</button>
          <button className="l-nav-link" onClick={onPricing}>Pricing</button>
          <button className="l-nav-btn" onClick={onSignIn}>Sign In</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="l-hero">
        <div className="l-hero-glow" />

        <div className="l-hero-badge">
          <span className="l-hero-badge-dot" />
          Trusted by families and carers across Australia
        </div>

        <h1 className="l-hero-title">
          Your loved one deserves a companion who is{" "}
          <span className="l-hero-title-accent">always there.</span>
        </h1>

        <p className="l-hero-sub">
          Memory Mirror is a premium AI care companion designed specifically for people living with dementia — and the families and carers who support them.
        </p>

        <div className="l-hero-actions">
          <button className="l-btn-primary" onClick={onGetStarted}>
            Get Started Free →
          </button>
          <button className="l-btn-ghost" onClick={onPricing}>
            See Pricing
          </button>
        </div>
      </section>

      <hr className="l-section-divider" />

      {/* What is Memory Mirror */}
      <section className="l-section">
        <h2 className="l-section-title">
          What is <span style={{ color: "#4ade80" }}>Memory Mirror</span>?
        </h2>
        <p className="l-section-sub">
          A suite of compassionate AI tools — built from the ground up for people living with dementia, their families, and their carers.
        </p>
        <div className="l-feature-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="l-feature-card">
              <div className="l-feature-icon">{f.icon}</div>
              <div className="l-feature-title">{f.title}</div>
              <p className="l-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="l-section-divider" />

      {/* Who it's for */}
      <section className="l-section">
        <h2 className="l-section-title">Who is Memory Mirror for?</h2>
        <p className="l-section-sub">
          Whether you are living with dementia yourself, caring for a loved one, or working in aged care — Memory Mirror was built with you in mind.
        </p>
        <div className="l-persona-grid">
          {PERSONAS.map((p, i) => (
            <div key={i} className="l-persona-card">
              <div className="l-persona-icon">{p.icon}</div>
              <div className="l-persona-title">{p.title}</div>
              <p className="l-persona-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="l-section-divider" />

      {/* How it works */}
      <section className="l-section">
        <h2 className="l-section-title">How it works</h2>
        <p className="l-section-sub">Getting started takes less than two minutes.</p>
        <div className="l-steps">
          {STEPS.map((s, i) => (
            <div key={i} className="l-step">
              <div className="l-step-num">{s.num}</div>
              <div className="l-step-title">{s.title}</div>
              <p className="l-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="l-section-divider" />

      {/* Pricing preview */}
      <section className="l-section">
        <h2 className="l-section-title">Simple, honest pricing</h2>
        <p className="l-section-sub">
          Start free. Upgrade when you are ready. Cancel anytime.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Free", price: "$0", desc: "Memory journaling, photos, music, and safe banking view.", cta: "Start Free" },
            { label: "Care Plan", price: "$6.99/mo", desc: "All Free features + AI companions, morning routine, and more.", cta: "Try 7 Days Free", highlight: true },
            { label: "Premium", price: "$14.99/mo", desc: "The full Memory Mirror suite — all 6 carers, all 6 AI grandchildren.", cta: "Try 7 Days Free" },
          ].map((t, i) => (
            <div key={i} style={{
              background: t.highlight ? "linear-gradient(145deg, #0d2416, #091510)" : "#0f1c11",
              border: `1px solid ${t.highlight ? "#2e5c34" : "#1a2e1c"}`,
              borderRadius: 18,
              padding: "28px 22px",
              textAlign: "center",
              transform: t.highlight ? "translateY(-4px)" : "none",
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 }}>{t.label}</div>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1, marginBottom: 12 }}>{t.price}</div>
              <p style={{ fontSize: 13, color: "#86efac", lineHeight: 1.7, marginBottom: 20 }}>{t.desc}</p>
              <button className="l-btn-primary" style={{ width: "100%", fontSize: 14, padding: "11px" }} onClick={onGetStarted}>{t.cta}</button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <button className="l-btn-small" onClick={onPricing}>View full pricing details →</button>
        </div>
      </section>

      {/* CTA Banner */}
      <div className="l-cta-banner">
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 className="l-cta-title">
            Your loved one is never alone.<br />
            <span style={{ color: "#4ade80" }}>Start for free today.</span>
          </h2>
          <p className="l-cta-sub">
            No credit card. No commitment. Just compassionate care, from the very first minute.
          </p>
          <button className="l-btn-primary" onClick={onGetStarted}>
            Create Your Account →
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="l-footer">
        <div className="l-footer-brand">🪞 Memory Mirror · MM AI Technologies</div>
        <div className="l-footer-links">
          <button className="l-footer-link" onClick={onFaq}>FAQ</button>
          <button className="l-footer-link" onClick={onPricing}>Pricing</button>
          <button className="l-footer-link" onClick={onGetStarted}>Sign Up</button>
        </div>
      </footer>
    </div>
  );
}
