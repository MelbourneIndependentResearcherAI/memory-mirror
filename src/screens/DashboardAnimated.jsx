import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../hoverDescriptions.css";
import "../dashboardTiles.css";

export default function DashboardAnimated() {
  const navigate = useNavigate();

  const sections = [
    {
      label: "Night Safe",
      path: "/nightsafe",
      description: "A grounding space for late-night confusion or anxiety."
    },
    {
      label: "Calm Corner",
      path: "/calm",
      description: "Gentle breathing and grounding exercises for comfort."
    },
    {
      label: "Music Therapy",
      path: "/music",
      description: "Play calming music, memory songs, and soothing playlists."
    },
    {
      label: "Pets Buddy",
      path: "/pets",
      description: "A friendly virtual pet companion for emotional support."
    },
    {
      label: "Photos",
      path: "/photos",
      description: "Browse your memories in a calm, easy-to-navigate gallery."
    },
    {
      label: "Videos",
      path: "/videos",
      description: "Watch familiar moments to help with comfort and recall."
    },
    {
      label: "Banking",
      path: "/banking",
      description: "A safe, simulated banking screen with no real transactions."
    },
    {
      label: "Dialpad",
      path: "/dialpad",
      description: "A simple, dementia-safe dialpad for calling loved ones."
    },
    {
      label: "Shower Companion",
      path: "/shower",
      description: "Gentle voice guidance and reassurance during showers."
    },
    {
      label: "Legacy Builder",
      path: "/legacy",
      description: "Record stories, memories, and life chapters with ease."
    },
    {
      label: "Aunty Bev Talk",
      path: "/auntybev",
      description: "A warm, conversational space inspired by Aunty Bev."
    },
    {
      label: "GPS Safety",
      path: "/gps",
      description: "Location-aware safety tools for wandering and orientation."
    },
    {
      label: "Kitchen Safety",
      path: "/kitchen",
      description: "Gentle reminders and safety prompts for kitchen tasks."
    },
    {
      label: "Medicine Helper",
      path: "/medicine",
      description: "Support for remembering and understanding medications."
    },
    {
      label: "Notes",
      path: "/notes",
      description: "Simple notes for thoughts, reminders, and messages."
    },
    {
      label: "Resources Hub",
      path: "/resources",
      description: "Helpful links, guides, and support information."
    },
    {
      label: "Grandkids Hub",
      path: "/grandkids",
      description: "A space focused on grandkids, photos, and messages."
    },
    {
      label: "Memory Yarn Box",
      path: "/yarn",
      description: "Short memory prompts and yarns to explore together."
    },
    {
      label: "Fire Circle",
      path: "/firecircle",
      description: "A reflective space for stories, culture, and connection."
    },
    {
      label: "Breathing Room",
      path: "/breathing",
      description: "Guided breathing to steady and calm the body."
    },
    {
      label: "Language Centre",
      path: "/language",
      description: "Language, words, and phrases that feel familiar."
    },
    {
      label: "Carers Corner",
      path: "/carers",
      description: "Support, notes, and tools for carers and family."
    },
    {
      label: "Night Watch",
      path: "/nightwatch",
      description: "Overnight reassurance and gentle check-in space."
    },
    {
      label: "Healing Room",
      path: "/healing",
      description: "A soft space for reflection, grief, and healing."
    },
    {
      label: "Pets Buddy Room",
      path: "/petsroom",
      description: "A dedicated room for deeper pet memories and comfort."
    },
    {
      label: "Farewell Capsule",
      path: "/farewell",
      description: "Create gentle goodbye messages and memory capsules."
    },
    {
      label: "Companion Settings",
      path: "/companion-settings",
      description: "Change your companion’s name, tone, and presence."
    }
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #050816 0%, #000 55%, #000 100%)",
        padding: "80px 16px 40px",
        color: "#e8f4ff"
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto"
        }}
      >
        <header
          style={{
            marginBottom: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <h1
            style={{
              fontSize: "1.9rem",
              margin: 0,
              background: "linear-gradient(90deg, #4da3ff, #8ecbff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Memory Mirror Home
          </h1>
          <p
            style={{
              margin: 0,
              opacity: 0.8,
              maxWidth: "520px",
              fontSize: "0.95rem"
            }}
          >
            Tap a tile or use your voice with the glowing orb. Everything here is
            designed to be calm, clear, and dementia-safe.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px"
          }}
        >
          {sections.map(section => (
            <div key={section.path} className="feature-card">
              <div className="feature-description">{section.description}</div>
              <Link
                to={section.path}
                className="dashboard-tile"
                onClick={e => {
                  e.preventDefault();
                  navigate(section.path);
                }}
              >
                {section.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
