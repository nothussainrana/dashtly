'use client';

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

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

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    status: string;
    images?: ProductImage[];
  };
  onClick?: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
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
      </CardContent>
    </StyledCard>
  );
} 