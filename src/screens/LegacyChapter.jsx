import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./LegacyChapter.css";

export default function LegacyChapter() {
  const { chapter } = useParams();
  const navigate = useNavigate();

  const chapterOrder = [
    "childhood",
    "family",
    "love",
    "career",
    "life-lessons",
    "farewell-message"
  ];

  const goNext = () => {
    const index = chapterOrder.indexOf(chapter);
    if (index < chapterOrder.length - 1) {
      navigate("/legacy/" + chapterOrder[index + 1]);
    }
  };

  const getPrompt = () => {
    switch (chapter) {
      case "childhood":
        return "What are your earliest memories? Who made you feel safe?";
      case "family":
        return "Describe the people who shaped your life. What moments define your family?";
      case "love":
        return "Write about the people you loved deeply. What did love teach you?";
      case "career":
        return "What work did you do? What accomplishments made you proud?";
      case "life-lessons":
        return "What wisdom would you pass on to future generations?";
      case "farewell-message":
        return "If this were your final message, what would you want your loved ones to know?";
      default:
        return "Write your story for this chapter.";
    }
  };

  const [text, setText] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    const savedText = localStorage.getItem("legacy_" + chapter) || "";
    setText(savedText);
  }, [chapter]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem("legacy_" + chapter, text);
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    }, 3000);
    return () => clearInterval(interval);
  }, [text, chapter]);

  const save = () => {
    localStorage.setItem("legacy_" + chapter, text);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <div className="chapter-container">
      <div className="chapter-title">{chapter}</div>

      <div className="chapter-prompt">{getPrompt()}</div>

      <textarea
        className="chapter-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Begin writing your story..."
      ></textarea>

      <button className="chapter-save" onClick={save}>
        Save Chapter
      </button>

      <div className="chapter-nav">
        <button className="chapter-back" onClick={() => navigate("/legacy")}>
          ← Back to Chapters
        </button>

        <button className="chapter-next" onClick={goNext}>
          Next →
        </button>
      </div>

      {saved && <div className="chapter-saved">Saved</div>}
    </div>
  );
}
