import { app } from '@azure/functions';
import Anthropic from '@anthropic-ai/sdk';

app.http('chat', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request) => {
    const { messages } = await request.json();

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const response = await client.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages
    });

    return {
      status: 200,
      jsonBody: response
    };
  }
});
