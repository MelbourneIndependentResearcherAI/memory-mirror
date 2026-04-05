import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoadingScreen from "./components/LoadingScreen";
import GlobalNav from "./components/GlobalNav";

import EnclosureHub from "./pages/EnclosureHub";
import DogCompanion from "./pages/DogCompanion";
import CatCompanion from "./pages/CatCompanion";
import MacawCompanion from "./pages/MacawCompanion";
import FerretCompanion from "./pages/FerretCompanion";
import Aquarium from "./pages/Aquarium";

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f9fafb, #e5e7eb)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px",
        boxSizing: "border-box",
        fontFamily: "'Segoe UI', system-ui",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          backgroundColor: "white",
          borderRadius: "28px",
          padding: "24px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Companion Shell
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "15px",
            color: "#4b5563",
          }}
        >
          Use the navigation bar or visit your enclosures to spend time with your companions.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LoadingScreen>
      <Router>
        <GlobalNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enclosures" element={<EnclosureHub />} />
          <Route path="/dog" element={<DogCompanion />} />
          <Route path="/cat" element={<CatCompanion />} />
          <Route path="/macaw" element={<MacawCompanion />} />
          <Route path="/ferret" element={<FerretCompanion />} />
          <Route path="/aquarium" element={<Aquarium />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LoadingScreen>
  );
}

