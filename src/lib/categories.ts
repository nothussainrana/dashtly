import fs from 'fs';
import path from 'path';

export interface Category {
  name: string;
  description: string;
}

// Read default categories from JSON file
export function getDefaultCategories(): Category[] {
  try {
    const categoriesPath = path.join(process.cwd(), 'data', 'categories.json');
    const categoriesData = fs.readFileSync(categoriesPath, 'utf8');
    return JSON.parse(categoriesData);
  } catch (error) {
    console.error('Error reading categories.json:', error);
    // Fallback to basic categories if file can't be read
    return [
      { name: 'Electronics', description: 'Electronic devices and gadgets' },
      { name: 'Clothing', description: 'Apparel and fashion items' },
      { name: 'Other', description: 'Miscellaneous items' },
    ];
  }
}

// Get categories for client-side use (without file system access)
export function getClientCategories(): Category[] {
  // This would typically be fetched from an API endpoint
  // For now, we'll return a static list that matches the JSON file
  return [
    { name: 'Electronics', description: 'Electronic devices and gadgets' },
    { name: 'Clothing', description: 'Apparel and fashion items' },
    { name: 'Home & Garden', description: 'Home improvement and garden supplies' },
    { name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear' },
    { name: 'Books & Media', description: 'Books, movies, music, and other media' },
    { name: 'Toys & Games', description: 'Toys, games, and entertainment items' },
    { name: 'Health & Beauty', description: 'Health products and beauty supplies' },
    { name: 'Automotive', description: 'Car parts and automotive accessories' },
    { name: 'Jewelry & Watches', description: 'Jewelry, watches, and accessories' },
    { name: 'Art & Collectibles', description: 'Artwork, antiques, and collectibles' },
    { name: 'Food & Beverages', description: 'Food items and beverages' },
    { name: 'Other', description: 'Miscellaneous items' },
  ];
} 