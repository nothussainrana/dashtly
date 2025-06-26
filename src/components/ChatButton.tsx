'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Typography, Avatar, CircularProgress, Alert } from '@mui/material';
import { Chat as ChatIcon, Send as SendIcon } from '@mui/icons-material';

interface ChatButtonProps {
  productId: string;
  sellerName: string;
  sellerUsername: string;
  sellerImage?: string | null;
}

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

export default function ChatButton({ productId, sellerName, sellerUsername, sellerImage }: ChatButtonProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleOpenChat = async () => {
    if (!session) {
      setError('Please log in to chat');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create or get existing chat
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });

      if (!chatResponse.ok) {
        const errorData = await chatResponse.json();
        throw new Error(errorData.error || 'Failed to create chat');
      }

      const chat = await chatResponse.json();
      setChatId(chat.id);

      // Load messages
      const messagesResponse = await fetch(`/api/chat/${chat.id}/messages`);
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);
      }

      setOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open chat');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatId || !newMessage.trim() || sending) return;

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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  useEffect(() => {
    if (open && chatId) {
      // Poll for new messages every 3 seconds
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/chat/${chatId}/messages`);
          if (response.ok) {
            const messagesData = await response.json();
            setMessages(messagesData);
          }
        } catch (err) {
          console.error('Failed to poll for messages:', err);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [open, chatId]);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<ChatIcon />}
        onClick={handleOpenChat}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Opening...' : 'Chat with Seller'}
      </Button>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={sellerImage || undefined}
              sx={{ width: 40, height: 40, bgcolor: '#3ab2df' }}
            >
              {sellerName?.[0]?.toUpperCase() || sellerUsername?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {sellerName || sellerUsername}
              </Typography>
              {sellerName && (
                <Typography variant="body2" color="text.secondary">
                  @{sellerUsername}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          )}

          {/* Messages */}
          <Box sx={{ 
            height: 400, 
            overflowY: 'auto', 
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            {messages.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                Start a conversation with {sellerName || sellerUsername}
              </Typography>
            ) : (
              messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender.id === session?.user?.id ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: message.sender.id === session?.user?.id ? 'primary.main' : 'grey.100',
                      color: message.sender.id === session?.user?.id ? 'white' : 'text.primary',
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
          </Box>

          {/* Message Input */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
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
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Close
          </Button>
          {chatId && (
            <Button 
              variant="contained" 
              onClick={() => {
                setOpen(false);
                window.location.href = `/chat/${chatId}`;
              }}
            >
              View Full Chat
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
} 