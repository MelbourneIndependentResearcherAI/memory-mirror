import { useState } from "react";

export default function Dialpad({ voiceKey, onBack, lastCompanion }) {
  const [number, setNumber] = useState("");

  const press = (digit) => {
    setNumber((prev) => (prev + digit).slice(0, 15));
  };

  const backspace = () => {
    setNumber((prev) => prev.slice(0, -1));
  };

  const call = () => {
    if (!lastCompanion) {
      alert("No companion selected yet.");
      return;
    }

    // Redirect into your AI companion call flow
    alert(`Calling ${lastCompanion}…`);
    // Example:
    // navigate(`/call/${lastCompanion}?voiceKey=${voiceKey}`);
  };

  const keys = ["1","2","3","4","5","6","7","8","9","*","0","#"];

  return (
    <div className="dialpad-container">
      <button className="back-btn" onClick={onBack}>← Back</button>

      <h1 className="dialpad-title">Phone Dialpad</h1>
      <p className="dialpad-sub">Call your AI companion</p>

      <div className="dialpad-display">{number || "Enter number"}</div>

      <div className="dialpad-grid">
        {keys.map((k) => (
          <button key={k} className="dialpad-key" onClick={() => press(k)}>
            {k}
          </button>
        ))}
      </div>

      <div className="dialpad-actions">
        <button className="delete-btn" onClick={backspace}>⌫</button>
        <button className="call-btn" onClick={call}>📞 Call</button>
      </div>
    </div>
  );
}
