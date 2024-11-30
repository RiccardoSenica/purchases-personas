import { NextRequest, NextResponse } from 'next/server';
import { consumerRequestSchema } from '@utils/consumer/types';
import { generate } from '@utils/consumer/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = consumerRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { apiKey } = result.data;

    const consumer = await generate(apiKey);

    return NextResponse.json(consumer);
  } catch (error) {
    console.error('Error generating consumer:', error);
    return NextResponse.json(
      { error: 'Failed to generate consumer' },
      { status: 500 }
    );
  }
}
