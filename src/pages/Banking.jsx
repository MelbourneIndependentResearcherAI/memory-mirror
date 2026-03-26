export default function Banking({ voiceKey, onBack }) {
  const fakeBalance = "12,847.32";

  return (
    <div className="feature-screen">
      <header className="feature-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h1>Safe Bank</h1>
        <p>A calm, read‑only “bank” view for reassurance.</p>
      </header>

      <div className="bank-card">
        <h2>Everyday Account</h2>
        <p className="label">Available balance</p>
        <p className="balance">${fakeBalance}</p>
        <p className="note">
          This is a safe, simulated view. No real money can be moved here.
        </p>
      </div>
    </div>
  );
}
