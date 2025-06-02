import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    
    // Validate and parse the data
    const { name, price, description, status, images } = body;

    if (!name || typeof name !== 'string') {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid product name' }), 
        { status: 400 }
      );
    }

    if (!price || isNaN(Number(price))) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid price' }), 
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string') {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid description' }), 
        { status: 400 }
      );
    }

    if (!Array.isArray(images) || images.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'At least one image is required' }), 
        { status: 400 }
      );
    }

    const validStatuses = ['active', 'inactive', 'sold'];
    if (!status || !validStatuses.includes(status)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid status' }), 
        { status: 400 }
      );
    }

    try {
      const product = await prisma.product.create({
        data: {
          name: name.trim(),
          price: Number(price),
          description: description.trim(),
          status,
          userId: session.user.id,
          images: {
            create: images.map((img: { url: string; order: number }) => ({
              url: img.url,
              order: img.order
            }))
          }
        },
        include: {
          images: true
        }
      });
      
      return NextResponse.json(product);
    } catch (prismaError) {
      const errorMessage = prismaError instanceof Error ? prismaError.message : 'Unknown database error';
      return new NextResponse(
        JSON.stringify({ 
          error: 'Database error', 
          details: errorMessage 
        }), 
        { status: 500 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal error', 
        details: errorMessage 
      }), 
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const products = await prisma.product.findMany({
      where: { userId: session.user.id },
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch products', details: error instanceof Error ? error.message : error }),
      { status: 500 }
    );
  }
} 