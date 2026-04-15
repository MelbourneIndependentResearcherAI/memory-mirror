# update-memory-mirror.ps1
$ErrorActionPreference = "Stop"

$root    = Get-Location
$src     = Join-Path $root "src"
$screens = Join-Path $src "screens"

if (!(Test-Path $src)) {
  throw "Could not find src folder at $src"
}
if (!(Test-Path $screens)) {
  New-Item -ItemType Directory -Path $screens | Out-Null
}

Write-Host "Updating Memory Mirror core files..." -ForegroundColor Cyan

# 1) App.jsx
$appPath = Join-Path $src "App.jsx"
@'
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useVoice } from "./useVoice.js";

// Core screens
import DashboardAnimated from "./screens/DashboardAnimated";
import Buddy from "./screens/Buddy";

// Wellness & grounding
import FireCircle from "./screens/FireCircle";
import Breathing from "./screens/Breathing";
import CalmCorner from "./screens/CalmCorner";
import NightSafe from "./screens/NightSafe";
import MusicTherapy from "./screens/MusicTherapy";

// Safety & daily support
import MedicineHelper from "./screens/MedicineHelper";
import KitchenSafety from "./screens/KitchenSafety";
import MedicineSchedule from "./screens/MedicineSchedule";

// Premium emotional spaces
import MobHealingRoom from "./screens/MobHealingRoom";
import GrandkidsHub from "./screens/GrandkidsHub";
import PetsBuddyRoom from "./screens/PetsBuddyRoom";

// Extra tools
import FakePhone from "./screens/FakePhone";
import Banking from "./screens/Banking";
import PhotoHub from "./screens/PhotoHub";

export default function App() {
  // Global always-listenin mob-friendly voice assistant
  useVoice();

  const darkMode = false;
  const buddy = "Aunty Bev";

  return (
    <div className={darkMode ? "bg-black text-white" : "bg-slate-900 text-white"}>
      <Router>
        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={<DashboardAnimated darkMode={darkMode} buddy={buddy} />}
          />

          {/* COMPANION */}
          <Route
            path="/buddy"
            element={<Buddy darkMode={darkMode} buddy={buddy} />}
          />

          {/* WELLNESS */}
          <Route path="/fire" element={<FireCircle darkMode={darkMode} />} />
          <Route path="/breathing" element={<Breathing darkMode={darkMode} />} />
          <Route path="/calm" element={<CalmCorner darkMode={darkMode} />} />
          <Route path="/night" element={<NightSafe darkMode={darkMode} />} />
          <Route
            path="/music"
            element={<MusicTherapy darkMode={darkMode} />}
          />

          {/* SAFETY */}
          <Route
            path="/medicine-helper"
            element={<MedicineHelper darkMode={darkMode} />}
          />
          <Route
            path="/kitchen-safety"
            element={<KitchenSafety darkMode={darkMode} />}
          />
          <Route
            path="/medicine-schedule"
            element={<MedicineSchedule darkMode={darkMode} />}
          />

          {/* EMOTIONAL SPACES */}
          <Route
            path="/healing-room"
            element={<MobHealingRoom darkMode={darkMode} />}
          />
          <Route
            path="/grandkids"
            element={<GrandkidsHub darkMode={darkMode} />}
          />
          <Route
            path="/pets-buddy"
            element={<PetsBuddyRoom darkMode={darkMode} buddy={buddy} />}
          />

          {/* EXTRA TOOLS */}
          <Route path="/fake-phone" element={<FakePhone darkMode={darkMode} />} />
          <Route path="/banking" element={<Banking darkMode={darkMode} />} />
          <Route path="/photos" element={<PhotoHub darkMode={darkMode} />} />
        </Routes>
      </Router>
    </div>
  );
}
'@ | Set-Content -Encoding UTF8 $appPath

# 2) useVoice.js
$voicePath = Join-Path $src "useVoice.js"
@'
import { useEffect, useRef } from "react";

