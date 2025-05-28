'use client';

import { Container, Typography, Box, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  {
    question: 'How do I create an account?',
    answer: 'To create an account, click on the "Sign up" button in the top right corner of the page. Fill in your details and follow the verification process to complete your registration.'
  },
  {
    question: 'How do I list an item for sale?',
    answer: 'To list an item, go to your dashboard and click on "Create Listing". Fill in the item details, add photos, set your price, and publish your listing.'
  },
  {
    question: 'How do I make a purchase?',
    answer: "Browse items on the marketplace, click on an item you're interested in, and use the \"Buy Now\" or \"Make Offer\" button to proceed with the purchase."
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept major credit cards, PayPal, and bank transfers. All payments are processed securely through our platform.'
  },
  {
    question: 'How do I contact a seller?',
    answer: 'You can contact a seller by clicking on the "Contact Seller" button on their listing page. This will open a messaging interface where you can communicate directly.'
  },
  {
    question: 'What is your return policy?',
    answer: 'Our return policy allows returns within 14 days of delivery. Items must be in their original condition. Please contact our support team to initiate a return.'
  }
];

export default function HelpPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Help Center
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Box sx={{ mt: 2 }}>
            {faqs.map((faq, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Need More Help?
          </Typography>
          <Typography variant="body1" paragraph>
            If you couldn't find the answer you're looking for, our support team is here to help. You can:
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" paragraph>
              • Contact our support team at support@dashtly.com
              <br />
              • Use our live chat feature (available during business hours)
              <br />
              • Check our detailed guides in the Resources section
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Resources
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" paragraph>
              • <a href="/guides/getting-started">Getting Started Guide</a>
              <br />
              • <a href="/guides/selling">Selling Guide</a>
              <br />
              • <a href="/guides/buying">Buying Guide</a>
              <br />
              • <a href="/guides/safety">Safety Tips</a>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 