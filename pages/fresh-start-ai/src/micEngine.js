<<<<<<< HEAD
// --- GLOBAL MICROPHONE ENGINE (Copilot/Claude style) ---

let recognition = null;

export function initMic(onText) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
=======
let recognition = null;

export function initMic(onText) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
>>>>>>> faaeebf (Remove old TTS and install new voice engine)
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = e => {
    const text = e.results[0][0].transcript;
    onText(text);
  };

<<<<<<< HEAD
  recognition.onerror = () => {
    // Auto-recover like Copilot/Claude
    setTimeout(() => recognition.start(), 300);
  };

  recognition.onend = () => {
    // Auto-restart listening after speaking
    setTimeout(() => recognition.start(), 300);
  };
=======
  recognition.onerror = () => setTimeout(() => recognition.start(), 300);
  recognition.onend = () => setTimeout(() => recognition.start(), 300);
>>>>>>> faaeebf (Remove old TTS and install new voice engine)
}

export function startMic() {
  recognition?.start();
}
