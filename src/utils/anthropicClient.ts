import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';

export async function makeRequest(prompt: string, tool: any) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw Error('Anthropic API key missing.');
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    temperature: 1,
    tools: [tool],
    messages: [{ role: 'user', content: prompt }]
  });

  if (response.stop_reason && response.stop_reason !== 'tool_use') {
    throw Error(JSON.stringify(response));
  }

  if (response.content.length != 2) {
    throw Error(JSON.stringify(response));
  }

  const content = response.content as [
    { type: string; text: string },
    { type: string; input: object }
  ];

  return content[1].input;
}
