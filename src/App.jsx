import { useState } from "react";
import "./styles/App.css";

// Core apps
import MemoryMirror from "./pages/MemoryMirror";
import CarerHireAI from "./pages/CarerHireAI";
import FreshStartAI from "./pages/FreshStartAI";

// Little Ones AI (separate app folder)
import LittleOnesAI from "../pages/little-ones-ai/src/App.jsx";

// Extra features (assumed paths)
import Dialpad from "./pages/Dialpad.jsx";
import Banking from "./pages/Banking.jsx";
import PhotoHub from "./pages/PhotoHub.jsx";
import MusicTherapy from "./pages/MusicTherapy.jsx";

export default function App() {
  const [view, setView] = useState("home");
  const [voiceKey, setVoiceKey] = useState("");

  const commonProps = {
    voiceKey,
    onBack: () => setView("home"),
  };

  if (view === "memory") return <MemoryMirror {...commonProps} />;
  if (view === "carer") return <CarerHireAI {...commonProps} />;
  if (view === "fresh") return <FreshStartAI {...commonProps} />;
  if (view === "little") return <LittleOnesAI {...commonProps} />;
  if (view === "dialpad") return <Dialpad {...commonProps} />;
  if (view === "banking") return <Banking {...commonProps} />;
  if (view === "photos") return <PhotoHub {...commonProps} />;
  if (view === "music") return <MusicTherapy {...commonProps} />;

  // Home dashboard: 3×3 grid
  return (
    <div className="app-container">
      <header className="header">
        <h1>Memory Mirror</h1>
        <p>Your AI tools for comfort, safety, and connection.</p>
      </header>

      <div className="settings-box">
        <label>ElevenLabs Voice Key:</label>
        <input
          type="password"
          value={voiceKey}
          onChange={(e) => setVoiceKey(e.target.value)}
          placeholder="Enter your ElevenLabs API key"
        />
      </div>

      <div className="grid-3x3">
        <div className="tile" onClick={() => setView("memory")}>
          <span className="emoji">🧠</span>
          <h2>Memory Mirror</h2>
        </div>

        <div className="tile" onClick={() => setView("carer")}>
          <span className="emoji">🧑‍⚕️</span>
          <h2>CarerHire AI</h2>
        </div>

        <div className="tile" onClick={() => setView("fresh")}>
          <span className="emoji">🌅</span>
          <h2>Fresh Start AI</h2>
        </div>

        <div className="tile" onClick={() => setView("little")}>
          <span className="emoji">👧</span>
          <h2>Little Ones AI</h2>
        </div>

        <div className="tile" onClick={() => setView("dialpad")}>
          <span className="emoji">📞</span>
          <h2>Fake Dialpad</h2>
        </div>

        <div className="tile" onClick={() => setView("banking")}>
          <span className="emoji">💳</span>
          <h2>Fake Banking</h2>
        </div>

        <div className="tile" onClick={() => setView("photos")}>
          <span className="emoji">🖼️</span>
          <h2>Photo Hub</h2>
        </div>

        <div className="tile" onClick={() => setView("music")}>
          <span className="emoji">🎵</span>
          <h2>Music Therapy</h2>
        </div>

        <div className="tile tile-disabled">
          <span className="emoji">➕</span>
          <h2>Coming Soon</h2>
        </div>
      </div>
    </div>
  );
}
