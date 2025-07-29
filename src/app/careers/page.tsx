'use client';

import { Container, Typography, Box, Paper, Card, CardContent, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const jobListings = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are looking for an experienced Frontend Developer to join our team and help build the next generation of our marketplace platform.',
    requirements: [
      '5+ years of experience with React and TypeScript',
      'Strong understanding of modern web technologies',
      'Experience with Material-UI and responsive design',
      'Excellent problem-solving skills'
    ]
  },
  {
    id: 2,
    title: 'Product Manager',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'Join our product team to help define and execute our product strategy, working closely with engineering and design teams.',
    requirements: [
      '3+ years of product management experience',
      'Strong analytical and problem-solving skills',
      'Experience with agile development methodologies',
      'Excellent communication and leadership abilities'
    ]
  },
  {
    id: 3,
    title: 'UX/UI Designer',
    location: 'Remote',
    type: 'Full-time',
    description: 'Help create beautiful and intuitive user experiences for our marketplace platform.',
    requirements: [
      '3+ years of UX/UI design experience',
      'Proficiency in Figma and other design tools',
      'Strong portfolio showcasing web and mobile designs',
      'Experience with user research and testing'
    ]
  }
];

const benefits = [
  'Competitive salary and equity',
  'Flexible work arrangements',
  'Health, dental, and vision insurance',
  '401(k) matching',
  'Professional development budget',
  'Unlimited PTO',
  'Remote work options',
  'Regular team events and activities'
];

export default function CareersPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Join Our Team
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Help us build the future of online marketplaces
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Our Culture
          </Typography>
          <Typography variant="body1" paragraph>
            At Dashtly, we&apos;re building more than just a marketplace - we&apos;re creating a community where people can buy and sell with confidence. We value innovation, collaboration, and a customer-first approach in everything we do.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Benefits & Perks
          </Typography>
          <List>
            {benefits.map((benefit, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircleOutlineIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={benefit} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Open Positions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {jobListings.map((job) => (
              <Card key={job.id}>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {job.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {job.location} • {job.type}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {job.description}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Requirements:
                  </Typography>
                  <List dense>
                    {job.requirements.map((requirement, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircleOutlineIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={requirement} />
                      </ListItem>
                    ))}
                  </List>
                  <Box sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary">
                      Apply Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1" paragraph>
            Don&apos;t see a position that matches your skills? We&apos;re always looking for talented individuals to join our team.
          </Typography>
          <Button variant="outlined" color="primary" size="large">
            Send Us Your Resume
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 