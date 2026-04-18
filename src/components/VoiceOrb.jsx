import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCompanionProfile } from "../utils/companionProfile";
import useCompanionGuide from "../hooks/useCompanionGuide";
import useCompanionEmotion from "../hooks/useCompanionEmotion";
import useSafetyEngine from "../hooks/useSafetyEngine";
import useMemoryEngine from "../hooks/useMemoryEngine";

const SpeechRecognition =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

export default function VoiceOrb() {
  const navigate = useNavigate();
  const location = useLocation();
  const [listening, setListening] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [profile, setProfile] = useState(null);
  const recognitionRef = useRef(null);
  const lastTranscriptRef = useRef("");

  useEffect(() => {
    const p = getCompanionProfile();
    setProfile(p);

    if (!p) {
      if (location.pathname === "/") {
        setStatusText("Tap to set up your companion");
      } else {
        setStatusText("Tap to speak");
      }
    } else {
      setStatusText(`Tap to speak to ${p.name}`);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "en-AU";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => {
      setListening(true);
      setStatusText("Listening�");
    };

    rec.onerror = () => {
      setListening(false);
      setStatusText(profile ? `Tap to speak to ${profile.name}` : "Tap to speak");
    };

    rec.onend = () => {
      setListening(false);
      setStatusText(profile ? `Tap to speak to ${profile.name}` : "Tap to speak");
    };

    rec.onresult = event => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      lastTranscriptRef.current = transcript;
      handleCommand(transcript);
    };

    recognitionRef.current = rec;
  }, [profile]);

  const speak = text => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth || !text) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1;
    synth.speak(utter);
  };

  const getTonePhrase = (base, type = "nav") => {
    const tone = profile?.tone || "gentle";
    if (tone === "quiet") return "";

    if (type === "nav") {
      if (tone === "gentle") return `Okay, I値l ${base}. I知 here with you.`;
      if (tone === "calm") return `Okay, I値l ${base} now.`;
      if (tone === "friendly") return `Got it, I値l ${base} for you.`;
    }

    if (type === "error") {
      if (tone === "gentle") return "I知 not sure I understood that, but we can try again.";
      if (tone === "calm") return "I didn稚 catch that. Please try again.";
      if (tone === "friendly") return "Hmm, I missed that one. Let痴 try again.";
    }

    if (type === "greet") {
      if (tone === "gentle") return `Hi, I知 here with you. What would you like to do?`;
      if (tone === "calm") return `I知 listening. What would you like to do?`;
      if (tone === "friendly") return `Hey, I知 ready. What should we do next?`;
    }

    if (type === "hint") {
      return base;
    }

    return "";
  };

  useCompanionGuide(location.pathname, speak, getTonePhrase);
  useCompanionEmotion(location.pathname, speak, getTonePhrase);
  useSafetyEngine(location.pathname, speak, getTonePhrase, navigate, lastTranscriptRef);
  useMemoryEngine(location.pathname, speak, getTonePhrase);

  const handleCommand = transcript => {
    const name = profile?.name || "companion";

    if (!profile) {
      speak("Let痴 set up your companion first.");
      navigate("/companion-setup");
      return;
    }

    const commands = [
      { words: ["home", "dashboard"], path: "/dashboard", phrase: "take you to the dashboard" },
      { words: ["photo"], path: "/photos", phrase: "open Photos" },
      { words: ["video"], path: "/videos", phrase: "open Videos" },
      { words: ["music", "therapy"], path: "/music", phrase: "start Music Therapy" },
      { words: ["night safe", "night"], path: "/nightsafe", phrase: "open Night Safe" },
      { words: ["calm", "breathe"], path: "/calm", phrase: "open Calm Corner" },
      { words: ["pet", "buddy"], path: "/pets", phrase: "open Pets Buddy" },
      { words: ["bank"], path: "/banking", phrase: "open Banking" },
      { words: ["dial", "phone", "call"], path: "/dialpad", phrase: "open the Dialpad" },
      { words: ["shower"], path: "/shower", phrase: "open Shower Companion" },
      { words: ["legacy", "story"], path: "/legacy", phrase: "open Legacy Builder" },
      { words: ["companion", "settings"], path: "/companion-settings", phrase: "open your companion settings" }
    ];

    for (const cmd of commands) {
      if (cmd.words.some(w => transcript.includes(w))) {
        navigate(cmd.path);
        const phrase = getTonePhrase(cmd.phrase);
        speak(phrase);
        return;
      }
    }

    const errorPhrase = getTonePhrase("", "error");
    if (errorPhrase) speak(errorPhrase.replace("I知", `I知, ${name},`));
  };

  const handleTap = () => {
    if (!profile) {
      navigate("/companion-setup");
      return;
    }

    if (!SpeechRecognition) {
      speak("Voice control is not available on this device.");
      return;
    }

    if (listening) {
      recognitionRef.current && recognitionRef.current.stop();
      return;
    }

    const greet = getTonePhrase("", "greet");
    speak(greet);
    recognitionRef.current && recognitionRef.current.start();
  };

  const glowColor = listening ? "#4da3ff" : "#0066ff";

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: "96px",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 50
      }}
    >
      {statusText && (
        <div
          style={{
            marginBottom: "8px",
            padding: "6px 12px",
            borderRadius: "999px",
            background: "rgba(0,0,0,0.7)",
            color: "#e8f4ff",
            fontSize: "0.75rem",
            maxWidth: "260px",
            textAlign: "center"
          }}
        >
          {statusText}
        </div>
      )}

      <button
        onClick={handleTap}
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          border: "none",
          background:
            "radial-gradient(circle at 30% 0%, #4da3ff 0%, #001133 40%, #000 100%)",
          boxShadow: listening
            ? `0 0 24px ${glowColor}, 0 0 60px rgba(0,102,255,0.8)`
            : "0 0 18px rgba(0,102,255,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: `2px solid ${glowColor}`,
            boxShadow: `0 0 12px ${glowColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              width: "14px",
              height: "24px",
              borderRadius: "999px",
              background: "#e8f4ff",
              opacity: listening ? 1 : 0.8
            }}
          />
        </div>
      </button>
    </div>
  );
}
