let isSpeaking = false;
let selectedVoice = null;
let voiceReady = false;

// female (default) or male
let voiceProfile = "female";

export function setVoiceProfile(profile) {
  voiceProfile = profile;
  voiceReady = false; // force reload next time speak() is called
}

export function initVoice() {
  return new Promise(resolve => {
    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return setTimeout(load, 100);

      if (voiceProfile === "female") {
        selectedVoice =
          voices.find(v => /female|samantha|karen|moira|fiona|victoria/i.test(v.name)) ||
          voices.find(v => v.lang.startsWith("en")) ||
          voices[0];
      } else if (voiceProfile === "male") {
        selectedVoice =
          voices.find(v => /male|daniel|alex|fred|george|oliver/i.test(v.name)) ||
          voices.find(v => v.lang.startsWith("en")) ||
          voices[0];
      }

      voiceReady = true;
      resolve();
    };

    load();
  });
}

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
