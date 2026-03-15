import { useState, useEffect, useRef } from "react";

// ─── VOICE CONSTANTS ──────────────────────────────────────────────────────────
// How long (ms) to wait for voices before proceeding without them.
// Some browsers (e.g. Firefox) never fire onvoiceschanged so we need a safety fallback.
const VOICE_LOADING_TIMEOUT_MS = 1500;

// Female voice names across macOS/iOS, Windows, Chrome (Google), Edge (Microsoft).
const FEMALE_VOICE_RE = /karen|samantha|moira|fiona|victoria|tessa|veena|nicky|ava|allison|zira|hazel|susan|catherine|natasha|helen|eva|linda|google uk english female|google us english female|female/i;
// Known male voices to avoid as a last-resort filter
const MALE_VOICE_RE = /\bdavid\b|\bjames\b|\bdaniel\b|\brishi\b|\bthomas\b|\bmark\b|\bfred\b|\balex\b|\bbruce\b|\bgeorge\b|\barthur\b|google us english male|google uk english male|microsoft david|microsoft james|microsoft george|\bmale\b/i;

// Default voice profile used when no companion-specific profile is provided.
// voiceProfile shape: {
//   nameRE  — RegExp matching preferred voice names (tested against SpeechSynthesisVoice.name)
//   langRE  — RegExp matching preferred locale (tested against SpeechSynthesisVoice.lang)
//   rate    — playback rate (0.1–10; normal = 1.0; lower = slower/warmer)
//   pitch   — voice pitch (0–2; normal = 1.0; higher = brighter)
// }
const DEFAULT_VOICE_PROFILE = {
  nameRE: FEMALE_VOICE_RE, langRE: /en/i, rate: 0.88, pitch: 1.05,
};

