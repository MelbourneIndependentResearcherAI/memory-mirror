import { useEffect, useRef, useState } from "react";

export default function useVoice(onFinalText) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const hasRespondedRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-AU";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      hasRespondedRef.current = false;
      setListening(true);
    };

    recognition.onresult = (event) => {
      if (hasRespondedRef.current) return;

      const transcript = event.results[0][0].transcript.trim();
      hasRespondedRef.current = true;

      onFinalText(transcript);

      recognition.stop();
      setListening(false);
    };

    recognition.onerror = () => {
      recognition.stop();
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, [onFinalText]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.start();
  };

  return { startListening, listening };
}
