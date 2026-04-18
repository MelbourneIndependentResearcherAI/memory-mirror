import React from "react";
import { useNavigate } from "react-router-dom";
import "./LegacyStoryBuilder.css";

export default function LegacyStoryBuilder() {
  const navigate = useNavigate();

  const chapters = [
    { id: "childhood", label: "Childhood" },
    { id: "family", label: "Family" },
    { id: "love", label: "Love" },
    { id: "career", label: "Career" },
    { id: "life-lessons", label: "Life Lessons" },
    { id: "farewell-message", label: "Farewell Message" }
  ];

  return (
    <div className="legacy-container">
      <h1 className="legacy-title">Legacy Story Builder</h1>
      <p className="legacy-sub">
        Gently capture your life story, one chapter at a time.
      </p>

      <div className="legacy-grid">
        {chapters.map((c) => (
          <button
            key={c.id}
            className="legacy-card"
            onClick={() => navigate(`/legacy/${c.id}`)}
          >
            <div className="legacy-card-label">{c.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
