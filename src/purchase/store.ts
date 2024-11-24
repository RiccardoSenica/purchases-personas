import { prisma } from '../utils/prismaClient';
import fs, { readFileSync } from 'fs';
import { PurchaseList, Reflection } from './types';
import { Tool } from './tool';
import { BaseTool, makeRequest } from '../utils/anthropicClient';
import { createFolderIfNotExists } from '../utils/createFolder';
import { generatePurchasePrompt } from './promptGenerator';
import { Persona } from '../persona/types';
import { Prisma } from '@prisma/client';

export async function generate(personaId: number) {
  const jsonFile = readFileSync(
    `personas/${personaId}/${personaId}-persona.json`,
    'utf-8'
  );

  const persona: Persona = JSON.parse(jsonFile);

  const personaPrompt = await generatePurchasePrompt(
    persona,
    parseInt(process.env.PURCHASE_REFLECTION_THRESHOLD ?? '50')
  );

  const result = (await makeRequest(
    personaPrompt,
    Tool as BaseTool
  )) as PurchaseList;

  await saveToDb(personaId, result);

  await saveToJson(result, personaId);

  console.log(`Generated ${result.items.length} purchases`);
}

function reflectionToJson(reflection: Reflection): Prisma.JsonObject {
  return {
    comment: reflection.comment,
    satisfactionScore: reflection.satisfactionScore,
    date: reflection.date,
    mood: reflection.mood || null
  };
}

export async function saveToDb(personaId: number, purchases: PurchaseList) {
  const result = await prisma.item.createMany({
    data: purchases.items.map(
      purchase =>
        ({
          userId: personaId,
          name: purchase.name,
          amount: purchase.amount,
          datetime: purchase.datetime,
          location: purchase.location,
          notes: purchase.notes,
          reflections: purchase.reflections
            ? purchase.reflections.map(reflectionToJson)
            : Prisma.JsonNull
        }) satisfies Prisma.ItemCreateManyInput
    )
  });

  console.log(`Inserted ${result.count} purchases for persona ${personaId}`);
}

export async function saveToJson(purchaseList: PurchaseList, id: number) {
  await createFolderIfNotExists(`personas/${id}/`);

  const jsonName = `personas/${id}/${id}-purchases.json`;

  await fs.promises.writeFile(jsonName, JSON.stringify(purchaseList), 'utf8');

  console.log(`Saved ${purchaseList.items.length} purchases as ${jsonName}`);
}
