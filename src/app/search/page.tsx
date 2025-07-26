'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Container, Typography, Box, Button, Pagination, CircularProgress, Alert, Paper, FormControl, InputLabel, Select, MenuItem, Slider } from '@mui/material';
import { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';

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
  user: {
    id: string;
    name: string;
    username: string;
    role?: string;
  };
  category?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface SearchResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const initialCategoryId = searchParams.get('categoryId') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter states
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const updateURL = (newFilters: { query?: string; categoryId?: string; minPrice?: number | null; maxPrice?: number | null; sortBy?: string; sortOrder?: string; page?: number }) => {
    const params = new URLSearchParams();
    
    if (newFilters.query || initialQuery) {
      params.append('q', newFilters.query || initialQuery);
    }
    if (newFilters.categoryId || categoryId) {
      params.append('categoryId', newFilters.categoryId || categoryId);
    }
    if (newFilters.minPrice !== undefined && newFilters.minPrice !== null) {
      params.append('minPrice', newFilters.minPrice.toString());
    } else if (minPrice !== null) {
      params.append('minPrice', minPrice.toString());
    }
    if (newFilters.maxPrice !== undefined && newFilters.maxPrice !== null) {
      params.append('maxPrice', newFilters.maxPrice.toString());
    } else if (maxPrice !== null) {
      params.append('maxPrice', maxPrice.toString());
    }
    if (newFilters.sortBy || sortBy !== 'createdAt') {
      params.append('sortBy', newFilters.sortBy || sortBy);
    }
    if (newFilters.sortOrder || sortOrder !== 'desc') {
      params.append('sortOrder', newFilters.sortOrder || sortOrder);
    }
    if (newFilters.page && newFilters.page !== 1) {
      params.append('page', newFilters.page.toString());
    }

    const newURL = `/search${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newURL);
  };

  const performSearch = async (page: number = 1, updateUrl: boolean = true) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: initialQuery,
        page: page.toString(),
        limit: '12',
        sortBy,
        sortOrder,
      });

      if (categoryId) {
        params.append('categoryId', categoryId);
      }
      if (minPrice !== null) {
        params.append('minPrice', minPrice.toString());
      }
      if (maxPrice !== null) {
        params.append('maxPrice', maxPrice.toString());
      }

      // Update URL with current filters
      if (updateUrl) {
        updateURL({ page: page !== 1 ? page : undefined });
      }

      const response = await fetch(`/api/search?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to search products');
      }

      const data: SearchResponse = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (newCategoryId: string) => {
    setCategoryId(newCategoryId);
    performSearch(1);
  };

  const handleSortChange = (newSortBy: string, newSortOrder?: string) => {
    setSortBy(newSortBy);
    if (newSortOrder) {
      setSortOrder(newSortOrder);
    }
    performSearch(1);
  };

  const handlePriceRangeCommit = () => {
    const newMinPrice = priceRange[0] === 0 ? null : priceRange[0];
    const newMaxPrice = priceRange[1] === 1000 ? null : priceRange[1];
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
    performSearch(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    performSearch(page);
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialQuery || initialCategoryId) {
      performSearch(1, false); // Don't update URL on initial load
    } else {
      setLoading(false);
    }
  }, [initialQuery, initialCategoryId]);

  useEffect(() => {
    if (initialQuery || initialCategoryId) {
      performSearch(1);
    }
  }, [sortBy, sortOrder]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search Results
        </Typography>
        {(initialQuery || categoryId) && (
          <Typography variant="body1" color="text.secondary">
            {initialQuery && categoryId ? (
              <>Showing results for "{initialQuery}" in {categories.find(c => c.id === categoryId)?.name || 'category'}</>
            ) : initialQuery ? (
              <>Showing results for "{initialQuery}"</>
            ) : (
              <>Showing results in {categories.find(c => c.id === categoryId)?.name || 'category'}</>
            )}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Search by product name, description, seller username, or browse by category
        </Typography>
      </Box>

      {/* Filters */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId}
              label="Category"
              onChange={(e) => handleCategoryChange(e.target.value)}
              disabled={loadingCategories}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <MenuItem value="createdAt">Date Created</MenuItem>
              <MenuItem value="updatedAt">Date Updated</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price">Price</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Order</InputLabel>
            <Select
              value={sortOrder}
              label="Order"
              onChange={(e) => handleSortChange(sortBy, e.target.value)}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ minWidth: 300 }}>
            <Typography variant="body2" gutterBottom>
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </Typography>
            <Slider
              value={priceRange}
              onChange={(event, newValue) => setPriceRange(newValue as [number, number])}
              onChangeCommitted={handlePriceRangeCommit}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={10}
              marks={[
                { value: 0, label: '$0' },
                { value: 250, label: '$250' },
                { value: 500, label: '$500' },
                { value: 750, label: '$750' },
                { value: 1000, label: '$1000' },
              ]}
            />
          </Box>
        </Box>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Products Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search criteria.
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            }, 
            gap: 3,
            mb: 4
          }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Box>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
} 