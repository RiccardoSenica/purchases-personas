import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';

export interface BaseTool {
  readonly name: string;
  readonly input_schema: {
    readonly type: 'object';
    readonly properties: Record<string, unknown>;
    readonly required?: readonly string[];
    readonly description?: string;
  };
}

export async function makeRequest<T extends BaseTool>(
  apiKey: string,
  prompt: string,
  tool: T
) {
  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
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
  } catch (error) {
    throw Error('Anthropic client error.');
  }
}
