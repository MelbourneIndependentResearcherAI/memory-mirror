import React from "react";
import { Link } from "react-router-dom";
import "./GlobalNav.css"; // remove this line if you don’t have a CSS file

function GlobalNav() {
  return (
    <nav className="global-nav">
      <ul className="nav-list">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/carer-hire-ai">Carer Hire AI</Link></li>
        <li><Link to="/fresh-start-ai">Fresh Start AI</Link></li>
        <li><Link to="/little-ones-ai">Little Ones AI</Link></li>
      </ul>
    </nav>
  );
}

export default GlobalNav;
