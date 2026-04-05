import React, { useState } from "react";

export default function DailyRoutineHelper() {
  const [routine, setRoutine] = useState("");

  const routines = {
    morning: [
      "Take a slow breath and sit up gently.",
      "Have a small drink of water.",
      "Open the curtains or turn on a light.",
      "Use the bathroom if needed.",
      "Wash your face or have a quick freshen‑up.",
      "Have a simple breakfast — even toast is enough.",
      "Check if you need your glasses, hearing aids, or mobility aids.",
    ],
    afternoon: [
      "Have a drink of water.",
      "Eat a small lunch or snack.",
      "Stretch your legs or move around a little.",
      "Do one small task — nothing big.",
      "Take a short rest if you need it.",
    ],
    evening: [
      "Have a light dinner or snack.",
      "Take your time winding down.",
      "Dim the lights or close the curtains.",
      "Prepare anything you need for tomorrow.",
      "Brush your teeth and wash your face.",
      "Get into comfortable clothes.",
    ],
    bedtime: [
      "Make sure the room feels safe and calm.",
      "Turn off bright lights.",
      "Check the doors are locked if that helps you feel safe.",
      "Place your phone or water nearby.",
      "Lie down slowly and breathe gently.",
      "You’ve done enough for today.",
    ],
  };

  const selectRoutine = (type) => {
    setRoutine(routines[type].join("\n"));
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
        Daily Routine Helper
      </h1>

      <p style={{ marginBottom: "16px", color: "#5a4636" }}>
        Gentle step‑by‑step routines for different parts of the day.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <button onClick={() => selectRoutine("morning")} style={btn}>
          Morning Routine
        </button>
        <button onClick={() => selectRoutine("afternoon")} style={btn}>
          Afternoon Routine
        </button>
        <button onClick={() => selectRoutine("evening")} style={btn}>
          Evening Routine
        </button>
        <button onClick={() => selectRoutine("bedtime")} style={btn}>
          Bedtime Routine
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
          whiteSpace: "pre-line",
          flex: 1,
        }}
      >
        {routine || "Choose a routine above whenever you need a simple guide."}
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
