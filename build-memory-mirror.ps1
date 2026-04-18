# Memory Mirror – full auto-builder
# Run: powershell -ExecutionPolicy Bypass -File .\build-memory-mirror.ps1

$projectRoot = "C:\MemoryMirror"
Write-Host "→ Using project root: $projectRoot" -ForegroundColor Cyan

if (-not (Test-Path $projectRoot)) {
    Write-Host "✖ Project root not found at $projectRoot" -ForegroundColor Red
    exit 1
}

Set-Location $projectRoot

# --- BASIC CHECKS ----------------------------------------------------
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "✖ Node.js is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "package.json")) {
    Write-Host "⚠ No package.json found. Initialising minimal project..." -ForegroundColor Yellow
    npm init -y | Out-Null
}

# --- ENSURE REACT + REACT-DOM + REACT-ROUTER-DOM ---------------------
Write-Host "→ Ensuring React + ReactDOM + React Router DOM..." -ForegroundColor Cyan
npm install react react-dom react-router-dom --save | Out-Null

# --- FOLDERS ---------------------------------------------------------
Write-Host "→ Ensuring src structure..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "src" | Out-Null
New-Item -ItemType Directory -Force -Path "src\components" | Out-Null
New-Item -ItemType Directory -Force -Path "src\hooks" | Out-Null
New-Item -ItemType Directory -Force -Path "src\screens" | Out-Null
New-Item -ItemType Directory -Force -Path "src\utils" | Out-Null

# --- INDEX ENTRY (MINIMAL) -------------------------------------------
if (-not (Test-Path "src\index.jsx")) {
    Write-Host "→ Writing src\index.jsx" -ForegroundColor Cyan
    Set-Content -Path "src\index.jsx" -Value @'
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
'@
}

if (-not (Test-Path "public\index.html")) {
    New-Item -ItemType Directory -Force -Path "public" | Out-Null
    Write-Host "→ Writing public\index.html" -ForegroundColor Cyan
    Set-Content -Path "public\index.html" -Value @'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charSet="utf-8" />
    <title>Memory Mirror</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;background:#000;color:#fff;">
    <div id="root"></div>
  </body>
</html>
'@
}

# --- APP.JSX (FINAL WITH LANDING) -----------------------------------
Write-Host "→ Writing src\App.jsx" -ForegroundColor Cyan
Set-Content -Path "src\App.jsx" -Value @'
import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "./screens/Landing";

import DashboardAnimated from "./screens/DashboardAnimated";
import NightSafe from "./screens/NightSafe";
import CalmCorner from "./screens/CalmCorner";
import MusicTherapy from "./screens/MusicTherapy";
import PetsBuddy from "./screens/PetsBuddy";
import PhotoHub from "./screens/PhotoHub";
import VideoHub from "./screens/VideoHub";
import FakeBanking from "./screens/FakeBanking";
import Dialpad from "./screens/Dialpad";
import ShowerCompanion from "./screens/ShowerCompanion";
import LegacyStoryBuilder from "./screens/LegacyStoryBuilder";
import LegacyChapter from "./screens/LegacyChapter";

import AuntyBevTalk from "./screens/AuntyBevTalk";
import GPSSafety from "./screens/GPSSafety";
import KitchenSafety from "./screens/KitchenSafety";
import MedicineHelper from "./screens/MedicineHelper";
import Notes from "./screens/Notes";
import ResourcesHub from "./screens/ResourcesHub";
import GrandkidsHub from "./screens/GrandkidsHub";
import MemoryYarnBox from "./screens/MemoryYarnBox";
import FireCircle from "./screens/FireCircle";
import Breathing from "./screens/Breathing";
import LanguageCentre from "./screens/LanguageCentre";
import CarersCorner from "./screens/CarersCorner";
import NightWatch from "./screens/NightWatch";
import HealingRoom from "./screens/HealingRoom";
import PetsBuddyRoom from "./screens/PetsBuddyRoom";
import FarewellCapsule from "./screens/FarewellCapsule";

import CompanionSetup from "./screens/CompanionSetup";
import CompanionSettings from "./screens/CompanionSettings";

import NavBar from "./components/NavBar";
import VoiceOrb from "./components/VoiceOrb";

