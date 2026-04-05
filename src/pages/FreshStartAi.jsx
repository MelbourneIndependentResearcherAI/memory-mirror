import { useNavigate } from "react-router-dom";

export default function FreshStartAi() {
  const navigate = useNavigate();
  return (
    <div style={S.page}>
      <button style={S.back} onClick={() => navigate("/")}>← Home</button>
      <div style={S.icon}>🌅</div>
      <h1 style={S.title}>Fresh Start AI</h1>
      <p style={S.sub}>Your daily reset — a gentle new beginning.</p>
      <div style={S.card}>
        <p style={S.body}>Fresh Start AI helps you begin each day with calm and clarity.</p>
        <p style={S.body}>This feature is coming soon — it'll offer gentle morning check-ins, daily affirmations, and a soft AI companion to help you feel grounded each day.</p>
        <div style={S.affirmBox}>
          <span style={{ fontSize: 28 }}>☀️</span>
          <p style={{ fontSize: 18, fontWeight: 600, color: "#555", margin: 0 }}>"Today is a new day. You're doing wonderfully."</p>
        </div>
      </div>
    </div>
  );
}

const S = {
  page:     { minHeight: "100vh", background: "linear-gradient(135deg,#fff8e8,#f8fff4)", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 24px", fontFamily: "'Segoe UI', system-ui, sans-serif" },
  back:     { alignSelf: "flex-start", background: "none", border: "1px solid #ddd", borderRadius: 10, padding: "8px 16px", fontSize: 14, cursor: "pointer", color: "#666", marginBottom: 16 },
  icon:     { fontSize: 72, marginBottom: 8 },
  title:    { fontSize: 34, fontWeight: 800, color: "#333", margin: "0 0 6px" },
  sub:      { fontSize: 17, color: "#888", margin: "0 0 28px" },
  card:     { background: "#fff", borderRadius: 24, padding: "28px", boxShadow: "0 6px 30px rgba(0,0,0,.08)", maxWidth: 500, width: "100%" },
  body:     { fontSize: 16, color: "#666", lineHeight: 1.6, marginBottom: 12 },
  affirmBox:{ display: "flex", gap: 14, alignItems: "center", background: "#fffbe8", borderRadius: 18, padding: "20px", marginTop: 12 },
};
