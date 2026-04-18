import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
  return (
    <div className="nav-wrapper">
      <div className="nav-glass">
        <NavLink to="/" className="nav-item">🏠</NavLink>
        <NavLink to="/nightsafe" className="nav-item">🌙</NavLink>
        <NavLink to="/calm" className="nav-item">🧘</NavLink>
        <NavLink to="/music" className="nav-item">🎵</NavLink>
        <NavLink to="/pets" className="nav-item">🐾</NavLink>
        <NavLink to="/photos" className="nav-item">📷</NavLink>
        <NavLink to="/banking" className="nav-item">💳</NavLink>
        <NavLink to="/dialpad" className="nav-item">📞</NavLink>
        <NavLink to="/shower" className="nav-item">🚿</NavLink>
      </div>
    </div>
  );
}
