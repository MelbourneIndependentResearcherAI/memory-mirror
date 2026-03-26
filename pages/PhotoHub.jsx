const demoPhotos = [
  { id: 1, label: "Family BBQ", color: "#fde68a" },
  { id: 2, label: "Wedding Day", color: "#bfdbfe" },
  { id: 3, label: "Holiday at the Beach", color: "#bbf7d0" },
  { id: 4, label: "Grandkids Visit", color: "#fecaca" },
];

export default function PhotoHub({ voiceKey, onBack }) {
  return (
    <div className="feature-screen">
      <header className="feature-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h1>Photo Hub</h1>
        <p>Tap a memory to talk about it together.</p>
      </header>

      <div className="photo-grid">
        {demoPhotos.map((p) => (
          <div
            key={p.id}
            className="photo-card"
            style={{ backgroundColor: p.color }}
          >
            <span>{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
