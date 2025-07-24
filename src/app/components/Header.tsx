'use client';

import Link from "next/link";
import { Session } from "next-auth";
import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Box, 
  Container, 
  Avatar, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Chat as ChatIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import HeaderSearch from '@/components/HeaderSearch';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    backgroundColor: theme.palette.background.paper,
  },
}));

interface HeaderProps {
  session: Session | null;
}

export default function Header({ session }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const MobileMenu = () => (
    <Box sx={{ width: 280 }} role="presentation">
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="h6" sx={{ color: '#3ab2df', fontWeight: 700 }}>
          Dashtly
        </Typography>
        <IconButton onClick={handleDrawerClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List>
        {session ? (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/dashboard" onClick={handleDrawerClose}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Dashboard" 
                  secondary={session.user?.name}
                />
                <Avatar 
                  sx={{ 
                    width: 28, 
                    height: 28, 
                    bgcolor: '#3ab2df',
                    fontSize: '0.75rem',
                    ml: 1
                  }}
                >
                  {session.user?.name?.[0]?.toUpperCase()}
                </Avatar>
              </ListItemButton>
            </ListItem>
            
            <Divider sx={{ my: 1 }} />
            
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/products/new" onClick={handleDrawerClose}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Create Product" />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/chat" onClick={handleDrawerClose}>
                <ListItemIcon>
                  <ChatIcon />
                </ListItemIcon>
                <ListItemText primary="Messages" />
              </ListItemButton>
            </ListItem>
            
            <Divider sx={{ my: 1 }} />
            
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/signout" onClick={handleDrawerClose}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Sign out" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/login" onClick={handleDrawerClose}>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Log in" />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/register" onClick={handleDrawerClose}>
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Sign up" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="sticky">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', gap: isMobile ? 1 : 2 }}>
            {/* Logo */}
            <Link 
              href="/" 
              style={{ 
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: isMobile ? '1.25rem' : '1.5rem',
                color: '#3ab2df',
                flexShrink: 0,
              }}
            >
              Dashtly
            </Link>
            
            {/* Search Bar - Maximum width possible */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              justifyContent: 'stretch', 
              px: isMobile ? 0.5 : 1,
              mx: isMobile ? 1 : 2
            }}>
              <Box sx={{ width: '100%' }}>
                <HeaderSearch />
              </Box>
            </Box>
            
            {/* Mobile Menu Button */}
            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                sx={{ flexShrink: 0 }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              /* Desktop Navigation */
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
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
                    <Button
                      component={Link}
                      href="/chat"
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<ChatIcon />}
                    >
                      Messages
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
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <MobileDrawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <MobileMenu />
      </MobileDrawer>
    </>
  );
} 