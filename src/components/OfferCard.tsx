'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Check as CheckIcon, 
  Close as CloseIcon,
  Cancel as CancelIcon,
  RateReview as ReviewIcon
} from '@mui/icons-material';
import ReviewForm from './ReviewForm';

interface Offer {
  id: string;
  amount: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  message?: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
  receiver: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
  chat?: {
    product: {
      id: string;
      name: string;
    };
    seller: {
      id: string;
      name: string;
      username: string;
      image: string | null;
    };
  };
}

interface OfferCardProps {
  offer: Offer;
  currentUserId: string;
  onOfferUpdated: () => void;
}

export default function OfferCard({ offer, currentUserId, onOfferUpdated }: OfferCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [hasReview, setHasReview] = useState(false);
  const [checkingReview, setCheckingReview] = useState(false);

  const isReceiver = offer.receiver.id === currentUserId;
  const isSender = offer.sender.id === currentUserId;

  // Check if this offer has a review
  useEffect(() => {
    if (offer.status === 'ACCEPTED' && isSender) {
      checkForExistingReview();
    }
  }, [offer.id, offer.status, isSender]);

  const checkForExistingReview = async () => {
    setCheckingReview(true);
    try {
      const response = await fetch(`/api/reviews?sellerId=${offer.receiver.id}&limit=100`);
      if (response.ok) {
        const data = await response.json();
        const existingReview = data.reviews.find((review: any) => review.offerId === offer.id);
        setHasReview(!!existingReview);
      }
    } catch (err) {
      console.error('Error checking for existing review:', err);
    } finally {
      setCheckingReview(false);
    }
  };

  const handleUpdateOffer = async (status: 'ACCEPTED' | 'REJECTED' | 'CANCELLED') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/offers/${offer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update offer');
      }

      onOfferUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update offer');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'CANCELLED':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'ACCEPTED':
        return 'Accepted';
      case 'REJECTED':
        return 'Rejected';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={offer.sender.image || undefined} sx={{ mr: 1, width: 32, height: 32 }}>
            {offer.sender.name?.charAt(0) || offer.sender.username.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2">
              {offer.sender.name || offer.sender.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTime(offer.createdAt)}
            </Typography>
          </Box>
          <Chip 
            label={getStatusText(offer.status)} 
            color={getStatusColor(offer.status) as any}
            size="small"
          />
        </Box>

        <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
          {formatCurrency(offer.amount)}
        </Typography>

        {offer.message && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            "{offer.message}"
          </Typography>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {offer.status === 'PENDING' && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isReceiver && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<CheckIcon />}
                  onClick={() => handleUpdateOffer('ACCEPTED')}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={16} /> : 'Accept'}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<CloseIcon />}
                  onClick={() => handleUpdateOffer('REJECTED')}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={16} /> : 'Reject'}
                </Button>
              </>
            )}
            {isSender && (
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<CancelIcon />}
                onClick={() => handleUpdateOffer('CANCELLED')}
                disabled={loading}
              >
                {loading ? <CircularProgress size={16} /> : 'Cancel'}
              </Button>
            )}
          </Box>
        )}

        {/* Review Button for Accepted Offers */}
        {offer.status === 'ACCEPTED' && isSender && !hasReview && !checkingReview && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<ReviewIcon />}
              onClick={() => setReviewFormOpen(true)}
              fullWidth
            >
              Leave Review
            </Button>
          </Box>
        )}

        {offer.status === 'ACCEPTED' && isSender && hasReview && (
          <Box sx={{ mt: 2 }}>
            <Chip
              label="Review Submitted"
              color="success"
              size="small"
              variant="outlined"
            />
          </Box>
        )}

        {checkingReview && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <CircularProgress size={16} />
          </Box>
        )}
      </CardContent>
    </Card>
    
    {/* Review Form */}
    {offer.chat && (
      <ReviewForm
        open={reviewFormOpen}
        onClose={() => setReviewFormOpen(false)}
        offerId={offer.id}
        productName={offer.chat?.product.name || ''}
        sellerName={offer.chat?.seller.name || ''}
        sellerUsername={offer.chat?.seller.username || ''}
        sellerImage={offer.chat?.seller.image}
        onReviewSubmitted={() => {
          setHasReview(true);
          onOfferUpdated();
        }}
      />
    )}
    </>
  );
} 