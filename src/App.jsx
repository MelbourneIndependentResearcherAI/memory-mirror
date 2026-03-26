import { useState, useEffect } from "react";
import "./styles/App.css";
import "./styles/landing.css";

// Auth
import { useAuth } from "./hooks/useAuth";

// Pre-auth pages
import LandingPage  from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import PricingPage  from "./pages/PricingPage";
import FaqPage      from "./pages/FaqPage";

// App pages
import CarerHireAI  from "./apps/CarerHireAI";
import LittleOnesAI from "./apps/LittleOnesAI";
import MemoryMirror from "./pages/MemoryMirror";
import FreshStartAI from "./pages/FreshStartAI";
import Dialpad      from "./pages/Dialpad";
import Banking      from "./pages/Banking";
import PhotoHub     from "./pages/PhotoHub";
import MusicTherapy from "./pages/MusicTherapy";

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const TILES = [
  { id: "memory",  icon: "🧠", label: "Memory Mirror",   desc: "Your memories & life story",   tier: "free" },
  { id: "carer",   icon: "🌿", label: "Carer Companion",  desc: "Talk with your AI carer",      tier: "care" },
  { id: "little",  icon: "💜", label: "Little Ones AI",   desc: "Chat with the grandkids",      tier: "care" },
  { id: "fresh",   icon: "🌅", label: "Fresh Start",      desc: "Morning routine & wellness",   tier: "care" },
  { id: "dialpad", icon: "📞", label: "Phone",            desc: "Call your loved ones",         tier: "care" },
  { id: "banking", icon: "💳", label: "My Accounts",      desc: "View your balance safely",     tier: "free" },
  { id: "photos",  icon: "🖼️", label: "Photo Hub",        desc: "Browse your memories",         tier: "free" },
  { id: "music",   icon: "🎵", label: "Music Therapy",    desc: "Familiar, calming music",      tier: "free" },
];

const TIER_LABELS = { free: "Free", care: "Care Plan", premium: "Premium" };

