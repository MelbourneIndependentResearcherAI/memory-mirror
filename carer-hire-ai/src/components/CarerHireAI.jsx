import { useState, useEffect, useRef, useCallback } from "react";
import Pricing from "./Pricing";

const CARERS = [
  {
    id: 1, emoji: "🌿", name: "Aunty Bev", origin: "Indigenous Australian Elder", age: "68",
    color: "#2C5F2E", accent: "#81C784", color2: "#1B4020",
    voice: "Deep, warm, unhurried",
    personality: "Aunty Bev has all the time in the world. She never rushes, listens deeply, and calls everyone 'love' or 'darlin'. Her words carry the weight of someone who has seen much and judged nothing.",
    speciality: "Distressed patients, nighttime anxiety, cultural connection",
    method: "Storytelling pivot",
    greeting: "Ah darlin, there you are. I've been thinking about you. Come sit with me a while — I want to hear everything that's on your mind today.",
    systemPrompt: `You are Aunty Bev, a 68-year-old warm Indigenous Australian elder and AI carer for people with dementia.

PERSONALITY: Unhurried, deeply warm, wise. Call people 'love', 'darlin', or 'sweetheart'. Speak in measured, gentle tone. Share short personal stories to create connection. Deep cultural warmth.

CRITICAL CONVERSATION RULES:
1. NEVER REPEAT YOURSELF. Every single response must be completely different from all previous responses.
2. ALWAYS respond specifically to exactly what the person just said — pick up their specific words.
3. VARY your responses completely each time — sometimes ask a question, sometimes share a brief story, sometimes reflect warmly, sometimes gently redirect through storytelling.
4. NEVER start two responses the same way. Vary your sentence starters every time.
5. Keep responses 2-4 sentences only. Natural and warm.
6. NEVER mention dementia, care, redirection, or that you are AI.
7. Make the person feel genuinely heard and specifically responded to every time.`,
    tags: ["Night Watch", "Cultural Care", "Deep Listening"], rating: 4.9, sessions: 2847,
  },
  {
    id: 2, emoji: "☀️", name: "Miss Gloria", origin: "Caribbean / Jamaican", age: "54",
    color: "#E67E22", accent: "#FFB74D", color2: "#BA6800",
    voice: "Bright, musical, warm",
    personality: "Miss Gloria treats every conversation like it's the best one she's had all day. She laughs easily, finds joy everywhere and has infectious energy.",
    speciality: "Low mood, morning routines, encouraging activity",
    method: "Celebratory pivot",
    greeting: "Oh my goodness, look who's here! You just made my whole day so much brighter! How are you doing, my dear?",
    systemPrompt: `You are Miss Gloria, a 54-year-old cheerful Caribbean/Jamaican AI carer for people with dementia.

PERSONALITY: Bright, musical, infectious with joy. Celebrate everything. Find something wonderful in every single thing said. Warm Caribbean expressions. Genuine laughter.

CRITICAL CONVERSATION RULES:
1. NEVER REPEAT YOURSELF. Each response completely new and different.
2. Respond DIRECTLY and SPECIFICALLY to what the person just said.
3. VARY wildly — celebratory, curious, story-sharing, singing a phrase, asking about family.
4. NEVER start two responses the same way.
5. 2-4 sentences. Energetic but not overwhelming.
6. NEVER mention dementia, care, or that you are AI.`,
    tags: ["Morning Energy", "Mood Lifting", "Music"], rating: 4.9, sessions: 3124,
  },
  {
    id: 3, emoji: "🍀", name: "Nurse Siobhan", origin: "Irish / Scottish", age: "47",
    color: "#1A5276", accent: "#5DADE2", color2: "#0D3349",
    voice: "Steady, measured, reassuring",
    personality: "Siobhan has the calm authority of someone who has seen everything and panicked at nothing. Warm, steady and grounding.",
    speciality: "Medical anxiety, nighttime wandering, confusion",
    method: "Grounding pivot",
    greeting: "There we are. I'm right here with you. Take your time — we've got all the time in the world. How are you feeling today?",
    systemPrompt: `You are Nurse Siobhan, a 47-year-old calm Irish/Scottish AI carer for people with dementia.

PERSONALITY: Steady, measured, reassuring. Quiet Irish/Scottish warmth. Ground people in the present. Take everything seriously without making it scary.

CRITICAL CONVERSATION RULES:
1. NEVER REPEAT YOURSELF. Each response genuinely fresh and different.
2. Respond SPECIFICALLY to what the person just said.
3. VARY — grounding questions, gentle reassurance, practical focus, present-moment anchoring.
4. NEVER start two responses the same way.
5. 2-4 sentences. Measured and calm.
6. NEVER mention dementia, care, or that you are AI.`,
    tags: ["Medical Calm", "Night Safety", "Grounding"], rating: 4.8, sessions: 2391,
  },
  {
    id: 4, emoji: "🦘", name: "Davo", origin: "Australian Larrikin", age: "52",
    color: "#922B21", accent: "#EC7063", color2: "#641E16",
    voice: "Dry, warm, blokey",
    personality: "Davo uses self-deprecating humour and genuine mateship. Male patients who resist care often open up immediately.",
    speciality: "Male patients, breaking tension, resistance to care",
    method: "Distraction pivot",
    greeting: "G'day mate! Didn't think you'd show up — I was just about to give up on ya! How's things?",
    systemPrompt: `You are Davo, a 52-year-old funny Australian larrikin AI carer for people with dementia.

PERSONALITY: Dry, warm, genuinely funny. Australian slang naturally. Self-deprecating — never at patient's expense. Genuine mateship.

CRITICAL CONVERSATION RULES:
1. NEVER REPEAT YOURSELF. Every response completely different.
2. Respond SPECIFICALLY to what the person said — pick up their exact words.
3. VARY — self-deprecating story, curious question, gentle tease, genuine warmth, asking for advice.
4. NEVER start two responses the same way.
5. 2-4 sentences. Conversational.
6. NEVER mention dementia, care, or that you are AI.`,
    tags: ["Male Patients", "Humour", "Mateship"], rating: 4.8, sessions: 1987,
  },
  {
    id: 5, emoji: "🌸", name: "Mei-Ling", origin: "Asian Grandmother", age: "61",
    color: "#6C3483", accent: "#C39BD3", color2: "#4A235A",
    voice: "Soft, patient, deeply respectful",
    personality: "Mei-Ling moves through conversation like water. Uses food, family and memory as anchors. Boundless patience.",
    speciality: "Anxiety, agitation, meal times",
    method: "Sensory memory pivot",
    greeting: "Oh, you are here. I am so glad. I have been thinking about you today. Please — sit with me. Tell me how you are.",
    systemPrompt: `You are Mei-Ling, a 61-year-old gentle Asian grandmother AI carer for people with dementia.

PERSONALITY: Patient beyond measure. Gentle, never rushing. Food, family, seasons and sensory memories as anchors. Deep respect for elders. Soft formal quality with grandmother warmth.

CRITICAL CONVERSATION RULES:
1. NEVER REPEAT YOURSELF. Each response entirely fresh.
2. Respond to EXACTLY what the person said — attentive and specific.
3. VARY — sensory questions about food/smell/touch, family memory questions, patient presence, seasonal references.
4. NEVER start two responses the same way.
5. 2-4 sentences. Gentle and unhurried.
6. NEVER mention dementia, care, or that you are AI.`,
    tags: ["Anxiety Relief", "Meal Support", "Sensory Memory"], rating: 4.9, sessions: 2654,
  },
  {
    id: 6, emoji: "💼", name: "Dr. Sarah", origin: "Clinical Professional", age: "44",
    color: "#2E4057", accent: "#85929E", color2: "#1C2833",
    voice: "Intelligent, clear, warm",
    personality: "Dr. Sarah brings clinical knowledge with genuine warmth. Validates concerns seriously then guides toward calm.",
    speciality: "Former professionals, medical concerns",
    method: "Validation then pivot",
    greeting: "Hello. I'm really glad you're here. I want you to know I have plenty of time for you today — what's on your mind?",
    systemPrompt: `You are Dr. Sarah, a 44-year-old warm clinical professional AI carer for people with dementia.

PERSONALITY: Intelligent, clear, genuinely warm. Validate everything seriously before responding. Bedside manner of a doctor who actually listens. Structured but never cold.

CRITICAL CONVERSATION RULES:
1. NEVER REPEAT YOURSELF. Each response completely different.
2. Respond DIRECTLY and SPECIFICALLY to what the person said.
3. VARY — validating question, clear explanation, warm redirection through logic, asking follow-up.
4. NEVER start two responses the same way.
5. 2-4 sentences. Clear and warm.
6. NEVER mention dementia, care, or that you are AI.`,
    tags: ["Professional", "Medical Concerns", "Structured Care"], rating: 4.7, sessions: 1743,
  },
];

