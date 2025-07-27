import { NextResponse } from 'next/server';
import { getClientCategories } from '@/lib/categories';

export async function GET() {
  try {
    const categories = getClientCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('[STATIC_CATEGORIES_GET]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch static categories' }),
      { status: 500 }
    );
  }
} 