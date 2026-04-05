import React, { useState } from "react";

export default function FireCircleV2() {
  const [story, setStory] = useState("");

  const yarns = {
    grounding:
      "Take a moment here by the fire. Feel the warmth, the glow, the steady rhythm. You’re safe. You’re not alone. Let the heat settle your chest and slow everything down.",
    reflection:
      "Think about one small thing you handled today. Doesn’t matter how tiny. You showed up. You kept going. That’s strength, even if it didn’t feel like it.",
    ancestors:
      "Your ancestors sat around fires just like this. They carried stories, pain, joy, and hope. You carry their strength. You’re part of something bigger than today.",
    calm:
      "Listen to the crackle. Let your shoulders drop. Let your breath soften. The fire doesn’t rush — and neither do you.",
    release:
      "If something heavy is sitting on your mind, imagine placing it beside the fire. You don’t have to carry everything at once. Let the warmth hold it for a while.",
    courage:
      "Every firelight gathering is a reminder: you’ve survived every hard day so far. You’re still here. That’s courage, even if you don’t feel it.",
  };

  const choose = (type) => {
    setStory(yarns[type]);
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "#1a0f0a",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        color: "#f7f3ef",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ marginBottom: "12px" }}>Fire Circle</h1>

      <p style={{ marginBottom: "20px", opacity: 0.9 }}>
        Sit by the fire. Slow down. Let the warmth steady you.
      </p>

      <div
        style={{
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          backgroundImage: "url('/images/firecirclev2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 0 40px rgba(255,140,60,0.4)",
          marginBottom: "24px",
        }}
      ></div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "12px",
          width: "100%",
          maxWidth: "600px",
          marginBottom: "20px",
        }}
      >
        <button onClick={() => choose("grounding")} style={btn}>
          Ground Me
        </button>
        <button onClick={() => choose("reflection")} style={btn}>
          Reflect
        </button>
        <button onClick={() => choose("ancestors")} style={btn}>
          Ancestor Yarn
        </button>
        <button onClick={() => choose("calm")} style={btn}>
          Calm Me
        </button>
        <button onClick={() => choose("release")} style={btn}>
          Let Go
        </button>
        <button onClick={() => choose("courage")} style={btn}>
          Courage Yarn
        </button>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          padding: "18px",
          borderRadius: "12px",
          color: "#f7f3ef",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          lineHeight: "1.6",
          width: "100%",
          maxWidth: "600px",
          flex: 1,
        }}
      >
        {story ||
          "Choose a yarn above. Sit with the fire. Let it hold space for you."}
      </div>
    </div>
  );
}

const btn = {
  padding: "14px",
  background: "#3a241a",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  color: "#f7f3ef",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
};
