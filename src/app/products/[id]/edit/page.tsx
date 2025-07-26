'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Container, Typography, Box, TextField, Button, Paper, Alert, MenuItem, FormControl, InputLabel, Select, Card, CardContent, IconButton, Divider, Chip } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { MultiImageUpload } from '../../../../components/MultiImageUpload';

interface ImageFile {
  id: string;
  url: string;
  order: number;
}

interface ProductVariant {
  id?: string;
  name: string;
  sku?: string;
  price?: number | null;
  stock: number;
  attributes: Record<string, any>;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formData, setFormData] = useState<{
    name: string;
    price: string | number;
    description: string;
    status: string;
    categoryId: string;
    images: ImageFile[];
    variants: ProductVariant[];
  }>({
    name: '',
    price: '',
    description: '',
    status: 'ACTIVE',
    categoryId: '',
    images: [],
    variants: []
  });

  // Fetch product data and categories on component mount
  useEffect(() => {
    if (!session?.user?.id || !params.id) return;
    
    const fetchData = async () => {
      try {
        // Fetch product
        const productRes = await fetch(`/api/products/${params.id}`);
        if (productRes.ok) {
          const product = await productRes.json();
          setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            status: product.status,
            categoryId: product.categoryId || '',
            images: product.images || [],
            variants: product.variants || []
          });
        } else {
          setError('Failed to load product');
        }

        // Fetch categories
        const categoriesRes = await fetch('/api/categories');
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
        setLoadingCategories(false);
      }
    };

    fetchData();
  }, [session, params.id]);

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
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
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
          })),
          variants: formData.variants.map(variant => ({
            name: variant.name,
            sku: variant.sku,
            price: variant.price ? Number(variant.price) : null,
            stock: variant.stock,
            attributes: variant.attributes,
            isActive: variant.isActive
          }))
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to update product');
      }

      router.push('/products');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update product');
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

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        name: '',
        sku: '',
        price: null,
        stock: 0,
        attributes: {},
        isActive: true
      }]
    }));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const addVariantAttribute = (variantIndex: number) => {
    const key = prompt('Enter attribute name (e.g., "color", "size"):');
    const value = prompt('Enter attribute value:');
    
    if (key && value) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.map((variant, i) => 
          i === variantIndex 
            ? { ...variant, attributes: { ...variant.attributes, [key]: value } }
            : variant
        )
      }));
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Edit Product
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
            multiline
            rows={4}
            fullWidth
          />
          
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleSelectChange}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleSelectChange}
              required
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
              <MenuItem value="DRAFT">Draft</MenuItem>
              <MenuItem value="SOLD">Sold</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography variant="h6" gutterBottom>
              Product Images
            </Typography>
            <MultiImageUpload
              value={formData.images}
              onChange={(images: any) => setFormData(prev => ({ ...prev, images }))}
            />
          </Box>

          {/* Variants Section */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Product Variants
              </Typography>
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                onClick={addVariant}
              >
                Add Variant
              </Button>
            </Box>

            {formData.variants.length === 0 ? (
              <Alert severity="info">
                No variants created. Add variants to manage different options like sizes, colors, or other variations.
              </Alert>
            ) : (
              formData.variants.map((variant, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Variant {index + 1}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => removeVariant(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        label="Variant Name"
                        value={variant.name}
                        onChange={(e) => updateVariant(index, 'name', e.target.value)}
                        fullWidth
                        size="small"
                      />

                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                          label="SKU (Optional)"
                          value={variant.sku || ''}
                          onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          label="Price (Optional - uses base price if empty)"
                          type="number"
                          value={variant.price || ''}
                          onChange={(e) => updateVariant(index, 'price', e.target.value ? Number(e.target.value) : null)}
                          size="small"
                          sx={{ flex: 1 }}
                          inputProps={{ step: "0.01", min: "0" }}
                        />
                        <TextField
                          label="Stock"
                          type="number"
                          value={variant.stock}
                          onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                          size="small"
                          sx={{ flex: 1 }}
                          inputProps={{ min: "0" }}
                        />
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Attributes
                          </Typography>
                          <Button
                            size="small"
                            onClick={() => addVariantAttribute(index)}
                          >
                            Add Attribute
                          </Button>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {Object.entries(variant.attributes).map(([key, value]) => (
                            <Chip
                              key={key}
                              label={`${key}: ${value}`}
                              onDelete={() => {
                                const newAttributes = { ...variant.attributes };
                                delete newAttributes[key];
                                updateVariant(index, 'attributes', newAttributes);
                              }}
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => router.push('/products')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
            >
              Update Product
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 