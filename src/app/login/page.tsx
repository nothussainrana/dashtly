import { Metadata } from "next";
import LoginForm from "./components/LoginForm";
import { Container, Paper, Typography, Box } from "@mui/material";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 3 }}
          >
            Sign in to your account
          </Typography>
          <LoginForm />
        </Paper>
      </Box>
    </Container>
  );
} 