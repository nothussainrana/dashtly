'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Container, Paper, Typography, Box, CircularProgress } from '@mui/material';

export default function SignOutPage() {
  useEffect(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 3 }}
          >
            Signing out...
          </Typography>
          <CircularProgress size={40} />
        </Paper>
      </Box>
    </Container>
  );
} 