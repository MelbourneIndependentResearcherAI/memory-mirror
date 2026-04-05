import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DEVICES = [
  {
    id: "jukebox", label: "Jukebox", accent: "#C4715A",
    image:   "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=700&q=65&fit=crop",
    alt:     "Vintage jukebox glowing with warm neon light",
    desc:    "Big, bold, classic hits",
    overlay: "linear-gradient(160deg, rgba(120,40,10,0.35) 0%, rgba(70,15,0,0.78) 100%)",
    bg:      "linear-gradient(160deg, #2A1208 0%, #160800 100%)",
  },
  {
    id: "vinyl", label: "Vinyl Player", accent: "#9A7AB8",
    image:   "https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=700&q=65&fit=crop",
    alt:     "Warm vintage vinyl record player",
    desc:    "Warm, rich, timeless sound",
    overlay: "linear-gradient(160deg, rgba(60,30,100,0.35) 0%, rgba(30,10,60,0.78) 100%)",
    bg:      "linear-gradient(160deg, #180C30 0%, #0C0618 100%)",
  },
  {
    id: "cassette", label: "Cassette", accent: "#5A8BA8",
    image:   "https://images.unsplash.com/photo-1567443024551-f3e3a7b9cbde?w=700&q=65&fit=crop",
    alt:     "Vintage cassette tape deck in warm tones",
    desc:    "Familiar, nostalgic reels",
    overlay: "linear-gradient(160deg, rgba(20,50,90,0.35) 0%, rgba(8,25,55,0.78) 100%)",
    bg:      "linear-gradient(160deg, #0C1828 0%, #060C18 100%)",
  },
  {
    id: "gramophone", label: "Gramophone", accent: "#A87830",
    image:   "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=700&q=65&fit=crop",
    alt:     "Antique gramophone with large brass horn",
    desc:    "Old-world charm and warmth",
    overlay: "linear-gradient(160deg, rgba(100,60,10,0.35) 0%, rgba(55,28,0,0.78) 100%)",
    bg:      "linear-gradient(160deg, #201208 0%, #100800 100%)",
  },
];

const PLAYLISTS = {
  jukebox:    ["Rock Around the Clock", "Johnny B. Goode", "Blue Suede Shoes", "Hound Dog", "Great Balls of Fire", "Jailhouse Rock"],
  vinyl:      ["What a Wonderful World", "Moon River", "Unforgettable", "Fly Me to the Moon", "Somewhere Over the Rainbow", "La Vie en Rose"],
  cassette:   ["Hotel California", "Go Your Own Way", "Don't Stop Believin'", "Africa", "Take On Me", "Islands in the Stream"],
  gramophone: ["Singin' in the Rain", "As Time Goes By", "Cheek to Cheek", "Puttin' On the Ritz", "Let's Face the Music", "The Way You Look Tonight"],
};

function PlayerControls({ playing, onPlay, onPrev, onNext, accent }) {
  return (
    <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 20 }}>
      <button style={SC.ctrl(accent)} onClick={onPrev} aria-label="Previous track">⏮</button>
      <button style={{ ...SC.ctrl(accent), width: 66, height: 66, fontSize: 26 }} onClick={onPlay} aria-label={playing ? "Pause" : "Play"}>
        {playing ? "⏸" : "▶"}
      </button>
      <button style={SC.ctrl(accent)} onClick={onNext} aria-label="Next track">⏭</button>
    </div>
  );
}

// ── Animated device displays ──────────────────────────────────────────────────
function JukeboxDisplay({ playing, accent }) {
  return (
    <div style={{ textAlign: "center", paddingBottom: 8 }}>
      <style>{`@keyframes jl { 0%,100%{opacity:1} 50%{opacity:.25} }`}</style>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 14 }}>
        {[accent, "#D4A574", "#7A9E7E", "#5A8BA8", "#D4A574"].map((c,i) => (
          <span key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c, display: "inline-block", animation: playing ? `jl ${0.8+i*.2}s ease-in-out infinite` : "none", opacity: playing ? 1 : .3 }} />
        ))}
      </div>
      <img src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&q=60&fit=crop" alt="Jukebox" loading="lazy" style={SC.deviceThumb} />
    </div>
  );
}

function VinylDisplay({ playing }) {
  return (
    <div style={{ textAlign: "center" }}>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      <div style={{ display: "inline-block", borderRadius: "50%", overflow: "hidden", width: 140, height: 140, animation: playing ? "spin 4s linear infinite" : "none", boxShadow: "0 6px 28px rgba(0,0,0,.5)", marginBottom: 4 }}>
        <img src="https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=300&q=60&fit=crop" alt="Vinyl record" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.82) saturate(0.7)" }} />
      </div>
    </div>
  );
}

