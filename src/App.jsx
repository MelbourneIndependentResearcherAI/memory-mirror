import { useState } from "react";
import "./styles/App.css";

import MemoryMirror from "./pages/MemoryMirror";
import CarerHireAI from "./pages/CarerHireAI";
import FreshStartAI from "./pages/FreshStartAI";
import LittleOnesAI from "./pages/LittleOnesAI";

import Dialpad from "./pages/Dialpad";
import Banking from "./pages/Banking";
import PhotoHub from "./pages/PhotoHub";
import MusicTherapy from "./pages/MusicTherapy";

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

  return (
    <div className="premium-container">
      <header className="premium-header">
        <h1>Memory Mirror</h1>
        <p>Your AI tools for comfort, safety, and connection.</p>
      </header>

      <div className="premium-settings">
        <label>ElevenLabs Voice Key</label>
        <input
          type="password"
          value={voiceKey}
          onChange={(e) => setVoiceKey(e.target.value)}
          placeholder="Enter your ElevenLabs API key"
        />
      </div>

      <div className="premium-grid">
        <div className="premium-tile" onClick={() => setView("memory")}>
          <div className="icon-circle">🧠</div>
          <h2>Memory Mirror</h2>
        </div>

        <div className="premium-tile" onClick={() => setView("carer")}>
          <div className="icon-circle">🧑‍⚕️</div>
          <h2>CarerHire AI</h2>
        </div>

        <div className="premium-tile" onClick={() => setView("fresh")}>
          <div className="icon-circle">🌅</div>
          <h2>Fresh Start AI</h2>
        </div>

        <div className="premium-tile" onClick={() => setView("little")}>
          <div className="icon-circle">👧</div>
          <h2>Little Ones AI</h2>
        </div>

        <div className="premium-tile" onClick={() => setView("dialpad")}>
          <div className="icon-circle">📞</div>
          <h2>Fake Dialpad</h2>
        </div>

        <div className="premium-tile" onClick={() => setView("banking")}>
          <div className="icon-circle">💳</div>
          <h2>Fake Banking</h2>
        </div>

        <div className="premium-tile" onClick={() => setView("photos")}>
          <div className="icon-circle">🖼️</div>
          <h2>Photo Hub</h2>
        </div>

        <div className="premium-tile" onClick={() => setView("music")}>
          <div className="icon-circle">🎵</div>
          <h2>Music Therapy</h2>
        </div>

        <div className="premium-tile disabled">
          <div className="icon-circle">➕</div>
          <h2>Coming Soon</h2>
        </div>
      </div>
    </div>
  );
}
