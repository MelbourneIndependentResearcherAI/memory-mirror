import React, { useEffect, useState } from "react";

export default function OrientationCompanion() {
  const [now, setNow] = useState(new Date());
  const [message, setMessage] = useState(
    "I’m here with you. We can check the day, time, and place together."
  );

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const dayString = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeString = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const handleWhere = () => {
    setMessage(
      "You are at home, or in a safe place where people care about you. You are not alone."
    );
  };

  const handleWhen = () => {
    setMessage(
      `Today is ${dayString}. The time is around ${timeString}. There is no rush — we can move at your pace.`
    );
  };

  const handleWho = () => {
    setMessage(
      "The important people in your life care about you, even if they are not in the room right now. You are cared for and valued."
    );
  };

  const handleReassure = () => {
    setMessage(
      "It’s okay to feel unsure or mixed up sometimes. You are safe, and we can take things one small step at a time."
    );
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
      <h1 style={{ marginBottom: "8px", color: "#5a4636" }}>
        Orientation Companion
      </h1>

      <p style={{ marginBottom: "16px", color: "#5a4636" }}>
        Gentle reminders about time, place, and safety.
      </p>

      <div
        style={{
          marginBottom: "16px",
          padding: "16px",
          borderRadius: "12px",
          background: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ fontSize: "18px", color: "#5a4636", marginBottom: "4px" }}>
          Today:
        </p>
        <p style={{ fontSize: "20px", color: "#5a4636" }}>{dayString}</p>
        <p
          style={{
            fontSize: "18px",
            color: "#5a4636",
            marginTop: "8px",
          }}
        >
          Time: {timeString}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <button
          onClick={handleWhere}
          style={buttonStyle}
        >
          Where am I?
        </button>
        <button
          onClick={handleWhen}
          style={buttonStyle}
        >
          What day/time is it?
        </button>
        <button
          onClick={handleWho}
          style={buttonStyle}
        >
          Who cares about me?
        </button>
        <button
          onClick={handleReassure}
          style={buttonStyle}
        >
          I feel confused
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
        {message}
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "14px",
  background: "#e8d8c8",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  color: "#5a4636",
  cursor: "pointer",
  fontWeight: "bold",
};
