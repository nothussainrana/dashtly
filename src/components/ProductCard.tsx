'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import ReviewSummary from './ReviewSummary';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

interface ProductImage {
  id: string;
  url: string;
  order: number;
}

interface Category {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  username: string;
  image?: string | null;
}

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    status: string;
    images?: ProductImage[];
    category?: Category;
    user?: User;
  };
  onClick?: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    if (product.user?.id) {
      fetchReviewStats(product.user.id);
    } else {
      setReviewsLoading(false);
    }
  }, [product.user?.id]);

  const fetchReviewStats = async (sellerId: string) => {
    try {
      const response = await fetch(`/api/reviews?sellerId=${sellerId}&limit=1`);
      if (response.ok) {
        const data = await response.json();
        setReviewStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching review stats:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.location.href = `/products/${product.id}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'success.light', color: 'success.dark' };
      case 'sold':
        return { bg: 'error.light', color: 'error.dark' };
      case 'inactive':
        return { bg: 'warning.light', color: 'warning.dark' };
      default:
        return { bg: 'grey.light', color: 'grey.dark' };
    }
  };

  const statusColors = getStatusColor(product.status);

  return (
    <StyledCard onClick={handleClick}>
      {product.images && product.images.length > 0 ? (
        <Box sx={{ position: 'relative', height: 200, width: '100%' }}>
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </Box>
      ) : (
        <Box 
          sx={{ 
            height: 200, 
            width: '100%', 
            bgcolor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No image available
          </Typography>
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {product.name}
        </Typography>
        
        {/* Category Chip */}
        {product.category && (
          <Chip
            label={product.category.name}
            size="small"
            variant="outlined"
            sx={{ mb: 1 }}
          />
        )}
        
        <Typography 
          color="text.secondary" 
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 1
          }}
        >
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          ${product.price.toFixed(2)}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'inline-block',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            bgcolor: statusColors.bg,
            color: statusColors.color,
            textTransform: 'capitalize',
            mt: 1
          }}
        >
          {product.status}
        </Typography>

        {/* Seller Rating */}
        {product.user && (
          <Box sx={{ mt: 2 }}>
            {reviewsLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={12} />
                <Typography variant="caption" color="text.secondary">
                  Loading...
                </Typography>
              </Box>
            ) : (
              <ReviewSummary
                averageRating={reviewStats.averageRating}
                totalReviews={reviewStats.totalReviews}
                showLabel={false}
                size="small"
              />
            )}
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
} 