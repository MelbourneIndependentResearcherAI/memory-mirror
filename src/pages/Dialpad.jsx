import { useState } from "react";

export default function Dialpad({ voiceKey, onBack }) {
  const [number, setNumber] = useState("");

  const handlePress = (digit) => {
    setNumber((prev) => (prev + digit).slice(0, 16));
  };

  const handleClear = () => setNumber("");
  const handleCall = () => {
    // Hook this into your real AI call flow later
    alert("Connecting your AI companion call…");
  };

  const buttons = [
    "1","2","3",
    "4","5","6",
    "7","8","9",
    "*","0","#",
  ];

  return (
    <div className="feature-screen">
      <header className="feature-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h1>Phone Dialpad</h1>
        <p>Make a “call” to your AI companion.</p>
      </header>

      <div className="dialpad-display">
        <span>{number || "Enter number"}</span>
      </div>

      <div className="dialpad-grid">
        {buttons.map((b) => (
          <button
            key={b}
            className="dialpad-key"
            onClick={() => handlePress(b)}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="dialpad-actions">
        <button className="secondary" onClick={handleClear}>Clear</button>
        <button className="primary" onClick={handleCall}>Call</button>
      </div>
    </div>
  );
}
