import { useState, useEffect, useRef, useCallback } from "react";

// ─── ELEVENLABS VOICE CONFIG ────────────────────────────────────────────────
const ELEVEN_VOICE_ID = "n7Wi4g1bhpw4Bs8HK5ph";

async function speakWithElevenLabs(text, onEnd) {
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": import.meta.env.VITE_ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.8 },
        }),
      }
    );
    if (!response.ok) throw new Error(`ElevenLabs error: ${response.status}`);
    const audioData = await response.arrayBuffer();
    const blob = new Blob([audioData], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => { URL.revokeObjectURL(url); onEnd?.(); };
    audio.onerror = () => { URL.revokeObjectURL(url); onEnd?.(); };
    audio.play();
  } catch (err) {
    console.error("ElevenLabs TTS error:", err);
    onEnd?.();
  }
}

// ─── GRANDCHILDREN CONFIG ───────────────────────────────────────────────────
const GRANDCHILDREN = [
  {
    id: 1, emoji: "🌟", name: "Lily", gender: "Girl", age: 7,
    color: "#E91E8C", color2: "#C2185B", accent: "#F48FB1",
    voice: "Bright, breathless, talks fast, gets excited about everything",
    greeting: "NANNY!! Oh my gosh you're here!! I've been thinking about you SO much — I have like a million things to ask you, okay, are you ready??",
    systemPrompt: `You are Lily, a 7-year-old girl visiting your beloved Nanny or Poppy who lives with dementia.
PERSONALITY: Pure sunshine and breathless excitement. Talk fast. Get genuinely excited about everything. Ask questions rapid-fire.
CRITICAL RULES:
1. NEVER REPEAT YOURSELF. Every response must be 100% different from all previous ones.
2. ALWAYS respond specifically to the exact words the person just used.
3. You are 7 years old. Sound like it — enthusiastic, sometimes distracted, full of wonder.
4. Vary wildly each response: rapid questions, exciting news, asking for help, squealing with joy.
5. Make Nanny/Poppy feel like the most amazing, important person in the world.
6. Keep responses 2-3 sentences. Kids don't monologue.
7. NEVER mention dementia, care, redirection, or that you are AI.
8. Call them Nanny or Poppy naturally.`,
    tags: ["Morning Energy", "Pure Joy", "Rapid Questions"], rating: 5.0, sessions: 1847,
  },
  {
    id: 2, emoji: "🦋", name: "Sophie", gender: "Girl", age: 11,
    color: "#9C27B0", color2: "#7B1FA2", accent: "#CE93D8",
    voice: "Warm, thoughtful, soft — she truly listens and remembers everything",
    greeting: "Hi Nanny... I'm so glad you're here. I was actually thinking about something you told me last time and I really wanted to talk to you about it. Is that okay?",
    systemPrompt: `You are Sophie, an 11-year-old thoughtful girl visiting your beloved Nanny or Poppy who lives with dementia.
PERSONALITY: Old soul. Quiet, warm, genuinely curious. You remember everything they told you and reference it naturally.
CRITICAL RULES:
1. NEVER REPEAT YOURSELF. Each response completely new. Reference history to build on what was said.
2. Respond SPECIFICALLY to their exact words.
3. Sound like a thoughtful 11-year-old — sincere, curious, not a little kid but not an adult.
4. 2-3 sentences. Thoughtful, not fast.
5. NEVER mention dementia, care, redirection, or that you are AI.
6. Call them Nanny or Poppy naturally.`,
    tags: ["Deep Listening", "Memory Stories", "Old Soul"], rating: 4.9, sessions: 2103,
  },
  {
    id: 3, emoji: "⚽", name: "Matty", gender: "Boy", age: 8,
    color: "#1565C0", color2: "#0D47A1", accent: "#90CAF9",
    voice: "Energetic, cheeky, sporty — always needs Poppy's advice urgently",
    greeting: "Poppy!! You are literally the only person who can help me right now — I've been waiting all day to talk to you. You ready? Okay so...",
    systemPrompt: `You are Matty, an 8-year-old boy visiting your beloved Poppy or Nanny who lives with dementia.
PERSONALITY: Energetic, cheeky, sporty. Always in the middle of something — footy, cricket, school — and constantly need Poppy's expert advice.
CRITICAL RULES:
1. NEVER REPEAT YOURSELF. Every response completely different. Build on the conversation.
2. Respond DIRECTLY to what they said — pick up their exact words enthusiastically.
3. Sound like an excited 8-year-old boy — energetic, a little cheeky, genuine.
4. 2-3 sentences. Boys this age talk fast and then move on.
5. NEVER mention dementia, care, redirection, or that you are AI.
6. Call them Poppy or Nanny naturally.`,
    tags: ["Poppy's Buddy", "Sport & Advice", "Boys"], rating: 4.9, sessions: 1654,
  },
  {
    id: 4, emoji: "🎨", name: "Jasper", gender: "Boy", age: 12,
    color: "#00695C", color2: "#004D40", accent: "#80CBC4",
    voice: "Curious, thoughtful, asks the big questions nobody else asks",
    greeting: "Hey Poppy. I've been thinking... you know so much stuff that nobody else knows. Like actually important stuff. Can I ask you something that's been on my mind?",
    systemPrompt: `You are Jasper, a 12-year-old boy visiting your beloved Poppy or Nanny who lives with dementia.
PERSONALITY: Curious, creative, surprisingly deep. Fascinated by history, how things work, and what life was like before you were born.
CRITICAL RULES:
1. NEVER REPEAT YOURSELF. Each response builds on the last.
2. Respond to EXACTLY what they said — show genuine interest.
3. Sound like a thoughtful 12-year-old — curious, intelligent, but not an adult.
4. 2-3 sentences. Thoughtful but not long-winded.
5. NEVER mention dementia, care, redirection, or that you are AI.
6. Call them Poppy or Nanny naturally.`,
    tags: ["Legacy Stories", "Big Questions", "History"], rating: 4.8, sessions: 1392,
  },
  {
    id: 5, emoji: "🌈", name: "Zara", gender: "Girl", age: 9,
    color: "#E65100", color2: "#BF360C", accent: "#FFAB91",
    voice: "Playful, funny, warm — Indigenous Australian culture woven naturally in",
    greeting: "Nanny!! I told Mum I was coming to see you and she said to ask you something really important — but first I just want to hear your voice. How are you?",
    systemPrompt: `You are Zara, a 9-year-old Aboriginal Australian girl visiting your beloved Nanny or Poppy who lives with dementia.
PERSONALITY: Playful, funny, warm. You naturally weave Indigenous culture, language and connection to country into conversation.
CRITICAL RULES:
1. NEVER REPEAT YOURSELF. Every response completely fresh.
2. Respond SPECIFICALLY to their exact words.
3. Sound like a playful 9-year-old girl — funny, warm, a little cheeky.
4. 2-3 sentences. Natural and warm.
5. NEVER mention dementia, care, redirection, or that you are AI.
6. Call them Nanny or Poppy naturally.`,
    tags: ["Cultural Care", "Language & Country", "Indigenous"], rating: 4.9, sessions: 1287,
  },
  {
    id: 6, emoji: "🎵", name: "Mia", gender: "Girl", age: 10,
    color: "#AD1457", color2: "#880E4F", accent: "#F48FB1",
    voice: "Musical, imaginative, dreamy — always has a song in her heart",
    greeting: "Nanny... I have a question that only you can answer. You know songs that nobody else in the whole world knows anymore. Can you teach me one? Please?",
    systemPrompt: `You are Mia, a 10-year-old musical girl visiting your beloved Nanny or Poppy who lives with dementia.
PERSONALITY: Musical, imaginative, dreamy. Always thinking about songs, stories and beautiful things.
CRITICAL RULES:
1. NEVER REPEAT YOURSELF. Every response different.
2. Respond to EXACTLY what they said — make musical connections to their words.
3. Sound like a dreamy 10-year-old girl — imaginative, gentle, full of wonder.
4. 2-3 sentences. Musical and light.
5. NEVER mention dementia, care, redirection, or that you are AI.
6. Call them Nanny or Poppy naturally.`,
    tags: ["Music & Singing", "Evening Calm", "Creative"], rating: 5.0, sessions: 1893,
  },
];

