'use client';

import { Container, Typography, Box, Paper, Card, CardContent, CardMedia, Button } from '@mui/material';

const blogPosts = [
  {
    id: 1,
    title: 'Introducing Dashtly: A New Way to Buy and Sell',
    excerpt: 'Learn about our mission to revolutionize the marketplace experience with innovative features and user-friendly design.',
    image: '/images/blog/marketplace.jpg',
    date: 'March 15, 2024',
    category: 'Company News'
  },
  {
    id: 2,
    title: 'Top 10 Tips for Successful Selling',
    excerpt: 'Discover proven strategies to maximize your sales and build a successful business on our platform.',
    image: '/images/blog/selling-tips.jpg',
    date: 'March 10, 2024',
    category: 'Selling Guide'
  },
  {
    id: 3,
    title: 'How to Spot and Avoid Scams',
    excerpt: 'Stay safe while buying and selling online with our comprehensive guide to identifying and preventing common scams.',
    image: '/images/blog/safety.jpg',
    date: 'March 5, 2024',
    category: 'Safety'
  },
  {
    id: 4,
    title: 'The Future of E-commerce',
    excerpt: 'Explore the latest trends and innovations shaping the future of online marketplaces and digital commerce.',
    image: '/images/blog/future.jpg',
    date: 'February 28, 2024',
    category: 'Industry Insights'
  }
];

export default function BlogPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Blog
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Latest news, updates, and insights from Dashtly
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {blogPosts.map((post) => (
            <Card key={post.id} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
              <CardMedia
                component="img"
                sx={{ width: { xs: '100%', md: 300 }, height: { xs: 200, md: 'auto' } }}
                image={post.image}
                alt={post.title}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="overline" color="text.secondary">
                  {post.category} • {post.date}
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {post.excerpt}
                </Typography>
                <Button variant="text" color="primary">
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button variant="outlined" color="primary" size="large">
            Load More Posts
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 