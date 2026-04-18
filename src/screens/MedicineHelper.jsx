import React from "react";
import "./MedicineHelper.css";

export default function MedicineHelper() {
  return (
    <div className="med-wrapper">
      <div className="med-card">
        <h1 className="med-title">Medicine Helper</h1>
        <p className="med-sub">Gentle reminders to take your medication safely.</p>

        <div className="med-icon">💊</div>

        <p className="med-note">Medication schedule coming soon</p>
      </div>
    </div>
  );
}
