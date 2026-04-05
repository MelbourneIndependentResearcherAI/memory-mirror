// voiceEngine.js — ElevenLabs primary, browser speechSynthesis fallback
// No loops, no auto-restart, no auto-play.

let ELEVEN_API_KEY = "";

export function setElevenLabsKey(key) { ELEVEN_API_KEY = key.trim(); }
export function getElevenLabsKey()    { return ELEVEN_API_KEY; }

// ─── Browser speech fallback ──────────────────────────────────────────────────
export function browserSpeak(text, onEnd) {
  if (!window.speechSynthesis) { onEnd?.(); return; }
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate   = 0.88;
  utt.pitch  = 1.05;
  utt.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const pick =
    voices.find(v => /samantha|karen|moira|fiona|victoria/i.test(v.name)) ||
    voices.find(v => v.lang?.startsWith("en")) ||
    voices[0];
  if (pick) utt.voice = pick;
  utt.onend   = () => onEnd?.();
  utt.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utt);
}

// ─── ElevenLabs primary ───────────────────────────────────────────────────────
export async function speakWithElevenLabs(text, voiceId = "EXAVITQu4vr4xnSDxMaL", onEnd, audioRef) {
  if (!ELEVEN_API_KEY) { browserSpeak(text, onEnd); return; }
  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: { "xi-api-key": ELEVEN_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.82, style: 0.2, use_speaker_boost: true }
      })
    });
    if (!res.ok) { browserSpeak(text, onEnd); return; }
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    if (audioRef?.current) { audioRef.current.pause(); URL.revokeObjectURL(audioRef.current.src); }
    const audio = new Audio(url);
    if (audioRef) audioRef.current = audio;
    audio.onended = () => { URL.revokeObjectURL(url); onEnd?.(); };
    audio.onerror = () => { URL.revokeObjectURL(url); onEnd?.(); };
    audio.play();
  } catch {
    browserSpeak(text, onEnd);
  }
}

// ─── Convenience: speak with auto fallback ────────────────────────────────────
export function speak(text, voiceId, onEnd, audioRef) {
  speakWithElevenLabs(text, voiceId, onEnd, audioRef);
}

// ─── Mic helper ───────────────────────────────────────────────────────────────
export function startListening({ onResult, onEnd, onError, lang = "en-AU" }) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { onError?.("not-supported"); return null; }
  const recog = new SR();
  recog.lang = lang;
  recog.interimResults = false;
  recog.onresult = (e) => { const t = e.results[0]?.[0]?.transcript; if (t) onResult?.(t); };
  recog.onend    = () => onEnd?.();
  recog.onerror  = (e) => { onError?.(e.error); onEnd?.(); };
  recog.start();
  return recog;
}
