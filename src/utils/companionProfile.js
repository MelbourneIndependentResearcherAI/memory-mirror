const KEY = "memoryMirrorCompanionProfile";

export function getCompanionProfile() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCompanionProfile(profile) {
  if (typeof window === "undefined") return;
  try {
    if (profile === null) {
      localStorage.removeItem(KEY);
    } else {
      localStorage.setItem(KEY, JSON.stringify(profile));
    }
  } catch {
    // ignore
  }
}
