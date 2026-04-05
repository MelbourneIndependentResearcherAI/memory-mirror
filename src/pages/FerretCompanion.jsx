import React, { useState, useEffect, useRef } from "react";

export default function FerretCompanion() {
  const [mood, setMood] = useState("Calm");
  const [status, setStatus] = useState("Your cinnamon ferret is curled up, watching you curiously.");
  const [isLeaningIn, setIsLeaningIn] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [isDrinking, setIsDrinking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hunger, setHunger] = useState(40);
  const [thirst, setThirst] = useState(40);
  const [energy, setEnergy] = useState(70);

  const dookRef = useRef(null);
  const squeakRef = useRef(null);
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
      setStatus("Your ferret sniffs around, glancing at the bowls.");
    } else if (energy < 25) {
      setMood("Sleepy");
      setStatus("Your ferret stretches long and slow, ready to nap.");
    } else if (isPlaying) {
      setMood("Playful");
      setStatus("Your ferret hops and wiggles with excitement.");
    } else if (isLeaningIn) {
      setMood("Affectionate");
      setStatus("Your ferret nuzzles into your hand with soft dooks.");
    } else {
      setMood("Calm");
      setStatus("Your ferret watches you with bright, curious eyes.");
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
    setStatus("You scratch its head. It leans in and dooks happily.");
    playSound(dookRef);
    setTimeout(() => setIsLeaningIn(false), 2500);
  };

  const handleBodyPat = () => {
    setEnergy((e) => Math.min(100, e + 3));
    setStatus("You stroke its back. It wiggles and curls around your hand.");
    playSound(dookRef);
  };

  const handleFeed = () => {
    if (hunger < 20) {
      setStatus("Your ferret sniffs the bowl but isn’t hungry.");
      return;
    }
    setIsEating(true);
    setStatus("Your ferret scurries over and starts eating quickly.");
    playSound(eatRef);
    setHunger((h) => Math.max(0, h - 50));
    setEnergy((e) => Math.min(100, e + 10));
    setTimeout(() => {
      setIsEating(false);
      setStatus("Finished eating, your ferret wipes its face with its paws.");
    }, 3000);
  };

  const handleDrink = () => {
    if (thirst < 20) {
      setStatus("Your ferret looks at the water but isn’t thirsty.");
      return;
    }
    setIsDrinking(true);
    setStatus("Your ferret drinks quickly, whiskers twitching.");
    playSound(drinkRef);
    setThirst((t) => Math.max(0, t - 50));
    setTimeout(() => {
      setIsDrinking(false);
      setStatus("Refreshed, your ferret shakes its coat.");
    }, 2500);
  };

  const handlePlay = () => {
    if (energy < 20) {
      setStatus("Your ferret squeaks softly, too tired to play.");
      playSound(squeakRef);
      return;
    }
    setIsPlaying(true);
    setStatus("Your ferret chases the toy with excited hops.");
    playSound(playRef);
    setEnergy((e) => Math.max(0, e - 20));
    setTimeout(() => {
      setIsPlaying(false);
      setStatus("Your ferret flops onto its side, proud of itself.");
    }, 3500);
  };

  const getMoodColor = () => {
    switch (mood) {
      case "Affectionate":
        return "#ffe7d1";
      case "Playful":
        return "#fff3d1";
      case "Uncomfortable":
        return "#ffe0e0";
      case "Sleepy":
        return "#f0eaff";
      default:
        return "#f7f7f7";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fff3e6, #f5e0c8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        boxSizing: "border-box",
        fontFamily: "'Segoe UI', system-ui",
      }}
    >
      <audio ref={dookRef} src="/sounds/ferret-dook.mp3" />
      <audio ref={squeakRef} src="/sounds/ferret-squeak.mp3" />
      <audio ref={eatRef} src="/sounds/ferret-eat.mp3" />
      <audio ref={drinkRef} src="/sounds/ferret-drink.mp3" />
      <audio ref={playRef} src="/sounds/ferret-play.mp3" />

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
          Cinnamon Ferret Companion
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
                  "radial-gradient(circle at 20% 0%, #ffe2c4, #f7e7d1 55%, #f0d8b8 100%)",
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
                  width: "200px",
                  height: "110px",
                  borderRadius: "110px",
                  background:
                    "linear-gradient(180deg, #c47a3a, #a05f2a 60%, #7a471f)",
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
                    width: "110px",
                    height: "70px",
                    borderRadius: "70px",
                    background:
                      "radial-gradient(circle at 30% 20%, #ffddb8, #c46a22 70%)",
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
                    "linear-gradient(180deg, #ffe6c7, #f7d3a1 70%, #e8b87a)",
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
              backgroundColor: "#fff4e6",
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
