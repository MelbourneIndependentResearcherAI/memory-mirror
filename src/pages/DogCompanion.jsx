import React, { useState, useEffect, useRef } from "react";

export default function DogCompanion() {
  const [mood, setMood] = useState("Calm");
  const [status, setStatus] = useState("Your choc lab is resting peacefully.");
  const [isLeaningIn, setIsLeaningIn] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [isDrinking, setIsDrinking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hunger, setHunger] = useState(40); // 0–100
  const [thirst, setThirst] = useState(40);
  const [energy, setEnergy] = useState(70);

  const barkSoundRef = useRef(null);
  const whineSoundRef = useRef(null);
  const eatSoundRef = useRef(null);
  const drinkSoundRef = useRef(null);
  const playSoundRef = useRef(null);

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
      setStatus("Your choc lab looks a little unsettled and glances at the bowls.");
    } else if (energy < 25) {
      setMood("Sleepy");
      setStatus("Your choc lab is getting sleepy and slows its movements.");
    } else if (isPlaying) {
      setMood("Playful");
      setStatus("Your choc lab is joyfully chasing the ball.");
    } else if (isLeaningIn) {
      setMood("Affectionate");
      setStatus("Your choc lab leans into your touch, eyes soft and trusting.");
    } else {
      setMood("Calm");
      setStatus("Your choc lab is calmly watching you, breathing gently.");
    }
  }, [hunger, thirst, energy, isPlaying, isLeaningIn]);

  const playSound = (ref) => {
    if (ref && ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    }
  };

  const handleHeadPat = () => {
    setIsLeaningIn(true);
    setEnergy((e) => Math.min(100, e + 5));
    setStatus("You gently pat its head. It leans in and rubs against your hand.");
    playSound(barkSoundRef);

    setTimeout(() => {
      setIsLeaningIn(false);
    }, 2500);
  };

  const handleBodyPat = () => {
    setEnergy((e) => Math.min(100, e + 3));
    setStatus("You stroke its back. Its tail thumps softly against the floor.");
    playSound(barkSoundRef);
  };

  const handleFeed = () => {
    if (hunger < 20) {
      setStatus("Your choc lab sniffs the bowl but isn’t very hungry right now.");
      return;
    }
    setIsEating(true);
    setStatus("Your choc lab walks to the bowl and starts eating slowly.");
    playSound(eatSoundRef);
    setHunger((h) => Math.max(0, h - 50));
    setEnergy((e) => Math.min(100, e + 10));

    setTimeout(() => {
      setIsEating(false);
      setStatus("Finished eating, your choc lab looks content and licks its nose.");
    }, 3000);
  };

  const handleDrink = () => {
    if (thirst < 20) {
      setStatus("Your choc lab glances at the water but doesn’t seem thirsty.");
      return;
    }
    setIsDrinking(true);
    setStatus("Your choc lab pads over and laps gently at the water.");
    playSound(drinkSoundRef);
    setThirst((t) => Math.max(0, t - 50));

    setTimeout(() => {
      setIsDrinking(false);
      setStatus("Refreshed, your choc lab gives a soft sigh and settles.");
    }, 2500);
  };

  const handlePlay = () => {
    if (energy < 20) {
      setStatus("Your choc lab looks at the ball, then at you, too tired to play.");
      playSound(whineSoundRef);
      return;
    }
    setIsPlaying(true);
    setStatus("You tap the ball. Your choc lab bounds after it, tail wagging hard.");
    playSound(playSoundRef);
    setEnergy((e) => Math.max(0, e - 20));

    setTimeout(() => {
      setIsPlaying(false);
      setStatus("Your choc lab trots back, dropping the ball near you with bright eyes.");
    }, 3500);
  };

  const getMoodColor = () => {
    switch (mood) {
      case "Affectionate":
        return "#f7d9c4";
      case "Playful":
        return "#d4f5ff";
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
        background: "linear-gradient(180deg, #f7fbff, #e6edf5)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        boxSizing: "border-box",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      <audio ref={barkSoundRef} src="/sounds/dog-bark.mp3" />
      <audio ref={whineSoundRef} src="/sounds/dog-whine.mp3" />
      <audio ref={eatSoundRef} src="/sounds/dog-eat.mp3" />
      <audio ref={drinkSoundRef} src="/sounds/dog-drink.mp3" />
      <audio ref={playSoundRef} src="/sounds/dog-play.mp3" />

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
        <header
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: 700,
              color: "#1f2933",
            }}
          >
            Chocolate Lab Companion
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#4b5563",
            }}
          >
            A gentle, realistic companion who responds to your touch, care, and play.
          </p>
        </header>

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
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                  }}
                >
                  Mood
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  {mood}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  fontSize: "12px",
                  color: "#4b5563",
                }}
              >
                <span>Hunger: {hunger}</span>
                <span>Thirst: {thirst}</span>
                <span>Energy: {energy}</span>
              </div>
            </div>

            <div
              style={{
                position: "relative",
                borderRadius: "18px",
                background:
                  "radial-gradient(circle at 20% 0%, #fef3e2, #e3edf7 55%, #d7e2f0 100%)",
                height: "260px",
                overflow: "hidden",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                padding: "12px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40px",
                  background:
                    "radial-gradient(circle at 50% -40%, rgba(0,0,0,0.12), transparent 70%)",
                  opacity: 0.7,
                }}
              />

              <div
                onClick={handleBodyPat}
                style={{
                  position: "absolute",
                  bottom: "40px",
                  width: "220px",
                  height: "120px",
                  borderRadius: "120px",
                  background:
                    "linear-gradient(180deg, #5b3b26, #3b2416 60%, #2a1a10)",
                  boxShadow:
                    "0 10px 25px rgba(0,0,0,0.35), inset 0 0 12px rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "transform 220ms ease-out",
                  transform: isLeaningIn
                    ? "translateY(6px) scale(1.02)"
                    : isPlaying
                    ? "translateY(-4px) scale(1.03)"
                    : "translateY(0)",
                }}
                aria-label="Pat your dog's body"
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-40px",
                    width: "120px",
                    height: "80px",
                    borderRadius: "80px",
                    background:
                      "radial-gradient(circle at 30% 20%, #f5e0c8, #4a2f1d 70%)",
                    boxShadow:
                      "0 8px 18px rgba(0,0,0,0.35), inset 0 0 10px rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "transform 220ms ease-out",
                    transform: isLeaningIn ? "translateY(6px)" : "translateY(0)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHeadPat();
                  }}
                  aria-label="Pat your dog's head"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        backgroundColor: "#1f2933",
                        boxShadow: "0 0 4px rgba(0,0,0,0.4)",
                      }}
                    />
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        backgroundColor: "#1f2933",
                        boxShadow: "0 0 4px rgba(0,0,0,0.4)",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: "-10px",
                    right: "18px",
                    width: "70px",
                    height: "26px",
                    borderRadius: "26px",
                    background:
                      "linear-gradient(90deg, #4a2f1d, #2b1a10 70%, #1b120b)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "-10px",
                    left: "18px",
                    width: "70px",
                    height: "26px",
                    borderRadius: "26px",
                    background:
                      "linear-gradient(90deg, #1b120b, #2b1a10 30%, #4a2f1d)",
                  }}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "18px",
                  left: "12px",
                  width: "70px",
                  height: "34px",
                  borderRadius: "34px",
                  background:
                    "linear-gradient(180deg, #f5f0e6, #e0d3c0 70%, #c7b59a)",
                  boxShadow:
                    "0 6px 14px rgba(0,0,0,0.25), inset 0 0 8px rgba(255,255,255,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transform: isEating ? "translateY(3px)" : "translateY(0)",
                  transition: "transform 180ms ease-out",
                }}
                onClick={handleFeed}
                aria-label="Tap food bowl"
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#5b4630",
                  }}
                >
                  FOOD
                </span>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "18px",
                  right: "12px",
                  width: "70px",
                  height: "34px",
                  borderRadius: "34px",
                  background:
                    "linear-gradient(180deg, #e7f5ff, #c7e4ff 70%, #a7c8e8)",
                  boxShadow:
                    "0 6px 14px rgba(0,0,0,0.25), inset 0 0 8px rgba(255,255,255,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transform: isDrinking ? "translateY(3px)" : "translateY(0)",
                  transition: "transform 180ms ease-out",
                }}
                onClick={handleDrink}
                aria-label="Tap water bowl"
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#245072",
                  }}
                >
                  WATER
                </span>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "70px",
                  right: "90px",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 30% 30%, #fffbf0, #fbbf77 60%, #e07a2f)",
                  boxShadow:
                    "0 8px 18px rgba(0,0,0,0.35), inset 0 0 8px rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  transform: isPlaying ? "translateX(18px)" : "translateX(0)",
                  transition: "transform 260ms ease-out",
                }}
                onClick={handlePlay}
                aria-label="Tap ball to play"
              />
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "#374151",
                backgroundColor: "rgba(255,255,255,0.8)",
                borderRadius: "14px",
                padding: "10px 12px",
                lineHeight: 1.4,
              }}
            >
              {status}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                backgroundColor: "#f3f4f6",
                borderRadius: "16px",
                padding: "12px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                How to interact
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  fontSize: "13px",
                  color: "#4b5563",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <li>Tap the head to pat your dog. It will lean in and rub into your hand.</li>
                <li>Tap the body to give a gentle stroke and see the tail react.</li>
                <li>Tap the FOOD bowl when hunger is high to feed your dog.</li>
                <li>Tap the WATER bowl when thirst is high to let it drink.</li>
                <li>Tap the ball to start a simple play session.</li>
              </ul>
            </div>

            <div
              style={{
                backgroundColor: "#eef2ff",
                borderRadius: "16px",
                padding: "12px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                Gentle guidance
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#4b5563",
                  lineHeight: 1.4,
                }}
              >
                This companion is here to bring comfort, not pressure. There is no way to “fail” or
                “do it wrong.” Simple taps, slow moments, and small interactions are enough.
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#ecfdf3",
                borderRadius: "16px",
                padding: "12px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#14532d",
                }}
              >
                Emotional safety
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#166534",
                  lineHeight: 1.4,
                }}
              >
                Your choc lab will never judge, never rush, and never demand. It simply responds
                with warmth, presence, and gentle affection whenever you reach out.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
