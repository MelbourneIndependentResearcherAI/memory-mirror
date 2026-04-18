import React from "react";
import "./photohub.css";

export default function PhotoHub() {
  return (
    <div className="photo-wrapper">
      <h1 className="photo-title">Photo Hub</h1>
      <p className="photo-sub">Your memories, safe and close.</p>

      <div className="photo-grid">
        <div className="photo-placeholder">📷</div>
        <div className="photo-placeholder">📷</div>
        <div className="photo-placeholder">📷</div>
        <div className="photo-placeholder">📷</div>
      </div>

      <p className="photo-note">Photo uploads coming soon</p>
    </div>
  );
}