export function useVoice() {
  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);

  const wakePhrases = [
    "hey you there",
    "hey assistant",
    "hey",
    "hello",
    "hi",
    "excuse me",
  ];

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-AU";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      listeningRef.current = true;
      console.log("Voice: listenin");
    };

    recognition.onend = () => {
      listeningRef.current = false;
      console.log("Voice: reconnectin…");
      setTimeout(() => tryStart(), 600);
    };

    recognition.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      const text = last[0].transcript.trim().toLowerCase();
      console.log("Eard:", text);
      handleCommand(text);
    };

    recognition.onerror = (e) => {
      console.error("Voice error:", e.error);
    };

    recognitionRef.current = recognition;
    tryStart();

    return () => recognition.stop();
  }, []);

  function tryStart() {
    const rec = recognitionRef.current;
    if (!rec || listeningRef.current) return;
    try {
      rec.start();
    } catch (e) {
      console.error("Start error:", e);
    }
  }

  function speak(message) {
    const synth = window.speechSynthesis;
    if (!synth) return;

    const utter = new SpeechSynthesisUtterance(message);
    utter.lang = "en-AU";
    utter.rate = 0.85;
    utter.pitch = 1;
    synth.cancel();
    synth.speak(utter);
  }

  function handleCommand(text) {
    if (wakePhrases.some((phrase) => text.includes(phrase))) {
      speak("Yeah I'm ere, deadly bruz. Wat you need?");
      return;
    }

    if (text.includes("time") || text.includes("what time")) {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-AU", {
        hour: "numeric",
        minute: "2-digit",
      });
      speak(`Da time now is ${timeString}, deadly.`);
      return;
    }

    if (text.includes("day") || text.includes("what day")) {
      const now = new Date();
      const dayString = now.toLocaleDateString("en-AU", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      speak(`Today is ${dayString}, my friend.`);
      return;
    }

    if (
      text.includes("calm") ||
      text.includes("anxious") ||
      text.includes("worried") ||
      text.includes("help me relax")
    ) {
      speak(
        "Take a slow breaf wif me, bruz. In… an out… You’re safe, I'm right ere wif you."
      );
      return;
    }

    if (text.includes("music") || text.includes("song") || text.includes("radio")) {
      speak("We can go to da music screen, sis. Tap da music tile or ask someone to open it for you.");
      return;
    }

    if (text.includes("remind") || text.includes("reminder")) {
      speak(
        "Deadly, just tell me wat you wanna remember an I'll elp you out."
      );
      return;
    }

    if (
      text.includes("what can you do") ||
      text.includes("i'm confused") ||
      text.includes("i dont know") ||
      text.includes("i don't know")
    ) {
      speak(
        "All good, my friend. I can tell you da time, da day, or elp you feel calmer."
      );
      return;
    }

    speak(
      "I eard you, bruz. Not too sure wat you mean, but I can tell you da time, da day, or elp you calm down."
    );
  }
}
'@ | Set-Content -Encoding UTF8 $voicePath

# 3) DashboardAnimated.jsx
$dashboardPath = Join-Path $screens "DashboardAnimated.jsx"
@'
import React from "react";
import { Link } from "react-router-dom";

