# 🛍️ Dashtly

> A modern, full-featured e-commerce marketplace platform where users can buy and sell with confidence.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-99.1%25-blue)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-7.1.1-007FFF)](https://mui.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.14.0-2D3748)](https://www.prisma.io/)

## ✨ Features

### 🔐 Authentication & User Management
- **NextAuth.js Integration**: Secure authentication with Prisma adapter
- **User Profiles**: Complete user profile management with username and role-based access
- **Account Verification**: Email verification system powered by Brevo

### 🏪 Marketplace Functionality
- **Product Listings**: Create, edit, and manage product listings with multiple images
- **Advanced Search**: Global product search with real-time suggestions and filters
- **Category System**: 12+ pre-defined categories including Electronics, Clothing, Home & Garden, and more
- **Product Status Tracking**: Manage product states (active, sold, pending)
- **Offer Management**: Make and receive offers on products
- **Sales Analytics**: Track sold items and sales history

### 🔍 Search System
- **Global Header Search**: Real-time search accessible from anywhere
- **Smart Filtering**: Filter by price range, category, and more
- **Advanced Sorting**: Sort by name, price, creation date, or update date
- **Pagination**: Efficient browsing of large product catalogs
- **Debounced Search**: Optimized API calls for better performance

### 💬 Communication
- **Secure Messaging**: Built-in messaging system between buyers and sellers
- **Conversation Management**: Organized message threads with read/unread status
- **Real-time Updates**: Stay updated on offers and messages

### 📦 Product Management
- **Image Uploads**: AWS S3 integration for secure image storage
- **Drag & Drop**: Reorder product images with @hello-pangea/dnd
- **Product Dashboard**: Comprehensive seller dashboard for managing listings
- **Inventory Tracking**: Monitor active listings and sold items

### 🎨 User Interface
- **Material-UI Design**: Modern, responsive UI components
- **Mobile-First**: Fully responsive design for all devices
- **Dark/Light Themes**: Customizable theme support
- **Loading States**: Clear feedback and error handling throughout

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) 7
- **Styling**: Emotion (CSS-in-JS)
- **Fonts**: Roboto via Fontsource

### Backend
- **API Routes**: Next.js API Routes
- **Authentication**: NextAuth.js v4
- **Database ORM**: Prisma 5
- **File Storage**: AWS S3 with presigned URLs
- **Email Service**: Brevo (formerly Sendinblue)

### Security
- **Password Hashing**: bcrypt/bcryptjs
- **Session Management**: NextAuth with Prisma adapter
- **Secure File Uploads**: AWS S3 with signed requests

## 📋 Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm/bun
- PostgreSQL database (or other Prisma-supported database)
- AWS S3 bucket (for image storage)
- Brevo account (for email notifications)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nothussainrana/dashtly.git
   cd dashtly
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/dashtly"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # AWS S3
   AWS_ACCESS_KEY_ID="your-access-key"
   AWS_SECRET_ACCESS_KEY="your-secret-key"
   AWS_REGION="us-east-1"
   AWS_S3_BUCKET_NAME="your-bucket-name"
   
   # Brevo (Email)
   BREVO_API_KEY="your-brevo-api-key"
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed categories**
   ```bash
   npm run seed:categories
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
dashtly/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/         # API routes
│   │   ├── about/       # About page
│   │   ├── blog/        # Blog section
│   │   ├── careers/     # Careers page
│   │   ├── help/        # Help & FAQ
│   │   ├── products/    # Product listings
│   │   ├── search/      # Search results page
│   │   └── ...
│   ├── components/       # Reusable React components
│   └── lib/             # Utility functions and configurations
├── prisma/
│   └── schema.prisma    # Database schema
├── scripts/
│   └── seed-categories.js  # Category seeding script
├── public/              # Static assets
└── package.json
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed:categories` - Seed product categories

## 📚 Key Features Documentation

### Product Categories
The platform includes 12 comprehensive categories:
- Electronics
- Clothing
- Home & Garden
- Sports & Outdoors
- Books & Media
- Toys & Games
- Health & Beauty
- Automotive
- Jewelry & Watches
- Art & Collectibles
- Food & Beverages
- Other

See [CATEGORIES.md](CATEGORIES.md) for detailed category management documentation.

### Search System
Advanced global search with filtering, sorting, and pagination capabilities.

See [SEARCH_SYSTEM.md](SEARCH_SYSTEM.md) for detailed search implementation documentation.

## 🔒 Security Features

- Bcrypt password hashing
- Session-based authentication
- CSRF protection via NextAuth
- Secure file uploads with presigned URLs
- Role-based access control
- Email verification system

## 🌐 Deployment

### Vercel (Recommended)

The easiest way to deploy Dashtly is using the [Vercel Platform](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Configure environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nothussainrana/dashtly)

### Other Platforms

Dashtly can be deployed to any platform that supports Next.js applications:
- AWS Amplify
- Netlify
- Railway
- Render
- DigitalOcean App Platform

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Authors

- [@nothussainrana](https://github.com/nothussainrana)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Material-UI](https://mui.com/) - React UI Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js

## 📞 Support

For support, please visit our [Help Center](/help) or contact us through the platform.

---

**Built with ❤️ using Next.js and TypeScript**
