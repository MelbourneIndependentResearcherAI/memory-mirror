import { useNavigate } from "react-router-dom";

const PLACEHOLDERS = [
  { emoji: "🌅", label: "Sunrise" },
  { emoji: "🏡", label: "Home" },
  { emoji: "👨‍👩‍👧‍👦", label: "Family" },
  { emoji: "🎂", label: "Birthday" },
  { emoji: "🌊", label: "Beach" },
  { emoji: "🌿", label: "Garden" },
  { emoji: "🐕", label: "Pets" },
  { emoji: "☕", label: "Morning" },
  { emoji: "🦘", label: "Nature" },
];

export default function PhotoHub() {
  const navigate = useNavigate();
  return (
    <div style={S.page}>
      <button style={S.backBtn} onClick={() => navigate("/")}>← Home</button>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <span style={{ fontSize: 52 }}>📷</span>
        <h1 style={S.title}>Photo Hub</h1>
        <p style={S.sub}>Memories in pictures — your story in images.</p>
      </div>
      <div style={S.card}>
        <p style={S.body}>Your photos and cherished memories will appear here.</p>
        <p style={S.body}>This feature is coming soon — it will let you browse family photos, add captions, and share memories with your loved ones.</p>
        <div style={S.photoGrid}>
          {PLACEHOLDERS.map((p, i) => (
            <div key={i} style={S.photoBox}>
              <span style={{ fontSize: 36 }}>{p.emoji}</span>
              <span style={{ fontSize: 11, color: "#9E8E84", fontWeight: 500, marginTop: 4 }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const S = {
  page:      { minHeight: "100vh", background: "linear-gradient(160deg,#FDFAF6,#FBF0F4)", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 24px", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" },
  backBtn:   { alignSelf: "flex-start", background: "rgba(61,53,48,.07)", border: "1px solid rgba(61,53,48,.10)", borderRadius: 10, padding: "9px 18px", fontSize: 13, color: "#6B5E57", cursor: "pointer", marginBottom: 16 },
  title:     { fontSize: 30, fontWeight: 800, color: "#2C2420", margin: "8px 0 4px" },
  sub:       { fontSize: 15, color: "#9E8E84" },
  card:      { background: "#fff", borderRadius: 24, padding: "28px 32px", boxShadow: "0 8px 40px rgba(61,53,48,.10)", maxWidth: 520, width: "100%" },
  body:      { fontSize: 15, color: "#6B5E57", lineHeight: 1.65, marginBottom: 10 },
  photoGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 20 },
  photoBox:  { aspectRatio: "1", background: "#F5ECD7", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(61,53,48,.07)", border: "1px solid #EAD9BE" },
};
