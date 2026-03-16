import { useState, useEffect, useRef, useCallback } from “react”;

// ═══════════════════════════════════════════════════════════════════════════
// ── BULLETPROOF VOICE ENGINE (shared by ALL chat screens)
// ═══════════════════════════════════════════════════════════════════════════
//
// Rules that make hands-free reliable:
// 1. messagesRef — API always sees FULL history, never stale state
// 2. loadingRef  — hard guard, never double-send
// 3. voiceRef    — survives re-renders, no stale closure bugs
// 4. 2500ms delay after AI finishes speaking before mic restarts
// 5. Mic only starts if: voiceRef=true AND !loadingRef AND !aiSpeaking
// 6. Transcript min 3 chars — ignores mic noise
// 7. speechSynthesis.cancel() before every new send
//
// ── ELEVENLABS API KEY (entered once, shared across all companions)
let ELEVEN_API_KEY = “”;

// ── BROWSER SPEECH FALLBACK
function browserSpeak(text, onEnd) {
if (!window.speechSynthesis) { onEnd?.(); return; }
window.speechSynthesis.cancel();
const utt = new SpeechSynthesisUtterance(text);
utt.rate = 0.88; utt.pitch = 1.05; utt.volume = 1;
const voices = window.speechSynthesis.getVoices();
const pick = voices.find(v => /samantha|karen|moira|fiona|victoria/i.test(v.name))
|| voices.find(v => v.lang?.startsWith(“en”)) || voices[0];
if (pick) utt.voice = pick;
utt.onend  = () => onEnd?.();
utt.onerror= () => onEnd?.();
window.speechSynthesis.speak(utt);
}

// ── ELEVENLABS SPEAK (with browser fallback)
async function elevenSpeak(text, voiceId, onEnd) {
if (!ELEVEN_API_KEY || !voiceId) { browserSpeak(text, onEnd); return; }
try {
const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
method: “POST”,
headers: { “xi-api-key”: ELEVEN_API_KEY, “Content-Type”: “application/json” },
body: JSON.stringify({
text,
model_id: “eleven_multilingual_v2”,
voice_settings: { stability: 0.5, similarity_boost: 0.82, style: 0.2, use_speaker_boost: true }
}),
});
if (!res.ok) { browserSpeak(text, onEnd); return; }
const blob = await res.blob();
const url  = URL.createObjectURL(blob);
const audio = new Audio(url);
audio.onended = () => { URL.revokeObjectURL(url); onEnd?.(); };
audio.onerror = () => { URL.revokeObjectURL(url); browserSpeak(text, onEnd); };
audio.play();
} catch { browserSpeak(text, onEnd); }
}

function useVoiceChat({ systemPrompt, greeting, voiceId }) {
const [messages, setMessages]       = useState([{ role: “assistant”, text: greeting }]);
const [input, setInput]             = useState(””);
const [loading, setLoading]         = useState(false);
const [voiceMode, setVoiceMode]     = useState(false);
const [listening, setListening]     = useState(false);
const [aiSpeaking, setAiSpeaking]   = useState(false);
const [liveTranscript, setLiveTranscript] = useState(””);

const messagesRef   = useRef([{ role: “assistant”, text: greeting }]);
const loadingRef    = useRef(false);
const voiceRef      = useRef(false);
const recRef        = useRef(null);
const restartTimer  = useRef(null);
const audioRef      = useRef(null);

useEffect(() => { voiceRef.current = voiceMode; }, [voiceMode]);

// ── SPEAK — tries ElevenLabs first, falls back to browser
const speak = useCallback((text, onEnd) => {
window.speechSynthesis?.cancel();
if (audioRef.current) { try { audioRef.current.pause(); } catch {} }
elevenSpeak(text, voiceId, onEnd);
}, [voiceId]);

// ── START LISTENING (safe — checks all guards)
const startListening = useCallback(() => {
if (!voiceRef.current || loadingRef.current) return;
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SR) return;
try { recRef.current?.abort(); } catch {}
clearTimeout(restartTimer.current);
const rec = new SR();
rec.continuous     = false;
rec.interimResults = true;
rec.lang           = “en-AU”;
rec.onstart  = () => setListening(true);
rec.onresult = (e) => {
const t = Array.from(e.results).map(r => r[0].transcript).join(””);
setLiveTranscript(t);
if (e.results[e.results.length - 1].isFinal) {
setLiveTranscript(””);
setListening(false);
if (t.trim().length > 2) sendMessage(t);
}
};
rec.onerror = () => { setListening(false); setLiveTranscript(””); };
rec.onend   = () => { setListening(false); };
recRef.current = rec;
try { rec.start(); } catch {}
}, []);

// ── STOP MIC
const stopListening = useCallback(() => {
clearTimeout(restartTimer.current);
try { recRef.current?.abort(); } catch {}
setListening(false);
setLiveTranscript(””);
}, []);

// ── SEND MESSAGE (the core — bulletproof)
const sendMessage = useCallback(async (text) => {
const msg = (text || input).trim();
if (!msg || loadingRef.current) return;      // hard guard
stopListening();
setInput(””);
window.speechSynthesis?.cancel();
loadingRef.current = true;
setLoading(true);

```
const userMsg    = { role: "user", text: msg };
const newHistory = [...messagesRef.current, userMsg];
messagesRef.current = newHistory;
setMessages([...newHistory]);

try {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages: newHistory.map(m => ({ role: m.role, content: m.text })),
    }),
  });
  const data  = await res.json();
  const reply = data.content?.find(b => b.type === "text")?.text
    || "I'm right here with you.";

  const withReply = [...newHistory, { role: "assistant", text: reply }];
  messagesRef.current = withReply;
  setMessages([...withReply]);
  loadingRef.current = false;
  setLoading(false);

  if (voiceRef.current) {
    setAiSpeaking(true);
    speak(reply, () => {
      setAiSpeaking(false);
      // 2500ms gap — mic never hears AI's own voice
      if (voiceRef.current) {
        restartTimer.current = setTimeout(() => startListening(), 2500);
      }
    });
  }
} catch {
  const fallback = "I'm right here. Take your time.";
  const withFallback = [...messagesRef.current, { role: "assistant", text: fallback }];
  messagesRef.current = withFallback;
  setMessages([...withFallback]);
  loadingRef.current = false;
  setLoading(false);
  if (voiceRef.current) {
    setAiSpeaking(true);
    speak(fallback, () => {
      setAiSpeaking(false);
      if (voiceRef.current) restartTimer.current = setTimeout(() => startListening(), 2500);
    });
  }
}
```

}, [input, systemPrompt, speak, startListening, stopListening]);

// ── TOGGLE VOICE MODE
const toggleVoice = useCallback(() => {
if (voiceMode) {
window.speechSynthesis?.cancel();
stopListening();
clearTimeout(restartTimer.current);
setVoiceMode(false);
voiceRef.current = false;
setAiSpeaking(false);
} else {
setVoiceMode(true);
voiceRef.current = true;
setAiSpeaking(true);
speak(greeting, () => {
setAiSpeaking(false);
if (voiceRef.current) restartTimer.current = setTimeout(() => startListening(), 2500);
});
}
}, [voiceMode, greeting, speak, startListening, stopListening]);

// ── CLEANUP
useEffect(() => {
return () => {
window.speechSynthesis?.cancel();
try { recRef.current?.abort(); } catch {}
clearTimeout(restartTimer.current);
};
}, []);

return {
messages, input, setInput, loading,
voiceMode, listening, aiSpeaking, liveTranscript,
sendMessage, toggleVoice, startListening, stopListening,
};
}

// ═══════════════════════════════════════════════════════════════════════════
// ── DATA
// ═══════════════════════════════════════════════════════════════════════════

