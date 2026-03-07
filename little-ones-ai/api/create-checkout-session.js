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

/** Plans available for Little Ones AI */
const PLANS = {
  free_trial: null, // handled client-side — no payment required
  one_grandchild: {
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: 'aud',
          product_data: { name: 'Little Ones AI — One Grandchild', description: 'AI-personalised activities for one child.' },
          unit_amount: 1499, // $14.99 AUD in cents
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    metadata: { app: 'little-ones-ai', plan: 'one_grandchild' },
  },
  full_family: {
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: 'aud',
          product_data: { name: 'Little Ones AI — Full Family', description: 'AI-personalised activities for up to 4 children.' },
          unit_amount: 2999, // $29.99 AUD in cents
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    metadata: { app: 'little-ones-ai', plan: 'full_family' },
  },
  bundle: {
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: 'aud',
          product_data: { name: 'Little Ones AI — Bundle', description: 'Unlimited children + Carer Hire AI access included.' },
          unit_amount: 5499, // $54.99 AUD in cents
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    metadata: { app: 'little-ones-ai', plan: 'bundle' },
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
