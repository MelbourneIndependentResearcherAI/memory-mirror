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
                transform: 	ranslateZ(px) rotateY(deg)
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
