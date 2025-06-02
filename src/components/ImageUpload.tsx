import { useState, useRef, useEffect } from 'react';
import { Button, CircularProgress, Snackbar, Alert, Box } from '@mui/material';
import { AddPhotoAlternate, Delete } from '@mui/icons-material';
import Image from 'next/image';

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  onRemove: () => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Reset image error state when value changes
    setImageError(false);
  }, [value]);

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setImageError(false);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setNotification({
          open: true,
          message: 'Please upload an image file',
          severity: 'error',
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setNotification({
          open: true,
          message: 'File size must be less than 5MB',
          severity: 'error',
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const data = await response.json();
      onChange(data.imageUrl);
      setNotification({
        open: true,
        message: 'Image uploaded successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Upload error:', error);
      setNotification({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to upload image',
        severity: 'error',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    errorTimeoutRef.current = setTimeout(() => {
      console.error('Image load error:', e);
      setImageError(true);
      setNotification({
        open: true,
        message: 'Failed to load image',
        severity: 'error',
      });
    }, 1000); // Debounce error handling
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      {value && !imageError ? (
        <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
          {(() => {
            console.log('Rendering image with URL:', value);
            return null;
          })()}
          <Image
            src={value}
            alt="Product"
            fill
            style={{ objectFit: 'cover', borderRadius: '8px' }}
            onLoad={() => console.log('Image loaded successfully')}
            onError={handleImageError}
          />
          <Button
            onClick={onRemove}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              minWidth: 'auto',
              p: 1,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 1)',
              },
            }}
          >
            <Delete />
          </Button>
        </Box>
      ) : (
        <Button
          variant="outlined"
          onClick={handleClick}
          disabled={isUploading}
          sx={{
            width: '100%',
            height: 200,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            border: '2px dashed',
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
        >
          {isUploading ? (
            <CircularProgress size={32} />
          ) : (
            <>
              <AddPhotoAlternate sx={{ fontSize: 40 }} />
              <span>Click to upload image</span>
            </>
          )}
        </Button>
      )}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 