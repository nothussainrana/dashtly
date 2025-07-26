'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Paper, Typography, Box, Avatar, CircularProgress, Card, CardContent, CardMedia, Divider } from '@mui/material';
import Image from 'next/image';
import ProductCard from '../../../components/ProductCard';
import ReviewSummary from '../../../components/ReviewSummary';
import ReviewList from '../../../components/ReviewList';

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
  createdAt: string;
  images: Array<{
    id: string;
    url: string;
    order: number;
  }>;
}

export default function UserProfilePage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsRefreshTrigger, setReviewsRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!params.id) return;

    setLoading(true);
    Promise.all([
      fetch(`/api/users/${params.id}`).then(res => res.json()),
      fetch(`/api/users/${params.id}/products`).then(res => res.json())
    ])
      .then(([userData, productsData]) => {
        setUser(userData);
        setProducts(productsData.products || []);
        setLoading(false);
        // Fetch review stats
        fetchReviewStats(params.id as string);
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile');
        setLoading(false);
      });
  }, [params.id]);

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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">{error || 'User not found'}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* User Profile Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            src={user.image || undefined}
            sx={{ 
              width: 100, 
              height: 100, 
              bgcolor: '#3ab2df',
              fontSize: '2.5rem',
            }}
          >
            {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {user.name || user.username}
            </Typography>
            {user.name && (
              <Typography variant="body1" color="text.secondary" gutterBottom>
                @{user.username}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              Member since {new Date().toLocaleDateString()}
            </Typography>
            
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
                  size="medium"
                />
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* User's Products */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Products by {user.name || user.username}
        </Typography>
        
        {products.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No active products found
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            }, 
            gap: 3 
          }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Box>
        )}
      </Box>

      {/* Reviews Section */}
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <ReviewList 
          sellerId={user.id} 
          refreshTrigger={reviewsRefreshTrigger}
        />
      </Paper>
    </Container>
  );
} 