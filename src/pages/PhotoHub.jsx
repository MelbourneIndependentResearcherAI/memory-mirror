const demoPhotos = [
  { id: 1, icon: "🏡", label: "Family BBQ",            note: "Summer at the park" },
  { id: 2, icon: "💒", label: "Wedding Day",            note: "A very special day" },
  { id: 3, icon: "🏖️", label: "Holiday at the Beach", note: "Warm sand and waves" },
  { id: 4, icon: "👨‍👩‍👧‍👦", label: "Grandkids Visit",       note: "Lots of laughter" },
];

export default function PhotoHub({ onBack }) {
  return (
    <div className="photo-container">
      <button className="back-btn" onClick={onBack}>← Home</button>

      <h1 className="photo-title">Photo Hub</h1>
      <p className="photo-sub">Tap a memory to talk about it together.</p>

      <div className="photo-grid">
        {demoPhotos.map((p) => (
          <div key={p.id} className="photo-card">
            <div className="photo-thumbnail">{p.icon}</div>
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
