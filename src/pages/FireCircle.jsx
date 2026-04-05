import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { speak } from "../voiceEngine.js";

const BG_OPTIONS = [
  {
    id: "outback",
    label: "Night Sky",
    image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1200&q=55&fit=crop",
    alt: "Night sky filled with stars",
    overlay: "rgba(6,8,18,0.65)",
  },
  {
    id: "bush",
    label: "Forest Clearing",
    image: "https://images.unsplash.com/photo-1440414992399-6b9aa1b65ea5?w=1200&q=55&fit=crop",
    alt: "Softly lit forest clearing at night",
    overlay: "rgba(4,10,6,0.62)",
  },
  {
    id: "river",
    label: "Riverside Dusk",
    image: "https://images.unsplash.com/photo-1533577628-b14f0b12c29f?w=1200&q=55&fit=crop",
    alt: "Calm river at dusk with gentle light",
    overlay: "rgba(4,6,16,0.60)",
  },
  {
    id: "desert",
    label: "Soft Dunes",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=55&fit=crop",
    alt: "Soft sand dunes under a warm sky",
    overlay: "rgba(16,8,2,0.60)",
  },
];

const SOUND_LAYERS = [
  { id: "didge",   label: "Low Drone",     emoji: "〰️", desc: "Deep, steady grounding tone" },
  { id: "clap",    label: "Soft Rhythm",   emoji: "🥁", desc: "Gentle, slow heartbeat beat" },
  { id: "ambient", label: "Night Air",     emoji: "🌙", desc: "Wind, crickets, distant ambience" },
];

