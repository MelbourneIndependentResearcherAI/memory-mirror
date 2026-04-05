import React, { useState, useEffect } from "react";

export default function CalmBreathingCompanion() {
  const [phase, setPhase] = useState("Breathe In");

  useEffect(() => {
    const cycle = ["Breathe In", "Hold", "Breathe Out", "Hold"];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % cycle.length;
      setPhase(cycle[index]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        padding: "24px",
        background: "#f7f3ef",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ marginBottom: "12px", color: "#5a4636" }}>
        Calm Breathing Companion
      </h1>

      <p style={{ marginBottom: "20px", color: "#5a4636" }}>
        Follow the circle. Slow, gentle breathing to help you feel grounded.
      </p>

      <BreathingCircle phase={phase} />

      <div
        style={{
          marginTop: "24px",
          background: "#fff",
          padding: "18px",
          borderRadius: "12px",
          color: "#5a4636",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          fontSize: "20px",
          textAlign: "center",
          width: "80%",
          maxWidth: "400px",
        }}
      >
        {phase}
      </div>
    </div>
  );
}

function BreathingCircle({ phase }) {
  const scale =
    phase === "Breathe In"
      ? 1.3
      : phase === "Hold"
      ? 1.3
      : phase === "Breathe Out"
      ? 0.9
      : 0.9;

  return (
    <div
      style={{
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        background: "#e8d8c8",
        transition: "transform 4s ease",
        transform: `scale(${scale})`,
        boxShadow: "0 0 40px rgba(0,0,0,0.15)",
      }}
    ></div>
  );
}
