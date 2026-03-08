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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { app, planId, planName, amount, name, email, reference } = req.body ?? {};

  if (!planId || !email || !name || !reference) {
    return res.status(400).json({ error: 'planId, name, email, and reference are required.' });
  }

  try {
    const { error: dbError } = await supabase
      .from('manual_payment_requests')
      .insert({
        app: app ?? 'little-ones-ai',
        plan_id: planId,
        plan_name: planName,
        amount,
        name,
        email,
        reference,
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
