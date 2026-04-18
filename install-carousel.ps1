# install-carousel.ps1
# Installs the fullscreen flip-card carousel dashboard for Memory Mirror OS

$root = "C:\MemoryMirror\src"
$dashboard = "$root\screens\DashboardAnimated.jsx"
$css = "$root\cardCarousel.css"

New-Item -ItemType Directory -Force -Path "$root\screens" | Out-Null

# ------------------------------
# DashboardAnimated.jsx (FULL)
# ------------------------------
Set-Content -Path $dashboard -Value @'
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../cardCarousel.css";

export default function DashboardAnimated() {
  const navigate = useNavigate();

  const sections = [
    { label: "Night Safe", path: "/nightsafe", description: "A grounding space for late-night confusion or anxiety." },
    { label: "Calm Corner", path: "/calm", description: "Gentle breathing and grounding exercises for comfort." },
    { label: "Music Therapy", path: "/music", description: "Play calming music, memory songs, and soothing playlists." },
    { label: "Pets Buddy", path: "/pets", description: "A friendly virtual pet companion for emotional support." },
    { label: "Photos", path: "/photos", description: "Browse your memories in a calm, easy-to-navigate gallery." },
    { label: "Videos", path: "/videos", description: "Watch familiar moments to help with comfort and recall." },
    { label: "Banking", path: "/banking", description: "A safe, simulated banking screen with no real transactions." },
    { label: "Dialpad", path: "/dialpad", description: "A simple, dementia-safe dialpad for calling loved ones." },
    { label: "Shower Companion", path: "/shower", description: "Gentle voice guidance and reassurance during showers." },
    { label: "Legacy Builder", path: "/legacy", description: "Record stories, memories, and life chapters with ease." },
    { label: "Aunty Bev Talk", path: "/auntybev", description: "A warm, conversational space inspired by Aunty Bev." },
    { label: "GPS Safety", path: "/gps", description: "Location-aware safety tools for wandering and orientation." },
    { label: "Kitchen Safety", path: "/kitchen", description: "Gentle reminders and safety prompts for kitchen tasks." },
    { label: "Medicine Helper", path: "/medicine", description: "Support for remembering and understanding medications." },
    { label: "Notes", path: "/notes", description: "Simple notes for thoughts, reminders, and messages." },
    { label: "Resources Hub", path: "/resources", description: "Helpful links, guides, and support information." },
    { label: "Grandkids Hub", path: "/grandkids", description: "A space focused on grandkids, photos, and messages." },
    { label: "Memory Yarn Box", path: "/yarn", description: "Short memory prompts and yarns to explore together." },
    { label: "Fire Circle", path: "/firecircle", description: "A reflective space for stories, culture, and connection." },
    { label: "Breathing Room", path: "/breathing", description: "Guided breathing to steady and calm the body." },
    { label: "Language Centre", path: "/language", description: "Language, words, and phrases that feel familiar." },
    { label: "Carers Corner", path: "/carers", description: "Support, notes, and tools for carers and family." },
    { label: "Night Watch", path: "/nightwatch", description: "Overnight reassurance and gentle check-in space." },
    { label: "Healing Room", path: "/healing", description: "A soft space for reflection, grief, and healing." },
    { label: "Pets Buddy Room", path: "/petsroom", description: "A dedicated room for deeper pet memories and comfort." },
    { label: "Farewell Capsule", path: "/farewell", description: "Create gentle goodbye messages and memory capsules." },
    { label: "Companion Settings", path: "/companion-settings", description: "Change your companion’s name, tone, and presence." }
  ];

  const [index, setIndex] = useState(0);
  const current = sections[index];

  const next = () => setIndex((i) => (i + 1) % sections.length);
  const prev = () => setIndex((i) => (i - 1 + sections.length) % sections.length);

  return (
    <div className="mm-carousel-root">
      <h1 className="mm-carousel-title">Memory Mirror Home</h1>
      <p className="mm-carousel-sub">Flick gently through each space, one at a time.</p>

      <div className="mm-carousel-shell">
        <button className="mm-arrow mm-left" onClick={prev}>‹</button>

        <div className="mm-card-perspective">
          <div key={current.path} className="mm-card">
            <div className="mm-card-label">{current.label}</div>
            <div className="mm-card-desc">{current.description}</div>
            <button className="mm-card-btn" onClick={() => navigate(current.path)}>
              Open this space
            </button>
            <div className="mm-card-progress">{index + 1} / {sections.length}</div>
          </div>
        </div>

        <button className="mm-arrow mm-right" onClick={next}>›</button>
      </div>
    </div>
  );
}
'@

# ------------------------------
# cardCarousel.css (FULL)
# ------------------------------
Set-Content -Path $css -Value @'
.mm-carousel-root {
  min-height: 100vh;
  padding: 80px 16px 40px;
  background: radial-gradient(circle at top, #050816 0%, #000 55%, #000 100%);
  color: #e8f4ff;
  text-align: center;
}

.mm-carousel-title {
  font-size: 1.9rem;
  background: linear-gradient(90deg, #4da3ff, #8ecbff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.mm-carousel-sub {
  opacity: 0.8;
  margin-top: 6px;
}

.mm-carousel-shell {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.mm-arrow {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid rgba(77,163,255,0.6);
  background: rgba(0,10,30,0.9);
  color: #e8f4ff;
  font-size: 1.6rem;
  cursor: pointer;
  box-shadow: 0 0 14px rgba(0,102,255,0.5);
}

.mm-card-perspective {
  perspective: 1200px;
  width: 520px;
}

.mm-card {
  background: radial-gradient(circle at top left, #102544 0%, #020712 55%, #000 100%);
  border: 1px solid rgba(77,163,255,0.6);
  border-radius: 22px;
  padding: 26px;
  box-shadow: 0 0 24px rgba(0,102,255,0.6);
  animation: mmFlip 0.45s ease;
}

.mm-card-label {
  font-size: 1.4rem;
  font-weight: 700;
}

.mm-card-desc {
  margin-top: 12px;
  opacity: 0.9;
}

.mm-card-btn {
  margin-top: 18px;
  padding: 10px 22px;
  border-radius: 999px;
  border: none;
  background: radial-gradient(circle at 0% 0%, #4da3ff 0%, #0066ff 40%, #001133 100%);
  color: #e8f4ff;
  cursor: pointer;
}

.mm-card-progress {
  margin-top: 14px;
  opacity: 0.7;
  font-size: 0.85rem;
}

@keyframes mmFlip {
  0% { transform: rotateY(-18deg); opacity: 0; }
  50% { transform: rotateY(12deg); opacity: 0.7; }
  100% { transform: rotateY(0deg); opacity: 1; }
}
'@

Write-Host "✔ Carousel installed. Restart your dev server and open /dashboard." -ForegroundColor Green
