import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Star, Heart, Smile, Brain, Music, Palette, Activity, ChevronRight, Sparkles, Baby, MessageCircle } from 'lucide-react';
import '../styles/LittleOnesAI.css';
import Pricing from './Pricing';

const COMPANION = {
  emoji: '🌟',
  name: 'Sunny',
  role: 'Early Childhood Guide',
  accent: '#FFB74D',
  color: '#E67E22',
  color2: '#BA6800',
  greeting: "Hello! I'm Sunny, your early childhood guide. I'm here to help you find the perfect activities, milestones to watch for, and parenting tips tailored to your little one. What would you like to explore today?",
  systemPrompt: `You are Sunny, a warm and knowledgeable early childhood education AI guide for parents of children aged 0–6.

PERSONALITY: Enthusiastic, encouraging, and practical. Speak warmly to parents. Celebrate their efforts. Use simple, clear language. Share evidence-based tips.

CRITICAL CONVERSATION RULES:
1. NEVER REPEAT YOURSELF. Every single response must be completely different from all previous responses.
2. ALWAYS respond specifically to exactly what the parent just said — pick up their specific words.
3. VARY your responses — sometimes suggest an activity, sometimes share a developmental tip, sometimes ask a follow-up question.
4. NEVER start two responses the same way. Vary your sentence starters every time.
5. Keep responses 2-4 sentences only. Practical and warm.
6. Focus on activities, developmental milestones, play ideas, and parenting support for ages 0–6.
7. Make the parent feel capable, supported, and genuinely heard every time.`,
};

// Delay (ms) between the AI finishing speaking and the mic restarting in hands-free mode.
const VOICE_RESTART_DELAY_MS = 400;
// BCP-47 language tag used for speech recognition.
const SPEECH_LANG = 'en-AU';

// speak() — handles async voice loading on Chrome (getVoices() is empty until voiceschanged fires).
function speak(text, onEnd) {
  if (!window.speechSynthesis) { onEnd?.(); return; }
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.9; utt.pitch = 1.1; utt.volume = 1;
  utt.onend = () => onEnd?.();

  const doSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    const pick = voices.find(v => /samantha|karen|moira|fiona|victoria/i.test(v.name))
      || voices.find(v => v.lang.startsWith('en'))
      || voices[0];
    if (pick) utt.voice = pick;
    window.speechSynthesis.speak(utt);
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    doSpeak();
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', function onVoices() {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
      doSpeak();
    });
  }
}

