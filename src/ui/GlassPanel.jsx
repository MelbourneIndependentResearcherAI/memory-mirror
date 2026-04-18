import React from "react";
import "./ui.css";

export default function GlassPanel({ children }) {
  return (
    <div className="glass-panel">
      {children}
    </div>
  );
}
