import React, { useState } from "react";

export default function MedicationHelper() {
  const [message, setMessage] = useState("");

  const prompts = {
    routine:
      "A good routine helps keep things steady. Try checking the same spot each day where you normally keep your medication. No rush — just a gentle check.",
    storage:
      "Medication is often kept in a familiar place: a drawer, a basket, a shelf, or a small container. If you're unsure, it's okay to wait and ask someone you trust.",
    timing:
      "Some people find it helpful to link medication with daily habits — like breakfast, brushing teeth, or bedtime. Simple routines can make things easier.",
    support:
      "If something feels confusing, it's completely okay to ask a family member, carer, or pharmacist for help. You don’t have to figure it out alone.",
    safety:
      "If you're ever unsure whether you've taken something, it's safest to pause and check with someone you trust. No pressure — just take it slow.",
  };

  const choose = (type) => {
    setMessage(prompts[type]);
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "#f7f3ef",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1 style={{ marginBottom: "12px", color: "#5a4636" }}>
        Medication Helper
      </h1>

      <p style={{ marginBottom: "16px", color: "#5a4636" }}>
        Gentle reminders and routines. No medical advice.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <button onClick={() => choose("routine")} style={btn}>
          Daily Routine
        </button>
        <button onClick={() => choose("storage")} style={btn}>
          Where To Look
        </button>
        <button onClick={() => choose("timing")} style={btn}>
          Helpful Timing
        </button>
        <button onClick={() => choose("support")} style={btn}>
          Ask For Help
        </button>
        <button onClick={() => choose("safety")} style={btn}>
          Safety Check
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          padding: "18px",
          borderRadius: "12px",
          color: "#5a4636",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          lineHeight: "1.6",
          flex: 1,
        }}
      >
        {message ||
          "Choose a reminder above whenever you need a gentle cue about routines or safety."}
      </div>
    </div>
  );
}

const btn = {
  padding: "14px",
  background: "#e8d8c8",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  color: "#5a4636",
  cursor: "pointer",
  fontWeight: "bold",
};
