import React from "react";
import "./NightSafe.css";

export default function NightSafe() {
  return (
    <div className="night-wrapper">
      <div className="night-card">
        <h1 className="night-title">Night Safe</h1>
        <p className="night-sub">
          Feel safe and supported during the night.
        </p>
        <div className="night-glow-orb"></div>
      </div>
    </div>
  );
}
