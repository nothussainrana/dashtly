import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Log the available models
console.log('Available models:', Object.getOwnPropertyNames(prisma).filter(prop => !prop.startsWith('$'))); 