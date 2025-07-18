import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const categoryId = searchParams.get('categoryId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause - only search active products from all users
    const where: any = {
      status: 'active', // Only show active products
    };

    // Category filtering
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Text search in name, description, username, and category name
    if (query.trim()) {
      where.OR = [
        {
          name: {
            contains: query.trim(),
            mode: 'insensitive' as const,
          },
        },
        {
          description: {
            contains: query.trim(),
            mode: 'insensitive' as const,
          },
        },
        {
          user: {
            username: {
              contains: query.trim(),
              mode: 'insensitive' as const,
            },
          },
        },
        {
          category: {
            name: {
              contains: query.trim(),
              mode: 'insensitive' as const,
            },
          },
        },
      ];
    }

    // Price filtering
    if (minPrice && !isNaN(Number(minPrice))) {
      where.price = {
        ...where.price,
        gte: Number(minPrice),
      };
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      where.price = {
        ...where.price,
        lte: Number(maxPrice),
      };
    }

    // Validate sort parameters
    const validSortFields = ['name', 'price', 'createdAt', 'updatedAt'];
    const validSortOrders = ['asc', 'desc'];
    
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const finalSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : 'desc';

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where });

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        status: true,
        soldCount: true,
        createdAt: true,
        updatedAt: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        [finalSortBy]: finalSortOrder,
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Global search error:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to search products', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500 }
    );
  }
} 