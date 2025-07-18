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
    const { rating, comment, offerId } = body;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return new NextResponse('Rating must be between 1 and 5', { status: 400 });
    }

    if (!offerId) {
      return new NextResponse('Offer ID is required', { status: 400 });
    }

    // Get the offer and verify it's accepted and user is the buyer
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        chat: {
          include: {
            product: true,
            seller: true,
            buyer: true
          }
        },
        review: true // Check if review already exists
      }
    });

    if (!offer) {
      return new NextResponse('Offer not found', { status: 404 });
    }

    // Check if offer is accepted
    if (offer.status !== 'ACCEPTED') {
      return new NextResponse('Can only review accepted offers', { status: 400 });
    }

    // Check if user is the buyer
    if (offer.chat.buyerId !== session.user.id) {
      return new NextResponse('Only the buyer can review this offer', { status: 403 });
    }

    // Check if review already exists
    if (offer.review) {
      return new NextResponse('Review already exists for this offer', { status: 400 });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment?.trim() || null,
        authorId: session.user.id,
        sellerId: offer.chat.sellerId,
        offerId
      },
      include: {
        author: {
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
            username: true
          }
        },
        offer: {
          include: {
            chat: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('[REVIEW_POST]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create review' }),
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!sellerId) {
      return new NextResponse('Seller ID is required', { status: 400 });
    }

    const skip = (page - 1) * limit;

    // Get reviews for the seller
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: { sellerId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true
            }
          },
          offer: {
            include: {
              chat: {
                include: {
                  product: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.review.count({
        where: { sellerId }
      })
    ]);

    // Calculate average rating
    const averageRating = await prisma.review.aggregate({
      where: { sellerId },
      _avg: { rating: true }
    });

    return NextResponse.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1
      },
      stats: {
        averageRating: averageRating._avg.rating || 0,
        totalReviews: totalCount
      }
    });
  } catch (error) {
    console.error('[REVIEWS_GET]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch reviews' }),
      { status: 500 }
    );
  }
} 