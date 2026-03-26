import { useState } from "react";
import "../styles/landing.css";

const FAQS = [
  {
    q: "What is Memory Mirror?",
    a: "Memory Mirror is a premium AI care companion app designed specifically for people living with dementia, and the families and professional carers who support them. It includes AI-powered companions (carers and AI grandchildren), a memory journaling tool, music therapy, a safe banking view, photo hub, and a morning wellness routine.",
  },
  {
    q: "Who is this app designed for?",
    a: "Memory Mirror is designed for three groups: (1) People living with dementia who want a warm, patient companion available at any hour. (2) Family carers who need support engaging their loved one throughout the day. (3) Professional aged care workers and facilities who want to add a compassionate digital engagement tool to their care toolkit.",
  },
  {
    q: "How does the AI companion (Carer Hire AI) work?",
    a: "Each AI carer has a unique name, background, personality and way of speaking. You choose who your loved one connects with most. Conversations happen in real-time — either by typing or using the hands-free voice mode (just speak naturally, no buttons needed). The AI never talks down to your loved one — always adult to adult, with warmth and dignity.",
  },
  {
    q: "What is Little Ones AI?",
    a: "Little Ones AI is a collection of AI grandchildren — children aged 7–11 — who talk to Nanny or Poppy as if visiting. They ask questions, share excitement, and make your loved one feel like the most important person in the world. Children naturally change subjects, which is a gentle and invisible way to redirect a distressed or confused person — it never feels like 'care'.",
  },
  {
    q: "Is my information safe and private?",
    a: "Yes. In this demonstration version of Memory Mirror, all data — your name, email, memories, and photos — is stored only on your own device using your browser's local storage. Nothing is ever transmitted to any external server. No data is shared with third parties.",
  },
  {
    q: "Is this a real subscription? Do I need to pay?",
    a: "Memory Mirror is currently running in Demo Mode. No real payments are processed. When you select a Care Plan or Premium plan, your choice is simply saved locally on your device — no card is charged. This allows you to experience the full app as it would work in a live environment.",
  },
  {
    q: "What is the difference between the Free plan and the Care Plan?",
    a: "The Free plan gives you access to Memory Mirror (memory journaling), Photo Hub, Music Therapy, and the Safe Banking view. The Care Plan adds the AI companion features — Carer Hire AI, Little Ones AI, Fresh Start AI morning routine, and the Phone companion. The Premium plan unlocks all 6 carer personalities and all 6 AI grandchildren, plus family sharing.",
  },
  {
    q: "Can I change my plan at any time?",
    a: "Yes. You can change your plan at any time by tapping the ⚙️ settings icon on the home screen and selecting 'Change Plan'. In demo mode, changes take effect immediately with no charge.",
  },
  {
    q: "Does the app work on mobile and tablet?",
    a: "Yes. Memory Mirror is fully responsive and designed to work beautifully on tablets and mobile phones. For elderly users, a tablet is often the ideal device — larger touch targets, clearer text, and a comfortable viewing experience.",
  },
  {
    q: "Do I need an internet connection?",
    a: "For the AI companion features (Carer Hire AI and Little Ones AI), yes — these features communicate with an AI service and require a stable internet connection. Memory Mirror, Photo Hub, Music Therapy, Banking and Fresh Start AI all work without an internet connection once the app is loaded.",
  },
  {
    q: "Is Memory Mirror a replacement for real carers?",
    a: "No — and we want to be very clear about this. Memory Mirror is a supplement to human care, not a replacement. It is designed to fill the gaps between carer visits, during the night, or in moments when family members need a rest. Real human connection, professional care and medical support remain essential. Memory Mirror is a tool to help, not to replace.",
  },
  {
    q: "What languages does Memory Mirror support?",
    a: "Currently, Memory Mirror supports English (Australian). The app uses Australian voice recognition and spelling. Additional language support is planned for future versions.",
  },
  {
    q: "How do I remove my account and data?",
    a: "To remove all your data, tap the ⚙️ settings icon on the home screen and select 'Sign Out'. This will clear all stored information from your device, including your name, email, tier selection, and any saved memories. Since data is stored locally only, this action is immediate and complete.",
  },
  {
    q: "Who built Memory Mirror?",
    a: "Memory Mirror was built by MM AI Technologies, founded by a carer for their own family. The app was designed from the ground up with dignity, warmth, and accessibility as its core values — not as an afterthought.",
  },
  {
    q: "How do I get support?",
    a: "In demo mode, support is not yet active. In the live version of Memory Mirror, Care Plan subscribers receive priority email support and Premium subscribers receive phone support. You can contact us at support@memory-mirror.app.",
  },
];

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="l-faq-item">
      <button className={`l-faq-question${open ? " open" : ""}`} onClick={() => setOpen(o => !o)}>
        <span className="l-faq-question-text">{item.q}</span>
        <span className={`l-faq-chevron${open ? " open" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="l-faq-answer">
          <p>{item.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage({ onBack, onGetStarted }) {
  return (
    <div className="l-page">
      {/* Demo banner */}
      <div className="l-demo-banner">
        🔬 Demo Mode — This is a demonstration application. No real payments are processed.
      </div>

      {/* Nav */}
      <nav className="l-nav">
        <div className="l-nav-brand">
          <span className="l-nav-brand-icon">🪞</span>
          <span className="l-nav-brand-name">Memory Mirror</span>
        </div>
        <div className="l-nav-links">
          {onBack       && <button className="l-nav-link" onClick={onBack}>← Back</button>}
          {onGetStarted && <button className="l-nav-btn"  onClick={onGetStarted}>Get Started</button>}
        </div>
      </nav>

      <section className="l-section" style={{ paddingTop: 52 }}>
        <h1 className="l-section-title">
          Frequently Asked <span style={{ color: "#4ade80" }}>Questions</span>
        </h1>
        <p className="l-section-sub">
          Everything you need to know about Memory Mirror.
        </p>

        <div className="l-faq-list">
          {FAQS.map((item, i) => (
            <FaqItem key={i} item={item} />
          ))}
        </div>

        {onGetStarted && (
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <p style={{ fontSize: 15, color: "#86efac", marginBottom: 20 }}>
              Ready to get started?
            </p>
            <button className="l-btn-primary" onClick={onGetStarted}>
              Create Your Free Account →
            </button>
          </div>
        )}
      </section>

      <footer className="l-footer">
        <div className="l-footer-brand">🪞 Memory Mirror · MM AI Technologies · Demo Mode</div>
      </footer>
    </div>
  );
}
