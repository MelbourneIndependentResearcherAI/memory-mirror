import { useNavigate } from "react-router-dom";

export default function LittleOnesAi() {
  const navigate = useNavigate();
  return (
    <div style={S.page}>
      <button style={S.backBtn} onClick={() => navigate("/")}>← Home</button>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <span style={{ fontSize: 52 }}>⭐</span>
        <h1 style={S.title}>Little Ones AI</h1>
        <p style={S.sub}>A safe, joyful space for the grandkids.</p>
      </div>
      <div style={S.card}>
        <p style={S.body}>Little Ones AI is a safe space for children to chat, play, and learn with a friendly AI companion.</p>
        <p style={S.body}>Coming soon — gentle stories, games, and conversations designed especially for young ones.</p>
        <div style={S.friendsRow}>
          {["🦁","🐘","🦊","🐬","🦋","🌈","⭐","🎈","🌻"].map((e,i) => (
            <span key={i} style={{ fontSize: 36 }}>{e}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const S = {
  page:       { minHeight: "100vh", background: "linear-gradient(160deg,#FDFAF6,#FFF8EC)", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 24px", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" },
  backBtn:    { alignSelf: "flex-start", background: "rgba(61,53,48,.07)", border: "1px solid rgba(61,53,48,.10)", borderRadius: 10, padding: "9px 18px", fontSize: 13, color: "#6B5E57", cursor: "pointer", marginBottom: 16 },
  title:      { fontSize: 30, fontWeight: 800, color: "#2C2420", margin: "8px 0 4px" },
  sub:        { fontSize: 15, color: "#9E8E84" },
  card:       { background: "#fff", borderRadius: 24, padding: "28px 32px", boxShadow: "0 8px 40px rgba(61,53,48,.10)", maxWidth: 500, width: "100%" },
  body:       { fontSize: 15, color: "#6B5E57", lineHeight: 1.65, marginBottom: 10 },
  friendsRow: { display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginTop: 20 },
};
