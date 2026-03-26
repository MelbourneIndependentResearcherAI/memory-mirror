export default function Banking({ onBack }) {
  const balance = "12,847.32";
  const recent = [
    { id: 1, label: "Pension Deposit",   amount: "+$820.00",  icon: "💰" },
    { id: 2, label: "Groceries",         amount: "-$54.90",   icon: "🛒" },
    { id: 3, label: "Electricity Bill",  amount: "-$120.40",  icon: "⚡" },
    { id: 4, label: "Pharmacy",          amount: "-$18.60",   icon: "💊" },
  ];

  return (
    <div className="bank-container">
      <button className="back-btn" onClick={onBack}>← Home</button>

      <h1 className="bank-title">My Accounts</h1>
      <p className="bank-sub">A calm, read-only view of your balance.</p>

      <div className="bank-card">
        <p className="bank-label">Available balance</p>
        <p className="bank-balance">${balance}</p>
        <p className="bank-note">
          This is a safe, read-only view. No money can be moved or transferred here.
        </p>
      </div>

      <h2 className="bank-section-title">Recent activity</h2>
      <div className="bank-list">
        {recent.map((item) => (
          <div key={item.id} className="bank-row">
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.label}</span>
            </span>
            <span
              className="bank-amount"
              style={{ color: item.amount.startsWith("+") ? "#4ade80" : "#f87171" }}
            >
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
