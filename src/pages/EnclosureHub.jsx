import React from "react";
import { Link } from "react-router-dom";

export default function EnclosureHub() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f0f4ff, #d9e4ff)",
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
          gap: "24px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 700,
            color: "#1f2937",
            textAlign: "center",
          }}
        >
          Your Companion Enclosures
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "15px",
            color: "#4b5563",
            textAlign: "center",
          }}
        >
          Tap an enclosure to visit your companion.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          <Link
            to="/dog"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "linear-gradient(180deg, #fff7e6, #ffe0b3)",
                borderRadius: "20px",
                padding: "20px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                Chocolate Lab
              </h2>
              <p style={{ margin: "8px 0 0", fontSize: "14px" }}>
                Loyal, gentle, affectionate.
              </p>
            </div>
          </Link>

          <Link
            to="/cat"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "linear-gradient(180deg, #ffe9d6, #ffd1aa)",
                borderRadius: "20px",
                padding: "20px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                Ginger Tomcat
              </h2>
              <p style={{ margin: "8px 0 0", fontSize: "14px" }}>
                Warm, curious, slow‑blink king.
              </p>
            </div>
          </Link>

          <Link
            to="/macaw"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "linear-gradient(180deg, #e0f7ff, #b3e5ff)",
                borderRadius: "20px",
                padding: "20px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                Macaw
              </h2>
              <p style={{ margin: "8px 0 0", fontSize: "14px" }}>
                Bright, talkative, feathered mate.
              </p>
            </div>
          </Link>

          <Link
            to="/ferret"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "linear-gradient(180deg, #fff3e6, #f5d7b3)",
                borderRadius: "20px",
                padding: "20px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                Cinnamon Ferret
              </h2>
              <p style={{ margin: "8px 0 0", fontSize: "14px" }}>
                Wiggly, playful, dook‑machine.
              </p>
            </div>
          </Link>

          <Link
            to="/aquarium"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "linear-gradient(180deg, #d6f0ff, #b3e0ff)",
                borderRadius: "20px",
                padding: "20px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                Aquarium
              </h2>
              <p style={{ margin: "8px 0 0", fontSize: "14px" }}>
                Calm, colourful, soothing.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
