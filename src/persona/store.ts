import 'dotenv/config';
import { prisma } from '../utils/prismaClient';
import fs from 'fs';
import { Persona } from './types';
import { Tool } from './tool';
import { BaseTool, makeRequest } from '../utils/anthropicClient';
import { createFolderIfNotExists } from '../utils/createFolder';
import { generatePrompt } from '../utils/generatePersonaSeed';

export async function generate() {
  if (!process.env.PERSONA_PROMPT) {
    throw Error('Persona prompt missing.');
  }

  const prompt = `${generatePrompt()} ${process.env.PERSONA_PROMPT}`;

  const result = (await makeRequest(prompt, Tool as BaseTool)) as Persona;

  const id = await saveToDb(result);

  await saveToJson(result, id);

  console.log(`Persona name: ${result.core.name}`);

  return id;
}

export async function saveToDb(persona: Persona) {
  const result = await prisma.user.create({
    data: {
      name: persona.core.name,
      age: persona.core.age,
      persona: JSON.stringify(persona)
    }
  });

  console.log(`Persona '${result.name}' inserted in DB with id ${result.id}`);

  return result.id;
}

export async function saveToJson(persona: Persona, id: number) {
  await createFolderIfNotExists(`personas/${id}/`);

  const jsonName = `personas/${id}/${id}-persona.json`;

  await fs.promises.writeFile(jsonName, JSON.stringify(persona), 'utf8');

  console.log(`Persona '${persona.core.name}' saved as ${jsonName}`);
}
