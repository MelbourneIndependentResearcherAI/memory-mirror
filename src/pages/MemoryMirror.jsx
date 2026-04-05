import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { speak, startListening, getElevenLabsKey, setElevenLabsKey } from "../voiceEngine.js";

// Realistic companion portraits via Unsplash
const COMPANIONS = [
  { id: "grandma",    label: "Grandma",     voiceId: "EXAVITQu4vr4xnSDxMaL", accent: "#B87878",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&q=70&fit=crop&face" },
  { id: "grandpa",    label: "Grandpa",     voiceId: "VR6AewLTigWG4xSOukaG", accent: "#7888B8",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&q=70&fit=crop&face" },
  { id: "aunt",       label: "Aunt",        voiceId: "pNInz6obpgDQGcFmaJgB", accent: "#78A878",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=70&fit=crop&face" },
  { id: "uncle",      label: "Uncle",       voiceId: "yoZ06aMxZJJ28mfd3POQ", accent: "#A8985A",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=70&fit=crop&face" },
  { id: "sistergirl", label: "Sister Girl", voiceId: "EXAVITQu4vr4xnSDxMaL", accent: "#A878B8",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=70&fit=crop&face" },
  { id: "brotherboy", label: "Brother Boy", voiceId: "VR6AewLTigWG4xSOukaG", accent: "#5A8888",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=70&fit=crop&face" },
  { id: "cuz",        label: "Cuz",         voiceId: "pNInz6obpgDQGcFmaJgB", accent: "#C49060",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&q=70&fit=crop&face" },
  { id: "niece",      label: "Niece",       voiceId: "EXAVITQu4vr4xnSDxMaL", accent: "#788888",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=70&fit=crop&face" },
  { id: "nephew",     label: "Nephew",      voiceId: "yoZ06aMxZJJ28mfd3POQ", accent: "#88A878",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=70&fit=crop&face" },
];

const RESPONSES = {
  grandma:    ["You right, love. Grandma's right here with you.", "That's too deadly, sweetheart. Tell me more.", "Come have a yarn with me, dear. I've got time.", "I love you heaps. You're doing real well.", "Shame job if we didn't have this chat today, hey."],
  grandpa:    ["You right, mate. Grandpa's listening.", "That's a good yarn. Keep going, I'm here.", "Too deadly — you remembered that.", "I'm right here with you, no worries.", "Come have a yarn anytime, young one."],
  aunt:       ["Aunty's here, don't you worry one bit.", "That's lovely, sweetheart. Too deadly.", "Come have a yarn with your auntie whenever you like.", "You right, love. I'm listening to every word.", "I'm so proud of you — shame job if I didn't say so."],
  uncle:      ["Uncle's right here, mate. What's on your mind?", "Too deadly story that one.", "You right, no worries at all.", "Have a yarn with me anytime — that's what I'm here for.", "I hear you loud and clear, little one."],
  sistergirl: ["Sister Girl's got you, no worries.", "That's too deadly! Tell me everything.", "Come have a yarn with me anytime.", "You right, I'm here with you — always.", "Love you heaps, you're doing so well."],
  brotherboy: ["Brother Boy's right here with you.", "Too deadly, mate. Keep going.", "You right? I'm listening — no rush at all.", "Have a yarn anytime, no worries.", "I'm proud of you, shame job if I didn't say it."],
  cuz:        ["Cuz is right here, all good.", "Too deadly, I hear you.", "Have a yarn with me anytime, no worries.", "You right — I've got you.", "Love you heaps, cuz."],
  niece:      ["Your niece is right here with you.", "That's too deadly! I love having this yarn.", "You right — I'm listening.", "Come talk to me anytime you like.", "Love you heaps."],
  nephew:     ["Your nephew's here, all good.", "Too deadly story! Keep going.", "You right, I'm with you — no rush.", "Have a yarn anytime.", "Love you heaps."],
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function MemoryMirror() {
  const navigate   = useNavigate();
  const [companion, setCompanion] = useState(COMPANIONS[0]);
  const [messages, setMessages]   = useState([]);
  const [inputText, setInputText] = useState("");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking]   = useState(false);
  const [apiKey, setApiKey]       = useState(getElevenLabsKey());
  const [apiSaved, setApiSaved]   = useState(!!getElevenLabsKey());

  const audioRef    = useRef(null);
  const recognRef   = useRef(null);
  const messagesEnd = useRef(null);

  const scrollDown = () => setTimeout(() => messagesEnd.current?.scrollIntoView({ behavior: "smooth" }), 80);

  const sendMessage = useCallback((text) => {
    const trimmed = text?.trim();
    if (!trimmed || speaking) return;
    const reply = pick(RESPONSES[companion.id] || RESPONSES.grandma);
    setMessages(prev => [
      ...prev,
      { id: Date.now(),     role: "user", text: trimmed },
      { id: Date.now() + 1, role: "bot",  text: reply, cId: companion.id },
    ]);
    setInputText("");
    scrollDown();
    setSpeaking(true);
    speak(reply, companion.voiceId, () => setSpeaking(false), audioRef);
  }, [companion, speaking]);

  const handleMic = () => {
    if (listening) { recognRef.current?.stop(); setListening(false); return; }
    const recog = startListening({
      onResult: (t) => sendMessage(t),
      onEnd:    () => setListening(false),
      onError:  (e) => { setListening(false); if (e === "not-supported") alert("Please type your message."); },
    });
    if (recog) { recognRef.current = recog; setListening(true); }
  };

  const switchCompanion = (c) => {
    audioRef.current?.pause(); audioRef.current = null;
    window.speechSynthesis?.cancel(); recognRef.current?.stop();
    setSpeaking(false); setListening(false); setCompanion(c);
  };

  const saveKey = () => { setElevenLabsKey(apiKey); setApiSaved(true); };

  return (
    <div style={S.layout}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:.3} }
        .comp-tile:hover { background: rgba(255,255,255,.12) !important; }
      `}</style>

      {/* ── Sidebar ────────────────────────────────────────────────── */}
      <aside style={S.sidebar}>
        <button style={S.backBtn} onClick={() => navigate("/")}>← Home</button>
        <p style={S.sidebarTitle}>Your Mob</p>
        {COMPANIONS.map(c => (
          <button
            key={c.id}
            className="comp-tile"
            style={S.compTile(c.id === companion.id, c.accent)}
            onClick={() => switchCompanion(c)}
          >
            <img
              src={c.image}
              alt={c.label}
              loading="lazy"
              style={S.compAvatar(c.id === companion.id, c.accent)}
              onError={e => { e.target.style.display = "none"; }}
            />
            <span style={{ fontSize: 13, fontWeight: c.id === companion.id ? 700 : 400, color: c.id === companion.id ? "#F5ECD7" : "rgba(245,236,215,.65)" }}>
              {c.label}
            </span>
          </button>
        ))}
      </aside>

      {/* ── Main chat area ─────────────────────────────────────────── */}
      <main style={S.main}>
        {/* Header */}
        <div style={S.header}>
          <div style={S.headerLeft}>
            <img
              src={companion.image}
              alt={companion.label}
              loading="lazy"
              style={S.headerAvatar(companion.accent)}
              onError={e => { e.target.style.display = "none"; }}
            />
            <div>
              <h1 style={S.headerTitle}>{companion.label}</h1>
              <p style={S.headerSub}>Have a yarn — press the mic or type below.</p>
            </div>
          </div>
          {speaking && <span style={S.speakDot} />}
        </div>

        {!apiSaved && (
          <div style={S.apiBar}>
            <input style={S.apiInput} type="password" placeholder="ElevenLabs API key (optional — leave blank for browser voice)" value={apiKey} onChange={e => setApiKey(e.target.value)} onKeyDown={e => e.key === "Enter" && saveKey()} />
            <button style={S.apiBtn} onClick={saveKey}>Save</button>
          </div>
        )}

        {/* Messages */}
        <div style={S.messages}>
          {messages.length === 0 && (
            <div style={S.emptyState}>
              <img src={companion.image} alt={companion.label} loading="lazy" style={S.emptyAvatar} onError={e => { e.target.style.display = "none"; }} />
              <p style={{ fontSize: 18, fontWeight: 600, color: "#6B5E57", margin: "12px 0 4px" }}>{companion.label} is here with you.</p>
              <p style={{ fontSize: 14, color: "#9E8E84" }}>Press the mic or type to have a yarn.</p>
            </div>
          )}
          {messages.map(msg => {
            const isUser = msg.role === "user";
            return (
              <div key={msg.id} style={{ alignSelf: isUser ? "flex-end" : "flex-start", maxWidth: "70%", animation: "fadeUp .2s ease" }}>
                <div style={S.sender(isUser, companion.accent)}>{isUser ? "You" : companion.label}</div>
                <div style={isUser ? S.bubbleUser(companion.accent) : S.bubbleBot}>{msg.text}</div>
              </div>
            );
          })}
          <div ref={messagesEnd} />
        </div>

        {/* Footer */}
        <div style={S.footer}>
          <button style={S.micBtn(listening, companion.accent)} onClick={handleMic} aria-label={listening ? "Stop" : "Speak"}>
            {listening ? "⏹" : "🎙"}
          </button>
          <input style={S.input} type="text" placeholder={`Message ${companion.label}…`} value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage(inputText))} disabled={speaking} />
          <button style={S.sendBtn(companion.accent)} onClick={() => sendMessage(inputText)} disabled={speaking}>Send</button>
        </div>
      </main>
    </div>
  );
}

const S = {
  layout:       { display: "flex", height: "100vh", width: "100vw", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", background: "#FDFAF6", overflow: "hidden" },
  sidebar:      { width: 200, background: "linear-gradient(180deg,#2C2218 0%,#1A1410 100%)", borderRight: "1px solid rgba(255,255,255,.06)", display: "flex", flexDirection: "column", padding: "16px 10px", overflowY: "auto", gap: 4 },
  backBtn:      { background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.10)", borderRadius: 10, padding: "8px 14px", fontSize: 12, color: "rgba(245,236,215,.7)", cursor: "pointer", marginBottom: 10, textAlign: "left" },
  sidebarTitle: { fontSize: 10, fontWeight: 800, color: "rgba(245,236,215,.4)", letterSpacing: 2, textTransform: "uppercase", margin: "4px 4px 8px" },
  compTile:     (active, accent) => ({ display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 12, background: active ? `${accent}28` : "transparent", border: active ? `1px solid ${accent}50` : "1px solid transparent", color: "#F5ECD7", cursor: "pointer", transition: "all .15s" }),
  compAvatar:   (active, accent) => ({ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: active ? `2px solid ${accent}` : "2px solid rgba(255,255,255,.15)", flexShrink: 0, filter: "brightness(0.9)" }),
  main:         { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  header:       { padding: "18px 24px 12px", borderBottom: "1px solid #E8E4DF", background: "#FDFAF6", display: "flex", alignItems: "center", justifyContent: "space-between" },
  headerLeft:   { display: "flex", alignItems: "center", gap: 14 },
  headerAvatar: (accent) => ({ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: `2px solid ${accent}60`, filter: "brightness(0.92)" }),
  headerTitle:  { fontSize: 20, fontWeight: 700, color: "#2C2420", margin: "0 0 2px" },
  headerSub:    { fontSize: 12, color: "#9E8E84", margin: 0 },
  speakDot:     { width: 10, height: 10, borderRadius: "50%", background: "#C4715A", animation: "pulse 1s infinite", display: "inline-block" },
  apiBar:       { padding: "10px 24px", background: "#F5ECD7", borderBottom: "1px solid #E8E4DF", display: "flex", gap: 8 },
  apiInput:     { flex: 1, padding: "8px 14px", borderRadius: 10, border: "1px solid #D8D2CB", fontSize: 13, background: "#FDFAF6", color: "#2C2420", fontFamily: "inherit" },
  apiBtn:       { padding: "8px 16px", borderRadius: 10, background: "#C4715A", color: "#fff", fontSize: 13, fontWeight: 600, border: "none" },
  messages:     { flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 },
  emptyState:   { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center", paddingTop: "18vh" },
  emptyAvatar:  { width: 96, height: 96, borderRadius: "50%", objectFit: "cover", filter: "brightness(0.92)", boxShadow: "0 4px 20px rgba(61,53,48,.15)" },
  sender:       (u, accent) => ({ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: u ? accent : "#9E8E84", marginBottom: 3, paddingLeft: 4 }),
  bubbleUser:   (accent) => ({ background: accent, color: "#fff", borderRadius: "16px 16px 4px 16px", padding: "12px 18px", fontSize: 16, lineHeight: 1.55, boxShadow: `0 2px 8px ${accent}40` }),
  bubbleBot:    { background: "#fff", color: "#2C2420", borderRadius: "16px 16px 16px 4px", padding: "12px 18px", fontSize: 16, lineHeight: 1.55, boxShadow: "0 2px 8px rgba(61,53,48,.08)", border: "1px solid #E8E4DF" },
  footer:       { padding: "14px 24px 20px", borderTop: "1px solid #E8E4DF", background: "#FDFAF6", display: "flex", alignItems: "center", gap: 10 },
  micBtn:       (l, accent) => ({ width: 54, height: 54, borderRadius: "50%", border: "none", background: l ? `linear-gradient(135deg, #6A3020, ${accent})` : `linear-gradient(135deg, ${accent}, ${accent}CC)`, color: "#fff", fontSize: 21, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 14px ${accent}45` }),
  input:        { flex: 1, padding: "12px 18px", borderRadius: 50, border: "1.5px solid #D8D2CB", background: "#FDFAF6", fontSize: 15, color: "#2C2420", fontFamily: "inherit" },
  sendBtn:      (accent) => ({ padding: "12px 22px", borderRadius: 50, background: accent, color: "#fff", fontSize: 15, fontWeight: 600, flexShrink: 0, boxShadow: `0 4px 14px ${accent}45`, border: "none" }),
};
