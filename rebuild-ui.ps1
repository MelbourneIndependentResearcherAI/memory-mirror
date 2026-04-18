# Go to project src
Set-Location "C:\MemoryMirror\src"

# =========================
# App.jsx
# =========================
@"
import React from "react";
import "./index.css";
import Dashboard3D from "./screens/Dashboard3D";

export default function App() {
  return (
    <Dashboard3D />
  );
}
"@ | Set-Content -Encoding UTF8 ".\App.jsx"

# =========================
# screens\Dashboard3D.jsx
# =========================
@"
import React, { useState } from "react";
import "./dashboard.css";

export default function Dashboard3D() {
  const tiles = [
    { id: 1, title: "Night Safe" },
    { id: 2, title: "Calm Corner" },
    { id: 3, title: "Music Therapy" },
    { id: 4, title: "Pets Buddy" },
    { id: 5, title: "Photos & Videos" },
    { id: 6, title: "Dialpad" },
    { id: 7, title: "Shower" },
    { id: 8, title: "Legacy Builder" }
  ];

  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % tiles.length);
  const prev = () => setIndex((i) => (i - 1 + tiles.length) % tiles.length);

  return (
    <div className="dash3d-container">
      <div className="dash3d-carousel">
        {tiles.map((tile, i) => {
          const offset = i - index;
          const rotate = offset * 40;
          const z = -Math.abs(offset) * 120;

          return (
            <div
              key={tile.id}
              className="dash3d-card"
              style={{
                transform: `translateZ(${z}px) rotateY(${rotate}deg)`
              }}
            >
              {tile.title}
            </div>
          );
        })}
      </div>

      <div className="dash3d-controls">
        <button onClick={prev}>◀</button>
        <button onClick={next}>▶</button>
      </div>
    </div>
  );
}
"@ | Set-Content -Encoding UTF8 ".\screens\Dashboard3D.jsx"

# =========================
# screens\dashboard.css
# =========================
@"
.dash3d-container {
  width: 100%;
  height: 100vh;
  background: #0a0a12;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  overflow: hidden;
}

.dash3d-carousel {
  position: relative;
  width: 320px;
  height: 260px;
  perspective: 900px;
}

.dash3d-card {
  position: absolute;
  width: 260px;
  height: 180px;
  border-radius: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  font-weight: 600;
  color: #000;
  background: rgba(0, 255, 255, 0.4);
  transition: transform 0.6s ease;
  box-shadow: 0 0 25px rgba(0, 255, 255, 0.25);
}

.dash3d-controls {
  margin-top: 30px;
  display: flex;
  gap: 20px;
}

.dash3d-controls button {
  padding: 12px 20px;
  font-size: 18px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: #00eaff;
  color: #000;
  font-weight: 600;
}
"@ | Set-Content -Encoding UTF8 ".\screens\dashboard.css"

# =========================
# screens\PhotoVideoHub.jsx
# =========================
@"
import React, { useState, useEffect } from "react";
import "./photovideohub.css";

export default function PhotoVideoHub() {
  const [items, setItems] = useState([]);
  const [viewerItem, setViewerItem] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("photoVideoHub");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const saveItems = (updated) => {
    setItems(updated);
    localStorage.setItem("photoVideoHub", JSON.stringify(updated));
  };

  const handleUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newItem = {
        id: Date.now(),
        type,
        data: reader.result,
        description: ""
      };
      const updated = [...items, newItem];
      saveItems(updated);
    };

    reader.readAsDataURL(file);
  };

  const openViewer = (item) => {
    setViewerItem(item);
    setDescription(item.description || "");
  };

  const saveDescription = () => {
    const updated = items.map((i) =>
      i.id === viewerItem.id ? { ...i, description } : i
    );
    saveItems(updated);
  };

  const deleteItem = (id) => {
    const updated = items.filter((i) => i.id !== id);
    saveItems(updated);
    setViewerItem(null);
  };

  return (
    <div className="pv-container">
      <h1 className="pv-title">Photos & Videos</h1>

      <div className="pv-upload-row">
        <label className="pv-upload-btn">
          Upload Photo
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleUpload(e, "photo")}
          />
        </label>

        <label className="pv-upload-btn">
          Upload Video
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleUpload(e, "video")}
          />
        </label>
      </div>

      <div className="pv-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className="pv-card"
            onClick={() => openViewer(item)}
          >
            {item.type === "photo" ? (
              <img src={item.data} className="pv-thumb" alt="" />
            ) : (
              <video src={item.data} className="pv-thumb" />
            )}
          </div>
        ))}
      </div>

      {viewerItem && (
        <div className="pv-viewer">
          <div className="pv-viewer-content">
            {viewerItem.type === "photo" ? (
              <img src={viewerItem.data} className="pv-full" alt="" />
            ) : (
              <video src={viewerItem.data} className="pv-full" controls />
            )}

            <textarea
              className="pv-description"
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="pv-viewer-actions">
              <button className="pv-save" onClick={saveDescription}>
                Save Description
              </button>
              <button
                className="pv-delete"
                onClick={() => deleteItem(viewerItem.id)}
              >
                Delete
              </button>
              <button className="pv-close" onClick={() => setViewerItem(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"@ | Set-Content -Encoding UTF8 ".\screens\PhotoVideoHub.jsx"

# =========================
# screens\photovideohub.css
# =========================
@"
.pv-container {
  padding: 20px;
  color: #fff;
  background: rgba(10, 10, 15, 0.65);
  backdrop-filter: blur(18px);
  min-height: 100vh;
}

.pv-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  color: #9be8ff;
}

.pv-upload-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 25px;
}

.pv-upload-btn {
  background: rgba(255, 255, 255, 0.08);
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid rgba(150, 255, 255, 0.25);
  color: #c8f7ff;
  font-size: 15px;
  transition: 0.2s;
}

.pv-upload-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.pv-upload-btn input {
  display: none;
}

.pv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 15px;
}

.pv-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(150, 255, 255, 0.15);
  transition: 0.2s;
}

