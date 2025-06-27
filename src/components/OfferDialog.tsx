'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';

interface OfferDialogProps {
  open: boolean;
  onClose: () => void;
  chatId: string;
  productName: string;
  originalPrice: number;
  onOfferCreated: () => void;
}

export default function OfferDialog({
  open,
  onClose,
  chatId,
  productName,
  originalPrice,
  onOfferCreated
}: OfferDialogProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chat/${chatId}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numAmount
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create offer');
      }

      onOfferCreated();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create offer');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setError(null);
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Make an Offer</DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Product: {productName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Listed Price: {formatCurrency(originalPrice)}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Offer Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          placeholder="0.00"
          disabled={loading}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !amount}
        >
          {loading ? <CircularProgress size={20} /> : 'Send Offer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 