'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Rating, 
  CircularProgress, 
  Alert, 
  Button, 
  Pagination,
  Divider
} from '@mui/material';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
  offer: {
    chat: {
      product: {
        id: string;
        name: string;
      };
    };
  };
}

interface ReviewListProps {
  sellerId: string;
  refreshTrigger?: number;
}

export default function ReviewList({ sellerId, refreshTrigger = 0 }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });

  const fetchReviews = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/reviews?sellerId=${sellerId}&page=${page}&limit=5`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [sellerId, currentPage, refreshTrigger]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button onClick={() => fetchReviews(currentPage)} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  if (reviews.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No reviews yet. Be the first to review this seller!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Reviews ({stats.totalReviews})
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Rating
            value={stats.averageRating}
            readOnly
            precision={0.1}
            sx={{ color: '#ffc107' }}
          />
          <Typography variant="body2" color="text.secondary">
            {stats.averageRating.toFixed(1)} out of 5 stars
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {reviews.map((review, index) => (
          <React.Fragment key={review.id}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar
                  src={review.author.image || undefined}
                  sx={{ width: 40, height: 40, bgcolor: '#3ab2df' }}
                >
                  {review.author.name?.[0]?.toUpperCase() || review.author.username?.[0]?.toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {review.author.name || review.author.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Purchased: {review.offer.chat.product.name}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(review.createdAt)}
                    </Typography>
                  </Box>
                  
                  <Rating
                    value={review.rating}
                    readOnly
                    size="small"
                    sx={{ color: '#ffc107', mb: 1 }}
                  />
                  
                  {review.comment && (
                    <Typography variant="body2" color="text.primary">
                      {review.comment}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
            {index < reviews.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Box>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
} 