function CassetteDisplay({ playing }) {
  return (
    <div style={{ textAlign: "center" }}>
      <style>{`@keyframes reel { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      <div style={{ position: "relative", display: "inline-block", marginBottom: 4 }}>
        <img src="https://images.unsplash.com/photo-1567443024551-f3e3a7b9cbde?w=300&q=60&fit=crop" alt="Cassette" loading="lazy" style={SC.deviceThumb} />
        <div style={{ position: "absolute", top: "38%", left: "26%", width: 28, height: 28, borderRadius: "50%", border: "3px solid rgba(255,255,255,.4)", animation: playing ? "reel 1.5s linear infinite" : "none" }} />
        <div style={{ position: "absolute", top: "38%", right: "26%", width: 28, height: 28, borderRadius: "50%", border: "3px solid rgba(255,255,255,.4)", animation: playing ? "reel 1.5s linear infinite reverse" : "none" }} />
      </div>
    </div>
  );
}

function GramophoneDisplay({ playing }) {
  return (
    <div style={{ textAlign: "center" }}>
      <style>{`@keyframes hg { 0%,100%{filter:brightness(0.82) sepia(0)} 50%{filter:brightness(0.92) sepia(0.2)} }`}</style>
      <img src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&q=60&fit=crop" alt="Gramophone" loading="lazy" style={{ ...SC.deviceThumb, animation: playing ? "hg 3s ease-in-out infinite" : "none" }} />
    </div>
  );
}

const DISPLAYS = { jukebox: JukeboxDisplay, vinyl: VinylDisplay, cassette: CassetteDisplay, gramophone: GramophoneDisplay };

export default function MusicTherapy() {
  const navigate  = useNavigate();
  const [device, setDevice]     = useState(null);
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying]   = useState(false);

  const playlist = device ? PLAYLISTS[device.id] : [];
  const track    = playlist[trackIdx] || "";

  const handlePlay = () => setPlaying(p => !p);
  const handleNext = () => { setTrackIdx(i => (i + 1) % playlist.length); setPlaying(true); };
  const handlePrev = () => { setTrackIdx(i => (i - 1 + playlist.length) % playlist.length); setPlaying(true); };

  // ── Device selection ──────────────────────────────────────────────────────
  if (!device) {
    return (
      <div style={S.choosePage}>
        <button style={S.backBtn} onClick={() => navigate("/")}>← Home</button>
        <div style={S.chooseHeader}>
          <h1 style={S.chooseTitle}>Music Therapy</h1>
          <p style={S.chooseSub}>Choose a player that feels familiar.</p>
        </div>
        <div style={S.deviceGrid}>
          {DEVICES.map(d => (
            <button key={d.id} style={S.deviceCard} onClick={() => { setDevice(d); setTrackIdx(0); setPlaying(false); }} aria-label={d.label}>
              <img src={d.image} alt={d.alt} loading="lazy" style={S.deviceCardImg} />
              <div style={{ ...S.deviceOverlay, background: d.overlay }} />
              <div style={S.deviceContent}>
                <div style={{ ...S.deviceBadge, background: d.accent }} />
                <h3 style={S.deviceLabel}>{d.label}</h3>
                <p style={S.deviceDesc}>{d.desc}</p>
              </div>
            </button>
          ))}
        </div>
        <p style={S.hint}>Take your time — there's no rush.</p>
      </div>
    );
  }

  const DeviceDisplay = DISPLAYS[device.id];

  // ── Player screen ─────────────────────────────────────────────────────────
  return (
    <div style={{ ...S.playerPage, background: device.bg }}>
      <div style={S.topRow}>
        <button style={S.darkBackBtn} onClick={() => navigate("/")}>← Home</button>
        <button style={S.darkBackBtn} onClick={() => { setDevice(null); setPlaying(false); }}>Change Player</button>
      </div>

      <h2 style={{ ...S.deviceName, color: device.accent }}>{device.label}</h2>
      <p style={S.playerSub}>Let's listen to some old favourites.</p>

      <div style={S.playerCard}>
        <DeviceDisplay playing={playing} accent={device.accent} />
        <p style={S.nowPlaying}>{track}</p>
        <PlayerControls playing={playing} onPlay={handlePlay} onPrev={handlePrev} onNext={handleNext} accent={device.accent} />
      </div>

      <div style={S.trackList}>
        {playlist.map((t, i) => (
          <button key={i} style={SC.trackItem(i === trackIdx, device.accent)} onClick={() => { setTrackIdx(i); setPlaying(true); }}>
            <span style={{ fontSize: 13, color: "rgba(245,236,215,.45)", minWidth: 22 }}>{i + 1}.</span>
            <span style={{ flex: 1 }}>{t}</span>
            {i === trackIdx && playing && <span style={{ fontSize: 11, fontWeight: 700, color: device.accent, letterSpacing: .5 }}>▶ NOW</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

const S = {
  choosePage:   { minHeight: "100vh", background: "linear-gradient(160deg,#1A1410,#0C0A08)", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 24px 48px", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" },
  backBtn:      { alignSelf: "flex-start", background: "rgba(255,255,255,.09)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 10, padding: "9px 18px", fontSize: 13, color: "rgba(245,236,215,.8)", cursor: "pointer", marginBottom: 24 },
  chooseHeader: { textAlign: "center", marginBottom: 32 },
  chooseTitle:  { fontSize: 32, fontWeight: 800, color: "#F5ECD7", margin: "0 0 6px", letterSpacing: "-.5px" },
  chooseSub:    { fontSize: 16, color: "rgba(245,236,215,.55)", margin: 0 },
  deviceGrid:   { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, maxWidth: 620, width: "100%" },
  deviceCard:   { position: "relative", overflow: "hidden", borderRadius: 18, minHeight: 230, border: "1px solid rgba(255,255,255,.08)", cursor: "pointer", background: "#1A1410", boxShadow: "0 6px 28px rgba(0,0,0,.45)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 0, transition: "transform .18s ease" },
  deviceCardImg:{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.78) saturate(0.75)" },
  deviceOverlay:{ position: "absolute", inset: 0 },
  deviceContent:{ position: "relative", zIndex: 2, padding: "14px 18px 18px" },
  deviceBadge:  { width: 20, height: 3, borderRadius: 2, marginBottom: 7 },
  deviceLabel:  { fontSize: 19, fontWeight: 700, color: "#FDFAF6", margin: "0 0 4px", textShadow: "0 1px 6px rgba(0,0,0,.5)" },
  deviceDesc:   { fontSize: 13, color: "rgba(253,250,246,.68)", margin: 0, lineHeight: 1.4 },
  hint:         { fontSize: 13, color: "rgba(245,236,215,.4)", marginTop: 22 },
  playerPage:   { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" },
  topRow:       { display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 560, marginBottom: 8 },
  darkBackBtn:  { background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 10, padding: "9px 16px", fontSize: 13, cursor: "pointer", color: "rgba(245,236,215,.8)", backdropFilter: "blur(6px)" },
  deviceName:   { fontSize: 26, fontWeight: 700, margin: "8px 0 4px", letterSpacing: "-.3px" },
  playerSub:    { fontSize: 14, color: "rgba(245,236,215,.5)", margin: "0 0 22px" },
  playerCard:   { background: "rgba(255,255,255,.06)", borderRadius: 22, padding: "28px 32px", boxShadow: "0 8px 40px rgba(0,0,0,.35)", maxWidth: 440, width: "100%", marginBottom: 20, border: "1px solid rgba(255,255,255,.09)", backdropFilter: "blur(12px)" },
  nowPlaying:   { fontSize: 18, fontWeight: 600, color: "#F5ECD7", margin: "14px 0 0", textAlign: "center", lineHeight: 1.3 },
  trackList:    { display: "flex", flexDirection: "column", gap: 4, width: "100%", maxWidth: 480 },
};

const SC = {
  deviceThumb: { width: 160, height: 120, objectFit: "cover", borderRadius: 10, filter: "brightness(0.82) saturate(0.75)", display: "block", margin: "0 auto" },
  ctrl:        (accent) => ({ width: 52, height: 52, borderRadius: "50%", background: `${accent}CC`, color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 14px ${accent}50`, border: "none" }),
  trackItem:   (active, accent) => ({ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 12, border: "none", background: active ? `${accent}20` : "rgba(255,255,255,.05)", color: active ? "#F5ECD7" : "rgba(245,236,215,.6)", fontSize: 15, cursor: "pointer", textAlign: "left", fontWeight: active ? 600 : 400, transition: "background .15s", boxShadow: active ? `inset 2px 0 0 ${accent}` : "none" }),
};
