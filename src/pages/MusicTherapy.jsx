const tracks = [
  { id: 1, title: "Golden Oldies Mix", detail: "Familiar classics from the 50s–70s" },
  { id: 2, title: "Calm Piano", detail: "Soft, slow piano pieces" },
  { id: 3, title: "Sing-along Favourites", detail: "Easy songs to sing with" },
];

export default function MusicTherapy({ onBack }) {
  const play = (track) => {
    alert(`Starting: ${track.title}`);
  };

  return (
    <div className="music-container">
      <button className="back-btn" onClick={onBack}>← Back</button>

      <h1 className="music-title">Music Therapy</h1>
      <p className="music-sub">Familiar songs to soothe, ground, and connect.</p>

      <div className="music-list">
        {tracks.map((t) => (
          <button
            key={t.id}
            className="music-row"
            onClick={() => play(t)}
          >
            <div>
              <strong>{t.title}</strong>
              <div className="music-meta">{t.detail}</div>
            </div>
            <span>▶</span>
          </button>
        ))}
      </div>
    </div>
  );
}
