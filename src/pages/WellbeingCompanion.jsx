import React, { useState } from "react";

export default function WellbeingCompanion() {
  const [mode, setMode] = useState("menu");
  const [messages, setMessages] = useState([
    {
      from: "companion",
      text: "I’m here with you. What would feel easiest right now?",
    },
  ]);

  const handleChoice = (choice) => {
    if (choice === "grounding") {
      setMode("grounding");
      setMessages([
        {
          from: "companion",
          text: "Let’s take a moment together. You’re safe here.",
        },
        {
          from: "companion",
          text: "Feel your feet on the floor. Notice your breath. One small step at a time.",
        },
      ]);
    }

    if (choice === "talk") {
      setMode("talk");
      setMessages([
        {
          from: "companion",
          text: "I’m right here. What’s on your mind?",
        },
      ]);
    }

    if (choice === "calm") {
      setMode("calm");
      setMessages([
        {
          from: "companion",
          text: "Let’s slow things down together.",
        },
        {
          from: "companion",
          text: "Breathe in… and out… nice and steady.",
        },
      ]);
    }
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = { from: "user", text };
    const reply = generateReply(text);

    setMessages((prev) => [...prev, userMsg, reply]);
  };

  const generateReply = (text) => {
    const lower = text.toLowerCase();

    if (lower.includes("scared") || lower.includes("overwhelmed")) {
      return {
        from: "companion",
        text: "That sounds really heavy. You’re not alone — we can take this slowly together.",
      };
    }

    if (lower.includes("confused")) {
      return {
        from: "companion",
        text: "It’s okay to feel unsure. We’ll move gently, one step at a time.",
      };
    }

    return {
      from: "companion",
      text: "I hear you. Thank you for sharing that with me.",
    };
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
        Wellbeing Companion
      </h1>

      {mode === "menu" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <button
            onClick={() => handleChoice("grounding")}
            style={buttonStyle}
          >
            Grounding Support
          </button>

          <button onClick={() => handleChoice("talk")} style={buttonStyle}>
            Gentle Conversation
          </button>

          <button onClick={() => handleChoice("calm")} style={buttonStyle}>
            Calm‑Down Moment
          </button>
        </div>
      )}

      {mode !== "menu" && (
        <div
          style={{
            marginTop: "20px",
            background: "#fff",
            padding: "16px",
            borderRadius: "12px",
            height: "70vh",
            overflowY: "auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                marginBottom: "12px",
                textAlign: m.from === "user" ? "right" : "left",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background:
                    m.from === "user" ? "#d9e7ff" : "rgba(90,70,54,0.1)",
                  color: "#5a4636",
                  maxWidth: "80%",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
      )}

      {mode !== "menu" && (
        <MessageInput onSend={sendMessage} />
      )}
    </div>
  );
}

function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const submit = () => {
    onSend(text);
    setText("");
  };

  return (
    <div
      style={{
        marginTop: "16px",
        display: "flex",
        gap: "8px",
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          flex: 1,
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #c8b8a8",
        }}
        placeholder="Type here…"
      />
      <button onClick={submit} style={buttonStyle}>
        Send
      </button>
    </div>
  );
}

const buttonStyle = {
  padding: "16px",
  background: "#e8d8c8",
  border: "none",
  borderRadius: "12px",
  fontSize: "18px",
  color: "#5a4636",
  cursor: "pointer",
  fontWeight: "bold",
};
