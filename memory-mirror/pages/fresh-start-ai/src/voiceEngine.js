// --- GLOBAL VOICE ENGINE (Copilot/Claude style) ---

let voiceReady = false;
let selectedVoice = null;
let isSpeaking = false;

// Load voices once
export function initVoice() {
  return new Promise(resolve => {
    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        setTimeout(load, 100);
        return;
      }

      // Lock to a female voice
      selectedVoice =
        voices.find(v => /female|samantha|karen|moira|fiona|victoria/i.test(v.name)) ||
        voices.find(v => v.lang.startsWith("en")) ||
        voices[0];

      voiceReady = true;
      resolve();
    };

    load();
  });
}

// Speak once per message
export async function speak(text) {
  if (!voiceReady) await initVoice();
  if (isSpeaking) return;

  isSpeaking = true;

  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = selectedVoice;
  utter.rate = 0.95;
  utter.pitch = 1.05;

  utter.onend = () => {
    isSpeaking = false;
  };

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}
