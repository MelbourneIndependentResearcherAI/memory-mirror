import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AiPets() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    "Your dog is here with you, sitting quietly and watching over you."
  ]);

  const addMessage = (text) => {
    setMessages((prev) => [...prev, text]);
  };

  const actions = [
    {
      label: "Sit with me",
      response:
        "Your dog curls up beside you, warm and steady, just keeping you company."
    },
    {
      label: "Make me smile",
      response:
        "Your dog does a silly head tilt and happy tail wag, like they’re trying to make you laugh."
    },
    {
      label: "Stay with me",
      response:
        "Your dog settles in, breathing slowly, staying right by your side as long as you need."
    },
    {
      label: "Tell me something nice",
      response:
        "If your dog could talk, they’d say: ‘You’re loved. You matter. I’m not going anywhere.’"
    }
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f7f3ee 0%, #e9e3dc 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px"
      }}
    >
      {/* Top bar */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          alignItems: "center",
          marginBottom: "16px"
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "18px",
            cursor: "pointer",
            color: "#6b5e53",
            marginRight: "8px"
          }}
        >
          ← Back
        </button>
        <h1
          style={{
            fontSize: "32px",
            margin: 0,
            color: "#4a3f35"
          }}
        >
          Your AI Pet
        </h1>
      </div>

      {/* Pet + actions container */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          background: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          padding: "24px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
          gap: "24px"
        }}
      >
        {/* Pet area */}
        <div
          style={{
            background: "linear-gradient(180deg, #f0e6dd 0%, #e2d6cb 100%)",
            borderRadius: "20px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <div
            style={{
              width: "260px",
              height: "260px",
              borderRadius: "50%",
              backgroundImage: "url('/images/ai-pet-dog.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              position: "relative",
              animation: "pet-breathe 4s ease-in-out infinite"
            }}
          />

          <p
            style={{
              marginTop: "18px",
              fontSize: "18px",
              color: "#4a3f35",
              textAlign: "center",
              maxWidth: "320px"
            }}
          >
            Your dog is here with you — breathing gently, watching you, and
            staying close.
          </p>
        </div>

        {/* Actions + log */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "22px",
                margin: "0 0 8px 0",
                color: "#4a3f35"
              }}
            >
              What do you need right now?
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "16px",
                color: "#6b5e53"
              }}
            >
              Tap a button and your dog will respond in their own gentle way.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "10px"
            }}
          >
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => addMessage(action.response)}
                style={{
                  border: "none",
                  borderRadius: "999px",
                  padding: "10px 14px",
                  fontSize: "15px",
                  cursor: "pointer",
                  background: "#f0e3d7",
                  color: "#4a3f35",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                  textAlign: "center"
                }}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: "8px",
              flex: 1,
              background: "#f7f1ea",
              borderRadius: "16px",
              padding: "12px",
              overflowY: "auto",
              maxHeight: "220px"
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background: "#ffffff",
                  color: "#4a3f35",
                  fontSize: "15px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
                }}
              >
                {msg}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inline keyframes for breathing animation */}
      <style>
        {`
          @keyframes pet-breathe {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}