export default function DashboardAnimated({ darkMode, buddy }) {
  const tiles = [
    {
      title: "Talk to " + buddy,
      path: "/buddy",
      color: "from-indigo-500 to-indigo-700",
    },
    {
      title: "Calm Corner",
      path: "/calm",
      color: "from-emerald-500 to-emerald-700",
    },
    {
      title: "Breathing",
      path: "/breathing",
      color: "from-sky-500 to-sky-700",
    },
    {
      title: "Night Safe",
      path: "/night",
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Music Therapy",
      path: "/music",
      color: "from-pink-500 to-rose-700",
    },
    {
      title: "Kitchen Safety",
      path: "/kitchen-safety",
      color: "from-orange-500 to-orange-700",
    },
    {
      title: "Medicine Helper",
      path: "/medicine-helper",
      color: "from-rose-500 to-rose-700",
    },
    {
      title: "Healing Room",
      path: "/healing-room",
      color: "from-teal-500 to-teal-700",
    },
    {
      title: "Grandkids Hub",
      path: "/grandkids",
      color: "from-yellow-500 to-yellow-700",
    },
    {
      title: "Pets Buddy",
      path: "/pets-buddy",
      color: "from-pink-500 to-pink-700",
    },
    {
      title: "Fake Phone",
      path: "/fake-phone",
      color: "from-slate-500 to-slate-700",
    },
    {
      title: "Fake Banking",
      path: "/banking",
      color: "from-lime-500 to-lime-700",
    },
    {
      title: "Photos & Videos",
      path: "/photos",
      color: "from-cyan-500 to-cyan-700",
    },
  ];

  return (
    <div
      className={`min-h-screen px-6 py-10 ${
        darkMode ? "bg-black text-white" : "bg-slate-900 text-white"
      }`}
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">I'm ere wif you</h1>
        <p className="text-lg text-gray-300">
          You can just yarn to me anytime.
        </p>

        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_12px_rgba(34,197,94,0.8)]"></span>
          <span className="text-sm text-gray-300">Listenin…</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {tiles.map((tile) => (
          <Link
            key={tile.title}
            to={tile.path}
            className={`
              bg-gradient-to-br ${tile.color}
              rounded-3xl p-6 shadow-xl
              hover:scale-[1.03] hover:shadow-2xl
              transition-all duration-200
              text-white text-left
            `}
          >
            <h2 className="text-2xl font-semibold mb-2">{tile.title}</h2>
            <p className="text-sm opacity-80">Tap to open</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
'@ | Set-Content -Encoding UTF8 $dashboardPath

# 4) MusicTherapy.jsx
$musicPath = Join-Path $screens "MusicTherapy.jsx"
@'
import React, { useState, useEffect, useRef } from "react";

const RADIO_STATIONS = [
  {
    name: "ABC Radio",
    url: "https://live-radio01.mediahubaustralia.com/2LRW/mp3/",
  },
  {
    name: "Triple J",
    url: "https://live-radio01.mediahubaustralia.com/2TJW/mp3/",
  },
];

export default function MusicTherapy({ darkMode }) {
  const [currentStation, setCurrentStation] = useState(RADIO_STATIONS[0]);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const [youtubeQuery, setYoutubeQuery] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [tracks, setTracks] = useState([]);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(null);
  const [memoryText, setMemoryText] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("mm_music_tracks");
    if (saved) {
      setTracks(JSON.parse(saved));
    }
    const savedMemory = localStorage.getItem("mm_music_memory_text");
    if (savedMemory) {
      setMemoryText(savedMemory);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mm_music_tracks", JSON.stringify(tracks));
  }, [tracks]);

  useEffect(() => {
    localStorage.setItem("mm_music_memory_text", memoryText);
  }, [memoryText]);

  const handleRadioPlay = () => {
    setIsRadioPlaying(true);
  };

  const handleRadioStop = () => {
    setIsRadioPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleNextStation = () => {
    const currentIndex = RADIO_STATIONS.findIndex(
      (s) => s.name === currentStation.name
    );
    const nextIndex = (currentIndex + 1) % RADIO_STATIONS.length;
    setCurrentStation(RADIO_STATIONS[nextIndex]);
    setIsRadioPlaying(true);
  };

  const handleYoutubeSearch = (e) => {
    e.preventDefault();
    if (!youtubeQuery.trim()) return;
    const url =
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(youtubeQuery);
    setYoutubeUrl(url);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newTracks = [];

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      newTracks.push({
        name: file.name,
        url,
      });
    });

    setTracks((prev) => [...prev, ...newTracks]);
  };

  const handleSelectTrack = (index) => {
    setSelectedTrackIndex(index);
  };

  const selectedTrack = selectedTrackIndex !== null ? tracks[selectedTrackIndex] : null;

  return (
    <div
      className={`min-h-screen px-6 py-8 ${
        darkMode ? "bg-black text-white" : "bg-slate-900 text-white"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4">Music Therapy</h1>
      <p className="text-gray-300 mb-6">
        Deadly, we can listen to radio, YouTube music, or your own songs. You’re safe ere.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Radio */}
        <div className="bg-slate-800 rounded-2xl p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Local Radio (online)</h2>
          <p className="text-sm text-gray-300 mb-3">
            If da internet is off, radio might not work, sis.
          </p>
          <div className="mb-3">
            <div className="text-lg font-medium mb-1">
              {currentStation.name}
            </div>
            <audio
              ref={audioRef}
              src={currentStation.url}
              controls
              autoPlay={isRadioPlaying}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRadioPlay}
              className="px-3 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-sm"
            >
              Play
            </button>
            <button
              onClick={handleRadioStop}
              className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-sm"
            >
              Stop
            </button>
            <button
              onClick={handleNextStation}
              className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-sm"
            >
              Next station
            </button>
          </div>
        </div>

        {/* YouTube search */}
        <div className="bg-slate-800 rounded-2xl p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">YouTube Music (online)</h2>
          <p className="text-sm text-gray-300 mb-3">
            Type a song or singer. We’ll open YouTube for you.
          </p>
          <form onSubmit={handleYoutubeSearch} className="flex gap-2 mb-3">
            <input
              type="text"
              value={youtubeQuery}
              onChange={(e) => setYoutubeQuery(e.target.value)}
              className="flex-1 rounded-xl px-3 py-2 bg-slate-900 border border-slate-700 text-sm"
              placeholder="Search deadly songs…"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm"
            >
              Search
            </button>
          </form>
          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-sky-400 underline"
            >
              Open YouTube results
            </a>
          )}
        </div>
      </div>

      {/* Offline MP3 section */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="bg-slate-800 rounded-2xl p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Your own songs (offline)</h2>
          <p className="text-sm text-gray-300 mb-3">
            You can add MP3 files. Dey stay on this device, even wif no internet.
          </p>
          <input
            type="file"
            accept="audio/mpeg,audio/mp3"
            multiple
            onChange={handleFileUpload}
            className="mb-3 text-sm"
          />
          <div className="max-h-48 overflow-y-auto space-y-1">
            {tracks.length === 0 && (
              <p className="text-sm text-gray-400">
                No songs yet. Add some deadly tracks, bruz.
              </p>
            )}
            {tracks.map((track, index) => (
              <button
                key={index}
                onClick={() => handleSelectTrack(index)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm ${
                  selectedTrackIndex === index
                    ? "bg-indigo-600"
                    : "bg-slate-900 hover:bg-slate-700"
                }`}
              >
                {track.name}
              </button>
            ))}
          </div>
          {selectedTrack && (
            <div className="mt-3">
              <div className="text-sm font-medium mb-1">
                Now playin: {selectedTrack.name}
              </div>
              <audio src={selectedTrack.url} controls className="w-full" />
            </div>
          )}
        </div>

        {/* Memory / yarn box */}
        <div className="bg-slate-800 rounded-2xl p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Yarn about this moment</h2>
          <p className="text-sm text-gray-300 mb-3">
            You can write a little story about wat this music means to you.
          </p>
          <textarea
            value={memoryText}
            onChange={(e) => setMemoryText(e.target.value)}
            rows={8}
            className="w-full rounded-xl px-3 py-2 bg-slate-900 border border-slate-700 text-sm"
            placeholder="This song reminds me of…"
          />
        </div>
      </div>
    </div>
  );
}
'@ | Set-Content -Encoding UTF8 $musicPath

