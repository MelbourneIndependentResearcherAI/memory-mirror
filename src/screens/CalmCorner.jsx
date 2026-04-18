import React from "react";
import "./CalmCorner.css";

export default function CalmCorner() {
  return (
    <div className="calm-wrapper">
      <div className="calm-card">
        <h1 className="calm-title">Calm Corner</h1>
        <p className="calm-sub">Take a slow breath and settle your mind.</p>

        <div className="calm-breath-circle"></div>

        <p className="calm-instruction">Breathe with the circle</p>
      </div>
    </div>
  );
}
