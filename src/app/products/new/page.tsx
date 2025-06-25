'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MultiImageUpload } from '@/components/MultiImageUpload';
import { Container, Paper, Typography, Box, TextField, Button, Alert, MenuItem, FormControl, InputLabel, Select } from '@mui/material';

interface ImageFile {
  id: string;
  url: string;
  file?: File;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function NewProduct() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formData, setFormData] = useState<{
    name: string;
    price: string | number;
    description: string;
    status: string;
    categoryId: string;
    images: ImageFile[];
  }>({
    name: '',
    price: '',
    description: '',
    status: 'active',
    categoryId: '',
    images: []
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...');
        const response = await fetch('/api/categories');
        console.log('Categories response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Categories data:', data);
          setCategories(data);
        } else {
          console.error('Failed to fetch categories, status:', response.status);
          const errorText = await response.text();
          console.error('Error response:', errorText);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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

    if (!formData.categoryId) {
      setError('Please select a category');
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
          categoryId: formData.categoryId,
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

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value as string
    }));
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
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Categories loaded: {categories.length}, Loading: {loadingCategories.toString()}
              {categories.length > 0 && <div>First category: {categories[0].name}</div>}
            </Alert>
          )}
          
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

          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleSelectChange}
              label="Category"
              disabled={loadingCategories}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
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