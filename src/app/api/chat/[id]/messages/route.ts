import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
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
    const { content } = body;

    if (!content || typeof content !== 'string') {
      return new NextResponse('Message content is required', { status: 400 });
    }

    // Get the chat and verify user is part of it
    const chat = await prisma.chat.findUnique({
      where: { id: params.id },
      include: {
        buyer: true,
        seller: true
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

    // Create the message
    const message = await prisma.message.create({
      data: {
        chatId: params.id,
        senderId: session.user.id,
        receiverId,
        content: content.trim()
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

    return NextResponse.json(message);
  } catch (error) {
    console.error('[MESSAGE_POST]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to send message' }),
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

    // Get messages for this chat
    const messages = await prisma.message.findMany({
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
      orderBy: { createdAt: 'asc' }
    });

    // Mark messages as read if they were sent to the current user
    await prisma.message.updateMany({
      where: {
        chatId: params.id,
        receiverId: session.user.id,
        isRead: false
      },
      data: { isRead: true }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('[MESSAGE_GET]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch messages' }),
      { status: 500 }
    );
  }
} 