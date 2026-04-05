import React, { useState } from "react";

export default function HealthInfoHelper() {
  const [topic, setTopic] = useState("");
  const [info, setInfo] = useState("");

  const explain = () => {
    const t = topic.toLowerCase();

    if (t.includes("dementia")) {
      setInfo(
        "Dementia is a word that describes changes in memory and thinking. It affects everyone differently. People may forget things, get confused, or need extra support. It’s not anyone’s fault, and gentle routines can help."
      );
      return;
    }

    if (t.includes("medication") || t.includes("medicine")) {
      setInfo(
        "Medication is something a doctor gives to help with symptoms. Everyone’s body reacts differently. If something feels off, it’s always best to talk to a doctor or pharmacist."
      );
      return;
    }

    if (t.includes("anxiety")) {
      setInfo(
        "Anxiety is when the body feels tense or worried. It can make the heart race or thoughts feel fast. Slow breathing, grounding, and gentle routines can help calm the body."
      );
      return;
    }

    if (t.includes("confusion")) {
      setInfo(
        "Confusion can happen when the brain is tired or overwhelmed. It’s okay to pause, breathe, and take things one step at a time. Familiar routines and calm spaces help."
      );
      return;
    }

    setInfo(
      "I can explain things in simple, gentle ways. Try a topic like: dementia, anxiety, confusion, medication."
    );
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "#f7f3ef",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "12px", color: "#5a4636" }}>
        Health Info Helper
      </h1>

      <p style={{ marginBottom: "16px", color: "#5a4636" }}>
        I can explain things in calm, simple, easy-to-understand ways.
      </p>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Type a topic…"
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "10px",
          border: "1px solid #c8b8a8",
          marginBottom: "12px",
        }}
      />

      <button
        onClick={explain}
        style={{
          padding: "14px",
          width: "100%",
          background: "#e8d8c8",
          border: "none",
          borderRadius: "12px",
          fontSize: "18px",
          color: "#5a4636",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Explain
      </button>

      {info && (
        <div
          style={{
            background: "#fff",
            padding: "18px",
            borderRadius: "12px",
            color: "#5a4636",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            lineHeight: "1.5",
          }}
        >
          {info}
        </div>
      )}
    </div>
  );
}
