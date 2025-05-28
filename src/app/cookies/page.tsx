'use client';

import { Container, Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';

export default function CookiePolicyPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Cookie Policy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Last updated: March 15, 2024
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            What Are Cookies?
          </Typography>
          <Typography variant="body1" paragraph>
            Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our site.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Types of Cookies We Use
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Essential Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Performance Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            These cookies collect information about how visitors use our website, such as which pages are visited most often and if users get error messages from web pages.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Functional Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            These cookies allow the website to remember choices you make and provide enhanced, more personal features.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Targeting/Advertising Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            These cookies are used to deliver advertisements more relevant to you and your interests.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Managing Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText 
                primary="Browser Settings"
                secondary="Most web browsers allow you to manage cookies through their settings preferences"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Third-party Tools"
                secondary="You can use third-party tools to manage cookies and tracking"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Opt-out Links"
                secondary="Some advertising networks provide opt-out mechanisms"
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about our Cookie Policy, please contact us at:
          </Typography>
          <Typography variant="body1">
            Email: privacy@dashtly.com
            <br />
            Address: 123 Main Street, City, State 12345
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
} 