'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Paper,
  Button,
  Chip,
  Collapse,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { debounce } from 'lodash';

export interface SearchFilters {
  query: string;
  minPrice: number | null;
  maxPrice: number | null;
  status: string;
  sortBy: string;
  sortOrder: string;
}

interface ProductSearchProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
  totalResults?: number;
  showFilters?: boolean;
  showSort?: boolean;
}

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'updatedAt', label: 'Date Updated' },
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'sold', label: 'Sold' },
];

export default function ProductSearch({
  onSearch,
  loading = false,
  totalResults,
  showFilters = true,
  showSort = true,
}: ProductSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    minPrice: null,
    maxPrice: null,
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchFilters: SearchFilters) => {
      onSearch(searchFilters);
    }, 300),
    [onSearch]
  );

  // Handle search input changes
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, query: event.target.value };
    setFilters(newFilters);
    debouncedSearch(newFilters);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  // Handle price range change
  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setPriceRange([min, max]);
  };

  const handlePriceRangeCommit = () => {
    const newFilters = {
      ...filters,
      minPrice: priceRange[0] === 0 ? null : priceRange[0],
      maxPrice: priceRange[1] === 1000 ? null : priceRange[1],
    };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      minPrice: null,
      maxPrice: null,
      status: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    setFilters(clearedFilters);
    setPriceRange([0, 1000]);
    onSearch(clearedFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = filters.query || filters.minPrice || filters.maxPrice || filters.status;

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      {/* Search Bar */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search products by name or description..."
          value={filters.query}
          onChange={handleQueryChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: filters.query && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => handleFilterChange('query', '')}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          disabled={loading}
        />
      </Box>

      {/* Results and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {totalResults !== undefined && (
            <Typography variant="body2" color="text.secondary">
              {totalResults} result{totalResults !== 1 ? 's' : ''}
            </Typography>
          )}
          {hasActiveFilters && (
            <Chip
              label="Filters Active"
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {showFilters && (
            <Button
              size="small"
              startIcon={<FilterIcon />}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              variant={showAdvancedFilters ? 'contained' : 'outlined'}
            >
              Filters
            </Button>
          )}
          {hasActiveFilters && (
            <Button
              size="small"
              onClick={handleClearFilters}
              variant="outlined"
              color="error"
            >
              Clear All
            </Button>
          )}
        </Box>
      </Box>

      {/* Advanced Filters */}
      {showFilters && (
        <Collapse in={showAdvancedFilters}>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Status Filter */}
            <Box sx={{ minWidth: 200, flex: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Sort Options */}
            {showSort && (
              <>
                <Box sx={{ minWidth: 200, flex: 1 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={filters.sortBy}
                      label="Sort By"
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      {SORT_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ minWidth: 200, flex: 1 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Order</InputLabel>
                    <Select
                      value={filters.sortOrder}
                      label="Order"
                      onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    >
                      <MenuItem value="asc">Ascending</MenuItem>
                      <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </>
            )}
          </Box>

          {/* Price Range */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" gutterBottom>
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
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
        </Collapse>
      )}
    </Paper>
  );
} 