export default function App() {
  return (
    <div
      style={{
        paddingTop: "70px",
        paddingBottom: "160px",
        minHeight: "100vh",
        background: "#000"
      }}
    >
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/dashboard" element={<DashboardAnimated />} />
        <Route path="/nightsafe" element={<NightSafe />} />
        <Route path="/calm" element={<CalmCorner />} />
        <Route path="/music" element={<MusicTherapy />} />
        <Route path="/pets" element={<PetsBuddy />} />
        <Route path="/photos" element={<PhotoHub />} />
        <Route path="/videos" element={<VideoHub />} />
        <Route path="/banking" element={<FakeBanking />} />
        <Route path="/dialpad" element={<Dialpad />} />
        <Route path="/shower" element={<ShowerCompanion />} />

        <Route path="/legacy" element={<LegacyStoryBuilder />} />
        <Route path="/legacy/:chapter" element={<LegacyChapter />} />

        <Route path="/auntybev" element={<AuntyBevTalk />} />
        <Route path="/gps" element={<GPSSafety />} />
        <Route path="/kitchen" element={<KitchenSafety />} />
        <Route path="/medicine" element={<MedicineHelper />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/resources" element={<ResourcesHub />} />
        <Route path="/grandkids" element={<GrandkidsHub />} />
        <Route path="/yarn" element={<MemoryYarnBox />} />
        <Route path="/firecircle" element={<FireCircle />} />
        <Route path="/breathing" element={<Breathing />} />
        <Route path="/language" element={<LanguageCentre />} />
        <Route path="/carers" element={<CarersCorner />} />
        <Route path="/nightwatch" element={<NightWatch />} />
        <Route path="/healing" element={<HealingRoom />} />
        <Route path="/petsroom" element={<PetsBuddyRoom />} />
        <Route path="/farewell" element={<FarewellCapsule />} />

        <Route path="/companion-setup" element={<CompanionSetup />} />
        <Route path="/companion-settings" element={<CompanionSettings />} />
      </Routes>

      <VoiceOrb />
      <NavBar />
    </div>
  );
}
'@

# --- LANDING SCREEN --------------------------------------------------
Write-Host "→ Writing src\screens\Landing.jsx" -ForegroundColor Cyan
Set-Content -Path "src\screens\Landing.jsx" -Value @'
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/companion-setup");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #0b1b33 0%, #000 60%, #000 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        color: "#e8f4ff",
        textAlign: "center"
      }}
    >
      <div
        style={{
          fontSize: "2.4rem",
          fontWeight: 700,
          marginBottom: "12px",
          background: "linear-gradient(90deg, #4da3ff, #8ecbff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        Memory Mirror
      </div>

      <div
        style={{
          fontSize: "1.1rem",
          opacity: 0.85,
          maxWidth: "420px",
          marginBottom: "40px",
          lineHeight: 1.5
        }}
      >
        A gentle companion for memory, safety, comfort, and connection.
        Designed for dementia-safe navigation and calm support.
      </div>

      <button
        onClick={handleStart}
        style={{
          padding: "14px 36px",
          borderRadius: "999px",
          border: "none",
          background:
            "radial-gradient(circle at 0% 0%, #4da3ff 0%, #0066ff 40%, #001133 100%)",
          color: "#e8f4ff",
          fontSize: "1.1rem",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 0 22px rgba(0,102,255,0.6)",
          marginBottom: "20px"
        }}
      >
        Get Started
      </button>

      <div style={{ opacity: 0.6, fontSize: "0.85rem" }}>
        Calm. Safe. Always with you.
      </div>
    </div>
  );
}
'@

# --- COMPANION PROFILE UTILS ----------------------------------------
Write-Host "→ Writing src\utils\companionProfile.js" -ForegroundColor Cyan
Set-Content -Path "src\utils\companionProfile.js" -Value @'
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
'@

# --- HOOK: COMPANION GUIDE ------------------------------------------
Write-Host "→ Writing src\hooks\useCompanionGuide.js" -ForegroundColor Cyan
Set-Content -Path "src\hooks\useCompanionGuide.js" -Value @'
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
'@

# --- HOOK: COMPANION EMOTION ----------------------------------------
Write-Host "→ Writing src\hooks\useCompanionEmotion.js" -ForegroundColor Cyan
Set-Content -Path "src\hooks\useCompanionEmotion.js" -Value @'
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
'@

# --- HOOK: SAFETY ENGINE --------------------------------------------
Write-Host "→ Writing src\hooks\useSafetyEngine.js" -ForegroundColor Cyan
Set-Content -Path "src\hooks\useSafetyEngine.js" -Value @'
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
'@

# --- HOOK: MEMORY ENGINE --------------------------------------------
Write-Host "→ Writing src\hooks\useMemoryEngine.js" -ForegroundColor Cyan
Set-Content -Path "src\hooks\useMemoryEngine.js" -Value @'
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
'@

