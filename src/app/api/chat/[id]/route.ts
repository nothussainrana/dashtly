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

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the chat and verify user is part of it
    const chat = await prisma.chat.findUnique({
      where: { id: params.id },
      include: {
        product: {
          include: {
            images: {
              orderBy: { order: 'asc' }
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

    if (!chat) {
      return new NextResponse('Chat not found', { status: 404 });
    }

    // Check if user is part of this chat
    if (chat.buyerId !== session.user.id && chat.sellerId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error('[CHAT_GET]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch chat' }),
      { status: 500 }
    );
  }
} 