import { useEffect, useRef } from "react";
import { getCompanionProfile } from "../utils/companionProfile";

const KEY = "memoryMirrorPatterns";

function loadPatterns() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePatterns(p) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}

export default function useMemoryEngine(pathname, speak, getTonePhrase) {
  const profile = getCompanionProfile();
  const patternsRef = useRef(loadPatterns());
  const lastVisitRef = useRef(Date.now());

  const gentle = text => {
    const phrase = getTonePhrase(text, "hint");
    if (phrase) speak(phrase);
  };

  useEffect(() => {
    if (!profile) return;

    const now = Date.now();
    const diff = now - lastVisitRef.current;
    lastVisitRef.current = now;

    const patterns = patternsRef.current;

    if (!patterns[pathname]) {
      patterns[pathname] = { visits: 0, avgTime: 0 };
    }

    patterns[pathname].visits += 1;

    if (patterns[pathname].avgTime === 0) {
      patterns[pathname].avgTime = diff;
    } else {
      patterns[pathname].avgTime = (patterns[pathname].avgTime + diff) / 2;
    }

    savePatterns(patterns);
  }, [pathname]);

  useEffect(() => {
    if (!profile) return;

    const patterns = patternsRef.current;
    const data = patterns[pathname];
    if (!data) return;

    if (data.visits >= 5 && data.avgTime > 20000) {
      gentle("I’ve noticed this screen takes time. I can guide you if you want.");
    }

    if (data.visits >= 10) {
      gentle("You come here often. I can make this easier anytime.");
    }
  }, [pathname]);

  useEffect(() => {
    if (!profile) return;

    const hour = new Date().getHours();
    const patterns = patternsRef.current;

    if (!patterns.routines) patterns.routines = {};

    if (!patterns.routines[hour]) patterns.routines[hour] = 0;

    patterns.routines[hour] += 1;
    savePatterns(patterns);

    if (patterns.routines[hour] >= 5) {
      gentle("This seems like a usual time for you. I’m here with you.");
    }
  }, [pathname]);
}