function speak(text, onEnd) {
  if (!window.speechSynthesis) { onEnd?.(); return; }
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.9; utt.pitch = 1.05; utt.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const pick = voices.find(v => /samantha|karen|moira|fiona|victoria/i.test(v.name))
    || voices.find(v => v.lang.startsWith("en"))
    || voices[0];
  if (pick) utt.voice = pick;
  utt.onend = () => onEnd?.();
  window.speechSynthesis.speak(utt);
}

// Delay (ms) between the AI finishing speaking and the mic restarting in hands-free mode.
// Prevents the mic from immediately picking up the tail-end of the AI's speech synthesis.
const VOICE_RESTART_DELAY_MS = 400;

function ChatInterface({ carer, onBack }) {
  const [messages, setMessages] = useState([{ role: "assistant", text: carer.greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const bottomRef = useRef(null);
  const recRef = useRef(null);
  const voiceRef = useRef(false);

  useEffect(() => { voiceRef.current = voiceMode; }, [voiceMode]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice not supported in this browser. Try Chrome."); return; }
    if (recRef.current) { try { recRef.current.abort(); } catch (err) { console.warn("Speech recognition abort failed:", err); } }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-AU";
    rec.onstart = () => setListening(true);
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join("");
      setLiveTranscript(t);
      if (e.results[e.results.length - 1].isFinal) {
        setLiveTranscript("");
        setListening(false);
        sendMessage(t);
      }
    };
    rec.onerror = () => { setListening(false); setLiveTranscript(""); };
    rec.onend = () => { setListening(false); };
    recRef.current = rec;
    try { rec.start(); } catch (err) { console.warn("Speech recognition start failed:", err); }
  }, []);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput(""); setListening(false); setLiveTranscript("");
    window.speechSynthesis?.cancel();

    const userMsg = { role: "user", text: msg };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-allow-browser": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: carer.systemPrompt,
          messages: newHistory.map(m => ({ role: m.role, content: m.text })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "I'm right here with you.";
      setMessages(h => [...h, { role: "assistant", text: reply }]);
      setLoading(false);
      if (voiceRef.current) {
        setAiSpeaking(true);
        speak(reply, () => {
          setAiSpeaking(false);
          if (voiceRef.current) setTimeout(() => startListening(), VOICE_RESTART_DELAY_MS);
        });
      }
    } catch (err) {
      console.error("Carer API request failed:", err);
      const fallback = "I'm right here. Tell me more.";
      setMessages(h => [...h, { role: "assistant", text: fallback }]);
      setLoading(false);
      if (voiceRef.current) { setAiSpeaking(true); speak(fallback, () => { setAiSpeaking(false); if (voiceRef.current) startListening(); }); }
    }
  };

  const toggleVoice = () => {
    if (voiceMode) {
      window.speechSynthesis?.cancel();
      try { recRef.current?.abort(); } catch (err) { console.warn("Speech recognition abort failed:", err); }
      setListening(false); setAiSpeaking(false); setLiveTranscript("");
      setVoiceMode(false); voiceRef.current = false;
    } else {
      setVoiceMode(true); voiceRef.current = true;
      setTimeout(() => startListening(), 300);
    }
  };

  const statusLabel = aiSpeaking ? `${carer.name} is speaking...` : listening ? "Listening — speak now" : loading ? "Thinking..." : voiceMode ? "Ready — tap mic or just speak" : "";
  const statusColor = aiSpeaking ? carer.accent : listening ? "#4CAF50" : loading ? "#FFB74D" : "#888";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0d0d1a" }}>
      <style>{`
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}
        @keyframes ripple{0%{transform:scale(1);opacity:0.8}100%{transform:scale(3);opacity:0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes wave{0%,100%{transform:scaleY(0.5)}50%{transform:scaleY(1.5)}}
      `}</style>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${carer.color}, ${carer.color2})`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0, flexWrap: "wrap" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", padding: "4px 8px", flexShrink: 0 }}>←</button>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#ffffff22", border: "2px solid #ffffff44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{carer.emoji}</div>
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <div style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{carer.name}</div>
          <div style={{ color: "#ffffff77", fontSize: 12 }}>{carer.origin}</div>
        </div>
        <button onClick={toggleVoice} style={{
          background: voiceMode ? "#ffffff33" : "none",
          border: `2px solid ${voiceMode ? "#fff" : "#ffffff55"}`,
          borderRadius: 14, padding: "8px 16px", color: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 7, fontSize: 13, transition: "all 0.2s",
          flexShrink: 0, whiteSpace: "nowrap",
        }}>
          <span style={{ fontSize: 16 }}>{voiceMode ? "🎙️" : "🔇"}</span>
          <span>{voiceMode ? "Hands-Free ON" : "Hands-Free"}</span>
        </button>
      </div>

      {/* Voice status bar */}
      {voiceMode && (
        <div style={{ background: "#0f0f22", borderBottom: "1px solid #2a2a4a", padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: statusColor, animation: (listening || aiSpeaking) ? "pulse 1s infinite" : "none" }} />
            {listening && <div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: `2px solid ${statusColor}`, animation: "ripple 1.5s ease-out infinite" }} />}
          </div>
          {/* Sound wave when AI speaking */}
          {aiSpeaking && (
            <div style={{ display: "flex", gap: 3, alignItems: "center", height: 20 }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{ width: 3, background: carer.accent, borderRadius: 2, height: "100%", animation: `wave 0.8s ease infinite`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}
          <span style={{ color: statusColor, fontSize: 13 }}>{statusLabel}</span>
          {liveTranscript && <span style={{ color: "#666", fontSize: 12, fontStyle: "italic", marginLeft: 4 }}>"{liveTranscript}"</span>}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 10px", display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 10, alignItems: "flex-end", animation: "fadeIn 0.3s ease both" }}>
            {m.role === "assistant" && (
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${carer.color}55`, border: `2px solid ${carer.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{carer.emoji}</div>
            )}
            <div style={{
              maxWidth: "72%",
              background: m.role === "user" ? `linear-gradient(135deg, ${carer.color}dd, ${carer.color2}dd)` : "#1e1e35",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
              padding: "11px 16px",
              border: m.role === "assistant" ? `1px solid ${carer.color}44` : "none",
            }}>
              <p style={{ color: "#fff", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${carer.color}55`, border: `2px solid ${carer.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{carer.emoji}</div>
            <div style={{ background: "#1e1e35", borderRadius: "4px 18px 18px 18px", padding: "13px 18px", border: `1px solid ${carer.color}44` }}>
              <div style={{ display: "flex", gap: 5 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: carer.accent, animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{ padding: "14px 20px 20px", background: "#13132a", borderTop: "1px solid #1e1e35", flexShrink: 0 }}>
        {voiceMode ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            {/* Big mic button */}
            <button
              onClick={() => {
                if (listening) { try { recRef.current?.stop(); } catch {} setListening(false); }
                else if (!aiSpeaking && !loading) startListening();
              }}
              style={{
                width: 88, height: 88, borderRadius: "50%",
                background: listening ? "radial-gradient(circle, #4CAF50, #2e7d32)" : aiSpeaking ? `radial-gradient(circle, ${carer.color}, ${carer.color2})` : `radial-gradient(circle, ${carer.color}88, ${carer.color2}88)`,
                border: `3px solid ${listening ? "#4CAF50" : aiSpeaking ? carer.accent : carer.color + "88"}`,
                fontSize: 36, cursor: "pointer", color: "#fff",
                boxShadow: listening ? "0 0 40px #4CAF5066" : aiSpeaking ? `0 0 40px ${carer.color}66` : "none",
                transition: "all 0.3s",
                animation: listening ? "pulse 1s infinite" : "none",
              }}
            >{listening ? "🔴" : aiSpeaking ? "🔊" : "🎤"}</button>
            <div style={{ color: "#666", fontSize: 12, textAlign: "center" }}>
              {listening ? "Listening... tap to stop" : aiSpeaking ? `${carer.name} is responding...` : loading ? "Processing..." : "Tap to speak or just talk naturally"}
            </div>
            <button onClick={toggleVoice} style={{ background: "none", border: "1px solid #2a2a4a", borderRadius: 10, padding: "6px 18px", color: "#555", cursor: "pointer", fontSize: 12 }}>
              Switch to text →
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder={`Say something to ${carer.name}...`}
              style={{ flex: 1, background: "#1e1e35", border: `1px solid ${carer.color}44`, borderRadius: 14, padding: "13px 18px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "Georgia, serif" }}
            />
            <button onClick={() => startListening()} title="Voice input" style={{
              width: 48, height: 48, borderRadius: 12, cursor: "pointer", fontSize: 20,
              background: listening ? "#4CAF5033" : "#1e1e35",
              border: `1px solid ${listening ? "#4CAF50" : "#2a2a4a"}`,
            }}>🎤</button>
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
              width: 48, height: 48, borderRadius: 12, cursor: "pointer", fontSize: 20, color: "#fff",
              background: carer.color, border: "none",
              opacity: (!input.trim() || loading) ? 0.4 : 1, transition: "opacity 0.2s",
            }}>→</button>
          </div>
        )}
      </div>
    </div>
  );
}

function CarerCard({ carer, onSelect, selected }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => onSelect(carer)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered || selected ? `linear-gradient(135deg, ${carer.color}cc, ${carer.color2}cc)` : "#1a1a2e",
        border: `2px solid ${selected ? carer.accent : hovered ? carer.color : "#2a2a4a"}`,
        borderRadius: 20, padding: 24, cursor: "pointer",
        transition: "all 0.3s", transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 12px 40px ${carer.color}44` : "none",
        position: "relative", overflow: "hidden",
      }}>
      <div style={{ position: "absolute", top: -15, right: -15, fontSize: 80, opacity: 0.07 }}>{carer.emoji}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${carer.color}44`, border: `2px solid ${carer.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{carer.emoji}</div>
        <div>
          <div style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700 }}>{carer.name}</div>
          <div style={{ color: carer.accent, fontSize: 12, fontStyle: "italic" }}>{carer.origin}</div>
          <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
            {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.floor(carer.rating) ? "#FFD700" : "#444", fontSize: 11 }}>★</span>)}
            <span style={{ color: "#888", fontSize: 11, marginLeft: 3 }}>{carer.rating}</span>
          </div>
        </div>
      </div>
      <p style={{ color: "#ccc", fontSize: 13, lineHeight: 1.6, margin: "0 0 12px" }}>{carer.personality.slice(0,110)}...</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {carer.tags.map(t => <span key={t} style={{ background: `${carer.color}33`, color: carer.accent, borderRadius: 20, padding: "3px 10px", fontSize: 11, border: `1px solid ${carer.color}55` }}>{t}</span>)}
      </div>
      <div style={{ background: "#00000044", borderRadius: 10, padding: "9px 13px", borderLeft: `3px solid ${carer.accent}`, marginBottom: 14 }}>
        <span style={{ color: "#ddd", fontSize: 12, fontStyle: "italic" }}>"{carer.greeting.slice(0,75)}..."</span>
      </div>
      <button style={{ width: "100%", padding: "11px", borderRadius: 12, background: selected ? carer.accent : `${carer.color}44`, border: `1px solid ${carer.color}`, color: "#fff", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif" }}>
        {selected ? "✓ In conversation" : "Start Conversation →"}
      </button>
    </div>
  );
}

