import React from "react";
import { Link } from "react-router-dom";

export default function DashboardAnimated() {
  const tiles = [
    { name: "Talk to Aunty Bev", path: "/auntybev", icon: "🧡" },
    { name: "Calm Corner", path: "/calm", icon: "🌙" },
    { name: "Breathing", path: "/breathing", icon: "🌬️" },
    { name: "Night Safe", path: "/nightsafe", icon: "🛏️" },
    { name: "Music Therapy", path: "/music", icon: "🎵" },
    { name: "Kitchen Safety", path: "/kitchen", icon: "🍳" },
    { name: "Medicine Helper", path: "/medicinehelper", icon: "💊" },
    { name: "Healing Room", path: "/healing", icon: "🕊️" },
    { name: "Pets Buddy Room", path: "/petsbuddyroom", icon: "🐾" },
    { name: "Grandkids Hub", path: "/grandkids", icon: "👨‍👩‍👧‍👦" },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="header glass fade-in">I'm here with you</div>

      <div className="tile-grid">
        {tiles.map((t) => (
          <Link key={t.path} to={t.path} style={{ textDecoration: "none" }}>
            <div className="tile glass">
              <div className="tile-top">
                <div className="tile-icon">{t.icon}</div>
                <div>
                  <h2>{t.name}</h2>
                  <p>Tap to open</p>
                </div>
              </div>
              <div className="tile-footer">Memory Mirror · Safe space</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
