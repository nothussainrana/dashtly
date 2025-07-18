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

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get accepted offers where the user is the buyer
    const allAcceptedOffers = await prisma.offer.findMany({
      where: {
        senderId: session.user.id, // User is the buyer (sender of the offer)
        status: 'ACCEPTED'
      },
      include: {
        chat: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: {
                  take: 1,
                  orderBy: { order: 'asc' }
                }
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
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Get all existing reviews for these offers using raw query
    const existingReviews = await prisma.$queryRaw<{offerId: string}[]>`
      SELECT "offerId" FROM "Review" WHERE "offerId" IN (${allAcceptedOffers.map(offer => `'${offer.id}'`).join(',')})
    `;

    const reviewedOfferIds = new Set(existingReviews.map(review => review.offerId));
    
    // Filter offers that don't have a review yet
    const reviewableOffers = allAcceptedOffers.filter(offer => !reviewedOfferIds.has(offer.id));

    return NextResponse.json(reviewableOffers);
  } catch (error) {
    console.error('[REVIEWABLE_OFFERS_GET]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch reviewable offers' }),
      { status: 500 }
    );
  }
} 