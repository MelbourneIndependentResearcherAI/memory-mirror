import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TRANSACTIONS = [
  { date: "31 Mar", desc: "Woolworths",        amount: -42.50 },
  { date: "30 Mar", desc: "Pension Deposit",   amount: +920.00 },
  { date: "28 Mar", desc: "Chemist Warehouse", amount: -18.75 },
  { date: "25 Mar", desc: "Council Rates",     amount: -120.00 },
  { date: "22 Mar", desc: "Phone Bill",        amount: -35.00 },
  { date: "20 Mar", desc: "Pension Deposit",   amount: +920.00 },
  { date: "15 Mar", desc: "Fuel",              amount: -60.00 },
];

export default function FakeBanking() {
  const navigate = useNavigate();
  const [pin, setPin]         = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError]     = useState("");

  const addDigit = (d) => { if (pin.length < 4) { setPin(p => p + d); setError(""); } };
  const delDigit = () => setPin(p => p.slice(0, -1));
  const doLogin  = () => { if (pin.length === 4) setLoggedIn(true); else setError("Please enter your 4-digit PIN."); };

  if (!loggedIn) {
    return (
      <div style={S.page}>
        <button style={S.backBtn} onClick={() => navigate("/")}>← Home</button>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontSize: 52 }}>💳</span>
          <h1 style={S.title}>Banking Practice</h1>
          <p style={S.sub}>Safe practice — no real money.</p>
        </div>
        <div style={S.card}>
          <p style={{ fontSize: 17, fontWeight: 600, color: "#6B5E57", marginBottom: 12, textAlign: "center" }}>Enter your 4-digit PIN</p>
          <div style={S.pinDisplay}>
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} style={S.pinDot(i < pin.length)} />
            ))}
          </div>
          <div style={S.numGrid}>
            {[1,2,3,4,5,6,7,8,9].map(d => (
              <button key={d} style={S.numBtn} onClick={() => addDigit(String(d))}>{d}</button>
            ))}
            <span />
            <button style={S.numBtn} onClick={() => addDigit("0")}>0</button>
            <button style={{ ...S.numBtn, fontSize: 20 }} onClick={delDigit}>⌫</button>
          </div>
          {error && <p style={S.error}>{error}</p>}
          <button style={S.loginBtn} onClick={doLogin}>Log In</button>
          <p style={{ fontSize: 12, color: "#9E8E84", textAlign: "center", marginTop: 8 }}>Any 4 digits will work — this is just practice.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <button style={S.backBtn} onClick={() => navigate("/")}>← Home</button>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={S.title}>💳 My Account</h1>
        <p style={S.sub}>Practice only — no real money.</p>
      </div>
      <div style={S.card}>
        <div style={S.balanceBlock}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#9E8E84", letterSpacing: 1, textTransform: "uppercase", margin: "0 0 4px" }}>Available Balance</p>
          <p style={{ fontSize: 42, fontWeight: 800, color: "#2C2420", margin: 0 }}>$1,659.25</p>
        </div>
        <hr style={S.divider} />
        <p style={S.txHeader}>Recent Transactions</p>
        {TRANSACTIONS.map((t, i) => (
          <div key={i} style={S.txRow}>
            <span style={{ fontSize: 13, color: "#9E8E84", minWidth: 68 }}>{t.date}</span>
            <span style={{ flex: 1, fontSize: 16, color: "#2C2420" }}>{t.desc}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: t.amount > 0 ? "#5F836B" : "#C4715A" }}>
              {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
            </span>
          </div>
        ))}
        <button style={{ ...S.loginBtn, background: "#9E8E84", marginTop: 20 }} onClick={() => { setLoggedIn(false); setPin(""); }}>
          Log Out
        </button>
      </div>
    </div>
  );
}

const S = {
  page:        { minHeight: "100vh", background: "linear-gradient(160deg,#FDFAF6,#F0F4F8)", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 24px", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" },
  backBtn:     { alignSelf: "flex-start", background: "rgba(61,53,48,.07)", border: "1px solid rgba(61,53,48,.10)", borderRadius: 10, padding: "9px 18px", fontSize: 13, color: "#6B5E57", cursor: "pointer", marginBottom: 16 },
  title:       { fontSize: 30, fontWeight: 800, color: "#2C2420", margin: "8px 0 4px" },
  sub:         { fontSize: 15, color: "#9E8E84" },
  card:        { background: "#fff", borderRadius: 24, padding: "28px 32px", boxShadow: "0 8px 40px rgba(61,53,48,.10)", maxWidth: 400, width: "100%" },
  pinDisplay:  { display: "flex", justifyContent: "center", gap: 16, margin: "20px 0 16px" },
  pinDot:      (filled) => ({ width: 18, height: 18, borderRadius: "50%", background: filled ? "#C4715A" : "#E8E4DF", transition: "background .15s" }),
  numGrid:     { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 },
  numBtn:      { padding: "18px", borderRadius: 14, border: "none", background: "#F5ECD7", fontSize: 22, fontWeight: 600, cursor: "pointer", color: "#2C2420", boxShadow: "0 2px 6px rgba(61,53,48,.07)" },
  error:       { color: "#C4715A", textAlign: "center", fontSize: 14, marginBottom: 8 },
  loginBtn:    { width: "100%", padding: "15px", borderRadius: 14, border: "none", background: "#C4715A", color: "#fff", fontSize: 17, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(196,113,90,.25)" },
  balanceBlock:{ textAlign: "center", padding: "8px 0 16px" },
  divider:     { border: "none", borderTop: "1px solid #E8E4DF", margin: "0 0 14px" },
  txHeader:    { fontSize: 13, fontWeight: 700, color: "#9E8E84", letterSpacing: 1, textTransform: "uppercase", margin: "0 0 10px" },
  txRow:       { display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #F5ECD7" },
};
