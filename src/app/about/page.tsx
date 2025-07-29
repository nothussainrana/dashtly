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
            We&apos;re passionate about creating a trusted marketplace where buyers and sellers can connect with confidence.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Our platform combines the simplicity of peer-to-peer trading with advanced features like secure messaging, offer management, and seller verification. Whether you&apos;re looking to declutter your home or find unique items, Dashtly makes the process seamless and secure.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Founded on the principles of trust, transparency, and community, we&apos;re building more than just a marketplace – we&apos;re creating a community where great deals and lasting connections happen every day.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Join thousands of users who&apos;ve already discovered the Dashtly difference.
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
            • User Experience: We&apos;re committed to providing an intuitive and enjoyable platform.
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
            We&apos;re always looking for talented individuals who share our passion for creating a better marketplace. If you&apos;re interested in joining our team, please visit our careers page or contact us at careers@dashtly.com.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            Have questions or feedback? We&apos;d love to hear from you. Reach out to us at contact@dashtly.com or visit our contact page for more ways to get in touch.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
} 