function UpgradeModal({ currentTier, onUpgrade, onClose }) {
  return (
    <div className="upgrade-overlay" onClick={onClose}>
      <div className="upgrade-modal" onClick={e => e.stopPropagation()}>
        <div className="upgrade-modal-icon">🔒</div>
        <div className="upgrade-modal-title">Feature not included</div>
        <p className="upgrade-modal-desc">
          This feature is available on the <strong>Care Plan</strong> and above.
          Upgrade to unlock all AI companions, morning routine tools, and more.
        </p>
        <div className="upgrade-modal-actions">
          <button className="upgrade-modal-btn-primary" onClick={onUpgrade}>
            View Plans & Upgrade →
          </button>
          <button className="upgrade-modal-btn-ghost" onClick={onClose}>
            Not right now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { user, tier, isRegistered, hasTier, register, selectTier, signOut, canAccess, maxPersonas } = useAuth();

  // Pre-auth navigation: landing | register | pricing | faq
  const [preView, setPreView] = useState("landing");

  // In-app navigation
  const [view, setView]                 = useState("home");
  const [voiceKey, setVoiceKey]         = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [upgradeOpen, setUpgradeOpen]   = useState(false);
  const now = useClock();

  const commonProps = { voiceKey, onBack: () => setView("home") };

  // ── PRE-AUTH FLOW ────────────────────────────────────────────────
  if (!isRegistered) {
    if (preView === "faq")      return <FaqPage       onBack={() => setPreView("landing")} onGetStarted={() => setPreView("register")} />;
    if (preView === "pricing")  return <PricingPage   onBack={() => setPreView("landing")} onSelect={() => setPreView("register")} onFaq={() => setPreView("faq")} />;
    if (preView === "register") return <RegisterPage
        onRegister={(name, email) => { register(name, email); setPreView("pricing-select"); }}
        onBack={() => setPreView("landing")}
        onSignIn={() => {
          // If they already registered (e.g. returning user), go home
          if (isRegistered) { setPreView("home"); } else { setPreView("landing"); }
        }}
      />;
    // "pricing-select" is a special state reached only after registration
    if (preView === "pricing-select") return <PricingPage
        onSelect={(t) => { selectTier(t); }}
        currentTier={tier}
        onFaq={() => setPreView("faq")}
      />;
    return <LandingPage
        onGetStarted={() => setPreView("register")}
        onSignIn={() => isRegistered ? null : setPreView("register")}
        onFaq={() => setPreView("faq")}
        onPricing={() => setPreView("pricing")}
      />;
  }

  // ── REGISTERED BUT NO TIER ───────────────────────────────────────
  if (!hasTier) {
    return <PricingPage
      onSelect={(t) => { selectTier(t); }}
      currentTier={tier}
      onFaq={() => setPreView("faq")}
    />;
  }

  // ── IN-APP FAQ / PRICING ─────────────────────────────────────────
  if (preView === "faq")     return <FaqPage      onBack={() => setPreView("home")} />;
  if (preView === "pricing") return <PricingPage
    onSelect={(t) => { selectTier(t); setPreView("home"); }}
    currentTier={tier}
    onBack={() => setPreView("home")}
    onFaq={() => setPreView("faq")}
  />;

  // ── IN-APP PAGES ─────────────────────────────────────────────────
  if (view === "memory")  return <MemoryMirror  {...commonProps} />;
  if (view === "carer")   return <CarerHireAI   {...commonProps} maxPersonas={maxPersonas} />;
  if (view === "little")  return <LittleOnesAI  {...commonProps} maxPersonas={maxPersonas} />;
  if (view === "fresh")   return <FreshStartAI  {...commonProps} />;
  if (view === "dialpad") return <Dialpad       {...commonProps} />;
  if (view === "banking") return <Banking       {...commonProps} />;
  if (view === "photos")  return <PhotoHub      {...commonProps} />;
  if (view === "music")   return <MusicTherapy  {...commonProps} />;

  const timeStr = now.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // ── HOME SCREEN ──────────────────────────────────────────────────
  return (
    <div className="home-screen">
      <header className="home-header">
        <div className="home-brand">
          <span className="home-brand-icon">🪞</span>
          <div>
            <div className="home-brand-name">Memory Mirror</div>
            <div className="home-brand-tagline">
              Welcome back, {user?.name?.split(" ")[0] || "friend"} · {TIER_LABELS[tier] || "Free"} plan
            </div>
          </div>
        </div>

        <div className="home-clock">
          <div className="home-clock-time">{timeStr}</div>
          <div className="home-clock-date">{dateStr}</div>
        </div>

        <button
          className="home-settings-btn"
          onClick={() => setShowSettings(s => !s)}
          title="Settings"
          aria-label="Settings"
        >⚙️</button>
      </header>

      {showSettings && (
        <div className="home-settings-panel">
          <label className="home-settings-label">ElevenLabs Voice Key</label>
          <input
            type="password"
            className="home-settings-input"
            value={voiceKey}
            onChange={e => setVoiceKey(e.target.value)}
            placeholder="Paste your ElevenLabs API key here"
          />
          <p className="home-settings-hint">
            Required for premium voice in Carer Companion and Little Ones AI.
          </p>
          <div style={{ flexBasis: "100%", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="l-btn-small"
              onClick={() => { setShowSettings(false); setPreView("pricing"); }}
            >
              Change Plan
            </button>
            <button
              className="l-btn-small"
              onClick={() => { setShowSettings(false); setPreView("faq"); }}
            >
              FAQ
            </button>
            <button
              className="l-btn-small"
              style={{ color: "#f87171", borderColor: "#3a1a1a" }}
              onClick={() => { signOut(); setPreView("landing"); }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      <main className="home-grid-container">
        <div className="home-grid">
          {TILES.map(tile => {
            const unlocked = canAccess(tile.id);
            if (unlocked) {
              return (
                <button key={tile.id} className="home-tile" onClick={() => setView(tile.id)}>
                  <span className="home-tile-icon">{tile.icon}</span>
                  <span className="home-tile-label">{tile.label}</span>
                  <span className="home-tile-desc">{tile.desc}</span>
                </button>
              );
            }
            return (
              <button
                key={tile.id}
                className="home-tile home-tile-locked"
                onClick={() => setUpgradeOpen(true)}
              >
                <span className="home-tile-lock-icon">🔒 Upgrade</span>
                <span className="home-tile-icon">{tile.icon}</span>
                <span className="home-tile-label">{tile.label}</span>
                <span className="home-tile-desc">{tile.desc}</span>
              </button>
            );
          })}
        </div>
      </main>

      <footer className="home-footer">
        <p>Memory Mirror · MM AI Technologies · Demo Mode</p>
      </footer>

      {upgradeOpen && (
        <UpgradeModal
          currentTier={tier}
          onUpgrade={() => { setUpgradeOpen(false); setPreView("pricing"); }}
          onClose={() => setUpgradeOpen(false)}
        />
      )}
    </div>
  );
}
