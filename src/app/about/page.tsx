import { Container, Typography, Box, Paper } from '@mui/material';

export const metadata = {
  title: 'About Us - Dashtly',
  description: 'Learn more about Dashtly and our mission',
};

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About Dashtly
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph>
            At Dashtly, we're building a trusted marketplace where people can buy and sell with confidence. Our platform is designed to make the process of buying and selling simple, secure, and enjoyable for everyone.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            What We Do
          </Typography>
          <Typography variant="body1" paragraph>
            We provide a platform that connects buyers and sellers, offering tools and features that make the trading process smooth and secure. Our marketplace is designed to be user-friendly while maintaining high standards of safety and reliability.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Our Values
          </Typography>
          <Typography variant="body1" paragraph>
            • Trust and Safety: We prioritize the security and trust of our community members.
            <br />
            • User Experience: We're committed to providing an intuitive and enjoyable platform.
            <br />
            • Innovation: We continuously improve our services based on user feedback and market needs.
            <br />
            • Community: We foster a supportive and respectful community of buyers and sellers.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Join Our Team
          </Typography>
          <Typography variant="body1" paragraph>
            We're always looking for talented individuals who share our passion for creating a better marketplace. If you're interested in joining our team, please visit our careers page or contact us at careers@dashtly.com.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            Have questions or feedback? We'd love to hear from you. Reach out to us at contact@dashtly.com or visit our contact page for more ways to get in touch.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
} 