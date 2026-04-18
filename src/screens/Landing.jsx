import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/companion-setup");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #0b1b33 0%, #000 60%, #000 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        color: "#e8f4ff",
        textAlign: "center"
      }}
    >
      <div
        style={{
          fontSize: "2.4rem",
          fontWeight: 700,
          marginBottom: "12px",
          background: "linear-gradient(90deg, #4da3ff, #8ecbff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        Memory Mirror
      </div>

      <div
        style={{
          fontSize: "1.1rem",
          opacity: 0.85,
          maxWidth: "420px",
          marginBottom: "40px",
          lineHeight: 1.5
        }}
      >
        A gentle companion for memory, safety, comfort, and connection.
        Designed for dementia-safe navigation and calm support.
      </div>

      <button
        onClick={handleStart}
        style={{
          padding: "14px 36px",
          borderRadius: "999px",
          border: "none",
          background:
            "radial-gradient(circle at 0% 0%, #4da3ff 0%, #0066ff 40%, #001133 100%)",
          color: "#e8f4ff",
          fontSize: "1.1rem",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 0 22px rgba(0,102,255,0.6)",
          marginBottom: "20px"
        }}
      >
        Get Started
      </button>

      <div style={{ opacity: 0.6, fontSize: "0.85rem" }}>
        Calm. Safe. Always with you.
      </div>
    </div>
  );
}
