import { generate } from '@purchases/store';
import { purchasesRequestSchema } from '@purchases/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = purchasesRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { apiKey, consumer } = result.data;

    const purchases = await generate(apiKey, consumer, new Date(), 4);

    return NextResponse.json(purchases);
  } catch (error) {
    console.error('Error processing purchases:', error);
    return NextResponse.json(
      { error: 'Failed to process purchases' },
      { status: 500 }
    );
  }
}
