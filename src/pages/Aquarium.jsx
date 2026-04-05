import React, { useEffect, useRef, useState } from "react";

export default function Aquarium() {
  const [fish, setFish] = useState([]);
  const tankRef = useRef(null);

  // Generate random fish on mount
  useEffect(() => {
    const species = [
      "neon-tetra",
      "guppy",
      "molly",
      "angelfish",
      "goldfish",
      "koi",
      "clownfish",
      "blue-tang",
      "butterflyfish",
      "rainbowfish",
      "silver-perch",
    ];

    const newFish = Array.from({ length: 12 }).map(() => ({
      id: crypto.randomUUID(),
      species: species[Math.floor(Math.random() * species.length)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10,
      speed: Math.random() * 0.4 + 0.3,
      direction: Math.random() > 0.5 ? 1 : -1,
    }));

    setFish(newFish);
  }, []);

  // Fish movement loop
  useEffect(() => {
    const interval = setInterval(() => {
      setFish((prev) =>
        prev.map((f) => {
          let newX = f.x + f.speed * f.direction;

          if (newX > 90 || newX < 0) {
            return { ...f, direction: f.direction * -1 };
          }

          return { ...f, x: newX };
        })
      );
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // Tap interaction — fish swim toward tap
  const handleTap = (e) => {
    const rect = tankRef.current.getBoundingClientRect();
    const tapX = ((e.clientX - rect.left) / rect.width) * 100;
    const tapY = ((e.clientY - rect.top) / rect.height) * 100;

    setFish((prev) =>
      prev.map((f) => ({
        ...f,
        x: f.x + (tapX - f.x) * 0.15,
        y: f.y + (tapY - f.y) * 0.15,
      }))
    );
  };

  const fishColors = {
    "neon-tetra": "#4ef2ff",
    guppy: "#ffb347",
    molly: "#ffd700",
    angelfish: "#ffffff",
    goldfish: "#ff6b00",
    koi: "#ff3b3b",
    clownfish: "#ff7f00",
    "blue-tang": "#009dff",
    butterflyfish: "#ffe680",
    rainbowfish: "#7fffd4",
    "silver-perch": "#c0c0c0",
  };

  return (
    <div
      ref={tankRef}
      onClick={handleTap}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(180deg, #4db8ff, #003d66)",
        cursor: "pointer",
      }}
    >
      {/* Light rays */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          width: "60%",
          height: "100%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.15), transparent)",
          filter: "blur(12px)",
          animation: "lightMove 8s ease-in-out infinite alternate",
          pointerEvents: "none",
        }}
      />

      {/* Bubbles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: "-20px",
            left: `${Math.random() * 100}%`,
            width: "8px",
            height: "8px",
            background: "rgba(255,255,255,0.7)",
            borderRadius: "50%",
            animation: `bubbleRise ${4 + Math.random() * 4}s linear infinite`,
            opacity: 0.8,
          }}
        />
      ))}

      {/* Plants */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "120px",
          background:
            "url('https://i.imgur.com/1Q9Z1Qx.png') repeat-x bottom center",
          backgroundSize: "contain",
          opacity: 0.9,
          pointerEvents: "none",
        }}
      />

      {/* Fish */}
      {fish.map((f) => (
        <div
          key={f.id}
          style={{
            position: "absolute",
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: "50px",
            height: "20px",
            backgroundColor: fishColors[f.species],
            borderRadius: "20px 10px 10px 20px",
            transform: `scaleX(${f.direction})`,
            transition: "top 0.3s ease-out",
            boxShadow: "0 0 8px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              background: "#000",
              borderRadius: "50%",
              position: "absolute",
              top: "6px",
              left: "6px",
            }}
          />
        </div>
      ))}

      {/* CSS animations */}
      <style>
        {`
          @keyframes bubbleRise {
            0% { transform: translateY(0) scale(1); opacity: 0.8; }
            100% { transform: translateY(-120vh) scale(0.6); opacity: 0; }
          }

          @keyframes lightMove {
            0% { transform: translateX(-20px); }
            100% { transform: translateX(20px); }
          }
        `}
      </style>
    </div>
  );
}
