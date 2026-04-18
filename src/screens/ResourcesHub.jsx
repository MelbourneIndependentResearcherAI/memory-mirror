import React from "react";
import "./ResourcesHub.css";

export default function ResourcesHub() {
  const items = [
    "Emergency Contacts",
    "Local Services",
    "Health Support",
    "Community Groups",
    "Carer Resources"
  ];

  return (
    <div className="res-wrapper">
      <h1 className="res-title">Resources Hub</h1>
      <p className="res-sub">Helpful links and support options.</p>

      <div className="res-list">
        {items.map((i, idx) => (
          <div key={idx} className="res-item">{i}</div>
        ))}
      </div>
    </div>
  );
}
