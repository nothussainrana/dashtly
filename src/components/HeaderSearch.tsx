'use client';

import React, { useState, useCallback } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Popper,
  Paper,
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  VerifiedUser as VerifiedIcon,
} from '@mui/icons-material';
import { debounce } from 'lodash';
import Image from 'next/image';

interface SearchProduct {
  id: string;
  name: string;
  price: number;
  description: string;
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
}

interface SearchResponse {
  products: SearchProduct[];
  pagination: {
    totalCount: number;
  };
}

export default function HeaderSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [totalResults, setTotalResults] = useState(0);

  const open = Boolean(anchorEl);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setTotalResults(0);
        setAnchorEl(null);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
        if (response.ok) {
          const data: SearchResponse = await response.json();
          setResults(data.products);
          setTotalResults(data.pagination.totalCount);
          setAnchorEl(document.getElementById('search-input'));
        } else {
          setResults([]);
          setTotalResults(0);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && query.trim()) {
      event.preventDefault();
      navigateToSearchPage();
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setTotalResults(0);
    setAnchorEl(null);
  };

  const handleProductClick = (productId: string) => {
    window.location.href = `/products/${productId}`;
  };

  const handleViewAllClick = () => {
    if (query.trim()) {
      navigateToSearchPage();
    }
  };

  const handleSearchClick = () => {
    if (query.trim()) {
      navigateToSearchPage();
    }
  };

  const navigateToSearchPage = () => {
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 600 }}>
      <TextField
        id="search-input"
        placeholder="Search products by name, description, or username..."
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        size="small"
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
            borderRadius: 2,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {query && (
                <IconButton
                  size="small"
                  onClick={handleClear}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={handleSearchClick}
                edge="end"
                disabled={!query.trim()}
                sx={{ ml: 0.5 }}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Popper
        open={open && (results.length > 0 || loading)}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: 1400, width: anchorEl?.offsetWidth }}
      >
        <Paper
          elevation={8}
          sx={{
            mt: 1,
            maxHeight: 400,
            overflow: 'auto',
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : results.length > 0 ? (
            <>
              <List sx={{ p: 0 }}>
                {results.map((product, index) => (
                  <React.Fragment key={product.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => handleProductClick(product.id)}
                        sx={{ py: 1 }}
                      >
                        <ListItemAvatar>
                          {product.images && product.images.length > 0 ? (
                            <Avatar
                              sx={{ width: 40, height: 40 }}
                              variant="rounded"
                            >
                              <Image
                                src={product.images[0].url}
                                alt={product.name}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </Avatar>
                          ) : (
                            <Avatar
                              sx={{ width: 40, height: 40 }}
                              variant="rounded"
                            >
                              <Typography variant="caption">No img</Typography>
                            </Avatar>
                          )}
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {product.name}
                              </Typography>
                              {product.user.role === 'ADMIN' && (
                                <Chip
                                  icon={<VerifiedIcon />}
                                  label="CERTIFIED"
                                  size="small"
                                  sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '0.6rem',
                                    height: '20px',
                                    '& .MuiChip-icon': {
                                      color: 'white',
                                      fontSize: '0.7rem'
                                    }
                                  }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                ${product.price.toFixed(2)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                by {product.user.name || product.user.username}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                    {index < results.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              {totalResults > results.length && (
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: 'pointer', textAlign: 'center' }}
                    onClick={handleViewAllClick}
                  >
                    View all {totalResults} results
                  </Typography>
                </Box>
              )}
            </>
          ) : query && !loading ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No products found
              </Typography>
            </Box>
          ) : null}
        </Paper>
      </Popper>
    </Box>
  );
} 