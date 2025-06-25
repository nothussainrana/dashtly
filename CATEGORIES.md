# Product Categories Management

This document explains how to manage product categories in the Dashtly application.

## Overview

Product categories are managed through a static JSON file located at `data/categories.json`. This approach provides several benefits:

- **Easy Management**: Categories can be updated by simply editing the JSON file
- **Version Control**: Category changes are tracked in git
- **Consistency**: All environments use the same category list
- **Performance**: No database queries needed for static category data

## File Structure

```
data/
  categories.json          # Static category definitions
src/
  lib/
    categories.ts          # Utility functions for reading categories
  app/
    api/
      categories/
        route.ts           # Database categories API
        static/
          route.ts         # Static categories API
scripts/
  seed-categories.js       # Script to seed categories to database
```

## Managing Categories

### Adding New Categories

1. **Edit the JSON file**: Open `data/categories.json` and add your new category:

```json
[
  {
    "name": "Electronics",
    "description": "Electronic devices and gadgets"
  },
  {
    "name": "Your New Category",
    "description": "Description of your new category"
  }
]
```

2. **Update the utility function**: If you're using the static categories in client-side code, also update the `getClientCategories()` function in `src/lib/categories.ts` to match.

3. **Seed the database**: Run the seeding script to add the new category to the database:

```bash
npm run seed:categories
```

### Removing Categories

1. **Edit the JSON file**: Remove the category from `data/categories.json`
2. **Update utility function**: Remove from `getClientCategories()` in `src/lib/categories.ts`
3. **Handle existing products**: Consider what to do with products that use the removed category

### Modifying Categories

1. **Edit the JSON file**: Update the category name or description in `data/categories.json`
2. **Update utility function**: Update `getClientCategories()` in `src/lib/categories.ts`
3. **Update database**: The database will need to be updated manually or through a migration

## API Endpoints

### `/api/categories` (GET)
Returns all categories from the database.

### `/api/categories` (POST)
Seeds the database with categories from the JSON file.

### `/api/categories/static` (GET)
Returns static categories from the JSON file (useful for client-side use).

## Current Categories

The application comes with the following default categories:

- **Electronics**: Electronic devices and gadgets
- **Clothing**: Apparel and fashion items
- **Home & Garden**: Home improvement and garden supplies
- **Sports & Outdoors**: Sports equipment and outdoor gear
- **Books & Media**: Books, movies, music, and other media
- **Toys & Games**: Toys, games, and entertainment items
- **Health & Beauty**: Health products and beauty supplies
- **Automotive**: Car parts and automotive accessories
- **Jewelry & Watches**: Jewelry, watches, and accessories
- **Art & Collectibles**: Artwork, antiques, and collectibles
- **Food & Beverages**: Food items and beverages
- **Other**: Miscellaneous items

## Usage Examples

### Server-side (API routes)
```typescript
import { getDefaultCategories } from '@/lib/categories';

const categories = getDefaultCategories();
```

### Client-side (React components)
```typescript
// Fetch from API
const response = await fetch('/api/categories/static');
const categories = await response.json();

// Or use the utility function (if available in client)
import { getClientCategories } from '@/lib/categories';
const categories = getClientCategories();
```

### Seeding Categories
```bash
# Seed categories to database
npm run seed:categories

# Or call the API endpoint
curl -X POST http://localhost:3000/api/categories
```

## Best Practices

1. **Keep categories simple**: Use broad, easily understood category names
2. **Maintain consistency**: Ensure the JSON file and utility function stay in sync
3. **Test changes**: Always test category changes in a development environment first
4. **Document changes**: Update this file when making significant category changes
5. **Consider existing data**: Think about how category changes affect existing products

## Troubleshooting

### Categories not appearing
1. Check that the JSON file exists and is valid JSON
2. Verify the database has been seeded: `npm run seed:categories`
3. Check the API endpoints are working: `/api/categories` and `/api/categories/static`

### Database sync issues
1. Clear existing categories: `DELETE FROM "Category";`
2. Re-seed: `npm run seed:categories`

### Client-side issues
1. Ensure the utility function matches the JSON file
2. Check that the static API endpoint is working
3. Verify the fetch calls are using the correct endpoint 