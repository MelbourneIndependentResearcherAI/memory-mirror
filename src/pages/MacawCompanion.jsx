import React, { useState, useEffect, useRef } from "react";

export default function MacawCompanion() {
  const [mood, setMood] = useState("Calm");
  const [status, setStatus] = useState("Your macaw is perched quietly, feathers puffed softly.");
  const [isLeaningIn, setIsLeaningIn] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [isDrinking, setIsDrinking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hunger, setHunger] = useState(40);
  const [thirst, setThirst] = useState(40);
  const [energy, setEnergy] = useState(70);

  const chirpRef = useRef(null);
  const squawkRef = useRef(null);
  const eatRef = useRef(null);
  const drinkRef = useRef(null);
  const playRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setHunger((h) => Math.min(100, h + 2));
      setThirst((t) => Math.min(100, t + 3));
      setEnergy((e) => Math.max(0, e - 1));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hunger > 75 || thirst > 75) {
      setMood("Uncomfortable");
      setStatus("Your macaw ruffles its feathers and glances at the bowls.");
    } else if (energy < 25) {
      setMood("Sleepy");
      setStatus("Your macaw tucks its head under its wing.");
    } else if (isPlaying) {
      setMood("Playful");
      setStatus("Your macaw flaps excitedly and chases the toy.");
    } else if (isLeaningIn) {
      setMood("Affectionate");
      setStatus("Your macaw leans in and gently nibbles your finger.");
    } else {
      setMood("Calm");
      setStatus("Your macaw watches you with bright, curious eyes.");
    }
  }, [hunger, thirst, energy, isPlaying, isLeaningIn]);

  const playSound = (ref) => {
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    }
  };

  const handleHeadPat = () => {
    setIsLeaningIn(true);
    setEnergy((e) => Math.min(100, e + 5));
    setStatus("You stroke its head crest. It leans in and chirps softly.");
    playSound(chirpRef);
    setTimeout(() => setIsLeaningIn(false), 2500);
  };

  const handleBodyPat = () => {
    setEnergy((e) => Math.min(100, e + 3));
    setStatus("You gently stroke its wings. It flutters happily.");
    playSound(chirpRef);
  };

  const handleFeed = () => {
    if (hunger < 20) {
      setStatus("Your macaw pecks the bowl but isn’t hungry.");
      return;
    }
    setIsEating(true);
    setStatus("Your macaw hops over and starts eating seeds.");
    playSound(eatRef);
    setHunger((h) => Math.max(0, h - 50));
    setEnergy((e) => Math.min(100, e + 10));
    setTimeout(() => {
      setIsEating(false);
      setStatus("Finished eating, your macaw wipes its beak on the perch.");
    }, 3000);
  };

  const handleDrink = () => {
    if (thirst < 20) {
      setStatus("Your macaw looks at the water but isn’t thirsty.");
      return;
    }
    setIsDrinking(true);
    setStatus("Your macaw dips its beak and drinks slowly.");
    playSound(drinkRef);
    setThirst((t) => Math.max(0, t - 50));
    setTimeout(() => {
      setIsDrinking(false);
      setStatus("Refreshed, your macaw shakes its feathers.");
    }, 2500);
  };

  const handlePlay = () => {
    if (energy < 20) {
      setStatus("Your macaw squawks softly, too tired to play.");
      playSound(squawkRef);
      return;
    }
    setIsPlaying(true);
    setStatus("Your macaw chases the toy with excited flaps.");
    playSound(playRef);
    setEnergy((e) => Math.max(0, e - 20));
    setTimeout(() => {
      setIsPlaying(false);
      setStatus("Your macaw returns to its perch, looking proud.");
    }, 3500);
  };

  const getMoodColor = () => {
    switch (mood) {
      case "Affectionate":
        return "#e0f7ff";
      case "Playful":
        return "#fff3d1";
      case "Uncomfortable":
        return "#ffe0e0";
      case "Sleepy":
        return "#e6e0ff";
      default:
        return "#f2f5f9";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #e0f7ff, #b3e5ff)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        boxSizing: "border-box",
        fontFamily: "'Segoe UI', system-ui",
      }}
    >
      <audio ref={chirpRef} src="/sounds/macaw-chirp.mp3" />
      <audio ref={squawkRef} src="/sounds/macaw-squawk.mp3" />
      <audio ref={eatRef} src="/sounds/macaw-eat.mp3" />
      <audio ref={drinkRef} src="/sounds/macaw-drink.mp3" />
      <audio ref={playRef} src="/sounds/macaw-play.mp3" />

      <div
        style={{
          maxWidth: "960px",
          width: "100%",
          backgroundColor: "white",
          borderRadius: "24px",
          boxShadow: "0 18px 45px rgba(0,0,0,0.08)",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>
          Macaw Companion
        </h1>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.2fr)",
            gap: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: getMoodColor(),
              borderRadius: "20px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ fontSize: "18px", fontWeight: 600 }}>
              Mood: {mood}
            </div>

            <div
              style={{
                position: "relative",
                borderRadius: "18px",
                background:
                  "radial-gradient(circle at 20% 0%, #d1f3ff, #b3e5ff 55%, #9cd6ff 100%)",
                height: "260px",
                overflow: "hidden",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                padding: "12px",
              }}
            >
              <div
                onClick={handleBodyPat}
                style={{
                  position: "absolute",
                  bottom: "40px",
                  width: "160px",
                  height: "140px",
                  borderRadius: "80px",
                  background:
                    "linear-gradient(180deg, #1e90ff, #0066cc 60%, #004c99)",
                  cursor: "pointer",
                  transition: "transform 220ms ease-out",
                  transform: isLeaningIn ? "translateY(6px)" : "translateY(0)",
                }}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHeadPat();
                  }}
                  style={{
                    position: "absolute",
                    top: "-40px",
                    width: "100px",
                    height: "70px",
                    borderRadius: "70px",
                    background:
                      "radial-gradient(circle at 30% 20%, #ffe6c7, #ffcc80 70%)",
                    cursor: "pointer",
                    transition: "transform 220ms ease-out",
                    transform: isLeaningIn ? "translateY(6px)" : "translateY(0)",
                  }}
                />
              </div>

              <div
                onClick={handleFeed}
                style={{
                  position: "absolute",
                  bottom: "18px",
                  left: "12px",
                  width: "70px",
                  height: "34px",
                  borderRadius: "34px",
                  background:
                    "linear-gradient(180deg, #fff3d1, #ffe0a3 70%, #ffcc80)",
                  cursor: "pointer",
                }}
              />

              <div
                onClick={handleDrink}
                style={{
                  position: "absolute",
                  bottom: "18px",
                  right: "12px",
                  width: "70px",
                  height: "34px",
                  borderRadius: "34px",
                  background:
                    "linear-gradient(180deg, #e7f5ff, #c7e4ff 70%, #a7c8e8)",
                  cursor: "pointer",
                }}
              />

              <div
                onClick={handlePlay}
                style={{
                  position: "absolute",
                  bottom: "70px",
                  right: "90px",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 30% 30%, #fff7e0, #ffb347 60%, #e07a2f)",
                  cursor: "pointer",
                }}
              />
            </div>

            <div
              style={{
                fontSize: "13px",
                backgroundColor: "rgba(255,255,255,0.8)",
                borderRadius: "14px",
                padding: "10px 12px",
              }}
            >
              {status}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#e0f7ff",
              borderRadius: "16px",
              padding: "12px",
              fontSize: "13px",
            }}
          >
            Tap head  
            Tap body  
            Tap food  
            Tap water  
            Tap toy  
          </div>
        </section>
      </div>
    </div>
  );
}
