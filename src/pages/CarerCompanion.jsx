import React, { useState } from "react";

export default function CarerCompanion() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const respond = () => {
    const q = question.toLowerCase();

    if (q.includes("upset") || q.includes("distress")) {
      setAnswer(
        "When someone is upset, the best approach is calm presence. Speak softly, move slowly, and offer reassurance without pressure. Give them space to breathe and feel safe."
      );
      return;
    }

    if (q.includes("wandering")) {
      setAnswer(
        "Wandering often happens when someone feels restless or unsure. Gentle redirection, familiar objects, and calm routines can help. Avoid confrontation — safety and reassurance come first."
      );
      return;
    }

    if (q.includes("confusion")) {
      setAnswer(
        "Confusion can be frightening for both the person and the carer. Keep your tone soft, simplify choices, and guide them step by step. Familiar cues and slow pacing help a lot."
      );
      return;
    }

    if (q.includes("communication")) {
      setAnswer(
        "Short sentences, warm tone, and patience make communication easier. Give time for responses. Avoid correcting — instead, guide gently and validate feelings."
      );
      return;
    }

    setAnswer(
      "I can help with calm, simple guidance for carers. Try asking about: confusion, distress, wandering, communication."
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
        Carer Companion
      </h1>

      <p style={{ marginBottom: "16px", color: "#5a4636" }}>
        Gentle guidance for carers supporting someone with memory or thinking
        changes.
      </p>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something…"
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "10px",
          border: "1px solid #c8b8a8",
          marginBottom: "12px",
        }}
      />

      <button
        onClick={respond}
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
        Get Guidance
      </button>

      {answer && (
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
          {answer}
        </div>
      )}
    </div>
  );
}
