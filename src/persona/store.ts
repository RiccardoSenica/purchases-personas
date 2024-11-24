import { prisma } from '../utils/prismaClient';
import fs from 'fs';
import { Persona } from './types';
import { Tool } from './tool';
import { makeRequest } from '../utils/anthropicClient';
import { createFolderIfNotExists } from '../utils/createFolder';

const prompt =
  'Generate a detailed, realistic customer persona that follows the schema structure exactly. Create someone whose traits, habits, and behaviors form a coherent narrative about their purchasing decisions. Randomly select one option from each seed group: LIFE STAGE [young professional | mid-career parent | empty nester | recent graduate | career shifter | semi-retired | newly married | single parent | remote worker | retiree] FINANCIAL STYLE [debt-averse minimalist | luxury spender | budget optimizer | investment-focused | experience seeker | conscious consumer | tech enthusiast | security planner | impulse buyer | traditional saver] LOCATION [urban core | older suburb | new suburb | small town | rural area | coastal city | mountain town | college town | cultural district | tech hub] SPECIAL FACTOR [health-focused | hobby enthusiast | side hustler | community leader | creative professional | outdoor adventurer | tech worker | environmental advocate | cultural enthusiast | academic] ATTITUDE [optimist | pragmatist | skeptic] TECH COMFORT [early adopter | mainstream | traditional] SOCIAL STYLE [extrovert | ambivert | introvert] SEASON [winter | spring | summer | fall]. Ensure all numerical values and scores are justified by the persona context and lifestyle.';

export async function generate() {
  const result = (await makeRequest(prompt, Tool as any)) as Persona;

  const id = await saveToDb(result);

  await saveToJson(result, id);

  console.log('Persona:', result.core.name);

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

  console.log(`Persona ${result.name} inserted in DB with id ${result.id}`);

  return result.id;
}

export async function saveToJson(persona: Persona, id: number) {
  await createFolderIfNotExists('personas');

  await fs.promises.writeFile(
    `personas/${id}.json`,
    JSON.stringify(persona),
    'utf8'
  );

  console.log(`Persona ${persona.core.name} saved as persona/${id}.json`);
}
