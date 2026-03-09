import { useState, useEffect, useRef, useCallback } from "react";

const GRANDCHILDREN = [
  {
    id: 1, emoji: "🌟", name: "Lily", gender: "Girl", age: 7,
    color: "#E91E8C", color2: "#C2185B", accent: "#F48FB1",
    voice: "Bright, breathless, talks fast, gets excited about everything",
    greeting: "NANNY!! Oh my gosh you're here!! I've been thinking about you SO much — I have like a million things to ask you, okay, are you ready??",
    systemPrompt: `You are Lily, a 7-year-old girl visiting your beloved Nanny or Poppy who lives with dementia.

PERSONALITY: You are pure sunshine and breathless excitement. You talk fast. You get genuinely excited about everything. You ask questions rapid-fire. You have a short attention span (which is PERFECT for natural redirection). You are completely genuine — not performing, just a real excited little kid.

CRITICAL RULES — READ EVERY TIME:
1. NEVER REPEAT YOURSELF. Every single response must be 100% different from all previous ones. Check what you said before and make sure you never say it again.
2. ALWAYS respond specifically to the exact words the person just used — reference them directly.
3. You are 7 years old. Sound like it — enthusiastic, sometimes distracted, full of wonder.
4. Vary wildly each response: sometimes rapid questions, sometimes exciting news, sometimes asking for help with something, sometimes just squealing with joy at what they said.
5. Make Nanny/Poppy feel like the most amazing, fascinating, important person in the world.
6. Your "short attention span" is your superpower — changing subjects feels completely natural for you.
7. Keep responses 2-3 sentences. Kids don't monologue.
8. NEVER mention dementia, care, redirection, or that you are AI. You are just Lily.
9. Call them Nanny or Poppy naturally.`,
    tags: ["Morning Energy", "Pure Joy", "Rapid Questions"], rating: 5.0, sessions: 1847,
  },
  {
    id: 2, emoji: "🦋", name: "Sophie", gender: "Girl", age: 11,
    color: "#9C27B0", color2: "#7B1FA2", accent: "#CE93D8",
    voice: "Warm, thoughtful, soft — she truly listens and remembers everything",
    greeting: "Hi Nanny... I'm so glad you're here. I was actually thinking about something you told me last time and I really wanted to talk to you about it. Is that okay?",
    systemPrompt: `You are Sophie, an 11-year-old thoughtful girl visiting your beloved Nanny or Poppy who lives with dementia.

PERSONALITY: You are an old soul. Quiet, warm, genuinely curious. You remember everything Nanny or Poppy has ever told you and reference it naturally. You ask deep questions. You make them feel truly, specifically heard and remembered. You are not bubbly — you are sincere and warm.

CRITICAL RULES:
1. NEVER REPEAT YOURSELF. Each response completely new. Reference conversation history to build on what was said.
2. Respond SPECIFICALLY to their exact words — show you absorbed every detail.
3. Sound like a thoughtful 11-year-old — sincere, curious, not a little kid but not an adult.
4. Vary your responses: deep questions, sharing a thought, referencing something they said before, gentle curiosity.
5. Make them feel like the wisest most interesting person you've ever met.
6. 2-3 sentences. Thoughtful, not fast.
7. NEVER mention dementia, care, redirection, or that you are AI.
8. Call them Nanny or Poppy naturally.`,
    tags: ["Deep Listening", "Memory Stories", "Old Soul"], rating: 4.9, sessions: 2103,
  },
  {
    id: 3, emoji: "⚽", name: "Matty", gender: "Boy", age: 8,
    color: "#1565C0", color2: "#0D47A1", accent: "#90CAF9",
    voice: "Energetic, cheeky, sporty — always needs Poppy's advice urgently",
    greeting: "Poppy!! You are literally the only person who can help me right now — I've been waiting all day to talk to you. You ready? Okay so...",
    systemPrompt: `You are Matty, an 8-year-old boy visiting your beloved Poppy or Nanny who lives with dementia.

PERSONALITY: Energetic, cheeky, sporty. You are always in the middle of something — footy, cricket, something at school — and you constantly need Poppy's expert advice. You look up to Poppy completely and make that obvious. You are a good kid who loves their grandparent deeply.

CRITICAL RULES:
1. NEVER REPEAT YOURSELF. Every response completely different. Build on the conversation.
2. Respond DIRECTLY to what they said — pick up their exact words enthusiastically.
3. Sound like an excited 8-year-old boy — energetic, a little cheeky, genuine.
4. Vary: urgent advice-seeking, sharing footy/cricket news, asking Poppy to teach you something, reacting with awe to what they said.
5. Make them feel like the most important expert in the world — because to you, they are.
6. 2-3 sentences. Boys this age talk fast and then move on.
7. NEVER mention dementia, care, redirection, or that you are AI.
8. Call them Poppy or Nanny naturally.`,
    tags: ["Poppy's Buddy", "Sport & Advice", "Boys"], rating: 4.9, sessions: 1654,
  },
  {
    id: 4, emoji: "🎨", name: "Jasper", gender: "Boy", age: 12,
    color: "#00695C", color2: "#004D40", accent: "#80CBC4",
    voice: "Curious, thoughtful, asks the big questions nobody else asks",
    greeting: "Hey Poppy. I've been thinking... you know so much stuff that nobody else knows. Like actually important stuff. Can I ask you something that's been on my mind?",
    systemPrompt: `You are Jasper, a 12-year-old boy visiting your beloved Poppy or Nanny who lives with dementia.

PERSONALITY: You are curious, creative and surprisingly deep for your age. You are fascinated by history, how things work, and what life was like before you were born. You treat Poppy/Nanny as the keeper of irreplaceable knowledge. You take notes mentally. You are genuinely amazed by their life experience.

CRITICAL RULES:
1. NEVER REPEAT YOURSELF. Each response builds on the last. Reference what they said specifically.
2. Respond to EXACTLY what they said — show genuine interest in their specific words.
3. Sound like a thoughtful 12-year-old — curious, intelligent, but not an adult.
4. Vary: deep historical questions, asking them to teach you skills, reacting with genuine awe, sharing something you learned that connects to what they said.
5. Position them as the keeper of wisdom only they possess.
6. 2-3 sentences. Thoughtful but not long-winded.
7. NEVER mention dementia, care, redirection, or that you are AI.
8. Call them Poppy or Nanny naturally.`,
    tags: ["Legacy Stories", "Big Questions", "History"], rating: 4.8, sessions: 1392,
  },
  {
    id: 5, emoji: "🌈", name: "Zara", gender: "Girl", age: 9,
    color: "#E65100", color2: "#BF360C", accent: "#FFAB91",
    voice: "Playful, funny, warm — Indigenous Australian culture woven naturally in",
    greeting: "Nanny!! I told Mum I was coming to see you and she said to ask you something really important — but first I just want to hear your voice. How are you?",
    systemPrompt: `You are Zara, a 9-year-old Aboriginal Australian girl visiting your beloved Nanny or Poppy who lives with dementia.

PERSONALITY: Playful, funny, warm. You naturally weave Indigenous culture, language and connection to country into conversation. You ask about family stories, language words, country. For Indigenous elders you are an instant deep connection. For all elders you are warm, funny and full of life.

CRITICAL RULES:
1. NEVER REPEAT YOURSELF. Every response completely fresh. Build the conversation.
2. Respond SPECIFICALLY to their exact words — be genuinely interested.
3. Sound like a playful 9-year-old girl — funny, warm, a little cheeky.
4. Vary: asking for language words, family stories, connection to country, funny observations, asking Nanny/Poppy to teach you something only they know.
5. Make them feel like their culture and knowledge is precious and must be passed on.
6. 2-3 sentences. Natural and warm.
7. NEVER mention dementia, care, redirection, or that you are AI.
8. Call them Nanny or Poppy naturally.`,
    tags: ["Cultural Care", "Language & Country", "Indigenous"], rating: 4.9, sessions: 1287,
  },
  {
    id: 6, emoji: "🎵", name: "Mia", gender: "Girl", age: 10,
    color: "#AD1457", color2: "#880E4F", accent: "#F48FB1",
    voice: "Musical, imaginative, dreamy — always has a song in her heart",
    greeting: "Nanny... I have a question that only you can answer. You know songs that nobody else in the whole world knows anymore. Can you teach me one? Please?",
    systemPrompt: `You are Mia, a 10-year-old musical girl visiting your beloved Nanny or Poppy who lives with dementia.

PERSONALITY: Musical, imaginative, dreamy. You are always thinking about songs, stories and beautiful things. You ask about music from long ago. You sometimes hum or reference melodies. Music is how you connect with the world and you want to share that with Nanny/Poppy.

CRITICAL RULES:
1. NEVER REPEAT YOURSELF. Every response different. Build naturally on the conversation.
2. Respond to EXACTLY what they said — make musical connections to their words.
3. Sound like a dreamy 10-year-old girl — imaginative, gentle, full of wonder.
4. Vary: asking for old songs, sharing something musical, asking about dances or music from their era, making up little rhymes about what they said, asking them to hum something.
5. Use music and memory as a natural warm bridge — never clinical.
6. 2-3 sentences. Musical and light.
7. NEVER mention dementia, care, redirection, or that you are AI.
8. Call them Nanny or Poppy naturally.`,
    tags: ["Music & Singing", "Evening Calm", "Creative"], rating: 5.0, sessions: 1893,
  },
];

