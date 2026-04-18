# build-dashboard-carousel.ps1
# Replaces DashboardAnimated.jsx with a fullscreen flip-card carousel
# and adds cardCarousel.css

$projectRoot = "C:\MemoryMirror"
Set-Location $projectRoot

$dashboardFile = "src\screens\DashboardAnimated.jsx"
$carouselCssFile = "src\cardCarousel.css"

New-Item -ItemType Directory -Force -Path "src" | Out-Null
New-Item -ItemType Directory -Force -Path "src\screens" | Out-Null

# --- DashboardAnimated.jsx (FULL FILE) --------------------------------------
Set-Content -Path $dashboardFile -Value @'
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

  const goNext = () => {
    setIndex((prev) => (prev + 1) % sections.length);
  };

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + sections.length) % sections.length);
  };

  const handleOpen = () => {
    navigate(current.path);
  };

  return (
    <div className="mm-dashboard-root">
      <div className="mm-dashboard-inner">
        <header className="mm-dashboard-header">
          <h1 className="mm-dashboard-title">Memory Mirror Home</h1>
          <p className="mm-dashboard-subtitle">
            Flick gently through each space, one at a time. Calm, clear, and dementia-safe.
          </p>
        </header>

        <div className="mm-card-shell">
          <button
            className="mm-nav-arrow mm-nav-arrow-left"
            onClick={goPrev}
            aria-label="Previous space"
          >
            ‹
          </button>

          <div className="mm-card-perspective">
            <div key={current.path} className="mm-card">
              <div className="mm-card-label">{current.label}</div>
              <div className="mm-card-description">{current.description}</div>
              <button className="mm-card-button" onClick={handleOpen}>
                Open this space
              </button>
              <div className="mm-card-progress">
                {index + 1} / {sections.length}
              </div>
            </div>
          </div>

          <button
            className="mm-nav-arrow mm-nav-arrow-right"
            onClick={goNext}
            aria-label="Next space"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
'@

# --- cardCarousel.css (FULL FILE) -------------------------------------------
Set-Content -Path $carouselCssFile -Value @'
.mm-dashboard-root {
  min-height: 100vh;
  background: radial-gradient(circle at top, #050816 0%, #000 55%, #000 100%);
  padding: 80px 16px 40px;
  color: #e8f4ff;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.mm-dashboard-inner {
  width: 100%;
  max-width: 960px;
}

.mm-dashboard-header {
  margin-bottom: 32px;
}

.mm-dashboard-title {
  font-size: 1.9rem;
  margin: 0;
  background: linear-gradient(90deg, #4da3ff, #8ecbff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.mm-dashboard-subtitle {
  margin: 8px 0 0;
  opacity: 0.8;
  max-width: 520px;
  font-size: 0.95rem;
}

.mm-card-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.mm-nav-arrow {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid rgba(77, 163, 255, 0.6);
  background: rgba(0, 10, 30, 0.9);
  color: #e8f4ff;
  font-size: 1.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 14px rgba(0, 102, 255, 0.5);
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.mm-nav-arrow:hover {
  background: rgba(0, 25, 60, 0.95);
  transform: translateY(-1px);
  box-shadow: 0 0 18px rgba(0, 102, 255, 0.8);
}

.mm-card-perspective {
  flex: 1;
  max-width: 520px;
  perspective: 1200px;
  display: flex;
  justify-content: center;
}

.mm-card {
  width: 100%;
  min-height: 220px;
  border-radius: 22px;
  padding: 26px 22px 22px;
  background: radial-gradient(circle at top left, #102544 0%, #020712 55%, #000 100%);
  border: 1px solid rgba(77, 163, 255, 0.6);
  box-shadow:
    0 0 24px rgba(0, 102, 255, 0.6),
    0 0 60px rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 14px;
  transform-origin: center;
  animation: mmCardFlipIn 0.45s ease;
}

.mm-card-label {
  font-size: 1.4rem;
  font-weight: 700;
}

.mm-card-description {
  font-size: 0.98rem;
  opacity: 0.9;
  line-height: 1.5;
}

.mm-card-button {
  margin-top: 8px;
  align-self: flex-start;
  padding: 10px 22px;
  border-radius: 999px;
  border: none;
  background: radial-gradient(circle at 0% 0%, #4da3ff 0%, #0066ff 40%, #001133 100%);
  color: #e8f4ff;
  font-size: 0.98rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 0 18px rgba(0, 102, 255, 0.7);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.mm-card-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 24px rgba(0, 102, 255, 0.9);
}

.mm-card-progress {
  margin-top: 10px;
  font-size: 0.85rem;
  opacity: 0.7;
}

/* Flip + tilt animation */
@keyframes mmCardFlipIn {
  0% {
    transform: rotateY(-18deg) translateY(6px);
    opacity: 0;
  }
  50% {
    transform: rotateY(12deg) translateY(0px);
    opacity: 0.7;
  }
  100% {
    transform: rotateY(0deg) translateY(0px);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .mm-card-shell {
    gap: 6px;
  }

  .mm-nav-arrow {
    width: 36px;
    height: 36px;
    font-size: 1.4rem;
  }

  .mm-card {
    min-height: 210px;
    padding: 22px 18px 18px;
  }

  .mm-card-label {
    font-size: 1.25rem;
  }
}
'@

Write-Host ""
Write-Host "✔ DashboardAnimated.jsx replaced with fullscreen flip-card carousel." -ForegroundColor Green
Write-Host "✔ cardCarousel.css written." -ForegroundColor Green
Write-Host "Restart your dev server and open /dashboard to see the new experience." -ForegroundColor Cyan
