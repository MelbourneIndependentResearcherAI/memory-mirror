import React, { useState, useEffect } from "react";
import "./Notes.css";

export default function Notes() {
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("notes_text") || "";
    setText(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes_text", text);
  }, [text]);

  return (
    <div className="notes-wrapper">
      <h1 className="notes-title">Notes</h1>
      <p className="notes-sub">A calm place to jot things down.</p>

      <textarea
        className="notes-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write anything you like..."
      ></textarea>
    </div>
  );
}
