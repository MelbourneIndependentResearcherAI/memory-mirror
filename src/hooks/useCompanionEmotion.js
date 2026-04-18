import { useEffect, useRef } from "react";
import { getCompanionProfile } from "../utils/companionProfile";

export default function useCompanionEmotion(pathname, speak, getTonePhrase) {
  const profile = getCompanionProfile();
  const lastPathRef = useRef(pathname);
  const lastChangeRef = useRef(Date.now());
  const loopCountRef = useRef(0);
  const inactivityTimerRef = useRef(null);

  const NIGHT_HOURS = [21, 22, 23, 0, 1, 2, 3, 4, 5];

  const isNight = () => {
    const hour = new Date().getHours();
    return NIGHT_HOURS.includes(hour);
  };

  const gentleSpeak = text => {
    const phrase = getTonePhrase(text, "hint");
    if (phrase) speak(phrase);
  };

  useEffect(() => {
    if (!profile) return;
    if (!isNight()) return;

    if (pathname === "/nightsafe") {
      gentleSpeak("I’m here with you. You’re safe tonight.");
    }
  }, [pathname]);

  useEffect(() => {
    if (!profile) return;

    if (pathname === lastPathRef.current) return;

    const now = Date.now();
    const diff = now - lastChangeRef.current;

    if (diff < 3000) {
      loopCountRef.current += 1;
    } else {
      loopCountRef.current = 0;
    }

    lastChangeRef.current = now;
    lastPathRef.current = pathname;

    if (loopCountRef.current >= 3) {
      gentleSpeak("It seems we’re moving around quickly. I can help if you need me.");
      loopCountRef.current = 0;
    }
  }, [pathname]);

  useEffect(() => {
    if (!profile) return;

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      gentleSpeak("I’m still here with you if you need anything.");
    }, 45000);

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [pathname]);

  useEffect(() => {
    if (!profile) return;

    const timer = setTimeout(() => {
      gentleSpeak("Take your time. I’m right here.");
    }, 20000);

    return () => clearTimeout(timer);
  }, [pathname]);
}
