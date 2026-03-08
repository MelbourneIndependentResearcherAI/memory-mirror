/**
 * Serverless function: POST /api/manual-payment
 *
 * Records a manual bank-transfer payment request in the database.
 * An admin must manually confirm the transfer and activate the subscription.
 *
 * Body:
 *   app       — 'little-ones-ai' | 'carer-hire-ai'
 *   planId    — plan identifier (e.g. 'one_grandchild')
 *   planName  — human-readable plan name
 *   amount    — numeric plan price (AUD)
 *   name      — subscriber's full name
 *   email     — subscriber's email
 *   reference — unique payment reference generated client-side
 *
 * Returns: { ok: true, reference }
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

/** Authoritative plan amounts (AUD) — validated server-side. */
const PLAN_AMOUNTS = {
  one_grandchild: 14.99,
  full_family: 29.99,
  bundle: 54.99,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { app, planId, planName, amount, name, email, reference } = req.body ?? {};

  if (!planId || !email || !name || !reference) {
    return res.status(400).json({ error: 'planId, name, email, and reference are required.' });
  }

  // Validate planId against known plans and enforce server-authoritative amount.
  if (!Object.prototype.hasOwnProperty.call(PLAN_AMOUNTS, planId)) {
    return res.status(400).json({ error: 'Unknown plan.' });
  }
  const authorisedAmount = PLAN_AMOUNTS[planId];

  // Basic input length guards.
  if (typeof name !== 'string' || name.trim().length === 0 || name.length > 200) {
    return res.status(400).json({ error: 'Invalid name.' });
  }
  if (typeof email !== 'string' || email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }
  if (typeof reference !== 'string' || reference.trim().length === 0 || reference.length > 100) {
    return res.status(400).json({ error: 'Invalid payment reference.' });
  }

  try {
    const { error: dbError } = await supabase
      .from('manual_payment_requests')
      .insert({
        app: app ?? 'little-ones-ai',
        plan_id: planId,
        plan_name: planName,
        amount: authorisedAmount,
        name: name.trim(),
        email: email.trim(),
        reference: reference.trim(),
        status: 'pending',
      });

    if (dbError) {
      console.error('Supabase insert error:', dbError.message);
      // Postgres unique-violation code is '23505'
      if (dbError.code === '23505') {
        return res.status(409).json({ error: 'This payment reference has already been submitted. Please try again.' });
      }
      return res.status(500).json({ error: 'Failed to record payment request.' });
    }

    return res.status(200).json({ ok: true, reference });
  } catch (err) {
    console.error('Manual payment error:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
