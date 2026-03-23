/**
 * Serverless function: POST /api/stripe-webhook
 *
 * Verifies the Stripe webhook signature and, on successful payment events,
 * activates the subscriber account in Supabase.
 *
 * Required environment variables:
 *   STRIPE_WEBHOOK_SECRET   — from Stripe Dashboard > Webhooks
 *   STRIPE_SECRET_KEY       — Stripe secret key
 *   SUPABASE_URL            — your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY — Supabase service-role key (server-side only)
 *
 * Configure your raw-body middleware before this handler.
 * For Vercel, set `export const config = { api: { bodyParser: false } }`.
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Required by Vercel to receive raw request body for signature verification.
export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function upsertSubscriber({ email, customerId, plan, app, status, stripeData }) {
  const { error } = await supabase.from('subscribers').upsert(
    {
      email,
      stripe_customer_id: customerId,
      plan,
      app,
      status,
      stripe_data: stripeData,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'email,app' }
  );
  if (error) {
    console.error('Supabase upsert error:', error.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const email = session.customer_email ?? session.customer_details?.email;
      const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
      const plan = session.metadata?.plan ?? 'unknown';
      const app = session.metadata?.app ?? 'carer-hire-ai';

      await upsertSubscriber({
        email,
        customerId,
        plan,
        app,
        status: 'active',
        stripeData: { session_id: session.id, payment_status: session.payment_status },
      });
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object;
      const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;
      const plan = sub.metadata?.plan ?? 'unknown';
      const app = sub.metadata?.app ?? 'carer-hire-ai';
      const status = sub.status === 'active' ? 'active' : 'inactive';

      // Retrieve email via customer object
      let email = null;
      try {
        const customer = await stripe.customers.retrieve(customerId);
        email = customer.email;
      } catch (err) {
        console.error('Could not retrieve customer:', err.message);
      }

      if (email) {
        await upsertSubscriber({
          email,
          customerId,
          plan,
          app,
          status,
          stripeData: { subscription_id: sub.id, subscription_status: sub.status },
        });
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;
      const app = sub.metadata?.app ?? 'carer-hire-ai';

      let email = null;
      try {
        const customer = await stripe.customers.retrieve(customerId);
        email = customer.email;
      } catch (err) {
        console.error('Could not retrieve customer:', err.message);
      }

      if (email) {
        const { error } = await supabase
          .from('subscribers')
          .update({ status: 'cancelled', updated_at: new Date().toISOString() })
          .eq('email', email)
          .eq('app', app);
        if (error) console.error('Supabase update error:', error.message);
      }
      break;
    }

    default:
      // Ignore other event types
      break;
  }

  return res.status(200).json({ received: true });
}
