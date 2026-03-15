Fix AI companion voice matching and API message alternation bugs
- memory-mirror: Fix sendMessage() to skip leading assistant messages
  and ensure strict user/assistant alternation before sending to
  Anthropic API. The initial greeting was being included as the first
  message (role: 'assistant') causing API errors on first user message.

- fresh-start-ai: Fix voice loading race condition in speak() — add
  onvoiceschanged handler and VOICE_LOADING_TIMEOUT_MS fallback so
  voices are always available before speaking (Chrome/Firefox fix).

- fresh-start-ai: Add per-companion voice profiles so each AI
  companion has a distinct voice character:
    • Aunty Bev  — Karen/Samantha en-AU, rate 0.85, pitch 1.05
    • Miss Gloria — Tessa/Nicky  en-GB, rate 0.95, pitch 1.20
    • Nurse Siobhan — Moira/Fiona en-IE, rate 0.82, pitch 0.95
    • Mei-Ling   — Ava/Allison  en,   rate 0.80, pitch 1.10

- fresh-start-ai: Add pickVoiceForCompanion() with 4-tier fallback,
  FEMALE_VOICE_RE / MALE_VOICE_RE patterns (ported from memory-mirror),
  DEFAULT_VOICE_PROFILE, and JSDoc for voiceProfile shape.

- All speak() calls in SessionScreen now pass companion.voice.

Co-authored-by: MelbourneIndependentResearcherAI <234060016+MelbourneIndependentResearcherAI@users.noreply.github.com>
main(#44)
1 parent 
c6ce774
 commit 
daa5df3
2 files changed

 
‎apps/fresh-start-ai/src/App.jsx‎
Original file line number	Diff line number	Diff line change
@@ -1,9 +1,32 @@
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
@@ -26,6 +49,8 @@ RULES:
  {
    id: 2, emoji: "☀️", name: "Miss Gloria", style: "Cheerful & Musical",
    color: "#E07A2F", color2: "#B85C10", accent: "#F4A261",
    // Cheerful Caribbean woman — upbeat, bright, higher pitch and faster pace
    voice: { nameRE: /tessa|nicky|victoria|ava|allison|karen|samantha/i, langRE: /en-GB|en_GB/i, rate: 0.95, pitch: 1.20 },
    greeting: "Good morning sunshine! Oh we are going to feel SO amazing today — a beautiful fresh shower and you are going to shine! Ready? Let's go!",
    systemPrompt: `You are Miss Gloria, a cheerful Caribbean woman helping someone with dementia through their shower routine.
@@ -47,6 +72,8 @@ RULES:
  {
    id: 3, emoji: "🍀", name: "Nurse Siobhan", style: "Calm & Reassuring",
    color: "#1D6FA4", color2: "#0D4F7A", accent: "#56B4D3",
    // Calm Irish nurse — measured, steady authority, slightly lower pitch
    voice: { nameRE: /moira|fiona|victoria|karen|samantha/i, langRE: /en-IE|en_IE|en-GB|en_GB/i, rate: 0.82, pitch: 0.95 },
    greeting: "There we are. I'm right here with you. We're going to take this nice and easy, one small step at a time. You're completely safe.",
    systemPrompt: `You are Nurse Siobhan, a calm Irish nurse helping someone with dementia through their shower routine.
@@ -68,6 +95,8 @@ RULES:
  {
    id: 4, emoji: "🌸", name: "Mei-Ling", style: "Peaceful & Sensory",
    color: "#7B4F9E", color2: "#553080", accent: "#C084D4",
    // Gentle Asian grandmother — very soft, slow, peaceful
    voice: { nameRE: /ava|allison|samantha|karen|moira/i, langRE: /en/i, rate: 0.80, pitch: 1.10 },
    greeting: "Hello dear one. Today we make you feel like royalty. Beautiful warm water, lovely soap... like a spa just for you. Come, let us begin slowly.",
    systemPrompt: `You are Mei-Ling, a gentle Asian grandmother helping someone with dementia through their shower routine.
@@ -98,18 +127,57 @@ const STEPS = [
  { id: 7, icon: "✨", label: "All Done!", desc: "Fresh, clean and wonderful" },
];

function speak(text, onEnd, rate=0.88) {
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
  utt.rate = rate; utt.pitch = 1.05; utt.volume = 1;
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
  const pick = voices.find(v => /samantha|karen|moira|fiona|victoria/i.test(v.name))
    || voices.find(v => v.lang.startsWith("en")) || voices[0];
  if (pick) utt.voice = pick;
  utt.onend = () => onEnd?.();
  utt.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utt);
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
@@ -202,7 +270,7 @@ function SessionScreen({ companion, onBack, onComplete }) {

      if (voiceRef.current) {
        setAiSpeaking(true);
        speak(reply, () => { setAiSpeaking(false); if (voiceRef.current) setTimeout(() => startListening(), 500); });
        speak(reply, () => { setAiSpeaking(false); if (voiceRef.current) setTimeout(() => startListening(), 500); }, companion.voice);
      }
    } catch {
      const fallback = "You're doing beautifully. Take your time.";
@@ -211,7 +279,7 @@ function SessionScreen({ companion, onBack, onComplete }) {
      loadingRef.current = false;
      setMessages(withFallback);
      setLoading(false);
      if (voiceRef.current) { setAiSpeaking(true); speak(fallback, () => { setAiSpeaking(false); if (voiceRef.current) startListening(); }); }
      if (voiceRef.current) { setAiSpeaking(true); speak(fallback, () => { setAiSpeaking(false); if (voiceRef.current) startListening(); }, companion.voice); }
    }
  };

@@ -223,7 +291,7 @@ function SessionScreen({ companion, onBack, onComplete }) {
    } else {
      setVoiceMode(true); voiceRef.current = true;
      setAiSpeaking(true);
      speak(companion.greeting, () => { setAiSpeaking(false); setTimeout(() => startListening(), 400); });
      speak(companion.greeting, () => { setAiSpeaking(false); setTimeout(() => startListening(), 400); }, companion.voice);
    }
  };

‎memory-mirror/src/App.jsx‎
Original file line number	Diff line number	Diff line change
@@ -193,7 +193,13 @@ function ChatScreen({ onBack }) {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: SYSTEM_PROMPT,
          messages: newHistory.map(m => ({ role: m.role, content: m.text })),
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
