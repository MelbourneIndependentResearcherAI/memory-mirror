import React from "react";
import { useNavigate } from "react-router-dom";

export default function MobYarnTile() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/mobyarn")}
      style={{
        backgroundImage: "url('/images/mobyarn.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "18px",
        height: "180px",
        cursor: "pointer",
        display: "flex",
        alignItems: "flex-end",
        padding: "16px",
        color: "#fff",
        fontSize: "22px",
        fontWeight: "bold",
        boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
      }}
    >
      Mob Yarn Companion
    </div>
  );
}
