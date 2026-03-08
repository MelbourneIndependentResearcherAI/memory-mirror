import { useState } from 'react';
import { supabase } from '../utils/supabase';
import '../styles/FreeTrial.css';

export default function FreeTrial({ onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const { error: dbError } = await supabase
        .from('free_trials')
        .insert([{ name: name.trim(), email: email.trim(), app: 'little-ones-ai' }]);

      if (dbError) {
        setError('Unable to register for free trial. Please try again or contact support if the problem persists.');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Unable to connect. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="free-trial-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="free-trial-modal" role="dialog" aria-modal="true" aria-labelledby="ft-title">
        <button className="free-trial-close" onClick={onClose} aria-label="Close">✕</button>

        {submitted ? (
          <div className="free-trial-success">
            <div className="free-trial-success-icon">✓</div>
            <h2>You're in!</h2>
            <p>
              Thanks, <strong>{name}</strong>! Your 7-day free trial is ready.
              Start exploring personalised activities for your little one.
            </p>
            <button className="btn-primary" onClick={onClose}>Start Exploring</button>
          </div>
        ) : (
          <>
            <h2 id="ft-title" className="free-trial-title">Start Your 7-Day Free Trial</h2>
            <p className="free-trial-subtitle">
              No credit card required. Full access to all features for 7 days — completely free.
            </p>

            <form onSubmit={handleSubmit} className="free-trial-form">
              <label className="free-trial-label" htmlFor="ft-name">Full name</label>
              <input
                id="ft-name"
                type="text"
                className="free-trial-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
              />
              <label className="free-trial-label" htmlFor="ft-email">Email address</label>
              <input
                id="ft-email"
                type="email"
                className="free-trial-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {error && <p className="free-trial-error">{error}</p>}
              <button
                type="submit"
                className="btn-primary free-trial-submit"
                disabled={loading}
              >
                {loading ? 'Starting trial…' : 'Start My Free Trial'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
