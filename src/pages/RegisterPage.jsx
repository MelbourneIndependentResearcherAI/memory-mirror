import { useState } from "react";
import "../styles/landing.css";

export default function RegisterPage({ onRegister, onBack, onSignIn }) {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!name.trim())                                e.name  = "Please enter your name.";
    if (!email.trim())                               e.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email address.";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    // Simulate a brief delay so it feels like a real sign-up
    setTimeout(() => {
      onRegister(name, email);
    }, 600);
  };

  return (
    <div className="l-page">
      {/* Demo banner */}
      <div className="l-demo-banner">
        🔬 Demo Mode — Your information is stored locally on this device only and never sent anywhere.
      </div>

      <div className="l-form-card">
        <div className="l-form-logo">🪞</div>

        <h1 className="l-form-title">Let's get you set up</h1>
        <p className="l-form-sub">
          Just your name and email — that's all we need to get started.<br />
          No credit card required.
        </p>

        <form className="l-form" onSubmit={handleSubmit} noValidate>
          <div className="l-form-group">
            <label className="l-form-label" htmlFor="reg-name">Your name</label>
            <input
              id="reg-name"
              type="text"
              className={`l-form-input${errors.name ? " error" : ""}`}
              value={name}
              onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: "" })); }}
              placeholder="e.g. Margaret Smith"
              autoComplete="name"
              autoFocus
            />
            {errors.name && <span className="l-form-error">{errors.name}</span>}
          </div>

          <div className="l-form-group">
            <label className="l-form-label" htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
              type="email"
              className={`l-form-input${errors.email ? " error" : ""}`}
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })); }}
              placeholder="e.g. margaret@example.com"
              autoComplete="email"
            />
            {errors.email && <span className="l-form-error">{errors.email}</span>}
          </div>

          <button
            type="submit"
            className="l-form-submit"
            disabled={submitting}
          >
            {submitting ? "Setting up your account…" : "Continue to Choose a Plan →"}
          </button>
        </form>

        <div className="l-form-footer">
          Already have an account?{" "}
          <button onClick={onSignIn}>Sign in</button>
        </div>

        <div className="l-form-footer" style={{ marginTop: 8 }}>
          <button onClick={onBack} style={{ color: "#3a5540" }}>← Back to home</button>
        </div>
      </div>
    </div>
  );
}