# --- COMPANION SETUP SCREEN -----------------------------------------
Write-Host "→ Writing src\screens\CompanionSetup.jsx" -ForegroundColor Cyan
Set-Content -Path "src\screens\CompanionSetup.jsx" -Value @'
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCompanionProfile, saveCompanionProfile } from "../utils/companionProfile";

const toneOptions = [
  {
    id: "gentle",
    label: "Gentle & nurturing",
    example: "I’m here with you. We can go slowly."
  },
  {
    id: "calm",
    label: "Calm & neutral",
    example: "Okay. I’ll open that for you now."
  },
  {
    id: "friendly",
    label: "Friendly & upbeat",
    example: "Got it! Let’s head there together."
  },
  {
    id: "quiet",
    label: "Quiet & minimal",
    example: "I’ll only speak when needed."
  }
];

export default function CompanionSetup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [tone, setTone] = useState("gentle");

  useEffect(() => {
    const existing = getCompanionProfile();
    if (existing) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSave = () => {
    const finalName = name.trim() || "Companion";
    saveCompanionProfile({ name: finalName, tone });
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #0b1b33 0%, #000 55%, #000 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px 16px 40px",
        color: "#e8f4ff"
      }}
    >
      <h1 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>Set up your companion</h1>
      <p style={{ opacity: 0.8, marginBottom: "24px", textAlign: "center", maxWidth: "420px" }}>
        Choose a name and how you’d like your companion to speak to you. You can change this later in Settings.
      </p>

      <div style={{ width: "100%", maxWidth: "420px", marginBottom: "24px" }}>
        <label style={{ fontSize: "0.9rem", opacity: 0.9 }}>Companion name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Type a name (e.g. Lumi, Aunty, Mate)…"
          style={{
            marginTop: "8px",
            width: "100%",
            padding: "12px 14px",
            borderRadius: "12px",
            border: "1px solid #1f3b66",
            background: "rgba(5, 10, 20, 0.9)",
            color: "#e8f4ff",
            fontSize: "1rem"
          }}
        />
      </div>

      <div style={{ width: "100%", maxWidth: "420px", marginBottom: "24px" }}>
        <label style={{ fontSize: "0.9rem", opacity: 0.9 }}>Companion tone</label>
        <div style={{ marginTop: "10px", display: "grid", gap: "10px" }}>
          {toneOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setTone(opt.id)}
              style={{
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: "14px",
                border: tone === opt.id ? "1px solid #4da3ff" : "1px solid #1f3b66",
                background:
                  tone === opt.id
                    ? "linear-gradient(135deg, rgba(0,102,255,0.35), rgba(0,0,0,0.9))"
                    : "rgba(5, 10, 20, 0.9)",
                color: "#e8f4ff",
                cursor: "pointer"
              }}
            >
              <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{opt.label}</div>
              <div style={{ fontSize: "0.8rem", opacity: 0.8, marginTop: "4px" }}>{opt.example}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        style={{
          marginTop: "8px",
          padding: "12px 32px",
          borderRadius: "999px",
          border: "none",
          background:
            "radial-gradient(circle at 0% 0%, #4da3ff 0%, #0066ff 40%, #001133 100%)",
          color: "#e8f4ff",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 0 18px rgba(0,102,255,0.6)"
        }}
      >
        Save companion
      </button>
    </div>
  );
}
'@

# --- COMPANION SETTINGS SCREEN --------------------------------------
Write-Host "→ Writing src\screens\CompanionSettings.jsx" -ForegroundColor Cyan
Set-Content -Path "src\screens\CompanionSettings.jsx" -Value @'
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCompanionProfile, saveCompanionProfile } from "../utils/companionProfile";

const toneOptions = [
  { id: "gentle", label: "Gentle & nurturing" },
  { id: "calm", label: "Calm & neutral" },
  { id: "friendly", label: "Friendly & upbeat" },
  { id: "quiet", label: "Quiet & minimal" }
];

