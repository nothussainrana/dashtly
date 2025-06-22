# Global Product Search System Implementation

## Overview

This document describes the global search system implemented for the Dashtly product management application. The search system provides users with a powerful tool to search through ALL active products from ALL users, accessible from the main header.

## Features

### 1. Global Search in Header
- **Real-time search**: Search all active products by name or description
- **Case-insensitive**: Searches work regardless of case
- **Debounced input**: Reduces API calls while typing
- **Dropdown results**: Shows up to 5 results with product previews
- **Clear functionality**: Easy to clear search terms

### 2. Search Results Page
- **Full results display**: View all search results with pagination
- **Advanced filtering**: Filter by price range
- **Sorting options**: Sort by name, price, creation date, or update date
- **Sort order**: Ascending or descending order

### 3. Product Information Display
- **Product images**: Shows product thumbnail in search results
- **Price display**: Shows product price
- **Seller information**: Shows who created the product
- **Direct navigation**: Click to view full product details

### 4. User Interface
- **Responsive design**: Works on all screen sizes
- **Material-UI components**: Consistent with the app's design system
- **Loading states**: Clear feedback during search operations
- **Error handling**: User-friendly error messages

## Implementation Details

### API Endpoint

**Route**: `/api/search`

**Method**: GET

**Query Parameters**:
- `q`: Search query (text)
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `sortBy`: Sort field (name, price, createdAt, updatedAt)
- `sortOrder`: Sort direction (asc, desc)
- `page`: Page number for pagination
- `limit`: Number of items per page

**Response Format**:
```json
{
  "products": [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "description": "string",
      "status": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "images": [
        {
          "id": "string",
          "url": "string",
          "order": "number"
        }
      ],
      "user": {
        "id": "string",
        "name": "string",
        "username": "string"
      }
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalCount": "number",
    "hasNextPage": "boolean",
    "hasPrevPage": "boolean"
  }
}
```

### Components

#### 1. HeaderSearch Component
**Location**: `src/components/HeaderSearch.tsx`

**Features**:
- Search input with debouncing
- Dropdown results with product previews
- Loading states
- Clear functionality
- "View all results" link

#### 2. Header Component
**Location**: `src/app/components/Header.tsx`

**Features**:
- Integrated search bar in center
- Responsive layout
- Logo and navigation

#### 3. Search Results Page
**Location**: `src/app/search/page.tsx`

**Features**:
- Full search interface
- Product grid display
- Pagination controls
- Advanced filters
- Error handling

#### 4. ProductCard Component
**Location**: `src/components/ProductCard.tsx`

**Features**:
- Reusable product display card
- Image handling with fallback
- Status indicators with color coding
- Hover effects
- Click navigation

## Database Schema

The search system works with the existing Product model:

```prisma
model Product {
  id          String        @id @default(cuid())
  name        String
  price       Float
  description String        @db.Text
  status      String        @default("active")
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  userId      String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  images      ProductImage[]
}
```

## Search Logic

### Global Search
- Searches ALL active products from ALL users
- Only shows products with `status: 'active'`
- Searches both `name` and `description` fields
- Uses PostgreSQL's `ILIKE` for case-insensitive matching
- Supports partial word matching

### Price Filtering
- Uses PostgreSQL's `>=` and `<=` operators
- Handles null values appropriately
- Supports decimal precision

### Sorting
- Supports multiple sort fields
- Validates sort parameters
- Defaults to `createdAt` descending

## Usage Examples

### Header Search
Users can search directly from the header by typing in the search box. Results appear in a dropdown with:
- Product name and price
- Seller information
- Product thumbnail
- "View all results" link

### Search Results Page
```
GET /search?q=laptop
```

### Advanced Search
```
GET /api/search?q=laptop&minPrice=500&maxPrice=2000&sortBy=price&sortOrder=asc&page=1&limit=12
```

### Price Range Only
```
GET /api/search?minPrice=100&maxPrice=500
```

## User Experience Flow

1. **Header Search**: User types in search box in header
2. **Quick Results**: Dropdown shows up to 5 results with previews
3. **Product Click**: User can click on a result to view full product
4. **View All**: User can click "View all results" for full search page
5. **Advanced Search**: Full page with filters, sorting, and pagination

## Performance Considerations

1. **Database Indexing**: The search uses existing indexes
2. **Pagination**: Limits result sets to prevent memory issues
3. **Debouncing**: Reduces API calls during typing
4. **Caching**: Leverages Next.js caching mechanisms
5. **Limited Results**: Header search shows only 5 results for speed

## Security

1. **Public Access**: Search is available to all users (no authentication required)
2. **Active Products Only**: Only shows products with `status: 'active'`
3. **Input Validation**: All parameters are validated and sanitized
4. **SQL Injection Protection**: Uses Prisma ORM for safe queries

## Future Enhancements

1. **Full-text Search**: Implement PostgreSQL full-text search for better relevance
2. **Search History**: Track and display recent searches
3. **Saved Searches**: Allow users to save frequently used search criteria
4. **Search Analytics**: Track popular search terms and filters
5. **Auto-complete**: Implement search suggestions
6. **Advanced Filters**: Add category, tags, and date range filters
7. **Search by Seller**: Filter by specific sellers
8. **Location-based Search**: Add location filtering

## Troubleshooting

### Common Issues

1. **No Results**: Check if search terms match product names/descriptions
2. **Price Filter Not Working**: Ensure price values are numbers
3. **Sort Not Working**: Verify sort field names are correct
4. **Pagination Issues**: Check page numbers are within valid range

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` to see detailed search queries and responses.

## Dependencies

- **lodash**: For debouncing functionality
- **@mui/material**: UI components
- **@prisma/client**: Database queries

## Installation

The search system is already integrated into the application. No additional installation steps are required beyond the existing dependencies.

## Key Differences from Previous Implementation

- **Global Search**: Searches ALL users' products, not just the authenticated user's
- **Header Integration**: Search is prominently placed in the main header
- **Public Access**: No authentication required to search
- **Active Products Only**: Only shows products with active status
- **Seller Information**: Shows who created each product 