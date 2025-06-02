import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      } as Prisma.ProductInclude
    });

    if (!product) {
      return new NextResponse('Product not found', { status: 404 });
    }

    // Only allow access to the product owner
    if (product.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCT_GET]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch product' }),
      { status: 500 }
    );
  }
} 