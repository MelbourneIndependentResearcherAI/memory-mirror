import React, { useState, useEffect } from 'react';
import { speak } from './voiceEngine';
import { applyPersonality } from './personality';
import DementiaSelector from './DementiaSelector';
import VoiceToggle from './VoiceToggle';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [currentDementiaProfile, setCurrentDementiaProfile] = useState('general');

  const handleAIResponse = async (aiResponse) => {
    const finalText = applyPersonality(aiResponse, currentDementiaProfile);
    speak(finalText);

    setMessages(prev => [...prev, { from: 'ai', text: finalText }]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Fresh Start AI Companion</h2>

      {/* Dementia Type Selector */}
      <DementiaSelector onChange={setCurrentDementiaProfile} />

      {/* Voice Toggle */}
      <VoiceToggle />

      <div style={{ marginTop: '20px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <strong>{m.from === 'ai' ? 'Companion' : 'You'}:</strong> {m.text}
          </div>
        ))}
      </div>
    </div>
  );
}
import { crisisCalm, orientationCue } from './crisisCalm';

const [crisisMode, setCrisisMode] = useState(false);

<button onClick={() => setCrisisMode(!crisisMode)}>
  {crisisMode ? 'Disable Crisis-Calm Mode' : 'Enable Crisis-Calm Mode'}
</button>

if (crisisMode) {
  aiResponse = crisisCalm(aiResponse);
  aiResponse = orientationCue() + ' ' + aiResponse;
}
import { handleMemoryLoop } from './memoryLoop';

const loopResponse = handleMemoryLoop(userMessage);
if (loopResponse) {
  const finalText = applyPersonality(loopResponse, currentDementiaProfile);
  speak(finalText);
  setMessages(prev => [...prev, { from: 'ai', text: finalText }]);
  return;
}
