import { Container, Typography, Box, Paper } from '@mui/material';

export const metadata = {
  title: 'Terms & Conditions - Dashtly',
  description: 'Terms and conditions for using Dashtly',
};

export default function TermsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Terms & Conditions
        </Typography>
        
        <Typography variant="body1" paragraph>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            2. Use License
          </Typography>
          <Typography variant="body1" paragraph>
            Permission is granted to temporarily download one copy of the materials (information or software) on Dashtly&apos;s website for personal, non-commercial transitory viewing only.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            3. User Account
          </Typography>
          <Typography variant="body1" paragraph>
            To access certain features of the website, you may be required to register for an account. You agree to provide accurate and complete information when creating your account.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            4. Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            Your use of Dashtly is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the site and informs users of our data collection practices.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            5. Disclaimer
          </Typography>
          <Typography variant="body1" paragraph>
            The materials on Dashtly&apos;s website are provided on an &apos;as is&apos; basis. Dashtly makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </Typography>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            We reserve the right to change these terms of service at any time. Users will be notified of any changes, and continued use of the service constitutes acceptance of the new terms.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
} 