import React from "react";
import "./MusicTherapy.css";

export default function MusicTherapy() {
  return (
    <div className="music-wrapper">
      <h1 className="music-title">Music Therapy</h1>
      <p className="music-sub">Soothing sounds to calm your mind.</p>

      <div className="music-bars">
        <div className="bar b1"></div>
        <div className="bar b2"></div>
        <div className="bar b3"></div>
        <div className="bar b4"></div>
        <div className="bar b5"></div>
      </div>

      <p className="music-note">Audio player coming soon</p>
    </div>
  );
}
