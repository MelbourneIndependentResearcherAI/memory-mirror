import React, { useState } from "react";

export default function MemoryPromptsCompanion() {
  const [prompt, setPrompt] = useState("");

  const prompts = {
    morning:
      "Morning reminder: Have you had a drink of water? A small breakfast? Take your time getting started.",
    meds:
      "Medication reminder: Check your usual spot. If you're unsure, it's okay to wait and ask someone you trust.",
    keys:
      "Keys reminder: They are often near the door, on a table, or in a familiar bowl or tray.",
    phone:
      "Phone reminder: Try checking beside your chair, near your bed, or wherever you usually charge it.",
    meals:
      "Meal reminder: A small snack or something simple is enough. You don’t need to cook anything complicated.",
    safety:
      "Safety reminder: Move slowly, hold onto something steady if needed, and take things one step at a time.",
  };

  const handlePrompt = (type) => {
    setPrompt(prompts[type]);
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
        Memory Prompts Companion
      </h1>

      <p style={{ marginBottom: "16px", color: "#5a4636" }}>
        Gentle reminders for everyday things.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <button onClick={() => handlePrompt("morning")} style={btn}>
          Morning Check
        </button>
        <button onClick={() => handlePrompt("meds")} style={btn}>
          Medication Check
        </button>
        <button onClick={() => handlePrompt("keys")} style={btn}>
          Where Are My Keys?
        </button>
        <button onClick={() => handlePrompt("phone")} style={btn}>
          Where Is My Phone?
        </button>
        <button onClick={() => handlePrompt("meals")} style={btn}>
          Meal Reminder
        </button>
        <button onClick={() => handlePrompt("safety")} style={btn}>
          Safety Reminder
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
        {prompt || "Choose a reminder above whenever you need a gentle cue."}
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
