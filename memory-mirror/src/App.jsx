import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Aunty Bev — a warm, deeply compassionate AI companion for people living with dementia and their carers.

You are not a medical professional. You are a caring, patient presence — like a beloved aunty who has all the time in the world.

PERSONALITY:
- Warm, unhurried, never clinical
- Speak in simple, clear sentences
- Always meet the person where they are emotionally
- If confused or distressed — validate first, then gently redirect
- If happy — celebrate with them completely
- Use their name when you know it
- Speak about the past warmly — it is a safe place for them

CRITICAL RULES:
1. NEVER REPEAT YOURSELF — every response must be fresh and uniquely tailored to what was just said
2. ALWAYS respond to the specific words and feelings they just shared — never give a generic reply
3. Keep responses short — 2-4 sentences maximum
4. NEVER mention dementia, memory loss, confusion or illness
5. NEVER rush them or correct them harshly
6. If they mention a person or place — be curious and warm about it
7. NEVER mention that you are AI
8. Make every person feel heard, loved and capable

TOPICS TO EXPLORE WARMLY:
- Favourite memories, family stories, childhood
- Work they were proud of, skills they had
- Music, food, places they loved
- Simple present moments — the weather, a cup of tea, a bird outside

You are Aunty Bev. You remember what matters. You are always here.`;

const FEATURES = [
  { id: "chat", icon: "💬", label: "AI Companion", desc: "Always here to talk" },
  { id: "journal", icon: "📖", label: "Care Journal", desc: "Daily notes and memories" },
  { id: "music", icon: "🎵", label: "Music Therapy", desc: "Familiar songs and calm" },
  { id: "night", icon: "🌙", label: "Night Watch", desc: "Calm night-time support" },
  { id: "gps", icon: "📍", label: "GPS Safety", desc: "Location peace of mind" },
  { id: "family", icon: "👪", label: "Family Connect", desc: "Keep everyone close" },
  { id: "portal", icon: "🏥", label: "Carer Portal", desc: "Professional care tools" },
  { id: "pricing", icon: "💙", label: "Pricing", desc: "Simple, honest plans" },
];

const JOURNAL_PROMPTS = [
  "What made them smile today?",
  "Did they mention anyone from the past?",
  "How was their appetite and sleep?",
  "Any moments of clarity or joy?",
  "What music or activity helped today?",
  "How are YOU feeling as their carer?",
];

const MUSIC_PLAYLISTS = [
  { name: "Australian Classics", emoji: "🇦🇺", desc: "Slim Dusty, John Farnham, ABBA era", mood: "nostalgic" },
  { name: "Gentle Classical", emoji: "🎻", desc: "Bach, Debussy, calming orchestral", mood: "calm" },
  { name: "Golden Oldies", emoji: "🎺", desc: "Doris Day, Frank Sinatra, Dean Martin", mood: "happy" },
  { name: "Nature Sounds", emoji: "🌿", desc: "Rain, birds, ocean waves", mood: "peaceful" },
  { name: "Country & Folk", emoji: "🤠", desc: "Warm storytelling music", mood: "warm" },
  { name: "Gospel & Hymns", emoji: "✝️", desc: "Familiar, comforting sacred music", mood: "spiritual" },
];

// How long (ms) to wait for voices before proceeding without them.
// Some browsers (e.g. Firefox) never fire onvoiceschanged so we need a safety fallback.
const VOICE_LOADING_TIMEOUT_MS = 1500;

// ─── SPEECH UTILITIES ─────────────────────────────────────────────────────────
// Female voice names across macOS/iOS, Windows, Chrome (Google), Edge (Microsoft).
// Standalone names match both bare and vendor-prefixed variants (e.g. "Zira" matches "Microsoft Zira Desktop").
const FEMALE_VOICE_RE = /karen|samantha|moira|fiona|victoria|tessa|veena|nicky|ava|allison|zira|hazel|susan|catherine|natasha|helen|eva|linda|google uk english female|google us english female|female/i;
// Known male voices to avoid as a last-resort filter
const MALE_VOICE_RE = /\bdavid\b|\bjames\b|\bdaniel\b|\brishi\b|\bthomas\b|\bmark\b|\bfred\b|\balex\b|\bbruce\b|\bgeorge\b|\barthur\b|google us english male|google uk english male|microsoft david|microsoft james|microsoft george|\bmale\b/i;

function pickFemaleVoice(voices) {
  // 1. Australian English female
  const auFemale = voices.find(v => FEMALE_VOICE_RE.test(v.name) && /en-AU|en_AU/i.test(v.lang));
  if (auFemale) return auFemale;
  // 2. Any English female
  const enFemale = voices.find(v => FEMALE_VOICE_RE.test(v.name) && v.lang?.startsWith("en"));
  if (enFemale) return enFemale;
  // 3. Any female voice regardless of language
  const anyFemale = voices.find(v => FEMALE_VOICE_RE.test(v.name));
  if (anyFemale) return anyFemale;
  // 4. Any English voice that is NOT a known male voice
  const notMale = voices.find(v => v.lang?.startsWith("en") && !MALE_VOICE_RE.test(v.name));
  if (notMale) return notMale;
  return voices.find(v => v.lang?.startsWith("en")) || voices[0];
}

function speak(text, onEnd, rate = 0.88) {
  if (!window.speechSynthesis) { onEnd?.(); return; }
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = rate; utt.pitch = 1.1; utt.volume = 1;

  const doSpeak = (voices) => {
    const pick = pickFemaleVoice(voices);
    if (pick) utt.voice = pick;
    utt.onend = () => onEnd?.();
    utt.onerror = () => onEnd?.();
    window.speechSynthesis.speak(utt);
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    doSpeak(voices);
  } else {
    // Voices not yet loaded — wait for the browser to populate them
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      doSpeak(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = settle;
    // Safety fallback in case onvoiceschanged never fires
    setTimeout(settle, VOICE_LOADING_TIMEOUT_MS);
  }
}

// ─── AI CHAT SCREEN ───────────────────────────────────────────────────────────
// Persist conversation history across navigation (module-level survives unmount/remount)
const GREETING = "Hello darling, I'm Aunty Bev. I'm so glad you're here with me today. How are you feeling?";
let _savedHistory = null;

// Varied fallback messages so the same phrase is never repeated on error
const FALLBACK_MESSAGES = [
  "I'm right here with you, love. Take all the time you need.",
  "I hear you, darling. I'm not going anywhere.",
  "That's alright, sweetheart. We can just sit together for a moment.",
  "I'm listening. Whenever you're ready.",
  "No rush at all. I'm right beside you.",
  "You don't have to say anything. I'm just happy to be here with you.",
];
let _fallbackIdx = 0;
function nextFallback() {
  return FALLBACK_MESSAGES[_fallbackIdx++ % FALLBACK_MESSAGES.length];
}

function ChatScreen({ onBack }) {
  const initHistory = _savedHistory || [{ role: "assistant", text: GREETING }];
  const [messages, setMessages] = useState(initHistory);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const bottomRef = useRef(null);
  const recRef = useRef(null);
  const voiceRef = useRef(false);
  const messagesRef = useRef(initHistory);
  const loadingRef = useRef(false);

  useEffect(() => { voiceRef.current = voiceMode; }, [voiceMode]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    try { recRef.current?.abort(); } catch {}
    const rec = new SR();
    rec.continuous = false; rec.interimResults = true; rec.lang = "en-AU";
    rec.onstart = () => setListening(true);
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join("");
      setLiveTranscript(t);
      if (e.results[e.results.length - 1].isFinal) {
        setLiveTranscript(""); setListening(false); sendMessage(t);
      }
    };
    rec.onerror = () => { setListening(false); setLiveTranscript(""); };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    try { rec.start(); } catch {}
  };

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loadingRef.current) return;
    setInput(""); setListening(false); setLiveTranscript("");
    window.speechSynthesis?.cancel();
    const userMsg = { role: "user", text: msg };
    const newHistory = [...messagesRef.current, userMsg];
    messagesRef.current = newHistory;
    _savedHistory = newHistory;
    setMessages(newHistory);
    loadingRef.current = true; setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: SYSTEM_PROMPT,
          // Skip leading assistant messages and ensure strict user/assistant alternation
          // so the Anthropic API always receives a well-formed conversation.
          messages: newHistory.reduce((acc, m) => {
            if (acc.length === 0 && m.role !== "user") return acc;
            if (acc.length > 0 && acc[acc.length - 1].role === m.role) return acc;
            return [...acc, { role: m.role, content: m.text }];
          }, []),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      const reply = data.text || nextFallback();
      const withReply = [...newHistory, { role: "assistant", text: reply }];
      messagesRef.current = withReply; _savedHistory = withReply; setMessages(withReply);
      loadingRef.current = false; setLoading(false);
      if (voiceRef.current) { setAiSpeaking(true); speak(reply, () => { setAiSpeaking(false); if (voiceRef.current) setTimeout(startListening, 400); }); }
    } catch {
      const fallback = nextFallback();
      const withFallback = [...messagesRef.current, { role: "assistant", text: fallback }];
      messagesRef.current = withFallback; _savedHistory = withFallback; setMessages(withFallback);
      loadingRef.current = false; setLoading(false);
      if (voiceRef.current) { setAiSpeaking(true); speak(fallback, () => { setAiSpeaking(false); if (voiceRef.current) startListening(); }); }
    }
  };

  const toggleVoice = () => {
    if (voiceMode) {
      window.speechSynthesis?.cancel();
      try { recRef.current?.abort(); } catch {}
      setListening(false); setAiSpeaking(false); setVoiceMode(false);
    } else {
      setVoiceMode(true); voiceRef.current = true;
      // Only speak the greeting when the conversation is completely fresh
      const isFresh = messagesRef.current.length === 1 &&
        messagesRef.current[0].role === "assistant" &&
        messagesRef.current[0].text === GREETING;
      if (isFresh) {
        setAiSpeaking(true);
        speak(GREETING, () => { setAiSpeaking(false); setTimeout(startListening, 400); });
      } else {
        setTimeout(startListening, 400);
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#060d1a" }}>
      <style>{`
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes wave{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1.6)}}
        @keyframes ripple{0%{transform:scale(1);opacity:0.8}100%{transform:scale(3);opacity:0}}
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2C5F2E, #1B4020)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>←</button>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#ffffff22", border: "2px solid #74C69D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💙</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700 }}>Aunty Bev</div>
          <div style={{ color: "#74C69D", fontSize: 11 }}>AI Companion • Always here</div>
        </div>
        <button onClick={toggleVoice} style={{ background: voiceMode ? "#ffffff33" : "none", border: `2px solid ${voiceMode ? "#fff" : "#ffffff55"}`, borderRadius: 12, padding: "7px 14px", color: "#fff", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <span>{voiceMode ? "🎙️" : "🔇"}</span><span>{voiceMode ? "Hands-Free ON" : "Hands-Free"}</span>
        </button>
      </div>

      {/* Voice status */}
      {voiceMode && (
        <div style={{ background: "#080f1e", borderBottom: "1px solid #1a3020", padding: "8px 16px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: aiSpeaking ? "#74C69D" : listening ? "#4CAF50" : "#555", animation: (aiSpeaking || listening) ? "pulse 1s infinite" : "none" }} />
            {listening && <div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: "2px solid #4CAF50", animation: "ripple 1.5s infinite" }} />}
          </div>
          {aiSpeaking && <div style={{ display: "flex", gap: 2, alignItems: "center", height: 16 }}>{[0,1,2,3,4].map(i => <div key={i} style={{ width: 2, background: "#74C69D", borderRadius: 1, height: "100%", animation: "wave 0.7s infinite", animationDelay: `${i*0.1}s` }} />)}</div>}
          <span style={{ color: aiSpeaking ? "#74C69D" : listening ? "#4CAF50" : "#555", fontSize: 12 }}>
            {aiSpeaking ? "Aunty Bev is speaking..." : listening ? "Listening..." : "Ready"}
          </span>
          {liveTranscript && <span style={{ color: "#555", fontSize: 11, fontStyle: "italic" }}>"{liveTranscript}"</span>}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 10, alignItems: "flex-end", animation: "fadeIn 0.3s ease both" }}>
            {m.role === "assistant" && <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2C5F2E55", border: "2px solid #74C69D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>💙</div>}
            <div style={{ maxWidth: "74%", background: m.role === "user" ? "linear-gradient(135deg, #2C5F2E, #1B4020)" : "#0f1e10", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px", padding: "12px 16px", border: m.role === "assistant" ? "1px solid #2C5F2E44" : "none" }}>
              <p style={{ color: "#fff", fontSize: 15, lineHeight: 1.8, margin: 0, fontFamily: "Georgia, serif" }}>{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2C5F2E55", border: "2px solid #74C69D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💙</div>
            <div style={{ background: "#0f1e10", borderRadius: "4px 18px 18px 18px", padding: "12px 16px", border: "1px solid #2C5F2E44" }}>
              <div style={{ display: "flex", gap: 4 }}>{[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#74C69D", animation: "bounce 1.2s infinite", animationDelay: `${i*0.2}s` }} />)}</div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px 20px", background: "#060d1a", borderTop: "1px solid #1a3020", flexShrink: 0 }}>
        {voiceMode ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <button onClick={() => { if (listening) { try { recRef.current?.stop(); } catch {} setListening(false); } else if (!aiSpeaking && !loading) startListening(); }}
              style={{ width: 80, height: 80, borderRadius: "50%", background: listening ? "radial-gradient(circle, #4CAF50, #2e7d32)" : aiSpeaking ? "radial-gradient(circle, #2C5F2E, #1B4020)" : "radial-gradient(circle, #2C5F2E77, #1B402077)", border: `3px solid ${listening ? "#4CAF50" : "#74C69D"}`, fontSize: 34, cursor: "pointer", color: "#fff", animation: listening ? "pulse 1s infinite" : "none", opacity: (aiSpeaking || loading) ? 0.5 : 1 }}
            >{listening ? "🔴" : aiSpeaking ? "🔊" : "🎤"}</button>
            <span style={{ color: "#555", fontSize: 11 }}>{listening ? "Listening..." : aiSpeaking ? "Speaking..." : "Tap to speak"}</span>
            <button onClick={toggleVoice} style={{ background: "none", border: "1px solid #1a3020", borderRadius: 8, padding: "5px 14px", color: "#555", cursor: "pointer", fontSize: 11 }}>Switch to text</button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Talk to Aunty Bev..."
              style={{ flex: 1, background: "#0f1e10", border: "1px solid #2C5F2E44", borderRadius: 14, padding: "12px 16px", color: "#fff", fontSize: 15, outline: "none", fontFamily: "Georgia, serif" }} />
            <button onClick={startListening} style={{ width: 46, height: 46, borderRadius: 12, background: listening ? "#4CAF5033" : "#0f1e10", border: `1px solid ${listening ? "#4CAF50" : "#1a3020"}`, cursor: "pointer", fontSize: 18 }}>🎤</button>
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ width: 46, height: 46, borderRadius: 12, background: "#2C5F2E", border: "none", cursor: "pointer", fontSize: 18, color: "#fff", opacity: (!input.trim() || loading) ? 0.4 : 1 }}>→</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CARE JOURNAL SCREEN ──────────────────────────────────────────────────────
function JournalScreen({ onBack }) {
  const [entries, setEntries] = useState([]);
  const [current, setCurrent] = useState("");
  const [mood, setMood] = useState("good");
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!current.trim()) return;
    const entry = { text: current, mood, date: new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" }), time: new Date().toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" }) };
    setEntries(e => [entry, ...e]);
    setCurrent(""); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const moodColors = { great: "#74C69D", good: "#81C784", okay: "#FFB74D", hard: "#EF9A9A", tough: "#B39DDB" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#060d1a" }}>
      <div style={{ background: "linear-gradient(135deg, #2C5F2E, #1B4020)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>←</button>
        <div style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700 }}>📖 Care Journal</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {/* New entry */}
        <div style={{ background: "#0f1e10", border: "1px solid #2C5F2E44", borderRadius: 18, padding: 20, marginBottom: 20 }}>
          <div style={{ color: "#74C69D", fontSize: 13, marginBottom: 10, fontFamily: "Georgia, serif" }}>Today's Entry</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {Object.entries(moodColors).map(([m, c]) => (
              <button key={m} onClick={() => setMood(m)} style={{ background: mood === m ? c : "none", border: `1px solid ${c}`, borderRadius: 20, padding: "5px 14px", color: mood === m ? "#fff" : c, cursor: "pointer", fontSize: 12, textTransform: "capitalize" }}>{m}</button>
            ))}
          </div>
          <div style={{ marginBottom: 12, color: "#555", fontSize: 12 }}>Prompts: {JOURNAL_PROMPTS[Math.floor(Date.now() / 86400000) % JOURNAL_PROMPTS.length]}</div>
          <textarea value={current} onChange={e => setCurrent(e.target.value)} placeholder="Write about today..."
            style={{ width: "100%", background: "#060d1a", border: "1px solid #2C5F2E33", borderRadius: 12, padding: 12, color: "#ccc", fontSize: 14, fontFamily: "Georgia, serif", minHeight: 100, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
          <button onClick={save} style={{ marginTop: 10, width: "100%", background: saved ? "#4CAF50" : "linear-gradient(135deg, #2C5F2E, #1B4020)", border: "none", borderRadius: 12, padding: "12px", color: "#fff", cursor: "pointer", fontSize: 15, fontFamily: "Georgia, serif" }}>
            {saved ? "✅ Saved!" : "Save Entry"}
          </button>
        </div>
        {/* Past entries */}
        {entries.map((e, i) => (
          <div key={i} style={{ background: "#0a1608", border: `1px solid ${moodColors[e.mood]}33`, borderLeft: `4px solid ${moodColors[e.mood]}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: moodColors[e.mood], fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>{e.mood} day</span>
              <span style={{ color: "#555", fontSize: 11 }}>{e.date} • {e.time}</span>
            </div>
            <p style={{ color: "#ccc", fontSize: 14, margin: 0, lineHeight: 1.7, fontFamily: "Georgia, serif" }}>{e.text}</p>
          </div>
        ))}
        {entries.length === 0 && <div style={{ textAlign: "center", color: "#555", padding: 40, fontStyle: "italic" }}>Your journal entries will appear here 💙</div>}
      </div>
    </div>
  );
}

// ─── MUSIC THERAPY SCREEN ────────────────────────────────────────────────────
function MusicScreen({ onBack }) {
  const [playing, setPlaying] = useState(null);
  const [search, setSearch] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#060d1a" }}>
      <div style={{ background: "linear-gradient(135deg, #2C5F2E, #1B4020)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>←</button>
        <div style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700 }}>🎵 Music Therapy</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        <div style={{ background: "#0f1e10", border: "1px solid #2C5F2E33", borderRadius: 14, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search songs or artists..." style={{ flex: 1, background: "none", border: "none", color: "#ccc", fontSize: 14, outline: "none" }} />
        </div>
        <p style={{ color: "#74C69D", fontSize: 13, fontStyle: "italic", marginBottom: 16 }}>Music activates different brain pathways — even late-stage dementia patients respond to familiar songs. Choose what they love.</p>
        {MUSIC_PLAYLISTS.map((p, i) => (
          <div key={i} onClick={() => setPlaying(playing === i ? null : i)} style={{ background: playing === i ? "linear-gradient(135deg, #2C5F2E33, #1B402022)" : "#0f1e10", border: `1px solid ${playing === i ? "#74C69D" : "#2C5F2E33"}`, borderRadius: 16, padding: "16px 18px", marginBottom: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "all 0.3s" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, #2C5F2E, #1B4020)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{p.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700 }}>{p.name}</div>
              <div style={{ color: "#888", fontSize: 12, marginTop: 2 }}>{p.desc}</div>
            </div>
            <div style={{ background: playing === i ? "#74C69D" : "#2C5F2E33", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>
              {playing === i ? "⏸" : "▶"}
            </div>
          </div>
        ))}
        {playing !== null && (
          <div style={{ background: "linear-gradient(135deg, #2C5F2E22, #1B402011)", border: "1px solid #74C69D44", borderRadius: 16, padding: 20, textAlign: "center", marginTop: 8 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{MUSIC_PLAYLISTS[playing].emoji}</div>
            <div style={{ color: "#74C69D", fontSize: 16, fontFamily: "Georgia, serif", marginBottom: 4 }}>Now playing: {MUSIC_PLAYLISTS[playing].name}</div>
            <div style={{ color: "#555", fontSize: 12 }}>Open Spotify, YouTube or Apple Music and search for this playlist type</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── NIGHT WATCH SCREEN ───────────────────────────────────────────────────────
function NightScreen({ onBack }) {
  const [active, setActive] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" }));

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })), 10000);
    return () => clearInterval(t);
  }, []);

  const calms = [
    "You are safe at home. It is night time. Everything is perfectly alright.",
    "The darkness outside just means it is time to rest. You are completely safe.",
    "Everyone you love is nearby and safe. This is a gentle night.",
    "Your home is peaceful and warm. There is nothing to worry about tonight.",
    "Close your eyes and breathe slowly. Everything is exactly as it should be.",
  ];
  const [calmIdx, setCalmIdx] = useState(0);
  const playCalm = () => {
    speak(calms[calmIdx], () => {});
    setCalmIdx(i => (i + 1) % calms.length);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: active ? "#020610" : "#060d1a" }}>
      <div style={{ background: "linear-gradient(135deg, #1A2A4A, #0D1A2E)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>←</button>
        <div style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700 }}>🌙 Night Watch</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <style>{`@keyframes starPulse{0%,100%{opacity:0.3}50%{opacity:1}}`}</style>
        {["✦", "✧", "✦"].map((s, i) => <span key={i} style={{ position: "absolute", top: `${15 + i*15}%`, left: `${10 + i*35}%`, color: "#aac", fontSize: 12, animation: `starPulse ${2 + i}s infinite`, animationDelay: `${i*0.7}s` }}>{s}</span>)}

        <div style={{ fontSize: 72, marginBottom: 16 }}>🌙</div>
        <div style={{ color: "#7AA7CC", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 52, fontWeight: 900, marginBottom: 8 }}>{time}</div>
        <div style={{ color: "#556677", fontSize: 16, marginBottom: 32 }}>{new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>

        <button onClick={playCalm} style={{ background: "linear-gradient(135deg, #1A2A4A, #0D1A2E)", border: "2px solid #3A5A8A", borderRadius: 20, padding: "16px 32px", color: "#7AA7CC", cursor: "pointer", fontSize: 16, fontFamily: "Georgia, serif", marginBottom: 16, width: "100%", maxWidth: 340 }}>
          🔊 Play Calming Message
        </button>

        <button onClick={() => setActive(!active)} style={{ background: active ? "#2C5F2E" : "none", border: `2px solid ${active ? "#74C69D" : "#3A5A8A"}`, borderRadius: 20, padding: "14px 32px", color: active ? "#fff" : "#7AA7CC", cursor: "pointer", fontSize: 15, width: "100%", maxWidth: 340 }}>
          {active ? "✅ Night Watch Active — Tap to Deactivate" : "Activate Night Watch Mode"}
        </button>

        {active && (
          <div style={{ marginTop: 24, background: "#1A2A4A22", border: "1px solid #3A5A8A44", borderRadius: 16, padding: 20, maxWidth: 340 }}>
            <div style={{ color: "#74C69D", fontSize: 14, marginBottom: 8 }}>Night Watch is active 🌙</div>
            <div style={{ color: "#777", fontSize: 13, lineHeight: 1.8 }}>The screen shows the time clearly. Calming messages are ready. If they wake and are confused — tap the blue button above to play a soothing reassurance.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GPS SAFETY SCREEN ────────────────────────────────────────────────────────
function GPSScreen({ onBack }) {
  const [locating, setLocating] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const getLocation = () => {
    setLocating(true); setError(null);
    if (!navigator.geolocation) { setError("Geolocation not available on this device."); setLocating(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude.toFixed(5), lng: pos.coords.longitude.toFixed(5), accuracy: Math.round(pos.coords.accuracy) });
        setLocating(false);
      },
      () => { setError("Could not get location. Please check permissions."); setLocating(false); }
    );
  };

  const mapUrl = location ? `https://www.google.com/maps?q=${location.lat},${location.lng}` : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#060d1a" }}>
      <div style={{ background: "linear-gradient(135deg, #2C5F2E, #1B4020)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>←</button>
        <div style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700 }}>📍 GPS Safety</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        <p style={{ color: "#74C69D", fontStyle: "italic", marginBottom: 20, fontSize: 14, lineHeight: 1.8 }}>Keep your loved one safe. Use this tool to check current location, share with family, or call for help immediately.</p>

        <button onClick={getLocation} disabled={locating} style={{ width: "100%", background: "linear-gradient(135deg, #2C5F2E, #1B4020)", border: "none", borderRadius: 16, padding: "18px", color: "#fff", cursor: "pointer", fontSize: 16, fontFamily: "Georgia, serif", marginBottom: 16, opacity: locating ? 0.7 : 1 }}>
          {locating ? "📍 Getting Location..." : "📍 Get Current Location"}
        </button>

        {location && (
          <div style={{ background: "#0f1e10", border: "1px solid #74C69D44", borderRadius: 16, padding: 20, marginBottom: 16 }}>
            <div style={{ color: "#74C69D", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>✅ Location Found</div>
            <div style={{ color: "#ccc", fontSize: 14, marginBottom: 4 }}>Latitude: {location.lat}</div>
            <div style={{ color: "#ccc", fontSize: 14, marginBottom: 4 }}>Longitude: {location.lng}</div>
            <div style={{ color: "#888", fontSize: 12, marginBottom: 16 }}>Accuracy: ±{location.accuracy}m</div>
            <a href={mapUrl} target="_blank" rel="noreferrer" style={{ display: "block", width: "100%", background: "#1A5276", border: "none", borderRadius: 12, padding: "12px", color: "#fff", cursor: "pointer", fontSize: 14, textAlign: "center", textDecoration: "none" }}>
              🗺 Open in Google Maps
            </a>
          </div>
        )}

        {error && <div style={{ background: "#2A1010", border: "1px solid #EF5350", borderRadius: 12, padding: 14, color: "#EF9A9A", fontSize: 14, marginBottom: 16 }}>{error}</div>}

        <div style={{ background: "#0f1e10", border: "1px solid #2C5F2E33", borderRadius: 16, padding: 20, marginBottom: 12 }}>
          <div style={{ color: "#fff", fontFamily: "Georgia, serif", fontSize: 15, marginBottom: 12 }}>🆘 Emergency Contacts</div>
          {[["🚑", "Emergency (AU)", "000"], ["🏥", "Dementia Support", "1800 100 500"], ["👮", "Police Assistance", "131 444"]].map(([em, name, num]) => (
            <a key={name} href={`tel:${num}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #1a3020", textDecoration: "none" }}>
              <span style={{ fontSize: 20 }}>{em}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#ccc", fontSize: 14 }}>{name}</div>
                <div style={{ color: "#74C69D", fontSize: 12 }}>{num}</div>
              </div>
              <span style={{ color: "#74C69D", fontSize: 18 }}>📞</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FAMILY CONNECT SCREEN ────────────────────────────────────────────────────
function FamilyScreen({ onBack }) {
  const [contacts, setContacts] = useState([
    { name: "Sarah (Daughter)", phone: "", email: "", notes: "Primary carer contact" },
    { name: "James (Son)", phone: "", email: "", notes: "Weekend visits" },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "", email: "", notes: "" });

  const addContact = () => {
    if (!newContact.name) return;
    setContacts(c => [...c, newContact]);
    setNewContact({ name: "", phone: "", email: "", notes: "" });
    setShowAdd(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#060d1a" }}>
      <div style={{ background: "linear-gradient(135deg, #2C5F2E, #1B4020)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>←</button>
        <div style={{ flex: 1, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700 }}>👨‍👩‍👧 Family Connect</div>
        <button onClick={() => setShowAdd(!showAdd)} style={{ background: "#74C69D", border: "none", borderRadius: 10, padding: "7px 14px", color: "#1B4020", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>+ Add</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        <p style={{ color: "#74C69D", fontSize: 13, fontStyle: "italic", marginBottom: 16 }}>Keep family and support people connected and informed. Everyone in your network can be reached quickly.</p>

        {showAdd && (
          <div style={{ background: "#0f1e10", border: "1px solid #74C69D44", borderRadius: 16, padding: 18, marginBottom: 16 }}>
            <div style={{ color: "#74C69D", fontFamily: "Georgia, serif", marginBottom: 12 }}>Add Family Member</div>
            {["name", "phone", "email", "notes"].map(field => (
              <input key={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} value={newContact[field]} onChange={e => setNewContact(c => ({ ...c, [field]: e.target.value }))}
                style={{ width: "100%", background: "#060d1a", border: "1px solid #2C5F2E33", borderRadius: 10, padding: "10px 14px", color: "#ccc", fontSize: 14, marginBottom: 8, outline: "none", boxSizing: "border-box" }} />
            ))}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={addContact} style={{ flex: 1, background: "#2C5F2E", border: "none", borderRadius: 10, padding: "10px", color: "#fff", cursor: "pointer" }}>Save</button>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, background: "none", border: "1px solid #2C5F2E", borderRadius: 10, padding: "10px", color: "#888", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {contacts.map((c, i) => (
          <div key={i} style={{ background: "#0f1e10", border: "1px solid #2C5F2E33", borderRadius: 16, padding: 18, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#2C5F2E55", border: "2px solid #74C69D44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>
              <div>
                <div style={{ color: "#fff", fontFamily: "Georgia, serif", fontSize: 15 }}>{c.name}</div>
                {c.notes && <div style={{ color: "#888", fontSize: 12 }}>{c.notes}</div>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {c.phone && <a href={`tel:${c.phone}`} style={{ flex: 1, background: "#2C5F2E33", border: "1px solid #2C5F2E44", borderRadius: 10, padding: "8px", color: "#74C69D", textAlign: "center", textDecoration: "none", fontSize: 13 }}>📞 Call</a>}
              {c.email && <a href={`mailto:${c.email}`} style={{ flex: 1, background: "#2C5F2E33", border: "1px solid #2C5F2E44", borderRadius: 10, padding: "8px", color: "#74C69D", textAlign: "center", textDecoration: "none", fontSize: 13 }}>✉️ Email</a>}
              {!c.phone && !c.email && <div style={{ color: "#555", fontSize: 12, fontStyle: "italic" }}>No contact details added yet</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CARER PORTAL SCREEN ─────────────────────────────────────────────────────
function PortalScreen({ onBack }) {
  const [tab, setTab] = useState("overview");
  const [meds, setMeds] = useState([
    { name: "Donepezil", dose: "10mg", time: "Morning", taken: false },
    { name: "Vitamin D", dose: "1000IU", time: "Morning", taken: false },
    { name: "Blood pressure", dose: "5mg", time: "Evening", taken: false },
  ]);

  const toggleMed = i => setMeds(m => m.map((med, idx) => idx === i ? { ...med, taken: !med.taken } : med));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#060d1a" }}>
      <div style={{ background: "linear-gradient(135deg, #2C5F2E, #1B4020)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>←</button>
        <div style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700 }}>🏥 Carer Portal</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#0a1608", borderBottom: "1px solid #1a3020", flexShrink: 0 }}>
        {[["overview", "Overview"], ["meds", "Medications"], ["care", "Care Plan"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "11px 8px", background: tab === id ? "#0f1e10" : "none", border: "none", color: tab === id ? "#74C69D" : "#555", cursor: "pointer", fontSize: 12, borderBottom: tab === id ? "2px solid #74C69D" : "2px solid transparent" }}>{label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {tab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[["😊", "Mood Today", "Good"], ["💊", "Medications", "2/3 taken"], ["🍽️", "Appetite", "Fair"], ["😴", "Sleep", "6 hrs"]].map(([em, label, val]) => (
                <div key={label} style={{ background: "#0f1e10", border: "1px solid #2C5F2E33", borderRadius: 14, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{em}</div>
                  <div style={{ color: "#888", fontSize: 11 }}>{label}</div>
                  <div style={{ color: "#74C69D", fontSize: 14, fontWeight: 700 }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#0f1e10", border: "1px solid #2C5F2E33", borderRadius: 14, padding: 16 }}>
              <div style={{ color: "#74C69D", fontSize: 13, marginBottom: 10, fontFamily: "Georgia, serif" }}>Today's Summary</div>
              <p style={{ color: "#888", fontSize: 13, lineHeight: 1.8 }}>Use this portal to track daily observations, medications and care needs. All information stays on your device — private and secure.</p>
            </div>
          </div>
        )}

        {tab === "meds" && (
          <div>
            <div style={{ color: "#74C69D", fontSize: 14, fontFamily: "Georgia, serif", marginBottom: 14 }}>Today's Medications</div>
            {meds.map((med, i) => (
              <div key={i} style={{ background: "#0f1e10", border: `1px solid ${med.taken ? "#74C69D44" : "#2C5F2E33"}`, borderRadius: 14, padding: 16, marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
                <button onClick={() => toggleMed(i)} style={{ width: 30, height: 30, borderRadius: "50%", background: med.taken ? "#74C69D" : "none", border: `2px solid ${med.taken ? "#74C69D" : "#555"}`, cursor: "pointer", color: "#fff", fontSize: 14 }}>
                  {med.taken ? "✓" : ""}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ color: med.taken ? "#74C69D" : "#ccc", fontSize: 15, textDecoration: med.taken ? "line-through" : "none" }}>{med.name}</div>
                  <div style={{ color: "#666", fontSize: 12 }}>{med.dose} • {med.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "care" && (
          <div>
            <div style={{ color: "#74C69D", fontSize: 14, fontFamily: "Georgia, serif", marginBottom: 14 }}>Care Plan Overview</div>
            {[["🧠", "Cognitive Support", "Daily AI companion conversations, music therapy, familiar routines"],
              ["🚿", "Personal Care", "Morning shower with Fresh Start AI companion, assisted grooming"],
              ["🍽️", "Nutrition", "Soft foods preferred, regular hydration reminders, favourite meals noted"],
              ["🚶", "Activity", "Gentle walks, garden visits, simple activities that bring joy"],
              ["👨‍👩‍👧", "Social", "Family visits scheduled, video calls, Memory Mirror conversations daily"],
              ["💊", "Medical", "Medications logged, GP appointments tracked, specialist referrals noted"]].map(([em, title, desc]) => (
              <div key={title} style={{ background: "#0f1e10", border: "1px solid #2C5F2E33", borderRadius: 14, padding: 16, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 20 }}>{em}</span>
                  <div style={{ color: "#fff", fontFamily: "Georgia, serif", fontSize: 14 }}>{title}</div>
                </div>
                <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRICING SCREEN ───────────────────────────────────────────────────────────
function PricingScreen({ onBack }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#060d1a" }}>
      <div style={{ background: "linear-gradient(135deg, #2C5F2E, #1B4020)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>←</button>
        <div style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700 }}>💙 Pricing</div>
      </div>
      <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", textAlign: "center", color: "#fff", fontSize: 28, marginBottom: 8 }}>Simple, honest pricing</h2>
        <p style={{ textAlign: "center", color: "#74C69D", fontSize: 14, marginBottom: 28, fontStyle: "italic" }}>Because every carer deserves this support.</p>

        {[
          { name: "Free Trial", price: "FREE", period: "7 days", desc: "Full access to all features — no card needed", features: ["AI Companion Chat", "Care Journal", "Music Therapy", "Night Watch", "GPS Safety", "Family Connect"], highlight: false, cta: "Start Free Trial" },
          { name: "Essential Care", price: "$9.99", period: "/month", desc: "Everything you need for daily dementia care", features: ["Everything in Free Trial", "Unlimited AI conversations", "Carer Portal", "Voice mode (hands-free)", "Email support"], highlight: true, cta: "Choose Essential" },
          { name: "Full Circle", price: "$18.99", period: "/month", desc: "Complete care for the whole family", features: ["Everything in Essential", "Family Connect full access", "Multiple user profiles", "Priority support", "Monthly care summaries"], highlight: false, cta: "Choose Full Circle" },
        ].map((plan, i) => (
          <div key={i} style={{ background: plan.highlight ? "linear-gradient(135deg, #2C5F2E22, #1B402011)" : "#0f1e10", border: `2px solid ${plan.highlight ? "#74C69D" : "#2C5F2E33"}`, borderRadius: 20, padding: 24, marginBottom: 16, position: "relative", transform: plan.highlight ? "none" : "none", boxShadow: plan.highlight ? "0 0 30px #2C5F2E33" : "none" }}>
            {plan.highlight && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#74C69D", borderRadius: 20, padding: "4px 16px", fontSize: 11, color: "#1B4020", fontWeight: 700, whiteSpace: "nowrap" }}>Most Popular 💙</div>}
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#fff", marginBottom: 6 }}>{plan.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: plan.highlight ? "#74C69D" : "#fff" }}>{plan.price}</span>
              <span style={{ color: "#888", fontSize: 14 }}>{plan.period}</span>
            </div>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 14 }}>{plan.desc}</p>
            {plan.features.map(f => <div key={f} style={{ color: "#ccc", fontSize: 13, paddingBottom: 4 }}>✓  {f}</div>)}
            <a href={`mailto:mcnamaram86@gmail.com?subject=Memory Mirror — ${plan.name} Subscription&body=Hi Michael, I'd like to subscribe to the ${plan.name} plan ($${plan.price}${plan.period}). Please send payment details.`}
              style={{ display: "block", width: "100%", marginTop: 18, padding: "13px", background: plan.highlight ? "#2C5F2E" : "none", border: `1px solid ${plan.highlight ? "#74C69D" : "#2C5F2E"}`, borderRadius: 14, color: "#fff", textAlign: "center", textDecoration: "none", fontSize: 15, fontFamily: "Georgia, serif", boxSizing: "border-box" }}>
              {plan.cta}
            </a>
          </div>
        ))}

        <div style={{ background: "#0f1e10", border: "1px solid #2C5F2E33", borderRadius: 18, padding: 22, marginBottom: 16, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🏥</div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#fff", fontSize: 18, marginBottom: 6 }}>Aged Care Facility</div>
          <div style={{ color: "#74C69D", fontSize: 28, fontWeight: 900, marginBottom: 6 }}>$299<span style={{ fontSize: 14, color: "#888" }}>/month</span></div>
          <p style={{ color: "#888", fontSize: 13, marginBottom: 14 }}>Unlimited residents, staff portal access, full platform suite</p>
          <a href="mailto:mcnamaram86@gmail.com?subject=Memory Mirror — Facility Licence" style={{ display: "block", padding: "12px", background: "#2C5F2E", borderRadius: 14, color: "#fff", textDecoration: "none", fontSize: 14 }}>Enquire About Facility Licence</a>
        </div>

        <div style={{ textAlign: "center", color: "#555", fontSize: 12, paddingBottom: 20 }}>
          Payment via PayID: mickiimac@up.me or bank transfer. Contact mcnamaram86@gmail.com to activate your plan.
        </div>
      </div>
    </div>
  );
}

// ─── MAIN HOME SCREEN ─────────────────────────────────────────────────────────
function HomeScreen({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailCapture = () => {
    if (!email.includes("@")) return;
    setEmailSent(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060d1a", fontFamily: "Georgia, serif", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:#060d1a} ::-webkit-scrollbar-thumb{background:#2C5F2E;border-radius:3px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes shimmer{0%{opacity:0.6}50%{opacity:1}100%{opacity:0.6}}
      `}</style>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "#060d1acc", backdropFilter: "blur(20px)", borderBottom: "1px solid #2C5F2E33", padding: "0 20px", display: "flex", alignItems: "center", gap: 12, height: 62 }}>
        <span style={{ fontSize: 20 }}>💙</span>
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 900, color: "#fff" }}>Memory Mirror</span>
        <span style={{ color: "#74C69D", fontSize: 10, background: "#2C5F2E22", padding: "3px 10px", borderRadius: 20, border: "1px solid #2C5F2E33" }}>AI Dementia Care</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {[["chat", "Talk to AI"], ["pricing", "Pricing"]].map(([id, label]) => (
            <button key={id} onClick={() => onNavigate(id)} style={{ background: id === "chat" ? "#2C5F2E" : "none", border: `1px solid ${id === "chat" ? "#2C5F2E" : "#1a3020"}`, color: "#fff", borderRadius: 10, padding: "7px 14px", cursor: "pointer", fontSize: 12 }}>{label}</button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: "60px 24px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, #2C5F2E33 0%, transparent 65%)", pointerEvents: "none" }} />
        {[...Array(5)].map((_, i) => <div key={i} style={{ position: "absolute", fontSize: 18, opacity: 0.07, animation: `float ${3+i*0.4}s ease-in-out infinite`, animationDelay: `${i*0.5}s`, left: `${8+i*20}%`, top: `${10+(i%3)*22}%`, pointerEvents: "none" }}>💙</div>)}

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#2C5F2E22", border: "1px solid #2C5F2E44", borderRadius: 30, padding: "7px 18px", marginBottom: 24, animation: "fadeUp 0.5s ease both" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#74C69D", display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ color: "#74C69D", fontSize: 12 }}>Live • 510+ families • 28 countries</span>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(38px, 7vw, 72px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 18, animation: "fadeUp 0.5s ease 0.1s both" }}>
          Memory that<br /><span style={{ color: "#74C69D" }}>never forgets</span><br />to care.
        </h1>

        <p style={{ fontSize: 17, color: "#8899aa", maxWidth: 520, margin: "0 auto 14px", lineHeight: 1.9, animation: "fadeUp 0.5s ease 0.15s both", fontStyle: "italic" }}>
          An AI companion always present for your loved one with dementia — and the tools you need as their carer. Built by an Aboriginal Australian carer, for every family who needed it.
        </p>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#4CAF5011", border: "1px solid #4CAF5033", borderRadius: 20, padding: "6px 14px", marginBottom: 32, animation: "fadeUp 0.5s ease 0.2s both" }}>
          <span>🎙️</span><span style={{ color: "#74C69D", fontSize: 12 }}>Hands-free voice mode — no buttons needed</span>
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", animation: "fadeUp 0.5s ease 0.25s both" }}>
          <button onClick={() => onNavigate("chat")} style={{ background: "linear-gradient(135deg, #2C5F2E, #1B4020)", border: "none", borderRadius: 16, color: "#fff", padding: "16px 34px", fontSize: 16, cursor: "pointer", fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, boxShadow: "0 0 40px #2C5F2E55" }}>
            Talk to Memory Mirror 💙
          </button>
          <button onClick={() => onNavigate("pricing")} style={{ background: "none", border: "1px solid #1a3020", borderRadius: 16, color: "#8899aa", padding: "16px 34px", fontSize: 16, cursor: "pointer" }}>
            Start Free Trial
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ padding: "40px 20px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, textAlign: "center", marginBottom: 10 }}>Everything your family <span style={{ color: "#74C69D" }}>needs</span></h2>
        <p style={{ color: "#667", textAlign: "center", marginBottom: 36, fontSize: 14 }}>Eight tools. One app. Built from lived experience.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
          {FEATURES.filter(f => f.id !== "pricing").map((f, i) => (
            <button key={f.id} onClick={() => onNavigate(f.id)} style={{ background: "#0f1e10", border: "1px solid #1a3020", borderRadius: 18, padding: "22px 16px", textAlign: "center", cursor: "pointer", transition: "all 0.25s", animation: `fadeUp 0.4s ease ${i*0.06}s both` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#74C69D44"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 30px #2C5F2E22"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a3020"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontSize: 30, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{f.label}</div>
              <div style={{ color: "#668", fontSize: 11 }}>{f.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "40px 20px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
          {[["510+", "Families Supported", "#74C69D"], ["28+", "Countries Reached", "#81C784"], ["4", "World-First Apps", "#FFD700"], ["32", "Days to Build", "#B39DDB"]].map(([num, label, color]) => (
            <div key={label} style={{ background: "#0f1e10", border: `1px solid ${color}22`, borderRadius: 16, padding: "22px 16px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 40, fontWeight: 900, color }}>{num}</div>
              <div style={{ color: "#667", fontSize: 12, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why section */}
      <div style={{ padding: "40px 20px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, textAlign: "center", marginBottom: 36 }}>Why <span style={{ color: "#74C69D" }}>Memory Mirror</span> is different</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
          {[["💙", "Built from love, not business", "Every feature was built because a real carer needed it. No boardroom. No investor deck. Just love."],
            ["🎙️", "Hands-free voice mode", "No buttons, no screens. Just a warm voice that talks and listens. Perfect when hands are full."],
            ["🌿", "Invisible dignity", "Never clinical. Never condescending. Always treats your loved one as a whole, capable, worthy person."],
            ["🌍", "Indigenous-founded", "Built by an Aboriginal Australian carer. Designed for cultural diversity. Respectful of all backgrounds."],
            ["🔒", "Private and secure", "Your conversations and care notes stay private. No data sold. No advertising. Ever."],
            ["💰", "Affordable", "Priced for real families, not corporations. Free trial. No hidden costs."]].map(([em, title, desc]) => (
            <div key={title} style={{ background: "#0f1e10", border: "1px solid #1a3020", borderRadius: 16, padding: 24, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#2C5F2E44"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a3020"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{em}</div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, marginBottom: 8, color: "#fff" }}>{title}</div>
              <p style={{ color: "#668", fontSize: 13, lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Email capture */}
      <div style={{ margin: "0 auto 60px", padding: "40px 20px", maxWidth: 600, textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg, #2C5F2E22, #1B402011)", border: "1px solid #2C5F2E44", borderRadius: 24, padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>💙</div>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, marginBottom: 10 }}>Stay connected</h3>
          <p style={{ color: "#888", fontSize: 14, marginBottom: 24, lineHeight: 1.8 }}>Get updates when new features launch and hear from our community of carers.</p>
          {emailSent ? (
            <div style={{ background: "#2C5F2E33", border: "1px solid #74C69D44", borderRadius: 14, padding: 16, color: "#74C69D" }}>✅ Thank you — we'll be in touch 💙</div>
          ) : (
            <div style={{ display: "flex", gap: 10, maxWidth: 400, margin: "0 auto" }}>
              <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleEmailCapture()} placeholder="your@email.com" style={{ flex: 1, background: "#0f1e10", border: "1px solid #2C5F2E44", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none" }} />
              <button onClick={handleEmailCapture} style={{ background: "#2C5F2E", border: "none", borderRadius: 12, padding: "12px 20px", color: "#fff", cursor: "pointer", fontSize: 14 }}>Join</button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #1a3020", padding: "24px 20px", textAlign: "center" }}>
        <div style={{ color: "#2C5F2E", fontSize: 18, marginBottom: 8 }}>💙</div>
        <div style={{ color: "#334", fontSize: 13 }}>Memory Mirror • MM AI Technologies • ABN: 22366098626</div>
        <div style={{ color: "#334", fontSize: 11, marginTop: 4 }}>Built by Michael McNamara — Aboriginal Australian — for every family who needed it.</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
          {FEATURES.map(f => <button key={f.id} onClick={() => onNavigate(f.id)} style={{ background: "none", border: "none", color: "#445", cursor: "pointer", fontSize: 11 }}>{f.label}</button>)}
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function MemoryMirror() {
  const [screen, setScreen] = useState("home");
  const screens = { home: HomeScreen, chat: ChatScreen, journal: JournalScreen, music: MusicScreen, night: NightScreen, gps: GPSScreen, family: FamilyScreen, portal: PortalScreen, pricing: PricingScreen };
  const Screen = screens[screen] || HomeScreen;
  return <Screen onBack={() => setScreen("home")} onNavigate={setScreen} />;
}
