/**
 * Serverless function: POST /api/chat
 *
 * Server-side proxy for the Anthropic Claude API.
 * Keeps ANTHROPIC_API_KEY secret — never exposed to the browser.
 *
 * Body:
 *   systemPrompt — string, the companion's system prompt (max 3000 chars)
 *   messages     — Array<{ role: 'user'|'assistant', content: string }>
 *
 * Returns: { text: string }
 *
 * Required environment variable:
 *   ANTHROPIC_API_KEY — Anthropic secret key (server-side only, no VITE_ prefix)
 */

import { app } from '@azure/functions';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 1000;
const MAX_MESSAGES = 100;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_SYSTEM_PROMPT_LENGTH = 3000;

app.http('chat', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      context.error('[chat] ANTHROPIC_API_KEY is not configured');
      return { status: 500, jsonBody: { error: 'AI service is not configured.' } };
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return { status: 400, jsonBody: { error: 'Invalid JSON body.' } };
    }

    const { systemPrompt, messages } = body ?? {};

    // Validate inputs
    if (typeof systemPrompt !== 'string' || !systemPrompt.trim()) {
      return { status: 400, jsonBody: { error: 'systemPrompt is required.' } };
    }
    if (systemPrompt.length > MAX_SYSTEM_PROMPT_LENGTH) {
      return { status: 400, jsonBody: { error: 'systemPrompt is too long.' } };
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return { status: 400, jsonBody: { error: 'messages must be a non-empty array.' } };
    }
    if (messages.length > MAX_MESSAGES) {
      return { status: 400, jsonBody: { error: `messages must not exceed ${MAX_MESSAGES} items.` } };
    }
    for (const msg of messages) {
      if (!msg || !['user', 'assistant'].includes(msg.role)) {
        return { status: 400, jsonBody: { error: 'Each message must have role "user" or "assistant".' } };
      }
      if (typeof msg.content !== 'string') {
        return { status: 400, jsonBody: { error: 'Each message must have a string content field.' } };
      }
      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        return { status: 400, jsonBody: { error: 'A message content value exceeds the maximum length.' } };
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
        context.error('[chat] Anthropic API error:', data?.error?.message ?? response.status);
        return { status: 502, jsonBody: { error: 'AI service returned an error. Please try again.' } };
      }

      const text = data.content?.find((b) => b.type === 'text')?.text;
      if (!text) {
        return { status: 502, jsonBody: { error: 'No text response from AI service.' } };
      }

      return { status: 200, jsonBody: { text } };
    } catch (err) {
      context.error('[chat] Request failed:', err.message);
      return { status: 500, jsonBody: { error: 'Failed to reach AI service.' } };
    }
  },
});