const GUIDE_LINES = [
  "You’re safe here. Nothing is rushing you.",
  "Take a slow breath in… and out.",
  "Let your shoulders soften and drop.",
  "You don’t have to do anything right now.",
  "This is your space to rest for a while.",
  "Let your thoughts drift past like clouds.",
  "You are not alone. You are cared for.",
  "Just breathe. In… and out… nice and slow.",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function FireCircle() {
  const navigate = useNavigate();
  const [bg, setBg] = useState(BG_OPTIONS[0]);
  const [layers, setLayers] = useState({ didge: false, clap: false, ambient: false });
  const [guidance, setGuidance] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef(null);

  const toggleLayer = (id) =>
    setLayers((prev) => ({ ...prev, [id]: !prev[id] }));

  const playGuidance = useCallback(() => {
    if (speaking) return;
    const line = pick(GUIDE_LINES);
    setGuidance(line);
    setSpeaking(true);
    speak(line, "yoZ06aMxZJJ28mfd3POQ", () => setSpeaking(false), audioRef);
  }, [speaking]);

  return (
    <div style={S.page}>
      {/* Background image */}
      <img
        key={bg.id}
        src={bg.image}
        alt={bg.alt}
        loading="eager"
        style={S.bgPhoto}
      />
      {/* Color overlay */}
      <div style={{ ...S.bgOverlay, background: bg.overlay }} />
      {/* Vignette */}
      <div style={S.bgVignette} />

      {/* Animations */}
      <style>{`
        @keyframes shimmer  { 0%,100%{opacity:.65} 50%{opacity:1} }
        @keyframes flicker1 { 0%,100%{transform:translateX(-54%) scaleY(1) scaleX(1)} 30%{transform:translateX(-57%) scaleY(1.10) scaleX(.92)} 70%{transform:translateX(-51%) scaleY(.94) scaleX(1.07)} }
        @keyframes flicker2 { 0%,100%{transform:translateX(-38%) scaleY(1)} 40%{transform:translateX(-42%) scaleY(1.15)} 80%{transform:translateX(-34%) scaleY(.91)} }
        @keyframes pulse    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:.3} }
        @keyframes glow     { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:.8;transform:scale(1.06)} }
        @keyframes bgFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes breathe  { 0%,100%{transform:scale(1);opacity:.35} 50%{transform:scale(1.08);opacity:.7} }
      `}</style>

      {/* Top row: back + background picker */}
      <div style={S.topRow}>
        <button style={S.backBtn} onClick={() => navigate("/")}>
          ← Home
        </button>
        <div style={S.bgPicker}>
          {BG_OPTIONS.map((b) => (
            <button
              key={b.id}
              style={S.bgBtn(b.id === bg.id)}
              onClick={() => setBg(b)}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={S.content}>
        {/* Warm sky gradient */}
        <div style={S.skyGradient} />

        {/* Soft earth circle under fire */}
        <div style={S.earthCircle} />

        {/* Breathing ring behind fire */}
        <div style={S.breathRing} />

        {/* Title + subheading */}
        <h1 style={S.title}>Fire Circle</h1>
        <p style={S.sub}>
          A quiet place to pause, breathe, and feel safe for a moment.
        </p>

        {/* Fire scene */}
        <div style={S.fireScene}>
          <div style={S.groundGlow} />
          <div style={S.logs}>🪵</div>
          <div style={S.flame1}>🔥</div>
          <div style={S.flame2}>🔥</div>
          <div style={S.halo} />
        </div>

        {/* Guidance bubble */}
        {guidance && (
          <div style={S.guidanceBubble}>
            {speaking && (
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#FFB070",
                  flexShrink: 0,
                  animation: "pulse 1s infinite",
                }}
              />
            )}
            <span>{guidance}</span>
          </div>
        )}

        {/* Guidance button */}
        <button
          style={S.guideBtn}
          onClick={playGuidance}
          disabled={speaking}
          aria-label="Hear gentle guidance"
        >
          {speaking ? "🔊 Speaking…" : "🗣 Gentle Voice"}
        </button>

        {/* Sound layers */}
        <div style={S.layerSection}>
          <p style={S.layerTitle}>Sound Layers</p>
          <div style={S.layerRow}>
            {SOUND_LAYERS.map((l) => (
              <button
                key={l.id}
                style={S.layerBtn(layers[l.id])}
                onClick={() => toggleLayer(l.id)}
                aria-pressed={layers[l.id]}
              >
                <span style={{ fontSize: 26 }}>{l.emoji}</span>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#F5ECD7",
                  }}
                >
                  {l.label}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(245,236,215,.7)",
                  }}
                >
                  {l.desc}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: layers[l.id]
                      ? "#FFD8A0"
                      : "rgba(255,255,255,.35)",
                  }}
                >
                  {layers[l.id] ? "● ON" : "○ OFF"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
    overflow: "hidden",
    backgroundColor: "#050609",
  },
  bgPhoto: {
    position: "fixed",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "brightness(0.65) saturate(0.75)",
    zIndex: 0,
    animation: "bgFadeIn .8s ease",
  },
  bgOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1,
    transition: "background 1s ease",
  },
  bgVignette: {
    position: "fixed",
    inset: 0,
    zIndex: 2,
    boxShadow: "inset 0 0 140px rgba(0,0,0,.7)",
    pointerEvents: "none",
  },
  topRow: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "22px 24px",
    flexWrap: "wrap",
    gap: 10,
  },
  backBtn: {
    background: "rgba(0,0,0,.45)",
    border: "1px solid rgba(255,255,255,.18)",
    borderRadius: 10,
    padding: "9px 18px",
    fontSize: 13,
    cursor: "pointer",
    color: "rgba(245,236,215,.9)",
    backdropFilter: "blur(8px)",
  },
  bgPicker: {
    display: "flex",
    gap: 7,
    flexWrap: "wrap",
  },
  bgBtn: (active) => ({
    padding: "7px 13px",
    borderRadius: 50,
    border: active
      ? "1.5px solid rgba(255,190,120,.8)"
      : "1px solid rgba(255,255,255,.18)",
    background: active
      ? "rgba(255,160,80,.32)"
      : "rgba(0,0,0,.40)",
    color: "#F5ECD7",
    fontSize: 12,
    cursor: "pointer",
    fontWeight: active ? 700 : 400,
    backdropFilter: "blur(8px)",
    transition: "all .2s",
  }),
  content: {
    position: "relative",
    zIndex: 10,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "8px 24px 48px",
    textAlign: "center",
  },
  skyGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
    background:
      "linear-gradient(to bottom, rgba(255,190,120,0.25), rgba(0,0,0,0))",
    zIndex: 1,
    pointerEvents: "none",
  },
  earthCircle: {
    position: "absolute",
    bottom: 120,
    left: "50%",
    transform: "translateX(-50%)",
    width: 320,
    height: 140,
    borderRadius: "50%",
    background:
      "radial-gradient(ellipse at center, rgba(160,110,60,0.28) 0%, rgba(0,0,0,0) 70%)",
    filter: "blur(12px)",
    zIndex: 1,
    pointerEvents: "none",
  },
  breathRing: {
    position: "absolute",
    bottom: 170,
    left: "50%",
    transform: "translateX(-50%)",
    width: 220,
    height: 220,
    borderRadius: "50%",
    border: "1px solid rgba(255,210,150,0.35)",
    boxShadow: "0 0 40px rgba(255,190,120,0.25)",
    animation: "breathe 7s ease-in-out infinite",
    opacity: 0.5,
    zIndex: 1,
    pointerEvents: "none",
  },
  title: {
    fontSize: 34,
    fontWeight: 800,
    color: "#F5ECD7",
    margin: "10px 0 6px",
    textShadow: "0 2px 20px rgba(255,150,80,.6)",
    letterSpacing: "-.4px",
    zIndex: 3,
  },
  sub: {
    fontSize: 16,
    color: "rgba(245,236,215,.75)",
    margin: "0 0 24px",
    maxWidth: 420,
    zIndex: 3,
  },
  fireScene: {
    position: "relative",
    width: 190,
    height: 210,
    marginBottom: 22,
    zIndex: 3,
  },
  groundGlow: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: 240,
    height: 90,
    borderRadius: "50%",
    background:
      "radial-gradient(ellipse, rgba(255,160,80,.34) 0%, transparent 70%)",
    animation: "shimmer 2.8s ease-in-out infinite",
  },
  logs: {
    position: "absolute",
    bottom: 4,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 46,
    lineHeight: 1,
  },
  flame1: {
    position: "absolute",
    bottom: 32,
    left: "50%",
    transform: "translateX(-54%)",
    fontSize: 92,
    lineHeight: 1,
    animation: "flicker1 1.9s ease-in-out infinite",
    filter: "drop-shadow(0 0 18px rgba(255,140,60,.55))",
  },
  flame2: {
    position: "absolute",
    bottom: 44,
    left: "50%",
    transform: "translateX(-38%)",
    fontSize: 56,
    lineHeight: 1,
    animation: "flicker2 1.4s ease-in-out infinite",
  },
  halo: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: 160,
    height: 160,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255,160,80,.10) 0%, transparent 65%)",
    animation: "glow 3s ease-in-out infinite",
  },
  guidanceBubble: {
    background: "rgba(0,0,0,.50)",
    borderRadius: 18,
    padding: "14px 22px",
    fontSize: 18,
    color: "#F5ECD7",
    maxWidth: 420,
    textAlign: "center",
    backdropFilter: "blur(14px)",
    boxShadow: "0 4px 24px rgba(0,0,0,.40)",
    marginBottom: 14,
    lineHeight: 1.5,
    border: "1px solid rgba(255,255,255,.12)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    zIndex: 3,
  },
  guideBtn: {
    padding: "13px 28px",
    borderRadius: 50,
    border: "none",
    background:
      "linear-gradient(135deg, rgba(255,160,80,.85), rgba(255,120,40,.78))",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 22px rgba(255,120,40,.45)",
    marginBottom: 28,
    backdropFilter: "blur(6px)",
    zIndex: 3,
  },
  layerSection: {
    width: "100%",
    maxWidth: 580,
    zIndex: 3,
  },
  layerTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "rgba(245,236,215,.55)",
    letterSpacing: 2,
    textTransform: "uppercase",
    textAlign: "center",
    margin: "0 0 12px",
  },
  layerRow: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  layerBtn: (on) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: "16px 20px",
    borderRadius: 18,
    border: on
      ? "1.5px solid rgba(255,200,140,.60)"
      : "1.5px solid rgba(255,255,255,.14)",
    background: on
      ? "rgba(255,160,80,.26)"
      : "rgba(0,0,0,.40)",
    color: "#F5ECD7",
    cursor: "pointer",
    minWidth: 140,
    backdropFilter: "blur(10px)",
    transition: "all .2s",
  }),
};