export default function CompanionSettings() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [tone, setTone] = useState("gentle");

  useEffect(() => {
    const existing = getCompanionProfile();
    if (existing) {
      setName(existing.name || "");
      setTone(existing.tone || "gentle");
    }
  }, []);

  const handleSave = () => {
    const finalName = name.trim() || "Companion";
    saveCompanionProfile({ name: finalName, tone });
    navigate("/dashboard");
  };

  const handleReset = () => {
    saveCompanionProfile(null);
    navigate("/companion-setup");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #0b1b33 0%, #000 55%, #000 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px 16px 40px",
        color: "#e8f4ff"
      }}
    >
      <h1 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>Companion settings</h1>
      <p style={{ opacity: 0.8, marginBottom: "24px", textAlign: "center", maxWidth: "420px" }}>
        Change your companion’s name and tone. You can always come back here later.
      </p>

      <div style={{ width: "100%", maxWidth: "420px", marginBottom: "24px" }}>
        <label style={{ fontSize: "0.9rem", opacity: 0.9 }}>Companion name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Type a name…"
          style={{
            marginTop: "8px",
            width: "100%",
            padding: "12px 14px",
            borderRadius: "12px",
            border: "1px solid #1f3b66",
            background: "rgba(5, 10, 20, 0.9)",
            color: "#e8f4ff",
            fontSize: "1rem"
          }}
        />
      </div>

      <div style={{ width: "100%", maxWidth: "420px", marginBottom: "24px" }}>
        <label style={{ fontSize: "0.9rem", opacity: 0.9 }}>Companion tone</label>
        <div style={{ marginTop: "10px", display: "grid", gap: "10px" }}>
          {toneOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setTone(opt.id)}
              style={{
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: "14px",
                border: tone === opt.id ? "1px solid #4da3ff" : "1px solid #1f3b66",
                background:
                  tone === opt.id
                    ? "linear-gradient(135deg, rgba(0,102,255,0.35), rgba(0,0,0,0.9))"
                    : "rgba(5, 10, 20, 0.9)",
                color: "#e8f4ff",
                cursor: "pointer"
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
        <button
          onClick={handleSave}
          style={{
            padding: "12px 24px",
            borderRadius: "999px",
            border: "none",
            background:
              "radial-gradient(circle at 0% 0%, #4da3ff 0%, #0066ff 40%, #001133 100%)",
            color: "#e8f4ff",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 0 18px rgba(0,102,255,0.6)"
          }}
        >
          Save
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: "12px 20px",
            borderRadius: "999px",
            border: "1px solid #444",
            background: "rgba(0,0,0,0.7)",
            color: "#e8f4ff",
            fontSize: "0.9rem",
            cursor: "pointer"
          }}
        >
          Reset companion
        </button>
      </div>
    </div>
  );
}
'@

# --- VOICE ORB COMPONENT --------------------------------------------
Write-Host "→ Writing src\components\VoiceOrb.jsx" -ForegroundColor Cyan
Set-Content -Path "src\components\VoiceOrb.jsx" -Value @'
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCompanionProfile } from "../utils/companionProfile";
import useCompanionGuide from "../hooks/useCompanionGuide";
import useCompanionEmotion from "../hooks/useCompanionEmotion";
import useSafetyEngine from "../hooks/useSafetyEngine";
import useMemoryEngine from "../hooks/useMemoryEngine";

const SpeechRecognition =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

