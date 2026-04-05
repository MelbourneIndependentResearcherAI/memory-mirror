import { useState } from "react";
import { useNavigate } from "react-router-dom";

const KEYS = ["1","2","3","4","5","6","7","8","9","*","0","#"];

export default function FakeDialpad() {
  const navigate = useNavigate();
  const [display, setDisplay] = useState("");
  const [dialling, setDialling] = useState(false);
  const [status, setStatus]   = useState("");

  const press = (k) => { if (!dialling) { setDisplay(prev => prev + k); setStatus(""); } };
  const clear  = () => { setDialling(false); setDisplay(""); setStatus(""); };
  const dial   = () => {
    if (!display) { setStatus("Enter a number first."); return; }
    setDialling(true);
    setStatus(`Calling ${display}…`);
    setTimeout(() => { setDialling(false); setStatus("Call ended. (This was practice — no real call was made.)"); }, 3500);
  };

  return (
    <div style={S.page}>
      <button style={S.backBtn} onClick={() => navigate("/")}>← Home</button>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <span style={{ fontSize: 52 }}>📞</span>
        <h1 style={S.title}>Practice Phone</h1>
        <p style={S.sub}>Practice dialling — nothing will actually call.</p>
      </div>
      <div style={S.phone}>
        <div style={S.displayBox}>
          {display || <span style={{ opacity: .4 }}>Enter a number</span>}
        </div>
        <div style={S.keyGrid}>
          {KEYS.map(k => (
            <button key={k} style={S.key} onClick={() => press(k)}>{k}</button>
          ))}
        </div>
        {status && (
          <div style={S.statusMsg(dialling)}>{status}</div>
        )}
        <div style={S.actionRow}>
          <button style={{ ...S.actionBtn, background: "#9E8E84" }} onClick={clear}>Clear</button>
          <button style={{ ...S.actionBtn, background: "#7A9E7E" }} onClick={dial} disabled={dialling}>
            {dialling ? "Calling…" : "Call"}
          </button>
        </div>
      </div>
    </div>
  );
}

const S = {
  page:      { minHeight: "100vh", background: "linear-gradient(160deg,#FDFAF6,#F0F5F0)", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 24px", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" },
  backBtn:   { alignSelf: "flex-start", background: "rgba(61,53,48,.07)", border: "1px solid rgba(61,53,48,.10)", borderRadius: 10, padding: "9px 18px", fontSize: 13, color: "#6B5E57", cursor: "pointer", marginBottom: 16 },
  title:     { fontSize: 30, fontWeight: 800, color: "#2C2420", margin: "8px 0 4px" },
  sub:       { fontSize: 15, color: "#9E8E84" },
  phone:     { background: "#fff", borderRadius: 24, padding: "28px 32px", boxShadow: "0 8px 40px rgba(61,53,48,.10)", maxWidth: 340, width: "100%" },
  displayBox:{ background: "#F5ECD7", borderRadius: 14, padding: "16px 20px", fontSize: 24, fontWeight: 600, color: "#2C2420", textAlign: "right", marginBottom: 20, minHeight: 58, display: "flex", alignItems: "center", justifyContent: "flex-end" },
  keyGrid:   { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 },
  key:       { padding: "19px", borderRadius: 14, border: "none", background: "#F5ECD7", fontSize: 22, fontWeight: 600, cursor: "pointer", color: "#2C2420", boxShadow: "0 2px 6px rgba(61,53,48,.08)", transition: "background .1s" },
  statusMsg: (d) => ({ padding: "10px 14px", borderRadius: 10, background: d ? "#C8DEC8" : "#E8E4DF", color: "#2C2420", fontSize: 14, textAlign: "center", marginBottom: 12, lineHeight: 1.5 }),
  actionRow: { display: "flex", gap: 10 },
  actionBtn: { flex: 1, padding: "15px", borderRadius: 14, border: "none", color: "#fff", fontSize: 17, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(61,53,48,.12)" },
};
