import React, { useEffect, useState } from "react";

export default function LoadingScreen({ children }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!loaded) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #e0f2ff, #bcdfff)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'Segoe UI', system-ui",
          transition: "opacity 0.4s ease",
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            border: "6px solid rgba(255,255,255,0.5)",
            borderTopColor: "#ffffff",
            animation: "spin 1s linear infinite",
          }}
        />

        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>

        <p
          style={{
            marginTop: "20px",
            fontSize: "16px",
            color: "#1e3a5f",
            opacity: 0.8,
          }}
        >
          Loading your companion…
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
