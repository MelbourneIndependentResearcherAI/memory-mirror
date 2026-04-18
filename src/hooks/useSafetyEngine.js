import { useEffect, useRef } from "react";
import { getCompanionProfile } from "../utils/companionProfile";

export default function useSafetyEngine(
  pathname,
  speak,
  getTonePhrase,
  navigate,
  lastTranscriptRef
) {
  const profile = getCompanionProfile();
  const panicCountRef = useRef(0);
  const nightVisitRef = useRef(0);
  const lastNightRef = useRef(Date.now());

  const isNight = () => {
    const hour = new Date().getHours();
    return hour >= 21 || hour <= 5;
  };

  const gentle = text => {
    const phrase = getTonePhrase(text, "hint");
    if (phrase) speak(phrase);
  };

  useEffect(() => {
    if (!profile) return;

    if (pathname === "/nightsafe") {
      const now = Date.now();
      const diff = now - lastNightRef.current;

      if (diff < 15000) {
        nightVisitRef.current += 1;
      } else {
        nightVisitRef.current = 0;
      }

      lastNightRef.current = now;

      if (nightVisitRef.current >= 2) {
        gentle("I’m here with you. You’re safe. Would you like me to call someone?");
        nightVisitRef.current = 0;
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (!profile) return;

    const transcript = lastTranscriptRef.current;
    if (!transcript) return;

    const panicWords = [
      "help",
      "please help",
      "i'm scared",
      "i feel scared",
      "i'm lost",
      "i feel lost",
      "i don't know",
      "what do i do",
      "where am i",
      "i'm confused",
      "i feel confused",
      "panic",
      "emergency"
    ];

    if (panicWords.some(w => transcript.includes(w))) {
      panicCountRef.current += 1;

      if (panicCountRef.current === 1) {
        gentle("I’m here with you. You’re not alone.");
      }

      if (panicCountRef.current === 2) {
        gentle("It’s okay. I can take you to Night Safe.");
        navigate("/nightsafe");
      }

      if (panicCountRef.current >= 3) {
        gentle("I’ll open the Dialpad so you can call someone.");
        navigate("/dialpad");
        panicCountRef.current = 0;
      }
    } else {
      panicCountRef.current = 0;
    }
  }, [lastTranscriptRef.current]);

  useEffect(() => {
    if (!profile) return;
    if (!isNight()) return;

    if (pathname === "/") {
      gentle("It’s late. If you need comfort, I can take you to Night Safe.");
    }
  }, [pathname]);
}
