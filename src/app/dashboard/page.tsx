'use client';

import { useSession } from 'next-auth/react';
import { Container, Paper, Typography, Box, Avatar, Button, TextField, Alert, Divider, IconButton, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { List as ListIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import ProductCard from '@/components/ProductCard';
import { isAdmin } from '@/lib/roles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const SettingsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: 'fit-content',
}));

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  images: Array<{
    id: string;
    url: string;
    order: number;
  }>;
  user?: {
    id: string;
    name: string;
    username: string;
    role?: string;
  };
}

interface EditState {
  field: string | null;
  value: string;
  currentPassword: string;
  loading: boolean;
}

export default function DashboardPage() {
  const { data: session, update: updateSession } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [editState, setEditState] = useState<EditState>({
    field: null,
    value: '',
    currentPassword: '',
    loading: false,
  });

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    
    // Fetch both products and user data
    Promise.all([
      fetch('/api/products').then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      }),
      fetch(`/api/users/${session.user.id}`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch user data');
        return res.json();
      })
    ])
      .then(([productsData, userDataResponse]) => {
        // Ensure products is always an array
        setProducts(Array.isArray(productsData) ? productsData : []);
        setUserData(userDataResponse);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load data:', err);
        setProducts([]); // Ensure products is set to empty array on error
        setError('Failed to load data');
        setLoading(false);
      });
  }, [session]);

  const handleEditStart = (field: string, currentValue: string) => {
    setEditState({
      field,
      value: currentValue,
      currentPassword: '',
      loading: false,
    });
    setAlert(null);
  };

  const handleEditCancel = () => {
    setEditState({
      field: null,
      value: '',
      currentPassword: '',
      loading: false,
    });
    setAlert(null);
  };

  const handleEditSave = async () => {
    if (!editState.field || !session) return;

    setEditState(prev => ({ ...prev, loading: true }));
    
    try {
      const requestBody: any = {
        type: editState.field,
        newValue: editState.value,
      };

      // Add current password for password and email changes
      if (editState.field === 'password' || (editState.field === 'email' && editState.currentPassword)) {
        requestBody.currentPassword = editState.currentPassword;
      }

      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Update failed');
      }

      setAlert({ type: 'success', message: data.message });
      
      // Refresh user data to reflect changes
      try {
        const userResponse = await fetch(`/api/users/${session.user.id}`);
        const updatedUserData = await userResponse.json();
        setUserData(updatedUserData);
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
      
      // Update session if name was changed
      if (editState.field === 'name') {
        await updateSession();
      }

      handleEditCancel();
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setEditState(prev => ({ ...prev, loading: false }));
    }
  };

  if (!session) {
    return null;
  }

  const renderSettingField = (
    field: string,
    label: string,
    currentValue: string,
    type: string = 'text',
    requiresPassword: boolean = false
  ) => {
    const isEditing = editState.field === field;

    return (
      <SettingsSection>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            {label}
          </Typography>
          {isEditing ? (
            <Box sx={{ mt: 1 }}>
              <TextField
                fullWidth
                size="small"
                type={type}
                value={editState.value}
                onChange={(e) => setEditState(prev => ({ ...prev, value: e.target.value }))}
                placeholder={type === 'password' ? 'Enter new password' : `Enter new ${label.toLowerCase()}`}
                sx={{ mb: requiresPassword ? 1 : 0 }}
              />
              {requiresPassword && (
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  value={editState.currentPassword}
                  onChange={(e) => setEditState(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {field === 'password' ? '••••••••' : currentValue}
            </Typography>
          )}
        </Box>
        <Box sx={{ ml: 2 }}>
          {isEditing ? (
            <Box>
              <IconButton
                size="small"
                onClick={handleEditSave}
                disabled={editState.loading || !editState.value}
                color="primary"
              >
                <SaveIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleEditCancel}
                disabled={editState.loading}
              >
                <CancelIcon />
              </IconButton>
            </Box>
          ) : (
            <IconButton
              size="small"
              onClick={() => handleEditStart(field, currentValue)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          )}
        </Box>
      </SettingsSection>
    );
  };

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h4" component="h1">
                Welcome back, {session.user?.name}!
              </Typography>
              {userData?.role && isAdmin(userData.role) && (
                <Chip
                  label="ADMIN"
                  size="small"
                  sx={{
                    bgcolor: 'error.main',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                  }}
                />
              )}
            </Box>
            <Typography variant="body1" color="text.secondary">
              {session.user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>

            {/* Settings Section */}
      <StyledPaper elevation={2}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Account Settings
        </Typography>
        
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
            {alert.message}
          </Alert>
        )}

        {loading || !userData ? (
          <Typography>Loading settings...</Typography>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
            gap: 2 
          }}>
            {renderSettingField('name', 'Display Name', userData?.name || session.user?.name || '', 'text')}
            
            {renderSettingField('username', 'Username', userData?.username || '', 'text')}
            
            {renderSettingField('email', 'Email Address', userData?.email || session.user?.email || '', 'email', true)}
            
            {renderSettingField('password', 'Password', '', 'password', true)}
          </Box>
        )}

        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              Account Status
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your account is active and in good standing.
            </Typography>
          </Box>
          <Typography variant="body2" color="primary">
            Last login: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </StyledPaper>

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