'use client';

import Link from "next/link";
import { Session } from "next-auth";
import { AppBar, Toolbar, Button, Typography, Box, Container, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
}));

interface HeaderProps {
  session: Session | null;
}

export default function Header({ session }: HeaderProps) {
  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Link 
            href="/" 
            style={{ 
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.5rem',
              color: '#3ab2df',
            }}
          >
            Dashtly
          </Link>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {session ? (
              <>
                <Button
                  component={Link}
                  href="/products/new"
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Create Product
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Link 
                    href="/dashboard" 
                    style={{
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      color: 'inherit',
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: '#3ab2df',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      {session.user?.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                      {session.user?.name}
                    </Typography>
                  </Link>
                </Box>
                <Button
                  component={Link}
                  href="/signout"
                  variant="outlined"
                  color="primary"
                  size="small"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  href="/login"
                  variant="text"
                  color="primary"
                  size="small"
                >
                  Log in
                </Button>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Sign up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
} 