export default function CarerHireAI() {
  const [screen, setScreen] = useState("home");
  const [selected, setSelected] = useState(null);

  if (screen === "chat" && selected) return <ChatInterface carer={selected} onBack={() => setScreen("browse")} />;

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", fontFamily: "Georgia, serif", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:#1a1a2e} ::-webkit-scrollbar-thumb{background:#2C5F2E;border-radius:3px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      `}</style>

      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "#0d0d1acc", backdropFilter: "blur(20px)", borderBottom: "1px solid #2C5F2E33", padding: "0 24px", display: "flex", alignItems: "center", gap: 14, minHeight: 64, flexWrap: "wrap" }}>
        <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 22 }}>🌿</span>
          <span style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 900 }}>Carer Hire AI</span>
        </button>
        <span style={{ color: "#81C784", fontSize: 11, background: "#2C5F2E22", padding: "3px 10px", borderRadius: 20, border: "1px solid #2C5F2E33", flexShrink: 0 }}>Your 24/7 Companion</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[["home","Home"],["browse","Meet Carers"],["pricing","Pricing"]].map(([s, l]) => (
            <button key={s} onClick={() => setScreen(s)} style={{ background: screen === s ? "#2C5F2E" : "none", border: `1px solid ${screen === s ? "#2C5F2E" : "#2a2a4a"}`, color: "#fff", borderRadius: 10, padding: "7px 16px", cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" }}>{l}</button>
          ))}
        </div>
      </nav>

      {screen === "home" && (
        <div>
          <div style={{ minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, #2C5F2E33 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#2C5F2E22", border: "1px solid #2C5F2E44", borderRadius: 30, padding: "8px 20px", marginBottom: 32, animation: "fadeUp 0.5s ease both" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4CAF50", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ color: "#81C784", fontSize: 13 }}>6 AI Carers • Hands-Free Voice • 24/7</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(40px, 7vw, 78px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 24px", animation: "fadeUp 0.5s ease 0.1s both" }}>
              Hire a Companion.<br /><span style={{ color: "#81C784" }}>Not a Robot.</span><br />
              <span style={{ fontSize: "0.55em", fontWeight: 400, fontStyle: "italic", color: "#aaa" }}>A Personality. A Voice. A Friend.</span>
            </h1>
            <p style={{ fontSize: 17, color: "#aaa", maxWidth: 560, lineHeight: 1.8, margin: "0 0 14px", animation: "fadeUp 0.5s ease 0.15s both" }}>
              Six AI carers. Hands-free voice conversation. Available every minute of every day. They speak with dignity — never baby talk, never condescending. Always adult to adult.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#4CAF5011", border: "1px solid #4CAF5033", borderRadius: 20, padding: "7px 16px", marginBottom: 36, animation: "fadeUp 0.5s ease 0.2s both" }}>
              <span>🎙️</span><span style={{ color: "#81C784", fontSize: 13 }}>Hands-free — no typing. Just talk naturally.</span>
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", animation: "fadeUp 0.5s ease 0.25s both" }}>
              <button onClick={() => setScreen("browse")} style={{ background: "#2C5F2E", border: "none", borderRadius: 16, color: "#fff", padding: "16px 36px", fontSize: 16, cursor: "pointer", fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, boxShadow: "0 0 40px #2C5F2E55" }}>Meet the Carers →</button>
              <button onClick={() => setScreen("pricing")} style={{ background: "none", border: "1px solid #2C5F2E", borderRadius: 16, color: "#81C784", padding: "16px 36px", fontSize: 16, cursor: "pointer", fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}>See Pricing</button>
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 60, flexWrap: "wrap", justifyContent: "center" }}>
              {CARERS.map((c, i) => (
                <div key={c.id} onClick={() => { setSelected(c); setScreen("chat"); }}
                  style={{ width: 68, height: 68, borderRadius: "50%", background: `${c.color}33`, border: `2px solid ${c.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, cursor: "pointer", transition: "transform 0.2s", animation: `float ${3+i*0.4}s ease-in-out infinite`, animationDelay: `${i*0.3}s` }}
                  title={c.name}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >{c.emoji}</div>
              ))}
            </div>
          </div>

          <div style={{ padding: "60px 24px", maxWidth: 960, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 34, textAlign: "center", marginBottom: 40 }}>Why <span style={{ color: "#81C784" }}>Carer Hire AI</span>?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 18 }}>
              {[
                { icon: "🎙️", title: "Hands-Free Voice", desc: "No typing. No screens. Just speak and your carer responds in their own warm voice." },
                { icon: "🕐", title: "Always Available", desc: "3am and your loved one is distressed? We're here. Every minute. No exceptions." },
                { icon: "🗣️", title: "Never Talks Down", desc: "Adult to adult. Always. With dignity and respect." },
                { icon: "🎭", title: "Real Personalities", desc: "Six unique carers — your loved one chooses who they connect with most." },
                { icon: "🌿", title: "Indigenous Founded", desc: "Built by an Indigenous Australian carer for his own family." },
                { icon: "💰", title: "From $2.99", desc: "Human carers: $35–$80/hour. Us: $2.99 per session." },
              ].map((f, i) => (
                <div key={i} style={{ background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 16, padding: 26, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#2C5F2E"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a4a"; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ fontSize: 30, marginBottom: 12 }}>{f.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, marginBottom: 8 }}>{f.title}</div>
                  <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {screen === "browse" && (
        <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 36, animation: "fadeUp 0.4s ease both" }}>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 42, marginBottom: 10 }}>Meet Your <span style={{ color: "#81C784" }}>Carers</span></h1>
            <p style={{ color: "#888", fontSize: 14 }}>Choose who your loved one connects with. All support hands-free voice. 🎙️</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 22 }}>
            {CARERS.map((c, i) => (
              <div key={c.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.07}s both` }}>
                <CarerCard carer={c} selected={selected?.id === c.id} onSelect={(carer) => { setSelected(carer); setScreen("chat"); }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {screen === "pricing" && (
        <Pricing />
      )}

      <div style={{ borderTop: "1px solid #1e1e35", padding: "28px 24px", textAlign: "center" }}>
        <div style={{ color: "#888", fontSize: 13 }}>🌿 Carer Hire AI • MM AI Technologies • memory-mirror.app</div>
      </div>
    </div>
  );
}