# 5) FakePhone.jsx
$fakePhonePath = Join-Path $screens "FakePhone.jsx"
@'
import React, { useState } from "react";

const DIGITS = ["1","2","3","4","5","6","7","8","9","*","0","#"];

export default function FakePhone({ darkMode }) {
  const [number, setNumber] = useState("");

  const handlePress = (d) => {
    setNumber((prev) => (prev + d).slice(0, 20));
  };

  const handleClear = () => setNumber("");
  const handleFakeCall = () => {
    alert("This is a safe pretend call only, my friend.");
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 ${
        darkMode ? "bg-black text-white" : "bg-slate-900 text-white"
      }`}
    >
      <div className="bg-slate-800 rounded-3xl p-6 shadow-2xl max-w-xs w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Fake Phone</h1>
        <p className="text-xs text-gray-300 mb-2 text-center">
          This is just pretend, sis. No real calls happen ere.
        </p>
        <div className="mb-4">
          <div className="w-full rounded-2xl bg-black/60 px-3 py-3 text-center text-xl tracking-widest">
            {number || "Tap numbers"}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {DIGITS.map((d) => (
            <button
              key={d}
              onClick={() => handlePress(d)}
              className="h-12 rounded-full bg-slate-700 hover:bg-slate-600 text-lg font-semibold"
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleFakeCall}
            className="flex-1 h-10 rounded-full bg-green-600 hover:bg-green-500 text-sm font-semibold"
          >
            Call (pretend)
          </button>
          <button
            onClick={handleClear}
            className="flex-1 h-10 rounded-full bg-red-600 hover:bg-red-500 text-sm font-semibold"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
'@ | Set-Content -Encoding UTF8 $fakePhonePath

# 6) Banking.jsx
$bankingPath = Join-Path $screens "Banking.jsx"
@'
import React, { useState } from "react";

export default function Banking({ darkMode }) {
  const [balance] = useState("1,234.56");
  const [note, setNote] = useState("");

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        darkMode ? "bg-black text-white" : "bg-slate-900 text-white"
      }`}
    >
      <div className="bg-slate-800 rounded-3xl p-6 shadow-2xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-center">Fake Banking</h1>
        <p className="text-xs text-gray-300 mb-4 text-center">
          This is just pretend, bruz. No real money, no real accounts.
        </p>

        <div className="mb-4 rounded-2xl bg-slate-900 px-4 py-3">
          <div className="text-sm text-gray-300">Available balance</div>
          <div className="text-3xl font-bold mt-1">$ {balance}</div>
        </div>

        <div className="space-y-2 mb-4">
          <button className="w-full h-10 rounded-full bg-slate-700 text-sm hover:bg-slate-600">
            View pretend transactions
          </button>
          <button className="w-full h-10 rounded-full bg-slate-700 text-sm hover:bg-slate-600">
            Pretend transfer
          </button>
          <button className="w-full h-10 rounded-full bg-slate-700 text-sm hover:bg-slate-600">
            Pretend bill pay
          </button>
        </div>

        <div>
          <div className="text-sm font-semibold mb-1">
            Yarn about money worries
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="w-full rounded-2xl px-3 py-2 bg-slate-900 border border-slate-700 text-sm"
            placeholder="You can write how you feel about money. This is just for you."
          />
        </div>
      </div>
    </div>
  );
}
'@ | Set-Content -Encoding UTF8 $bankingPath

