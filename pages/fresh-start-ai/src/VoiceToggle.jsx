import React, { useState, useEffect } from 'react';
import { setVoiceProfile, speak } from './voiceEngine';

export default function VoiceToggle() {
  const [profile, setProfile] = useState('female');

  useEffect(() => {
    const saved = localStorage.getItem('voiceProfile');
    if (saved) {
      setProfile(saved);
      setVoiceProfile(saved);
    }
  }, []);

  const toggle = () => {
    const next = profile === 'female' ? 'male' : 'female';
    setProfile(next);
    setVoiceProfile(next);
    localStorage.setItem('voiceProfile', next);
  };

  const preview = () => {
    speak(profile === 'female'
      ? 'Hello, this is my female voice.'
      : 'Hello, this is my male voice.'
    );
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <button onClick={toggle}>
        Switch to {profile === 'female' ? 'Male' : 'Female'} Voice
      </button>
      <button onClick={preview} style={{ marginLeft: '10px' }}>
        Preview Voice
      </button>
    </div>
  );
}
