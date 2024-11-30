import fs, { readFileSync } from 'fs';
import { PurchaseList, purchaseListSchema } from './types';
import { Tool } from './tool';
import { BaseTool, makeRequest } from '../utils/anthropicClient';
import { createFolderIfNotExists } from '../utils/createFolder';
import { generatePrompt } from './prompt';
import { Persona } from '../persona/types';

export async function generate(
  personaId: string,
  date: Date,
  numWeeks: number
) {
  try {
    const jsonFile = readFileSync(
      `personas/${personaId}/${personaId}-persona.json`,
      'utf-8'
    );
    const persona: Persona = JSON.parse(jsonFile);

    const personaPrompt = await generatePrompt(
      persona,
      parseInt(process.env.PURCHASE_REFLECTION_THRESHOLD ?? '50'),
      date,
      numWeeks
    );

    const result = (await makeRequest(
      personaPrompt,
      Tool as BaseTool
    )) as PurchaseList;

    const validPurchases = purchaseListSchema.safeParse(result);

    if (validPurchases.error) {
      throw Error(`Invalid purchases: ${validPurchases.error.message}`);
    }

    await saveToJson(validPurchases.data, personaId);

    const totalPurchases = validPurchases.data.weeks.reduce(
      (acc, week) => acc + week.purchases.length,
      0
    );
    console.log(
      `Generated ${totalPurchases} purchases for ${persona.core.name}`
    );

    return validPurchases.data;
  } catch (error) {
    console.error('Error generating purchases:', error);
    throw error;
  }
}

export async function saveToJson(purchaseList: PurchaseList, id: string) {
  await createFolderIfNotExists(`personas/${id}/`);
  const jsonName = `personas/${id}/${id}-purchases.json`;

  await fs.promises.writeFile(
    jsonName,
    JSON.stringify(purchaseList, null, 2),
    'utf8'
  );

  const purchaseStats = purchaseList.weeks.reduce(
    (stats, week) => {
      return {
        total: stats.total + week.purchases.length,
        planned: stats.planned + week.purchases.filter(p => p.isPlanned).length,
        withReflections:
          stats.withReflections +
          week.purchases.filter(p => p.reflections?.length).length
      };
    },
    { total: 0, planned: 0, withReflections: 0 }
  );

  console.log(
    `Saved ${purchaseStats.total} purchases (${purchaseStats.planned} planned, ${purchaseStats.withReflections} with reflections) as ${jsonName}`
  );
}