// ─── ADULT COMPANIONS CONFIG ────────────────────────────────────────────────
const COMPANIONS = [
  {
    id: 1, emoji: "🌿", name: "Aunty Bev",
    role: "Indigenous Australian Elder • Distressed patients",
    color: "#b45309", color2: "#92400e", accent: "#fde68a",
    greeting: "Ah darlin', there you are. I've been thinking about you. Come sit with me a while — I want to hear everything that's on your mind today.",
    systemPrompt: `You are Aunty Bev, a warm and wise Indigenous Australian Elder who provides comfort and companionship to people living with dementia.
PERSONALITY: Deeply warm, patient, grounding. You speak with the wisdom of someone who has seen much of life. You use gentle Australian expressions naturally. You never rush. You hold space.
RULES:
1. Never correct memory errors — validate and gently redirect.
2. Short sentences. Calm, slow tone.
3. Use their name often for grounding.
4. Never mention dementia, care facilities, or that you are AI.
5. If distressed: "It's alright darlin', you're safe. I'm right here with you."
6. Draw on nature, country, and story as comfort.`,
    tags: ["Distressed", "Indigenous Elder", "Grounding"], rating: 5.0, sessions: 3241,
  },
  {
    id: 2, emoji: "☕", name: "Margaret",
    role: "Retired Nurse • General companionship",
    color: "#be185d", color2: "#9d174d", accent: "#fbcfe8",
    greeting: "Oh hello love, I'm so pleased you've popped in! I just put the kettle on — shall we have a chat over a cuppa?",
    systemPrompt: `You are Margaret, a warm retired nurse providing companionship to someone living with dementia.
PERSONALITY: Cheerful, practical, homely. You love a good chat over tea. You remember everyone's stories and refer back to them naturally.
RULES:
1. Never correct memory errors — go with their reality warmly.
2. Keep conversation light and positive.
3. Ask simple questions about their day, their family, what they enjoy.
4. Never mention dementia or that you are AI.
5. If confused: "That's alright love, we've got all the time in the world."`,
    tags: ["General Care", "Cheerful", "Daily Chat"], rating: 4.9, sessions: 2876,
  },
  {
    id: 3, emoji: "🎸", name: "Brian",
    role: "Retired Musician • Male companionship",
    color: "#1d4ed8", color2: "#1e3a8a", accent: "#bfdbfe",
    greeting: "G'day mate! You know what, I was just sitting here thinking about the old days. Pull up a chair — I reckon you've got some good stories too.",
    systemPrompt: `You are Brian, a warm retired musician providing male companionship to someone living with dementia.
PERSONALITY: Easy-going, funny, loves sport and music. You talk like an old mate. You never make anyone feel confused or embarrassed.
RULES:
1. Never correct memory errors — go along with their stories enthusiastically.
2. Talk about footy, cricket, music, the old days.
3. Keep it easy and relaxed — like two old mates having a yarn.
4. Never mention dementia or that you are AI.
5. If confused: "Ah no worries mate, I forget things all the time too."`,
    tags: ["Male Companion", "Sport & Music", "Easy Chat"], rating: 4.8, sessions: 1998,
  },
];

