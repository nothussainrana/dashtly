'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Badge
} from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';

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
  messages: Array<{
    id: string;
    content: string;
    createdAt: string;
    isRead: boolean;
    receiverId: string;
  }>;
  updatedAt: string;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    fetchChats();
  }, [session, status, router]);

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chat');
      if (response.ok) {
        const data = await response.json();
        setChats(data);
      } else {
        throw new Error('Failed to fetch chats');
      }
    } catch (err) {
      setError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const getOtherUser = (chat: Chat) => {
    if (!session?.user?.id) return null;
    return chat.buyer.id === session.user.id ? chat.seller : chat.buyer;
  };

  const getLastMessage = (chat: Chat) => {
    return chat.messages[0] || null;
  };

  const getUnreadCount = (chat: Chat) => {
    if (!session?.user?.id) return 0;
    return chat.messages.filter(
      message => !message.isRead && message.receiverId === session.user.id
    ).length;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Messages
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {chats.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ChatIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No messages yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start a conversation by clicking "Chat with Seller" on any product
          </Typography>
        </Paper>
      ) : (
        <Card>
          <List sx={{ p: 0 }}>
            {chats.map((chat, index) => {
              const otherUser = getOtherUser(chat);
              const lastMessage = getLastMessage(chat);
              const unreadCount = getUnreadCount(chat);
              
              if (!otherUser) return null;

              return (
                <React.Fragment key={chat.id}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleChatClick(chat.id)}>
                      <ListItemAvatar>
                        <Badge badgeContent={unreadCount} color="error" max={99}>
                          <Avatar
                            src={otherUser.image || undefined}
                            sx={{ bgcolor: '#3ab2df' }}
                          >
                            {otherUser.name?.[0]?.toUpperCase() || otherUser.username?.[0]?.toUpperCase()}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography 
                              variant="subtitle1" 
                              component="span"
                              sx={{ 
                                fontWeight: unreadCount > 0 ? 'bold' : 'normal'
                              }}
                            >
                              {otherUser.name || otherUser.username}
                            </Typography>
                            {lastMessage && (
                              <Typography variant="caption" color="text.secondary">
                                {formatTime(lastMessage.createdAt)}
                              </Typography>
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {chat.product.name}
                            </Typography>
                            {lastMessage && (
                              <Typography 
                                variant="body2" 
                                color="text.primary" 
                                noWrap
                                sx={{ 
                                  fontWeight: unreadCount > 0 ? 'bold' : 'normal'
                                }}
                              >
                                {lastMessage.content}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <Box sx={{ ml: 1 }}>
                        <Chip
                          label={`$${chat.product.price}`}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </Box>
                    </ListItemButton>
                  </ListItem>
                  {index < chats.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        </Card>
      )}
    </Container>
  );
} 