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
    const { productId } = body;

    if (!productId) {
      return new NextResponse('Product ID is required', { status: 400 });
    }

    // Get the product to find the seller
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { user: true }
    });

    if (!product) {
      return new NextResponse('Product not found', { status: 404 });
    }

    // Check if user is trying to chat with themselves
    if (product.userId === session.user.id) {
      return new NextResponse('Cannot chat with yourself', { status: 400 });
    }

    // Check if chat already exists
    const existingChat = await prisma.chat.findUnique({
      where: {
        productId_buyerId: {
          productId,
          buyerId: session.user.id
        }
      }
    });

    if (existingChat) {
      return NextResponse.json(existingChat);
    }

    // Create new chat
    const chat = await prisma.chat.create({
      data: {
        productId,
        buyerId: session.user.id,
        sellerId: product.userId
      },
      include: {
        product: {
          include: {
            images: {
              orderBy: { order: 'asc' },
              take: 1
            }
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error('[CHAT_POST]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create chat' }),
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

    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { buyerId: session.user.id },
          { sellerId: session.user.id }
        ]
      },
      include: {
        product: {
          include: {
            images: {
              orderBy: { order: 'asc' },
              take: 1
            }
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error('[CHAT_GET]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch chats' }),
      { status: 500 }
    );
  }
} 