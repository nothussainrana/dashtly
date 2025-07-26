import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getDefaultCategories } from '../../../lib/categories';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('[CATEGORIES_GET]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch categories' }),
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Check if categories already exist
    const existingCategories = await prisma.category.count();
    
    if (existingCategories > 0) {
      return new NextResponse(
        JSON.stringify({ message: 'Categories already exist' }),
        { status: 200 }
      );
    }

    // Get default categories from JSON file
    const defaultCategories = getDefaultCategories();

    // Create default categories
    const createdCategories = await prisma.category.createMany({
      data: defaultCategories,
      skipDuplicates: true,
    });

    return NextResponse.json({
      message: `Created ${createdCategories.count} categories`,
      categories: createdCategories,
    });
  } catch (error) {
    console.error('[CATEGORIES_SEED]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to seed categories' }),
      { status: 500 }
    );
  }
} 