# CERTIFIED Badge Feature

This feature automatically displays a **CERTIFIED** badge on products uploaded by admin users throughout the application.

## How it Works

When a user with the `ADMIN` role uploads a product, all product displays across the application will show a prominent **CERTIFIED** badge with a verified icon.

## Where the Badge Appears

The CERTIFIED badge is displayed in the following locations:

### 1. Product Cards
- **Product listings** (`/products`)
- **Search results** (`/search`)
- **User profile pages** (`/users/[id]`)
- **Dashboard** (`/dashboard`)
- **Home page** product displays

### 2. Individual Product Pages
- **Product detail page** (`/products/[id]`) - Shows the badge next to the product title

### 3. Header Search Results
- **Search dropdown** - Shows the badge in the autocomplete results

## Badge Design

- **Icon**: Verified user icon (✓)
- **Text**: "CERTIFIED" in bold
- **Color**: Primary theme color (blue) with white text
- **Size**: Responsive - smaller on cards, larger on product pages

## Technical Implementation

### API Changes
The following API endpoints now include user role information:
- `/api/search` - Global product search
- `/api/products/[id]/public` - Individual product details
- `/api/products` - User's own products
- `/api/users/[id]/products` - User's public products

### Component Updates
- **ProductCard**: Badge appears in the header next to product name
- **Individual Product Page**: Badge appears next to the main product title
- **HeaderSearch**: Badge appears in dropdown search results

### User Role Check
The badge is displayed when `product.user.role === 'ADMIN'`

## Admin User Setup

To have products show the CERTIFIED badge, ensure the user uploading the product has admin privileges:

1. Set `ADMIN_EMAIL` in your environment variables
2. When that user registers or if they already exist, they'll automatically get the `ADMIN` role
3. All products they upload will display the CERTIFIED badge

## Example Usage

```jsx
// The badge automatically appears when the product's user is an admin
{product.user?.role === 'ADMIN' && (
  <Chip
    icon={<VerifiedIcon />}
    label="CERTIFIED"
    // ... styling
  />
)}
```

## Benefits

- **Trust Building**: Helps users identify products from verified admin accounts
- **Brand Authority**: Distinguishes official/admin products from regular user products
- **Visual Hierarchy**: Makes admin products more prominent in listings
- **Consistency**: Badge appears consistently across all product displays

## Notes

- The badge is purely visual and doesn't affect product functionality
- Only visible to end users - no special logic for admins viewing their own products
- Automatically applied based on user role - no manual configuration needed per product 