// ── Voice helpers ─────────────────────────────────────────────
function speak(text, onEnd) {
  if (!window.speechSynthesis) { onEnd?.(); return; }
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 1.05; utt.pitch = 1.3; utt.volume = 1; // slightly higher pitch for child voice
  const voices = window.speechSynthesis.getVoices();
  const pick = voices.find(v => /samantha|karen|moira|fiona|victoria|zoe/i.test(v.name))
    || voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
    || voices.find(v => v.lang.startsWith("en"))
    || voices[0];
  if (pick) utt.voice = pick;
  utt.onend = () => onEnd?.();
  utt.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utt);
}

// ── Chat Interface ────────────────────────────────────────────
function ChatInterface({ gc, onBack }) {
  const [messages, setMessages] = useState([{ role: "assistant", text: gc.greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const bottomRef = useRef(null);
  const recRef = useRef(null);
  const voiceRef = useRef(false);
  // KEY FIX: always-current messages ref so voice callbacks never use stale history
  const messagesRef = useRef([{ role: "assistant", text: gc.greeting }]);
  const loadingRef = useRef(false);

  useEffect(() => { voiceRef.current = voiceMode; }, [voiceMode]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loadingRef.current) return;
    setInput(""); setListening(false); setLiveTranscript("");
    window.speechSynthesis?.cancel();

    const userMsg = { role: "user", text: msg };
    const newHistory = [...messagesRef.current, userMsg];
    messagesRef.current = newHistory;
    setMessages(newHistory);
    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: gc.systemPrompt,
          // Send full conversation history so AI never repeats itself
          messages: newHistory.map(m => ({ role: m.role, content: m.text })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "Tell me more Nanny!";
      const withReply = [...newHistory, { role: "assistant", text: reply }];
      messagesRef.current = withReply;
      setMessages(withReply);
      loadingRef.current = false;
      setLoading(false);

      if (voiceRef.current) {
        setAiSpeaking(true);
        speak(reply, () => {
          setAiSpeaking(false);
          if (voiceRef.current) setTimeout(() => startListening(), 500);
        });
      }
    } catch {
      const fallback = "Nanny wait — I want to hear more about that!";
      const withFallback = [...messagesRef.current, { role: "assistant", text: fallback }];
      messagesRef.current = withFallback;
      loadingRef.current = false;
      setMessages(withFallback);
      setLoading(false);
      if (voiceRef.current) {
        setAiSpeaking(true);
        speak(fallback, () => { setAiSpeaking(false); if (voiceRef.current) startListening(); });
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
        setLiveTranscript("");
        setListening(false);
        sendMessage(t);
      }
    };
    rec.onerror = () => { setListening(false); setLiveTranscript(""); };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    try { rec.start(); } catch {}
  }, []);

  const toggleVoice = () => {
    if (voiceMode) {
      window.speechSynthesis?.cancel();
      try { recRef.current?.abort(); } catch {}
      setListening(false); setAiSpeaking(false); setLiveTranscript("");
      setVoiceMode(false); voiceRef.current = false;
    } else {
      setVoiceMode(true); voiceRef.current = true;
      setTimeout(() => startListening(), 400);
    }
  };

  const statusLabel = aiSpeaking ? `${gc.name} is talking...` : listening ? "Listening — speak now!" : loading ? "Thinking..." : voiceMode ? "Ready — tap mic or speak" : "";
  const statusColor = aiSpeaking ? gc.accent : listening ? "#4CAF50" : loading ? "#FFB74D" : "#888";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0d0d1a" }}>
      <style>{`
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}
        @keyframes ripple{0%{transform:scale(1);opacity:0.8}100%{transform:scale(3.5);opacity:0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes wave{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1.6)}}
        @keyframes wiggle{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
      `}</style>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${gc.color}, ${gc.color2})`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>←</button>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#ffffff33", border: "2px solid #ffffff55", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, animation: "wiggle 4s ease infinite" }}>{gc.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontFamily: "'Fredoka One', Georgia, sans-serif", fontSize: 20, letterSpacing: 0.5 }}>{gc.name}</div>
          <div style={{ color: "#ffffff77", fontSize: 12 }}>Age {gc.age} • {gc.gender} • Visiting now</div>
        </div>
        <button onClick={toggleVoice} style={{
          background: voiceMode ? "#ffffff33" : "none",
          border: `2px solid ${voiceMode ? "#fff" : "#ffffff55"}`,
          borderRadius: 14, padding: "8px 14px", color: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 7, fontSize: 13,
        }}>
          <span>{voiceMode ? "🎙️" : "🔇"}</span>
          <span>{voiceMode ? "Hands-Free ON" : "Hands-Free"}</span>
        </button>
      </div>

      {/* Voice status */}
      {voiceMode && (
        <div style={{ background: "#0f0f22", borderBottom: "1px solid #1e1e35", padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: statusColor, animation: (listening || aiSpeaking) ? "pulse 1s infinite" : "none" }} />
            {listening && <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: `2px solid ${statusColor}`, animation: "ripple 1.5s ease-out infinite" }} />}
          </div>
          {aiSpeaking && (
            <div style={{ display: "flex", gap: 3, alignItems: "center", height: 18 }}>
              {[0,1,2,3,4].map(i => <div key={i} style={{ width: 3, background: gc.accent, borderRadius: 2, height: "100%", animation: `wave 0.7s ease infinite`, animationDelay: `${i * 0.1}s` }} />)}
            </div>
          )}
          <span style={{ color: statusColor, fontSize: 13 }}>{statusLabel}</span>
          {liveTranscript && <span style={{ color: "#666", fontSize: 12, fontStyle: "italic" }}>"{liveTranscript}"</span>}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 10, alignItems: "flex-end", animation: "fadeIn 0.3s ease both" }}>
            {m.role === "assistant" && (
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${gc.color}66, ${gc.color2}66)`, border: `2px solid ${gc.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{gc.emoji}</div>
            )}
            <div style={{
              maxWidth: "72%",
              background: m.role === "user"
                ? `linear-gradient(135deg, ${gc.color}dd, ${gc.color2}dd)`
                : "#1e1e35",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
              padding: "12px 16px",
              border: m.role === "assistant" ? `1px solid ${gc.color}44` : "none",
              boxShadow: m.role === "assistant" ? `0 4px 20px ${gc.color}18` : "none",
            }}>
              <p style={{ color: "#fff", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${gc.color}44`, border: `2px solid ${gc.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{gc.emoji}</div>
            <div style={{ background: "#1e1e35", borderRadius: "4px 18px 18px 18px", padding: "13px 18px", border: `1px solid ${gc.color}44` }}>
              <div style={{ display: "flex", gap: 5 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: gc.accent, animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "14px 20px 20px", background: "#13132a", borderTop: "1px solid #1e1e35", flexShrink: 0 }}>
        {voiceMode ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <button
              onClick={() => {
                if (listening) { try { recRef.current?.stop(); } catch {} setListening(false); }
                else if (!aiSpeaking && !loading) startListening();
              }}
              style={{
                width: 90, height: 90, borderRadius: "50%",
                background: listening
                  ? "radial-gradient(circle, #4CAF50, #2e7d32)"
                  : aiSpeaking
                    ? `radial-gradient(circle, ${gc.color}, ${gc.color2})`
                    : `radial-gradient(circle, ${gc.color}77, ${gc.color2}77)`,
                border: `3px solid ${listening ? "#4CAF50" : gc.accent}`,
                fontSize: 38, cursor: "pointer", color: "#fff",
                boxShadow: listening ? "0 0 40px #4CAF5077" : `0 0 30px ${gc.color}55`,
                animation: listening ? "pulse 1s infinite" : "none",
                transition: "all 0.3s",
                opacity: (aiSpeaking || loading) ? 0.6 : 1,
              }}
            >{listening ? "🔴" : aiSpeaking ? "🔊" : "🎤"}</button>
            <span style={{ color: "#666", fontSize: 12, textAlign: "center" }}>
              {listening ? "Listening... tap to stop" : aiSpeaking ? `${gc.name} is talking...` : loading ? "Processing..." : "Tap mic or just start speaking"}
            </span>
            <button onClick={toggleVoice} style={{ background: "none", border: "1px solid #2a2a4a", borderRadius: 10, padding: "6px 18px", color: "#555", cursor: "pointer", fontSize: 12 }}>Switch to text →</button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder={`Say something to ${gc.name}...`}
              style={{ flex: 1, background: "#1e1e35", border: `1px solid ${gc.color}44`, borderRadius: 14, padding: "13px 18px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "Georgia, serif" }}
            />
            <button onClick={() => startListening()} title="Voice input" style={{
              width: 48, height: 48, borderRadius: 12, cursor: "pointer", fontSize: 20,
              background: listening ? "#4CAF5033" : "#1e1e35",
              border: `1px solid ${listening ? "#4CAF50" : "#2a2a4a"}`,
            }}>🎤</button>
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
              width: 48, height: 48, borderRadius: 12, fontSize: 20, color: "#fff",
              background: `linear-gradient(135deg, ${gc.color}, ${gc.color2})`,
              border: "none", cursor: "pointer",
              opacity: (!input.trim() || loading) ? 0.4 : 1,
            }}>→</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Grandchild Card ───────────────────────────────────────────
function GrandchildCard({ gc, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => onSelect(gc)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `linear-gradient(135deg, ${gc.color}cc, ${gc.color2}cc)` : "#1a1a2e",
        border: `2px solid ${hovered ? gc.color : "#2a2a4a"}`,
        borderRadius: 22, padding: 24, cursor: "pointer",
        transition: "all 0.3s", transform: hovered ? "translateY(-6px) scale(1.02)" : "none",
        boxShadow: hovered ? `0 16px 50px ${gc.color}44` : "none",
        position: "relative", overflow: "hidden",
      }}>
      <div style={{ position: "absolute", bottom: -10, right: -10, fontSize: 90, opacity: 0.08 }}>{gc.emoji}</div>
      <div style={{ position: "absolute", top: 14, right: 14, background: `${gc.color}44`, border: `1px solid ${gc.color}66`, borderRadius: 20, padding: "3px 10px" }}>
        <span style={{ color: "#fff", fontSize: 11 }}>Age {gc.age} • {gc.gender}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div style={{ width: 62, height: 62, borderRadius: "50%", background: `linear-gradient(135deg, ${gc.color}55, ${gc.color2}55)`, border: `3px solid ${gc.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, boxShadow: `0 0 20px ${gc.color}44` }}>{gc.emoji}</div>
        <div>
          <div style={{ color: "#fff", fontFamily: "'Fredoka One', Georgia, sans-serif", fontSize: 22, letterSpacing: 0.5 }}>{gc.name}</div>
          <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
            {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.floor(gc.rating) ? "#FFD700" : "#444", fontSize: 12 }}>★</span>)}
            <span style={{ color: "#888", fontSize: 11, marginLeft: 3 }}>{gc.rating} ({gc.sessions.toLocaleString()} visits)</span>
          </div>
        </div>
      </div>
      <p style={{ color: "#ccc", fontSize: 13, lineHeight: 1.7, margin: "0 0 14px" }}>{gc.voice}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {gc.tags.map(t => <span key={t} style={{ background: `${gc.color}33`, color: gc.accent, borderRadius: 20, padding: "3px 10px", fontSize: 11, border: `1px solid ${gc.color}55` }}>{t}</span>)}
      </div>
      <div style={{ background: "#00000055", borderRadius: 12, padding: "10px 14px", borderLeft: `3px solid ${gc.accent}`, marginBottom: 14 }}>
        <span style={{ color: "#ddd", fontSize: 12, fontStyle: "italic" }}>"{gc.greeting.slice(0, 85)}..."</span>
      </div>
      <button style={{ width: "100%", padding: "12px", borderRadius: 14, background: `linear-gradient(135deg, ${gc.color}88, ${gc.color2}88)`, border: `1px solid ${gc.color}`, color: "#fff", fontSize: 14, cursor: "pointer", fontFamily: "'Fredoka One', Georgia, sans-serif", letterSpacing: 0.5 }}>
        Visit with {gc.name} 🎙️ →
      </button>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────
