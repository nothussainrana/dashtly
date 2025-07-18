'use client';

import React from 'react';
import { Box, Typography, Rating, Chip } from '@mui/material';

interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function ReviewSummary({ 
  averageRating, 
  totalReviews, 
  showLabel = true, 
  size = 'medium' 
}: ReviewSummaryProps) {
  if (totalReviews === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          No reviews yet
        </Typography>
      </Box>
    );
  }

  const ratingSize = size === 'small' ? 'small' : 'medium';
  const textVariant = size === 'small' ? 'caption' : 'body2';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Rating
        value={averageRating}
        readOnly
        precision={0.1}
        size={ratingSize}
        sx={{ color: '#ffc107' }}
      />
      <Typography variant={textVariant} color="text.secondary">
        {averageRating.toFixed(1)}
      </Typography>
      {showLabel && (
        <Chip
          label={`${totalReviews} review${totalReviews !== 1 ? 's' : ''}`}
          size="small"
          variant="outlined"
          sx={{ fontSize: '0.75rem' }}
        />
      )}
    </Box>
  );
} 