import React from "react";

export default function Dashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f9fafb, #e5e7eb)",
        padding: "32px",
        fontFamily: "'Segoe UI', system-ui",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 700, color: "#111827" }}>
        Memory Mirror Dashboard
      </h1>

      <p style={{ margin: 0, fontSize: "16px", color: "#4b5563" }}>
        Choose a space to visit.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {[
          { name: "Enclosures", path: "/enclosures" },
          { name: "Wellbeing Hub", path: "/wellbeing" },
          { name: "AI Tools", path: "/ai-tools" },
          { name: "Calm Room", path: "/calm-room" },
          { name: "Fire Circle", path: "/fire-circle" },
          { name: "Music Therapy", path: "/music" },
          { name: "Little Ones", path: "/little-ones" },
          { name: "Fresh Start", path: "/fresh-start" },
          { name: "Carer Hire", path: "/carer-hire" },
          { name: "Profile", path: "/profile" },
        ].map((item) => (
          <a
            key={item.path}
            href={item.path}
            style={{
              textDecoration: "none",
              background: "white",
              padding: "20px",
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              color: "#111827",
              fontSize: "18px",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {item.name}
          </a>
        ))}
      </div>
    </div>
  );
}