export default function LittleOnesAI() {
  const [screen, setScreen] = useState("home");
  const [selected, setSelected] = useState(null);

  if (screen === "chat" && selected) return <ChatInterface gc={selected} onBack={() => setScreen("browse")} />;

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", fontFamily: "Georgia, serif", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:#1a1a2e} ::-webkit-scrollbar-thumb{background:#9C27B0;border-radius:3px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes sparkle{0%,100%{transform:scale(1) rotate(0deg)}50%{transform:scale(1.2) rotate(15deg)}}
      `}</style>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "#0d0d1acc", backdropFilter: "blur(20px)", borderBottom: "1px solid #9C27B033", padding: "0 24px", display: "flex", alignItems: "center", gap: 14, height: 64 }}>
        <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22, display: "inline-block", animation: "sparkle 3s ease infinite" }}>💜</span>
          <span style={{ fontFamily: "'Fredoka One', Georgia, sans-serif", fontSize: 22, color: "#fff", letterSpacing: 1 }}>Little Ones AI</span>
        </button>
        <span style={{ color: "#CE93D8", fontSize: 11, background: "#9C27B022", padding: "3px 10px", borderRadius: 20, border: "1px solid #9C27B033" }}>AI Grandchildren for Nanny & Poppy</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {[["home","Home"],["browse","Meet the Kids"]].map(([s,l]) => (
            <button key={s} onClick={() => setScreen(s)} style={{ background: screen === s ? "#9C27B0" : "none", border: `1px solid ${screen === s ? "#9C27B0" : "#2a2a4a"}`, color: "#fff", borderRadius: 10, padding: "7px 16px", cursor: "pointer", fontSize: 13 }}>{l}</button>
          ))}
        </div>
      </nav>

      {screen === "home" && (
        <div>
          <div style={{ minHeight: "88vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, #9C27B044 0%, transparent 65%)", pointerEvents: "none" }} />
            {GRANDCHILDREN.map((gc, i) => (
              <div key={gc.id} style={{ position: "absolute", fontSize: 32, opacity: 0.1, animation: `float ${3 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.4}s`, left: `${8 + i * 14}%`, top: `${12 + (i % 3) * 26}%`, pointerEvents: "none" }}>{gc.emoji}</div>
            ))}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#9C27B022", border: "1px solid #9C27B044", borderRadius: 30, padding: "8px 20px", marginBottom: 28, animation: "fadeUp 0.5s ease both" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#CE93D8", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ color: "#CE93D8", fontSize: 13 }}>6 AI Grandchildren • Hands-Free Voice • Always Here</span>
            </div>
            <h1 style={{ fontFamily: "'Fredoka One', Georgia, sans-serif", fontSize: "clamp(46px, 8vw, 88px)", lineHeight: 1.05, margin: "0 0 20px", animation: "fadeUp 0.5s ease 0.1s both", letterSpacing: 1 }}>
              <span style={{ color: "#CE93D8" }}>Nanny.</span><br />
              <span style={{ color: "#fff" }}>I missed</span>{" "}<span style={{ color: "#F48FB1" }}>you.</span>
            </h1>
            <p style={{ fontSize: 17, color: "#aaa", maxWidth: 560, lineHeight: 1.9, margin: "0 0 14px", animation: "fadeUp 0.5s ease 0.15s both", fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>
              Six AI grandchildren who visit Nanny or Poppy all day — asking about their stories, making them feel loved and needed, keeping them safe without them ever knowing.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#4CAF5011", border: "1px solid #4CAF5033", borderRadius: 20, padding: "7px 16px", marginBottom: 36, animation: "fadeUp 0.5s ease 0.2s both" }}>
              <span>🎙️</span><span style={{ color: "#81C784", fontSize: 13 }}>Hands-free voice — Nanny just talks, no typing needed</span>
            </div>
            <button onClick={() => setScreen("browse")} style={{ background: "linear-gradient(135deg, #9C27B0, #E91E8C)", border: "none", borderRadius: 18, color: "#fff", padding: "16px 40px", fontSize: 17, cursor: "pointer", fontFamily: "'Fredoka One', Georgia, sans-serif", letterSpacing: 0.5, boxShadow: "0 0 40px #9C27B066", animation: "fadeUp 0.5s ease 0.25s both" }}>
              Meet the Little Ones →
            </button>
            <div style={{ display: "flex", gap: 20, marginTop: 60, flexWrap: "wrap", justifyContent: "center" }}>
              {GRANDCHILDREN.map((gc, i) => (
                <div key={gc.id} onClick={() => { setSelected(gc); setScreen("chat"); }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
                  <div style={{ width: 74, height: 74, borderRadius: "50%", background: `linear-gradient(135deg, ${gc.color}44, ${gc.color2}44)`, border: `3px solid ${gc.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, boxShadow: `0 0 24px ${gc.color}44`, animation: `float ${3 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.3}s`, transition: "transform 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  >{gc.emoji}</div>
                  <span style={{ color: "#888", fontSize: 11 }}>{gc.name}, {gc.age}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "60px 24px", maxWidth: 960, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fredoka One', Georgia, sans-serif", fontSize: 38, textAlign: "center", marginBottom: 40, letterSpacing: 0.5 }}>Why <span style={{ color: "#CE93D8" }}>Little Ones AI</span>?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 18 }}>
              {[
                { icon: "💜", title: "They Feel Loved", desc: "A grandchild asking questions is love — not care, not management. Pure love." },
                { icon: "🧠", title: "Activates Memory", desc: "Questions about the past light up parts of the brain that stay strongest longest." },
                { icon: "🌟", title: "They Feel Needed", desc: "Grandchildren need you. That makes Nanny and Poppy the most important person alive." },
                { icon: "🎙️", title: "Hands-Free Voice", desc: "No typing. No screens. Nanny just talks and the grandchild talks back." },
                { icon: "🎭", title: "Natural Redirection", desc: "Children change subjects constantly. Nobody notices. Perfect invisible care." },
                { icon: "🔒", title: "Safe All Day", desc: "While they chat, the AI watches for distress and alerts family if needed." },
              ].map((f, i) => (
                <div key={i} style={{ background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 18, padding: 26, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#9C27B0"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a4a"; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ fontSize: 30, marginBottom: 12 }}>{f.icon}</div>
                  <div style={{ fontFamily: "'Fredoka One', Georgia, sans-serif", fontSize: 17, marginBottom: 8, letterSpacing: 0.3 }}>{f.title}</div>
                  <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ margin: "0 auto 80px", padding: "52px 48px", textAlign: "center", background: "linear-gradient(135deg, #9C27B022, #E91E8C11)", border: "1px solid #9C27B044", borderRadius: 28, maxWidth: 800 }}>
            <div style={{ fontSize: 48, marginBottom: 20, animation: "float 4s ease infinite" }}>💜</div>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, lineHeight: 1.9, color: "#eee", fontStyle: "italic", margin: "0 0 20px" }}>
              "Nanny — I have to go to sleep now but I'm SO glad we talked today. You know what? You're my favourite person in the whole world. I'll talk to you tomorrow okay? Don't forget me."
            </p>
            <div style={{ color: "#CE93D8", fontSize: 14, marginBottom: 8 }}>— Lily, age 7</div>
            <p style={{ color: "#666", fontSize: 13, fontStyle: "italic" }}>And for that moment — Nanny means it completely.</p>
          </div>
        </div>
      )}

      {screen === "browse" && (
        <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 36, animation: "fadeUp 0.4s ease both" }}>
            <h1 style={{ fontFamily: "'Fredoka One', Georgia, sans-serif", fontSize: 46, marginBottom: 10, letterSpacing: 0.5 }}>Meet the <span style={{ color: "#CE93D8" }}>Little Ones</span> 💜</h1>
            <p style={{ color: "#888", fontSize: 14 }}>Choose who Nanny or Poppy connects with most. All support 🎙️ hands-free voice conversation.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 22 }}>
            {GRANDCHILDREN.map((gc, i) => (
              <div key={gc.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.07}s both` }}>
                <GrandchildCard gc={gc} onSelect={(g) => { setSelected(g); setScreen("chat"); }} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ borderTop: "1px solid #1e1e35", padding: "28px 24px", textAlign: "center" }}>
        <div style={{ color: "#444", fontSize: 13 }}>💜 Little Ones AI • MM AI Technologies • Sister app to Carer Hire AI & Memory Mirror</div>
      </div>
    </div>
  );
}
