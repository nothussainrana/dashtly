# Chat System Documentation

## Overview
The chat system allows buyers to communicate with sellers about products. Users must be logged in to use the chat functionality, and users cannot chat with themselves.

## Features

### 1. Chat Button on Product Pages
- Located on individual product pages
- Only visible to logged-in users
- Prevents users from chatting with themselves
- Creates a new chat or opens existing chat in a modal dialog

### 2. Chat List Page (`/chat`)
- Shows all conversations for the logged-in user
- Displays unread message counts with badges
- Shows last message preview and timestamp
- Lists both buyer and seller conversations
- Click to navigate to individual chat

### 3. Individual Chat Page (`/chat/[id]`)
- Full-screen chat interface
- Real-time message polling (every 3 seconds)
- Auto-scroll to latest messages
- Product information display
- Message timestamps
- Read status tracking

### 4. Message Features
- Real-time polling for new messages
- Message read status
- Timestamp display
- Support for multiline messages
- Enter key to send (Shift+Enter for new line)

## Database Schema

### Chat Model
```prisma
model Chat {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  buyerId   String
  buyer     User     @relation("ChatBuyer", fields: [buyerId], references: [id], onDelete: Cascade)
  sellerId  String
  seller    User     @relation("ChatSeller", fields: [sellerId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  messages  Message[]

  @@unique([productId, buyerId])
  @@index([buyerId])
  @@index([sellerId])
  @@index([productId])
}
```

### Message Model
```prisma
model Message {
  id          String   @id @default(cuid())
  chatId      String
  chat        Chat     @relation(fields: [chatId], references: [id], onDelete: Cascade)
  senderId    String
  sender      User     @relation("MessageSender", fields: [senderId], references: [id], onDelete: Cascade)
  receiverId  String
  receiver    User     @relation("MessageReceiver", fields: [receiverId], references: [id], onDelete: Cascade)
  content     String   @db.Text
  isRead      Boolean  @default(false)
  createdAt   DateTime @default(now())

  @@index([chatId])
  @@index([senderId])
  @@index([receiverId])
}
```

## API Endpoints

### 1. Create/Get Chat
- **POST** `/api/chat`
- Creates a new chat or returns existing chat
- Requires: `{ productId: string }`
- Returns: Chat object with product, buyer, and seller info

### 2. Get Chat List
- **GET** `/api/chat`
- Returns all chats for the logged-in user
- Includes last message and unread counts

### 3. Get Specific Chat
- **GET** `/api/chat/[id]`
- Returns chat details with product and user information
- Verifies user has access to the chat

### 4. Get Messages
- **GET** `/api/chat/[id]/messages`
- Returns all messages for a chat
- Automatically marks messages as read for the requesting user

### 5. Send Message
- **POST** `/api/chat/[id]/messages`
- Sends a new message
- Requires: `{ content: string }`
- Returns: Message object with sender/receiver info

## Security Features

1. **Authentication Required**: All chat endpoints require user authentication
2. **Access Control**: Users can only access chats they're part of
3. **Self-Chat Prevention**: Users cannot create chats with themselves
4. **Input Validation**: Message content is validated and trimmed

## Real-time Features

1. **Polling**: Messages are polled every 3 seconds when chat is open
2. **Auto-scroll**: New messages automatically scroll into view
3. **Read Status**: Messages are marked as read when viewed
4. **Unread Counts**: Badge indicators show unread message counts

## UI Components

### ChatButton
- Modal dialog for quick chat
- Real-time message updates
- Product context display

### Chat List
- Conversation overview
- Unread message badges
- Last message preview

### Chat Detail
- Full-screen chat interface
- Product information header
- Message input with send button

## Navigation

- **Header**: "Messages" button for logged-in users
- **Product Pages**: "Chat with Seller" button
- **Chat List**: Click conversations to open individual chats
- **Individual Chat**: Back button to return to chat list

## Error Handling

- Network errors show user-friendly messages
- Invalid chat access returns 401/404
- Failed message sends show error alerts
- Loading states for all async operations 