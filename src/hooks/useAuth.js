import { useState } from 'react';

const USER_KEY = 'mm_user';
const TIER_KEY = 'mm_tier';

export const TIER_PERMISSIONS = {
  free:    ['memory', 'banking', 'photos', 'music'],
  care:    ['memory', 'banking', 'photos', 'music', 'fresh', 'dialpad', 'carer', 'little'],
  premium: ['memory', 'banking', 'photos', 'music', 'fresh', 'dialpad', 'carer', 'little'],
};

export const TIER_MAX_PERSONAS = {
  free:    0,
  care:    3,
  premium: 6,
};

export const TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceLabel: 'Free forever',
    description: 'Essential tools to get started with compassionate care.',
    features: [
      'Memory Mirror (up to 20 memories)',
      'Photo Hub',
      'Music Therapy',
      'Safe Banking view',
      'Email support',
    ],
    cta: 'Start Free',
    highlight: false,
    badge: null,
  },
  {
    id: 'care',
    name: 'Care Plan',
    price: 6.99,
    priceLabel: '$6.99 / month',
    description: 'The full daily companion suite for you and your loved one.',
    features: [
      'Everything in Free',
      'Unlimited memories',
      'Fresh Start AI morning routine',
      'Phone companion',
      'Carer Hire AI (3 warm personalities)',
      'Little Ones AI (3 AI grandchildren)',
      'Priority email support',
    ],
    cta: 'Start 7-Day Free Trial',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 14.99,
    priceLabel: '$14.99 / month',
    description: 'The complete Memory Mirror experience with no limits.',
    features: [
      'Everything in Care Plan',
      'All 6 Carer personalities',
      'All 6 AI Grandchildren',
      'Family sharing — 3 profiles',
      'Memory export to PDF',
      'Priority phone support',
    ],
    cta: 'Start 7-Day Free Trial',
    highlight: false,
    badge: 'Best Value',
  },
];

function readUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; } catch { return null; }
}

function readTier() {
  try { return localStorage.getItem(TIER_KEY) || null; } catch { return null; }
}

export function useAuth() {
  const [user, setUser] = useState(() => readUser());
  const [tier, setTier] = useState(() => readTier());

  const register = (name, email) => {
    const u = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      registeredAt: new Date().toISOString(),
    };
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  };

  const selectTier = (tierId) => {
    localStorage.setItem(TIER_KEY, tierId);
    setTier(tierId);
  };

  const signOut = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TIER_KEY);
    setUser(null);
    setTier(null);
  };

  const canAccess = (tileId) => {
    if (!tier) return false;
    return (TIER_PERMISSIONS[tier] || []).includes(tileId);
  };

  return {
    user,
    tier,
    isRegistered: !!user,
    hasTier: !!tier,
    register,
    selectTier,
    signOut,
    canAccess,
    maxPersonas: tier ? (TIER_MAX_PERSONAS[tier] ?? 0) : 0,
  };
}
