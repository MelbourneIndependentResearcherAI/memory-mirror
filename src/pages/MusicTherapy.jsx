const demoTracks = [
  { id: 1, title: "Golden Oldies Mix", duration: "45 min" },
  { id: 2, title: "Calm Piano", duration: "30 min" },
  { id: 3, title: "Sing‑along Classics", duration: "40 min" },
];

export default function MusicTherapy({ voiceKey, onBack }) {
  const handlePlay = (track) => {
    // Hook into your real audio / AI flow later
    alert(`Starting: ${track.title}`);
  };

  return (
    <div className="feature-screen">
      <header className="feature-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h1>Music Therapy</h1>
        <p>Familiar songs to soothe, ground, and connect.</p>
      </header>

      <div className="music-list">
        {demoTracks.map((t) => (
          <button
            key={t.id}
            className="music-row"
            onClick={() => handlePlay(t)}
          >
            <div>
              <strong>{t.title}</strong>
              <div className="music-meta">{t.duration}</div>
            </div>
            <span>▶</span>
          </button>
        ))}
      </div>
    </div>
  );
}
