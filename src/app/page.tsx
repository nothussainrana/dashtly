'use client';

import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';

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

export default function Home() {
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
    </Box>
  );
}