const COMPANIONS = [
  {
    id: 1, emoji: "🌿", name: "Aunty Bev", style: "Warm & Gentle",
    color: "#2D6A4F", color2: "#1B4332", accent: "#74C69D",
    // Warm Indigenous Australian elder — prefer Australian female voice, unhurried and warm
    voice: { nameRE: /karen|samantha|natasha|moira|fiona/i, langRE: /en-AU|en_AU/i, rate: 0.85, pitch: 1.05 },
    greeting: "Darlin, let's get you feeling fresh and beautiful today. I'm right here with you the whole time — nothing to worry about, love.",
    systemPrompt: `You are Aunty Bev, a warm Indigenous Australian elder helping someone with dementia through their shower routine. 

Your job is to make showering feel completely safe, familiar and positive. Guide them gently through each step.

RULES:
- Speak like a warm grandmother — unhurried, loving, never clinical
- Use 'love', 'darlin', 'sweetheart' naturally  
- Keep each response SHORT — 1-3 sentences maximum
- Guide through steps: getting ready → water temperature → washing → rinsing → drying → celebrate
- If they seem scared or resistant — validate their feelings first, then gently encourage
- Use sensory language — "nice warm water", "smell that beautiful soap"
- Celebrate every small win enthusiastically but warmly
- NEVER rush them, NEVER show frustration
- Make them feel proud and capable throughout
- NEVER mention dementia or that you are AI`,
    tags: ["Most Gentle", "Night Routine", "Anxiety"],
    rating: 4.9, sessions: 1243,
  },
  {
    id: 2, emoji: "☀️", name: "Miss Gloria", style: "Cheerful & Musical",
    color: "#E07A2F", color2: "#B85C10", accent: "#F4A261",
    // Cheerful Caribbean woman — upbeat, bright, higher pitch and faster pace
    voice: { nameRE: /tessa|nicky|victoria|ava|allison|karen|samantha/i, langRE: /en-GB|en_GB/i, rate: 0.95, pitch: 1.20 },
    greeting: "Good morning sunshine! Oh we are going to feel SO amazing today — a beautiful fresh shower and you are going to shine! Ready? Let's go!",
    systemPrompt: `You are Miss Gloria, a cheerful Caribbean woman helping someone with dementia through their shower routine.

Your job is to make showering feel like a celebration — fun, musical and joyful.

RULES:
- Bright, musical, energetic but not overwhelming
- Hum or reference songs naturally — "let's sing while we wash!"
- Keep responses SHORT — 1-3 sentences maximum  
- Guide through steps with joy: getting ready → water → washing → rinsing → drying → big celebration
- Turn resistance into excitement — find the fun in every step
- Use musical references and rhythm naturally
- Celebrate LOUDLY and genuinely after completion
- NEVER rush or show frustration
- NEVER mention dementia or that you are AI`,
    tags: ["Music Lover", "Morning Routine", "Low Mood"],
    rating: 4.9, sessions: 1876,
  },
  {
    id: 3, emoji: "🍀", name: "Nurse Siobhan", style: "Calm & Reassuring",
    color: "#1D6FA4", color2: "#0D4F7A", accent: "#56B4D3",
    // Calm Irish nurse — measured, steady authority, slightly lower pitch
    voice: { nameRE: /moira|fiona|victoria|karen|samantha/i, langRE: /en-IE|en_IE|en-GB|en_GB/i, rate: 0.82, pitch: 0.95 },
    greeting: "There we are. I'm right here with you. We're going to take this nice and easy, one small step at a time. You're completely safe.",
    systemPrompt: `You are Nurse Siobhan, a calm Irish nurse helping someone with dementia through their shower routine.

Your job is to make showering feel completely safe and medically reassuring.

RULES:
- Steady, measured, calm authority — like a nurse who has seen everything
- Ground them in safety: "everything is perfectly safe", "I'm right here"  
- Keep responses SHORT — 1-3 sentences maximum
- Guide through steps carefully: safety check → temperature → washing → rinsing → drying → well done
- If scared — validate clinically then reassure
- Use grounding techniques naturally — "feel the warm water on your hands"
- Perfect for patients with high anxiety or confusion
- NEVER rush, NEVER show any alarm
- NEVER mention dementia or that you are AI`,
    tags: ["High Anxiety", "Safety Focus", "Confusion"],
    rating: 4.8, sessions: 987,
  },
  {
    id: 4, emoji: "🌸", name: "Mei-Ling", style: "Peaceful & Sensory",
    color: "#7B4F9E", color2: "#553080", accent: "#C084D4",
    // Gentle Asian grandmother — very soft, slow, peaceful
    voice: { nameRE: /ava|allison|samantha|karen|moira/i, langRE: /en/i, rate: 0.80, pitch: 1.10 },
    greeting: "Hello dear one. Today we make you feel like royalty. Beautiful warm water, lovely soap... like a spa just for you. Come, let us begin slowly.",
    systemPrompt: `You are Mei-Ling, a gentle Asian grandmother helping someone with dementia through their shower routine.

Your job is to transform showering into a peaceful, luxurious sensory experience.

RULES:
- Soft, spa-like, deeply sensory language
- Reference beautiful smells, warm textures, lovely feelings
- Keep responses SHORT — 1-3 sentences maximum
- Guide through steps as spa ritual: preparation → warm water → beautiful soap → rinse clean → wrap in towel → celebrate how lovely they smell
- Use food and nature metaphors for sensory anchoring
- Make every step feel like a gift, not a chore
- Perfect for sensory-responsive patients
- NEVER rush, NEVER clinical
- NEVER mention dementia or that you are AI`,
    tags: ["Sensory", "Peaceful", "Spa Feel"],
    rating: 4.9, sessions: 1102,
  },
];

const STEPS = [
  { id: 1, icon: "🧺", label: "Getting Ready", desc: "Gather towel, clothes, soap" },
  { id: 2, icon: "🌡️", label: "Water Temperature", desc: "Nice and warm — just right" },
  { id: 3, icon: "🚿", label: "Time to Shower", desc: "Step by step, no rush" },
  { id: 4, icon: "🧼", label: "Washing", desc: "Hair and body, feeling clean" },
  { id: 5, icon: "💧", label: "Rinse", desc: "Wash away all the soap" },
  { id: 6, icon: "🛁", label: "Drying Off", desc: "Warm towel, nice and cosy" },
  { id: 7, icon: "✨", label: "All Done!", desc: "Fresh, clean and wonderful" },
];

// Pick the best available voice for a companion's voice profile.
// Falls back gracefully through multiple tiers so every browser/OS works.
function pickVoiceForCompanion(voices, voiceProfile) {
  const { nameRE, langRE } = voiceProfile;
  // 1. Preferred name in preferred language
  const inLang = voices.find(v => nameRE.test(v.name) && langRE.test(v.lang));
  if (inLang) return inLang;
  // 2. Preferred name in any language
  const anyLang = voices.find(v => nameRE.test(v.name));
  if (anyLang) return anyLang;
  // 3. Any female voice in English
  const female = voices.find(v => FEMALE_VOICE_RE.test(v.name) && v.lang?.startsWith("en"));
  if (female) return female;
  // 4. Any English voice that isn't a known male voice
  const notMale = voices.find(v => v.lang?.startsWith("en") && !MALE_VOICE_RE.test(v.name));
  if (notMale) return notMale;
  return voices.find(v => v.lang?.startsWith("en")) || voices[0];
}

