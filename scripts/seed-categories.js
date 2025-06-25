const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Read default categories from JSON file
function getDefaultCategories() {
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

async function seedCategories() {
  try {
    console.log('Starting category seeding...');

    // Check if categories already exist
    const existingCategories = await prisma.category.count();
    
    if (existingCategories > 0) {
      console.log('Categories already exist, skipping seeding.');
      return;
    }

    // Get default categories from JSON file
    const defaultCategories = getDefaultCategories();
    console.log(`Found ${defaultCategories.length} categories in JSON file`);

    // Create default categories
    const createdCategories = await prisma.category.createMany({
      data: defaultCategories,
      skipDuplicates: true,
    });

    console.log(`Successfully created ${createdCategories.count} categories`);
    
    // List all categories
    const allCategories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    
    console.log('Available categories:');
    allCategories.forEach(category => {
      console.log(`- ${category.name}: ${category.description}`);
    });

  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories(); 