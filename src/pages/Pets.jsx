import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Pets() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const pets = [
    {
      key: "dog",
      label: "Dog",
      description: "Loyal, calming, steady presence.",
      accent: "#ff9f1c",
      emoji: "🐶",
    },
    {
      key: "cat",
      label: "Cat",
      description: "Soft, gentle, slow breathing energy.",
      accent: "#9b5de5",
      emoji: "🐱",
    },
    {
      key: "bird",
      label: "Bird",
      description: "Light, cheerful, uplifting energy.",
      accent: "#00bbf9",
      emoji: "🐦",
    },
    {
      key: "ferret",
      label: "Ferret",
      description: "Playful, curious, comforting distraction.",
      accent: "#ff6b6b",
      emoji: "🦦",
    },
  ];

  const petMessages = {
    dog: [
      "I’m right here with you, mate.",
      "Slow breaths… I’m not going anywhere.",
      "Good job, you’re doing deadly.",
    ],
    cat: [
      "Soft and slow… just like me.",
      "You’re safe. Settle in.",
      "Everything’s okay, I’m right here.",
    ],
    bird: [
      "Light and easy, cuz.",
      "Breathe with me… gentle now.",
      "You’re doing really well.",
    ],
    ferret: [
      "Oi, look at me! You’re alright.",
      "Let’s take it slow together.",
      "You’re safe, I’m here.",
    ],
  };

  return (
    <div style={S.page}>
      <div style={S.topRow}>
        <button style={S.backBtn} onClick={() => navigate("/")}>
          ← Back
        </button>
      </div>

      <h1 style={S.title}>Pet Therapy</h1>
      <p style={S.subtitle}>
        Choose a companion to sit with you — calm, gentle and grounding.
      </p>

      {/* Pet Grid */}
      <div style={S.grid}>
        {pets.map((pet) => (
          <button
            key={pet.key}
            style={{
              ...S.tile,
              borderColor: pet.accent,
              background:
                selected === pet.key
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(255,255,255,0.85)",
            }}
            onClick={() => setSelected(pet.key)}
          >
            <div style={S.tileTop}>
              <div
                style={{
                  ...S.tileAccent,
                  background: pet.accent,
                }}
              />
              <h2 style={S.tileLabel}>{pet.label}</h2>
            </div>

            <div style={S.emoji}>{pet.emoji}</div>

            <p style={S.tileDescription}>{pet.description}</p>
          </button>
        ))}
      </div>

      {/* Comfort Message */}
      {selected && (
        <div style={S.messageBox}>
          <p style={S.messageText}>
            {
              petMessages[selected][
                Math.floor(Math.random() * petMessages[selected].length)
              ]
            }
          </p>
        </div>
      )}
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh",
    padding: 24,
    fontFamily: "'Inter','Segoe UI',sans-serif",
    background:
      "radial-gradient(circle at top, #f4e2d8 0, #e0c3fc 40%, #2b2d42 100%)",
    color: "#1b1b1b",
    boxSizing: "border-box",
  },
  topRow: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  backBtn: {
    background: "rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "10px 18px",
    borderRadius: 10,
    cursor: "pointer",
    color: "#fff",
    fontSize: 14,
  },
  title: {
    margin: 0,
    fontSize: 36,
    fontWeight: 800,
    color: "#fff",
    textShadow: "0 2px 10px rgba(0,0,0,0.35)",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 30,
    maxWidth: 520,
    fontSize: 16,
    opacity: 0.9,
    color: "#fff",
    textAlign: "center",
    marginInline: "auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20,
  },
  tile: {
    background: "rgba(255,255,255,0.9)",
    borderRadius: 24,
    padding: 18,
    borderWidth: 2,
    borderStyle: "solid",
    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
    cursor: "pointer",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
  tileTop: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    justifyContent: "center",
  },
  tileAccent: {
    width: 18,
    height: 18,
    borderRadius: 999,
    flexShrink: 0,
  },
  tileLabel: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    color: "#222",
  },
  emoji: {
    fontSize: 60,
    margin: "10px 0",
  },
  tileDescription: {
    margin: 0,
    marginTop: 6,
    fontSize: 14,
    color: "#444",
  },
  messageBox: {
    marginTop: 30,
    background: "rgba(255,255,255,0.15)",
    padding: 20,
    borderRadius: 20,
    textAlign: "center",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.25)",
    maxWidth: 400,
    marginInline: "auto",
  },
  messageText: {
    fontSize: 20,
    fontWeight: 700,
    color: "#fff",
    textShadow: "0 2px 6px rgba(0,0,0,0.4)",
  },
};
