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
      context.log.error('[chat] ANTHROPIC_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service is not configured.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { systemPrompt, messages } = body ?? {};

    if (typeof systemPrompt !== 'string' || !systemPrompt.trim()) {
      return new Response(
        JSON.stringify({ error: 'systemPrompt is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (systemPrompt.length > MAX_SYSTEM_PROMPT_LENGTH) {
      return new Response(
        JSON.stringify({ error: 'systemPrompt is too long.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'messages must be a non-empty array.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: `messages must not exceed ${MAX_MESSAGES} items.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    for (const msg of messages) {
      if (!msg || !['user', 'assistant'].includes(msg.role)) {
        return new Response(
          JSON.stringify({ error: 'Each message must have role "user" or "assistant".' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (typeof msg.content !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Each message must have a string content field.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        return new Response(
          JSON.stringify({ error: 'A message content value exceeds the maximum length.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
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
        context.log.error('[chat] Anthropic API error:', data?.error?.message ?? response.status);
        return new Response(
          JSON.stringify({ error: 'AI service returned an error. Please try again.' }),
          { status: 502, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const text = data.content?.find((b) => b.type === 'text')?.text;
      if (!text) {
        return new Response(
          JSON.stringify({ error: 'No text response from AI service.' }),
          { status: 502, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ text }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );

    } catch (err) {
      context.log.error('[chat] Request failed:', err.message);
      return new Response(
        JSON.stringify({ error: 'Failed to reach AI service.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
});
