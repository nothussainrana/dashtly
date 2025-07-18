'use client';

import { Box, Button, Container, Typography, Paper, Card, CardContent, CardActionArea } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const HeroSection = styled(Paper)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  marginBottom: theme.spacing(4),
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundImage: 'linear-gradient(45deg, #3ab2df 30%, #96efff 90%)',
  height: '80vh',
  display: 'flex',
  alignItems: 'center',
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6),
    paddingRight: 0,
  },
}));

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <HeroSection>
        <Container maxWidth="lg">
          <HeroContent>
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '2.5rem', md: '4rem' },
              }}
            >
              Buy and Sell with Confidence
            </Typography>
            <Typography
              variant="h5"
              color="inherit"
              paragraph
              sx={{ mb: 4, maxWidth: '600px' }}
            >
              Join our trusted marketplace where people connect to buy and sell. 
              Create listings, discover unique items, and trade safely with our secure platform.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                color="inherit"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                Start Selling
              </Button>
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                color="inherit"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Browse Items
              </Button>
            </Box>
          </HeroContent>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {[
            {
              title: 'Safe & Secure',
              description: 'Trade with confidence using our secure payment system and verified user profiles.',
            },
            {
              title: 'Easy to Use',
              description: 'Create listings in minutes, chat with buyers, and manage your sales all in one place.',
            },
            {
              title: 'Local & Global',
              description: 'Connect with buyers and sellers in your area or expand your reach worldwide.',
            },
          ].map((feature, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                {feature.title}
              </Typography>
              <Typography color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Browse by Category
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Find exactly what you're looking for by browsing our categories
          </Typography>
        </Box>
        
        {loadingCategories ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Loading categories...
            </Typography>
          </Box>
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
            {categories.map((category) => (
              <Card
                key={category.id}
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => theme.shadows[4],
                  },
                }}
              >
                <CardActionArea
                  component={Link}
                  href={`/search?categoryId=${category.id}`}
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: 3
                  }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {category.name}
                    </Typography>
                    {category.description && (
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
