/**
 * Serverless function: POST /api/create-checkout-session
 *
 * Body: { planId: string, email?: string, successUrl: string, cancelUrl: string }
 *
 * Returns: { url: string } — the Stripe Checkout URL to redirect to.
 *
 * Compatible with Vercel (export default handler) and Netlify (export handler).
 * For Netlify, rename the export to `handler` and adjust the event shape accordingly.
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/** Plans available for Carer Hire AI */
const PLANS = {
  free_trial: null, // handled client-side — no payment required
  per_session: {
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'aud',
          product_data: { name: 'Carer Hire AI — Per Session', description: 'Single session with your chosen AI carer.' },
          unit_amount: 299, // $2.99 AUD in cents
        },
        quantity: 1,
      },
    ],
    metadata: { app: 'carer-hire-ai', plan: 'per_session' },
  },
  daily_companion: {
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: 'aud',
          product_data: { name: 'Carer Hire AI — Daily Companion', description: 'Daily companionship, unlimited sessions per month.' },
          unit_amount: 1999, // $19.99 AUD in cents
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    metadata: { app: 'carer-hire-ai', plan: 'daily_companion' },
  },
  full_circle: {
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: 'aud',
          product_data: { name: 'Carer Hire AI — Full Circle', description: 'Full access: all carers, priority support, family dashboard.' },
          unit_amount: 3999, // $39.99 AUD in cents
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    metadata: { app: 'carer-hire-ai', plan: 'full_circle' },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { planId, email, successUrl, cancelUrl } = req.body ?? {};

  if (!planId || !successUrl || !cancelUrl) {
    return res.status(400).json({ error: 'planId, successUrl, and cancelUrl are required.' });
  }

  if (planId === 'free_trial') {
    return res.status(200).json({ free: true });
  }

  const plan = PLANS[planId];
  if (!plan) {
    return res.status(400).json({ error: `Unknown plan: ${planId}` });
  }

  try {
    const sessionParams = {
      mode: plan.mode,
      line_items: plan.line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: plan.metadata,
    };

    if (email) {
      sessionParams.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: 'Failed to create checkout session.' });
  }
}
