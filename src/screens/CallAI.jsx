import React, { useEffect, useState } from "react";
import "./callai.css";
import { useNavigate } from "react-router-dom";

export default function CallAI() {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connectTimeout = setTimeout(() => {
      setConnected(true);
    }, 2000);

    return () => clearTimeout(connectTimeout);
  }, []);

  useEffect(() => {
    let interval;
    if (connected) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [connected]);

  const formatTime = (t) => {
    const m = String(Math.floor(t / 60)).padStart(2, "0");
    const s = String(t % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const endCall = () => {
    navigate("/auntybev"); // or your AI chat route
  };

  return (
    <div className="callai-container">
      <div className={`callai-avatar ${connected ? "connected" : ""}`}></div>

      <div className={`callai-status ${connected ? "connected" : ""}`}>
        {connected ? formatTime(timer) : "Calling…"}
      </div>

      <div className="callai-number">Unknown Number</div>

      <div className="callai-buttons">
        <div className="callai-icon muted">🔇</div>
        <div className="callai-icon speaker">🔊</div>
      </div>

      <button className="callai-end" onClick={endCall}>
        End Call
      </button>
    </div>
  );
}