function ChatInterface({ onBack }) {
  const [messages, setMessages] = useState([{ role: 'assistant', text: COMPANION.greeting }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const bottomRef = useRef(null);
  const recRef = useRef(null);
  // Refs mirror state so callbacks always read current values without stale closures.
  const voiceRef = useRef(false);
  const aiSpeakingRef = useRef(false);
  const loadingRef = useRef(false);
  // messagesRef stays in sync with messages so sendMessage always builds history from current state.
  const messagesRef = useRef([{ role: 'assistant', text: COMPANION.greeting }]);

  useEffect(() => { voiceRef.current = voiceMode; }, [voiceMode]);
  useEffect(() => { aiSpeakingRef.current = aiSpeaking; }, [aiSpeaking]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice not supported in this browser. Try Chrome.'); return; }
    if (recRef.current) { try { recRef.current.abort(); } catch (err) { console.warn('Speech recognition abort failed:', err); } }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = SPEECH_LANG;
    rec.onstart = () => setListening(true);
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('');
      setLiveTranscript(t);
      if (e.results[e.results.length - 1].isFinal) {
        setLiveTranscript('');
        setListening(false);
        sendMessage(t);
      }
    };
    rec.onerror = () => { setListening(false); setLiveTranscript(''); };
    rec.onend = () => {
      setListening(false);
      if (voiceRef.current && !aiSpeakingRef.current && !loadingRef.current) {
        setTimeout(() => {
          if (voiceRef.current && !aiSpeakingRef.current && !loadingRef.current) {
            startListening();
          }
        }, VOICE_RESTART_DELAY_MS);
      }
    };
    recRef.current = rec;
    try { rec.start(); } catch (err) { console.warn('Speech recognition start failed:', err); }
  };

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loadingRef.current) return;
    setInput(''); setListening(false); setLiveTranscript('');
    window.speechSynthesis?.cancel();

    const userMsg = { role: 'user', text: msg };
    // Use messagesRef.current so we always read the latest conversation history,
    // even when sendMessage is called from inside the startListening closure.
    const newHistory = [...messagesRef.current, userMsg];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: COMPANION.systemPrompt,
          messages: newHistory.map(m => ({ role: m.role, content: m.text })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('LittleOnes API error:', data?.error);
      }
      const reply = data.text || "That's a wonderful question! Let me think of something fun for you.";
      setMessages(h => [...h, { role: 'assistant', text: reply }]);
      setLoading(false);
      if (voiceRef.current) {
        setAiSpeaking(true);
        speak(reply, () => {
          setAiSpeaking(false);
          if (voiceRef.current) {
            setTimeout(() => {
              if (voiceRef.current && !loadingRef.current) startListening();
            }, VOICE_RESTART_DELAY_MS);
          }
        });
      }
    } catch (err) {
      console.error('LittleOnes API request failed:', err);
      const fallback = "I'm here to help! Try asking me about activities or developmental tips.";
      setMessages(h => [...h, { role: 'assistant', text: fallback }]);
      setLoading(false);
      if (voiceRef.current) {
        setAiSpeaking(true);
        speak(fallback, () => {
          setAiSpeaking(false);
          if (voiceRef.current && !loadingRef.current) startListening();
        });
      }
    }
  };

  const toggleVoice = () => {
    if (voiceMode) {
      window.speechSynthesis?.cancel();
      try { recRef.current?.abort(); } catch (err) { console.warn('Speech recognition abort failed:', err); }
      setListening(false); setAiSpeaking(false); setLiveTranscript('');
      setVoiceMode(false); voiceRef.current = false;
    } else {
      setVoiceMode(true); voiceRef.current = true;
      setTimeout(() => startListening(), 300);
    }
  };

  const statusLabel = aiSpeaking ? `${COMPANION.name} is speaking...` : listening ? 'Listening — speak now' : loading ? 'Thinking...' : voiceMode ? 'Ready — tap mic or just speak' : '';
  const statusColor = aiSpeaking ? COMPANION.accent : listening ? '#4CAF50' : loading ? '#FFB74D' : '#888';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#fffdf8' }}>
      <style>{`
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}
        @keyframes ripple{0%{transform:scale(1);opacity:0.8}100%{transform:scale(3);opacity:0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes wave{0%,100%{transform:scaleY(0.5)}50%{transform:scaleY(1.5)}}
      `}</style>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${COMPANION.color}, ${COMPANION.color2})`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, flexWrap: 'wrap' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', padding: '4px 8px', flexShrink: 0 }}>←</button>
        <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#ffffff22', border: '2px solid #ffffff44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{COMPANION.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{COMPANION.name}</div>
          <div style={{ color: '#ffffff99', fontSize: 12 }}>{COMPANION.role}</div>
        </div>
        <button onClick={toggleVoice} style={{
          background: voiceMode ? '#ffffff33' : 'none',
          border: `2px solid ${voiceMode ? '#fff' : '#ffffff55'}`,
          borderRadius: 14, padding: '8px 16px', color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, transition: 'all 0.2s',
          flexShrink: 0, whiteSpace: 'nowrap',
        }}>
          <span style={{ fontSize: 16 }}>{voiceMode ? '🎙️' : '🔇'}</span>
          <span>{voiceMode ? 'Hands-Free ON' : 'Hands-Free'}</span>
        </button>
      </div>

      {/* Voice status bar */}
      {voiceMode && (
        <div style={{ background: '#fff8f0', borderBottom: '1px solid #ffe0b2', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: statusColor, animation: (listening || aiSpeaking) ? 'pulse 1s infinite' : 'none' }} />
            {listening && <div style={{ position: 'absolute', inset: -5, borderRadius: '50%', border: `2px solid ${statusColor}`, animation: 'ripple 1.5s ease-out infinite' }} />}
          </div>
          {aiSpeaking && (
            <div style={{ display: 'flex', gap: 3, alignItems: 'center', height: 20 }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{ width: 3, background: COMPANION.accent, borderRadius: 2, height: '100%', animation: 'wave 0.8s ease infinite', animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}
          <span style={{ color: statusColor, fontSize: 13 }}>{statusLabel}</span>
          {liveTranscript && <span style={{ color: '#aaa', fontSize: 12, fontStyle: 'italic', marginLeft: 4 }}>"{liveTranscript}"</span>}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 10px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-end', animation: 'fadeIn 0.3s ease both' }}>
            {m.role === 'assistant' && (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${COMPANION.color}22`, border: `2px solid ${COMPANION.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{COMPANION.emoji}</div>
            )}
            <div style={{
              maxWidth: '72%',
              background: m.role === 'user' ? `linear-gradient(135deg, ${COMPANION.color}dd, ${COMPANION.color2}dd)` : '#fff',
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
              padding: '11px 16px',
              border: m.role === 'assistant' ? `1px solid ${COMPANION.color}33` : 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <p style={{ color: m.role === 'user' ? '#fff' : '#333', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${COMPANION.color}22`, border: `2px solid ${COMPANION.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{COMPANION.emoji}</div>
            <div style={{ background: '#fff', borderRadius: '4px 18px 18px 18px', padding: '13px 18px', border: `1px solid ${COMPANION.color}33`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: COMPANION.accent, animation: 'bounce 1.2s infinite', animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{ padding: '14px 20px 20px', background: '#fff', borderTop: '1px solid #ffe0b2', flexShrink: 0 }}>
        {voiceMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => {
                if (listening) { try { recRef.current?.stop(); } catch {} setListening(false); }
                else if (!aiSpeaking && !loading) startListening();
              }}
              style={{
                width: 88, height: 88, borderRadius: '50%',
                background: listening ? 'radial-gradient(circle, #4CAF50, #2e7d32)' : aiSpeaking ? `radial-gradient(circle, ${COMPANION.color}, ${COMPANION.color2})` : `radial-gradient(circle, ${COMPANION.color}88, ${COMPANION.color2}88)`,
                border: `3px solid ${listening ? '#4CAF50' : aiSpeaking ? COMPANION.accent : COMPANION.color + '88'}`,
                fontSize: 36, cursor: 'pointer', color: '#fff',
                boxShadow: listening ? '0 0 40px #4CAF5066' : aiSpeaking ? `0 0 40px ${COMPANION.color}66` : 'none',
                transition: 'all 0.3s',
                animation: listening ? 'pulse 1s infinite' : 'none',
              }}
            >{listening ? '🔴' : aiSpeaking ? '🔊' : '🎤'}</button>
            <div style={{ color: '#999', fontSize: 12, textAlign: 'center' }}>
              {listening ? 'Listening... tap to stop' : aiSpeaking ? `${COMPANION.name} is responding...` : loading ? 'Processing...' : 'Tap to speak or just talk naturally'}
            </div>
            <button onClick={toggleVoice} style={{ background: 'none', border: '1px solid #eee', borderRadius: 10, padding: '6px 18px', color: '#aaa', cursor: 'pointer', fontSize: 12 }}>
              Switch to text →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={`Ask ${COMPANION.name} anything about your little one...`}
              style={{ flex: 1, background: '#fff8f0', border: `1px solid ${COMPANION.color}44`, borderRadius: 14, padding: '13px 18px', color: '#333', fontSize: 14, outline: 'none' }}
            />
            <button onClick={() => startListening()} title="Voice input" style={{
              width: 48, height: 48, borderRadius: 12, cursor: 'pointer', fontSize: 20,
              background: listening ? '#4CAF5022' : '#fff8f0',
              border: `1px solid ${listening ? '#4CAF50' : '#ffe0b2'}`,
            }}>🎤</button>
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
              width: 48, height: 48, borderRadius: 12, cursor: 'pointer', fontSize: 20, color: '#fff',
              background: COMPANION.color, border: 'none',
              opacity: (!input.trim() || loading) ? 0.4 : 1, transition: 'opacity 0.2s',
            }}>→</button>
          </div>
        )}
      </div>
    </div>
  );
}


const ACTIVITIES = [
  {
    id: 1,
    title: 'Counting with Colors',
    category: 'Math',
    ageRange: '2-4 years',
    duration: '15 min',
    icon: '🎨',
    difficulty: 'Beginner',
    description: 'Learn numbers and counting through colorful, hands-on activities.',
    aiSuggested: true,
  },
  {
    id: 2,
    title: 'Story Time: Animals of the World',
    category: 'Literacy',
    ageRange: '3-5 years',
    duration: '20 min',
    icon: '📚',
    difficulty: 'Beginner',
    description: 'Interactive storytelling with animal sounds and vocabulary building.',
    aiSuggested: true,
  },
  {
    id: 3,
    title: 'Finger Painting Masterpiece',
    category: 'Creative Arts',
    ageRange: '1-3 years',
    duration: '25 min',
    icon: '🖌️',
    difficulty: 'Beginner',
    description: 'Sensory exploration through finger painting with safe, washable paints.',
    aiSuggested: false,
  },
  {
    id: 4,
    title: 'Alphabet Dance Party',
    category: 'Language',
    ageRange: '2-5 years',
    duration: '20 min',
    icon: '🎵',
    difficulty: 'Intermediate',
    description: 'Learn letters through movement and music in this energetic activity.',
    aiSuggested: true,
  },
  {
    id: 5,
    title: 'Nature Explorer Walk',
    category: 'Science',
    ageRange: '3-6 years',
    duration: '30 min',
    icon: '🌿',
    difficulty: 'Beginner',
    description: 'Discover nature through observation, questions, and guided discovery.',
    aiSuggested: false,
  },
  {
    id: 6,
    title: 'Shape Sorting Puzzles',
    category: 'Math',
    ageRange: '1-3 years',
    duration: '15 min',
    icon: '🔷',
    difficulty: 'Beginner',
    description: 'Build spatial reasoning and fine motor skills with shape sorting games.',
    aiSuggested: true,
  },
];

const FEATURES = [
  { icon: Brain, title: 'AI-Personalised', desc: 'Activities tailored to your child\'s age, interests, and developmental stage' },
  { icon: BookOpen, title: 'Expert-Designed', desc: 'All activities developed by early childhood education specialists' },
  { icon: Heart, title: 'Safe & Nurturing', desc: 'Every activity is reviewed for safety and emotional wellbeing' },
  { icon: Activity, title: 'Development Tracking', desc: 'Track your child\'s milestones and celebrate their growth journey' },
];

function ActivityCard({ activity }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="activity-card">
      <div className="activity-header">
        <span className="activity-icon">{activity.icon}</span>
        <div className="activity-meta">
          <span className="category-tag">{activity.category}</span>
          <span className="age-tag">Ages {activity.ageRange}</span>
        </div>
        {activity.aiSuggested && (
          <span className="ai-badge">
            <Sparkles size={12} /> AI Pick
          </span>
        )}
      </div>

      <h3 className="activity-title">{activity.title}</h3>
      <p className="activity-desc">{activity.description}</p>

      <div className="activity-details">
        <span className="detail">⏱ {activity.duration}</span>
        <span className="detail">📊 {activity.difficulty}</span>
      </div>

      <div className="activity-actions">
        <button
          className={`like-btn ${liked ? 'liked' : ''}`}
          onClick={() => setLiked(!liked)}
          aria-label={liked ? 'Unlike activity' : 'Like activity'}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
        </button>
        <button className="btn-primary start-btn">Start Activity</button>
      </div>
    </div>
  );
}

function LittleOnesAI() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [childAge, setChildAge] = useState('');
  const [appliedAge, setAppliedAge] = useState('');
  const [screen, setScreen] = useState('home');

  const categories = ['all', 'Math', 'Literacy', 'Language', 'Creative Arts', 'Science'];

  // Show the AI companion chat full-screen when selected.
  if (screen === 'chat') return <ChatInterface onBack={() => setScreen('home')} />;

  /**
   * Parse an age-range string into { min, max }.
   * Handles activity ageRange values ("2-4 years") and childAge option values ("2-3").
   * The character class includes both a regular hyphen (-) and an en dash (–) because
   * activity descriptions may use either typographic convention.
   */
  function parseAgeRange(rangeStr) {
    const match = String(rangeStr).match(/(\d+)[–\-](\d+)/);
    if (!match) return { min: 0, max: 6 };
    return { min: parseInt(match[1], 10), max: parseInt(match[2], 10) };
  }

  const filtered = ACTIVITIES.filter((a) => {
    const categoryMatch = activeCategory === 'all' || a.category === activeCategory;
    if (!categoryMatch) return false;
    if (!appliedAge) return true;
    const childRange = parseAgeRange(appliedAge);
    const activityRange = parseAgeRange(a.ageRange);
    // Activity is suitable if its age range overlaps with the child's age range.
    return activityRange.min <= childRange.max && activityRange.max >= childRange.min;
  });

  function handleFindActivities() {
    setAppliedAge(childAge);
    document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Baby size={28} className="logo-icon" />
            <div>
              <h1>Little Ones AI</h1>
              <p>Early learning, powered by AI</p>
            </div>
          </div>
          <nav className="header-nav">
            <a href="#activities" onClick={(e) => { e.preventDefault(); setScreen('home'); }}>Activities</a>
            <a href="#milestones" onClick={(e) => { e.preventDefault(); setScreen('home'); }}>Milestones</a>
            <a href="#features" onClick={(e) => { e.preventDefault(); setScreen('home'); }}>Features</a>
            <button className="btn-primary nav-btn" onClick={() => setScreen('chat')}>
              <MessageCircle size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />Chat with Sunny
            </button>
            <button className="btn-primary nav-btn hide-mobile" onClick={() => setScreen('pricing')}>Pricing</button>
            <button className="btn-primary nav-btn hide-mobile" onClick={() => setScreen('home')}>Get Started Free</button>
          </nav>
        </div>
      </header>

      {screen === 'pricing' ? (
        <Pricing />
      ) : (
        <>
          <section className="hero">
            <div className="hero-content">
              <h2 className="hero-title">
                Nurture Curiosity<br />
                <span className="gradient-text">Every Day, Every Way</span>
              </h2>
              <p className="hero-subtitle">
                Personalised learning activities for little ones aged 0–6 years.
                Our AI crafts the perfect activities based on your child's age, interests, and development.
              </p>
              <div className="age-selector">
                <label htmlFor="child-age">My child is</label>
                <select
                  id="child-age"
                  className="age-select"
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                >
                  <option value="">Select age</option>
                  <option value="0-1">0–1 year (Baby)</option>
                  <option value="1-2">1–2 years (Toddler)</option>
                  <option value="2-3">2–3 years (Toddler)</option>
                  <option value="3-4">3–4 years (Pre-schooler)</option>
                  <option value="4-5">4–5 years (Pre-schooler)</option>
                  <option value="5-6">5–6 years (Kindergarten)</option>
                </select>
                <button className="btn-primary" onClick={handleFindActivities}>Find Activities</button>
              </div>
            </div>
            <div className="hero-badges">
              <span className="badge">🎓 Educator Approved</span>
              <span className="badge">🔒 Privacy First</span>
              <span className="badge">🌟 10,000+ Families</span>
            </div>
          </section>

          <section id="features" className="features-section">
            <div className="section-content">
              <h2 className="section-title">Why Little Ones AI?</h2>
              <div className="features-grid">
                {FEATURES.map((f) => (
                  <div key={f.title} className="feature-card">
                    <f.icon size={32} className="feature-icon" />
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="activities" className="activities-section">
            <div className="section-content">
              <h2 className="section-title">
                {appliedAge ? `Activities for Ages ${appliedAge.replace('-', '–')}` : "Today's Activities"}
              </h2>
              {appliedAge && (
                <div className="category-bar" style={{ marginBottom: '0.5rem' }}>
                  <button
                    className="category-btn active"
                    onClick={() => setAppliedAge('')}
                    aria-label="Clear age filter"
                  >
                    ✕ Clear age filter
                  </button>
                </div>
              )}
              <div className="category-bar">
                {categories.map((c) => (
                  <button
                    key={c}
                    className={`category-btn ${activeCategory === c ? 'active' : ''}`}
                    onClick={() => setActiveCategory(c)}
                  >
                    {c === 'all' ? 'All Activities' : c}
                  </button>
                ))}
              </div>
              <div className="activities-grid">
                {filtered.length > 0 ? (
                  filtered.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 0' }}>
                    No activities found for this age and category. Try a different category or age.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="cta-section">
            <div className="cta-content">
              <Smile size={48} className="cta-icon" />
              <h2>Ready to spark your little one's curiosity?</h2>
              <p>Join thousands of families already using Little Ones AI to support their child's growth.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
                <button className="btn-primary btn-large" onClick={() => setScreen('chat')}>
                  🌟 Chat with Sunny — AI Guide
                </button>
                <button className="btn-primary btn-large" onClick={() => setScreen('pricing')}>
                  See Plans — Start Free
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      <footer className="footer">
        <p>© 2024 Little Ones AI — Nurturing the next generation, one activity at a time</p>
      </footer>
    </div>
  );
}

export default LittleOnesAI;
