export default function CallScreen({ onBack, companionName }) {
  return (
    <div className="call-container">
      <button className="back-btn" onClick={onBack}>← End</button>

      <div className="call-avatar">💬</div>
      <h1 className="call-title">{companionName}</h1>
      <p className="call-sub">In a safe, private conversation with you.</p>

      <div className="call-status">Connecting voice…</div>
    </div>
  );
}
