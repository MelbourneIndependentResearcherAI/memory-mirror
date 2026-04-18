import React from "react";
import "./Breathing.css";

export default function Breathing() {
  return (
    <div className="breath-wrapper">
      <h1 className="breath-title">Breathing</h1>
      <p className="breath-sub">Follow the circle and breathe slowly.</p>

      <div className="breath-circle"></div>

      <p className="breath-note">Inhale… exhale…</p>
    </div>
  );
}
