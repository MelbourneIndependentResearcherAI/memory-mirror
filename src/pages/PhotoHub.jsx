const demoPhotos = [
  { id: 1, label: "Family BBQ", note: "Summer at the park" },
  { id: 2, label: "Wedding Day", note: "A very special day" },
  { id: 3, label: "Holiday at the Beach", note: "Warm sand and waves" },
  { id: 4, label: "Grandkids Visit", note: "Lots of laughter" },
];

export default function PhotoHub({ onBack }) {
  return (
    <div className="photo-container">
      <button className="back-btn" onClick={onBack}>← Back</button>

      <h1 className="photo-title">Photo Hub</h1>
      <p className="photo-sub">Tap a memory to talk about it together.</p>

      <div className="photo-grid">
        {demoPhotos.map((p) => (
          <div key={p.id} className="photo-card">
            <div className="photo-thumbnail" />
            <div className="photo-text">
              <strong>{p.label}</strong>
              <span>{p.note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
