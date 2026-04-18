import React, { useState } from "react";
import PageContainer from "../ui/PageContainer";
import GlassPanel from "../ui/GlassPanel";
import "./fakedialpad.css";

const digits = ["1","2","3","4","5","6","7","8","9","*","0","#"];

export default function FakeDialpad() {
  const [number, setNumber] = useState("");

  const press = (d) => {
    setNumber((prev) => (prev + d).slice(0, 16));
  };

  const clearNumber = () => setNumber("");
  const fakeCall = () => {
    alert("This is a safe practice call. No real call is made.");
  };

  return (
    <PageContainer>
      <GlassPanel>
        <h1>Practice Dialpad</h1>
        <p>Safe place to practice calling without real charges.</p>

        <div className="dial-display">{number || "Tap numbers to begin"}</div>

        <div className="dial-grid">
          {digits.map((d) => (
            <button key={d} className="dial-btn" onClick={() => press(d)}>
              {d}
            </button>
          ))}
        </div>

        <div className="dial-actions">
          <button className="dial-clear" onClick={clearNumber}>
            Clear
          </button>
          <button className="dial-call" onClick={fakeCall}>
            Fake Call
          </button>
        </div>
      </GlassPanel>
    </PageContainer>
  );
}
