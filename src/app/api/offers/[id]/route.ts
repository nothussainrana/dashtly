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

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !['ACCEPTED', 'REJECTED', 'CANCELLED'].includes(status)) {
      return new NextResponse('Valid status is required', { status: 400 });
    }

    // Get the offer and verify user can update it
    const offer = await prisma.offer.findUnique({
      where: { id: params.id },
      include: {
        sender: true,
        receiver: true,
        chat: {
          include: {
            product: true
          }
        }
      }
    });

    if (!offer) {
      return new NextResponse('Offer not found', { status: 404 });
    }

    // Check if offer is still pending
    if (offer.status !== 'PENDING') {
      return new NextResponse('Offer is no longer pending', { status: 400 });
    }

    // Check permissions based on action
    if (status === 'CANCELLED') {
      // Only sender can cancel
      if (offer.senderId !== session.user.id) {
        return new NextResponse('Only the sender can cancel the offer', { status: 403 });
      }
    } else if (status === 'ACCEPTED' || status === 'REJECTED') {
      // Only receiver can accept/reject
      if (offer.receiverId !== session.user.id) {
        return new NextResponse('Only the receiver can accept or reject the offer', { status: 403 });
      }
    }

    // Update the offer
    const updatedOffer = await prisma.offer.update({
      where: { id: params.id },
      data: {
        status,
        updatedAt: new Date()
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

    // If offer was accepted, cancel all other pending offers in the same chat
    if (status === 'ACCEPTED') {
      await prisma.offer.updateMany({
        where: {
          chatId: offer.chatId,
          id: { not: params.id },
          status: 'PENDING'
        },
        data: {
          status: 'CANCELLED',
          updatedAt: new Date()
        }
      });
    }

    // Update chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: offer.chatId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json(updatedOffer);
  } catch (error) {
    console.error('[OFFER_PATCH]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update offer' }),
      { status: 500 }
    );
  }
} 