// ─── CHAT INTERFACE ──────────────────────────────────────────────────────────
function ChatInterface({ companion, onBack, isGrandchild = false }) {
  const [messages, setMessages] = useState([{ role: "assistant", text: companion.greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const bottomRef = useRef(null);
  const recRef = useRef(null);
  const voiceRef = useRef(false);
  const messagesRef = useRef([{ role: "assistant", text: companion.greeting }]);
  const loadingRef = useRef(false);

  useEffect(() => { voiceRef.current = voiceMode; }, [voiceMode]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loadingRef.current) return;
    setInput(""); setListening(false); setLiveTranscript("");

    const userMsg = { role: "user", text: msg };
    const newHistory = [...messagesRef.current, userMsg];
    messagesRef.current = newHistory;
    setMessages(newHistory);
    loadingRef.current = true;
    setLoading(true);

    const apiMessages = newHistory.reduce((acc, m) => {
      if (acc.length === 0 && m.role !== "user") return acc;
      if (acc.length > 0 && acc[acc.length - 1].role === m.role) return acc;
      return [...acc, { role: m.role, content: m.text }];
    }, []);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: companion.systemPrompt,
          messages: apiMessages,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      const reply = data.text || (isGrandchild ? "Tell me more Nanny!" : "Tell me more about that...");
      const withReply = [...newHistory, { role: "assistant", text: reply }];
      messagesRef.current = withReply;
      setMessages(withReply);
      loadingRef.current = false;
      setLoading(false);
      if (voiceRef.current) {
        setAiSpeaking(true);
        speakWithElevenLabs(reply, () => {
          setAiSpeaking(false);
          if (voiceRef.current) setTimeout(() => startListening(), 500);
        });
      }
    } catch {
      const fallback = isGrandchild ? "Nanny wait — I want to hear more about that!" : "I'm right here with you. Tell me more...";
      const withFallback = [...messagesRef.current, { role: "assistant", text: fallback }];
      messagesRef.current = withFallback;
      loadingRef.current = false;
      setMessages(withFallback);
      setLoading(false);
      if (voiceRef.current) {
        setAiSpeaking(true);
        speakWithElevenLabs(fallback, () => {
          setAiSpeaking(false);
          if (voiceRef.current) startListening();
        });
      }
    }
  };

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice input needs Chrome or Safari."); return; }
    try { recRef.current?.abort(); } catch {}
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-AU";
    rec.onstart = () => setListening(true);
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join("");
      setLiveTranscript(t);
      if (e.results[e.results.length - 1].isFinal) {
        sendMessage(t);
        setLiveTranscript("");
      }
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
  }, []);

  const toggleVoice = () => {
    const next = !voiceMode;
    setVoiceMode(next);
    if (next) startListening();
    else { try { recRef.current?.abort(); } catch {} setListening(false); }
  };

  const accentColor = companion.color || "#3ecf8e";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "Georgia, serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#13131a", borderBottom: "1px solid #1a1a2e", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "transparent", border: "1px solid #2a2a3e", color: "#888", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>← Back</button>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${accentColor}, ${companion.color2 || accentColor})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{companion.emoji}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{companion.name}</div>
          <div style={{ fontSize: 11, color: "#666", fontFamily: "sans-serif" }}>{companion.role || `${companion.gender}, age ${companion.age}`}</div>
        </div>
        <button onClick={toggleVoice} style={{ marginLeft: "auto", background: voiceMode ? `${accentColor}22` : "transparent", border: `1px solid ${voiceMode ? accentColor : "#2a2a3e"}`, color: voiceMode ? accentColor : "#555", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: "sans-serif", fontSize: 12 }}>
          {voiceMode ? (aiSpeaking ? "🔊 Speaking..." : listening ? "🎤 Listening..." : "🎤 Voice On") : "🎤 Voice"}
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "80%", padding: "10px 14px", borderRadius: 12, fontSize: 14, lineHeight: 1.65,
              background: m.role === "user" ? "#1a1a2e" : `${accentColor}18`,
              color: m.role === "user" ? "#ccc" : "#e8f5e9",
              borderLeft: m.role === "assistant" ? `3px solid ${accentColor}` : "none",
              fontFamily: m.role === "assistant" ? "Georgia, serif" : "sans-serif",
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 6, padding: "10px 14px" }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: accentColor, animation: "pulse 1.2s infinite", animationDelay: `${i * 0.2}s` }} />)}
          </div>
        )}
        {liveTranscript && <div style={{ textAlign: "right", fontSize: 12, color: "#555", fontStyle: "italic", fontFamily: "sans-serif" }}>{liveTranscript}</div>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8, padding: "12px 16px", borderTop: "1px solid #1a1a2e", background: "#13131a", flexShrink: 0 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder={listening ? "Listening..." : `Message ${companion.name}...`}
          style={{ flex: 1, background: "#0e0e10", border: "1px solid #1a1a2e", borderRadius: 8, color: "#ccc", padding: "10px 13px", fontFamily: "sans-serif", fontSize: 13, outline: "none" }}
        />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}`, color: accentColor, borderRadius: 8, padding: "10px 18px", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>Send</button>
      </div>

      <style>{`@keyframes pulse{0%,80%,100%{opacity:.2}40%{opacity:1}}`}</style>
    </div>
  );
}

// ─── COMPANION SELECTOR ──────────────────────────────────────────────────────
function CompanionSelector({ companions, title, subtitle, onSelect, onBack, isGrandchild = false }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "Georgia, serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#13131a", borderBottom: "1px solid #1a1a2e" }}>
        <button onClick={onBack} style={{ background: "transparent", border: "1px solid #2a2a3e", color: "#888", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>← Home</button>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: 11, color: "#555", fontFamily: "sans-serif" }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {companions.map(c => (
          <button key={c.id} onClick={() => onSelect(c)} style={{
            background: "#13131a", border: "1px solid #1a1a2e", borderRadius: 14,
            padding: 18, cursor: "pointer", textAlign: "left", transition: "all 0.2s",
            display: "flex", flexDirection: "column", gap: 10,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.background = `${c.color}12`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1a2e"; e.currentTarget.style.background = "#13131a"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${c.color}, ${c.color2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{c.emoji}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#f0f0f0" }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "#666", fontFamily: "sans-serif" }}>{c.role || `${c.gender}, age ${c.age}`}</div>
              </div>
              {c.rating && <div style={{ marginLeft: "auto", fontSize: 11, color: "#febc2e", fontFamily: "sans-serif" }}>★ {c.rating}</div>}
            </div>
            <div style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif", lineHeight: 1.5, fontStyle: "italic" }}>"{c.greeting.substring(0, 80)}..."</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {c.tags?.map(tag => (
                <span key={tag} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: `${c.color}22`, color: c.accent || c.color, fontFamily: "sans-serif" }}>{tag}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── HOME DASHBOARD ──────────────────────────────────────────────────────────
function HomeDashboard({ onNavigate }) {
  const tiles = [
    {
      key: "companions",
      emoji: "🧠",
      title: "AI Companions",
      subtitle: "Adult carer companions",
      description: "Warm, professional AI companions for people living with dementia — including Aunty Bev.",
      color: "#3ecf8e",
      color2: "#1a9e6a",
    },
    {
      key: "little-ones",
      emoji: "👧",
      title: "Little Ones AI",
      subtitle: "Grandchildren companions",
      description: "AI grandchildren — Lily, Sophie, Matty and more — bringing joy and connection to lonely elders.",
      color: "#E91E8C",
      color2: "#C2185B",
    },
    {
      key: "magic-mirror",
      emoji: "🪞",
      title: "Magic Mirror",
      subtitle: "memorylaneview.com",
      description: "See yourself through time — a live reverse-ageing camera filter.",
      color: "#a855f7",
      color2: "#7e22ce",
      external: "https://memorylaneview.com",
    },
    {
      key: "fresh-start",
      emoji: "🚿",
      title: "Fresh Start AI",
      subtitle: "Shower companion",
      description: "Gentle step-by-step voice guidance to reduce resistance to showering and personal hygiene.",
      color: "#5dd6f0",
      color2: "#0891b2",
      comingSoon: true,
    },
    {
      key: "carers-hire",
      emoji: "🤝",
      title: "CarersHire AI",
      subtitle: "Hire AI companions",
      description: "Browse and hire personalised AI dementia carer companions for your loved one.",
      color: "#7b93ff",
      color2: "#4f5fcc",
      comingSoon: true,
    },
    {
      key: "download",
      emoji: "📱",
      title: "Download App",
      subtitle: "Google Play & Web",
      description: "Get Memory Mirror on your phone — free for patients.",
      color: "#febc2e",
      color2: "#d97706",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "Georgia, serif" }}>
      {/* Header */}
      <div style={{ padding: "24px 20px 8px", textAlign: "center", borderBottom: "1px solid #1a1a2e" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🪞</div>
        <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 400, color: "#f0f0f0", margin: "0 0 6px", letterSpacing: "0.04em" }}>Memory Mirror</h1>
        <p style={{ fontSize: 13, color: "#444", fontFamily: "sans-serif", margin: 0 }}>AI dementia care companions — built with love</p>
      </div>

      {/* Tiles */}
      <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, maxWidth: 900, margin: "0 auto" }}>
        {tiles.map(tile => (
          <button
            key={tile.key}
            onClick={() => {
              if (tile.external) { window.open(tile.external, "_blank"); return; }
              if (!tile.comingSoon) onNavigate(tile.key);
            }}
            style={{
              background: "#13131a", border: `1px solid #1a1a2e`,
              borderRadius: 16, padding: 20, cursor: tile.comingSoon ? "default" : "pointer",
              textAlign: "left", transition: "all 0.2s", opacity: tile.comingSoon ? 0.5 : 1,
              display: "flex", flexDirection: "column", gap: 10,
            }}
            onMouseEnter={e => { if (!tile.comingSoon) { e.currentTarget.style.borderColor = tile.color; e.currentTarget.style.background = `${tile.color}12`; }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1a2e"; e.currentTarget.style.background = "#13131a"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${tile.color}33, ${tile.color2}22)`, border: `1px solid ${tile.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{tile.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#f0f0f0", marginBottom: 2 }}>{tile.title}</div>
                <div style={{ fontSize: 11, color: tile.color, fontFamily: "sans-serif" }}>{tile.subtitle}</div>
              </div>
              {tile.comingSoon && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 8, background: "#1a1a2e", color: "#444", fontFamily: "sans-serif" }}>SOON</span>}
            </div>
            <p style={{ fontSize: 12, color: "#666", fontFamily: "sans-serif", lineHeight: 1.6, margin: 0 }}>{tile.description}</p>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "20px 16px", fontSize: 11, color: "#222", fontFamily: "sans-serif", lineHeight: 1.8 }}>
        MM AI Technologies · Supply Nation Certified · ABN 22 366 098 626<br />
        Built with 25 years of dementia caregiving experience
      </div>
    </div>
  );
}

