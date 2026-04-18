import { useEffect, useRef } from "react";
import { getCompanionProfile } from "../utils/companionProfile";

export default function useCompanionGuide(pathname, speak, getTonePhrase) {
  const profile = getCompanionProfile();
  const seen = useRef({});

  const hints = {
    "/": "You can tap Get Started when you’re ready.",
    "/dashboard": "You can tap any tile or ask me to open something for you.",
    "/nightsafe": "Night Safe is here to keep you steady. You can ask me to call family if needed.",
    "/music": "You can ask me to play calming music or memory songs.",
    "/photos": "If you’re looking for a memory, I can help you find it.",
    "/videos": "You can ask me to open a video or go home anytime.",
    "/legacy": "You can start a story whenever you’re ready. I’ll help you.",
    "/calm": "If you need grounding, I can guide your breathing.",
    "/dialpad": "You can ask me to call someone or return home.",
    "/banking": "This is a safe simulation. Nothing here is real banking.",
    "/shower": "I’ll stay with you while you shower. Just say ‘go home’ if you’re done."
  };

  useEffect(() => {
    if (!profile) return;
    if (seen.current[pathname]) return;

    const hint = hints[pathname];
    if (!hint) {
      seen.current[pathname] = true;
      return;
    }

    const phrase = getTonePhrase(hint, "hint");
    if (!phrase) {
      seen.current[pathname] = true;
      return;
    }

    seen.current[pathname] = true;
    speak(phrase);
  }, [pathname]);
}
