"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TextField,
  Button,
  Alert,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Container,
} from "@mui/material";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push('/register');
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          verificationCode,
        }),
      });

      if (!response.ok) {
        let errorMsg = "";
        try {
          // Try to parse error as JSON
          const data = await response.json();
          errorMsg = data.message || JSON.stringify(data);
        } catch {
          // Fallback to plain text
          errorMsg = await response.text();
        }
        throw new Error(errorMsg || "Unknown error");
      }

      const result = await response.json();
      setSuccess(result.message);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (!response.ok) {
        const data = await response.text();
        throw new Error(data);
      }

      const result = await response.json();
      setSuccess(result.message);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to resend code");
      }
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Verify Your Email
          </Typography>
          
          <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 3 }}>
            We've sent a 6-digit verification code to{' '}
            <Typography component="span" fontWeight="bold">
              {email}
            </Typography>
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="verificationCode"
              label="Verification Code"
              name="verificationCode"
              value={verificationCode}
              onChange={(e) => {
                // Only allow digits and limit to 6 characters
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setVerificationCode(value);
              }}
              inputProps={{
                maxLength: 6,
                style: { textAlign: 'center', fontSize: '24px', letterSpacing: '0.5em' }
              }}
              helperText="Enter the 6-digit code from your email"
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || verificationCode.length !== 6}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Verify Email"
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Didn't receive the code?
              </Typography>
              
              <Button
                variant="text"
                onClick={handleResendCode}
                disabled={isResending}
                sx={{ mb: 2 }}
              >
                {isResending ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Resending...
                  </>
                ) : (
                  "Resend Code"
                )}
              </Button>
            </Box>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Link href="/register" style={{ textDecoration: "none" }}>
                Back to Registration
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 