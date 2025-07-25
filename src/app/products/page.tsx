'use client';

import { useSession } from 'next-auth/react';
import { Container, Typography, Box, Button, Pagination, CircularProgress, Alert, Card, CardContent, CardActions, Menu, MenuItem, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Image from 'next/image';

interface ProductVariant {
  id: string;
  name: string;
  price: number | null;
  stock: number;
  attributes: any;
  isActive: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  status: string;
  totalStock: number;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
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

export default function ProductsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quickEditDialogOpen, setQuickEditDialogOpen] = useState(false);
  const [quickEditPrice, setQuickEditPrice] = useState('');

  useEffect(() => {
    if (!session) return;
    fetchProducts();
  }, [session]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, product: Product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleQuickStatusChange = async (productId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        await fetchProducts();
        handleMenuClose();
      } else {
        setError('Failed to update product status');
      }
    } catch (err) {
      setError('Failed to update product status');
    }
  };

  const handleQuickPriceEdit = () => {
    if (selectedProduct) {
      setQuickEditPrice(selectedProduct.price.toString());
      setQuickEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handlePriceUpdate = async () => {
    if (!selectedProduct) return;

    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parseFloat(quickEditPrice) })
      });

      if (res.ok) {
        await fetchProducts();
        setQuickEditDialogOpen(false);
        setQuickEditPrice('');
      } else {
        setError('Failed to update price');
      }
    } catch (err) {
      setError('Failed to update price');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await fetchProducts();
        setDeleteDialogOpen(false);
      } else {
        setError('Failed to delete product');
      }
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'SOLD': return 'error';
      case 'INACTIVE': return 'warning';
      case 'DRAFT': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'SOLD': return 'Sold';
      case 'INACTIVE': return 'Inactive';
      case 'DRAFT': return 'Draft';
      default: return status;
    }
  };

  if (!session) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            My Products
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your product listings
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          onClick={() => router.push('/products/new')}
        >
          Add New Product
        </Button>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Products Grid */}
      {!loading && (
        <Box>
          {products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Create your first product listing to get started
              </Typography>
              <Button variant="contained" onClick={() => router.push('/products/new')}>
                Create Product
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
              {products.map((product) => (
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Product Image */}
                  {product.images.length > 0 && (
                    <Box sx={{ position: 'relative', height: 200 }}>
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                  )}
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        {product.name}
                      </Typography>
                      <Chip 
                        label={getStatusLabel(product.status)} 
                        color={getStatusColor(product.status) as any}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description.length > 100 
                        ? `${product.description.substring(0, 100)}...` 
                        : product.description}
                    </Typography>

                    {product.variants && product.variants.length > 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''} 
                        • Stock: {product.totalStock}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      View
                    </Button>
                    
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => router.push(`/products/${product.id}/edit`)}
                    >
                      Edit
                    </Button>

                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, product)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleQuickPriceEdit}>
          Change Price
        </MenuItem>
        <MenuItem 
          onClick={() => handleQuickStatusChange(selectedProduct?.id || '', 'SOLD')}
          disabled={selectedProduct?.status === 'SOLD'}
        >
          Mark as Sold
        </MenuItem>
        <MenuItem 
          onClick={() => handleQuickStatusChange(selectedProduct?.id || '', selectedProduct?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
        >
          {selectedProduct?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        </MenuItem>
        <MenuItem 
          onClick={() => {
            setDeleteDialogOpen(true);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          Delete Product
        </MenuItem>
      </Menu>

      {/* Quick Price Edit Dialog */}
      <Dialog open={quickEditDialogOpen} onClose={() => setQuickEditDialogOpen(false)}>
        <DialogTitle>Update Price</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            value={quickEditPrice}
            onChange={(e) => setQuickEditPrice(e.target.value)}
            inputProps={{ step: "0.01", min: "0" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuickEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePriceUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 