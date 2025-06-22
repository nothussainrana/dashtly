'use client';

import { useSession } from 'next-auth/react';
import { Container, Paper, Typography, Box, Avatar, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { List as ListIcon } from '@mui/icons-material';
import ProductCard from '@/components/ProductCard';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

export default function DashboardPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, [session]);

  if (!session) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              fontSize: '2rem',
            }}
          >
            {session.user?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome back, {session.user?.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {session.user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <StyledPaper elevation={2}>
            <Typography variant="h6" gutterBottom>
              Profile Overview
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Your account is active and in good standing.
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Typography variant="body2" color="primary">
                Last login: {new Date().toLocaleDateString()}
              </Typography>
            </Box>
          </StyledPaper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <StyledPaper elevation={2}>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Manage your account preferences and security settings.
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Typography variant="body2" color="primary">
                Email verified: Yes
              </Typography>
            </Box>
          </StyledPaper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <StyledPaper elevation={2}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Common tasks and shortcuts for your account.
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Typography variant="body2" color="primary">
                Available actions: 3
              </Typography>
            </Box>
          </StyledPaper>
        </Box>
      </Box>

      {/* User's Products Section */}
      <Box sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Your Products
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ListIcon />}
            onClick={() => window.location.href = '/products'}
          >
            View All Products
          </Button>
        </Box>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              You have not uploaded any products yet.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start by creating your first product.
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.href = '/products/new'}
            >
              Create New Product
            </Button>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)' 
            }, 
            gap: 3 
          }}>
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Box>
        )}

        {/* Show "View All" button if there are more than 6 products */}
        {products.length > 6 && (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => window.location.href = '/products'}
            >
              View All {products.length} Products
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
} 