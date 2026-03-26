import { useState } from "react";
import "./styles/App.css";

// Adult carers UI
import CarerHireAI from "./pages/CarerHireAI";
import FreshStartAI from "./pages/FreshStartAI";

// Little Ones AI (grandchildren)
import LittleOnesAI from "../pages/little-ones-ai/src/App.jsx";

export default function App() {
  const [view, setView] = useState("home");
  const [voiceKey, setVoiceKey] = useState("");

  if (view === "companions") {
    return (
      <CarerHireAI
        voiceKey={voiceKey}
        onBack={() => setView("home")}
      />
    );
  }

  if (view === "fresh-start") {
    return (
      <FreshStartAI
        voiceKey={voiceKey}
        onBack={() => setView("home")}
      />
    );
  }

  if (view === "little-ones") {
    return (
      <LittleOnesAI
        voiceKey={voiceKey}
        onBack={() => setView("home")}
      />
    );
  }

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

      <div className="tile-grid">

        {/* Adult AI Companions */}
        <div
          className="tile"
          onClick={() => setView("companions")}
        >
          <span style={{ fontSize: "3rem" }}>🧑‍⚕️</span>
          <h2>AI Companions</h2>
          <p>Supportive carers trained for dementia-friendly communication.</p>
        </div>

        {/* Fresh Start AI */}
        <div
          className="tile"
          onClick={() => setView("fresh-start")}
        >
          <span style={{ fontSize: "3rem" }}>🌅</span>
          <h2>Fresh Start AI</h2>
          <p>Gentle resets and grounding for moments of confusion.</p>
        </div>

        {/* Little Ones AI — Grandchildren */}
        <div
          className="tile"
          onClick={() => setView("little-ones")}
        >
          <span style={{ fontSize: "3rem" }}>👧</span>
          <h2>Little Ones AI</h2>
          <p>Grandchildren-style voices and interactions.</p>
        </div>

      </div>
    </div>
  );
}
