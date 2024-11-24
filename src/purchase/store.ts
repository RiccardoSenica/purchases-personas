import { prisma } from '../utils/prismaClient';
import fs, { readFileSync } from 'fs';
import { PurchaseList } from './types';
import { Tool } from './tool';
import { makeRequest } from '../utils/anthropicClient';
import { createFolderIfNotExists } from '../utils/createFolder';
import generatePurchasePrompt from './promptGenerator';

export async function generate(personaId: number) {
  const jsonFile = readFileSync(`personas/${personaId}.json`, 'utf-8');

  const persona = JSON.parse(jsonFile);

  const personaPrompt = await generatePurchasePrompt(persona);

  const result = (await makeRequest(
    personaPrompt,
    Tool as any
  )) as PurchaseList;

  await saveToDb(personaId, result);

  await saveToJson(result, personaId);

  console.log('Purchases:', result.items.length);
}

export async function saveToDb(personaId: number, purchases: PurchaseList) {
  const result = await prisma.item.createMany({
    data: purchases.items.map(purchase => ({
      userId: personaId,
      name: purchase.name,
      amount: purchase.amount,
      datetime: purchase.datetime,
      location: purchase.location,
      notes: purchase.notes
    }))
  });

  console.log(`Inserted ${result.count} purchases with persona ${personaId}`);
}

export async function saveToJson(purchaseList: PurchaseList, id: number) {
  await createFolderIfNotExists('purchases');

  await createFolderIfNotExists(`purchases/${id}`);

  await fs.promises.writeFile(
    `purchases/${id}/${id}.json`,
    JSON.stringify(purchaseList),
    'utf8'
  );

  console.log(
    `Saved ${purchaseList.items.length} purchases as purchases/${id}/${id}.json`
  );
}
