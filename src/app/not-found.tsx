"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-8 bg-card border border-border rounded-lg shadow-md">
        <h1 className="text-5xl font-bold mb-4 gradient-text">404</h1>
        <p className="text-xl mb-6">Oops! Page not found</p>
        <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
