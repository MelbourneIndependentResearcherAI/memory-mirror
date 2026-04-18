import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCompanionProfile, saveCompanionProfile } from "../utils/companionProfile";

const toneOptions = [
  {
    id: "gentle",
    label: "Gentle & nurturing",
    example: "I’m here with you. We can go slowly."
  },
  {
    id: "calm",
    label: "Calm & neutral",
    example: "Okay. I’ll open that for you now."
  },
  {
    id: "friendly",
    label: "Friendly & upbeat",
    example: "Got it! Let’s head there together."
  },
  {
    id: "quiet",
    label: "Quiet & minimal",
    example: "I’ll only speak when needed."
  }
];

export default function CompanionSetup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [tone, setTone] = useState("gentle");

  useEffect(() => {
    const existing = getCompanionProfile();
    if (existing) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSave = () => {
    const finalName = name.trim() || "Companion";
    saveCompanionProfile({ name: finalName, tone });
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #0b1b33 0%, #000 55%, #000 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px 16px 40px",
        color: "#e8f4ff"
      }}
    >
      <h1 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>Set up your companion</h1>
      <p style={{ opacity: 0.8, marginBottom: "24px", textAlign: "center", maxWidth: "420px" }}>
        Choose a name and how you’d like your companion to speak to you. You can change this later in Settings.
      </p>

      <div style={{ width: "100%", maxWidth: "420px", marginBottom: "24px" }}>
        <label style={{ fontSize: "0.9rem", opacity: 0.9 }}>Companion name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Type a name (e.g. Lumi, Aunty, Mate)…"
          style={{
            marginTop: "8px",
            width: "100%",
            padding: "12px 14px",
            borderRadius: "12px",
            border: "1px solid #1f3b66",
            background: "rgba(5, 10, 20, 0.9)",
            color: "#e8f4ff",
            fontSize: "1rem"
          }}
        />
      </div>

      <div style={{ width: "100%", maxWidth: "420px", marginBottom: "24px" }}>
        <label style={{ fontSize: "0.9rem", opacity: 0.9 }}>Companion tone</label>
        <div style={{ marginTop: "10px", display: "grid", gap: "10px" }}>
          {toneOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setTone(opt.id)}
              style={{
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: "14px",
                border: tone === opt.id ? "1px solid #4da3ff" : "1px solid #1f3b66",
                background:
                  tone === opt.id
                    ? "linear-gradient(135deg, rgba(0,102,255,0.35), rgba(0,0,0,0.9))"
                    : "rgba(5, 10, 20, 0.9)",
                color: "#e8f4ff",
                cursor: "pointer"
              }}
            >
              <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{opt.label}</div>
              <div style={{ fontSize: "0.8rem", opacity: 0.8, marginTop: "4px" }}>{opt.example}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        style={{
          marginTop: "8px",
          padding: "12px 32px",
          borderRadius: "999px",
          border: "none",
          background:
            "radial-gradient(circle at 0% 0%, #4da3ff 0%, #0066ff 40%, #001133 100%)",
          color: "#e8f4ff",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 0 18px rgba(0,102,255,0.6)"
        }}
      >
        Save companion
      </button>
    </div>
  );
}
