import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Music() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const devices = [
    {
      key: "jukebox",
      label: "Jukebox",
      description: "Bright, colourful, classic 50s–60s vibe.",
      accent: "#ff006e",
      emoji: "🎵",
    },
    {
      key: "vinyl",
      label: "Vinyl Player",
      description: "Warm, nostalgic crackle and slow rotation.",
      accent: "#8338ec",
      emoji: "💿",
    },
    {
      key: "cassette",
      label: "Cassette",
      description: "80s–90s rewind, click and soft hiss.",
      accent: "#3a86ff",
      emoji: "📼",
    },
    {
      key: "gramophone",
      label: "Gramophone",
      description: "Old-time warmth, gentle horn sound.",
      accent: "#fb5607",
      emoji: "📻",
    },
  ];

  const comfortLines = {
    jukebox: [
      "Let’s play something that feels good.",
      "Bright and warm — just like you.",
      "Take your time, the music’s here with you.",
    ],
    vinyl: [
      "Slow and steady… like a vinyl spin.",
      "You’re safe — breathe with the rhythm.",
      "Warm and gentle, just settle in.",
    ],
    cassette: [
      "Click… rewind… breathe.",
      "You’re doing deadly, cuz.",
      "Everything’s okay — I’m right here.",
    ],
    gramophone: [
      "Old-time comfort, soft and steady.",
      "You’re safe — let the sound hold you.",
      "Easy now, you’re not alone.",
    ],
  };

  return (
    <div style={S.page}>
      <div style={S.topRow}>
        <button style={S.backBtn} onClick={() => navigate("/")}>
          ← Back
        </button>
      </div>

      <h1 style={S.title}>Music Therapy</h1>
      <p style={S.subtitle}>
        Choose a music player — warm, nostalgic and grounding.
      </p>

      {/* Device Grid */}
      <div style={S.grid}>
        {devices.map((d) => (
          <button
            key={d.key}
            style={{
              ...S.tile,
              borderColor: d.accent,
              background:
                selected === d.key
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(255,255,255,0.85)",
            }}
            onClick={() => setSelected(d.key)}
          >
            <div style={S.tileTop}>
              <div
                style={{
                  ...S.tileAccent,
                  background: d.accent,
                }}
              />
              <h2 style={S.tileLabel}>{d.label}</h2>
            </div>

            <div style={S.emoji}>{d.emoji}</div>

            <p style={S.tileDescription}>{d.description}</p>
          </button>
        ))}
      </div>

      {/* Comfort Line */}
      {selected && (
        <div style={S.messageBox}>
          <p style={S.messageText}>
            {
              comfortLines[selected][
                Math.floor(Math.random() * comfortLines[selected].length)
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
