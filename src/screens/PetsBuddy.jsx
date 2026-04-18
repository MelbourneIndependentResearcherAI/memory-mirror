import React from "react";
import "./PetsBuddy.css";

export default function PetsBuddy() {
  return (
    <div className="pets-wrapper">
      <div className="pets-card">
        <h1 className="pets-title">Pets Buddy</h1>
        <p className="pets-sub">A gentle space to remember your furry friends.</p>

        <div className="pets-paw">🐾</div>

        <p className="pets-note">Pet memories feature coming soon</p>
      </div>
    </div>
  );
}
