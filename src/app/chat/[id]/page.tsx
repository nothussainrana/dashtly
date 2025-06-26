'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Send as SendIcon, 
  ArrowBack as ArrowBackIcon,
  LocalOffer as OfferIcon
} from '@mui/icons-material';
import OfferDialog from '@/components/OfferDialog';
import OfferCard from '@/components/OfferCard';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
  receiver: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
}

interface Offer {
  id: string;
  amount: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  message?: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
  receiver: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
}

interface Chat {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: Array<{ url: string }>;
  };
  buyer: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
  seller: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
}

export default function ChatDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const chatId = params.id as string;
  
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    fetchChatData();
  }, [session, status, router, chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chatId) {
      // Poll for new messages and offers every 3 seconds
      const interval = setInterval(async () => {
        try {
          const [messagesResponse, offersResponse] = await Promise.all([
            fetch(`/api/chat/${chatId}/messages`),
            fetch(`/api/chat/${chatId}/offers`)
          ]);
          
          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json();
            setMessages(messagesData);
          }
          
          if (offersResponse.ok) {
            const offersData = await offersResponse.json();
            setOffers(offersData);
          }
        } catch (err) {
          console.error('Failed to poll for updates:', err);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatData = async () => {
    try {
      // Fetch chat details
      const chatResponse = await fetch(`/api/chat/${chatId}`);
      if (!chatResponse.ok) {
        throw new Error('Chat not found');
      }
      const chatData = await chatResponse.json();
      setChat(chatData);

      // Fetch messages and offers
      const [messagesResponse, offersResponse] = await Promise.all([
        fetch(`/api/chat/${chatId}/messages`),
        fetch(`/api/chat/${chatId}/offers`)
      ]);
      
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);
      }
      
      if (offersResponse.ok) {
        const offersData = await offersResponse.json();
        setOffers(offersData);
      }
    } catch (err) {
      setError('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await fetch(`/api/chat/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage })
      });

      if (response.ok) {
        const message = await response.json();
        setMessages(prev => [...prev, message]);
        setNewMessage('');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherUser = () => {
    if (!chat || !session?.user?.id) return null;
    return chat.buyer.id === session.user.id ? chat.seller : chat.buyer;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleOfferCreated = async () => {
    // Refresh offers after creating one
    try {
      const response = await fetch(`/api/chat/${chatId}/offers`);
      if (response.ok) {
        const offersData = await response.json();
        setOffers(offersData);
      }
    } catch (err) {
      console.error('Failed to refresh offers:', err);
    }
  };

  const handleOfferUpdated = async () => {
    // Refresh offers after updating one
    try {
      const response = await fetch(`/api/chat/${chatId}/offers`);
      if (response.ok) {
        const offersData = await response.json();
        setOffers(offersData);
      }
    } catch (err) {
      console.error('Failed to refresh offers:', err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (status === 'loading' || loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  if (!chat) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Chat not found</Alert>
      </Container>
    );
  }

  const otherUser = getOtherUser();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => router.push('/chat')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={otherUser?.image || undefined}
            sx={{ width: 48, height: 48, bgcolor: '#3ab2df' }}
          >
            {otherUser?.name?.[0]?.toUpperCase() || otherUser?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6">
              {otherUser?.name || otherUser?.username}
            </Typography>
            {otherUser?.name && (
              <Typography variant="body2" color="text.secondary">
                @{otherUser.username}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Product Info */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {chat.product.images[0] && (
            <Box
              component="img"
              src={chat.product.images[0].url}
              alt={chat.product.name}
              sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
            />
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {chat.product.name}
            </Typography>
            <Chip label={`$${chat.product.price}`} size="small" color="primary" />
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Chat Tabs */}
      <Paper sx={{ height: 600, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Messages" />
            <Tab label={`Offers (${offers.length})`} />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {tabValue === 0 && (
          <>
            {/* Messages */}
            <Box sx={{ 
              flex: 1, 
              overflowY: 'auto', 
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              {messages.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  Start a conversation with {otherUser?.name || otherUser?.username}
                </Typography>
              ) : (
                messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender.id === session.user.id ? 'flex-end' : 'flex-start',
                      mb: 1
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '70%',
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: message.sender.id === session.user.id ? 'primary.main' : 'grey.100',
                        color: message.sender.id === session.user.id ? 'white' : 'text.primary',
                        wordBreak: 'break-word'
                      }}
                    >
                      <Typography variant="body2">
                        {message.content}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          opacity: 0.7,
                          display: 'block',
                          mt: 0.5
                        }}
                      >
                        {formatTime(message.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message Input */}
            <Divider />
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => setOfferDialogOpen(true)}
                  startIcon={<OfferIcon />}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  Make Offer
                </Button>
                <TextField
                  fullWidth
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={sending}
                  multiline
                  maxRows={3}
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  {sending ? <CircularProgress size={20} /> : <SendIcon />}
                </Button>
              </Box>
            </Box>
          </>
        )}

        {tabValue === 1 && (
          <>
            {/* Offers */}
            <Box sx={{ 
              flex: 1, 
              overflowY: 'auto', 
              p: 2
            }}>
              {offers.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  No offers yet. Be the first to make an offer!
                </Typography>
              ) : (
                offers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    currentUserId={session.user.id}
                    onOfferUpdated={handleOfferUpdated}
                  />
                ))
              )}
            </Box>

            {/* Offer Button */}
            <Divider />
            <Box sx={{ p: 2 }}>
              <Button
                variant="contained"
                onClick={() => setOfferDialogOpen(true)}
                startIcon={<OfferIcon />}
                fullWidth
              >
                Make New Offer
              </Button>
            </Box>
          </>
        )}
      </Paper>

      {/* Offer Dialog */}
      <OfferDialog
        open={offerDialogOpen}
        onClose={() => setOfferDialogOpen(false)}
        chatId={chatId}
        productName={chat.product.name}
        originalPrice={chat.product.price}
        onOfferCreated={handleOfferCreated}
      />
    </Container>
  );
} 