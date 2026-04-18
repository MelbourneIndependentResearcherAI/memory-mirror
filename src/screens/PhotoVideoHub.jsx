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
