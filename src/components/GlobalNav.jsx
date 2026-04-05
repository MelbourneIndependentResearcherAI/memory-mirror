import React from "react";
import { Link } from "react-router-dom";

export default function GlobalNav() {
  return (
    <nav
      style={{
        width: "100%",
        background: "#ffffff",
        padding: "16px 24px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        display: "flex",
        justifyContent: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "32px",
          fontSize: "16px",
          fontWeight: 600,
          color: "#374151",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "#374151" }}>
          Home
        </Link>

        <Link to="/enclosures" style={{ textDecoration: "none", color: "#374151" }}>
          Enclosures
        </Link>

        <Link to="/wellbeing" style={{ textDecoration: "none", color: "#374151" }}>
          Wellbeing
        </Link>

        <Link to="/ai-tools" style={{ textDecoration: "none", color: "#374151" }}>
          AI Tools
        </Link>
      </div>
    </nav>
  );
}
