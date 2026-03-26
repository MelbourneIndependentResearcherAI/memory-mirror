import { useState } from "react";

const AFFIRMATIONS = [
  "You are loved and you are safe.",
  "Today is a fresh start — take it one moment at a time.",
  "You matter deeply to the people around you.",
  "There is no rush. You have all the time you need.",
  "Every day is a gift, and so are you.",
  "You are stronger than you know.",
  "Today, take it gently. You are doing wonderfully.",
];

const CHECKLIST = [
  { icon: "💧", label: "Drink a glass of water" },
  { icon: "🌞", label: "Open the curtains and let the light in" },
  { icon: "🧘", label: "Take five slow, deep breaths" },
  { icon: "🍵", label: "Make yourself a warm drink" },
  { icon: "👟", label: "Put on comfortable shoes" },
  { icon: "💊", label: "Take morning medication (if needed)" },
];

export default function FreshStartAI({ onBack }) {
  const now     = new Date();
  const hour    = now.getHours();
  const tod     = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
  const todIcon = hour < 12 ? "🌅"      : hour < 17 ? "☀️"        : "🌙";
  const dateStr = now.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const affirmation = AFFIRMATIONS[now.getDay() % AFFIRMATIONS.length];

  const [checked, setChecked] = useState(CHECKLIST.map(() => false));
  const doneCount = checked.filter(Boolean).length;
  const allDone   = doneCount === CHECKLIST.length;

  const toggle = (i) => setChecked(prev => prev.map((v, j) => j === i ? !v : v));

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07100a",
      color: "#f0fdf4",
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: "28px 24px 60px",
      maxWidth: 560,
      margin: "0 auto",
    }}>
      <button onClick={onBack} className="back-btn">← Home</button>

      {/* Hero greeting card */}
      <div style={{
        background: "linear-gradient(145deg, #0d2416, #091510)",
        border: "1px solid #1e3d26",
        borderRadius: 22,
        padding: "32px 28px",
        marginBottom: 20,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ fontSize: 52, marginBottom: 14 }}>{todIcon}</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 6, letterSpacing: -0.5, fontFamily: "'Playfair Display', Georgia, serif" }}>
          Good {tod}
        </h1>
        <p style={{ fontSize: 13, color: "#3a5540", marginBottom: 20 }}>{dateStr}</p>
        <p style={{
          fontSize: 16,
          color: "#86efac",
          lineHeight: 1.8,
          fontStyle: "italic",
          fontFamily: "'Playfair Display', Georgia, serif",
          margin: 0,
        }}>
          "{affirmation}"
        </p>
      </div>

      {/* Morning checklist */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#86efac" }}>Morning Routine</h2>
          {doneCount > 0 && (
            <span style={{ fontSize: 13, color: allDone ? "#4ade80" : "#4b6651", fontWeight: 500 }}>
              {allDone ? "✓ All done!" : `${doneCount} / ${CHECKLIST.length}`}
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CHECKLIST.map((item, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              style={{
                background: checked[i] ? "rgba(74,222,128,0.07)" : "#0f1c11",
                border: `1px solid ${checked[i] ? "#2e5c34" : "#1a2e1c"}`,
                borderRadius: 14,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                transition: "all 0.2s",
                color: "#f0fdf4",
                fontFamily: "inherit",
                textAlign: "left",
                width: "100%",
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
              <span style={{
                fontSize: 15,
                fontWeight: 500,
                flex: 1,
                textDecoration: checked[i] ? "line-through" : "none",
                opacity: checked[i] ? 0.45 : 1,
                transition: "all 0.2s",
              }}>
                {item.label}
              </span>
              <span style={{
                fontSize: 20,
                color: checked[i] ? "#4ade80" : "#1a2e1c",
                transition: "color 0.2s",
                flexShrink: 0,
              }}>
                {checked[i] ? "✓" : "○"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {allDone && (
        <div style={{
          marginTop: 24,
          background: "rgba(74,222,128,0.07)",
          border: "1px solid #2e5c34",
          borderRadius: 16,
          padding: "20px 22px",
          textAlign: "center",
          animation: "fadeIn 0.4s ease",
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌟</div>
          <p style={{ fontSize: 15, color: "#86efac", fontWeight: 600, marginBottom: 4 }}>Morning routine complete!</p>
          <p style={{ fontSize: 13, color: "#3a5540" }}>Have a wonderful {tod.toLowerCase()}.</p>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
