import React, { useState, useEffect } from "react";

export default function PhotoHub({ darkMode }) {
  const [items, setItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("mm_photos");
    if (saved) {
      setItems(JSON.parse(saved));
    }
    const savedDesc = localStorage.getItem("mm_photos_description");
    if (savedDesc) {
      setDescription(savedDesc);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mm_photos", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("mm_photos_description", description);
  }, [description]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newItems = [];

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      newItems.push({
        name: file.name,
        url,
        type: file.type.startsWith("video") ? "video" : "image",
      });
    });

    setItems((prev) => [...prev, ...newItems]);
  };

  const selectedItem =
    selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <div
      className={`min-h-screen px-6 py-8 ${
        darkMode ? "bg-black text-white" : "bg-slate-900 text-white"
      }`}
    >
      <h1 className="text-3xl font-bold mb-2">Photos & Videos</h1>
      <p className="text-gray-300 mb-4">
        You can add pictures or videos, an write a little yarn about dat moment.
      </p>

      <div className="mb-4">
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFiles}
          className="text-sm"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-slate-800 rounded-2xl p-4 shadow-lg max-h-[60vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-3">Your memories</h2>
          {items.length === 0 && (
            <p className="text-sm text-gray-400">
              No memories yet. You can add some photos or videos.
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`rounded-xl overflow-hidden border ${
                  selectedIndex === index
                    ? "border-indigo-500"
                    : "border-slate-700"
                }`}
              >
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-24 object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-24 object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Yarn about this moment</h2>
          {selectedItem ? (
            <div className="mb-3">
              <div className="text-sm font-medium mb-1">
                {selectedItem.name}
              </div>
              {selectedItem.type === "image" ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.name}
                  className="w-full max-h-64 object-contain rounded-xl mb-3"
                />
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  className="w-full max-h-64 object-contain rounded-xl mb-3"
                />
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-3">
              Tap a photo or video on da left to see it bigger.
            </p>
          )}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            className="w-full rounded-xl px-3 py-2 bg-slate-900 border border-slate-700 text-sm"
            placeholder="This moment reminds me ofâ€¦"
          />
        </div>
      </div>
    </div>
  );
}