// ─── DOWNLOAD PAGE ───────────────────────────────────────────────────────────
function DownloadPage({ onBack }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 1rem" }}>
      <button onClick={onBack} style={{ alignSelf: "flex-start", background: "transparent", border: "1px solid #2a2a3e", color: "#888", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, marginBottom: 24 }}>← Home</button>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🪞</div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 400, color: "#f0f0f0", marginBottom: 8 }}>Memory Mirror</h1>
        <p style={{ color: "#666", fontFamily: "sans-serif", fontSize: 13, marginBottom: 32 }}>Free · No account needed · Works offline</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 340, margin: "0 auto" }}>
          <a href="https://play.google.com/store/apps/details?id=app.memorymirror" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#13131a", border: "1px solid #2a2a3e", color: "#f0f0f0", borderRadius: 12, padding: "12px 20px", textDecoration: "none", fontFamily: "sans-serif", fontSize: 14 }}>
            ▶ <span>Get on Google Play</span>
          </a>
          <a href="https://memory-mirror.app" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#13131a", border: "1px solid #3ecf8e44", color: "#3ecf8e", borderRadius: 12, padding: "12px 20px", textDecoration: "none", fontFamily: "sans-serif", fontSize: 14 }}>
            🌐 <span>Open in Browser</span>
          </a>
          <button onClick={() => { navigator.clipboard.writeText("https://memory-mirror.app"); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ background: "transparent", border: "1px dashed #2a2a3e", color: copied ? "#3ecf8e" : "#444", borderRadius: 12, padding: "10px 20px", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>
            {copied ? "✓ Link copied!" : "⎘ Copy link to share"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("home");
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [selectedGrandchild, setSelectedGrandchild] = useState(null);

  // Active chat — adult companion
  if (selectedCompanion) {
    return <ChatInterface companion={selectedCompanion} onBack={() => { setSelectedCompanion(null); setView("companions"); }} isGrandchild={false} />;
  }

  // Active chat — grandchild
  if (selectedGrandchild) {
    return <ChatInterface companion={selectedGrandchild} onBack={() => { setSelectedGrandchild(null); setView("little-ones"); }} isGrandchild={true} />;
  }

  // Companion selector — adult carers
  if (view === "companions") {
    return <CompanionSelector companions={COMPANIONS} title="AI Companions" subtitle="Choose your companion" onSelect={setSelectedCompanion} onBack={() => setView("home")} isGrandchild={false} />;
  }

  // Companion selector — grandchildren
  if (view === "little-ones") {
    return <CompanionSelector companions={GRANDCHILDREN} title="Little Ones AI" subtitle="Choose a grandchild companion" onSelect={setSelectedGrandchild} onBack={() => setView("home")} isGrandchild={true} />;
  }

  // Download page
  if (view === "download") {
    return <DownloadPage onBack={() => setView("home")} />;
  }

  // Home dashboard
  return <HomeDashboard onNavigate={setView} />;
}