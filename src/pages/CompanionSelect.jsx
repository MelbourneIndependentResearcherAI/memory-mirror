const companions = [
  { id: "aunty-bev", name: "Aunty Bev", note: "Warm, gentle, familiar" },
  { id: "margaret", name: "Margaret", note: "Calm and reassuring" },
  { id: "brian", name: "Brian", note: "Friendly and practical" },
];

export default function CompanionSelect({ onBack, onSelect }) {
  return (
    <div className="companion-container">
      <button className="back-btn" onClick={onBack}>← Back</button>

      <h1 className="companion-title">Choose Companion</h1>
      <p className="companion-sub">Who would you like to talk to?</p>

      <div className="companion-list">
        {companions.map((c) => (
          <button
            key={c.id}
            className="companion-row"
            onClick={() => onSelect(c.name)}
          >
            <div>
              <strong>{c.name}</strong>
              <div className="companion-meta">{c.note}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
