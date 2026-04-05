import React, { useState } from "react";

export default function Settings() {
  const [textSize, setTextSize] = useState("medium");
  const [theme, setTheme] = useState("light");
  const [sound, setSound] = useState(true);
  const [speed, setSpeed] = useState("normal");

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          theme === "light"
            ? "linear-gradient(180deg, #f0f4ff, #d9e4ff)"
            : "linear-gradient(180deg, #1f2937, #111827)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px",
        boxSizing: "border-box",
        fontFamily: "'Segoe UI', system-ui",
        color: theme === "light" ? "#1f2937" : "#f9fafb",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          backgroundColor: theme === "light" ? "white" : "#1f2937",
          borderRadius: "28px",
          padding: "24px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 700,
          }}
        >
          Settings
        </h1>

        {/* TEXT SIZE */}
        <div>
          <label style={{ fontSize: "16px", fontWeight: 600 }}>
            Text Size
          </label>
          <select
            value={textSize}
            onChange={(e) => setTextSize(e.target.value)}
            style={{
              marginTop: "8px",
              padding: "10px",
              width: "100%",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              fontSize: "16px",
            }}
          >
            <option value="small">Small</option>
            <option value="medium">Medium (Default)</option>
            <option value="large">Large</option>
            <option value="xl">Extra Large</option>
          </select>
        </div>

        {/* THEME */}
        <div>
          <label style={{ fontSize: "16px", fontWeight: 600 }}>
            Theme
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{
              marginTop: "8px",
              padding: "10px",
              width: "100%",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              fontSize: "16px",
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* SOUND */}
        <div>
          <label style={{ fontSize: "16px", fontWeight: 600 }}>
            Sound
          </label>
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <input
              type="checkbox"
              checked={sound}
              onChange={() => setSound(!sound)}
              style={{ width: "20px", height: "20px" }}
            />
            <span style={{ fontSize: "16px" }}>
              {sound ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        {/* COMPANION SPEED */}
        <div>
          <label style={{ fontSize: "16px", fontWeight: 600 }}>
            Companion Animation Speed
          </label>
          <select
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            style={{
              marginTop: "8px",
              padding: "10px",
              width: "100%",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              fontSize: "16px",
            }}
          >
            <option value="slow">Slow</option>
            <option value="normal">Normal (Default)</option>
            <option value="fast">Fast</option>
          </select>
        </div>
      </div>
    </div>
  );
}
