import React, { useState } from "react";
import "./dialpad.css";

export default function Dialpad() {
  const [number, setNumber] = useState("");

  const press = (val) => {
    setNumber((prev) => (prev + val).slice(0, 20));
  };

  const clearLast = () => {
    setNumber((prev) => prev.slice(0, -1));
  };

  const clearAll = () => {
    setNumber("");
  };

  return (
    <div className="dial-container">
      <h1 className="dial-title">Dialpad</h1>

      <div className="dial-display">
        {number || "Enter number"}
      </div>

      <div className="dial-grid">
        {["1","2","3","4","5","6","7","8","9","*","0","#"].map((n) => (
          <button key={n} className="dial-btn" onClick={() => press(n)}>
            {n}
          </button>
        ))}
      </div>

      <div className="dial-actions">
        <button className="dial-clear" onClick={clearLast}>Delete</button>
        <button className="dial-reset" onClick={clearAll}>Clear</button>
        <button className="dial-call">Call</button>
      </div>
    </div>
  );
}