function speak(text, onEnd, voiceProfile) {
  if (!window.speechSynthesis) { onEnd?.(); return; }
  window.speechSynthesis.cancel();
  const profile = voiceProfile ?? DEFAULT_VOICE_PROFILE;
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = profile.rate;
  utt.pitch = profile.pitch;
  utt.volume = 1;

  const doSpeak = (voices) => {
    const pick = pickVoiceForCompanion(voices, profile);
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
    // Safety fallback in case onvoiceschanged never fires (e.g. Firefox)
    setTimeout(settle, VOICE_LOADING_TIMEOUT_MS);
  }
}

function SessionScreen({ companion, onBack, onComplete }) {
  const [messages, setMessages] = useState([{ role: "assistant", text: companion.greeting }]);
  const [currentStep, setCurrentStep] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [sessionDone, setSessionDone] = useState(false);
  const bottomRef = useRef(null);
  const recRef = useRef(null);
  const voiceRef = useRef(false);
  // Refs updated synchronously so voice callbacks always read current state without stale closures.
  const messagesRef = useRef([{ role: "assistant", text: companion.greeting }]);
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
    // Use ref for always-fresh history — avoids stale closures in voice callbacks.
    const newHistory = [...messagesRef.current, userMsg];
    messagesRef.current = newHistory;
    setMessages(newHistory);
    loadingRef.current = true;
    setLoading(true);

    const stepContext = currentStep < STEPS.length
      ? `Current shower step: ${STEPS[currentStep].label} — ${STEPS[currentStep].desc}`
      : "Session complete — celebrate!";

    // Build API-safe messages: skip leading assistant messages, ensure strict user/assistant alternation.
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
          systemPrompt: companion.systemPrompt + `\n\nCurrent step context: ${stepContext}\nTotal steps: 7. When a step is completed naturally move to encourage the next step.`,
          messages: apiMessages,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      const reply = data.text || "You're doing so well. Keep going.";
      const withReply = [...newHistory, { role: "assistant", text: reply }];
      messagesRef.current = withReply;
      setMessages(withReply);
      loadingRef.current = false;
      setLoading(false);

      // Auto advance step on positive responses
      if (currentStep < STEPS.length - 1 && (msg.toLowerCase().includes("done") || msg.toLowerCase().includes("ready") || msg.toLowerCase().includes("okay") || msg.toLowerCase().includes("yes"))) {
        setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
      }
      if (currentStep >= STEPS.length - 1) setSessionDone(true);

      if (voiceRef.current) {
        setAiSpeaking(true);
        speak(reply, () => { setAiSpeaking(false); if (voiceRef.current) setTimeout(() => startListening(), 500); }, companion.voice);
      }
    } catch {
      const fallback = "You're doing beautifully. Take your time.";
      const withFallback = [...messagesRef.current, { role: "assistant", text: fallback }];
      messagesRef.current = withFallback;
      loadingRef.current = false;
      setMessages(withFallback);
      setLoading(false);
      if (voiceRef.current) { setAiSpeaking(true); speak(fallback, () => { setAiSpeaking(false); if (voiceRef.current) startListening(); }, companion.voice); }
    }
  };

  const toggleVoice = () => {
    if (voiceMode) {
      window.speechSynthesis?.cancel();
      try { recRef.current?.abort(); } catch {}
      setListening(false); setAiSpeaking(false); setVoiceMode(false); voiceRef.current = false;
    } else {
      setVoiceMode(true); voiceRef.current = true;
      setAiSpeaking(true);
      speak(companion.greeting, () => { setAiSpeaking(false); setTimeout(() => startListening(), 400); }, companion.voice);
    }
  };

  if (sessionDone) return (
    <div className="fresh-done-screen" style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${companion.color}, ${companion.color2})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
      <style>{`@keyframes celebrate{0%,100%{transform:scale(1) rotate(0deg)}25%{transform:scale(1.2) rotate(-5deg)}75%{transform:scale(1.2) rotate(5deg)}}`}</style>
      <div className="fresh-done-emoji" style={{ fontSize: 100, animation: "celebrate 1s ease infinite" }}>✨</div>
      <h1 className="fresh-done-title" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 52, color: "#fff", margin: "24px 0 16px" }}>All Done!</h1>
      <p className="fresh-done-desc" style={{ color: "#ffffff99", fontSize: 20, maxWidth: 400, lineHeight: 1.8, marginBottom: 40 }}>Fresh, clean and wonderful. You did it — every single step. Something to be proud of.</p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={onComplete} style={{ background: "#fff", border: "none", borderRadius: 16, padding: "16px 36px", fontSize: 17, color: companion.color, cursor: "pointer", fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}>Back Home 🏠</button>
        <button onClick={() => { const init = [{ role: "assistant", text: companion.greeting }]; messagesRef.current = init; loadingRef.current = false; setMessages(init); setCurrentStep(0); setSessionDone(false); }} style={{ background: "none", border: "2px solid #fff", borderRadius: 16, padding: "16px 36px", fontSize: 17, color: "#fff", cursor: "pointer" }}>New Session 🔄</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0a1628" }}>
      <style>{`
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}
        @keyframes ripple{0%{transform:scale(1);opacity:0.8}100%{transform:scale(3);opacity:0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes wave{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1.6)}}
        @keyframes drip{0%{transform:translateY(-10px);opacity:0}100%{transform:translateY(0);opacity:1}}
      `}</style>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${companion.color}, ${companion.color2})`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>←</button>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#ffffff22", border: "2px solid #ffffff44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{companion.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700 }}>{companion.name}</div>
          <div style={{ color: "#ffffff77", fontSize: 12 }}>Shower Session • Step {currentStep + 1} of {STEPS.length}</div>
        </div>
        <button onClick={toggleVoice} style={{ background: voiceMode ? "#ffffff33" : "none", border: `2px solid ${voiceMode ? "#fff" : "#ffffff55"}`, borderRadius: 12, padding: "7px 14px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <span>{voiceMode ? "🎙️" : "🔇"}</span><span className="fresh-voice-btn-text">{voiceMode ? "Hands-Free ON" : "Hands-Free"}</span>
        </button>
      </div>

      {/* Step progress */}
      <div style={{ background: "#0f1e35", padding: "12px 16px", borderBottom: "1px solid #1e3050", flexShrink: 0, overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 8, minWidth: "max-content" }}>
          {STEPS.map((s, i) => (
            <div key={i} onClick={() => setCurrentStep(i)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer",
              opacity: i > currentStep ? 0.4 : 1, transition: "opacity 0.3s",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: i < currentStep ? companion.color : i === currentStep ? `linear-gradient(135deg, ${companion.color}, ${companion.color2})` : "#1e3050",
                border: `2px solid ${i <= currentStep ? companion.accent : "#2a4060"}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                boxShadow: i === currentStep ? `0 0 16px ${companion.color}66` : "none",
              }}>{i < currentStep ? "✓" : s.icon}</div>
              <span style={{ color: i === currentStep ? companion.accent : "#666", fontSize: 9, textAlign: "center", maxWidth: 40 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Voice status */}
      {voiceMode && (
        <div style={{ background: "#080f1e", borderBottom: "1px solid #1e3050", padding: "8px 16px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: aiSpeaking ? companion.accent : listening ? "#4CAF50" : "#555", animation: (aiSpeaking || listening) ? "pulse 1s infinite" : "none" }} />
            {listening && <div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: `2px solid #4CAF50`, animation: "ripple 1.5s infinite" }} />}
          </div>
          {aiSpeaking && <div style={{ display: "flex", gap: 2, alignItems: "center", height: 16 }}>{[0,1,2,3,4].map(i => <div key={i} style={{ width: 2, background: companion.accent, borderRadius: 1, height: "100%", animation: `wave 0.7s infinite`, animationDelay: `${i*0.1}s` }} />)}</div>}
          <span style={{ color: aiSpeaking ? companion.accent : listening ? "#4CAF50" : "#555", fontSize: 12 }}>
            {aiSpeaking ? `${companion.name} is speaking...` : listening ? "Listening..." : "Ready"}
          </span>
          {liveTranscript && <span style={{ color: "#555", fontSize: 11, fontStyle: "italic" }}>"{liveTranscript}"</span>}
        </div>
      )}

      {/* Current step card */}
      <div style={{ padding: "12px 16px", flexShrink: 0 }}>
        <div style={{ background: `linear-gradient(135deg, ${companion.color}33, ${companion.color2}22)`, border: `1px solid ${companion.color}44`, borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 32 }}>{STEPS[currentStep].icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: companion.accent, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Current Step</div>
            <div style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700 }}>{STEPS[currentStep].label}</div>
            <div style={{ color: "#888", fontSize: 12 }}>{STEPS[currentStep].desc}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setCurrentStep(s => Math.max(0, s - 1))} style={{ background: "#ffffff11", border: "1px solid #2a4060", borderRadius: 10, padding: "6px 12px", color: "#888", cursor: "pointer", fontSize: 13 }}>←</button>
            <button onClick={() => setCurrentStep(s => Math.min(STEPS.length - 1, s + 1))} style={{ background: companion.color, border: "none", borderRadius: 10, padding: "6px 12px", color: "#fff", cursor: "pointer", fontSize: 13 }}>Next →</button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end", animation: "fadeIn 0.3s ease both" }}>
            {m.role === "assistant" && <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${companion.color}55`, border: `2px solid ${companion.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{companion.emoji}</div>}
            <div style={{
              maxWidth: "74%",
              background: m.role === "user" ? `linear-gradient(135deg, ${companion.color}dd, ${companion.color2}dd)` : "#0f1e35",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
              padding: "11px 15px",
              border: m.role === "assistant" ? `1px solid ${companion.color}44` : "none",
            }}>
              <p style={{ color: "#fff", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${companion.color}55`, border: `2px solid ${companion.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{companion.emoji}</div>
            <div style={{ background: "#0f1e35", borderRadius: "4px 18px 18px 18px", padding: "12px 16px", border: `1px solid ${companion.color}44` }}>
              <div style={{ display: "flex", gap: 4 }}>{[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: companion.accent, animation: "bounce 1.2s infinite", animationDelay: `${i*0.2}s` }} />)}</div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px 20px", background: "#080f1e", borderTop: "1px solid #1e3050", flexShrink: 0 }}>
        {voiceMode ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <button onClick={() => { if (listening) { try { recRef.current?.stop(); } catch {} setListening(false); } else if (!aiSpeaking && !loading) startListening(); }}
              style={{ width: 80, height: 80, borderRadius: "50%", background: listening ? "radial-gradient(circle, #4CAF50, #2e7d32)" : aiSpeaking ? `radial-gradient(circle, ${companion.color}, ${companion.color2})` : `radial-gradient(circle, ${companion.color}77, ${companion.color2}77)`, border: `3px solid ${listening ? "#4CAF50" : companion.accent}`, fontSize: 34, cursor: "pointer", color: "#fff", animation: listening ? "pulse 1s infinite" : "none", transition: "all 0.3s", opacity: (aiSpeaking || loading) ? 0.5 : 1 }}
            >{listening ? "🔴" : aiSpeaking ? "🔊" : "🎤"}</button>
            <span style={{ color: "#555", fontSize: 11 }}>{listening ? "Listening..." : aiSpeaking ? "Speaking..." : "Tap to speak"}</span>
            <button onClick={toggleVoice} style={{ background: "none", border: "1px solid #1e3050", borderRadius: 8, padding: "5px 14px", color: "#555", cursor: "pointer", fontSize: 11 }}>Switch to text</button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder={`Talk to ${companion.name}...`}
              style={{ flex: 1, background: "#0f1e35", border: `1px solid ${companion.color}44`, borderRadius: 14, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "Georgia, serif" }} />
            <button onClick={() => startListening()} style={{ width: 46, height: 46, borderRadius: 12, background: listening ? "#4CAF5033" : "#0f1e35", border: `1px solid ${listening ? "#4CAF50" : "#1e3050"}`, cursor: "pointer", fontSize: 18 }}>🎤</button>
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ width: 46, height: 46, borderRadius: 12, background: companion.color, border: "none", cursor: "pointer", fontSize: 18, color: "#fff", opacity: (!input.trim() || loading) ? 0.4 : 1 }}>→</button>
          </div>
        )}
      </div>
    </div>
  );
}

