import React, { useState, useEffect, useRef } from "react";

export default function CatCompanion() {
  const [mood, setMood] = useState("Calm");
  const [status, setStatus] = useState("Your ginger tomcat is lounging peacefully.");
  const [isLeaningIn, setIsLeaningIn] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [isDrinking, setIsDrinking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hunger, setHunger] = useState(40);
  const [thirst, setThirst] = useState(40);
  const [energy, setEnergy] = useState(70);

  const purrRef = useRef(null);
  const meowRef = useRef(null);
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
      setStatus("Your ginger tomcat glances at the bowls with a soft meow.");
    } else if (energy < 25) {
      setMood("Sleepy");
      setStatus("Your ginger tomcat curls its tail and slows down.");
    } else if (isPlaying) {
      setMood("Playful");
      setStatus("Your ginger tomcat is batting the toy with excitement.");
    } else if (isLeaningIn) {
      setMood("Affectionate");
      setStatus("Your ginger tomcat leans into your hand and purrs loudly.");
    } else {
      setMood("Calm");
      setStatus("Your ginger tomcat watches you with slow blinks.");
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
    setStatus("You scratch behind its ears. It melts into your hand.");
    playSound(purrRef);
    setTimeout(() => setIsLeaningIn(false), 2500);
  };

  const handleBodyPat = () => {
    setEnergy((e) => Math.min(100, e + 3));
    setStatus("You stroke its back. Its tail curls happily.");
    playSound(purrRef);
  };

  const handleFeed = () => {
    if (hunger < 20) {
      setStatus("Your ginger tomcat sniffs the bowl but isn’t hungry.");
      return;
    }
    setIsEating(true);
    setStatus("Your ginger tomcat walks over and starts eating delicately.");
    playSound(eatRef);
    setHunger((h) => Math.max(0, h - 50));
    setEnergy((e) => Math.min(100, e + 10));
    setTimeout(() => {
      setIsEating(false);
      setStatus("Finished eating, your ginger tomcat licks its lips.");
    }, 3000);
  };

  const handleDrink = () => {
    if (thirst < 20) {
      setStatus("Your ginger tomcat glances at the water but isn’t thirsty.");
      return;
    }
    setIsDrinking(true);
    setStatus("Your ginger tomcat laps gently at the water.");
    playSound(drinkRef);
    setThirst((t) => Math.max(0, t - 50));
    setTimeout(() => {
      setIsDrinking(false);
      setStatus("Refreshed, your ginger tomcat sits upright and blinks slowly.");
    }, 2500);
  };

  const handlePlay = () => {
    if (energy < 20) {
      setStatus("Your ginger tomcat looks at the toy, too tired to play.");
      playSound(meowRef);
      return;
    }
    setIsPlaying(true);
    setStatus("Your ginger tomcat pounces on the toy with excitement.");
    playSound(playRef);
    setEnergy((e) => Math.max(0, e - 20));
    setTimeout(() => {
      setIsPlaying(false);
      setStatus("Your ginger tomcat sits proudly after the play session.");
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
        background: "linear-gradient(180deg, #fff7f0, #f0e6d8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        boxSizing: "border-box",
        fontFamily: "'Segoe UI', system-ui",
      }}
    >
      <audio ref={purrRef} src="/sounds/cat-purr.mp3" />
      <audio ref={meowRef} src="/sounds/cat-meow.mp3" />
      <audio ref={eatRef} src="/sounds/cat-eat.mp3" />
      <audio ref={drinkRef} src="/sounds/cat-drink.mp3" />
      <audio ref={playRef} src="/sounds/cat-play.mp3" />

      <div
        style={{
          maxWidth: "960px",
          width: "100%",
          backgroundColor: "white",
          borderRadius: "24px",
          boxShadow: "0 18px 45px rgba(0,0,0,0.08)",
          padding: "20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>
          Ginger Tomcat Companion
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
            <div
              style={{
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
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
                    "linear-gradient(180deg, #d87a2f, #b45f1f 60%, #8a4718)",
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
            Tap head to pat  
            Tap body to stroke  
            Tap food bowl  
            Tap water bowl  
            Tap toy to play  
          </div>
        </section>
      </div>
    </div>
  );
}
