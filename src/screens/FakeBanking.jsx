import React from "react";
import "./fakebanking.css";

export default function FakeBanking() {
  return (
    <div className="bank-wrapper">
      <h1 className="bank-title">Safe Banking</h1>
      <p className="bank-sub">A calm, guided space for money tasks.</p>

      <div className="bank-card">
        <div className="bank-balance">$1,250.00</div>
        <div className="bank-label">Current Balance</div>
      </div>

      <div className="bank-actions">
        <button className="bank-btn">Check Balance</button>
        <button className="bank-btn">Pay Bill</button>
        <button className="bank-btn">Transfer</button>
      </div>

      <p className="bank-note">This is a safe simulation — no real banking.</p>
    </div>
  );
}
