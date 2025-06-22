import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

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
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
        status: 'active', // Only show active products publicly
      },
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          }
        }
      } as Prisma.ProductInclude
    });

    if (!product) {
      return new NextResponse('Product not found', { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PUBLIC_PRODUCT_GET]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch product' }),
      { status: 500 }
    );
  }
} 