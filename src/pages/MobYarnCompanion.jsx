import React, { useState } from "react";

export default function MobYarnCompanion() {
  const [story, setStory] = useState("");

  const yarns = {
    welcome:
      "Hey cuz, come sit down here with me. No rush, no pressure. We just yarn nice and slow, like sittin’ under the gum trees with a cuppa.",
    country:
      "You’re still connected to Country, even when you can’t see it. The land remembers you, and you remember the land. That feeling in your chest? That’s home talking.",
    family:
      "Your mob still got you. Even when they’re busy, even when they’re far — that love doesn’t go away. You’re part of a big story, bigger than today.",
    calm:
      "Take a breath, cuz. Slow one. In… and out… like the tide coming in. You’re alright. You’re safe. You’re not walking this road alone.",
    funny:
      "You know that one uncle who always reckons he’s right? Yeah… don’t listen to him. But listen to me — you’re doing deadly.",
    strength:
      "You come from strong people. Survivors. Story‑keepers. You carry that strength too, even on the days you feel wobbly.",
  };

  const chooseYarn = (type) => {
    setStory(yarns[type]);
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
        Mob Yarn Companion
      </h1>

      <p style={{ marginBottom: "16px", color: "#5a4636" }}>
        Gentle yarns, cultural grounding, and mob‑safe reassurance.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <button onClick={() => chooseYarn("welcome")} style={btn}>
          Welcome Yarn
        </button>
        <button onClick={() => chooseYarn("country")} style={btn}>
          Country Yarn
        </button>
        <button onClick={() => chooseYarn("family")} style={btn}>
          Family Yarn
        </button>
        <button onClick={() => chooseYarn("calm")} style={btn}>
          Calm Me Down
        </button>
        <button onClick={() => chooseYarn("funny")} style={btn}>
          Make Me Laugh
        </button>
        <button onClick={() => chooseYarn("strength")} style={btn}>
          Strength Yarn
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
        {story ||
          "Pick a yarn above, cuz. We’ll take it slow and keep it real."}
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
