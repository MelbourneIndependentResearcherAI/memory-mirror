import React, { useState } from 'react';
import { Search, Star, MapPin, Clock, Heart, Shield, Users, ChevronRight, CheckCircle } from 'lucide-react';
import '../styles/CarerHireAI.css';

const SAMPLE_CARERS = [
  {
    id: 1,
    name: 'Sarah Thompson',
    role: 'Senior Carer',
    rating: 4.9,
    reviews: 127,
    location: 'Melbourne, VIC',
    experience: '8 years',
    specialties: ['Aged Care', 'Dementia Support', 'Palliative Care'],
    available: true,
    verified: true,
    avatar: 'ST',
  },
  {
    id: 2,
    name: 'James Wilson',
    role: 'Disability Support Worker',
    rating: 4.8,
    reviews: 94,
    location: 'Sydney, NSW',
    experience: '5 years',
    specialties: ['Disability Support', 'NDIS', 'Mental Health'],
    available: true,
    verified: true,
    avatar: 'JW',
  },
  {
    id: 3,
    name: 'Emma Chen',
    role: 'Community Care Nurse',
    rating: 5.0,
    reviews: 63,
    location: 'Brisbane, QLD',
    experience: '10 years',
    specialties: ['Nursing', 'Wound Care', 'Medication Management'],
    available: false,
    verified: true,
    avatar: 'EC',
  },
];

function CarerCard({ carer }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="carer-card">
      <div className="carer-card-header">
        <div className="carer-avatar">{carer.avatar}</div>
        <div className="carer-info">
          <div className="carer-name-row">
            <h3 className="carer-name">{carer.name}</h3>
            {carer.verified && (
              <span className="verified-badge">
                <CheckCircle size={14} /> Verified
              </span>
            )}
          </div>
          <p className="carer-role">{carer.role}</p>
          <div className="carer-rating">
            <Star size={14} className="star-icon" />
            <span>{carer.rating}</span>
            <span className="reviews">({carer.reviews} reviews)</span>
          </div>
        </div>
        <button
          className={`save-btn ${saved ? 'saved' : ''}`}
          onClick={() => setSaved(!saved)}
          aria-label={saved ? 'Unsave carer' : 'Save carer'}
        >
          <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="carer-details">
        <span className="detail-item">
          <MapPin size={13} /> {carer.location}
        </span>
        <span className="detail-item">
          <Clock size={13} /> {carer.experience}
        </span>
        <span className={`availability ${carer.available ? 'available' : 'unavailable'}`}>
          {carer.available ? 'Available Now' : 'Currently Busy'}
        </span>
      </div>

      <div className="specialties">
        {carer.specialties.map((s) => (
          <span key={s} className="specialty-tag">{s}</span>
        ))}
      </div>

      <div className="carer-actions">
        <button className="btn-secondary">View Profile</button>
        <button className="btn-primary">Contact Carer</button>
      </div>
    </div>
  );
}

function CarerHireAI() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = ['all', 'aged care', 'disability', 'nursing', 'available'];

  const filteredCarers = SAMPLE_CARERS.filter((carer) => {
    const matchesSearch =
      !searchQuery ||
      carer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      carer.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      carer.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'available' && carer.available) ||
      carer.specialties.some((s) => s.toLowerCase().includes(activeFilter.toLowerCase()));

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Shield size={28} className="logo-icon" />
            <div>
              <h1>Carer Hire AI</h1>
              <p>Find your perfect carer, powered by AI</p>
            </div>
          </div>
          <nav className="header-nav">
            <a href="#how-it-works">How It Works</a>
            <a href="#carers">Browse Carers</a>
            <button className="btn-primary nav-btn">Post a Job</button>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h2 className="hero-title">
            Find Trusted Carers<br />
            <span className="gradient-text">Powered by AI Matching</span>
          </h2>
          <p className="hero-subtitle">
            Connect with verified, experienced carers for aged care, disability support,
            and community nursing — matched to your specific needs.
          </p>
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, specialty, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="stats">
            <div className="stat">
              <Users size={20} />
              <span><strong>2,400+</strong> Verified Carers</span>
            </div>
            <div className="stat">
              <Star size={20} />
              <span><strong>4.9/5</strong> Average Rating</span>
            </div>
            <div className="stat">
              <CheckCircle size={20} />
              <span><strong>100%</strong> Background Checked</span>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <div className="section-content">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Describe Your Needs</h3>
              <p>Tell us about the care required — type, frequency, location, and any special requirements.</p>
            </div>
            <ChevronRight size={24} className="step-arrow" />
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI Matching</h3>
              <p>Our AI matches you with the most suitable verified carers based on your unique requirements.</p>
            </div>
            <ChevronRight size={24} className="step-arrow" />
            <div className="step">
              <div className="step-number">3</div>
              <h3>Connect & Hire</h3>
              <p>Review profiles, read reviews, and connect directly with your preferred carer.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="carers" className="carers-section">
        <div className="section-content">
          <h2 className="section-title">Available Carers</h2>
          <div className="filter-bar">
            {filters.map((f) => (
              <button
                key={f}
                className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          {filteredCarers.length === 0 ? (
            <div className="empty-state">
              <p>No carers found matching your search. Try different keywords.</p>
            </div>
          ) : (
            <div className="carers-grid">
              {filteredCarers.map((carer) => (
                <CarerCard key={carer.id} carer={carer} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <p>© 2024 Carer Hire AI — Connecting families with trusted carers</p>
      </footer>
    </div>
  );
}

export default CarerHireAI;
