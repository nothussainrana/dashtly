import { useState, useRef } from 'react';
import Image from 'next/image';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ImageFile {
  id: string;
  url: string;
  file?: File;
}

interface MultiImageUploadProps {
  value: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  maxImages?: number;
}

const UploadButton = styled(Button)(({ theme }) => ({
  width: 150,
  height: 150,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: 0,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
  '&:disabled': {
    opacity: 0.5,
  }
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 150,
  height: 150,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: theme.shadows[1],
}));

export function MultiImageUpload({ value, onChange, maxImages = 5 }: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
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
      const newImage: ImageFile = {
        id: Date.now().toString(),
        url: data.imageUrl,
        file,
      };

      onChange([...value, newImage]);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (value.length + files.length > maxImages) {
        setError(`You can only upload up to ${maxImages} images`);
        return;
      }
      handleUpload(files[0]);
    }
  };

  const handleRemove = (id: string) => {
    onChange(value.filter(img => img.id !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...value];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    onChange(newImages);
  };

  const handleMoveDown = (index: number) => {
    if (index === value.length - 1) return;
    const newImages = [...value];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    onChange(newImages);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 2,
          minHeight: 150
        }}
      >
        {value.map((image, index) => (
          <ImageContainer key={image.id}>
            <Image
              src={image.url}
              alt="Product"
              fill
              style={{ objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-between',
                p: 1,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              {index === 0 ? (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    bgcolor: 'primary.main',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  Main Image
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleMoveUp(index)}
                    sx={{ color: 'white' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 19V5M5 12l7-7 7 7"/>
                    </svg>
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleMoveDown(index)}
                    sx={{ color: 'white' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12l7 7 7-7"/>
                    </svg>
                  </IconButton>
                </Box>
              )}
              <IconButton
                size="small"
                onClick={() => handleRemove(image.id)}
                sx={{ color: 'white' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </IconButton>
            </Box>
          </ImageContainer>
        ))}
      </Box>

      {value.length < maxImages && (
        <UploadButton
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          variant="outlined"
        >
          {isUploading ? (
            <Typography variant="body2" color="text.secondary">
              Uploading...
            </Typography>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" color="text.secondary">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <Typography variant="body2" color="text.secondary">
                Add Image
              </Typography>
            </>
          )}
        </UploadButton>
      )}
    </Box>
  );
} 