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
        },
        variants: {
          orderBy: { createdAt: 'asc' }
        },
        category: true
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, price, description, status, categoryId, images, variants } = body;

    // First check if product exists and user owns it
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
      select: { userId: true }
    });

    if (!existingProduct) {
      return new NextResponse('Product not found', { status: 404 });
    }

    if (existingProduct.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Validate input
    const validStatuses = ['ACTIVE', 'INACTIVE', 'SOLD', 'DRAFT'];
    if (status && !validStatuses.includes(status)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid status' }), 
        { status: 400 }
      );
    }

    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name.trim();
    if (price !== undefined) updateData.price = Number(price);
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status;
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    // Handle images
    if (images) {
      // Delete existing images
      await prisma.productImage.deleteMany({
        where: { productId: params.id }
      });
      
      // Create new images
      updateData.images = {
        create: images.map((img: any) => ({
          url: img.url,
          order: img.order
        }))
      };
    }

    // Handle variants update
    if (variants) {
      updateData.variants = {
        deleteMany: {},
        create: variants.map((variant: any) => ({
          name: variant.name,
          price: variant.price ? Number(variant.price) : null,
          isActive: variant.isActive !== false
        }))
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        variants: {
          orderBy: { createdAt: 'asc' }
        },
        category: true
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('[PRODUCT_PUT]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update product' }),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // First check if product exists and user owns it
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
      select: { userId: true }
    });

    if (!existingProduct) {
      return new NextResponse('Product not found', { status: 404 });
    }

    if (existingProduct.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Delete the product (cascades will handle images and variants)
    await prisma.product.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('[PRODUCT_DELETE]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete product' }),
      { status: 500 }
    );
  }
} 