.pv-card:hover {
  transform: scale(1.03);
  border-color: rgba(150, 255, 255, 0.4);
}

.pv-thumb {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.pv-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(5, 5, 10, 0.85);
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.pv-viewer-content {
  width: 90%;
  max-width: 600px;
  background: rgba(20, 20, 30, 0.6);
  padding: 20px;
  border-radius: 18px;
  border: 1px solid rgba(150, 255, 255, 0.25);
}

.pv-full {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 15px;
}

.pv-description {
  width: 100%;
  height: 80px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(150, 255, 255, 0.25);
  border-radius: 10px;
  padding: 10px;
  color: #eaffff;
  margin-bottom: 15px;
}

.pv-viewer-actions {
  display: flex;
  justify-content: space-between;
}

.pv-save,
.pv-delete,
.pv-close {
  padding: 10px 15px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.pv-save {
  background: #00c6ff;
  color: #000;
}

.pv-delete {
  background: #ff4d4d;
  color: #fff;
}

.pv-close {
  background: #444;
  color: #fff;
}
"@ | Set-Content -Encoding UTF8 ".\screens\photovideohub.css"

# =========================
# screens\Dialpad.jsx
# =========================
@"
import React, { useState } from "react";
import "./dialpad.css";

export default function Dialpad() {
  const [number, setNumber] = useState("");

  const press = (val) => {
    setNumber((prev) => (prev + val).slice(0, 20));
  };

  const clearLast = () => {
    setNumber((prev) => prev.slice(0, -1));
  };

  const clearAll = () => {
    setNumber("");
  };

  return (
    <div className="dial-container">
      <h1 className="dial-title">Dialpad</h1>

      <div className="dial-display">
        {number || "Enter number"}
      </div>

      <div className="dial-grid">
        {["1","2","3","4","5","6","7","8","9","*","0","#"].map((n) => (
          <button key={n} className="dial-btn" onClick={() => press(n)}>
            {n}
          </button>
        ))}
      </div>

      <div className="dial-actions">
        <button className="dial-clear" onClick={clearLast}>Delete</button>
        <button className="dial-reset" onClick={clearAll}>Clear</button>
        <button className="dial-call">Call</button>
      </div>
    </div>
  );
}
"@ | Set-Content -Encoding UTF8 ".\screens\Dialpad.jsx"

# =========================
# screens\dialpad.css
# =========================
@"
.dial-container {
  padding: 20px;
  min-height: 100vh;
  background: rgba(10, 10, 15, 0.65);
  backdrop-filter: blur(18px);
  color: #eaffff;
}

.dial-title {
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  color: #9be8ff;
  margin-bottom: 25px;
}

.dial-display {
  width: 100%;
  text-align: center;
  padding: 18px;
  font-size: 26px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  border: 1px solid rgba(150, 255, 255, 0.25);
  margin-bottom: 25px;
  letter-spacing: 2px;
}

.dial-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 30px;
}

.dial-btn {
  padding: 22px;
  font-size: 22px;
  border-radius: 14px;
  border: 1px solid rgba(150, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  color: #c8f7ff;
  cursor: pointer;
  transition: 0.2s;
}

.dial-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.dial-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.dial-clear,
.dial-reset,
.dial-call {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.dial-clear {
  background: #ff4d4d;
  color: #fff;
}

.dial-reset {
  background: #444;
  color: #fff;
}

.dial-call {
  background: #00c6ff;
  color: #000;
}
"@ | Set-Content -Encoding UTF8 ".\screens\dialpad.css"
