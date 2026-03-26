import { useState } from "react";
import "./styles/App.css";

// Import the four apps
import MemoryMirror from "./pages/MemoryMirror";
import CarerHireAI from "./pages/CarerHireAI";
import FreshStartAI from "./pages/FreshStartAI";
import LittleOnesAI from "../pages/little-ones-ai/src/App.jsx";

export default function App() {
  const [view, setView] = useState("home");
  const [voiceKey, setVoiceKey] = useState("");

  // Render each app full-screen
  if (view === "memory") {
    return <MemoryMirror voiceKey={voiceKey} onBack={() => setView("home")} />;
  }

  if (view === "carer") {
    return <CarerHireAI voiceKey={voiceKey} onBack={() => setView("home")} />;
  }

  if (view === "fresh") {
    return <FreshStartAI voiceKey={voiceKey} onBack={() => setView("home")} />;
  }

  if (view === "little") {
    return <LittleOnesAI voiceKey={voiceKey} onBack={() => setView("home")} />;
  }

  // Home screen — 2×2 grid
  return (
    <div className="app-container">

      <header className="header">
        <h1>Memory Mirror</h1>
        <p>Your AI companions for support, comfort, and connection.</p>
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

      <div className="grid-2x2">

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

      </div>
    </div>
  );
}
