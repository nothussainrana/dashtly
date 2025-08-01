'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Paper, Typography, Box, Chip, CircularProgress, Avatar, Link, Divider, Button } from '@mui/material';
import { VerifiedUser as VerifiedIcon } from '@mui/icons-material';
import Image from 'next/image';
import ChatButton from '@/components/ChatButton';
import ReviewSummary from '@/components/ReviewSummary';
import ReviewList from '@/components/ReviewList';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  username: string;
  image: string | null;
  role?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  status: string;
  soldCount: number;
  createdAt: string;
  images: {
    id: string;
    url: string;
    order: number;
  }[];
  user: User;
}

export default function ProductPage() {
  const params = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;

    setLoading(true);
    fetch(`/api/products/${params.id}/public`)
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
      fetchReviewStats(product.user.id);
    }
  }, [product]);

  const fetchReviewStats = async (sellerId: string) => {
    setReviewsLoading(true);
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

  const isOwner = session?.user?.id === product?.user.id;

  const handleDelete = async () => {
    if (!product) return;

    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${product.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          router.push('/dashboard');
          router.refresh();
        } else {
          const data = await response.json();
          setError(data.error || 'Failed to delete product');
        }
      } catch (err) {
        setError('An error occurred while deleting the product.');
      }
    }
  };

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
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0, flex: 1 }}>
                {product.name}
              </Typography>
              {/* CERTIFIED Badge for Admin Users */}
              {product.user.role === 'ADMIN' && (
                <Chip
                  icon={<VerifiedIcon />}
                  label="CERTIFIED"
                  sx={{
                    ml: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    height: '36px',
                    '& .MuiChip-icon': {
                      color: 'white',
                      fontSize: '1.1rem'
                    }
                  }}
                />
              )}
            </Box>
            
            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              ${product.price.toFixed(2)}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Chip 
                label={product.status}
                sx={{ 
                  bgcolor: product.status === 'active' ? 'success.light' : 
                          product.status === 'sold' ? 'error.light' : 
                          'warning.light',
                  color: product.status === 'active' ? 'success.dark' : 
                         product.status === 'sold' ? 'error.dark' : 
                         'warning.dark',
                  textTransform: 'capitalize'
                }}
              />
              <Chip 
                label={`${product.soldCount} sold`}
                variant="outlined"
                sx={{ 
                  bgcolor: 'grey.50',
                  color: 'text.secondary'
                }}
              />
            </Box>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            {/* Seller Information */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Listed by
              </Typography>
              <Link 
                href={`/users/${product.user.id}`}
                sx={{ 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                <Avatar
                  src={product.user.image || undefined}
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    bgcolor: '#3ab2df',
                    fontSize: '1rem',
                  }}
                >
                  {product.user.name?.[0]?.toUpperCase() || product.user.username?.[0]?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 500 }}>
                    {product.user.name || product.user.username}
                  </Typography>
                  {product.user.name && (
                                      <Typography variant="body2" color="text.secondary">
                    @{product.user.username}
                  </Typography>
                )}
              </Box>
            </Link>
            
            {/* Seller Rating */}
            <Box sx={{ mt: 2 }}>
              {reviewsLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    Loading ratings...
                  </Typography>
                </Box>
              ) : (
                <ReviewSummary
                  averageRating={reviewStats.averageRating}
                  totalReviews={reviewStats.totalReviews}
                  showLabel={true}
                  size="small"
                />
              )}
            </Box>
          </Box>

          {isOwner ? (
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={() => router.push(`/products/${product.id}/edit`)}
                >
                  Edit Product
                </Button>
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={handleDelete}
                >
                  Delete Product
                </Button>
              </Box>
            ) : (
              <ChatButton
                productId={product.id}
                sellerName={product.user.name}
                sellerUsername={product.user.username}
                sellerImage={product.user.image}
              />
            )}

            <Typography variant="body2" color="text.secondary">
              Listed on {new Date(product.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Reviews Section */}
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <ReviewList sellerId={product.user.id} />
      </Paper>
    </Container>
  );
} 