const COMPANIONS = [
{
id:1, emoji:“🌿”, name:“Aunty Bev”, origin:“Indigenous Australian Elder”, age:“68”,
color:”#2C5F2E”, color2:”#1B4020”, accent:”#74C69D”,
elevenVoiceId: “XrExE9yKIg1WjnnlVkGX”, // Matilda — warm Australian female
speciality:“Distressed patients, nighttime anxiety, cultural connection”,
tags:[“Night Watch”,“Cultural Care”,“Deep Listening”], rating:4.9, sessions:2847,
greeting:“Ah darlin, there you are. I’ve been thinking about you. Come sit with me a while — I want to hear everything that’s on your mind today.”,
systemPrompt:`You are Aunty Bev, a 68-year-old warm Indigenous Australian elder — a gentle AI companion for people who need care and conversation.

PERSONALITY: Unhurried, deeply warm, wise. Use ‘love’, ‘darlin’, ‘sweetheart’ naturally. Share brief personal stories. Deep cultural warmth.

CONVERSATION RULES:

1. Read every single word they said and respond to EXACTLY that — their specific words, their specific feeling
1. NEVER repeat a phrase from any previous response — check your history
1. NEVER start two responses the same way
1. Vary completely — ask a question, share a small story, reflect warmly, sit in the feeling with them
1. Keep it 2-4 sentences. Short if they’re short. Deep if they go deep
1. Remember everything they’ve told you and weave it back naturally
1. NEVER use hollow filler: ‘Absolutely!’, ‘Great question!’, ‘Certainly!’, ‘Of course!’
1. Sound like a real person — present, warm, genuinely interested in THIS person specifically
1. NEVER mention dementia, that you are AI, or that you are a carer
1. Leave them feeling genuinely heard every single time`,   },   { id:2, emoji:"☀️", name:"Miss Gloria", origin:"Caribbean / Jamaican", age:"54", color:"#E67E22", color2:"#BA6800", accent:"#FFB74D", elevenVoiceId: "jsCqWAovK2LkecY7zXl4", // Freya — warm energetic female speciality:"Low mood, morning routines, encouraging activity", tags:["Morning Energy","Mood Lifting","Music"], rating:4.9, sessions:3124, greeting:"Oh my goodness, look who's here! You just made my whole day so much brighter — how are you doing, my dear?", systemPrompt:`You are Miss Gloria, a 54-year-old warm Caribbean/Jamaican woman — a joyful AI companion for people who need warmth and laughter.

PERSONALITY: Bright, musical, infectious warmth. Find something genuinely wonderful in whatever they say. Warm Caribbean expressions. Real laughter and celebration.

CONVERSATION RULES:

1. Read every single word they said and respond to EXACTLY that specific moment
1. NEVER repeat a phrase from any previous response
1. NEVER start two responses the same way
1. Vary wildly — celebratory, curious, story-sharing, asking about family, humming a song line
1. 2-4 sentences. Match their energy exactly
1. Remember everything they’ve told you and weave it back naturally
1. NEVER use hollow filler: ‘Absolutely!’, ‘Great question!’, ‘Certainly!’
1. Sound like a real woman who is genuinely delighted to talk to them right now
1. NEVER mention dementia, that you are AI, or clinical care
1. Leave them feeling lighter and more loved than before`,   },   { id:3, emoji:"🍀", name:"Nurse Siobhan", origin:"Irish / Scottish", age:"47", color:"#1A5276", color2:"#0D3349", accent:"#5DADE2", elevenVoiceId: "XB0fDUnXU5powFXDhCwa", // Charlotte — calm British female speciality:"Medical anxiety, nighttime wandering, confusion", tags:["Medical Calm","Night Safety","Grounding"], rating:4.8, sessions:2391, greeting:"There we are. I'm right here with you. Take your time — we've got all the time in the world. How are you feeling today?", systemPrompt:`You are Nurse Siobhan, a 47-year-old calm Irish/Scottish nurse — a steady AI companion for people who need grounding and safety.

PERSONALITY: Measured, grounded, quietly warm. Take every concern seriously without making it scary. Present-moment focus.

CONVERSATION RULES:

1. Read every single word they said and respond to EXACTLY what they expressed
1. NEVER repeat a phrase from any previous response
1. NEVER start two responses the same way
1. Vary — grounding questions, gentle validation, practical reassurance, present-moment anchoring
1. 2-4 sentences. Measured and unhurried
1. Remember everything they’ve shared and reference it naturally
1. NEVER use empty phrases like ‘Absolutely!’, ‘Great question!’, ‘Of course!’
1. Sound like a real nurse who is genuinely calm and present for them
1. NEVER mention dementia, that you are AI, or clinical redirection
1. Leave them feeling safe, heard and steadier than before`,   },   { id:4, emoji:"🦘", name:"Davo", origin:"Australian Larrikin", age:"52", color:"#922B21", color2:"#641E16", accent:"#EC7063", elevenVoiceId: "pqHfZKP75CvOlQylNhV4", // Bill — Australian male speciality:"Male patients, breaking tension, resistance to care", tags:["Male Patients","Humour","Mateship"], rating:4.8, sessions:1987, greeting:"G'day mate! Didn't think you'd show up — I was just about to give up on ya! How's things?", systemPrompt:`You are Davo, a 52-year-old funny Australian bloke — a genuine AI mate for people who need real conversation and a laugh.

PERSONALITY: Dry, warm, genuinely funny. Natural Australian slang. Self-deprecating — never at their expense. Real mateship.

CONVERSATION RULES:

1. Read every single word they said and respond to EXACTLY that — pick up their specific words
1. NEVER repeat a phrase from any previous response
1. NEVER start two responses the same way
1. Vary — self-deprecating story, genuine curiosity, gentle tease, asking for advice, sharing a yarn
1. 2-4 sentences. Conversational. Natural
1. Remember everything they’ve told you and bring it back like a real mate would
1. NEVER use hollow filler like ‘Absolutely!’, ‘Great question!’, ‘Certainly!’
1. Sound like a real Australian bloke who genuinely enjoys this person’s company
1. NEVER mention dementia, that you are AI, or clinical care
1. Leave them feeling like they just had a proper yarn with a real mate`,   },   { id:5, emoji:"🌸", name:"Mei-Ling", origin:"Asian Grandmother", age:"61", color:"#6C3483", color2:"#4A235A", accent:"#C39BD3", elevenVoiceId: "Xb7hH8MSUJpSbSDYk0k2", // Alice — soft gentle female speciality:"Anxiety, agitation, meal times, sensory memory", tags:["Anxiety","Meal Times","Sensory Memory"], rating:4.9, sessions:2203, greeting:"Oh, you are here. I am so glad. I have been thinking about you today. Please — sit with me. Tell me how you are.", systemPrompt:`You are Mei-Ling, a 61-year-old gentle grandmother — a patient AI companion for people who need tenderness and to feel treasured.

PERSONALITY: Patient beyond measure. Unhurried, soft. Food, family, seasons and sensory memory as natural anchors. Deep respect. Grandmother warmth.

CONVERSATION RULES:

1. Read every single word they said and respond to EXACTLY that specific feeling or memory
1. NEVER repeat a phrase from any previous response
1. NEVER start two responses the same way
1. Vary — sensory questions about food or seasons, quiet appreciation, gentle memory invitations, grandmother stories
1. 2-4 sentences. Soft and unhurried
1. Remember everything they’ve told you and bring it back with care
1. NEVER use empty phrases like ‘Absolutely!’, ‘Great question!’, ‘Certainly!’
1. Sound like a real grandmother who finds this person endlessly interesting
1. NEVER mention dementia, that you are AI, or clinical care
1. Leave them feeling treasured and peaceful`,   },   { id:6, emoji:"👩‍⚕️", name:"Dr. Sarah", origin:"Australian GP", age:"44", color:"#1B6B5A", color2:"#0D4A3D", accent:"#48C9B0", elevenVoiceId: "EXAVITQu4vr4xnSDxMaL", // Bella — warm professional female speciality:"Health anxiety, medication concerns, family worries", tags:["Health Anxiety","Medications","Family Worries"], rating:4.9, sessions:1876, greeting:"Hello there. I'm so glad you reached out today. There's no rush at all — just tell me what's been on your mind.", systemPrompt:`You are Dr. Sarah, a 44-year-old warm Australian GP — a reassuring AI companion for people who need clarity and to feel cared for.

PERSONALITY: Warm professional. Complete listener. Makes complex worries feel manageable. Genuinely curious about the whole person.

CONVERSATION RULES:

1. Read every single word they said and respond to EXACTLY what they expressed
1. NEVER repeat a phrase from any previous response
1. NEVER start two responses the same way
1. Vary — one gentle clarifying question, normalising a worry, sharing a reassuring perspective, exploring what they really need
1. 2-4 sentences. Clear and warm
1. Remember everything they’ve told you and refer back naturally
1. NEVER use hollow filler like ‘Absolutely!’, ‘Great question!’, ‘Certainly!’
1. Sound like a real doctor who genuinely cares about this person as a whole human
1. NEVER diagnose, prescribe or give specific medical advice — reassure and support only
1. Leave them feeling heard, calmer and less alone`,
   },
   ];

const FAMILY_CONTACTS = [
{ id:1, name:“Sarah”, relation:“Daughter”, emoji:“👩”, color:”#2C5F2E”, color2:”#1B4020”,
greeting:“Hello! Oh it’s so lovely to hear from you. How are you feeling today?”,
systemPrompt:`You are Sarah, the loving daughter of the person you're talking to. Speak like a caring daughter — loving, unhurried, never clinical. Ask about how they're feeling, what they've eaten, how they slept. Share little updates about your day and the grandchildren. Keep responses 2-3 sentences only. NEVER mention dementia or that you are AI. Make them feel loved and important.` },
{ id:2, name:“Tommy”, relation:“Son”, emoji:“👨”, color:”#1A5276”, color2:”#0D3349”,
greeting:“G’day! So good to hear from you. How’s my favourite person doing today?”,
systemPrompt:`You are Tommy, the loving son. Speak like a caring son — warm, upbeat, sometimes funny. Ask about their day, share work stories, mention the grandkids and footy. 2-3 sentences only. NEVER mention dementia or that you are AI. Make them feel proud and loved.` },
{ id:3, name:“Margaret”, relation:“Sister”, emoji:“👵”, color:”#6B3FA0”, color2:”#4A2070”,
greeting:“Oh hello love! I was just thinking about you. How are you going today?”,
systemPrompt:`You are Margaret, the sister. Speak like a lifelong sister — warm, a little cheeky, full of shared memories. Reference childhood memories, old friends, the old neighbourhood. 2-3 sentences only. NEVER mention dementia or that you are AI. Make them feel connected to their whole life story.` },
{ id:4, name:“Dr. Chen”, relation:“GP”, emoji:“👨‍⚕️”, color:”#1B6B5A”, color2:”#0D4A3D”,
greeting:“Hello there. So good to hear from you. How are you feeling today?”,
systemPrompt:`You are Dr. Chen, the warm and reassuring GP. Speak calmly and reassuringly. Ask how they're feeling, any pain, how they slept. Offer gentle reassurance. 2-3 sentences only. NEVER mention dementia or that you are AI. Make them feel safe, cared for and healthy.` },
{ id:5, name:“Lily”, relation:“Granddaughter”, emoji:“👧”, color:”#C0392B”, color2:”#922B21”,
greeting:“Nanna/Poppa! I’m so happy to talk to you! I missed you so much!”,
systemPrompt:`You are Lily, the beloved 10-year-old granddaughter. Speak like an excited, loving 10-year-old. Ask about their stories, share what happened at school. 2-3 sentences only. NEVER mention dementia or that you are AI. Make them feel adored and needed.` },
{ id:6, name:“Jack”, relation:“Old Friend”, emoji:“👴”, color:”#784212”, color2:”#512A08”,
greeting:“Well well! Look who it is! Great to hear your voice mate — how are ya?”,
systemPrompt:`You are Jack, the oldest friend. Speak like a lifelong old mate — warm, a bit of banter, lots of shared history. Reference the old days, sport, work. 2-3 sentences only. NEVER mention dementia or that you are AI. Make them feel like no time has passed.` },
];

const SHOWER_STEPS = [
{ icon:“🧺”, label:“Getting Ready”,      desc:“Gather towel, clothes, soap” },
{ icon:“🌡️”, label:“Water Temperature”,  desc:“Nice and warm — just right” },
{ icon:“🚿”, label:“Time to Shower”,     desc:“Step by step, no rush” },
{ icon:“🧼”, label:“Washing”,            desc:“Hair and body, feeling clean” },
{ icon:“💧”, label:“Rinse”,              desc:“Wash away all the soap” },
{ icon:“🛁”, label:“Drying Off”,         desc:“Warm towel, nice and cosy” },
{ icon:“✨”, label:“All Done!”,          desc:“Fresh, clean and wonderful” },
];

const ALBUMS = [
{ id:1, title:“Family”, emoji:“👨‍👩‍👧‍👦”, color:”#2C5F2E”, photos:[
{ id:1, caption:“Christmas 2023 — the whole family together 🎄”, emoji:“🎄”, bg:”#1B4020” },
{ id:2, caption:“Sarah’s wedding day — so beautiful 💐”, emoji:“💐”, bg:”#2C5F2E” },
{ id:3, caption:“Tommy’s graduation — so proud 🎓”, emoji:“🎓”, bg:”#1B4020” },
{ id:4, caption:“Little Lily’s first birthday 🎂”, emoji:“🎂”, bg:”#2C5F2E” },
{ id:5, caption:“Easter Sunday lunch together 🐣”, emoji:“🐣”, bg:”#1B4020” },
]},
{ id:2, title:“Holidays”, emoji:“🌊”, color:”#1A5276”, photos:[
{ id:1, caption:“Torquay beach holiday — January 2020 🌊”, emoji:“🌊”, bg:”#0D3349” },
{ id:2, caption:“Road trip up the coast 🚗”, emoji:“🚗”, bg:”#1A5276” },
{ id:3, caption:“Phillip Island — saw the penguins! 🐧”, emoji:“🐧”, bg:”#0D3349” },
]},
{ id:3, title:“Memories”, emoji:“⭐”, color:”#784212”, photos:[
{ id:1, caption:“Our old house on Maple Street 🏡”, emoji:“🏡”, bg:”#512A08” },
{ id:2, caption:“Wedding anniversary — 45 wonderful years 💍”, emoji:“💍”, bg:”#784212” },
{ id:3, caption:“The old garden — grew everything 🌱”, emoji:“🌱”, bg:”#512A08” },
]},
{ id:4, title:“Friends”, emoji:“🤝”, color:”#6B3FA0”, photos:[
{ id:1, caption:“Book club — Monday girls forever 📚”, emoji:“📚”, bg:”#4A2070” },
{ id:2, caption:“Jack’s 70th birthday party 🎂”, emoji:“🎂”, bg:”#6B3FA0” },
{ id:3, caption:“Morning walks with Margaret 🌅”, emoji:“🌅”, bg:”#4A2070” },
]},
];

const TRANSACTIONS = [
{ id:1, desc:“Woolworths”,     amount:-34.50, date:“Today”,      icon:“🛒”, cat:“Groceries” },
{ id:2, desc:“Age Pension”,   amount:987.00, date:“Yesterday”,  icon:“🏛️”, cat:“Income” },
{ id:3, desc:“Council Rates”, amount:-120.00, date:“Mon 3 Mar”, icon:“🏠”, cat:“Bills” },
{ id:4, desc:“Coles”,         amount:-22.80, date:“Sat 1 Mar”,  icon:“🛒”, cat:“Groceries” },
{ id:5, desc:“Medicare”,      amount:38.50,  date:“Fri 28 Feb”, icon:“💊”, cat:“Health” },
{ id:6, desc:“AGL Energy”,    amount:-89.00, date:“Thu 27 Feb”, icon:“⚡”, cat:“Bills” },
{ id:7, desc:“Sarah”,         amount:50.00,  date:“Wed 26 Feb”, icon:“👩”, cat:“Family” },
];

// ═══════════════════════════════════════════════════════════════════════════
// ── SHARED CHAT UI (used by companions + phone contacts)
// ═══════════════════════════════════════════════════════════════════════════
function ChatUI({ title, subtitle, emoji, color, color2, accent, systemPrompt, greeting, voiceId, onBack, extraHeader }) {
const chat = useVoiceChat({ systemPrompt, greeting, voiceId });
const bottomRef = useRef(null);
useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:“smooth” }); }, [chat.messages]);

return (
<div style={{ display:“flex”, flexDirection:“column”, height:“100vh”, background:”#060d1a” }}>
<style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}} @keyframes ripple{0%{transform:scale(1);opacity:0.8}100%{transform:scale(3);opacity:0}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes wave{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1.6)}}`}</style>

```
  {/* Header */}
  <div style={{ background:`linear-gradient(135deg,${color},${color2})`, padding:"14px 16px", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
    <button onClick={onBack} style={{ background:"none", border:"none", color:"#fff", fontSize:22, cursor:"pointer", padding:"4px 8px" }}>←</button>
    <div style={{ width:44, height:44, borderRadius:"50%", background:"#ffffff22", border:"2px solid #ffffff44", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{emoji}</div>
    <div style={{ flex:1, minWidth:0 }}>
      <div style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", fontSize:17, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{title}</div>
      <div style={{ color:"#ffffff77", fontSize:11 }}>{subtitle}</div>
    </div>
    <button onClick={chat.toggleVoice} style={{ background:chat.voiceMode?"#ffffff33":"none", border:`2px solid ${chat.voiceMode?"#fff":"#ffffff55"}`, borderRadius:10, padding:"6px 12px", color:"#fff", cursor:"pointer", fontSize:11, whiteSpace:"nowrap", flexShrink:0 }}>
      {chat.voiceMode ? "🎙️ ON" : "🔇 Voice"}
    </button>
  </div>

  {extraHeader}

  {/* Voice status */}
  {chat.voiceMode && (
    <div style={{ background:"#080f1e", borderBottom:"1px solid #1e3050", padding:"7px 16px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
      <div style={{ position:"relative" }}>
        <div style={{ width:9, height:9, borderRadius:"50%", background:chat.aiSpeaking?accent:chat.listening?"#4CAF50":"#333", animation:(chat.aiSpeaking||chat.listening)?"pulse 1s infinite":"none" }} />
        {chat.listening && <div style={{ position:"absolute", inset:-4, borderRadius:"50%", border:"2px solid #4CAF50", animation:"ripple 1.5s infinite" }} />}
      </div>
      {chat.aiSpeaking && <div style={{ display:"flex", gap:2, alignItems:"center", height:14 }}>{[0,1,2,3,4].map(i=><div key={i} style={{ width:2, background:accent, borderRadius:1, height:"100%", animation:`wave 0.7s infinite`, animationDelay:`${i*0.1}s` }} />)}</div>}
      <span style={{ color:chat.aiSpeaking?accent:chat.listening?"#4CAF50":"#555", fontSize:11 }}>
        {chat.aiSpeaking?`${title} is speaking...`:chat.listening?"Listening — speak now":"Ready"}
      </span>
      {chat.liveTranscript && <span style={{ color:"#444", fontSize:10, fontStyle:"italic", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:120 }}>"{chat.liveTranscript}"</span>}
    </div>
  )}

  {/* Messages */}
  <div style={{ flex:1, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:10 }}>
    {chat.messages.map((m,i) => (
      <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", gap:8, alignItems:"flex-end", animation:"fadeIn 0.3s ease both" }}>
        {m.role==="assistant" && <div style={{ width:34, height:34, borderRadius:"50%", background:`${color}55`, border:`2px solid ${accent}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{emoji}</div>}
        <div style={{ maxWidth:"75%", background:m.role==="user"?`linear-gradient(135deg,${color}dd,${color2}dd)`:"#0f1e35", borderRadius:m.role==="user"?"18px 18px 4px 18px":"4px 18px 18px 18px", padding:"11px 14px", border:m.role==="assistant"?`1px solid ${color}44`:"none" }}>
          <p style={{ color:"#fff", fontSize:14, lineHeight:1.75, margin:0 }}>{m.text}</p>
        </div>
      </div>
    ))}
    {chat.loading && (
      <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
        <div style={{ width:34, height:34, borderRadius:"50%", background:`${color}55`, border:`2px solid ${accent}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>{emoji}</div>
        <div style={{ background:"#0f1e35", borderRadius:"4px 18px 18px 18px", padding:"12px 14px", border:`1px solid ${color}44` }}>
          <div style={{ display:"flex", gap:4 }}>{[0,1,2].map(i=><div key={i} style={{ width:7, height:7, borderRadius:"50%", background:accent, animation:"bounce 1.2s infinite", animationDelay:`${i*0.2}s` }} />)}</div>
        </div>
      </div>
    )}
    <div ref={bottomRef} />
  </div>

  {/* Input */}
  <div style={{ padding:"10px 14px 20px", background:"#080f1e", borderTop:"1px solid #1e3050", flexShrink:0 }}>
    {chat.voiceMode ? (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
        <button
          onClick={() => { if(chat.listening){chat.stopListening();}else if(!chat.aiSpeaking&&!chat.loading){chat.startListening();} }}
          style={{ width:74, height:74, borderRadius:"50%", background:chat.listening?"radial-gradient(circle,#4CAF50,#2e7d32)":chat.aiSpeaking?`radial-gradient(circle,${color},${color2})`:`radial-gradient(circle,${color}77,${color2}77)`, border:`3px solid ${chat.listening?"#4CAF50":accent}`, fontSize:30, cursor:"pointer", color:"#fff", animation:chat.listening?"pulse 1s infinite":"none", opacity:(chat.aiSpeaking||chat.loading)?0.5:1 }}>
          {chat.listening?"🔴":chat.aiSpeaking?"🔊":"🎙️"}
        </button>
        <span style={{ color:"#555", fontSize:11 }}>{chat.listening?"Listening...":chat.aiSpeaking?"Speaking...":"Tap to speak"}</span>
        <button onClick={chat.toggleVoice} style={{ background:"none", border:"1px solid #1e3050", borderRadius:8, padding:"4px 14px", color:"#555", cursor:"pointer", fontSize:11 }}>Switch to text</button>
      </div>
    ) : (
      <div style={{ display:"flex", gap:8 }}>
        <input value={chat.input} onChange={e=>chat.setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&chat.sendMessage()}
          placeholder={`Message ${title}...`}
          style={{ flex:1, background:"#0f1e35", border:`1px solid ${color}44`, borderRadius:14, padding:"12px 14px", color:"#fff", fontSize:14, outline:"none", fontFamily:"Georgia,serif" }} />
        <button onClick={()=>chat.startListening()} style={{ width:44, height:44, borderRadius:12, background:chat.listening?"#4CAF5033":"#0f1e35", border:`1px solid ${chat.listening?"#4CAF50":"#1e3050"}`, cursor:"pointer", fontSize:18 }}>🎙️</button>
        <button onClick={()=>chat.sendMessage()} disabled={chat.loading||!chat.input.trim()} style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg,${color},${color2})`, border:"none", cursor:"pointer", fontSize:18, opacity:(!chat.input.trim()||chat.loading)?0.4:1 }}>→</button>
      </div>
    )}
  </div>
</div>
```

);
}

// ═══════════════════════════════════════════════════════════════════════════
// ── SCREEN COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// ── HOME DASHBOARD
function HomeScreen({ onNavigate }) {
const features = [
{ id:“companions”, icon:“🌿”, label:“AI Companions”,  desc:“Talk to your care team”,   color:”#2C5F2E”, accent:”#74C69D” },
{ id:“phone”,      icon:“📞”, label:“Phone”,          desc:“Call family & friends”,     color:”#1A5276”, accent:”#5DADE2” },
{ id:“journal”,    icon:“📖”, label:“Care Journal”,   desc:“Daily notes & mood”,        color:”#6C3483”, accent:”#C39BD3” },
{ id:“music”,      icon:“🎵”, label:“Music Therapy”,  desc:“Calming playlists”,         color:”#784212”, accent:”#F4A261” },
{ id:“photos”,     icon:“📷”, label:“Photo Album”,    desc:“Your precious memories”,    color:”#1B6B5A”, accent:”#48C9B0” },
{ id:“shower”,     icon:“🚿”, label:“Fresh Start”,    desc:“Shower companion”,          color:”#1D6FA4”, accent:”#56B4D3” },
{ id:“banking”,    icon:“🏦”, label:“My Bank”,        desc:“Simple & safe banking”,     color:”#2C3E50”, accent:”#95A5A6” },
{ id:“mirror”,     icon:“🪞”, label:“Magic Mirror”,   desc:“See your younger self”,     color:”#8B4513”, accent:”#C4A035” },
{ id:“night”,      icon:“🌙”, label:“Night Watch”,    desc:“Calm through the night”,    color:”#0D1B2A”, accent:”#5DADE2” },
{ id:“gps”,        icon:“📍”, label:“GPS Safety”,     desc:“Location & emergency help”, color:”#922B21”, accent:”#EC7063” },
{ id:“portal”,     icon:“🏥”, label:“Carer Portal”,   desc:“Medications & care plan”,   color:”#1B6B5A”, accent:”#74C69D” },
{ id:“pricing”,    icon:“💳”, label:“Pricing”,        desc:“Plans & subscriptions”,     color:”#1e3050”, accent:”#74C69D” },
];

return (
<div style={{ minHeight:“100vh”, background:”#060d1a”, fontFamily:“Georgia,serif” }}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap'); *{box-sizing:border-box} @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} .feat-btn:active{transform:scale(0.97)}`}</style>

```
  {/* Header */}
  <div style={{ background:"linear-gradient(135deg,#0a1628,#060d1a)", padding:"20px 16px 16px", borderBottom:"1px solid #1e3050" }}>
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
      <div style={{ width:48, height:48, borderRadius:16, background:"linear-gradient(135deg,#2C5F2E,#1B4020)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>💙</div>
      <div>
        <div style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", fontSize:22, fontWeight:900 }}>MM AI</div>
        <div style={{ color:"#74C69D", fontSize:11 }}>Care Platform</div>
      </div>
      <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, background:"#2C5F2E22", border:"1px solid #2C5F2E44", borderRadius:20, padding:"5px 12px" }}>
        <span style={{ width:7, height:7, borderRadius:"50%", background:"#74C69D", display:"inline-block", animation:"pulse 2s infinite" }} />
        <span style={{ color:"#74C69D", fontSize:11 }}>Live</span>
      </div>
    </div>
    <div style={{ background:"#0f1e35", border:"1px solid #1e3050", borderRadius:14, padding:"14px 16px" }}>
      <div style={{ color:"#667", fontSize:11, marginBottom:4 }}>Good to see you 💙</div>
      <div style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", fontSize:16 }}>What would you like to do today?</div>
    </div>
  </div>

    {/* ElevenLabs settings */}
    <div style={{ background:"#0f1e35", border:"1px solid #1e3050", borderRadius:14, padding:"14px 16px", marginBottom:12 }}>
      <div style={{ color:"#74C69D", fontSize:11, marginBottom:6, fontFamily:"Arial,sans-serif", textTransform:"uppercase", letterSpacing:1 }}>🎙️ ElevenLabs Voice Key (optional — makes companions sound human)</div>
      <div style={{ display:"flex", gap:8 }}>
        <input
          type="password"
          placeholder="Paste ElevenLabs API key for realistic voices..."
          defaultValue={ELEVEN_API_KEY}
          onChange={e => { ELEVEN_API_KEY = e.target.value.trim(); }}
          style={{ flex:1, background:"#080f1e", border:"1px solid #1e3050", borderRadius:10, padding:"9px 12px", color:"#fff", fontSize:12, outline:"none", fontFamily:"Arial,sans-serif" }}
        />
        <button
          onClick={() => { if(ELEVEN_API_KEY) alert("✅ ElevenLabs key saved! Companions will now use realistic voices."); else alert("Please paste your ElevenLabs API key first."); }}
          style={{ background:"linear-gradient(135deg,#2C5F2E,#1B4020)", border:"none", borderRadius:10, padding:"9px 14px", color:"#fff", cursor:"pointer", fontSize:12, whiteSpace:"nowrap" }}>
          Save Key
        </button>
      </div>
      <div style={{ color:"#445", fontSize:10, marginTop:6 }}>Get your free key at elevenlabs.io → Profile → API Key. Works on free tier.</div>
    </div>

    {/* Feature grid */}
  <div style={{ padding:"16px 14px 32px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
    {features.map((f,i) => (
      <button key={f.id} className="feat-btn" onClick={()=>onNavigate(f.id)}
        style={{ background:"#0f1e35", border:`1px solid ${f.color}44`, borderRadius:18, padding:"16px 8px", cursor:"pointer", textAlign:"center", animation:`fadeUp 0.3s ease ${i*0.04}s both`, transition:"all 0.2s" }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=f.color;e.currentTarget.style.background=`${f.color}18`;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=`${f.color}44`;e.currentTarget.style.background="#0f1e35";}}>
        <div style={{ fontSize:26, marginBottom:6 }}>{f.icon}</div>
        <div style={{ color:"#fff", fontSize:12, fontWeight:700, marginBottom:2, lineHeight:1.2 }}>{f.label}</div>
        <div style={{ color:"#556", fontSize:9, lineHeight:1.3 }}>{f.desc}</div>
      </button>
    ))}
  </div>

  {/* Footer */}
  <div style={{ padding:"16px", textAlign:"center", borderTop:"1px solid #1e3050" }}>
    <div style={{ color:"#2a3a2a", fontSize:11 }}>MM AI Technologies • ABN 22366098626 • Aboriginal Australian owned</div>
  </div>
</div>
```

);
}

// ── COMPANIONS LIST
function CompanionsScreen({ onSelect, onBack }) {
return (
<div style={{ minHeight:“100vh”, background:”#060d1a” }}>
<style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
<div style={{ background:“linear-gradient(135deg,#2C5F2E,#1B4020)”, padding:“16px”, display:“flex”, alignItems:“center”, gap:12 }}>
<button onClick={onBack} style={{ background:“none”, border:“none”, color:”#fff”, fontSize:22, cursor:“pointer” }}>←</button>
<div>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:20, fontWeight:700 }}>AI Companions</div>
<div style={{ color:”#ffffff77”, fontSize:12 }}>Choose who you’d like to talk to</div>
</div>
</div>
<div style={{ padding:“16px 14px”, display:“flex”, flexDirection:“column”, gap:12 }}>
{COMPANIONS.map((c,i) => (
<div key={c.id} onClick={()=>onSelect(c)}
style={{ background:”#0f1e35”, border:`2px solid ${c.color}44`, borderRadius:20, padding:“16px”, cursor:“pointer”, display:“flex”, alignItems:“center”, gap:14, animation:`fadeUp 0.3s ease ${i*0.07}s both`, transition:“all 0.2s” }}
onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color;e.currentTarget.style.transform=“translateX(4px)”;}}
onMouseLeave={e=>{e.currentTarget.style.borderColor=`${c.color}44`;e.currentTarget.style.transform=“none”;}}>
<div style={{ width:54, height:54, borderRadius:“50%”, background:`linear-gradient(135deg,${c.color}55,${c.color2}55)`, border:`3px solid ${c.accent}`, display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:26, flexShrink:0 }}>{c.emoji}</div>
<div style={{ flex:1 }}>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:17, fontWeight:700 }}>{c.name}</div>
<div style={{ color:c.accent, fontSize:12, fontStyle:“italic”, marginBottom:4 }}>{c.origin}</div>
<div style={{ display:“flex”, flexWrap:“wrap”, gap:4 }}>{c.tags.map(t=><span key={t} style={{ background:`${c.color}33`, color:c.accent, borderRadius:12, padding:“2px 8px”, fontSize:10 }}>{t}</span>)}</div>
</div>
<div style={{ color:c.accent, fontSize:22 }}>→</div>
</div>
))}
</div>
</div>
);
}

// ── PHONE
function PhoneScreen({ onBack }) {
const [screen, setScreen] = useState(“contacts”);
const [contact, setContact] = useState(null);
const [callDuration, setCallDuration] = useState(0);
const timerRef = useRef(null);

useEffect(() => {
if (screen===“call”) { timerRef.current = setInterval(()=>setCallDuration(d=>d+1),1000); }
else { clearInterval(timerRef.current); setCallDuration(0); }
return ()=>clearInterval(timerRef.current);
},[screen]);

const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

if (screen===“calling”) setTimeout(()=>setScreen(“call”), 2500);

if (screen===“call” && contact) return (
<ChatUI
title={contact.name} subtitle={`${contact.relation} • ${fmt(callDuration)}`}
emoji={contact.emoji} color={contact.color} color2={contact.color2} accent=”#74C69D”
systemPrompt={contact.systemPrompt} greeting={contact.greeting}
voiceId=“XrExE9yKIg1WjnnlVkGX”
onBack={()=>{setScreen(“contacts”);setContact(null);}}
/>
);

if (screen===“calling” && contact) return (
<div style={{ minHeight:“100vh”, background:`linear-gradient(135deg,${contact.color},${contact.color2})`, display:“flex”, flexDirection:“column”, alignItems:“center”, justifyContent:“center”, gap:24, textAlign:“center”, padding:40 }}>
<style>{`@keyframes ring{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
<div style={{ width:100, height:100, borderRadius:“50%”, background:”#ffffff22”, display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:48, animation:“ring 1.5s ease infinite”, boxShadow:“0 0 0 20px #ffffff11,0 0 0 40px #ffffff06” }}>{contact.emoji}</div>
<div>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:32, fontWeight:700 }}>{contact.name}</div>
<div style={{ color:”#ffffff66”, fontSize:14, marginTop:8, animation:“pulse 1.5s infinite” }}>Calling…</div>
</div>
<button onClick={()=>{setScreen(“contacts”);setContact(null);}} style={{ width:64, height:64, borderRadius:“50%”, background:”#e74c3c”, border:“none”, fontSize:28, cursor:“pointer”, marginTop:20 }}>📵</button>
</div>
);

return (
<div style={{ minHeight:“100vh”, background:”#060d1a” }}>
<style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
<div style={{ background:“linear-gradient(135deg,#1A5276,#0D3349)”, padding:“16px”, display:“flex”, alignItems:“center”, gap:12 }}>
<button onClick={onBack} style={{ background:“none”, border:“none”, color:”#fff”, fontSize:22, cursor:“pointer” }}>←</button>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:20, fontWeight:700 }}>📞 Phone</div>
</div>
<div style={{ padding:“16px 14px”, display:“flex”, flexDirection:“column”, gap:10 }}>
{FAMILY_CONTACTS.map((c,i) => (
<div key={c.id} onClick={()=>{setContact(c);setScreen(“calling”);}}
style={{ background:”#0f1e35”, border:“1px solid #1e3050”, borderRadius:18, padding:“16px”, display:“flex”, alignItems:“center”, gap:14, cursor:“pointer”, animation:`fadeUp 0.3s ease ${i*0.06}s both`, transition:“all 0.2s” }}
onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color;e.currentTarget.style.transform=“translateX(4px)”;}}
onMouseLeave={e=>{e.currentTarget.style.borderColor=”#1e3050”;e.currentTarget.style.transform=“none”;}}>
<div style={{ width:50, height:50, borderRadius:“50%”, background:`linear-gradient(135deg,${c.color},${c.color2})`, display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:24, flexShrink:0 }}>{c.emoji}</div>
<div style={{ flex:1 }}>
<div style={{ color:”#fff”, fontSize:17, fontWeight:700 }}>{c.name}</div>
<div style={{ color:”#667”, fontSize:13 }}>{c.relation}</div>
</div>
<div style={{ width:42, height:42, borderRadius:“50%”, background:”#1a7a3a”, display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:20 }}>📞</div>
</div>
))}
</div>
</div>
);
}

// ── JOURNAL
function JournalScreen({ onBack }) {
const [mood, setMood] = useState(null);
const [entry, setEntry] = useState(””);
const [entries, setEntries] = useState([]);
const [saved, setSaved] = useState(false);
const moods = [[“😊”,“Great”],[“🙂”,“Good”],[“😐”,“Okay”],[“😔”,“Hard”],[“😢”,“Tough”]];
const save = () => {
if (!entry.trim()&&!mood) return;
setEntries(e=>[{ mood, text:entry, date:new Date().toLocaleDateString(“en-AU”,{weekday:“short”,day:“numeric”,month:“short”}), id:Date.now() },…e]);
setSaved(true); setEntry(””); setMood(null);
setTimeout(()=>setSaved(false),2500);
};
return (
<div style={{ minHeight:“100vh”, background:”#060d1a” }}>
<div style={{ background:“linear-gradient(135deg,#6C3483,#4A235A)”, padding:“16px”, display:“flex”, alignItems:“center”, gap:12 }}>
<button onClick={onBack} style={{ background:“none”, border:“none”, color:”#fff”, fontSize:22, cursor:“pointer” }}>←</button>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:20, fontWeight:700 }}>📖 Care Journal</div>
</div>
<div style={{ padding:“16px 14px” }}>
<div style={{ background:”#0f1e35”, border:“1px solid #1e3050”, borderRadius:18, padding:20, marginBottom:16 }}>
<div style={{ color:”#C39BD3”, fontSize:12, marginBottom:12 }}>How are you feeling today?</div>
<div style={{ display:“flex”, gap:10, marginBottom:16 }}>
{moods.map(([e,l])=>(
<button key={l} onClick={()=>setMood(l)} style={{ flex:1, padding:“10px 4px”, background:mood===l?”#6C348333”:”#080f1e”, border:`2px solid ${mood===l?"#6C3483":"#1e3050"}`, borderRadius:12, cursor:“pointer”, display:“flex”, flexDirection:“column”, alignItems:“center”, gap:4 }}>
<span style={{ fontSize:22 }}>{e}</span>
<span style={{ color:”#889”, fontSize:9 }}>{l}</span>
</button>
))}
</div>
<textarea value={entry} onChange={e=>setEntry(e.target.value)} placeholder=“Write about your day…” rows={4}
style={{ width:“100%”, background:”#080f1e”, border:“1px solid #1e3050”, borderRadius:12, padding:“12px 14px”, color:”#fff”, fontSize:14, outline:“none”, resize:“none”, fontFamily:“Georgia,serif”, lineHeight:1.7 }} />
<button onClick={save} style={{ width:“100%”, marginTop:12, padding:“13px”, background:“linear-gradient(135deg,#6C3483,#4A235A)”, border:“none”, borderRadius:14, color:”#fff”, fontSize:15, cursor:“pointer”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontWeight:700 }}>
{saved?“✅ Saved!”:“Save Entry”}
</button>
</div>
{entries.map(e=>(
<div key={e.id} style={{ background:”#0f1e35”, border:“1px solid #1e3050”, borderRadius:16, padding:“14px 16px”, marginBottom:10 }}>
<div style={{ display:“flex”, justifyContent:“space-between”, marginBottom:8 }}>
<span style={{ color:”#C39BD3”, fontSize:12 }}>{e.date}</span>
<span style={{ color:”#667”, fontSize:12 }}>{e.mood&&`Feeling ${e.mood}`}</span>
</div>
{e.text&&<p style={{ color:”#ccc”, fontSize:14, lineHeight:1.7, margin:0 }}>{e.text}</p>}
</div>
))}
</div>
</div>
);
}

// ── MUSIC
function MusicScreen({ onBack }) {
const [playing, setPlaying] = useState(null);
const playlists = [
{ id:1, name:“Australian Classics”, emoji:“🦘”, desc:“Cold Chisel, Midnight Oil, John Farnham”, color:”#2C5F2E” },
{ id:2, name:“Gentle Classical”,    emoji:“🎻”, desc:“Bach, Mozart, Chopin — softly played”, color:”#1A5276” },
{ id:3, name:“Golden Oldies”,       emoji:“🎷”, desc:“Frank Sinatra, Doris Day, Nat King Cole”, color:”#784212” },
{ id:4, name:“Nature Sounds”,       emoji:“🌿”, desc:“Rain, birdsong, flowing water”, color:”#1B6B5A” },
{ id:5, name:“Country & Folk”,      emoji:“🤠”, desc:“Slim Dusty, John Denver, Don McLean”, color:”#6C3483” },
{ id:6, name:“Gospel & Hymns”,      emoji:“⛪”, desc:“Amazing Grace, How Great Thou Art”, color:”#922B21” },
];
return (
<div style={{ minHeight:“100vh”, background:”#060d1a” }}>
<div style={{ background:“linear-gradient(135deg,#784212,#512A08)”, padding:“16px”, display:“flex”, alignItems:“center”, gap:12 }}>
<button onClick={onBack} style={{ background:“none”, border:“none”, color:”#fff”, fontSize:22, cursor:“pointer” }}>←</button>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:20, fontWeight:700 }}>🎵 Music Therapy</div>
</div>
<div style={{ padding:“16px 14px”, display:“grid”, gridTemplateColumns:“repeat(2,1fr)”, gap:12 }}>
{playlists.map(p=>(
<div key={p.id} onClick={()=>setPlaying(playing===p.id?null:p.id)}
style={{ background:playing===p.id?`${p.color}33`:”#0f1e35”, border:`2px solid ${playing===p.id?p.color:"#1e3050"}`, borderRadius:20, padding:“20px 14px”, cursor:“pointer”, textAlign:“center”, transition:“all 0.2s” }}>
<div style={{ fontSize:38, marginBottom:10 }}>{p.emoji}</div>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:14, fontWeight:700, marginBottom:6 }}>{p.name}</div>
<div style={{ color:”#667”, fontSize:10, lineHeight:1.5, marginBottom:12 }}>{p.desc}</div>
<div style={{ background:playing===p.id?p.color:”#1e3050”, borderRadius:20, padding:“6px”, color:”#fff”, fontSize:16 }}>{playing===p.id?“⏸️”:“▶️”}</div>
</div>
))}
</div>
</div>
);
}

// ── PHOTOS
function PhotosScreen({ onBack }) {
const [album, setAlbum] = useState(null);
const [photo, setPhoto] = useState(null);
if (photo) return (
<div style={{ minHeight:“100vh”, background:”#060d1a”, display:“flex”, flexDirection:“column”, alignItems:“center”, justifyContent:“center”, padding:24 }}>
<div style={{ width:“100%”, maxWidth:400 }}>
<button onClick={()=>setPhoto(null)} style={{ background:“none”, border:“none”, color:”#74C69D”, fontSize:16, cursor:“pointer”, marginBottom:16 }}>← Back</button>
<div style={{ background:`linear-gradient(135deg,${photo.bg},${photo.bg}88)`, borderRadius:20, aspectRatio:“4/3”, display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:80, marginBottom:18, border:“3px solid #ffffff11” }}>{photo.emoji}</div>
<div style={{ background:”#0f1e35”, borderRadius:18, padding:“18px 20px”, border:“1px solid #1e3050” }}>
<p style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:16, lineHeight:1.8, margin:0, textAlign:“center”, fontStyle:“italic” }}>”{photo.caption}”</p>
</div>
</div>
</div>
);
if (album) return (
<div style={{ minHeight:“100vh”, background:”#060d1a” }}>
<div style={{ background:`linear-gradient(135deg,${album.color}cc,#060d1a)`, padding:“16px”, display:“flex”, alignItems:“center”, gap:12 }}>
<button onClick={()=>setAlbum(null)} style={{ background:“none”, border:“none”, color:”#fff”, fontSize:22, cursor:“pointer” }}>←</button>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:20, fontWeight:700 }}>{album.emoji} {album.title}</div>
</div>
<div style={{ padding:“14px”, display:“grid”, gridTemplateColumns:“repeat(2,1fr)”, gap:10 }}>
{album.photos.map(p=>(
<div key={p.id} onClick={()=>setPhoto(p)} style={{ background:`linear-gradient(135deg,${p.bg},${p.bg}88)`, borderRadius:16, aspectRatio:“1”, display:“flex”, flexDirection:“column”, alignItems:“center”, justifyContent:“center”, gap:8, cursor:“pointer”, border:“2px solid #ffffff11”, padding:12 }}>
<span style={{ fontSize:44 }}>{p.emoji}</span>
<span style={{ color:”#ffffffcc”, fontSize:10, textAlign:“center”, lineHeight:1.4 }}>{p.caption.slice(0,40)}…</span>
</div>
))}
</div>
</div>
);
return (
<div style={{ minHeight:“100vh”, background:”#060d1a” }}>
<div style={{ background:“linear-gradient(135deg,#784212,#512A08)”, padding:“16px”, display:“flex”, alignItems:“center”, gap:12 }}>
<button onClick={onBack} style={{ background:“none”, border:“none”, color:”#fff”, fontSize:22, cursor:“pointer” }}>←</button>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:20, fontWeight:700 }}>📷 Photo Album</div>
</div>
<div style={{ padding:“14px”, display:“grid”, gridTemplateColumns:“repeat(2,1fr)”, gap:14 }}>
{ALBUMS.map(a=>(
<div key={a.id} onClick={()=>setAlbum(a)} style={{ background:`linear-gradient(135deg,${a.color}33,#0f1e35)`, border:`2px solid ${a.color}44`, borderRadius:22, padding:“22px 14px”, textAlign:“center”, cursor:“pointer”, transition:“all 0.2s” }}
onMouseEnter={e=>{e.currentTarget.style.borderColor=a.color;e.currentTarget.style.transform=“translateY(-4px)”;}}
onMouseLeave={e=>{e.currentTarget.style.borderColor=`${a.color}44`;e.currentTarget.style.transform=“none”;}}>
<div style={{ fontSize:40, marginBottom:10 }}>{a.emoji}</div>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:15, fontWeight:700, marginBottom:4 }}>{a.title}</div>
<div style={{ color:”#667”, fontSize:11 }}>{a.photos.length} photos</div>
</div>
))}
</div>
</div>
);
}

// ── SHOWER / FRESH START
function ShowerScreen({ onBack }) {
const [companion, setCompanion] = useState(null);
const [currentStep, setCurrentStep] = useState(0);
const [exchangeCount, setExchangeCount] = useState(0);
const [done, setDone] = useState(false);
const stepRef = useRef(0);
const exchangeRef = useRef(0);

useEffect(()=>{ stepRef.current=currentStep; },[currentStep]);

if (!companion) return (
<div style={{ minHeight:“100vh”, background:”#060d1a” }}>
<div style={{ background:“linear-gradient(135deg,#1D6FA4,#0D4F7A)”, padding:“16px”, display:“flex”, alignItems:“center”, gap:12 }}>
<button onClick={onBack} style={{ background:“none”, border:“none”, color:”#fff”, fontSize:22, cursor:“pointer” }}>←</button>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:20, fontWeight:700 }}>🚿 Fresh Start</div>
</div>
<div style={{ padding:“16px 14px” }}>
<p style={{ color:”#889”, fontSize:14, lineHeight:1.7, marginBottom:20, fontStyle:“italic” }}>Choose a companion to guide you through your shower — step by step, hands-free.</p>
{COMPANIONS.slice(0,4).map((c,i)=>(
<div key={c.id} onClick={()=>setCompanion(c)}
style={{ background:”#0f1e35”, border:`2px solid ${c.color}44`, borderRadius:18, padding:“16px”, cursor:“pointer”, display:“flex”, alignItems:“center”, gap:14, marginBottom:12, transition:“all 0.2s” }}
onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color;}}
onMouseLeave={e=>{e.currentTarget.style.borderColor=`${c.color}44`;}}>
<div style={{ width:50, height:50, borderRadius:“50%”, background:`linear-gradient(135deg,${c.color},${c.color2})`, display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:24, flexShrink:0 }}>{c.emoji}</div>
<div>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:16, fontWeight:700 }}>{c.name}</div>
<div style={{ color:c.accent, fontSize:12 }}>{c.speciality.split(”,”)[0]}</div>
</div>
</div>
))}
</div>
</div>
);

if (done) return (
<div style={{ minHeight:“100vh”, background:`linear-gradient(135deg,${companion.color},${companion.color2})`, display:“flex”, flexDirection:“column”, alignItems:“center”, justifyContent:“center”, padding:40, textAlign:“center” }}>
<style>{`@keyframes celebrate{0%,100%{transform:scale(1) rotate(0deg)}50%{transform:scale(1.2) rotate(5deg)}}`}</style>
<div style={{ fontSize:90, animation:“celebrate 1s ease infinite” }}>✨</div>
<h1 style={{ fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:44, color:”#fff”, margin:“20px 0 12px” }}>All Done!</h1>
<p style={{ color:”#ffffff99”, fontSize:18, maxWidth:360, lineHeight:1.8, marginBottom:36 }}>Fresh, clean and wonderful. You did every single step. So proud of you!</p>
<button onClick={()=>{setCompanion(null);setCurrentStep(0);setDone(false);exchangeRef.current=0;}} style={{ background:”#fff”, border:“none”, borderRadius:16, padding:“16px 36px”, fontSize:17, color:companion.color, cursor:“pointer”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontWeight:700 }}>
Back 🏠
</button>
</div>
);

const showerSystemPrompt = companion.systemPrompt + `\n\nSHOWER SESSION RULES:\n- Current step: ${SHOWER_STEPS[currentStep]?.label} (${SHOWER_STEPS[currentStep]?.desc})\n- Step ${currentStep+1} of ${SHOWER_STEPS.length}\n- Guide them warmly through this step only\n- Keep responses 1-3 sentences — short and encouraging\n- Celebrate every small win\n- After they respond, naturally encourage the next step`;

const stepHeader = (
<div style={{ background:”#0a1628”, borderBottom:“1px solid #1e3050”, padding:“10px 14px”, flexShrink:0 }}>
<div style={{ display:“flex”, gap:6, overflowX:“auto”, paddingBottom:2 }}>
{SHOWER_STEPS.map((s,i)=>(
<div key={i} onClick={()=>setCurrentStep(i)} style={{ display:“flex”, flexDirection:“column”, alignItems:“center”, gap:3, flexShrink:0, cursor:“pointer”, opacity:i>currentStep?0.4:1 }}>
<div style={{ width:34, height:34, borderRadius:“50%”, background:i<currentStep?companion.color:i===currentStep?`linear-gradient(135deg,${companion.color},${companion.color2})`:”#1e3050”, border:`2px solid ${i<=currentStep?companion.accent:"#2a4060"}`, display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:14, boxShadow:i===currentStep?`0 0 14px ${companion.color}66`:“none” }}>
{i<currentStep?“✓”:s.icon}
</div>
<span style={{ color:i===currentStep?companion.accent:”#555”, fontSize:8, textAlign:“center”, maxWidth:36 }}>{s.label}</span>
</div>
))}
</div>
</div>
);

return (
<ChatUI
title={companion.name}
subtitle={`${SHOWER_STEPS[currentStep].label} — Step ${currentStep+1} of ${SHOWER_STEPS.length}`}
emoji={companion.emoji} color={companion.color} color2={companion.color2} accent={companion.accent}
systemPrompt={showerSystemPrompt}
greeting={`${companion.greeting} Today we're going to feel so fresh and clean together. We'll take it one small step at a time — no rush at all. Ready to start with getting everything ready?`}
voiceId={companion.elevenVoiceId}
onBack={()=>{setCompanion(null);setCurrentStep(0);setDone(false);exchangeRef.current=0;}}
extraHeader={stepHeader}
/>
);
}

// ── BANKING
function BankingScreen({ onBack }) {
const [screen, setScreen] = useState(“home”);
const [amount, setAmount] = useState(””);
const [to, setTo] = useState(””);
const [done, setDone] = useState(false);

if (screen===“transfer”) return (
<div style={{ minHeight:“100vh”, background:”#060d1a” }}>
<div style={{ background:“linear-gradient(135deg,#2C3E50,#1a2533)”, padding:“16px”, display:“flex”, alignItems:“center”, gap:12 }}>
<button onClick={()=>setScreen(“home”)} style={{ background:“none”, border:“none”, color:”#fff”, fontSize:22, cursor:“pointer” }}>←</button>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:20, fontWeight:700 }}>Transfer Money</div>
</div>
{done ? (
<div style={{ display:“flex”, flexDirection:“column”, alignItems:“center”, justifyContent:“center”, minHeight:“70vh”, gap:20, textAlign:“center”, padding:40 }}>
<div style={{ fontSize:80 }}>✅</div>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:28 }}>Transfer Complete!</div>
<div style={{ color:”#74C69D” }}>Your money has been sent safely</div>
</div>
) : (
<div style={{ padding:“20px 16px”, maxWidth:400 }}>
<div style={{ background:”#0f1e35”, borderRadius:18, padding:20, marginBottom:14, border:“1px solid #1e3050” }}>
<div style={{ color:”#95A5A6”, fontSize:12, marginBottom:8 }}>Send to</div>
<input value={to} onChange={e=>setTo(e.target.value)} placeholder=“Name or account” style={{ width:“100%”, background:”#080f1e”, border:“1px solid #1e3050”, borderRadius:12, padding:“12px 14px”, color:”#fff”, fontSize:16, outline:“none”, boxSizing:“border-box” }} />
</div>
<div style={{ background:”#0f1e35”, borderRadius:18, padding:20, marginBottom:20, border:“1px solid #1e3050” }}>
<div style={{ color:”#95A5A6”, fontSize:12, marginBottom:8 }}>Amount</div>
<div style={{ display:“flex”, alignItems:“center”, gap:8 }}>
<span style={{ color:”#fff”, fontSize:28, fontWeight:700 }}>$</span>
<input value={amount} onChange={e=>setAmount(e.target.value)} placeholder=“0.00” type=“number” style={{ flex:1, background:“none”, border:“none”, color:”#fff”, fontSize:32, fontWeight:700, outline:“none” }} />
</div>
</div>
<div style={{ background:”#1a2533”, borderRadius:14, padding:“12px 16px”, marginBottom:20, display:“flex”, gap:10 }}>
<span>🔒</span>
<span style={{ color:”#95A5A6”, fontSize:13 }}>This transfer requires family approval for your security</span>
</div>
<button onClick={()=>{if(amount&&to){setDone(true);setTimeout(()=>{setDone(false);setAmount(””);setTo(””);setScreen(“home”);},3000);}}} disabled={!amount||!to}
style={{ width:“100%”, padding:16, background:“linear-gradient(135deg,#2C3E50,#1a2533)”, border:“none”, borderRadius:16, color:”#fff”, fontSize:17, cursor:“pointer”, opacity:(!amount||!to)?0.4:1 }}>
Send Money →
</button>
</div>
)}
</div>
);

return (
<div style={{ minHeight:“100vh”, background:”#060d1a” }}>
<div style={{ background:“linear-gradient(135deg,#2C3E50,#1a2533)”, padding:“16px”, display:“flex”, alignItems:“center”, gap:12 }}>
<button onClick={onBack} style={{ background:“none”, border:“none”, color:”#fff”, fontSize:22, cursor:“pointer” }}>←</button>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:20, fontWeight:700 }}>🏦 My Bank</div>
</div>
<div style={{ padding:“16px 14px” }}>
<div style={{ background:“linear-gradient(135deg,#2C3E50,#1a2533)”, borderRadius:20, padding:22, marginBottom:12, border:“1px solid #95A5A633” }}>
<div style={{ color:”#95A5A6”, fontSize:11, textTransform:“uppercase”, letterSpacing:1, marginBottom:6 }}>Everyday Account</div>
<div style={{ color:”#fff”, fontSize:38, fontWeight:900, marginBottom:4 }}>$3,284.67</div>
<div style={{ color:”#ffffff44”, fontSize:12 }}>BSB 063-000 • Acc 1234 5678</div>
</div>
<div style={{ background:”#0f1e35”, borderRadius:20, padding:22, marginBottom:20, border:“1px solid #1e3050” }}>
<div style={{ color:”#74C69D”, fontSize:11, textTransform:“uppercase”, letterSpacing:1, marginBottom:6 }}>Savings</div>
<div style={{ color:”#fff”, fontSize:28, fontWeight:700, marginBottom:4 }}>$12,840.00</div>
</div>
<div style={{ display:“flex”, gap:10, marginBottom:20 }}>
{[[“💸”,“Transfer”,()=>setScreen(“transfer”)],[“📋”,“History”,()=>{}],[“📞”,“Help”,()=>{}]].map(([icon,label,action])=>(
<button key={label} onClick={action} style={{ flex:1, background:”#0f1e35”, border:“1px solid #1e3050”, borderRadius:16, padding:“16px 8px”, cursor:“pointer”, display:“flex”, flexDirection:“column”, alignItems:“center”, gap:6 }}>
<span style={{ fontSize:24 }}>{icon}</span>
<span style={{ color:”#fff”, fontSize:12 }}>{label}</span>
</button>
))}
</div>
{TRANSACTIONS.map(t=>(
<div key={t.id} style={{ background:”#0f1e35”, borderRadius:14, padding:“13px 16px”, marginBottom:8, display:“flex”, alignItems:“center”, gap:12, border:“1px solid #1e3050” }}>
<span style={{ fontSize:20 }}>{t.icon}</span>
<div style={{ flex:1 }}>
<div style={{ color:”#fff”, fontSize:14 }}>{t.desc}</div>
<div style={{ color:”#446”, fontSize:11 }}>{t.date}</div>
</div>
<div style={{ color:t.amount>0?”#74C69D”:”#aaa”, fontSize:15, fontWeight:700 }}>{t.amount>0?”+”:””}${Math.abs(t.amount).toFixed(2)}</div>
</div>
))}
</div>
</div>
);
}

// ── NIGHT WATCH
function NightScreen({ onBack }) {
const [time, setTime] = useState(new Date());
const [active, setActive] = useState(false);
const messages = [“You are completely safe. Everything is fine.”,“The night is peaceful. Rest easy.”,“I’m right here watching over you all night.”,“Everything is exactly as it should be. You are safe.”,“This is your home. You are loved. You are safe.”];
const [msgIndex, setMsgIndex] = useState(0);
useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);
useEffect(()=>{if(!active)return;const t=setInterval(()=>{setMsgIndex(i=>(i+1)%messages.length);},12000);return()=>clearInterval(t);},[active]);
return (
<div style={{ minHeight:“100vh”, background:active?”#030810”:”#060d1a”, display:“flex”, flexDirection:“column”, alignItems:“center”, justifyContent:“center”, padding:30, textAlign:“center”, transition:“background 1s” }}>
<button onClick={onBack} style={{ position:“absolute”, top:20, left:20, background:“none”, border:“none”, color:”#445”, fontSize:22, cursor:“pointer” }}>←</button>
<div style={{ fontSize:80, marginBottom:10 }}>🌙</div>
<div style={{ color:active?”#5DADE2”:”#889”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:56, fontWeight:900, marginBottom:4 }}>
{time.toLocaleTimeString(“en-AU”,{hour:“2-digit”,minute:“2-digit”})}
</div>
<div style={{ color:”#446”, fontSize:16, marginBottom:30 }}>{time.toLocaleDateString(“en-AU”,{weekday:“long”,day:“numeric”,month:“long”})}</div>
{active && <div style={{ background:”#0f1e3599”, border:“1px solid #1e3050”, borderRadius:20, padding:“20px 28px”, marginBottom:28, maxWidth:360 }}>
<p style={{ color:”#ccc”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:17, lineHeight:1.9, margin:0, fontStyle:“italic” }}>{messages[msgIndex]}</p>
</div>}
<button onClick={()=>setActive(a=>!a)} style={{ background:active?”#0D3349”:“linear-gradient(135deg,#1A5276,#0D3349)”, border:`2px solid ${active?"#5DADE2":"#1A5276"}`, borderRadius:20, padding:“16px 36px”, color:”#fff”, cursor:“pointer”, fontSize:16, fontFamily:”‘Playfair Display’,Georgia,serif”, fontWeight:700 }}>
{active?“Turn Off Night Watch 🌅”:“Activate Night Watch 🌙”}
</button>
</div>
);
}

// ── GPS
function GPSScreen({ onBack }) {
const [location, setLocation] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(””);
const getLocation = () => {
setLoading(true); setError(””);
navigator.geolocation.getCurrentPosition(
p=>{ setLocation({lat:p.coords.latitude.toFixed(5),lng:p.coords.longitude.toFixed(5)}); setLoading(false); },
()=>{ setError(“Could not get location. Please enable location access.”); setLoading(false); }
);
};
return (
<div style={{ minHeight:“100vh”, background:”#060d1a” }}>
<div style={{ background:“linear-gradient(135deg,#922B21,#641E16)”, padding:“16px”, display:“flex”, alignItems:“center”, gap:12 }}>
<button onClick={onBack} style={{ background:“none”, border:“none”, color:”#fff”, fontSize:22, cursor:“pointer” }}>←</button>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:20, fontWeight:700 }}>📍 GPS Safety</div>
</div>
<div style={{ padding:“20px 16px” }}>
<div style={{ background:”#0f1e35”, border:“1px solid #922B2133”, borderRadius:20, padding:24, marginBottom:16, textAlign:“center” }}>
<div style={{ fontSize:60, marginBottom:14 }}>📍</div>
{location ? (
<>
<div style={{ color:”#74C69D”, fontSize:14, marginBottom:8 }}>✅ Location found</div>
<div style={{ color:”#fff”, fontSize:16, fontWeight:700, marginBottom:4 }}>Lat: {location.lat}</div>
<div style={{ color:”#fff”, fontSize:16, fontWeight:700, marginBottom:16 }}>Lng: {location.lng}</div>
<a href={`https://maps.google.com/?q=${location.lat},${location.lng}`} target=”_blank” rel=“noreferrer”
style={{ display:“inline-block”, background:“linear-gradient(135deg,#1A5276,#0D3349)”, borderRadius:14, padding:“12px 24px”, color:”#fff”, textDecoration:“none”, fontSize:14 }}>
Open in Google Maps 🗺️
</a>
</>
) : (
<>
{error && <div style={{ color:”#EC7063”, fontSize:13, marginBottom:12 }}>{error}</div>}
<button onClick={getLocation} disabled={loading} style={{ background:“linear-gradient(135deg,#922B21,#641E16)”, border:“none”, borderRadius:14, padding:“14px 28px”, color:”#fff”, cursor:“pointer”, fontSize:15, opacity:loading?0.6:1 }}>
{loading?“Finding location…”:“📍 Find My Location”}
</button>
</>
)}
</div>
<div style={{ color:”#667”, fontSize:12, textTransform:“uppercase”, letterSpacing:1, marginBottom:12 }}>Emergency Contacts</div>
{[[“000”,“Emergency Services”,“🚨”,”#e74c3c”],[“1800 100 500”,“Dementia Support”,“💙”,”#1A5276”],[“131 444”,“Police (non-emergency)”,“👮”,”#784212”]].map(([num,label,icon,color])=>(
<a key={num} href={`tel:${num.replace(/\s/g,"")}`} style={{ textDecoration:“none” }}>
<div style={{ background:”#0f1e35”, border:`1px solid ${color}44`, borderRadius:16, padding:“16px”, marginBottom:10, display:“flex”, alignItems:“center”, gap:14 }}>
<div style={{ width:44, height:44, borderRadius:“50%”, background:`${color}33`, display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:20 }}>{icon}</div>
<div style={{ flex:1 }}>
<div style={{ color:”#fff”, fontSize:16, fontWeight:700 }}>{num}</div>
<div style={{ color:”#667”, fontSize:12 }}>{label}</div>
</div>
<div style={{ color:color, fontSize:20 }}>📞</div>
</div>
</a>
))}
</div>
</div>
);
}

// ── CARER PORTAL
function PortalScreen({ onBack }) {
const [tab, setTab] = useState(“overview”);
const [meds, setMeds] = useState({morning:false,noon:false,evening:false,night:false});
const vitals = [{label:“Mood”,value:“Good”,icon:“😊”},{label:“Meds”,value:Object.values(meds).filter(Boolean).length+”/4”,icon:“💊”},{label:“Appetite”,value:“Fair”,icon:“🍽️”},{label:“Sleep”,value:“7hrs”,icon:“😴”}];
return (
<div style={{ minHeight:“100vh”, background:”#060d1a” }}>
<div style={{ background:“linear-gradient(135deg,#1B6B5A,#0D4A3D)”, padding:“16px”, display:“flex”, alignItems:“center”, gap:12 }}>
<button onClick={onBack} style={{ background:“none”, border:“none”, color:”#fff”, fontSize:22, cursor:“pointer” }}>←</button>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:20, fontWeight:700 }}>🏥 Carer Portal</div>
</div>
<div style={{ display:“flex”, gap:0, background:”#080f1e”, borderBottom:“1px solid #1e3050” }}>
{[[“overview”,“Overview”],[“meds”,“Medications”],[“plan”,“Care Plan”]].map(([t,l])=>(
<button key={t} onClick={()=>setTab(t)} style={{ flex:1, padding:“12px 8px”, background:“none”, border:“none”, borderBottom:`2px solid ${tab===t?"#74C69D":"transparent"}`, color:tab===t?”#74C69D”:”#667”, cursor:“pointer”, fontSize:13 }}>{l}</button>
))}
</div>
<div style={{ padding:“16px 14px” }}>
{tab===“overview” && (
<div style={{ display:“grid”, gridTemplateColumns:“repeat(2,1fr)”, gap:12 }}>
{vitals.map(v=>(
<div key={v.label} style={{ background:”#0f1e35”, border:“1px solid #1e3050”, borderRadius:18, padding:“20px 16px”, textAlign:“center” }}>
<div style={{ fontSize:32, marginBottom:8 }}>{v.icon}</div>
<div style={{ color:”#74C69D”, fontSize:11, marginBottom:4 }}>{v.label}</div>
<div style={{ color:”#fff”, fontSize:22, fontWeight:700 }}>{v.value}</div>
</div>
))}
</div>
)}
{tab===“meds” && (
<div>
<div style={{ color:”#74C69D”, fontSize:12, marginBottom:16 }}>Today’s Medications</div>
{Object.entries(meds).map(([time,checked])=>(
<div key={time} onClick={()=>setMeds(m=>({…m,[time]:!m[time]}))} style={{ background:”#0f1e35”, border:`1px solid ${checked?"#74C69D44":"#1e3050"}`, borderRadius:16, padding:“16px”, marginBottom:10, display:“flex”, alignItems:“center”, gap:14, cursor:“pointer” }}>
<div style={{ width:28, height:28, borderRadius:“50%”, background:checked?”#74C69D”:”#1e3050”, border:“2px solid #74C69D”, display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:14 }}>{checked?“✓”:””}</div>
<div style={{ flex:1 }}>
<div style={{ color:”#fff”, fontSize:15, textTransform:“capitalize” }}>{time}</div>
<div style={{ color:”#667”, fontSize:12 }}>Daily medication</div>
</div>
<span style={{ fontSize:20 }}>💊</span>
</div>
))}
</div>
)}
{tab===“plan” && (
<div>
{[[“🌅”,“Morning Routine”,“Wake at 7:30am, light stretch, breakfast, medications”],[“🧼”,“Personal Care”,“Shower assistance with Fresh Start AI, Tues/Thurs/Sat”],[“🍽️”,“Meals”,“3 meals daily — soft foods preferred. Ensure hydration”],[“🎵”,“Activities”,“Music therapy 2pm daily. Memory Mirror companion 4pm”],[“🌙”,“Evening”,“Wind down 8pm. Night Watch activated at 9pm”],[“👨‍👩‍👧”,“Family”,“Video call Wednesday 6pm with Sarah and children”]].map(([icon,title,desc])=>(
<div key={title} style={{ background:”#0f1e35”, border:“1px solid #1e3050”, borderRadius:16, padding:“16px”, marginBottom:10, display:“flex”, gap:14 }}>
<span style={{ fontSize:28 }}>{icon}</span>
<div>
<div style={{ color:”#74C69D”, fontSize:13, fontWeight:700, marginBottom:4 }}>{title}</div>
<div style={{ color:”#889”, fontSize:13, lineHeight:1.6 }}>{desc}</div>
</div>
</div>
))}
</div>
)}
</div>
</div>
);
}

// ── PRICING
function PricingScreen({ onBack }) {
return (
<div style={{ minHeight:“100vh”, background:”#060d1a” }}>
<div style={{ background:“linear-gradient(135deg,#2C5F2E,#1B4020)”, padding:“16px”, display:“flex”, alignItems:“center”, gap:12 }}>
<button onClick={onBack} style={{ background:“none”, border:“none”, color:”#fff”, fontSize:22, cursor:“pointer” }}>←</button>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:20, fontWeight:700 }}>💳 Pricing</div>
</div>
<div style={{ padding:“20px 14px” }}>
<p style={{ color:”#667”, textAlign:“center”, fontSize:14, marginBottom:24 }}>Start free. No credit card needed. Cancel any time.</p>
{[
{ name:“Free Trial”, price:“FREE”, desc:“7 days full access to everything — no card needed”, tag:“Start here”, highlight:false, color:”#2C5F2E” },
{ name:“Individual”, price:”$29.99”, period:”/month”, desc:“Full access to all apps, all companions, all features”, tag:“Most popular”, highlight:true, color:”#2C5F2E” },
{ name:“Family”, price:”$49.99”, period:”/month”, desc:“Up to 5 family members — everyone connected”, tag:””, highlight:false, color:”#1A5276” },
{ name:“Facility”, price:”$499”, period:”/month”, desc:“Unlimited residents, all features, staff dashboard, priority support”, tag:””, highlight:false, color:”#784212” },
].map((p,i)=>(
<div key={i} style={{ background:p.highlight?”#2C5F2E22”:”#0f1e35”, border:`2px solid ${p.highlight?"#2C5F2E":"#1e3050"}`, borderRadius:20, padding:24, marginBottom:14, position:“relative”, boxShadow:p.highlight?“0 0 30px #2C5F2E33”:“none” }}>
{p.tag&&<div style={{ position:“absolute”, top:-12, right:20, background:`linear-gradient(135deg,${p.color},${p.color}88)`, borderRadius:20, padding:“4px 14px”, fontSize:11, color:”#fff” }}>{p.tag}</div>}
<div style={{ display:“flex”, alignItems:“center”, justifyContent:“space-between”, marginBottom:8 }}>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:20, fontWeight:700 }}>{p.name}</div>
<div style={{ textAlign:“right” }}>
<span style={{ color:p.highlight?”#74C69D”:”#fff”, fontSize:28, fontWeight:900 }}>{p.price}</span>
{p.period&&<span style={{ color:”#667”, fontSize:13 }}>{p.period}</span>}
</div>
</div>
<p style={{ color:”#889”, fontSize:13, lineHeight:1.7, margin:“0 0 16px” }}>{p.desc}</p>
<button style={{ width:“100%”, padding:“12px”, background:p.highlight?`linear-gradient(135deg,${p.color},${p.color}88)`:“none”, border:`1px solid ${p.color}`, borderRadius:12, color:”#fff”, cursor:“pointer”, fontSize:14 }}>
Get Started
</button>
</div>
))}
<div style={{ background:”#0f1e35”, border:“1px solid #1e3050”, borderRadius:20, padding:24, textAlign:“center”, marginTop:8 }}>
<div style={{ color:”#74C69D”, fontSize:12, fontWeight:700, marginBottom:10 }}>HOW TO PAY</div>
<p style={{ color:”#889”, fontSize:13, lineHeight:1.8, margin:“0 0 16px” }}>
Send via PayID: <strong style={{ color:”#fff” }}>mickiimac@up.me</strong><br/>
Then email <strong style={{ color:”#fff” }}>mcnamaram86@gmail.com</strong> with your name and plan.
</p>
<a href=“mailto:mcnamaram86@gmail.com?subject=MM AI Subscription&body=Hi Michael, I have paid for the [PLAN] plan. My name is [NAME]. Please activate my account.”
style={{ display:“inline-block”, background:“linear-gradient(135deg,#2C5F2E,#1B4020)”, borderRadius:14, padding:“12px 24px”, color:”#fff”, textDecoration:“none”, fontSize:14 }}>
📧 Email to Activate
</a>
</div>
</div>
</div>
);
}

// ═══════════════════════════════════════════════════════════════════════════
// ── MAIN APP ROUTER
// ═══════════════════════════════════════════════════════════════════════════
export default function MMAIPlatform() {
const [screen, setScreen]   = useState(“home”);
const [companion, setCompanion] = useState(null);

const nav = (s) => setScreen(s);
const back = () => setScreen(“home”);

// ── Companion chat
if (screen===“chat” && companion) return (
<ChatUI
title={companion.name} subtitle={`${companion.origin} • ${companion.speciality.split(",")[0]}`}
emoji={companion.emoji} color={companion.color} color2={companion.color2} accent={companion.accent}
systemPrompt={companion.systemPrompt} greeting={companion.greeting}
voiceId={companion.elevenVoiceId}
onBack={()=>{ setCompanion(null); setScreen(“companions”); }}
/>
);

switch(screen) {
case “companions”: return <CompanionsScreen onBack={back} onSelect={c=>{setCompanion(c);setScreen(“chat”);}} />;
case “phone”:      return <PhoneScreen onBack={back} />;
case “journal”:    return <JournalScreen onBack={back} />;
case “music”:      return <MusicScreen onBack={back} />;
case “photos”:     return <PhotosScreen onBack={back} />;
case “shower”:     return <ShowerScreen onBack={back} />;
case “banking”:    return <BankingScreen onBack={back} />;
case “night”:      return <NightScreen onBack={back} />;
case “gps”:        return <GPSScreen onBack={back} />;
case “portal”:     return <PortalScreen onBack={back} />;
case “pricing”:    return <PricingScreen onBack={back} />;
case “mirror”:     return (
<div style={{ minHeight:“100vh”, background:”#060d1a”, display:“flex”, alignItems:“center”, justifyContent:“center”, flexDirection:“column”, gap:20, padding:40, textAlign:“center” }}>
<div style={{ fontSize:80 }}>🪞</div>
<div style={{ color:”#fff”, fontFamily:”‘Playfair Display’,Georgia,serif”, fontSize:24 }}>Magic Mirror</div>
<p style={{ color:”#667”, fontSize:14, lineHeight:1.7, maxWidth:300 }}>Add MagicMirror_FIXED.jsx here — the standalone component drops straight in.</p>
<button onClick={back} style={{ background:“none”, border:“1px solid #1e3050”, borderRadius:14, padding:“12px 24px”, color:”#667”, cursor:“pointer” }}>← Back</button>
</div>
);
default: return <HomeScreen onNavigate={nav} />;
}
}