# 7) PhotoHub.jsx
$photoPath = Join-Path $screens "PhotoHub.jsx"
@'
import React, { useState, useEffect } from "react";

export default function PhotoHub({ darkMode }) {
  const [items, setItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("mm_photos");
    if (saved) {
      setItems(JSON.parse(saved));
    }
    const savedDesc = localStorage.getItem("mm_photos_description");
    if (savedDesc) {
      setDescription(savedDesc);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mm_photos", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("mm_photos_description", description);
  }, [description]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newItems = [];

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      newItems.push({
        name: file.name,
        url,
        type: file.type.startsWith("video") ? "video" : "image",
      });
    });

    setItems((prev) => [...prev, ...newItems]);
  };

  const selectedItem =
    selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <div
      className={`min-h-screen px-6 py-8 ${
        darkMode ? "bg-black text-white" : "bg-slate-900 text-white"
      }`}
    >
      <h1 className="text-3xl font-bold mb-2">Photos & Videos</h1>
      <p className="text-gray-300 mb-4">
        You can add pictures or videos, an write a little yarn about dat moment.
      </p>

      <div className="mb-4">
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFiles}
          className="text-sm"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-slate-800 rounded-2xl p-4 shadow-lg max-h-[60vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-3">Your memories</h2>
          {items.length === 0 && (
            <p className="text-sm text-gray-400">
              No memories yet. You can add some photos or videos.
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`rounded-xl overflow-hidden border ${
                  selectedIndex === index
                    ? "border-indigo-500"
                    : "border-slate-700"
                }`}
              >
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-24 object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-24 object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Yarn about this moment</h2>
          {selectedItem ? (
            <div className="mb-3">
              <div className="text-sm font-medium mb-1">
                {selectedItem.name}
              </div>
              {selectedItem.type === "image" ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.name}
                  className="w-full max-h-64 object-contain rounded-xl mb-3"
                />
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  className="w-full max-h-64 object-contain rounded-xl mb-3"
                />
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-3">
              Tap a photo or video on da left to see it bigger.
            </p>
          )}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            className="w-full rounded-xl px-3 py-2 bg-slate-900 border border-slate-700 text-sm"
            placeholder="This moment reminds me of…"
          />
        </div>
      </div>
    </div>
  );
}
'@ | Set-Content -Encoding UTF8 $photoPath

Write-Host "All core files updated. Run your dev server and test the new screens." -ForegroundColor Green
