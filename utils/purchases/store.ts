import { PurchaseList, purchaseListSchema } from './types';
import { Tool } from './tool';
import { BaseTool, makeRequest } from '../anthropicClient';
import { generatePrompt } from './prompt';
import { Consumer } from '../consumer/types';

export async function generate(
  apiKey: string,
  consumer: Consumer,
  date: Date,
  numWeeks: number
) {
  try {
    const consumerPrompt = await generatePrompt(
      consumer,
      parseInt(process.env.PURCHASE_REFLECTION_THRESHOLD ?? '50'),
      date,
      numWeeks
    );

    const result = (await makeRequest(
      apiKey,
      consumerPrompt,
      Tool as BaseTool
    )) as PurchaseList;

    const validPurchases = purchaseListSchema.safeParse(result);

    if (validPurchases.error) {
      throw Error(`Invalid purchases: ${validPurchases.error.message}`);
    }

    const totalPurchases = validPurchases.data.weeks.reduce(
      (acc, week) => acc + week.purchases.length,
      0
    );
    console.info(
      `Generated ${totalPurchases} purchases for ${consumer.core.name}`
    );

    return validPurchases.data;
  } catch (error) {
    console.error('Error generating purchases:', error);
    throw error;
  }
}
