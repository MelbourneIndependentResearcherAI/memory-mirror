export default function Banking({ onBack }) {
  const balance = "12,847.32";
  const recent = [
    { id: 1, label: "Groceries", amount: "-$54.90" },
    { id: 2, label: "Pension Deposit", amount: "+$820.00" },
    { id: 3, label: "Electricity Bill", amount: "-$120.40" },
  ];

  return (
    <div className="bank-container">
      <button className="back-btn" onClick={onBack}>← Back</button>

      <h1 className="bank-title">Safe Banking</h1>
      <p className="bank-sub">A calm, read-only view for reassurance.</p>

      <div className="bank-card">
        <p className="bank-label">Available balance</p>
        <p className="bank-balance">${balance}</p>
        <p className="bank-note">
          This is a safe, simulated view. No real money can be moved here.
        </p>
      </div>

      <h2 className="bank-section-title">Recent activity</h2>
      <div className="bank-list">
        {recent.map((item) => (
          <div key={item.id} className="bank-row">
            <span>{item.label}</span>
            <span className="bank-amount">{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
