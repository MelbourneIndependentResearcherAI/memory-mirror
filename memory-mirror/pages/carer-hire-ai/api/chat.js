/**
 * Serverless function: POST /api/chat
 *
 * Server-side proxy for the Anthropic Claude API.
 * Keeps ANTHROPIC_API_KEY secret — never exposed to the browser.
 *
 * Body:
 *   systemPrompt — string, the carer's system prompt (max 3000 chars)
 *   messages     — Array<{ role: 'user'|'assistant', content: string }>
 *
 * Returns: { text: string }
 *
 * Required environment variable:
 *   ANTHROPIC_API_KEY — Anthropic secret key (server-side only, no VITE_ prefix)
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 1000;
const MAX_MESSAGES = 100;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_SYSTEM_PROMPT_LENGTH = 3000;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[chat] ANTHROPIC_API_KEY is not configured');
    return res.status(500).json({ error: 'AI service is not configured.' });
  }

  const { systemPrompt, messages } = req.body ?? {};

  // Validate inputs
  if (typeof systemPrompt !== 'string' || !systemPrompt.trim()) {
    return res.status(400).json({ error: 'systemPrompt is required.' });
  }
  if (systemPrompt.length > MAX_SYSTEM_PROMPT_LENGTH) {
    return res.status(400).json({ error: 'systemPrompt is too long.' });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages must be a non-empty array.' });
  }
  if (messages.length > MAX_MESSAGES) {
    return res.status(400).json({ error: `messages must not exceed ${MAX_MESSAGES} items.` });
  }
  for (const msg of messages) {
    if (!msg || !['user', 'assistant'].includes(msg.role)) {
      return res.status(400).json({ error: 'Each message must have role "user" or "assistant".' });
    }
    if (typeof msg.content !== 'string') {
      return res.status(400).json({ error: 'Each message must have a string content field.' });
    }
    if (msg.content.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: 'A message content value exceeds the maximum length.' });
    }
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[chat] Anthropic API error:', data?.error?.message ?? response.status);
      return res.status(502).json({ error: 'AI service returned an error. Please try again.' });
    }

    const text = data.content?.find((b) => b.type === 'text')?.text;
    if (!text) {
      return res.status(502).json({ error: 'No text response from AI service.' });
    }

    return res.status(200).json({ text });
  } catch (err) {
    console.error('[chat] Request failed:', err.message);
    return res.status(500).json({ error: 'Failed to reach AI service.' });
  }
}
