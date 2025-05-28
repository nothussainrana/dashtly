'use client';

import { Container, Typography, Box, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

export default function AccessibilityPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Accessibility Statement
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Last updated: March 15, 2024
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Our Commitment
          </Typography>
          <Typography variant="body1" paragraph>
            Dashtly is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Conformance Status
          </Typography>
          <Typography variant="body1" paragraph>
            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
          </Typography>
          <Typography variant="body1" paragraph>
            Dashtly is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Accessibility Features
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Keyboard Navigation"
                secondary="Our website can be navigated using only a keyboard"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Screen Reader Support"
                secondary="Compatible with popular screen reading software"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Alt Text for Images"
                secondary="All meaningful images include alternative text descriptions"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Color Contrast"
                secondary="Text and background colors meet WCAG contrast requirements"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Resizable Text"
                secondary="Text can be resized up to 200% without loss of functionality"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Focus Indicators"
                secondary="Clear visual indicators for keyboard focus"
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Known Issues
          </Typography>
          <Typography variant="body1" paragraph>
            We are aware of some accessibility issues and are working to resolve them:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Some third-party content may not be fully accessible"
                secondary="We are working with vendors to improve accessibility"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Complex data tables may need additional navigation aids"
                secondary="Enhanced table navigation is in development"
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Feedback and Contact
          </Typography>
          <Typography variant="body1" paragraph>
            We welcome your feedback on the accessibility of Dashtly. Please let us know if you encounter accessibility barriers:
          </Typography>
          
          <Typography variant="body1" paragraph>
            <strong>Email:</strong> accessibility@dashtly.com
            <br />
            <strong>Phone:</strong> +1 (555) 123-4567
            <br />
            <strong>Address:</strong> 123 Main Street, City, State 12345
          </Typography>

          <Typography variant="body1" paragraph>
            We try to respond to accessibility feedback within 2 business days.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Technical Specifications
          </Typography>
          <Typography variant="body1" paragraph>
            Accessibility of Dashtly relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText primary="HTML" />
            </ListItem>
            <ListItem>
              <ListItemText primary="WAI-ARIA" />
            </ListItem>
            <ListItem>
              <ListItemText primary="CSS" />
            </ListItem>
            <ListItem>
              <ListItemText primary="JavaScript" />
            </ListItem>
          </List>

          <Typography variant="body1" paragraph>
            These technologies are relied upon for conformance with the accessibility standards used.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
} 