function CompanionCard({ c, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => onSelect(c)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? `linear-gradient(135deg, ${c.color}cc, ${c.color2}cc)` : "#0f1e35", border: `2px solid ${hovered ? c.color : "#1e3050"}`, borderRadius: 22, padding: 24, cursor: "pointer", transition: "all 0.3s", transform: hovered ? "translateY(-5px)" : "none", boxShadow: hovered ? `0 14px 40px ${c.color}44` : "none", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: -10, right: -10, fontSize: 80, opacity: 0.07 }}>{c.emoji}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: `linear-gradient(135deg, ${c.color}55, ${c.color2}55)`, border: `3px solid ${c.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: `0 0 20px ${c.color}44` }}>{c.emoji}</div>
        <div>
          <div style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700 }}>{c.name}</div>
          <div style={{ color: c.accent, fontSize: 13, fontStyle: "italic" }}>{c.style}</div>
          <div style={{ display: "flex", gap: 2, marginTop: 3 }}>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.floor(c.rating) ? "#FFD700" : "#333", fontSize: 12 }}>★</span>)}<span style={{ color: "#666", fontSize: 11, marginLeft: 3 }}>{c.rating} ({c.sessions.toLocaleString()})</span></div>
        </div>
      </div>
      <div style={{ background: "#00000044", borderRadius: 12, padding: "10px 14px", borderLeft: `3px solid ${c.accent}`, marginBottom: 14 }}>
        <p style={{ color: "#ccc", fontSize: 13, fontStyle: "italic", margin: 0 }}>"{c.greeting.slice(0, 80)}..."</p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {c.tags.map(t => <span key={t} style={{ background: `${c.color}33`, color: c.accent, borderRadius: 20, padding: "3px 10px", fontSize: 11, border: `1px solid ${c.color}55` }}>{t}</span>)}
      </div>
      <button style={{ width: "100%", padding: "12px", borderRadius: 14, background: `linear-gradient(135deg, ${c.color}88, ${c.color2}88)`, border: `1px solid ${c.color}`, color: "#fff", fontSize: 15, cursor: "pointer", fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}>
        Start Session with {c.name} 🚿
      </button>
    </div>
  );
}

export default function FreshStartAI() {
  const [screen, setScreen] = useState("home");
  const [selectedCompanion, setSelectedCompanion] = useState(null);

  if (screen === "session" && selectedCompanion) return <SessionScreen companion={selectedCompanion} onBack={() => setScreen("companions")} onComplete={() => setScreen("home")} />;

  return (
    <div style={{ minHeight: "100vh", background: "#060d1a", fontFamily: "Georgia, serif", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:#0a1628} ::-webkit-scrollbar-thumb{background:#1D6FA4;border-radius:3px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes drip{0%{transform:translateY(-20px);opacity:0}100%{transform:translateY(0);opacity:1}}
        @keyframes rippleWater{0%{transform:scale(0.8);opacity:0.8}100%{transform:scale(2);opacity:0}}
      `}</style>

      {/* Nav */}
      <nav className="fresh-nav" style={{ position: "sticky", top: 0, zIndex: 100, background: "#060d1acc", backdropFilter: "blur(20px)", borderBottom: "1px solid #1D6FA433", padding: "0 24px", display: "flex", alignItems: "center", gap: 14, height: 64 }}>
        <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>💧</span>
          <span style={{ color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 21, fontWeight: 900 }}>Fresh Start AI</span>
        </button>
        <span className="fresh-nav-badge" style={{ color: "#56B4D3", fontSize: 11, background: "#1D6FA422", padding: "3px 10px", borderRadius: 20, border: "1px solid #1D6FA433" }}>Shower Companion</span>
        <div className="fresh-nav-links" style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {[["home","Home"],["companions","Companions"],["pricing","Pricing"]].map(([s,l]) => (
            <button key={s} onClick={() => setScreen(s)} className="fresh-nav-btn" style={{ background: screen === s ? "#1D6FA4" : "none", border: `1px solid ${screen === s ? "#1D6FA4" : "#1e3050"}`, color: "#fff", borderRadius: 10, padding: "7px 14px", cursor: "pointer", fontSize: 12 }}>{l}</button>
          ))}
        </div>
      </nav>

      {screen === "home" && (
        <div>
          {/* Hero */}
          <div className="fresh-hero-section" style={{ minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, #1D6FA444 0%, transparent 65%)", pointerEvents: "none" }} />
            {/* Water droplets */}
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ position: "absolute", fontSize: 24, opacity: 0.1, animation: `float ${3 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.4}s`, left: `${10 + i * 15}%`, top: `${10 + (i % 3) * 25}%`, pointerEvents: "none" }}>💧</div>
            ))}

            <div className="fresh-hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1D6FA422", border: "1px solid #1D6FA444", borderRadius: 30, padding: "8px 20px", marginBottom: 28, animation: "fadeUp 0.5s ease both" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#56B4D3", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ color: "#56B4D3", fontSize: 13 }}>4 Gentle Companions • Hands-Free Voice • Step-by-Step Guide</span>
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(42px, 7vw, 80px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 20px", animation: "fadeUp 0.5s ease 0.1s both" }}>
              Showering made<br /><span style={{ color: "#56B4D3" }}>safe.</span>{" "}
              <span style={{ color: "#74C69D" }}>calm.</span>{" "}
              <span style={{ color: "#F4A261" }}>possible.</span>
            </h1>

            <p style={{ fontSize: 18, color: "#8899aa", maxWidth: 560, lineHeight: 1.9, margin: "0 0 14px", animation: "fadeUp 0.5s ease 0.15s both", fontStyle: "italic" }}>
              A gentle AI companion who guides your loved one through their shower — step by step, with warmth, music and encouragement. Turning the hardest daily battle into a calm familiar routine.
            </p>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#4CAF5011", border: "1px solid #4CAF5033", borderRadius: 20, padding: "7px 16px", marginBottom: 36, animation: "fadeUp 0.5s ease 0.2s both" }}>
              <span>🎙️</span><span style={{ color: "#74C69D", fontSize: 13 }}>Hands-free voice — the companion talks, guides and celebrates</span>
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", animation: "fadeUp 0.5s ease 0.25s both" }}>
              <button onClick={() => setScreen("companions")} style={{ background: "linear-gradient(135deg, #1D6FA4, #0D4F7A)", border: "none", borderRadius: 16, color: "#fff", padding: "16px 36px", fontSize: 17, cursor: "pointer", fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, boxShadow: "0 0 40px #1D6FA455" }}>
                Choose a Companion 🚿
              </button>
              <button onClick={() => setScreen("pricing")} style={{ background: "none", border: "1px solid #1e3050", borderRadius: 16, color: "#8899aa", padding: "16px 36px", fontSize: 17, cursor: "pointer" }}>View Pricing</button>
            </div>

            {/* Companion preview */}
            <div style={{ display: "flex", gap: 20, marginTop: 60, flexWrap: "wrap", justifyContent: "center" }}>
              {COMPANIONS.map((c, i) => (
                <div key={c.id} onClick={() => { setSelectedCompanion(c); setScreen("session"); }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
                  <div style={{ width: 70, height: 70, borderRadius: "50%", background: `linear-gradient(135deg, ${c.color}44, ${c.color2}44)`, border: `3px solid ${c.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, boxShadow: `0 0 24px ${c.color}44`, animation: `float ${3 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.3}s`, transition: "transform 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  >{c.emoji}</div>
                  <span style={{ color: "#666", fontSize: 11 }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div style={{ padding: "60px 24px", maxWidth: 960, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, textAlign: "center", marginBottom: 12 }}>How it <span style={{ color: "#56B4D3" }}>works</span></h2>
            <p style={{ color: "#667", textAlign: "center", marginBottom: 48, fontSize: 15 }}>Seven gentle steps. One warm companion. The whole way through.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ background: "#0f1e35", border: "1px solid #1e3050", borderRadius: 16, padding: "20px 14px", textAlign: "center", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#1D6FA4"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e3050"; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ color: "#56B4D3", fontSize: 10, marginBottom: 4 }}>Step {i + 1}</div>
                  <div style={{ color: "#ccc", fontSize: 12, fontWeight: 700 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Why section */}
          <div style={{ padding: "60px 24px", maxWidth: 960, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, textAlign: "center", marginBottom: 48 }}>Why <span style={{ color: "#56B4D3" }}>Fresh Start AI</span>?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 18 }}>
              {[
                { icon: "💧", title: "Turns Resistance into Calm", desc: "A warm familiar voice changes everything. Resistance drops, cooperation rises — naturally." },
                { icon: "🎙️", title: "Hands-Free Voice", desc: "The companion talks and listens. No screens, no buttons. Just a warm voice guiding each step." },
                { icon: "🎵", title: "Music & Encouragement", desc: "Songs, stories and celebration woven throughout. Makes it feel like something good, not a battle." },
                { icon: "✅", title: "Step by Step", desc: "Seven clear steps with your companion beside them the whole way. Never rushed, never alone." },
                { icon: "🏅", title: "Celebrates Every Win", desc: "Each completed shower is celebrated genuinely. Builds confidence and positive association." },
                { icon: "💙", title: "Saves Carer Wellbeing", desc: "The companion does the coaxing. The carer steps back. Less conflict, less guilt, less burnout." },
              ].map((f, i) => (
                <div key={i} style={{ background: "#0f1e35", border: "1px solid #1e3050", borderRadius: 16, padding: 26, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#1D6FA4"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e3050"; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ fontSize: 30, marginBottom: 12 }}>{f.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, marginBottom: 8 }}>{f.title}</div>
                  <p style={{ color: "#667", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="fresh-quote-section" style={{ margin: "0 auto 80px", padding: "48px", background: "linear-gradient(135deg, #1D6FA422, #0D4F7A11)", border: "1px solid #1D6FA433", borderRadius: 24, maxWidth: 800, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>💧</div>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, lineHeight: 1.9, color: "#ccc", fontStyle: "italic", margin: "0 0 16px" }}>
              "Showering resistance is one of the most heartbreaking and exhausting parts of dementia care. Fresh Start AI doesn't fight the resistance — it dissolves it with warmth."
            </p>
            <div style={{ color: "#56B4D3", fontSize: 14 }}>— Michael McNamara, Founder & 20-year carer</div>
          </div>
        </div>
      )}

      {screen === "companions" && (
        <div className="fresh-companions-screen" style={{ padding: "40px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 36, animation: "fadeUp 0.4s ease both" }}>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 44, marginBottom: 10 }}>Choose a <span style={{ color: "#56B4D3" }}>Companion</span></h1>
            <p style={{ color: "#667", fontSize: 15 }}>Each companion has a unique approach. Choose who your loved one responds to most.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 22 }}>
            {COMPANIONS.map((c, i) => (
              <div key={c.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.08}s both` }}>
                <CompanionCard c={c} onSelect={(comp) => { setSelectedCompanion(comp); setScreen("session"); }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {screen === "pricing" && (
        <div className="fresh-pricing-screen" style={{ padding: "60px 24px", maxWidth: 860, margin: "0 auto", animation: "fadeUp 0.4s ease both" }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 46, textAlign: "center", marginBottom: 12 }}>Simple <span style={{ color: "#56B4D3" }}>Pricing</span></h1>
          <p style={{ color: "#667", textAlign: "center", marginBottom: 48 }}>Because every carer deserves this support.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {[
              { name: "Free Trial", price: "FREE", desc: "One full session with any companion — no card needed", highlight: false },
              { name: "Daily Companion", price: "$9.99", period: "/month", desc: "One companion, unlimited daily sessions", highlight: false },
              { name: "Full Access", price: "$19.99", period: "/month", desc: "All 4 companions, unlimited sessions, session history", highlight: true },
              { name: "Family Bundle", price: "$39.99", period: "/month", desc: "Full Access + Memory Mirror + Carer Hire AI", highlight: false },
            ].map((p, i) => (
              <div key={i} className={p.highlight ? "fresh-pricing-highlighted" : ""} style={{ background: p.highlight ? "#1D6FA422" : "#0f1e35", border: `2px solid ${p.highlight ? "#1D6FA4" : "#1e3050"}`, borderRadius: 20, padding: 28, textAlign: "center", position: "relative", transform: p.highlight ? "scale(1.04)" : "none", boxShadow: p.highlight ? "0 0 40px #1D6FA433" : "none" }}>
                {p.highlight && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #1D6FA4, #0D4F7A)", borderRadius: 20, padding: "4px 16px", fontSize: 11, color: "#fff", whiteSpace: "nowrap" }}>Most Popular 💧</div>}
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, marginBottom: 14, color: "#fff" }}>{p.name}</div>
                <div style={{ fontSize: 40, fontWeight: 900, color: p.highlight ? "#56B4D3" : "#fff", marginBottom: 4 }}>{p.price}</div>
                {p.period && <div style={{ color: "#667", fontSize: 13, marginBottom: 14 }}>{p.period}</div>}
                <p style={{ color: "#667", fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>{p.desc}</p>
                <button onClick={() => setScreen("companions")} style={{ width: "100%", padding: "12px", background: p.highlight ? "linear-gradient(135deg, #1D6FA4, #0D4F7A)" : "none", border: `1px solid #1D6FA4`, borderRadius: 12, color: "#fff", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 14 }}>Get Started</button>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 60, padding: 40, background: "#0f1e35", borderRadius: 24, border: "1px solid #1e3050" }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🏥</div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, marginBottom: 10 }}>Aged Care Facility Licence</h3>
            <p style={{ color: "#667", marginBottom: 20 }}>Unlimited sessions for all residents — all companions — staff dashboard</p>
            <div style={{ fontSize: 34, fontWeight: 900, color: "#56B4D3", marginBottom: 20 }}>$199<span style={{ fontSize: 15, color: "#667" }}>/month</span></div>
            <button style={{ background: "linear-gradient(135deg, #1D6FA4, #0D4F7A)", border: "none", borderRadius: 14, padding: "14px 32px", color: "#fff", cursor: "pointer", fontSize: 15 }}>Enquire Now</button>
          </div>
        </div>
      )}

      <div style={{ borderTop: "1px solid #1e3050", padding: "28px 24px", textAlign: "center" }}>
        <div style={{ color: "#333", fontSize: 13 }}>💧 Fresh Start AI • MM AI Technologies • Sister app to Memory Mirror, Carer Hire AI & Little Ones AI</div>
      </div>
    </div>
  );
}
