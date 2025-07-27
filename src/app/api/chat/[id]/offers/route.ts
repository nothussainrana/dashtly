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

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { amount } = body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return new NextResponse('Valid amount is required', { status: 400 });
    }

    // Get the chat and verify user is part of it
    const chat = await prisma.chat.findUnique({
      where: { id: params.id },
      include: {
        buyer: true,
        seller: true,
        product: true
      }
    });

    if (!chat) {
      return new NextResponse('Chat not found', { status: 404 });
    }

    // Check if user is part of this chat
    if (chat.buyerId !== session.user.id && chat.sellerId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Determine receiver (the other person in the chat)
    const receiverId = chat.buyerId === session.user.id ? chat.sellerId : chat.buyerId;

    // Check if there's already a pending offer from this user
    const existingOffer = await prisma.offer.findFirst({
      where: {
        chatId: params.id,
        senderId: session.user.id,
        status: 'PENDING'
      }
    });

    if (existingOffer) {
      return new NextResponse('You already have a pending offer in this chat', { status: 400 });
    }

    // Create the offer
    const offer = await prisma.offer.create({
      data: {
        chatId: params.id,
        senderId: session.user.id,
        receiverId,
        amount
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        }
      }
    });

    // Update chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: params.id },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json(offer);
  } catch (error) {
    console.error('[OFFER_POST]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create offer' }),
      { status: 500 }
    );
  }
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
      where: { id: params.id }
    });

    if (!chat) {
      return new NextResponse('Chat not found', { status: 404 });
    }

    // Check if user is part of this chat
    if (chat.buyerId !== session.user.id && chat.sellerId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get offers for this chat
    const offers = await prisma.offer.findMany({
      where: { chatId: params.id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error('[OFFERS_GET]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch offers' }),
      { status: 500 }
    );
  }
} 