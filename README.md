# Free URL Shortener - Next.js

A modern, free URL shortener built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

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

1. **Clone the repository**
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

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/330174e1-d0e9-4653-b33a-bf58222588a0) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
