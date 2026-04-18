import React from "react";
import { NavLink } from "react-router-dom";
import "./bottomnav.css";

export default function BottomNav() {
  const items = [
    { label: "Home", path: "/", icon: "🏠" },
    { label: "Talk", path: "/auntybev", icon: "👵" },
    { label: "Calm", path: "/calm", icon: "🧘‍♀️" },
    { label: "Music", path: "/music", icon: "🎵" },
    { label: "Pets", path: "/petsbuddyroom", icon: "🐾" },

    { label: "Photos", path: "/photos", icon: "📷" },
    { label: "Banking", path: "/banking", icon: "💳" },
    { label: "Dialpad", path: "/dialpad", icon: "📞" },
    { label: "Shower", path: "/shower", icon: "🚿" }
  ];

  return (
    <div className="bottom-nav">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <div className="nav-icon">{item.icon}</div>
          <div className="nav-label">{item.label}</div>
        </NavLink>
      ))}
    </div>
  );
}
