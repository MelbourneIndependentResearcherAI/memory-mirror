const tracks = [
  { id: 1, icon: "🎷", title: "Golden Oldies Mix",      detail: "Familiar classics from the 50s–70s" },
  { id: 2, icon: "🎹", title: "Calm Piano",              detail: "Soft, slow piano pieces for relaxation" },
  { id: 3, icon: "🎤", title: "Sing-along Favourites",  detail: "Easy songs to sing and hum along to" },
  { id: 4, icon: "🎻", title: "Classic Strings",         detail: "Gentle orchestral pieces" },
  { id: 5, icon: "🌿", title: "Nature Sounds",           detail: "Rain, birdsong, and gentle wind" },
];

export default function MusicTherapy({ onBack }) {
  const play = (track) => {
    alert(`Starting: ${track.title}`);
  };

  return (
    <div className="music-container">
      <button className="back-btn" onClick={onBack}>← Home</button>

      <h1 className="music-title">Music Therapy</h1>
      <p className="music-sub">Familiar songs to soothe, ground, and connect.</p>

      <div className="music-list">
        {tracks.map((t) => (
          <button key={t.id} className="music-row" onClick={() => play(t)}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>{t.icon}</span>
            <div style={{ flex: 1 }}>
              <strong>{t.title}</strong>
              <div className="music-meta">{t.detail}</div>
            </div>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "#16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(22,163,74,0.35)",
              transition: "transform 0.2s",
            }}>▶</div>
          </button>
        ))}
      </div>
    </div>
  );
}
