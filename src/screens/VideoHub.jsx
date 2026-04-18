import React from "react";
import "./videohub.css";

export default function VideoHub() {
  return (
    <div className="video-wrapper">
      <h1 className="video-title">Video Hub</h1>
      <p className="video-sub">Your special moments, preserved.</p>

      <div className="video-grid">
        <div className="video-placeholder">🎬</div>
        <div className="video-placeholder">🎬</div>
        <div className="video-placeholder">🎬</div>
        <div className="video-placeholder">🎬</div>
      </div>

      <p className="video-note">Video uploads coming soon</p>
    </div>
  );
}
