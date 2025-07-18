'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  TextField, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Avatar,
  Alert,
  CircularProgress
} from '@mui/material';

interface ReviewFormProps {
  open: boolean;
  onClose: () => void;
  offerId: string;
  productName: string;
  sellerName: string;
  sellerUsername: string;
  sellerImage?: string | null;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({
  open,
  onClose,
  offerId,
  productName,
  sellerName,
  sellerUsername,
  sellerImage,
  onReviewSubmitted
}: ReviewFormProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!rating) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim() || null,
          offerId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      onReviewSubmitted();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(null);
    setComment('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Review Your Purchase
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Product: {productName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Avatar
              src={sellerImage || undefined}
              sx={{ width: 40, height: 40, bgcolor: '#3ab2df' }}
            >
              {sellerName?.[0]?.toUpperCase() || sellerUsername?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {sellerName || sellerUsername}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                How was your experience with this seller?
              </Typography>
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Rating *
          </Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            size="large"
            sx={{ color: '#ffc107' }}
          />
        </Box>

        <TextField
          label="Review (optional)"
          multiline
          rows={4}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this seller..."
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !rating}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 