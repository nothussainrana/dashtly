'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Paper, Typography, Box, Chip, CircularProgress } from '@mui/material';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  status: string;
  createdAt: string;
  images: {
    id: string;
    url: string;
    order: number;
  }[];
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;

    setLoading(true);
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => {
        console.log('Product data:', data);
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
        setLoading(false);
      });
  }, [params.id]);

  useEffect(() => {
    if (product) {
      console.log('Current product state:', product);
    }
  }, [product]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">{error || 'Product not found'}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          {/* Product Images */}
          <Box>
            {/* Main Image */}
            <Box sx={{ position: 'relative', height: 400, width: '100%', mb: 2 }}>
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                  priority
                />
              ) : (
                <Box 
                  sx={{ 
                    height: '100%', 
                    width: '100%', 
                    bgcolor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px'
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No image available
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Thumbnail Grid */}
            {product.images && product.images.length > 1 && (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: 1 
              }}>
                {product.images.slice(1).map((image, index) => (
                  <Box 
                    key={image.id}
                    sx={{ 
                      position: 'relative', 
                      height: 100, 
                      width: '100%',
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} - Image ${index + 2}`}
                      fill
                      style={{ objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Product Details */}
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              ${product.price.toFixed(2)}
            </Typography>

            <Chip 
              label={product.status}
              sx={{ 
                mb: 3,
                bgcolor: product.status === 'active' ? 'success.light' : 
                        product.status === 'sold' ? 'error.light' : 
                        'warning.light',
                color: product.status === 'active' ? 'success.dark' : 
                       product.status === 'sold' ? 'error.dark' : 
                       'warning.dark',
                textTransform: 'capitalize'
              }}
            />

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Listed on {new Date(product.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 