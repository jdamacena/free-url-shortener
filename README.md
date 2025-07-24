# Free URL Shortener - Next.js

A modern, free URL shortener built with Next.js, TypeScript, and Tailwind CSS.

## API Documentation

### Shorten URL Endpoint

```http
POST /api/shorten
```

**Request Body:**
```json
{
  "url": "https://example.com/very-long-url"
}
```

**Response:**
```json
{
  "shortUrl": "https://yourdomain.com/s/abc123"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid URL or JSON payload
- `403 Forbidden`: Invalid origin
- `413 Payload Too Large`: Request exceeds 10kb
- `415 Unsupported Media Type`: Content-Type is not application/json

**Limitations:**
- Maximum URL length: 2048 characters
- Rate limiting: 10 requests per minute per IP
- Blocked domains: Some domains are blocked for security reasons

## Features

- **Free URL shortening** - No registration required
- **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- **TypeScript** - Fully typed for better development experience
- **Responsive design** - Works on all devices
- **Server-side rendering** - Optimized for performance and SEO

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── not-found.tsx   # 404 page
├── components/         # React components
│   ├── providers/      # Context providers
│   └── ui/            # shadcn/ui components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
└── assets/            # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- MongoDB database
- npm or yarn package manager
- Git

### Environment Setup

1. Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

The project uses the following configuration files:

- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.json` - ESLint configuration

## 📝 Migration Notes

This project has been migrated from Vite + React to Next.js for:
- Better SEO with server-side rendering
- Improved performance optimizations
- Built-in API routes capability
- Enhanced developer experience
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## 🌐 Deployment Guide

### Environment Variables

Before deploying, make sure to set up the following environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_APP_URL=your_app_url
```

### Deployment Options

1. **Vercel (Recommended)**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy to Vercel
   vercel
   ```

2. **Docker Deployment**
   ```bash
   # Build the Docker image
   docker build -t url-shortener .
   
   # Run the container
   docker run -p 3000:3000 url-shortener
   ```

3. **Traditional Hosting**
   ```bash
   # Build the application
   npm run build
   
   # Start the production server
   npm start
   ```

### Database Setup

1. Create a MongoDB database (Atlas recommended)
2. Set up network access and database user
3. Add the connection string to your environment variables

### Post-Deployment Steps

1. Set up your custom domain (if using)
2. Configure SSL certificates
3. Set up monitoring and analytics
4. Test the API endpoints
5. Monitor rate limiting and performance

### Scaling Considerations

- Use caching for frequently accessed URLs
- Consider implementing a CDN
- Monitor database performance
- Set up proper logging and error tracking

Yes, you can!