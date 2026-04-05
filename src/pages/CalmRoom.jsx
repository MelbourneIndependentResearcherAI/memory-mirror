import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CalmRoom() {
  const navigate = useNavigate();

  const [isDay, setIsDay] = useState(true);
  const [panicMode, setPanicMode] = useState(false);
  const [comfortMode, setComfortMode] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  const neutralMessages = [
    "You’re safe here.",
    "Take your time.",
    "Nothing is rushing you.",
    "Just breathe slow.",
    "You’re not alone.",
  ];

  useEffect(() => {
    const updateMode = () => {
      const hour = new Date().getHours();
      setIsDay(hour >= 6 && hour < 18);
    };
    updateMode();
    const id = setInterval(updateMode, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!comfortMode) return;

    if (!currentMessage && neutralMessages.length > 0) {
      setCurrentMessage(neutralMessages[0]);
    }

    const interval = setInterval(() => {
      setCurrentMessage(
        neutralMessages[Math.floor(Math.random() * neutralMessages.length)]
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [comfortMode, currentMessage]);

  return (
    <div
      style={{
        ...S.page,
        background: isDay
          ? "linear-gradient(to bottom, #8fbce8, #dfe9f3)"
          : "linear-gradient(to bottom, #1b1d22, #050608)",
      }}
    >
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: .35; }
          50% { transform: scale(1.12); opacity: .75; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: .4; }
          50% { transform: scale(1.15); opacity: .9; }
        }
      `}</style>

      <div style={S.topRow}>
        <button style={S.backBtn} onClick={() => navigate("/")}>
          ← Back
        </button>
        <span style={S.modeLabel}>{isDay ? "Day mode" : "Night mode"}</span>
      </div>

      <div style={S.content}>
        <h1 style={S.title}>Calm Room</h1>
        <p style={S.sub}>
          A quiet, universal space for gentle grounding — for anyone who needs a moment to feel steady.
        </p>

        <div style={S.breathContainer}>
          <div style={S.breathRing}></div>
          <p style={S.breathText}>Breathe slow…</p>
        </div>

        <div style={S.toolsRow}>
          <button
            style={{
              ...S.toolBtn,
              background: panicMode
                ? "linear-gradient(135deg, #ff6b6b, #c0392b)"
                : "linear-gradient(135deg, #ff9f7b, #ff6b6b)",
            }}
            onClick={() => setPanicMode(true)}
          >
            Panic Grounding Mode
          </button>

          <button
            style={{
              ...S.toolBtn,
              background: comfortMode
                ? "linear-gradient(135deg, #7bcfff, #3a8fd1)"
                : "linear-gradient(135deg, #9bd7ff, #7bcfff)",
            }}
            onClick={() => setComfortMode(true)}
          >
            Comfort Messages
          </button>
        </div>
      </div>

      {panicMode && (
        <div style={S.panicOverlay}>
          <div style={S.panicInner}>
            <div style={S.panicPulse}></div>
            <p style={S.panicTitle}>You are safe.</p>
            <p style={S.panicText}>
              Take a slow breath in… and out. Nothing is rushing you. You are not alone.
            </p>
            <button
              style={S.panicExitBtn}
              onClick={() => setPanicMode(false)}
            >
              Exit Grounding Mode
            </button>
          </div>
        </div>
      )}

      {comfortMode && (
        <div style={S.comfortOverlay}>
          <div style={S.comfortInner}>
            <p style={S.comfortMessage}>{currentMessage}</p>
            <button
              style={S.comfortExitBtn}
              onClick={() => setComfortMode(false)}
            >
              Exit Comfort Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh",
    color: "#f5f5f5",
    fontFamily: "'Inter','Segoe UI',sans-serif",
    padding: 20,
    transition: "background 0.8s ease",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
  modeLabel: {
    fontSize: 13,
    opacity: 0.8,
  },
  content: {
    textAlign: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: 800,
    marginBottom: 10,
    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  sub: {
    fontSize: 16,
    opacity: 0.85,
    marginBottom: 40,
    maxWidth: 480,
    marginInline: "auto",
  },
  breathContainer: {
    position: "relative",
    width: 240,
    height: 240,
    margin: "0 auto 32px",
  },
  breathRing: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.6)",
    boxShadow: "0 0 40px rgba(0,0,0,0.25)",
    animation: "breathe 7s ease-in-out infinite",
  },
  breathText: {
    position: "absolute",
    bottom: -40,
    width: "100%",
    textAlign: "center",
    fontSize: 18,
    opacity: 0.8,
  },
  toolsRow: {
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  toolBtn: {
    border: "none",
    borderRadius: 999,
    padding: "12px 22px",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 4px 18px rgba(0,0,0,0.35)",
  },
  panicOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  panicInner: {
    position: "relative",
    width: 320,
    maxWidth: "90%",
    padding: 32,
    borderRadius: 24,
    background: "radial-gradient(circle at top, #3b3f4a, #15171c)",
    textAlign: "center",
    boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
  },
  panicPulse: {
    position: "absolute",
    top: -40,
    left: "50%",
    transform: "translateX(-50%)",
    width: 80,
    height: 80,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.4)",
    animation: "pulse 4s ease-in-out infinite",
  },
  panicTitle: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 10,
  },
  panicText: {
    fontSize: 16,
    opacity: 0.85,
    marginBottom: 24,
  },
  panicExitBtn: {
    border: "none",
    borderRadius: 999,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    background: "linear-gradient(135deg, #8fbce8, #5a8fd1)",
    color: "#fff",
  },
  comfortOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 998,
  },
  comfortInner: {
    background: "rgba(255,255,255,0.08)",
    padding: 32,
    borderRadius: 24,
    textAlign: "center",
    width: 320,
    maxWidth: "90%",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  comfortMessage: {
    fontSize: 24,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 24,
    transition: "opacity 1s ease",
  },
  comfortExitBtn: {
    border: "none",
    borderRadius: 999,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    background: "linear-gradient(135deg, #8fbce8, #5a8fd1)",
    color: "#fff",
  },
};
