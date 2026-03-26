import { useState, useEffect } from "react";
import "./styles/App.css";

import CarerHireAI  from "./apps/CarerHireAI";
import LittleOnesAI from "./apps/LittleOnesAI";
import MemoryMirror from "./pages/MemoryMirror";
import FreshStartAI from "./pages/FreshStartAI";
import Dialpad      from "./pages/Dialpad";
import Banking      from "./pages/Banking";
import PhotoHub     from "./pages/PhotoHub";
import MusicTherapy from "./pages/MusicTherapy";

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const TILES = [
  { id: "memory",  icon: "🧠", label: "Memory Mirror",   desc: "Your memories & life story" },
  { id: "carer",   icon: "🌿", label: "Carer Companion",  desc: "Talk with your AI carer" },
  { id: "little",  icon: "💜", label: "Little Ones AI",   desc: "Chat with the grandkids" },
  { id: "fresh",   icon: "🌅", label: "Fresh Start",      desc: "Morning routine & wellness" },
  { id: "dialpad", icon: "📞", label: "Phone",            desc: "Call your loved ones" },
  { id: "banking", icon: "💳", label: "My Accounts",      desc: "View your balance safely" },
  { id: "photos",  icon: "🖼️", label: "Photo Hub",        desc: "Browse your memories" },
  { id: "music",   icon: "🎵", label: "Music Therapy",    desc: "Familiar, calming music" },
];

export default function App() {
  const [view, setView]               = useState("home");
  const [voiceKey, setVoiceKey]       = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const now = useClock();

  const commonProps = { voiceKey, onBack: () => setView("home") };

  if (view === "memory")  return <MemoryMirror  {...commonProps} />;
  if (view === "carer")   return <CarerHireAI   {...commonProps} />;
  if (view === "little")  return <LittleOnesAI  {...commonProps} />;
  if (view === "fresh")   return <FreshStartAI  {...commonProps} />;
  if (view === "dialpad") return <Dialpad       {...commonProps} />;
  if (view === "banking") return <Banking       {...commonProps} />;
  if (view === "photos")  return <PhotoHub      {...commonProps} />;
  if (view === "music")   return <MusicTherapy  {...commonProps} />;

  const timeStr = now.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="home-screen">
      <header className="home-header">
        <div className="home-brand">
          <span className="home-brand-icon">🪞</span>
          <div>
            <div className="home-brand-name">Memory Mirror</div>
            <div className="home-brand-tagline">AI companion for care &amp; connection</div>
          </div>
        </div>

        <div className="home-clock">
          <div className="home-clock-time">{timeStr}</div>
          <div className="home-clock-date">{dateStr}</div>
        </div>

        <button
          className="home-settings-btn"
          onClick={() => setShowSettings(s => !s)}
          title="Settings"
          aria-label="Settings"
        >⚙️</button>
      </header>

      {showSettings && (
        <div className="home-settings-panel">
          <label className="home-settings-label">ElevenLabs Voice Key</label>
          <input
            type="password"
            className="home-settings-input"
            value={voiceKey}
            onChange={e => setVoiceKey(e.target.value)}
            placeholder="Paste your ElevenLabs API key here"
          />
          <p className="home-settings-hint">
            Required for premium voice in Carer Companion and Little Ones AI.
          </p>
        </div>
      )}

      <main className="home-grid-container">
        <div className="home-grid">
          {TILES.map(tile => (
            <button key={tile.id} className="home-tile" onClick={() => setView(tile.id)}>
              <span className="home-tile-icon">{tile.icon}</span>
              <span className="home-tile-label">{tile.label}</span>
              <span className="home-tile-desc">{tile.desc}</span>
            </button>
          ))}
        </div>
      </main>

      <footer className="home-footer">
        <p>Memory Mirror · MM AI Technologies</p>
      </footer>
    </div>
  );
}
