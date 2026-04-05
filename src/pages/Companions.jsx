import { useNavigate } from "react-router-dom";

export default function Companions() {
  const navigate = useNavigate();

  const tiles = [
    {
      key: "wellbeing",
      label: "Wellbeing Companion",
      description: "Soft daily check-ins, reassurance and gentle emotional support.",
      path: "/wellbeing",
      accent: "#3a86ff",
    },
    {
      key: "health-info",
      label: "Health Info Helper",
      description: "Plain-language health explanations for mob and carers.",
      path: "/health-info",
      accent: "#ffbe0b",
    },
    {
      key: "carer",
      label: "Carer Companion",
      description: "Quick tools, notes and grounding support for carers.",
      path: "/carer",
      accent: "#06d6a0",
    },
    {
      key: "shower",
      label: "Shower Companion",
      description: "Gentle step-by-step support around shower time.",
      path: "/shower",
      accent: "#118ab2",
    },
  ];

  return (
    <div style={S.page}>
      <div style={S.topRow}>
        <button style={S.backBtn} onClick={() => navigate("/")}>
          ← Back
        </button>
      </div>

      <h1 style={S.title}>Companions</h1>
      <p style={S.subtitle}>
        Choose a companion to walk with you — steady, calm and without judgement.
      </p>

      <div style={S.grid}>
        {tiles.map((tile) => (
          <button
            key={tile.key}
            style={{ ...S.tile, borderColor: tile.accent }}
            onClick={() => navigate(tile.path)}
          >
            <div style={S.tileTop}>
              <div
                style={{
                  ...S.tileAccent,
                  background: tile.accent,
                }}
              />
              <h2 style={S.tileLabel}>{tile.label}</h2>
            </div>
            <p style={S.tileDescription}>{tile.description}</p>
          </button>
        ))}
      </div>
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
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
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
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s",
  },
  tileTop: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
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
  tileDescription: {
    margin: 0,
    marginTop: 6,
    fontSize: 14,
    color: "#444",
  },
};
