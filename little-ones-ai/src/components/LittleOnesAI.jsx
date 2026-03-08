import React, { useState } from 'react';
import { BookOpen, Star, Heart, Smile, Brain, Music, Palette, Activity, ChevronRight, Sparkles, Baby } from 'lucide-react';
import '../styles/LittleOnesAI.css';
import Pricing from './Pricing';

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

  /**
   * Parse an age-range string such as "2-4 years" or "0-1" into { min, max }.
   * Handles both activity ranges ("2-4 years") and childAge option values ("2-3").
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
            <button className="btn-primary nav-btn" onClick={() => setScreen('pricing')}>Pricing</button>
            <button className="btn-primary nav-btn" onClick={() => setScreen('home')}>Get Started Free</button>
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
                    onClick={() => { setAppliedAge(''); setChildAge(''); }}
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
              <button className="btn-primary btn-large" onClick={() => setScreen('pricing')}>
                See Plans — Start Free
              </button>
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
