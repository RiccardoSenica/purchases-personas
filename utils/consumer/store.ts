import 'dotenv/config';
import { consumer, consumerSchema } from './types';
import { Tool } from './tool';
import { BaseTool, makeRequest } from '../anthropicClient';
import { generatePrompt } from './prompt';

export async function generate(apiKey: string) {
  const prompt = `${generatePrompt()} ${process.env.Consumer_PROMPT}`;

  const result = (await makeRequest(
    apiKey,
    prompt,
    Tool as BaseTool
  )) as consumer;

  const validConsumer = consumerSchema.safeParse(result);

  if (validConsumer.error) {
    throw Error(`Invalid consumer generated: ${validConsumer.error.message}`);
  }

  console.info('Generated consumer', validConsumer.data);

  return validConsumer.data;
}
