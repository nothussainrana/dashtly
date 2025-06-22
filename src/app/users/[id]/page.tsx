'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Paper, Typography, Box, Avatar, CircularProgress, Grid, Card, CardContent, CardMedia } from '@mui/material';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';

interface User {
  id: string;
  name: string;
  username: string;
  image: string | null;
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
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile');
        setLoading(false);
      });
  }, [params.id]);

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
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
} 