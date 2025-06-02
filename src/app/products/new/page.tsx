'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MultiImageUpload } from '@/components/MultiImageUpload';
import { Container, Paper, Typography, Box, TextField, Button, Alert, MenuItem } from '@mui/material';

interface ImageFile {
  id: string;
  url: string;
  file?: File;
}

export default function NewProduct() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    price: string | number;
    description: string;
    status: string;
    images: ImageFile[];
  }>({
    name: '',
    price: '',
    description: '',
    status: 'active',
    images: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setError('Please enter a valid price');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    if (formData.images.length === 0) {
      setError('At least one image is required');
      return;
    }
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          price: Number(formData.price),
          description: formData.description.trim(),
          status: formData.status,
          images: formData.images.map((img, index) => ({
            url: img.url,
            order: index
          }))
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to create product');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create product');
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      const numValue = value === '' ? '' : Number(value);
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Create New Product
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <TextField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleTextChange}
            required
            fullWidth
          />
          
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleTextChange}
            required
            fullWidth
            inputProps={{
              step: "0.01",
              min: "0",
              inputMode: "decimal"
            }}
          />
          
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleTextChange}
            required
            fullWidth
            multiline
            rows={4}
          />
          
          <TextField
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleTextChange}
            fullWidth
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="sold">Sold</MenuItem>
          </TextField>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Product Images
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Upload up to 5 images. The first image will be used as the main product image.
            </Typography>
            <MultiImageUpload
              value={formData.images}
              onChange={(images) => {
                setFormData(prev => ({ ...prev, images }));
              }}
              maxImages={5}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Create Product
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              fullWidth
              size="large"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 