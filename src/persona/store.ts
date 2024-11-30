import 'dotenv/config';
import fs from 'fs';
import { Persona, personaSchema } from './types';
import { Tool } from './tool';
import { BaseTool, makeRequest } from '../utils/anthropicClient';
import { createFolderIfNotExists } from '../utils/createFolder';
import { generatePrompt } from './prompt';
import { randomUUID } from 'crypto';

export async function generate() {
  const prompt = `${generatePrompt()} ${process.env.PERSONA_PROMPT}`;

  const result = (await makeRequest(prompt, Tool as BaseTool)) as Persona;

  const validPersona = personaSchema.safeParse(result);

  if (validPersona.error) {
    throw Error(`Invalid Persona generated: ${validPersona.error.message}`);
  }

  const id = randomUUID();

  await saveToJson(validPersona.data, id);

  console.log(`Persona name: ${validPersona.data.core.name}`);

  return id;
}

export async function saveToJson(persona: Persona, id: string) {
  await createFolderIfNotExists(`personas/${id}/`);

  const jsonName = `personas/${id}/${id}-persona.json`;

  await fs.promises.writeFile(jsonName, JSON.stringify(persona), 'utf8');

  console.log(`Persona '${persona.core.name}' saved as ${jsonName}`);
}
