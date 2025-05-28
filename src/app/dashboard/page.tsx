'use client';

import { useSession } from 'next-auth/react';
import { Container, Paper, Typography, Box, Avatar, Card, CardContent, CardActions, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

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
        <Typography variant="h5" gutterBottom>
          Your Products
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : products.length === 0 ? (
          <Typography>You have not uploaded any products yet.</Typography>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography color="text.secondary">{product.description}</Typography>
                    <Typography sx={{ mt: 1 }}>
                      Price: ${product.price}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Status: {product.status}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" disabled>Edit</Button>
                    <Button size="small" disabled>Delete</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
} 