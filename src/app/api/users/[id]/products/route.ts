import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const products = await prisma.product.findMany({
      where: {
        userId: params.id,
        status: 'active', // Only show active products
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        status: true,
        soldCount: true,
        createdAt: true,
        updatedAt: true,
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('[USER_PRODUCTS_GET]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch user products' }),
      { status: 500 }
    );
  }
} 