import React from "react";
import "./VoiceOrb.css";

export default function VoiceOrb({ onTap }) {
  return (
    <div className="orb-wrapper" onClick={onTap}>
      <div className="orb-halo"></div>
      <div className="orb-core"></div>
    </div>
  );
}