export default function VoiceOrb() {
  const navigate = useNavigate();
  const location = useLocation();
  const [listening, setListening] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [profile, setProfile] = useState(null);
  const recognitionRef = useRef(null);
  const lastTranscriptRef = useRef("");

  useEffect(() => {
    const p = getCompanionProfile();
    setProfile(p);

    if (!p) {
      if (location.pathname === "/") {
        setStatusText("Tap to set up your companion");
      } else {
        setStatusText("Tap to speak");
      }
    } else {
      setStatusText(`Tap to speak to ${p.name}`);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "en-AU";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => {
      setListening(true);
      setStatusText("Listening…");
    };

    rec.onerror = () => {
      setListening(false);
      setStatusText(profile ? `Tap to speak to ${profile.name}` : "Tap to speak");
    };

    rec.onend = () => {
      setListening(false);
      setStatusText(profile ? `Tap to speak to ${profile.name}` : "Tap to speak");
    };

    rec.onresult = event => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      lastTranscriptRef.current = transcript;
      handleCommand(transcript);
    };

    recognitionRef.current = rec;
  }, [profile]);

  const speak = text => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth || !text) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1;
    synth.speak(utter);
  };

  const getTonePhrase = (base, type = "nav") => {
    const tone = profile?.tone || "gentle";
    if (tone === "quiet") return "";

    if (type === "nav") {
      if (tone === "gentle") return `Okay, I’ll ${base}. I’m here with you.`;
      if (tone === "calm") return `Okay, I’ll ${base} now.`;
      if (tone === "friendly") return `Got it, I’ll ${base} for you.`;
    }

    if (type === "error") {
      if (tone === "gentle") return "I’m not sure I understood that, but we can try again.";
      if (tone === "calm") return "I didn’t catch that. Please try again.";
      if (tone === "friendly") return "Hmm, I missed that one. Let’s try again.";
    }

    if (type === "greet") {
      if (tone === "gentle") return `Hi, I’m here with you. What would you like to do?`;
      if (tone === "calm") return `I’m listening. What would you like to do?`;
      if (tone === "friendly") return `Hey, I’m ready. What should we do next?`;
    }

    if (type === "hint") {
      return base;
    }

    return "";
  };

  useCompanionGuide(location.pathname, speak, getTonePhrase);
  useCompanionEmotion(location.pathname, speak, getTonePhrase);
  useSafetyEngine(location.pathname, speak, getTonePhrase, navigate, lastTranscriptRef);
  useMemoryEngine(location.pathname, speak, getTonePhrase);

  const handleCommand = transcript => {
    const name = profile?.name || "companion";

    if (!profile) {
      speak("Let’s set up your companion first.");
      navigate("/companion-setup");
      return;
    }

    const commands = [
      { words: ["home", "dashboard"], path: "/dashboard", phrase: "take you to the dashboard" },
      { words: ["photo"], path: "/photos", phrase: "open Photos" },
      { words: ["video"], path: "/videos", phrase: "open Videos" },
      { words: ["music", "therapy"], path: "/music", phrase: "start Music Therapy" },
      { words: ["night safe", "night"], path: "/nightsafe", phrase: "open Night Safe" },
      { words: ["calm", "breathe"], path: "/calm", phrase: "open Calm Corner" },
      { words: ["pet", "buddy"], path: "/pets", phrase: "open Pets Buddy" },
      { words: ["bank"], path: "/banking", phrase: "open Banking" },
      { words: ["dial", "phone", "call"], path: "/dialpad", phrase: "open the Dialpad" },
      { words: ["shower"], path: "/shower", phrase: "open Shower Companion" },
      { words: ["legacy", "story"], path: "/legacy", phrase: "open Legacy Builder" },
      { words: ["companion", "settings"], path: "/companion-settings", phrase: "open your companion settings" }
    ];

    for (const cmd of commands) {
      if (cmd.words.some(w => transcript.includes(w))) {
        navigate(cmd.path);
        const phrase = getTonePhrase(cmd.phrase);
        speak(phrase);
        return;
      }
    }

    const errorPhrase = getTonePhrase("", "error");
    if (errorPhrase) speak(errorPhrase.replace("I’m", `I’m, ${name},`));
  };

  const handleTap = () => {
    if (!profile) {
      navigate("/companion-setup");
      return;
    }

    if (!SpeechRecognition) {
      speak("Voice control is not available on this device.");
      return;
    }

    if (listening) {
      recognitionRef.current && recognitionRef.current.stop();
      return;
    }

    const greet = getTonePhrase("", "greet");
    speak(greet);
    recognitionRef.current && recognitionRef.current.start();
  };

  const glowColor = listening ? "#4da3ff" : "#0066ff";

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: "96px",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 50
      }}
    >
      {statusText && (
        <div
          style={{
            marginBottom: "8px",
            padding: "6px 12px",
            borderRadius: "999px",
            background: "rgba(0,0,0,0.7)",
            color: "#e8f4ff",
            fontSize: "0.75rem",
            maxWidth: "260px",
            textAlign: "center"
          }}
        >
          {statusText}
        </div>
      )}

      <button
        onClick={handleTap}
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          border: "none",
          background:
            "radial-gradient(circle at 30% 0%, #4da3ff 0%, #001133 40%, #000 100%)",
          boxShadow: listening
            ? `0 0 24px ${glowColor}, 0 0 60px rgba(0,102,255,0.8)`
            : "0 0 18px rgba(0,102,255,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: `2px solid ${glowColor}`,
            boxShadow: `0 0 12px ${glowColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              width: "14px",
              height: "24px",
              borderRadius: "999px",
              background: "#e8f4ff",
              opacity: listening ? 1 : 0.8
            }}
          />
        </div>
      </button>
    </div>
  );
}
'@

# --- FINAL MESSAGES --------------------------------------------------
Write-Host ""
Write-Host "✔ Memory Mirror build complete." -ForegroundColor Green
Write-Host "All core files, engines, and companion systems are now in place." -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1) cd C:\MemoryMirror" -ForegroundColor Yellow
Write-Host "  2) npm install (if not already done)" -ForegroundColor Yellow
Write-Host "  3) npm run dev  OR  npm start (depending on your setup)" -ForegroundColor Yellow
