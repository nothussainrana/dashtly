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

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  color: theme.palette.primary.main,
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.primary.dark,
  },
}));

interface HeaderProps {
  session: Session | null;
}

export default function Header({ session }: HeaderProps) {
  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Logo>Dashtly</Logo>
          </Link>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {session ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: 'primary.main',
                      fontSize: '0.875rem'
                    }}
                  >
                    {session.user?.name?.[0]?.toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    {session.user?.name}
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  href="/api/auth/signout"
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